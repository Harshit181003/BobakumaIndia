import Razorpay from "razorpay";
import crypto from "node:crypto";
import { config } from "../config.js";

export function getRazorpay() {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    throw new Error("RAZORPAY_NOT_CONFIGURED");
  }
  return new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret
  });
}

export function verifyPaymentSignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string) {
  if (!config.razorpay.keySecret) throw new Error("RAZORPAY_NOT_CONFIGURED");
  const hmac = crypto.createHmac("sha256", config.razorpay.keySecret);
  hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const digest = hmac.digest("hex");
  return digest === signature;
}

export function verifyWebhookSignature(body: string, signature: string | undefined) {
  if (!config.razorpay.webhookSecret) return false;
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", config.razorpay.webhookSecret);
  hmac.update(body);
  const digest = hmac.digest("hex");
  return digest === signature;
}
