/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "@/lib/api";
import { CurrencyLink } from "@/components/layout/CurrencyLink";
import { PriceWithCurrencySelect } from "@/components/shop/PriceWithCurrencySelect";
import type { MarketCurrency } from "@/lib/currency";

export type FeaturedItem = {
  id: number;
  name: string;
  slug: string;
  effectivePricePaise: number;
  imageUrl: string | null;
  discountPercent: number;
  displayPrice?: { formatted: string; currency: string };
};

export function OffersBanner() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-mint-50 via-peach-50 to-blush-100 p-6 shadow-soft md:p-8"
      >
        <div className="relative z-10 max-w-xl">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-900/55">{t("nav.offers")}</div>
          <h2 className="mt-2 text-2xl font-semibold text-ink-900 md:text-3xl">{t("home.offerTitle")}</h2>
          <p className="mt-2 text-sm text-ink-900/70 md:text-base">{t("home.offerBody")}</p>
          <CurrencyLink
            href="/products"
            className="mt-4 inline-flex rounded-3xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-soft"
          >
            {t("nav.products")}
          </CurrencyLink>
        </div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/50 blur-2xl"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

export function FeaturedCarousel({
  items,
  currency = "INR",
  titleKey = "home.featured",
  shopHref = "/products"
}: {
  items: FeaturedItem[];
  currency?: string;
  titleKey?: string;
  shopHref?: string;
}) {
  const { t } = useTranslation();
  const curQs = currency && currency !== "INR" ? `?currency=${currency}` : "";
  const cur = currency as MarketCurrency;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold text-ink-900">{t(titleKey)}</h2>
        <CurrencyLink href={shopHref} className="text-sm font-semibold text-lavender-500 hover:underline">
          {t("home.viewAll")}
        </CurrencyLink>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="min-w-[240px] max-w-[240px]"
          >
            <div className="group overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-soft backdrop-blur">
              <CurrencyLink href={`/products/${p.slug}${curQs}`} className="block">
                <div className="relative aspect-square bg-cream-100">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="240px"
                    />
                  ) : null}
                  {p.discountPercent > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2 py-1 text-[10px] font-bold text-cream-50">
                      -{p.discountPercent}%
                    </span>
                  )}
                </div>
              </CurrencyLink>
              <div className="space-y-2 p-4">
                <CurrencyLink href={`/products/${p.slug}${curQs}`} className="line-clamp-2 block text-sm font-semibold text-ink-900 hover:underline">
                  {p.name}
                </CurrencyLink>
                <PriceWithCurrencySelect
                  displayFormatted={p.displayPrice?.formatted ?? `₹${(p.effectivePricePaise / 100).toFixed(0)}`}
                  serverCurrency={cur}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CollectionsRow() {
  const { t, i18n } = useTranslation();
  const collections = useMemo(
    () =>
      [
        {
          key: "original",
          title: t("home.colOriginal"),
          subtitle: t("home.colOriginalSub"),
          href: "/products",
          bg: "from-blush-50 via-white to-mint-50",
          img: "https://images.unsplash.com/photo-1587734193613-12eaf7e0e4d1?auto=format&fit=crop&w=800&q=80"
        },
        {
          key: "positive",
          title: t("home.colPositive"),
          subtitle: t("home.colPositiveSub"),
          href: "/products?category=OFFICE",
          bg: "from-mint-50 via-white to-lavender-50",
          img: "https://images.unsplash.com/photo-1524594081293-190a2fe0baae?auto=format&fit=crop&w=800&q=80"
        },
        {
          key: "graphic",
          title: t("home.colGraphic"),
          subtitle: t("home.colGraphicSub"),
          href: "/products?category=KIDS",
          bg: "from-peach-50 via-white to-blush-50",
          img: "https://images.unsplash.com/photo-1594398907494-9f3f9d6949b8?auto=format&fit=crop&w=800&q=80"
        },
        {
          key: "kids",
          title: t("home.colKids"),
          subtitle: t("home.colKidsSub"),
          href: "/products?category=KIDS",
          bg: "from-lavender-50 via-white to-mint-50",
          img: "https://images.unsplash.com/photo-1543363136-5ae0b0077b99?auto=format&fit=crop&w=800&q=80"
        },
        {
          key: "shirts",
          title: t("home.colShirts"),
          subtitle: t("home.colShirtsSub"),
          href: "/products?category=SHIRTS",
          bg: "from-peach-50 via-white to-lavender-50",
          img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
        },
        {
          key: "accessories",
          title: t("home.colAccessories"),
          subtitle: t("home.colAccessoriesSub"),
          href: "/products",
          bg: "from-cream-100 via-white to-peach-50",
          img: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=800&q=80"
        }
      ] as const,
    [t, i18n.language]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-900/45">{t("home.rangeLabel")}</div>
          <h2 className="mt-2 text-2xl font-semibold text-ink-900 md:text-3xl">{t("home.pickVibe")}</h2>
        </div>
        <CurrencyLink href="/products" className="text-sm font-semibold text-ink-900/60 hover:text-ink-900 hover:underline">
          {t("home.viewAll")}
        </CurrencyLink>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {collections.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <CurrencyLink
              href={c.href}
              className={`group relative block overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br ${c.bg} p-4 shadow-soft`}
            >
              <div className="text-sm font-semibold text-ink-900">{c.title}</div>
              <div className="mt-0.5 text-xs text-ink-900/55">{c.subtitle}</div>
              <div className="pointer-events-none absolute bottom-2 right-2 h-16 w-16 overflow-hidden rounded-2xl bg-white/70 shadow-sm">
                <img src={c.img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <span className="absolute bottom-3 left-4 inline-flex items-center rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold text-ink-900/70 backdrop-blur">
                {t("home.explore")}
              </span>
            </CurrencyLink>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SizeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7 text-ink-900/70" fill="none" aria-hidden>
      <path
        d="M12 17c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v18c0 2.2-1.8 4-4 4H16c-2.2 0-4-1.8-4-4V17Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16 13v-1c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v1" stroke="currentColor" strokeWidth="2" />
      <path d="M16 23h16" stroke="currentColor" strokeWidth="2" opacity="0.55" />
    </svg>
  );
}

export function SizesRow() {
  const { t, i18n } = useTranslation();
  const sizes = useMemo(
    () =>
      [
        { key: "XS", cap: "300 ml", note: t("home.sizeSnacks") },
        { key: "S", cap: "500 ml", note: t("home.sizeLight") },
        { key: "M", cap: "800 ml", note: t("home.sizeDaily") },
        { key: "L", cap: "1.2 L", note: t("home.sizeBig") },
        { key: "XL", cap: "1.7 L", note: t("home.sizeFamily") },
        { key: "XXL", cap: "2.6 L", note: t("home.sizeMealprep") }
      ] as const,
    [t, i18n.language]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-soft backdrop-blur md:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-900/45">{t("home.everySize")}</div>
            <h3 className="mt-1 text-xl font-semibold text-ink-900">{t("home.forEveryNeed")}</h3>
          </div>
          <CurrencyLink href="/products" className="text-sm font-semibold text-ink-900/55 hover:text-ink-900 hover:underline">
            {t("home.seeSizes")}
          </CurrencyLink>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {sizes.map((s) => (
            <div key={s.key} className="rounded-3xl border border-white/70 bg-white/80 p-4 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-2xl bg-mint-50">
                <SizeIcon />
              </div>
              <div className="mt-2 text-sm font-extrabold text-ink-900">{s.key}</div>
              <div className="text-xs font-semibold text-ink-900/60">{s.cap}</div>
              <div className="mt-1 text-[11px] text-ink-900/50">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromoTiles() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      <div className="grid gap-4 md:grid-cols-3">
        <CurrencyLink
          href="/products"
          className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-peach-50 via-white to-mint-50 p-6 shadow-soft"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-ink-900/45">{t("home.mixMatch")}</div>
          <div className="mt-2 text-xl font-semibold text-ink-900">{t("home.buildSet")}</div>
          <p className="mt-2 text-sm text-ink-900/65">{t("home.buildSetBody")}</p>
          <span className="mt-4 inline-flex rounded-2xl bg-ink-900 px-4 py-2 text-xs font-semibold text-cream-50">
            {t("home.tryNow")}
          </span>
          <img
            alt=""
            src="https://images.unsplash.com/photo-1615485920415-680443d9688c?auto=format&fit=crop&w=800&q=80"
            className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 rotate-6 rounded-3xl object-cover shadow-soft transition duration-500 group-hover:scale-105"
          />
        </CurrencyLink>

        <CurrencyLink
          href="/products?category=OFFICE"
          className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-lavender-50 via-white to-blush-50 p-6 shadow-soft"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-ink-900/45">{t("home.corpGift")}</div>
          <div className="mt-2 text-xl font-semibold text-ink-900">{t("home.giftBoxes")}</div>
          <p className="mt-2 text-sm text-ink-900/65">{t("home.giftBoxesBody")}</p>
          <span className="mt-4 inline-flex rounded-2xl bg-white/80 px-4 py-2 text-xs font-semibold text-ink-900 shadow-sm">
            {t("home.exploreBtn")}
          </span>
          <img
            alt=""
            src="https://images.unsplash.com/photo-1524594081293-190a2fe0baae?auto=format&fit=crop&w=800&q=80"
            className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 -rotate-6 rounded-3xl object-cover shadow-soft transition duration-500 group-hover:scale-105"
          />
        </CurrencyLink>

        <CurrencyLink
          href="/products?category=KIDS"
          className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-mint-50 via-white to-cream-100 p-6 shadow-soft"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-ink-900/45">{t("home.communityTag")}</div>
          <div className="mt-2 text-xl font-semibold text-ink-900">{t("home.communityTitle")}</div>
          <p className="mt-2 text-sm text-ink-900/65">{t("home.communityBody")}</p>
          <span className="mt-4 inline-flex rounded-2xl bg-mint-100 px-4 py-2 text-xs font-semibold text-ink-900">
            {t("home.viewPosts")}
          </span>
          <img
            alt=""
            src="https://images.unsplash.com/photo-1543363136-5ae0b0077b99?auto=format&fit=crop&w=800&q=80"
            className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 rotate-3 rounded-3xl object-cover shadow-soft transition duration-500 group-hover:scale-105"
          />
        </CurrencyLink>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M20 7 10.5 16.5 4 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UspsRow() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            title: t("home.uspLeakTitle"),
            body: t("home.uspLeakBody"),
            bg: "from-mint-50 via-white to-cream-50"
          },
          {
            title: t("home.uspEcoTitle"),
            body: t("home.uspEcoBody"),
            bg: "from-cream-50 via-white to-lavender-50"
          },
          {
            title: t("home.uspPremiumTitle"),
            body: t("home.uspPremiumBody"),
            bg: "from-blush-50 via-white to-peach-50"
          }
        ].map((x, i) => (
          <motion.div
            key={x.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-[2rem] border border-white/70 bg-gradient-to-br ${x.bg} p-6 shadow-soft`}
          >
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 text-ink-900/70 shadow-soft">
                <CheckIcon />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight text-ink-900">{x.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-900/70">{x.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ChoosingGuide() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur md:p-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-900/45">{t("home.guideLabel")}</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">{t("home.guideTitle")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-900/70">
              {t("home.guideBody")}
            </p>
          </div>
          <CurrencyLink href="/products" className="text-sm font-semibold text-lavender-500 hover:underline">
            {t("home.guideShopAll")}
          </CurrencyLink>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: t("home.guideKidsTitle"), body: t("home.guideKidsBody"), href: "/products?category=KIDS" },
            { title: t("home.guideOfficeTitle"), body: t("home.guideOfficeBody"), href: "/products?category=OFFICE" },
            { title: t("home.guideAccessoriesTitle"), body: t("home.guideAccessoriesBody"), href: "/products" }
          ].map((x) => (
            <CurrencyLink
              key={x.title}
              href={x.href}
              className="group rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft transition hover:translate-y-[-1px]"
            >
              <div className="text-lg font-semibold text-ink-900">{x.title}</div>
              <div className="mt-2 text-sm text-ink-900/65">{x.body}</div>
              <div className="mt-4 text-xs font-bold uppercase tracking-widest text-ink-900/45 group-hover:text-ink-900/60">
                {t("home.explore")}
              </div>
            </CurrencyLink>
          ))}
        </div>
      </div>
    </section>
  );
}

const easyRecipes = [
  { title: "3‑ingredient veggie wrap", time: "6 min", note: "Stays fresh, packs flat." },
  { title: "Paneer + fruit box", time: "8 min", note: "Protein + sweet, kid‑friendly." },
  { title: "Cold pasta (no‑mess)", time: "10 min", note: "Great for office + school." },
  { title: "Idli snack set", time: "7 min", note: "Mini idlis + dip + fruit." }
];

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M9 7.6v8.8c0 .8.9 1.3 1.6.9l7-4.4c.7-.4.7-1.4 0-1.8l-7-4.4c-.7-.4-1.6.1-1.6.9Z" />
    </svg>
  );
}

const videoReviews = [
  {
    name: "Ananya",
    rating: 5,
    label: "No leaks in the school bag.",
    poster: "/hero-1.jpg"
  },
  {
    name: "Rahul",
    rating: 5,
    label: "Looks premium on my desk.",
    poster: "/hero-2.jpg"
  },
  {
    name: "Meera",
    rating: 4,
    label: "Easy to pack, easy to clean.",
    poster: "/family.jpg"
  }
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5 text-ink-900">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "opacity-90" : "opacity-25"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function VideoReviewsRow() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-900/45">{t("home.videoReviewsLabel")}</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">{t("home.videoReviewsTitle")}</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-900/70">{t("home.videoReviewsBody")}</p>
        </div>
        <CurrencyLink href="/products" className="text-sm font-semibold text-lavender-500 hover:underline">
          {t("home.videoReviewsCta")}
        </CurrencyLink>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {videoReviews.map((r, i) => (
          <motion.button
            key={r.name}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 text-left shadow-soft backdrop-blur"
            onClick={() => alert("Video reviews coming next — we’ll plug real customer clips here.")}
          >
            <div className="relative aspect-[4/3] bg-cream-100">
              <img src={r.poster} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-ink-900 shadow-soft backdrop-blur">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-900 text-cream-50">
                  <PlayIcon />
                </span>
                Video
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-ink-900">{r.name}</div>
                <Stars n={r.rating} />
              </div>
              <div className="mt-2 text-sm text-ink-900/70">&ldquo;{r.label}&rdquo;</div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export function RecipesRow() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-ink-900/45">{t("home.recipesLabel")}</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">{t("home.recipesTitle")}</h2>
        </div>
        <span className="text-sm font-semibold text-ink-900/55">{t("home.recipesFreeBook")}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-mint-50 via-white to-cream-50 p-7 shadow-soft">
          <div className="text-lg font-semibold text-ink-900">{t("home.recipesBlockTitle")}</div>
          <p className="mt-2 text-sm leading-relaxed text-ink-900/70">
            {t("home.recipesBlockBody")}
          </p>
          <div className="mt-5 grid gap-3">
            {easyRecipes.slice(0, 2).map((r) => (
              <div key={r.title} className="rounded-3xl border border-white/70 bg-white/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-ink-900">{r.title}</div>
                  <div className="text-xs font-bold text-ink-900/45">{r.time}</div>
                </div>
                <div className="mt-1 text-xs text-ink-900/60">{r.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/70 p-7 shadow-soft backdrop-blur">
          <div className="text-lg font-semibold text-ink-900">{t("home.recipesWeekTitle")}</div>
          <div className="mt-4 grid gap-3">
            {easyRecipes.slice(2).map((r) => (
              <div key={r.title} className="rounded-3xl border border-white/70 bg-white/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-ink-900">{r.title}</div>
                  <div className="text-xs font-bold text-ink-900/45">{r.time}</div>
                </div>
                <div className="mt-1 text-xs text-ink-900/60">{r.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-white/70 bg-gradient-to-br from-lavender-50 via-white to-blush-50 p-5">
            <div className="text-sm font-semibold text-ink-900">{t("home.recipesWantCodeTitle")}</div>
            <p className="mt-1 text-xs text-ink-900/65">
              {t("home.recipesWantCodeBody")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const gallerySrc = [
  "/ref.jpg",
  "/hero-1.jpg",
  "/hero-2.jpg",
  "/family.jpg",
  "https://images.unsplash.com/photo-1594398907494-9f3f9d6949b8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1543363136-5ae0b0077b99?auto=format&fit=crop&w=600&q=80"
];

export function InstagramGallery() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-semibold text-ink-900">{t("home.gallery")}</h2>
      <div className="columns-2 gap-3 md:columns-3">
        {gallerySrc.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="mb-3 break-inside-avoid overflow-hidden rounded-3xl bg-white/60 shadow-soft"
          >
            <img src={src} alt="" className="w-full object-cover" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Ananya", text: "My daughter actually eats her veggies now — the compartments are perfect." },
  { name: "Rahul", text: "Office-friendly, doesn’t leak, and looks premium on my desk." },
  { name: "Meera", text: "Gifted two for birthdays — huge smiles. Packaging felt luxe." }
];

export function Testimonials() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-semibold text-ink-900">{t("home.testimonials")}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((x, i) => (
          <motion.div
            key={x.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur"
          >
            <p className="text-sm text-ink-900/80">&ldquo;{x.text}&rdquo;</p>
            <div className="mt-3 text-xs font-bold text-ink-900/50">— {x.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur md:p-10"
      >
        <h2 className="text-xl font-semibold text-ink-900 md:text-2xl">{t("home.newsletterTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm text-ink-900/70">{t("home.newsletterHint")}</p>
        <form
          className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            try {
              await apiFetch("/newsletter", {
                method: "POST",
                body: JSON.stringify({ email: email.trim(), language: i18n.resolvedLanguage ?? i18n.language })
              });
              setDone(true);
              setEmail("");
            } catch {
              setErr(t("home.newsletterError"));
            }
          }}
        >
          <input
            className="flex-1 rounded-3xl border border-white/70 bg-white/90 px-4 py-3 text-sm outline-none"
            placeholder={t("home.newsletterPlaceholder")}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="rounded-3xl bg-ink-900 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft">
            {t("home.subscribe")}
          </button>
        </form>
        {done && !err && <p className="mt-2 text-xs font-semibold text-mint-500">{t("home.newsletterSuccess")}</p>}
        {err && <p className="mt-2 text-xs font-semibold text-peach-500">{err}</p>}
      </motion.div>
    </section>
  );
}
