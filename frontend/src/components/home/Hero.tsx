/* eslint-disable @next/next/no-img-element */
"use client";

import { CurrencyLink } from "@/components/layout/CurrencyLink";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 3c-4 2.5-6 6.5-6 11a6 6 0 1 0 12 0c0-4.5-2-8.5-6-11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ThermoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M10 10V4a2 2 0 1 1 4 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M10 10h4v8a3 3 0 1 1-4 0v-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 3 5 6v5c0 5 3.5 9 7 10 3.5-1 7-5 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrustIcon({ type }: { type: "bag" | "globe" | "lock" | "leaf" }) {
  const cls = "h-5 w-5 text-[#7c6bcf]";
  if (type === "leaf") return <LeafIcon className={cls} />;
  if (type === "lock")
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  if (type === "bag")
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
        <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M5 10h14l-1 12H6L5 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HeroTrustBar() {
  const { t } = useTranslation();
  const items = [
    { icon: "leaf" as const, title: t("home.trustHealthy"), sub: t("home.trustHealthySub") },
    { icon: "bag" as const, title: t("home.trustModern"), sub: t("home.trustModernSub") },
    { icon: "lock" as const, title: t("home.trustLeak"), sub: t("home.trustLeakSub") },
    { icon: "globe" as const, title: t("home.trustAnywhere"), sub: t("home.trustAnywhereSub") }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35 }}
      className="relative z-10 mx-auto mt-12 max-w-6xl px-4"
    >
      <div className="grid gap-px overflow-hidden rounded-3xl border border-pink-200/50 bg-pink-100/30 shadow-[0_16px_48px_-20px_rgba(180,140,200,0.35)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3 bg-white/95 px-5 py-4 backdrop-blur-sm transition-colors hover:bg-[#fffafd]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lavender-200/80 bg-lavender-50">
              <TrustIcon type={item.icon} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-navy">{item.title}</div>
              <div className="mt-0.5 text-xs text-stone-600">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <LeafIcon className="h-6 w-6 text-[#7c6bcf]" />,
      title: t("home.heroFeatureBpa"),
      sub: t("home.heroFeatureBpaSub")
    },
    {
      icon: <ThermoIcon className="h-6 w-6 text-[#7c6bcf]" />,
      title: t("home.heroFeatureInsulated"),
      sub: t("home.heroFeatureInsulatedSub")
    },
    {
      icon: <ShieldIcon className="h-6 w-6 text-[#7c6bcf]" />,
      title: t("home.heroFeatureDurable"),
      sub: t("home.heroFeatureDurableSub")
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8fc] via-[#f3f4ff] to-[#eef8ff] pb-6 pt-8 md:pb-10 md:pt-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237c6bcf' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-600"
            >
              {t("home.heroEyebrow")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="mt-4 font-display text-balance text-4xl font-medium leading-[1.08] text-brand-navy md:text-5xl lg:text-[3.25rem]"
            >
              <span className="block">{t("home.heroTitleLead")}</span>
              <span className="mt-1 block bg-gradient-to-r from-[#db2777] via-[#c084fc] to-[#5b8bd9] bg-clip-text text-transparent">
                {t("home.heroTitleAccent")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-stone-700 md:text-lg"
            >
              {t("home.heroSubtitle")}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {features.map((f) => (
                <li
                  key={f.title}
                  className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-pink-200/60 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-lavender-200/80 bg-lavender-50">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-brand-navy">{f.title}</div>
                    <div className="text-[11px] text-stone-600">{f.sub}</div>
                  </div>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <CurrencyLink
                href="/products?category=LUNCHBOX"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7c6bcf] to-[#5b8bd9] px-8 py-3.5 text-sm font-semibold text-white shadow-lg ring-2 ring-white/60 transition hover:brightness-105 active:translate-y-0"
              >
                {t("home.heroShopCollection")}
                <span aria-hidden>→</span>
              </CurrencyLink>
              <CurrencyLink
                href="/products?category=KIDS"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-pink-300/70 bg-white px-6 py-3.5 text-sm font-semibold text-brand-navy shadow-sm transition hover:bg-pink-50"
              >
                {t("home.cuteCta")}
              </CurrencyLink>
            </motion.div>
          </div>

          <div className="relative order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-lg"
            >
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-pink-200/50 via-lavender-200/40 to-sky-200/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.25rem] border border-pink-200/50 bg-white shadow-[0_28px_70px_-24px_rgba(120,90,180,0.35)] ring-1 ring-white">
                <div className="aspect-square p-4 sm:p-6 md:aspect-[1.05]">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative h-full w-full"
                  >
                    <img
                      alt={t("home.heroImageAlt")}
                      src="/hero-1.jpeg"
                      className="h-full w-full rounded-[1.75rem] object-cover shadow-inner"
                    />
                    <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-2xl border border-pink-200/60 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-brand-navy">{t("home.heroCardTitle")}</div>
                          <div className="text-xs text-stone-600">{t("home.heroCardSub")}</div>
                        </div>
                        <div className="shrink-0 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 px-3 py-2 text-sm font-bold text-brand-navy ring-1 ring-amber-200/80">
                          {t("home.heroCardFrom")}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <HeroTrustBar />
    </section>
  );
}
