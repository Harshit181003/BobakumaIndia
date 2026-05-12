"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ProductPhoto } from "@/components/media/ProductPhoto";
import { PriceWithCurrencySelect } from "@/components/shop/PriceWithCurrencySelect";
import type { MarketCurrency } from "@/lib/currency";

type SubPrice = { formatted: string; currency: string; derivedFromInr: boolean };

export function ProductMetaLine({
  avgRating,
  reviewCount,
  category,
  inStock
}: {
  avgRating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="mt-2 text-sm text-stone-600">
      ★ {avgRating.toFixed(1)} ({reviewCount} {t("products.reviewsCount")}) · {category} · {inStock ? t("products.inStock") : t("products.outStock")}
    </div>
  );
}

export function ProductPriceBlock({
  displayPrice,
  preDiscount,
  discountPercent,
  subcontinent,
  currency,
  pricingNote
}: {
  displayPrice: SubPrice;
  preDiscount: SubPrice;
  discountPercent: number;
  subcontinent: { IN: SubPrice; NP: SubPrice; LK: SubPrice };
  currency: MarketCurrency;
  pricingNote?: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <PriceWithCurrencySelect
          displayFormatted={displayPrice.formatted}
          serverCurrency={currency}
          priceClassName="text-2xl font-bold text-brand-navy"
        />
        {discountPercent > 0 && <div className="text-sm font-medium text-stone-500 line-through">{preDiscount.formatted}</div>}
      </div>
      <div className="mt-3 rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-lavender-50 px-3 py-2 text-xs text-stone-800 shadow-sm">
        <div className="font-semibold text-brand-navy">{t("products.compareRegion")}</div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>India: {subcontinent.IN.formatted}</span>
          <span>Nepal: {subcontinent.NP.formatted}</span>
          <span>Sri Lanka: {subcontinent.LK.formatted}</span>
        </div>
        {pricingNote && currency !== "INR" && <p className="mt-2 text-[11px] text-stone-600">{pricingNote}</p>}
        {currency !== "INR" && (
          <p className="mt-2 text-[11px] font-medium text-stone-700">
            {t("products.checkoutChargesPrefix")}{" "}
            <strong className="text-brand-navy">{subcontinent.IN.formatted}</strong>{" "}
            {t("products.checkoutChargesSuffix")}
          </p>
        )}
      </div>
    </>
  );
}

export function ProductSpecsDl({
  material,
  color,
  capacityMl
}: {
  material: string;
  color: string;
  capacityMl: number | null;
}) {
  const { t } = useTranslation();
  return (
    <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
      <div className="rounded-2xl border border-pink-200/50 bg-white p-3 shadow-sm">
        <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">{t("products.material")}</dt>
        <dd className="font-semibold text-brand-navy">{material}</dd>
      </div>
      <div className="rounded-2xl border border-pink-200/50 bg-white p-3 shadow-sm">
        <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">{t("products.color")}</dt>
        <dd className="font-semibold text-brand-navy">{color}</dd>
      </div>
      <div className="rounded-2xl border border-pink-200/50 bg-white p-3 shadow-sm">
        <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">{t("products.capacity")}</dt>
        <dd className="font-semibold text-brand-navy">{capacityMl ? `${capacityMl} ml` : "—"}</dd>
      </div>
    </dl>
  );
}

export function RelatedProductsSection({
  items,
  curQs,
  currency
}: {
  items: { id: number; name: string; slug: string; effectivePricePaise: number; imageUrl: string | null; displayPrice?: SubPrice }[];
  curQs: string;
  currency: MarketCurrency;
}) {
  const { t } = useTranslation();
  return (
    <section className="mt-14">
      <h2 className="text-xl font-semibold text-brand-navy">{t("products.related")}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((r) => (
          <div
            key={r.id}
            className="overflow-hidden rounded-3xl border border-pink-200/40 bg-white shadow-sm"
          >
            <Link href={`/products/${r.slug}${curQs}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-[#faf8ff]">
                <ProductPhoto src={r.imageUrl} alt={r.name} className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </Link>
            <div className="p-3">
              <Link href={`/products/${r.slug}${curQs}`} className="line-clamp-2 text-sm font-semibold text-brand-navy hover:underline">
                {r.name}
              </Link>
              <div className="mt-2">
                <PriceWithCurrencySelect
                  displayFormatted={r.displayPrice?.formatted ?? `₹${(r.effectivePricePaise / 100).toFixed(0)}`}
                  serverCurrency={currency}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReviewsSection({
  reviews
}: {
  reviews: { id: number; rating: number; comment: string | null; userName: string }[];
}) {
  const { t } = useTranslation();
  return (
    <section className="mt-14">
      <h2 className="text-xl font-semibold text-brand-navy">{t("products.reviews")}</h2>
      <div className="mt-4 space-y-3">
        {reviews.length === 0 && <p className="text-sm text-stone-500">{t("products.noReviewsYet")}</p>}
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-3xl border border-pink-200/40 bg-white p-4 shadow-sm"
          >
            <div className="text-xs font-bold text-stone-500">{r.userName}</div>
            <div className="text-sm text-brand-navy">★ {r.rating}</div>
            {r.comment && <p className="mt-1 text-sm text-stone-600">{r.comment}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
