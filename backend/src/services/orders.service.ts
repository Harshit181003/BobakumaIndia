import type { PoolConnection } from "mysql2/promise";
import { pool } from "../db.js";
import { computeDiscountPaise, countCouponRedemptions, findCouponByCode, hasUserRedeemedCoupon } from "./coupons.service.js";
import { clearCart, getCart } from "./cart.service.js";
import { effectiveUnitPricePaise } from "../utils/money.js";
import { sendMail } from "./email.service.js";

const SHIPPING_PAISE = 4900;
const FREE_SHIPPING_ABOVE_PAISE = 99900;

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export async function createOrderFromCart(
  userId: number,
  input: {
    shippingName: string;
    shippingPhone: string;
    shippingLine1: string;
    shippingLine2?: string;
    shippingCity: string;
    shippingState: string;
    shippingPostal: string;
    shippingCountry?: string;
    couponCode?: string | null;
    notes?: string | null;
  }
) {
  const cart = await getCart(userId);
  if (!cart.items.length) throw new Error("EMPTY_CART");

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let subtotalPaise = 0;
    const lines: Array<{
      productId: number;
      name: string;
      unitPaise: number;
      qty: number;
    }> = [];

    for (const item of cart.items) {
      const [pRows] = await conn.query(
        "SELECT id, name, price_paise, discount_percent, stock_qty, is_active FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );
      const p = (
        pRows as {
          id: number;
          name: string;
          price_paise: number;
          discount_percent: number;
          stock_qty: number;
          is_active: 0 | 1;
        }[]
      )[0];
      if (!p || p.is_active !== 1) throw new Error("PRODUCT_NOT_FOUND");
      if (p.stock_qty < item.qty) throw new Error("INSUFFICIENT_STOCK");

      const unit = effectiveUnitPricePaise(p.price_paise, p.discount_percent);
      subtotalPaise += unit * item.qty;
      lines.push({ productId: p.id, name: p.name, unitPaise: unit, qty: item.qty });
    }

    let couponId: number | null = null;
    let discountPaise = 0;

    if (input.couponCode?.trim()) {
      const coupon = await findCouponByCode(input.couponCode.trim());
      if (!coupon || coupon.is_active !== 1) throw new Error("INVALID_COUPON");
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) throw new Error("COUPON_EXPIRED");
      if (subtotalPaise < coupon.min_order_paise) throw new Error("COUPON_MIN_NOT_MET");

      if (coupon.max_redemptions != null) {
        const used = await countCouponRedemptions(coupon.id);
        if (used >= coupon.max_redemptions) throw new Error("COUPON_EXHAUSTED");
      }

      if (await hasUserRedeemedCoupon(userId, coupon.id)) throw new Error("COUPON_ALREADY_USED");

      discountPaise = computeDiscountPaise(coupon, subtotalPaise);
      couponId = coupon.id;
    }

    const afterDiscount = Math.max(0, subtotalPaise - discountPaise);
    const shippingPaise = afterDiscount >= FREE_SHIPPING_ABOVE_PAISE ? 0 : SHIPPING_PAISE;
    const totalPaise = afterDiscount + shippingPaise;

    const [oRes] = await conn.query(
      `INSERT INTO orders
        (user_id, status, subtotal_paise, discount_paise, shipping_paise, total_paise, coupon_id,
         shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal, shipping_country, notes)
       VALUES (?, 'PENDING_PAYMENT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        subtotalPaise,
        discountPaise,
        shippingPaise,
        totalPaise,
        couponId,
        input.shippingName,
        input.shippingPhone,
        input.shippingLine1,
        input.shippingLine2 ?? null,
        input.shippingCity,
        input.shippingState,
        input.shippingPostal,
        input.shippingCountry ?? "India",
        input.notes ?? null
      ]
    );
    const orderId = (oRes as { insertId: number }).insertId;

    for (const line of lines) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price_paise, qty)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, line.productId, line.name, line.unitPaise, line.qty]
      );
    }

    if (couponId != null) {
      await conn.query("INSERT INTO coupon_redemptions (coupon_id, user_id, order_id) VALUES (?, ?, ?)", [
        couponId,
        userId,
        orderId
      ]);
    }

    await conn.commit();

    await clearCart(userId);

    const [uRows] = await pool.query("SELECT email, name FROM users WHERE id = ? LIMIT 1", [userId]);
    const u = (uRows as { email: string | null; name: string | null }[])[0];
    if (u?.email) {
      void sendMail(
        u.email,
        `Bobakuma — order #${orderId} placed`,
        `Hi ${u.name ?? "there"},\n\nThanks! Order #${orderId} was created. Complete payment in the app to confirm.\nTotal: ₹${(totalPaise / 100).toFixed(2)}\n\n— Bobakuma India`
      );
    }

    return getOrderByIdForUser(userId, orderId);
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function getOrderByIdForUser(userId: number, orderId: number) {
  const [oRows] = await pool.query("SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1", [orderId, userId]);
  const order = (oRows as Record<string, unknown>[])[0];
  if (!order) return null;

  const [items] = await pool.query(
    "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC",
    [orderId]
  );
  const [pay] = await pool.query("SELECT * FROM payments WHERE order_id = ? LIMIT 1", [orderId]);

  return formatOrder(order, items as Record<string, unknown>[], (pay as Record<string, unknown>[])[0] ?? null);
}

