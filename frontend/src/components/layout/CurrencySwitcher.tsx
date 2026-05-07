"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import type { MarketCurrency } from "@/lib/currency";
import { persistCurrency } from "@/lib/currencyPersist";

const OPTIONS: { code: MarketCurrency; short: string; title: string }[] = [
  { code: "INR", short: "₹ IN", title: "India (INR)" },
  { code: "NPR", short: "Rs NP", title: "Nepal (NPR est.)" },
  { code: "LKR", short: "Rs LK", title: "Sri Lanka (LKR est.)" }
];

export function CurrencySwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const active = (sp.get("currency")?.toUpperCase() as MarketCurrency) || "INR";
  const current: MarketCurrency = active === "NPR" || active === "LKR" || active === "INR" ? active : "INR";

  return (
    <div className={cn("inline-flex rounded-2xl border border-white/60 bg-white/70 p-0.5 shadow-sm backdrop-blur", className)}>
      {OPTIONS.map((o) => {
        const next = new URLSearchParams(sp.toString());
        next.set("currency", o.code);
        const qs = next.toString();
        const href = qs ? `${pathname}?${qs}` : `${pathname}?currency=${o.code}`;
        const on = current === o.code;
        return (
          <Link
            key={o.code}
            href={href}
            title={o.title}
            onClick={() => persistCurrency(o.code)}
            className={cn(
              "rounded-[1.05rem] px-2.5 py-1.5 text-[11px] font-bold transition",
              on ? "bg-mint-100 text-ink-900 shadow-sm" : "text-ink-900/55 hover:bg-white/80 hover:text-ink-900"
            )}
          >
            {o.short}
          </Link>
        );
      })}
    </div>
  );
}
