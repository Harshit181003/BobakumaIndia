import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductActions } from "./ProductActions";
import {
  ProductMetaLine,
  ProductPriceBlock,
  ProductSpecsDl,
  RelatedProductsSection,
  ReviewsSection
} from "./ProductDetailClient";
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
          <ProductMetaLine avgRating={p.avgRating} reviewCount={p.reviewCount} category={p.category} inStock={p.stockQty > 0} />
          <ProductPriceBlock
            displayPrice={p.displayPrice}
            preDiscount={p.preDiscountDisplay}
            discountPercent={p.discountPercent}
            subcontinent={p.subcontinent}
            currency={currency}
            pricingNote={data.pricingNote}
          />
          <p className="mt-6 text-sm leading-relaxed text-ink-900/75">{p.description}</p>
          <ProductSpecsDl material={p.material} color={p.color} capacityMl={p.capacityMl} />
          <div className="mt-8">
            <ProductActions productId={p.id} slug={p.slug} />
          </div>
        </div>
      </div>

      <ReviewsSection reviews={data.reviews} />

      <RelatedProductsSection items={data.related} curQs={curQs} currency={currency} />
    </div>
  );
}
