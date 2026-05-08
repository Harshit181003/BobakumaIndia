"use client";

import { useTranslation } from "react-i18next";
import type { MarketCurrency } from "@/lib/currency";

export function ProductsLead({
  pricingNote,
  currency
}: {
  pricingNote?: string;
  currency: MarketCurrency;
}) {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="text-3xl font-semibold text-ink-900">{t("products.title")}</h1>
      <p className="mt-2 text-sm text-ink-900/65">{t("products.subtitle")}</p>
      {pricingNote && currency !== "INR" && (
        <p className="mt-2 rounded-2xl border border-mint-100/70 bg-mint-50/50 px-3 py-2 text-xs text-ink-900/70">{pricingNote}</p>
      )}
    </>
  );
}

export function ProductsFilters({
  sp,
  currency
}: {
  sp: Record<string, string | string[] | undefined>;
  currency: MarketCurrency;
}) {
  const { t } = useTranslation();
  const q = (sp.q as string) ?? "";
  const category = (sp.category as string) ?? "";
  const material = (sp.material as string) ?? "";
  const color = (sp.color as string) ?? "";
  const minPrice = (sp.minPrice as string) ?? "";
  const maxPrice = (sp.maxPrice as string) ?? "";
  const sort = (sp.sort as string) ?? "newest";
  const page = (sp.page as string) ?? "";

  return (
    <form className="mt-8 grid gap-3 rounded-[2rem] border border-white/60 bg-white/60 p-4 backdrop-blur md:grid-cols-6">
      <input
        name="q"
        defaultValue={q}
        placeholder={t("products.search")}
        className="md:col-span-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm"
      />
      <select name="category" defaultValue={category} className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm">
        <option value="">{t("products.allCategories")}</option>
        <option value="KIDS">{t("products.kids")}</option>
        <option value="OFFICE">{t("products.office")}</option>
        <option value="SHIRTS">{t("products.shirts")}</option>
      </select>
      <input
        name="material"
        defaultValue={material}
        placeholder={t("products.material")}
        className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm"
      />
      <input
        name="color"
        defaultValue={color}
        placeholder={t("products.color")}
        className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm"
      />
      <select name="sort" defaultValue={sort} className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm">
        <option value="newest">{t("products.sortNewest")}</option>
        <option value="price_asc">{t("products.sortPriceAsc")}</option>
        <option value="price_desc">{t("products.sortPriceDesc")}</option>
        <option value="rating">{t("products.sortRating")}</option>
      </select>
      <div className="flex gap-2 md:col-span-6">
        <input
          name="minPrice"
          defaultValue={minPrice}
          placeholder={t("products.minInr")}
          className="w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm"
        />
        <input
          name="maxPrice"
          defaultValue={maxPrice}
          placeholder={t("products.maxInr")}
          className="w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm"
        />
        <input type="hidden" name="currency" value={currency} />
        {page ? <input type="hidden" name="page" value={page} /> : null}
        <button type="submit" className="rounded-2xl bg-ink-900 px-5 py-2 text-sm font-semibold text-cream-50">
          {t("products.apply")}
        </button>
      </div>
    </form>
  );
}

export function ProductsFooter({ shown, total, pageNum }: { shown: number; total: number; pageNum: number }) {
  const { t } = useTranslation();
  return (
    <div className="mt-8 text-center text-sm text-ink-900/55">
      {t("products.showing", { shown, total, page: pageNum })}
    </div>
  );
}
