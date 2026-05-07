import { pool } from "../db.js";
import { effectiveUnitPricePaise } from "../utils/money.js";

async function getOrCreateCartId(userId: number) {
  const [existing] = await pool.query("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
  const row = (existing as { id: number }[])[0];
  if (row) return row.id;

  const [ins] = await pool.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  return (ins as { insertId: number }).insertId;
}

export async function getCart(userId: number) {
  const cartId = await getOrCreateCartId(userId);
  const [rows] = await pool.query(
    `SELECT ci.id AS cart_item_id, ci.qty,
            p.id AS product_id, p.name, p.slug, p.stock_qty,
            p.price_paise, p.discount_percent, p.is_active
     FROM cart_items ci
     INNER JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = ?
     ORDER BY ci.id ASC`,
    [cartId]
  );

  const items = (
    rows as {
      cart_item_id: number;
      qty: number;
      product_id: number;
      name: string;
      slug: string;
      stock_qty: number;
      price_paise: number;
      discount_percent: number;
      is_active: 0 | 1;
    }[]
  ).map((r) => {
    const unit = effectiveUnitPricePaise(r.price_paise, r.discount_percent);
    return {
      cartItemId: r.cart_item_id,
      productId: r.product_id,
      name: r.name,
      slug: r.slug,
      qty: r.qty,
      unitPricePaise: unit,
      lineTotalPaise: unit * r.qty,
      stockQty: r.stock_qty,
      available: r.is_active === 1 && r.stock_qty > 0
    };
  });

  const subtotalPaise = items.reduce((s, i) => s + i.lineTotalPaise, 0);
  return { cartId, items, subtotalPaise };
}

export async function addToCart(userId: number, productId: number, qty: number) {
  const cartId = await getOrCreateCartId(userId);
  const [pRows] = await pool.query("SELECT id, is_active, stock_qty FROM products WHERE id = ? LIMIT 1", [productId]);
  const p = (pRows as { id: number; is_active: 0 | 1; stock_qty: number }[])[0];
  if (!p || p.is_active !== 1) throw new Error("PRODUCT_NOT_FOUND");
  if (p.stock_qty < qty) throw new Error("INSUFFICIENT_STOCK");

  await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, qty)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)`,
    [cartId, productId, qty]
  );

  const [updated] = await pool.query(
    "SELECT qty FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1",
    [cartId, productId]
  );
  const newQty = (updated as { qty: number }[])[0]?.qty ?? qty;
  if (newQty > p.stock_qty) {
    await pool.query("UPDATE cart_items SET qty = ? WHERE cart_id = ? AND product_id = ?", [p.stock_qty, cartId, productId]);
    throw new Error("INSUFFICIENT_STOCK");
  }

  return getCart(userId);
}

export async function updateCartItem(userId: number, cartItemId: number, qty: number) {
  const cartId = await getOrCreateCartId(userId);
  const [rows] = await pool.query(
    `SELECT ci.id, ci.product_id, p.stock_qty
     FROM cart_items ci
     INNER JOIN products p ON p.id = ci.product_id
     WHERE ci.id = ? AND ci.cart_id = ?
     LIMIT 1`,
    [cartItemId, cartId]
  );
  const row = (rows as { id: number; product_id: number; stock_qty: number }[])[0];
  if (!row) throw new Error("NOT_FOUND");
  if (qty < 1) {
    await pool.query("DELETE FROM cart_items WHERE id = ?", [cartItemId]);
    return getCart(userId);
  }
  if (qty > row.stock_qty) throw new Error("INSUFFICIENT_STOCK");
  await pool.query("UPDATE cart_items SET qty = ? WHERE id = ?", [qty, cartItemId]);
  return getCart(userId);
}

export async function removeCartItem(userId: number, cartItemId: number) {
  const cartId = await getOrCreateCartId(userId);
  await pool.query("DELETE FROM cart_items WHERE id = ? AND cart_id = ?", [cartItemId, cartId]);
  return getCart(userId);
}

export async function clearCart(userId: number) {
  const cartId = await getOrCreateCartId(userId);
  await pool.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);
  return getCart(userId);
}
