"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { apiFetch, clearTokens, getAccessToken } from "@/lib/api";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CurrencyLink } from "./CurrencyLink";
import { BobakumaLogo } from "@/components/brand/BobakumaLogo";

type Me = { user: { id: number; email: string | null; role: string; name: string | null } };

export function Navbar() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me["user"] | null | undefined>(undefined);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setMe(null);
      return;
    }
    apiFetch<Me>("/auth/me")
      .then((r) => setMe(r.user))
      .catch(() => setMe(null));
  }, [pathname]);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/products", label: t("nav.products") },
    { href: "/products?category=LUNCHBOX", label: t("nav.lunchboxes") },
    { href: "/products?category=SHIRTS", label: t("nav.shirts") },
    { href: "/cart", label: t("nav.cart") },
    { href: "/wishlist", label: t("nav.wishlist") },
    { href: "/orders", label: t("nav.orders") }
  ];

  function navItemActive(href: string) {
    const [path, qs] = href.split("?");
    if (pathname !== path) return false;
    if (!qs) return !sp.get("category");
    const want = new URLSearchParams(qs).get("category");
    return sp.get("category") === want;
  }

  const isAdmin = me?.role === "ADMIN" || me?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-pink-200/50 bg-gradient-to-r from-[#fff5fb] via-[#f0f4ff] to-[#f5f0ff] shadow-[0_8px_32px_-16px_rgba(200,160,220,0.2)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5">
        <Link href="/" className="group flex items-center" aria-label="Bobakuma — home">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 24 }}>
            <BobakumaLogo />
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <CurrencyLink
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium text-stone-600 transition hover:bg-pink-100/50 hover:text-brand-navy",
                navItemActive(l.href) && "bg-pink-100/70 text-brand-navy shadow-sm ring-1 ring-pink-200/60"
              )}
            >
              {l.label}
            </CurrencyLink>
          ))}
          {isAdmin && (
            <CurrencyLink
              href="/admin"
              className={cn(
                "ml-1 rounded-xl px-3.5 py-2 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold/10",
                pathname.startsWith("/admin") && "bg-brand-gold/15 text-brand-navy"
              )}
            >
              {t("nav.admin")}
            </CurrencyLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          {me === undefined ? null : me ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="max-w-[150px] truncate rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy-deep px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:opacity-95"
              >
                {me.name ?? me.email ?? t("nav.account")}
              </Link>
              <button
                type="button"
                className="rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-xs font-semibold text-brand-navy transition hover:bg-pink-50"
                onClick={() => {
                  clearTokens();
                  setMe(null);
                  window.location.href = "/";
                }}
              >
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-stone-200/80 bg-white px-4 py-2 text-xs font-semibold text-brand-navy transition hover:border-pink-300 hover:bg-pink-50/50"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-[#db2777] to-[#9333ea] px-4 py-2 text-xs font-semibold text-white shadow-md ring-2 ring-white transition hover:brightness-105"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-xl border border-stone-200/80 bg-white p-2.5 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg leading-none text-brand-navy">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-pink-200/40 bg-[#fffafd] backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <CurrencyLink
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy"
                >
                  {l.label}
                </CurrencyLink>
              ))}
              {isAdmin && (
                <CurrencyLink href="/admin" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-gold">
                  {t("nav.admin")}
                </CurrencyLink>
              )}
              <div className="my-2 border-t border-pink-200/50" />
              <LanguageSwitcher />
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm">
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="mx-1 rounded-xl bg-gradient-to-r from-[#db2777] to-[#9333ea] px-3 py-2.5 text-center text-sm font-semibold text-white shadow-md ring-2 ring-white"
              >
                {t("nav.register")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
