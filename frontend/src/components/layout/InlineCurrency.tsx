"use client";

import { CurrencySwitcher } from "@/components/layout/CurrencySwitcher";

export function InlineCurrency() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-ink-900/55">Currency</span>
      <CurrencySwitcher />
    </div>
  );
}

