"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CurrencyLink } from "./CurrencyLink";
import { BobakumaLogo } from "@/components/brand/BobakumaLogo";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const shop = [
    { href: "/products", label: t("nav.products") },
    { href: "/products?category=LUNCHBOX", label: t("nav.lunchboxes") },
    { href: "/products?category=SHIRTS", label: t("nav.shirts") },
    { href: "/cart", label: t("nav.cart") },
    { href: "/wishlist", label: t("nav.wishlist") },
    { href: "/orders", label: t("nav.orders") }
  ];

  const explore = [
    { href: "/login", label: t("nav.login") },
    { href: "/register", label: t("nav.register") },
    { href: "/account", label: t("nav.account") }
  ];

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-pink-200/40 bg-gradient-to-b from-[#fffafd] via-[#f5f0ff] to-[#eef8ff]">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-brand-sage/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div>
              <BobakumaLogo alwaysShowWordmark iconClassName="h-11 w-11 sm:h-12 sm:w-12" className="items-start" />
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f8578]">
                {t("footer.elevate")}
              </p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-600">{t("footer.brandLine")}</p>
            <p className="mt-6 text-xs leading-relaxed text-stone-500">{t("footer.refsBody")}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy/80">{t("footer.shopTitle")}</h3>
              <ul className="mt-4 space-y-2.5">
                {shop.map((item) => (
                  <li key={item.href}>
                    <CurrencyLink
                      href={item.href}
                      className="text-sm text-stone-600 transition hover:text-[#7c6bcf]"
                    >
                      {item.label}
                    </CurrencyLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy/80">{t("footer.companyTitle")}</h3>
              <ul className="mt-4 space-y-2.5">
                {explore.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-stone-600 transition hover:text-[#7c6bcf]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy/80">{t("footer.refsTitle")}</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href="https://github.com/Harshit181003/BobakumaIndia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-600 transition hover:text-[#7c6bcf]"
                  >
                    {t("footer.sourceCode")}
                  </a>
                </li>
                <li>
                  <span className="text-sm text-stone-500">Next.js · React · Express · MySQL</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-pink-200/40 pt-8 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Bobakuma India. {t("footer.rightsReserved")}
          </p>
          <p className="max-w-md text-stone-500">
            Trademarks belong to their owners. Product names are for identification only.
          </p>
        </div>
      </div>
    </footer>
  );
}
