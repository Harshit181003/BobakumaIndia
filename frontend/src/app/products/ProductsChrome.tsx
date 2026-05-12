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
      <h1 className="font-display text-3xl font-medium text-brand-navy">{t("products.title")}</h1>
      <p className="mt-3 text-sm text-stone-600">{t("products.subtitle")}</p>
      {pricingNote && currency !== "INR" && (
        <p className="mt-3 rounded-2xl border border-sky-200/70 bg-sky-50/80 px-3 py-2 text-xs text-stone-700">
          {pricingNote}
        </p>
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
    <form
      action="/products"
      method="get"
      className="mt-8 grid gap-3 rounded-[2rem] border border-pink-200/50 bg-white p-4 shadow-sm md:grid-cols-6"
    >
      <input
        name="q"
        defaultValue={q}
        placeholder={t("products.search")}
        className="md:col-span-2 rounded-2xl border border-stone-200/80 bg-[#fffafd] px-3 py-2 text-sm text-brand-navy placeholder:text-stone-400"
      />
      <select
        name="category"
        defaultValue={category}
        className="rounded-2xl border border-stone-200/80 bg-[#fffafd] px-3 py-2 text-sm text-brand-navy"
      >
        <option value="">{t("products.allCategories")}</option>
        <option value="LUNCHBOX">{t("products.lunchboxesCategory")}</option>
        <option value="KIDS">{t("products.kids")}</option>
        <option value="OFFICE">{t("products.office")}</option>
        <option value="SHIRTS">{t("products.shirts")}</option>
      </select>
      <input
        name="material"
        defaultValue={material}
        placeholder={t("products.material")}
        className="rounded-2xl border border-stone-200/80 bg-[#fffafd] px-3 py-2 text-sm text-brand-navy placeholder:text-stone-400"
      />
      <input
        name="color"
        defaultValue={color}
        placeholder={t("products.color")}
        className="rounded-2xl border border-stone-200/80 bg-[#fffafd] px-3 py-2 text-sm text-brand-navy placeholder:text-stone-400"
      />
      <select
        name="sort"
        defaultValue={sort}
        className="rounded-2xl border border-stone-200/80 bg-[#fffafd] px-3 py-2 text-sm text-brand-navy"
      >
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
          className="w-full rounded-2xl border border-stone-200/80 bg-[#fffafd] px-3 py-2 text-sm text-brand-navy placeholder:text-stone-400"
        />
        <input
          name="maxPrice"
          defaultValue={maxPrice}
          placeholder={t("products.maxInr")}
          className="w-full rounded-2xl border border-stone-200/80 bg-[#fffafd] px-3 py-2 text-sm text-brand-navy placeholder:text-stone-400"
        />
        <input type="hidden" name="currency" value={currency} />
        {page ? <input type="hidden" name="page" value={page} /> : null}
        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-[#7c6bcf] to-[#5b8bd9] px-5 py-2 text-sm font-semibold text-white shadow-md"
        >
          {t("products.apply")}
        </button>
      </div>
    </form>
  );
}

export function ProductsFooter({ shown, total, pageNum }: { shown: number; total: number; pageNum: number }) {
  const { t } = useTranslation();
  return (
    <div className="mt-8 text-center text-sm text-stone-600">
      {t("products.showing", { shown, total, page: pageNum })}
    </div>
  );
}
