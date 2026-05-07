import { Router } from "express";
import { config } from "../config.js";
import { SUBCONTINENT_MARKETS, priceForMarket } from "../utils/pricing.js";

export const pricingRouter = Router();

pricingRouter.get("/regions", (_req, res) => {
  return res.json({
    markets: SUBCONTINENT_MARKETS,
    fx: {
      inrToNpr: config.pricing.inrToNpr,
      inrToLkr: config.pricing.inrToLkr,
      adjustNp: config.pricing.adjustNp,
      adjustLk: config.pricing.adjustLk
    },
    note:
      "Catalog prices are stored in INR. NPR and LKR amounts are display estimates from your configured FX rates and optional regional multipliers. Checkout is charged in INR through Razorpay (India)."
  });
});

pricingRouter.get("/sample", (req, res) => {
  const raw = req.query.inr;
  const n = typeof raw === "string" ? Number(raw) : 899;
  const baseInrRupees = Number.isFinite(n) ? Math.min(1_000_000, Math.max(0, n)) : 899;
  const pricePaise = Math.round(baseInrRupees * 100);
  const fx = config.pricing;
  return res.json({
    baseInrRupees,
    estimates: {
      IN: priceForMarket(pricePaise, 0, "INR", fx),
      NP: priceForMarket(pricePaise, 0, "NPR", fx),
      LK: priceForMarket(pricePaise, 0, "LKR", fx)
    }
  });
});
