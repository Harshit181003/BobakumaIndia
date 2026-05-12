"use client";

import Link from "next/link";
import type { MarketCurrency } from "@/lib/currency";
import { ProductPhoto } from "@/components/media/ProductPhoto";
import { PriceWithCurrencySelect } from "@/components/shop/PriceWithCurrencySelect";
import { Skeleton } from "@/components/ui/Skeleton";

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
          className="group overflow-hidden rounded-3xl border border-pink-200/50 bg-white shadow-[0_12px_40px_-20px_rgba(180,140,200,0.2)] transition hover:-translate-y-0.5 hover:border-[#c4b5fd] hover:shadow-[0_20px_48px_-20px_rgba(180,140,200,0.28)]"
        >
          <Link href={`/products/${p.slug}${curQs}`} className="block">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#faf8ff]">
              <ProductPhoto
                src={p.imageUrl}
                alt={p.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
          <div className="space-y-1 p-4">
            <Link href={`/products/${p.slug}${curQs}`} className="line-clamp-2 text-sm font-semibold text-brand-navy hover:underline">
              {p.name}
            </Link>
            <div className="text-xs text-stone-600">
              {p.category} · {p.material} · {p.color}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <PriceWithCurrencySelect
                displayFormatted={p.displayPrice?.formatted ?? `₹${(p.effectivePricePaise / 100).toFixed(0)}`}
                serverCurrency={currency}
              />
              <div className="text-xs text-stone-500">★ {p.avgRating.toFixed(1)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductsGridSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-pink-200/40 bg-white"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-[78%]" />
            <Skeleton className="h-3 w-[55%]" />
            <div className="flex justify-between pt-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
