"use client";

import type React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPersistedCurrency } from "@/lib/currencyPersist";
import { parseDisplayCurrency } from "@/lib/currency";

function withCurrency(href: string, currency: string) {
  // Don't touch external links
  if (/^https?:\/\//i.test(href)) return href;
  const [path, qs] = href.split("?");
  const p = new URLSearchParams(qs ?? "");
  if (!p.has("currency")) p.set("currency", currency);
  const out = p.toString();
  return out ? `${path}?${out}` : path;
}

export function CurrencyLink({
  href,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
}) {
  const sp = useSearchParams();
  const cur = parseDisplayCurrency(sp.get("currency") ?? getPersistedCurrency());
  const finalHref = withCurrency(href, cur);
  return <Link href={finalHref} {...props} />;
}

