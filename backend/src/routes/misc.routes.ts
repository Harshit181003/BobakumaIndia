import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";

export const miscRouter = Router();

const newsletterSchema = z.object({
  email: z.string().email(),
  language: z.string().min(2).max(10).default("en")
});

miscRouter.post("/newsletter", async (req, res) => {
  const body = req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};
  const parsed = newsletterSchema.safeParse({
    ...body,
    email: typeof body.email === "string" ? body.email.trim().toLowerCase() : body.email
  });
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  try {
    await pool.query("INSERT INTO newsletters (email, language) VALUES (?, ?)", [
      parsed.data.email,
      parsed.data.language
    ]);
  } catch (e: unknown) {
    const code = e && typeof e === "object" && "code" in e ? String((e as { code: string }).code) : "";
    if (code === "ER_DUP_ENTRY") return res.json({ ok: true, duplicate: true });
    console.error("newsletter insert failed", e);
    return res.status(500).json({ error: "NEWSLETTER_FAILED" });
  }
  return res.json({ ok: true });
});

const chatSchema = z.object({
  message: z.string().min(1).max(2000)
});

miscRouter.post("/support/chat", async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });

  const q = parsed.data.message.toLowerCase();
  let answer =
    "Hi! I’m the Bobakuma helper bot. I can assist with orders, shipping timelines, materials (BPA‑free / steel / glass), and sizing.";

  if (q.includes("ship") || q.includes("delivery")) {
    answer =
      "We typically pack orders within 1–2 business days. You’ll see tracking updates in your order history once it ships.";
  } else if (q.includes("return") || q.includes("refund")) {
    answer =
      "For returns/refunds, email support with your order ID. We’ll share the next steps based on your order status.";
  } else if (q.includes("leak") || q.includes("microwave") || q.includes("dishwasher")) {
    answer =
      "Most Bobakuma lunchboxes are leak‑resistant with proper assembly. Microwave/dishwasher rules vary by material—check the product page for the exact lunchbox you’re viewing.";
  }

  return res.json({ answer });
});
