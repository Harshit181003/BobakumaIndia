"use client";

import Image from "next/image";
import Link from "next/link";
import type { MarketCurrency } from "@/lib/currency";
import { PriceWithCurrencySelect } from "@/components/shop/PriceWithCurrencySelect";

export type GridItem = {
  id: number;
  name: string;
  slug: string;
  category: string;
  material: string;
  color: string;
  effectivePricePaise: number;
  imageUrl: string | null;
  avgRating: number;
  displayPrice?: { formatted: string; currency: string };
};

export function ProductsGrid({ items, currency, curQs }: { items: GridItem[]; currency: MarketCurrency; curQs: string }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <div
          key={p.id}
          className="group overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-soft backdrop-blur"
        >
          <Link href={`/products/${p.slug}${curQs}`} className="block">
            <div className="relative aspect-[4/3] bg-cream-100">
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 33vw"
                />
              ) : null}
            </div>
          </Link>
          <div className="space-y-1 p-4">
            <Link href={`/products/${p.slug}${curQs}`} className="line-clamp-2 text-sm font-semibold text-ink-900 hover:underline">
              {p.name}
            </Link>
            <div className="text-xs text-ink-900/55">
              {p.category} · {p.material} · {p.color}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <PriceWithCurrencySelect
                displayFormatted={p.displayPrice?.formatted ?? `₹${(p.effectivePricePaise / 100).toFixed(0)}`}
                serverCurrency={currency}
              />
              <div className="text-xs text-ink-900/50">★ {p.avgRating.toFixed(1)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
