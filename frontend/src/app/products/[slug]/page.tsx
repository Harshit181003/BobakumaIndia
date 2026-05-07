import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductActions } from "./ProductActions";
import { parseDisplayCurrency } from "@/lib/currency";
import { getCurrencyFromCookies } from "@/lib/currency.server";

type SubPrice = { formatted: string; currency: string; derivedFromInr: boolean };

type Detail = {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    material: string;
    color: string;
    capacityMl: number | null;
    pricePaise: number;
    discountPercent: number;
    effectivePricePaise: number;
    stockQty: number;
    avgRating: number;
    reviewCount: number;
    displayPrice: SubPrice;
    preDiscountDisplay: SubPrice;
    subcontinent: { IN: SubPrice; NP: SubPrice; LK: SubPrice };
    images: { id: number; url: string; altText: string | null }[];
  };
  reviews: { id: number; rating: number; comment: string | null; userName: string; createdAt: string }[];
  related: {
    id: number;
    name: string;
    slug: string;
    effectivePricePaise: number;
    imageUrl: string | null;
    displayPrice?: SubPrice;
  }[];
  pricingNote?: string;
};

export default async function ProductPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const currency = sp.currency ? parseDisplayCurrency(sp.currency) : await getCurrencyFromCookies();
  const curQs = currency !== "INR" ? `?currency=${encodeURIComponent(currency)}` : "";
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(`${base}/api/products/${encodeURIComponent(slug)}${curQs}`, { next: { revalidate: 15 } });
  if (!res.ok) notFound();
  const data = (await res.json()) as Detail;
  const p = data.product;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white/60 shadow-soft">
            {p.images[0] ? (
              <Image src={p.images[0].url} alt={p.images[0].altText ?? p.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            ) : null}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {p.images.slice(1, 5).map((im) => (
              <div key={im.id} className="relative aspect-square overflow-hidden rounded-2xl bg-cream-100">
                <Image src={im.url} alt={im.altText ?? ""} fill className="object-cover" sizes="120px" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-ink-900">{p.name}</h1>
          <div className="mt-2 text-sm text-ink-900/60">
            ★ {p.avgRating.toFixed(1)} ({p.reviewCount} reviews) · {p.category} · {p.stockQty > 0 ? "In stock" : "Out of stock"}
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <div className="text-2xl font-bold text-ink-900">{p.displayPrice.formatted}</div>
            {p.discountPercent > 0 && (
              <div className="text-sm text-ink-900/45 line-through">{p.preDiscountDisplay.formatted}</div>
            )}
          </div>
          <div className="mt-3 rounded-2xl border border-mint-100/70 bg-mint-50/40 px-3 py-2 text-xs text-ink-900/70">
            <div className="font-semibold text-ink-900/80">Compare (after discount)</div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>India: {p.subcontinent.IN.formatted}</span>
              <span>Nepal: {p.subcontinent.NP.formatted}</span>
              <span>Sri Lanka: {p.subcontinent.LK.formatted}</span>
            </div>
            {data.pricingNote && currency !== "INR" && <p className="mt-2 text-[11px] text-ink-900/55">{data.pricingNote}</p>}
            {currency !== "INR" && (
              <p className="mt-2 text-[11px] font-medium text-ink-900/65">
                Checkout charges{" "}
                <strong className="text-ink-900">{p.subcontinent.IN.formatted}</strong> through Razorpay (INR).
              </p>
            )}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink-900/75">{p.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/60 p-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-ink-900/45">Material</dt>
              <dd className="font-semibold text-ink-900">{p.material}</dd>
            </div>
            <div className="rounded-2xl bg-white/60 p-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-ink-900/45">Color</dt>
              <dd className="font-semibold text-ink-900">{p.color}</dd>
            </div>
            <div className="rounded-2xl bg-white/60 p-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-ink-900/45">Capacity</dt>
              <dd className="font-semibold text-ink-900">{p.capacityMl ? `${p.capacityMl} ml` : "—"}</dd>
            </div>
          </dl>
          <div className="mt-8">
            <ProductActions productId={p.id} slug={p.slug} />
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-ink-900">Reviews</h2>
        <div className="mt-4 space-y-3">
          {data.reviews.length === 0 && <p className="text-sm text-ink-900/55">No reviews yet — be the first.</p>}
          {data.reviews.map((r) => (
            <div key={r.id} className="rounded-3xl border border-white/60 bg-white/60 p-4">
              <div className="text-xs font-bold text-ink-900/45">{r.userName}</div>
              <div className="text-sm text-ink-900">★ {r.rating}</div>
              {r.comment && <p className="mt-1 text-sm text-ink-900/75">{r.comment}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-ink-900">Related</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.related.map((r) => (
            <Link
              key={r.id}
              href={`/products/${r.slug}${curQs}`}
              className="overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-sm"
            >
              <div className="relative aspect-square bg-cream-100">
                {r.imageUrl ? <Image src={r.imageUrl} alt="" fill className="object-cover" sizes="200px" /> : null}
              </div>
              <div className="p-3 text-sm font-semibold text-ink-900 line-clamp-2">{r.name}</div>
              <div className="px-3 pb-3 text-sm font-bold">
                {r.displayPrice?.formatted ?? `₹${(r.effectivePricePaise / 100).toFixed(0)}`}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
