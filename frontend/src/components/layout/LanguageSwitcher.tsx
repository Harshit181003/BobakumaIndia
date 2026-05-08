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
    <label className="flex items-center gap-2 text-xs font-medium text-ink-900/70">
      <span className="hidden sm:inline">Lang</span>
      <select
        className="rounded-2xl border border-white/60 bg-white/70 px-2 py-1 text-xs font-semibold text-ink-900 shadow-sm outline-none backdrop-blur"
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
