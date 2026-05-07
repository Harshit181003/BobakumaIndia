import { effectiveUnitPricePaise } from "./money.js";

/** Markets: India (checkout baseline), Nepal & Sri Lanka (display estimates). */
export type MarketCurrency = "INR" | "NPR" | "LKR";

export const SUBCONTINENT_MARKETS = [
  { code: "INR" as const, country: "India", label: "India", symbol: "₹" },
  { code: "NPR" as const, country: "Nepal", label: "Nepal", symbol: "Rs." },
  { code: "LKR" as const, country: "Sri Lanka", label: "Sri Lanka", symbol: "Rs." }
];

export function parseMarketCurrency(raw: string | undefined): MarketCurrency {
  const u = (raw ?? "INR").toUpperCase();
  if (u === "NPR" || u === "LKR" || u === "INR") return u;
  return "INR";
}

export type FxConfig = {
  /** NPR per 1 INR (spot-style; update from your treasury source). */
  inrToNpr: number;
  /** LKR per 1 INR */
  inrToLkr: number;
  /** Multiply NPR result (PPP / positioning vs pure FX). Default 1. */
  adjustNp: number;
  /** Multiply LKR result */
  adjustLk: number;
};

export type SubcontinentPrice = {
  currency: MarketCurrency;
  /** Whole major units: rupees / NPR / LKR */
  amount: number;
  formatted: string;
  /** True when converted from INR list price */
  derivedFromInr: boolean;
};

function effectiveInrRupees(pricePaise: number, discountPercent: number) {
  return effectiveUnitPricePaise(pricePaise, discountPercent) / 100;
}

export function priceForMarket(
  pricePaise: number,
  discountPercent: number,
  currency: MarketCurrency,
  fx: FxConfig
): SubcontinentPrice {
  const inr = effectiveInrRupees(pricePaise, discountPercent);
  if (currency === "INR") {
    const amount = Math.max(0, Math.round(inr));
    return {
      currency: "INR",
      amount,
      formatted: `₹${amount.toLocaleString("en-IN")}`,
      derivedFromInr: false
    };
  }
  const rate = currency === "NPR" ? fx.inrToNpr : fx.inrToLkr;
  const adj = currency === "NPR" ? fx.adjustNp : fx.adjustLk;
  const amount = Math.max(0, Math.round(inr * rate * adj));
  return {
    currency,
    amount,
    formatted: `Rs. ${amount.toLocaleString("en-IN")}`,
    derivedFromInr: true
  };
}

export function subcontinentPriceCard(pricePaise: number, discountPercent: number, fx: FxConfig) {
  return {
    IN: priceForMarket(pricePaise, discountPercent, "INR", fx),
    NP: priceForMarket(pricePaise, discountPercent, "NPR", fx),
    LK: priceForMarket(pricePaise, discountPercent, "LKR", fx)
  };
}
