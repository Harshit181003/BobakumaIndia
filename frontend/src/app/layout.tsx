import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/support/Chatbot";
import { Suspense } from "react";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Bobakuma — Premium lunchboxes & bottles",
  description: "Modern bento lunchboxes and insulated bottles for school, work, and everyday life.",
  metadataBase: new URL(process.env.APP_PUBLIC_URL ?? "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontDisplay.variable} min-h-screen font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="sticky top-0 z-50 h-16 border-b border-stone-200/60 bg-brand-sand/90 backdrop-blur-xl" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Suspense fallback={<div className="mt-20 h-48 border-t border-stone-200/50 bg-white/50 backdrop-blur" />}>
              <Footer />
            </Suspense>
            <Chatbot />
          </div>
        </Providers>
      </body>
    </html>
  );
}

