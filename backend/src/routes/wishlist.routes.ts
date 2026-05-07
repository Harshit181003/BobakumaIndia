import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import * as wishlistService from "../services/wishlist.service.js";

export const wishlistRouter = Router();
wishlistRouter.use(requireAuth);

wishlistRouter.get("/", async (req: AuthedRequest, res) => {
  const items = await wishlistService.getWishlist(req.user!.id);
  return res.json({ items });
});

const addSchema = z.object({ productId: z.coerce.number().int().positive() });

wishlistRouter.post("/items", async (req: AuthedRequest, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  try {
    const items = await wishlistService.addWishlistItem(req.user!.id, parsed.data.productId);
    return res.json({ items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "PRODUCT_NOT_FOUND") return res.status(404).json({ error: msg });
    throw e;
  }
});

wishlistRouter.delete("/items/:wishlistItemId", async (req: AuthedRequest, res) => {
  const id = Number(req.params.wishlistItemId);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "INVALID_ID" });
  const items = await wishlistService.removeWishlistItem(req.user!.id, id);
  return res.json({ items });
});
