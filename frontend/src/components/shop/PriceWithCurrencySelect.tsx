"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { MarketCurrency } from "@/lib/currency";
import { parseDisplayCurrency } from "@/lib/currency";
import { persistCurrency } from "@/lib/currencyPersist";

const OPTIONS: { code: MarketCurrency; label: string }[] = [
  { code: "INR", label: "INR (₹)" },
  { code: "NPR", label: "NPR (est.)" },
  { code: "LKR", label: "LKR (est.)" }
];

export function PriceWithCurrencySelect({
  displayFormatted,
  serverCurrency,
  priceClassName = "text-sm font-bold text-ink-900"
}: {
  displayFormatted: string;
  serverCurrency: MarketCurrency;
  priceClassName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const fromUrl = parseDisplayCurrency(sp.get("currency") ?? undefined);
  const [value, setValue] = useState<MarketCurrency>(fromUrl ?? serverCurrency);

  useEffect(() => {
    setValue(fromUrl ?? serverCurrency);
  }, [fromUrl, serverCurrency]);

  const onChange = (c: MarketCurrency) => {
    setValue(c);
    persistCurrency(c);
    const p = new URLSearchParams(sp.toString());
    p.set("currency", c);
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : `${pathname}?currency=${c}`);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={priceClassName}>{displayFormatted}</span>
      <select
        aria-label="Display currency"
        className="rounded-xl border border-white/70 bg-white/90 px-2 py-1 text-[11px] font-semibold text-ink-900 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value as MarketCurrency)}
      >
        {OPTIONS.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
