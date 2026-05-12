import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import {
  ChoosingGuide,
  CollectionsRow,
  ShirtsPromoRow,
  FeaturedCarousel,
  FeaturedCarouselSkeleton,
  InstagramGallery,
  Newsletter,
  OffersBanner,
  PromoTiles,
  RecipesRow,
  SizesRow,
  Testimonials,
  UspsRow,
  VideoReviewsRow
} from "@/components/home/HomeSections";
import { parseDisplayCurrency } from "@/lib/currency";
import { getCurrencyFromCookies } from "@/lib/currency.server";
import { getServerApiBase } from "@/lib/serverApiBase";

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
  const base = getServerApiBase();
  const cat = category ? `&category=${encodeURIComponent(category)}` : "";
  try {
    const res = await fetch(`${base}/api/products?pageSize=8&sort=newest&currency=${encodeURIComponent(currency)}${cat}`, {
      cache: "no-store"
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
      <UspsRow />
      <CollectionsRow />
      <ShirtsPromoRow />
      <ChoosingGuide />
      <SizesRow />
      <PromoTiles />
      <RecipesRow />
      <OffersBanner />
      <Suspense
        fallback={
          <>
            <FeaturedCarouselSkeleton titleKey="home.featured" />
            <FeaturedCarouselSkeleton titleKey="home.featuredShirts" />
          </>
        }
      >
        <FeaturedCarousel items={featured} currency={currency} titleKey="home.featured" shopHref="/products?category=LUNCHBOX" />
        <FeaturedCarousel
          items={shirtItems}
          currency={currency}
          titleKey="home.featuredShirts"
          shopHref="/products?category=SHIRTS"
        />
      </Suspense>
      <InstagramGallery />
      <VideoReviewsRow />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
