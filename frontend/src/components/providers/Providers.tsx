"use client";

import { ThemeProvider } from "next-themes";
import { I18nextProvider } from "react-i18next";
import { useEffect } from "react";
import { hydrateLanguageFromStorage, i18n } from "@/i18n/client";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateLanguageFromStorage();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}
