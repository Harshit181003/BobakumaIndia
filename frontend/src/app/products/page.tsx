import Link from "next/link";
import Image from "next/image";
import { parseDisplayCurrency } from "@/lib/currency";
import { getCurrencyFromCookies } from "@/lib/currency.server";
import { InlineCurrency } from "@/components/layout/InlineCurrency";

type ListRes = {
  items: Array<{
    id: number;
    name: string;
    slug: string;
    category: string;
    material: string;
    color: string;
    effectivePricePaise: number;
    discountPercent: number;
    imageUrl: string | null;
    avgRating: number;
    displayPrice?: { formatted: string; currency: string };
  }>;
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
  const currency = sp.currency ? parseDisplayCurrency(sp.currency) : await getCurrencyFromCookies();
  const qs = buildQuery(sp);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(`${base}/api/products?${qs}`, { next: { revalidate: 15 } });
  const data = res.ok ? ((await res.json()) as ListRes) : { items: [], total: 0, page: 1, pageSize: 12 };
  const curQs = currency !== "INR" ? `?currency=${currency}` : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-ink-900">Shop lunchboxes</h1>
      <p className="mt-2 text-sm text-ink-900/65">Soft pastels, premium materials, happy lunches.</p>
      <InlineCurrency />
      {data.pricingNote && currency !== "INR" && (
        <p className="mt-2 rounded-2xl border border-mint-100/70 bg-mint-50/50 px-3 py-2 text-xs text-ink-900/70">{data.pricingNote}</p>
      )}

      <form className="mt-8 grid gap-3 rounded-[2rem] border border-white/60 bg-white/60 p-4 backdrop-blur md:grid-cols-6">
        <input name="q" defaultValue={(sp.q as string) ?? ""} placeholder="Search" className="md:col-span-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm" />
        <select name="category" defaultValue={(sp.category as string) ?? ""} className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm">
          <option value="">All categories</option>
          <option value="KIDS">Kids</option>
          <option value="OFFICE">Office</option>
        </select>
        <input name="material" defaultValue={(sp.material as string) ?? ""} placeholder="Material" className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm" />
        <input name="color" defaultValue={(sp.color as string) ?? ""} placeholder="Color" className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm" />
        <select name="sort" defaultValue={(sp.sort as string) ?? "newest"} className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating">Rating</option>
        </select>
        <div className="flex gap-2 md:col-span-6">
          <input name="minPrice" defaultValue={(sp.minPrice as string) ?? ""} placeholder="Min ₹" className="w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm" />
          <input name="maxPrice" defaultValue={(sp.maxPrice as string) ?? ""} placeholder="Max ₹" className="w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm" />
          <input type="hidden" name="currency" value={currency} />
          <button className="rounded-2xl bg-ink-900 px-5 py-2 text-sm font-semibold text-cream-50">Apply</button>
        </div>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}${curQs}`}
            className="group overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-soft backdrop-blur"
          >
            <div className="relative aspect-[4/3] bg-cream-100">
              {p.imageUrl ? <Image src={p.imageUrl} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:1024px) 100vw, 33vw" /> : null}
            </div>
            <div className="space-y-1 p-4">
              <div className="line-clamp-2 text-sm font-semibold text-ink-900">{p.name}</div>
              <div className="text-xs text-ink-900/55">
                {p.category} · {p.material} · {p.color}
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="text-sm font-bold text-ink-900">
                  {p.displayPrice?.formatted ?? `₹${(p.effectivePricePaise / 100).toFixed(0)}`}
                </div>
                <div className="text-xs text-ink-900/50">★ {p.avgRating.toFixed(1)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-ink-900/55">
        Showing {data.items.length} of {data.total} · page {data.page}
      </div>
    </div>
  );
}
