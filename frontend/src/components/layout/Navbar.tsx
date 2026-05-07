"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { apiFetch, clearTokens, getAccessToken } from "@/lib/api";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Me = { user: { id: number; email: string | null; role: string; name: string | null } };

export function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
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
    { href: "/cart", label: t("nav.cart") },
    { href: "/wishlist", label: t("nav.wishlist") },
    { href: "/orders", label: t("nav.orders") }
  ];

  const isAdmin = me?.role === "ADMIN" || me?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-cream-50/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-100 to-lavender-100 text-sm font-black text-ink-900 shadow-soft"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            B
          </motion.span>
          <span className="text-sm font-semibold tracking-tight text-ink-900">Bobakuma</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-2xl px-3 py-2 text-sm font-medium text-ink-900/70 hover:bg-white/60 hover:text-ink-900",
                pathname === l.href && "bg-white/70 text-ink-900 shadow-sm"
              )}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "rounded-2xl px-3 py-2 text-sm font-semibold text-lavender-500 hover:bg-white/60",
                pathname.startsWith("/admin") && "bg-white/70 shadow-sm"
              )}
            >
              {t("nav.admin")}
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {me === undefined ? null : me ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="max-w-[140px] truncate rounded-2xl bg-ink-900 px-3 py-2 text-xs font-semibold text-cream-50 shadow-soft"
              >
                {me.name ?? me.email ?? t("nav.account")}
              </Link>
              <button
                type="button"
                className="rounded-2xl bg-white/70 px-3 py-2 text-xs font-semibold text-ink-900 shadow-sm"
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
                className="rounded-2xl bg-white/70 px-3 py-2 text-xs font-semibold text-ink-900 shadow-sm"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="rounded-2xl bg-ink-900 px-3 py-2 text-xs font-semibold text-cream-50 shadow-soft"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-2xl border border-white/60 bg-white/70 p-2 md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg">☰</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/40 bg-cream-50/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-2xl px-3 py-2 text-sm">
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)} className="rounded-2xl px-3 py-2 text-sm font-semibold">
                {t("nav.admin")}
              </Link>
            )}
            <LanguageSwitcher />
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl px-3 py-2 text-sm">
              {t("nav.login")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
