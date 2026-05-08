import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import {
  CollectionsRow,
  FeaturedCarousel,
  InstagramGallery,
  Newsletter,
  OffersBanner,
  PromoTiles,
  SizesRow,
  Testimonials
} from "@/components/home/HomeSections";
import { parseDisplayCurrency } from "@/lib/currency";
import { getCurrencyFromCookies } from "@/lib/currency.server";

type ListRes = {
  items: Array<{
    id: number;
    name: string;
    slug: string;
    effectivePricePaise: number;
    imageUrl: string | null;
    discountPercent: number;
    displayPrice?: { formatted: string; currency: string };
  }>;
};

async function fetchProducts(currency: string, category?: string): Promise<ListRes["items"]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const cat = category ? `&category=${encodeURIComponent(category)}` : "";
  try {
    const res = await fetch(`${base}/api/products?pageSize=8&sort=newest&currency=${encodeURIComponent(currency)}${cat}`, {
      next: { revalidate: 30 }
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ListRes;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const currency = sp.currency ? parseDisplayCurrency(sp.currency) : await getCurrencyFromCookies();
  const [featured, shirtItems] = await Promise.all([fetchProducts(currency), fetchProducts(currency, "SHIRTS")]);

  return (
    <div className="min-h-screen">
      <Hero />
      <CollectionsRow />
      <SizesRow />
      <PromoTiles />
      <OffersBanner />
      <Suspense fallback={<div className="mx-auto h-40 max-w-6xl px-4 text-center text-sm text-ink-900/50">Loading…</div>}>
        <FeaturedCarousel items={featured} currency={currency} titleKey="home.featured" shopHref="/products" />
        <FeaturedCarousel
          items={shirtItems}
          currency={currency}
          titleKey="home.featuredShirts"
          shopHref="/products?category=SHIRTS"
        />
      </Suspense>
      <InstagramGallery />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
