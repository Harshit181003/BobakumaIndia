import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/support/Chatbot";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Bobakuma India — Lunchboxes",
  description: "Cute, premium lunchboxes for kids, parents, office users, and gifting.",
  metadataBase: new URL(process.env.APP_PUBLIC_URL ?? "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="sticky top-0 z-50 h-[58px] border-b border-white/40 bg-cream-50/75 backdrop-blur-xl" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Suspense fallback={<div className="mt-16 h-[120px] border-t border-white/50 bg-white/40 backdrop-blur" />}>
              <Footer />
            </Suspense>
            <Chatbot />
          </div>
        </Providers>
      </body>
    </html>
  );
}

