"use client";

import { locales } from "@/i18n/resources";
import { useTranslation } from "react-i18next";

const labels: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  gu: "ગુજરાતી",
  ta: "தமிழ்",
  te: "తెలుగు",
  bn: "বাংলা",
  pa: "ਪੰਜਾਬੀ",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語"
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const raw = i18n.resolvedLanguage ?? i18n.language ?? "en";
  const current = raw.split("-")[0] ?? "en";
  const value = locales.includes(current as (typeof locales)[number]) ? current : "en";
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
      <span className="hidden sm:inline">Lang</span>
      <select
        className="rounded-2xl border border-pink-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-navy shadow-sm outline-none ring-0"
        value={value}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {labels[l] ?? l}
          </option>
        ))}
      </select>
    </label>
  );
}
