import { Hero } from "@/components/home/Hero";
import { SubcontinentPricingIntro } from "@/components/home/SubcontinentPricingIntro";
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

async function getFeatured(currency: string): Promise<ListRes["items"]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  try {
    const res = await fetch(`${base}/api/products?pageSize=8&sort=newest&currency=${encodeURIComponent(currency)}`, {
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
  const featured = await getFeatured(currency);
  return (
    <div className="min-h-screen">
      <SubcontinentPricingIntro />
      <Hero />
      <CollectionsRow />
      <SizesRow />
      <PromoTiles />
      <OffersBanner />
      <FeaturedCarousel items={featured} currency={currency} />
      <InstagramGallery />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
