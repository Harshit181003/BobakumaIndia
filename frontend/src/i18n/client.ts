"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locales, resources } from "./resources";

const STORAGE = "bobakuma_lang";

void i18n.use(initReactI18next).init({
  resources: resources as unknown as Record<string, { translation: Record<string, unknown> }>,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", (l) => {
  if (typeof document !== "undefined") document.documentElement.lang = l;
  try {
    localStorage.setItem(STORAGE, l);
  } catch {
    /* ignore */
  }
});

export function hydrateLanguageFromStorage() {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem(STORAGE);
  if (saved && locales.includes(saved as (typeof locales)[number])) {
    void i18n.changeLanguage(saved);
  }
}

export { i18n };
