export type MarketCurrency = "INR" | "NPR" | "LKR";

export function parseDisplayCurrency(raw: string | string[] | undefined): MarketCurrency {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const u = v?.toUpperCase();
  if (u === "NPR" || u === "LKR" || u === "INR") return u;
  return "INR";
}
