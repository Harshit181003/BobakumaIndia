import { Router } from "express";
import { z } from "zod";
import { getProductBySlug, getRelatedProducts, getReviewsForProduct, listProducts } from "../services/products.service.js";
import { parseMarketCurrency } from "../utils/pricing.js";

export const productsRouter = Router();

const listQuerySchema = z.object({
  q: z.string().optional(),
  category: z.enum(["KIDS", "OFFICE"]).optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  minPrice: z.coerce.number().int().optional(),
  maxPrice: z.coerce.number().int().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(48).optional(),
  currency: z.preprocess(
    (v) => (typeof v === "string" ? v.toUpperCase() : v),
    z.enum(["INR", "NPR", "LKR"]).optional()
  )
});

productsRouter.get("/", async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_QUERY", details: parsed.error.flatten() });

  const minPaise = parsed.data.minPrice != null ? parsed.data.minPrice * 100 : undefined;
  const maxPaise = parsed.data.maxPrice != null ? parsed.data.maxPrice * 100 : undefined;

  const result = await listProducts({
    q: parsed.data.q,
    category: parsed.data.category,
    material: parsed.data.material,
    color: parsed.data.color,
    minPricePaise: minPaise,
    maxPricePaise: maxPaise,
    sort: parsed.data.sort ?? "newest",
    page: parsed.data.page ?? 1,
    pageSize: parsed.data.pageSize ?? 12,
    currency: parseMarketCurrency(parsed.data.currency)
  });

  return res.json(result);
});

productsRouter.get("/:slug", async (req, res) => {
  const slug = req.params.slug;
  const curRaw = typeof req.query.currency === "string" ? req.query.currency : undefined;
  const currency = parseMarketCurrency(curRaw);
  const p = await getProductBySlug(slug, currency);
  if (!p) return res.status(404).json({ error: "NOT_FOUND" });

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(p.id),
    getRelatedProducts(p.category, p.id, 4, currency)
  ]);

  return res.json({
    product: p,
    reviews,
    related,
    currency,
    pricingNote:
      "NPR/LKR are indicative from INR list price and your server FX settings. Payment is settled in INR (Razorpay)."
  });
});
