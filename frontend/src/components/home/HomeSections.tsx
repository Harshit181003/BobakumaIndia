/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "@/lib/api";

export type FeaturedItem = {
  id: number;
  name: string;
  slug: string;
  effectivePricePaise: number;
  imageUrl: string | null;
  discountPercent: number;
};

export function OffersBanner() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blush-100 via-peach-50 to-lavender-100 p-6 shadow-soft md:p-8"
      >
        <div className="relative z-10 max-w-xl">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-900/55">{t("nav.offers")}</div>
          <h2 className="mt-2 text-2xl font-semibold text-ink-900 md:text-3xl">{t("home.offerTitle")}</h2>
          <p className="mt-2 text-sm text-ink-900/70 md:text-base">{t("home.offerBody")}</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-3xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-soft"
          >
            {t("nav.products")}
          </Link>
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

export function FeaturedCarousel({ items }: { items: FeaturedItem[] }) {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold text-ink-900">{t("home.featured")}</h2>
        <Link href="/products" className="text-sm font-semibold text-lavender-500 hover:underline">
          View all
        </Link>
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
            <Link
              href={`/products/${p.slug}`}
              className="group block overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-soft backdrop-blur"
            >
              <div className="relative aspect-square bg-cream-100">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="240px" />
                ) : null}
                {p.discountPercent > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2 py-1 text-[10px] font-bold text-cream-50">
                    -{p.discountPercent}%
                  </span>
                )}
              </div>
              <div className="space-y-1 p-4">
                <div className="line-clamp-2 text-sm font-semibold text-ink-900">{p.name}</div>
                <div className="text-sm font-bold text-ink-900">₹{(p.effectivePricePaise / 100).toFixed(0)}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const gallerySrc = [
  "https://images.unsplash.com/photo-1543363136-5ae0b0077b99?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1524594081293-190a2fe0baae?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604909053278-9f5183e46b25?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=600&q=80"
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
            try {
              await apiFetch("/newsletter", { method: "POST", body: JSON.stringify({ email, language: i18n.language }) });
              setDone(true);
              setEmail("");
            } catch {
              setDone(true);
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
        {done && <p className="mt-2 text-xs font-semibold text-peach-500">You’re in — pastel perks incoming.</p>}
      </motion.div>
    </section>
  );
}
