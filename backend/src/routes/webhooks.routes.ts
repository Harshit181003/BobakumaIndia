import type { Request, Response } from "express";
import { pool } from "../db.js";
import { verifyWebhookSignature } from "../integrations/razorpayClient.js";
import { markOrderPaidAndStock } from "../services/orders.service.js";

/**
 * Razorpay webhook — use with `express.raw({ type: "application/json" })` so `req.body` is a Buffer.
 */
export async function razorpayWebhookHandler(req: Request, res: Response) {
  const rawBody = req.body instanceof Buffer ? req.body.toString("utf8") : String(req.body ?? "");
  const signature = req.get("x-razorpay-signature");
  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(400).json({ error: "INVALID_WEBHOOK_SIGNATURE" });
  }

  let payload: { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return res.status(400).json({ error: "INVALID_JSON" });
  }

  const event = payload.event;
  const orderId = payload.payload?.payment?.entity?.order_id;
  const paymentId = payload.payload?.payment?.entity?.id;

  if (event === "payment.captured" && orderId) {
    const [payRows] = await pool.query("SELECT * FROM payments WHERE provider_order_id = ? LIMIT 1", [orderId]);
    const pay = (payRows as { order_id: number; status: string }[])[0];
    if (pay && pay.status !== "CAPTURED") {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await markOrderPaidAndStock(conn, pay.order_id);
        await conn.query(
          `UPDATE payments SET status='CAPTURED', provider_payment_id=?, updated_at=CURRENT_TIMESTAMP WHERE order_id=?`,
          [paymentId ?? null, pay.order_id]
        );
        await conn.commit();
      } catch {
        await conn.rollback();
      } finally {
        conn.release();
      }
    }
  }

  return res.json({ ok: true });
}
