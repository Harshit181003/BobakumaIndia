import { Hero } from "@/components/home/Hero";
import { FeaturedCarousel, InstagramGallery, Newsletter, OffersBanner, Testimonials } from "@/components/home/HomeSections";

type ListRes = {
  items: Array<{
    id: number;
    name: string;
    slug: string;
    effectivePricePaise: number;
    imageUrl: string | null;
    discountPercent: number;
  }>;
};

async function getFeatured(): Promise<ListRes["items"]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  try {
    const res = await fetch(`${base}/api/products?pageSize=8&sort=newest`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const data = (await res.json()) as ListRes;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeatured();
  return (
    <div className="min-h-screen">
      <Hero />
      <OffersBanner />
      <FeaturedCarousel items={featured} />
      <InstagramGallery />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
