import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { createOrderFromCart, getOrderByIdForUser, listOrdersForUser } from "../services/orders.service.js";
import { createRazorpayOrderForDbOrder, verifyRazorpayPaymentAndFulfill } from "../services/payments.service.js";
import { streamOrderInvoicePdfToResponse } from "../services/invoice.service.js";

export const ordersRouter = Router();

ordersRouter.use(requireAuth);

ordersRouter.get("/", async (req: AuthedRequest, res) => {
  const orders = await listOrdersForUser(req.user!.id);
  return res.json({ orders });
});

const checkoutSchema = z.object({
  shippingName: z.string().min(1).max(120),
  shippingPhone: z.string().min(6).max(40),
  shippingLine1: z.string().min(1).max(255),
  shippingLine2: z.string().max(255).optional(),
  shippingCity: z.string().min(1).max(80),
  shippingState: z.string().min(1).max(80),
  shippingPostal: z.string().min(3).max(20),
  shippingCountry: z.string().min(1).max(80).optional(),
  couponCode: z.string().max(40).optional(),
  notes: z.string().max(255).optional()
});

ordersRouter.post("/checkout", async (req: AuthedRequest, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  try {
    const order = await createOrderFromCart(req.user!.id, {
      shippingName: parsed.data.shippingName,
      shippingPhone: parsed.data.shippingPhone,
      shippingLine1: parsed.data.shippingLine1,
      shippingLine2: parsed.data.shippingLine2,
      shippingCity: parsed.data.shippingCity,
      shippingState: parsed.data.shippingState,
      shippingPostal: parsed.data.shippingPostal,
      shippingCountry: parsed.data.shippingCountry,
      couponCode: parsed.data.couponCode,
      notes: parsed.data.notes
    });
    return res.status(201).json({ order });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "EMPTY_CART") return res.status(400).json({ error: msg });
    if (msg === "INSUFFICIENT_STOCK" || msg === "PRODUCT_NOT_FOUND") return res.status(409).json({ error: msg });
    if (
      msg === "INVALID_COUPON" ||
      msg === "COUPON_EXPIRED" ||
      msg === "COUPON_MIN_NOT_MET" ||
      msg === "COUPON_EXHAUSTED" ||
      msg === "COUPON_ALREADY_USED"
    ) {
      return res.status(400).json({ error: msg });
    }
    throw e;
  }
});

const verifySchema = z.object({
  orderId: z.coerce.number().int().positive(),
  razorpayOrderId: z.string().min(3),
  razorpayPaymentId: z.string().min(3),
  razorpaySignature: z.string().min(3)
});

ordersRouter.post("/payments/razorpay/verify", async (req: AuthedRequest, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  try {
    await verifyRazorpayPaymentAndFulfill({
      orderId: parsed.data.orderId,
      userId: req.user!.id,
      razorpayOrderId: parsed.data.razorpayOrderId,
      razorpayPaymentId: parsed.data.razorpayPaymentId,
      razorpaySignature: parsed.data.razorpaySignature
    });
    const order = await getOrderByIdForUser(req.user!.id, parsed.data.orderId);
    return res.json({ ok: true, order });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "ORDER_NOT_FOUND" || msg === "FORBIDDEN" || msg === "ORDER_NOT_PAYABLE") {
      return res.status(400).json({ error: msg });
    }
    if (msg === "INVALID_SIGNATURE" || msg === "PAYMENT_MISMATCH") return res.status(400).json({ error: msg });
    if (msg === "STOCK_UPDATE_FAILED") return res.status(409).json({ error: msg });
    throw e;
  }
});

ordersRouter.post("/:orderId/razorpay-order", async (req: AuthedRequest, res) => {
  const orderId = Number(req.params.orderId);
  if (!Number.isFinite(orderId)) return res.status(400).json({ error: "INVALID_ID" });
  const existing = await getOrderByIdForUser(req.user!.id, orderId);
  if (!existing) return res.status(404).json({ error: "NOT_FOUND" });
  try {
    const rp = await createRazorpayOrderForDbOrder(orderId);
    return res.json({
      keyId: config.razorpay.keyId,
      ...rp
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "RAZORPAY_NOT_CONFIGURED") return res.status(501).json({ error: msg });
    if (msg === "ORDER_NOT_FOUND" || msg === "ORDER_NOT_PAYABLE") return res.status(400).json({ error: msg });
    throw e;
  }
});

ordersRouter.get("/:orderId/invoice", async (req: AuthedRequest, res) => {
  const orderId = Number(req.params.orderId);
  if (!Number.isFinite(orderId)) return res.status(400).json({ error: "INVALID_ID" });
  const owned = await getOrderByIdForUser(req.user!.id, orderId);
  if (!owned) return res.status(404).json({ error: "NOT_FOUND" });
  const ok = await streamOrderInvoicePdfToResponse(orderId, res);
  if (!ok) return res.status(500).end();
});

ordersRouter.get("/:orderId", async (req: AuthedRequest, res) => {
  const orderId = Number(req.params.orderId);
  if (!Number.isFinite(orderId)) return res.status(400).json({ error: "INVALID_ID" });
  const order = await getOrderByIdForUser(req.user!.id, orderId);
  if (!order) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json({ order });
});
