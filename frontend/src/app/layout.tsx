import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/support/Chatbot";

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
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Chatbot />
          </div>
        </Providers>
      </body>
    </html>
  );
}

