"use client";

import type React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  const fromUrl = useMemo(() => parseDisplayCurrency(sp.get("currency") ?? undefined), [sp]);
  const [persisted, setPersisted] = useState<string | null>(null);

  useEffect(() => {
    setPersisted(getPersistedCurrency());
  }, []);

  // Important: during SSR + first client paint, only rely on URL so href matches hydration.
  const cur = fromUrl ?? parseDisplayCurrency(persisted ?? undefined);
  const finalHref = withCurrency(href, cur);
  return <Link href={finalHref} {...props} />;
}

