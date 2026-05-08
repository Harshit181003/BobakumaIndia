import { Suspense } from "react";
import { parseDisplayCurrency, type MarketCurrency } from "@/lib/currency";
import { getCurrencyFromCookies } from "@/lib/currency.server";
import { ProductsLead, ProductsFilters, ProductsFooter } from "./ProductsChrome";
import { ProductsGrid, type GridItem } from "./ProductsGrid";

type ListRes = {
  items: GridItem[];
  total: number;
  page: number;
  pageSize: number;
  currency?: string;
  pricingNote?: string;
};

function buildQuery(sp: Record<string, string | string[] | undefined>) {
  const p = new URLSearchParams();
  const set = (k: string, v: string | string[] | undefined) => {
    if (!v) return;
    p.set(k, Array.isArray(v) ? v[0] : v);
  };
  set("q", sp.q);
  set("category", sp.category);
  set("material", sp.material);
  set("color", sp.color);
  set("minPrice", sp.minPrice);
  set("maxPrice", sp.maxPrice);
  set("sort", sp.sort);
  set("page", sp.page);
  set("currency", sp.currency);
  p.set("pageSize", "12");
  return p.toString();
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const currency: MarketCurrency = sp.currency ? parseDisplayCurrency(sp.currency) : await getCurrencyFromCookies();
  const qs = buildQuery(sp);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(`${base}/api/products?${qs}`, { next: { revalidate: 15 } });
  const data = res.ok ? ((await res.json()) as ListRes) : { items: [], total: 0, page: 1, pageSize: 12 };
  const curQs = currency !== "INR" ? `?currency=${currency}` : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <ProductsLead pricingNote={data.pricingNote} currency={currency} />
      <ProductsFilters sp={sp} currency={currency} />
      <Suspense fallback={<div className="mt-8 text-center text-sm text-ink-900/50">Loading…</div>}>
        <ProductsGrid items={data.items} currency={currency} curQs={curQs} />
      </Suspense>
      <ProductsFooter shown={data.items.length} total={data.total} pageNum={data.page} />
    </div>
  );
}
