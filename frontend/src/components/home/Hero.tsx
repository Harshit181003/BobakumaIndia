/* eslint-disable @next/next/no-img-element */
"use client";

import { CurrencyLink } from "@/components/layout/CurrencyLink";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";

function FloatingDot({
  className,
  delay
}: {
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

export function Hero() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-float", { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-mint-100/60 bg-white/80 px-4 py-2 shadow-soft backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-mint-500" />
              <span className="text-sm font-medium text-ink-900">{t("home.heroBadge")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.05 }}
              className="mt-6 text-balance text-4xl font-semibold tracking-tight text-ink-900 md:text-6xl"
            >
              {t("home.heroTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-900/70 md:text-lg"
            >
              {t("home.heroBody")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="hero-float mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <CurrencyLink
                href="/products"
                className="inline-flex justify-center rounded-3xl bg-ink-900 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:translate-y-[-1px] hover:bg-ink-900/90 active:translate-y-0"
              >
                {t("home.shopCta")}
              </CurrencyLink>
              <CurrencyLink
                href="/products?category=KIDS"
                className="inline-flex justify-center rounded-3xl bg-white/70 px-6 py-3 text-sm font-semibold text-ink-900 shadow-soft backdrop-blur transition hover:translate-y-[-1px] hover:bg-white/90 active:translate-y-0"
              >
                {t("home.cuteCta")}
              </CurrencyLink>
              <CurrencyLink
                href="/products?category=SHIRTS"
                className="inline-flex justify-center rounded-3xl border border-mint-100/70 bg-mint-50/80 px-6 py-3 text-sm font-semibold text-ink-900 shadow-soft transition hover:translate-y-[-1px] active:translate-y-0"
              >
                {t("home.shopShirts")}
              </CurrencyLink>
            </motion.div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-md rounded-[2rem] border border-mint-100/50 bg-gradient-to-br from-white/90 to-mint-50/80 p-6 shadow-soft backdrop-blur">
              <FloatingDot className="absolute -left-6 top-12 h-10 w-10 rounded-full bg-mint-100 blur-[1px]" delay={0} />
              <FloatingDot className="absolute -right-8 top-24 h-14 w-14 rounded-full bg-peach-100 blur-[1px]" delay={0.6} />
              <FloatingDot className="absolute bottom-10 left-6 h-12 w-12 rounded-full bg-blush-100 blur-[1px]" delay={1.2} />

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="hero-float grid h-full place-items-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, -1.2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <img
                    alt="Stacked white bento lunchbox"
                    src="https://images.unsplash.com/photo-1587734193613-12eaf7e0e4d1?auto=format&fit=crop&w=900&q=80"
                    className="h-64 w-64 rounded-3xl object-cover shadow-soft ring-2 ring-mint-100/80 md:h-72 md:w-72"
                  />
                  <div className="pointer-events-none absolute -bottom-6 left-1/2 w-[88%] -translate-x-1/2 rounded-3xl border border-mint-100/60 bg-white/90 p-4 shadow-soft backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-ink-900">{t("home.heroCardTitle")}</div>
                        <div className="text-xs text-ink-900/60">{t("home.heroCardSub")}</div>
                      </div>
                      <div className="rounded-2xl bg-mint-100 px-3 py-2 text-sm font-semibold text-ink-900">
                        {t("home.heroCardFrom")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

