import { pool } from "../db.js";
import { getRazorpay, verifyPaymentSignature } from "../integrations/razorpayClient.js";
import { markOrderPaidAndStock } from "./orders.service.js";
import { sendMail } from "./email.service.js";

export async function createRazorpayOrderForDbOrder(orderId: number) {
  const [oRows] = await pool.query(
    "SELECT id, user_id, status, total_paise FROM orders WHERE id = ? LIMIT 1",
    [orderId]
  );
  const o = (oRows as { id: number; user_id: number; status: string; total_paise: number }[])[0];
  if (!o) throw new Error("ORDER_NOT_FOUND");
  if (o.status !== "PENDING_PAYMENT") throw new Error("ORDER_NOT_PAYABLE");

  const rz = getRazorpay();
  const receipt = `bobakuma_order_${o.id}`.slice(0, 40);
  const rpOrder = await rz.orders.create({
    amount: o.total_paise,
    currency: "INR",
    receipt,
    notes: { orderId: String(o.id), userId: String(o.user_id) }
  });

  await pool.query(
    `INSERT INTO payments (order_id, provider, status, provider_order_id)
     VALUES (?, 'RAZORPAY', 'CREATED', ?)
     ON DUPLICATE KEY UPDATE provider_order_id = VALUES(provider_order_id), status = 'CREATED', updated_at = CURRENT_TIMESTAMP`,
    [o.id, rpOrder.id]
  );

  return { razorpayOrderId: rpOrder.id, amountPaise: o.total_paise, currency: "INR", receipt };
}

export async function verifyRazorpayPaymentAndFulfill(input: {
  orderId: number;
  userId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const [oRows] = await pool.query(
    "SELECT id, user_id, status, total_paise FROM orders WHERE id = ? LIMIT 1",
    [input.orderId]
  );
  const o = (oRows as { id: number; user_id: number; status: string; total_paise: number }[])[0];
  if (!o) throw new Error("ORDER_NOT_FOUND");
  if (o.user_id !== input.userId) throw new Error("FORBIDDEN");
  if (o.status !== "PENDING_PAYMENT") throw new Error("ORDER_NOT_PAYABLE");

  const ok = verifyPaymentSignature(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature);
  if (!ok) throw new Error("INVALID_SIGNATURE");

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [pRows] = await conn.query("SELECT * FROM payments WHERE order_id = ? FOR UPDATE", [o.id]);
    const pay = (pRows as { provider_order_id: string | null }[])[0];
    if (!pay?.provider_order_id || pay.provider_order_id !== input.razorpayOrderId) {
      throw new Error("PAYMENT_MISMATCH");
    }

    await markOrderPaidAndStock(conn, o.id);

    await conn.query(
      `UPDATE payments
       SET status = 'CAPTURED', provider_payment_id = ?, provider_signature = ?, updated_at = CURRENT_TIMESTAMP
       WHERE order_id = ?`,
      [input.razorpayPaymentId, input.razorpaySignature, o.id]
    );

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }

  const [uRows] = await pool.query("SELECT email, name FROM users WHERE id = ? LIMIT 1", [input.userId]);
  const u = (uRows as { email: string | null; name: string | null }[])[0];
  if (u?.email) {
    void sendMail(
      u.email,
      `Bobakuma — payment received for order #${input.orderId}`,
      `Hi ${u.name ?? "there"},\n\nThanks! We received your payment for order #${input.orderId}.\n\n— Bobakuma India`
    );
  }

  return { ok: true };
}
