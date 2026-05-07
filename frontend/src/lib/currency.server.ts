import { cookies } from "next/headers";
import { parseDisplayCurrency, type MarketCurrency } from "@/lib/currency";

export async function getCurrencyFromCookies(): Promise<MarketCurrency> {
  const store = await cookies();
  const c = store.get("bk_currency")?.value;
  return parseDisplayCurrency(c);
}

