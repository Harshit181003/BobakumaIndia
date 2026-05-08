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

const gallerySrc = [
  "https://images.unsplash.com/photo-1587734193613-12eaf7e0e4d1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1615485920415-680443d9688c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
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
