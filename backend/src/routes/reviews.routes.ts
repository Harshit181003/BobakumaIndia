import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getReviewsForProduct } from "../services/products.service.js";

export const reviewsRouter = Router();

reviewsRouter.get("/product/:productId", async (req, res) => {
  const productId = Number(req.params.productId);
  if (!Number.isFinite(productId)) return res.status(400).json({ error: "INVALID_ID" });
  const reviews = await getReviewsForProduct(productId);
  return res.json({ reviews });
});

const createSchema = z.object({
  productId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(2000).optional()
});

reviewsRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });

  const [pRows] = await pool.query("SELECT id FROM products WHERE id = ? AND is_active = 1 LIMIT 1", [
    parsed.data.productId
  ]);
  if (!(pRows as { id: number }[])[0]) return res.status(404).json({ error: "PRODUCT_NOT_FOUND" });

  await pool.query(
    `INSERT INTO reviews (product_id, user_id, rating, comment)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
    [parsed.data.productId, req.user!.id, parsed.data.rating, parsed.data.comment ?? null]
  );

  const reviews = await getReviewsForProduct(parsed.data.productId);
  return res.json({ reviews });
});
