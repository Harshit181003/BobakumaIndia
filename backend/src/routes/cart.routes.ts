import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import * as cartService from "../services/cart.service.js";

export const cartRouter = Router();

cartRouter.use(requireAuth);

cartRouter.get("/", async (req: AuthedRequest, res) => {
  const cart = await cartService.getCart(req.user!.id);
  return res.json(cart);
});

const addSchema = z.object({
  productId: z.coerce.number().int().positive(),
  qty: z.coerce.number().int().min(1).max(99).default(1)
});

cartRouter.post("/items", async (req: AuthedRequest, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  try {
    const cart = await cartService.addToCart(req.user!.id, parsed.data.productId, parsed.data.qty);
    return res.json(cart);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "PRODUCT_NOT_FOUND") return res.status(404).json({ error: msg });
    if (msg === "INSUFFICIENT_STOCK") return res.status(409).json({ error: msg });
    throw e;
  }
});

const updateSchema = z.object({
  qty: z.coerce.number().int().min(0).max(99)
});

cartRouter.patch("/items/:cartItemId", async (req: AuthedRequest, res) => {
  const cartItemId = Number(req.params.cartItemId);
  if (!Number.isFinite(cartItemId)) return res.status(400).json({ error: "INVALID_ID" });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  try {
    const cart = await cartService.updateCartItem(req.user!.id, cartItemId, parsed.data.qty);
    return res.json(cart);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "NOT_FOUND") return res.status(404).json({ error: msg });
    if (msg === "INSUFFICIENT_STOCK") return res.status(409).json({ error: msg });
    throw e;
  }
});

cartRouter.delete("/items/:cartItemId", async (req: AuthedRequest, res) => {
  const cartItemId = Number(req.params.cartItemId);
  if (!Number.isFinite(cartItemId)) return res.status(400).json({ error: "INVALID_ID" });
  const cart = await cartService.removeCartItem(req.user!.id, cartItemId);
  return res.json(cart);
});

cartRouter.delete("/", async (req: AuthedRequest, res) => {
  const cart = await cartService.clearCart(req.user!.id);
  return res.json(cart);
});
