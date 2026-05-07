"use client";

import type { MarketCurrency } from "@/lib/currency";
import { parseDisplayCurrency } from "@/lib/currency";

const KEY = "bobakuma_currency";
const COOKIE = "bk_currency";

export function getPersistedCurrency(): MarketCurrency {
  if (typeof window === "undefined") return "INR";
  const ls = window.localStorage.getItem(KEY) ?? undefined;
  if (ls) return parseDisplayCurrency(ls);
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  const v = m ? decodeURIComponent(m[1]) : undefined;
  return parseDisplayCurrency(v);
}

export function persistCurrency(c: MarketCurrency) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, c);
  document.cookie = `${COOKIE}=${encodeURIComponent(c)}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
}