export async function listOrdersForUser(userId: number) {
  const [rows] = await pool.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 200",
    [userId]
  );
  return (rows as Record<string, unknown>[]).map((o) => ({
    id: Number(o.id),
    status: String(o.status),
    totalPaise: Number(o.total_paise),
    createdAt: o.created_at
  }));
}

function formatOrder(order: Record<string, unknown>, items: Record<string, unknown>[], payment: Record<string, unknown> | null) {
  return {
    id: Number(order.id),
    status: String(order.status) as OrderStatus,
    subtotalPaise: Number(order.subtotal_paise),
    discountPaise: Number(order.discount_paise),
    shippingPaise: Number(order.shipping_paise),
    totalPaise: Number(order.total_paise),
    couponId: order.coupon_id == null ? null : Number(order.coupon_id),
    shipping: {
      name: String(order.shipping_name),
      phone: String(order.shipping_phone),
      line1: String(order.shipping_line1),
      line2: order.shipping_line2 == null ? null : String(order.shipping_line2),
      city: String(order.shipping_city),
      state: String(order.shipping_state),
      postal: String(order.shipping_postal),
      country: String(order.shipping_country)
    },
    notes: order.notes == null ? null : String(order.notes),
    createdAt: order.created_at,
    items: items.map((i) => ({
      id: Number(i.id),
      productId: Number(i.product_id),
      name: String(i.product_name),
      unitPricePaise: Number(i.unit_price_paise),
      qty: Number(i.qty)
    })),
    payment: payment
      ? {
          status: String(payment.status),
          providerOrderId: payment.provider_order_id == null ? null : String(payment.provider_order_id)
        }
      : null
  };
}

export async function markOrderPaidAndStock(conn: PoolConnection, orderId: number) {
  const [oRows] = await conn.query("SELECT status FROM orders WHERE id = ? FOR UPDATE", [orderId]);
  const st = String((oRows as { status: string }[])[0]?.status ?? "");
  if (st !== "PENDING_PAYMENT") return;

  const [items] = await conn.query(
    "SELECT product_id, qty FROM order_items WHERE order_id = ?",
    [orderId]
  );
  for (const it of items as { product_id: number; qty: number }[]) {
    const [uRes] = await conn.query(
      "UPDATE products SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?",
      [it.qty, it.product_id, it.qty]
    );
    const affected = (uRes as { affectedRows: number }).affectedRows;
    if (!affected) throw new Error("STOCK_UPDATE_FAILED");
  }

  await conn.query("UPDATE orders SET status = 'PAID' WHERE id = ?", [orderId]);
}

export async function getOrderAdmin(orderId: number) {
  const [oRows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [orderId]);
  const order = (oRows as Record<string, unknown>[])[0];
  if (!order) return null;
  const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC", [orderId]);
  const [pay] = await pool.query("SELECT * FROM payments WHERE order_id = ? LIMIT 1", [orderId]);
  return formatOrder(order, items as Record<string, unknown>[], (pay as Record<string, unknown>[])[0] ?? null);
}
