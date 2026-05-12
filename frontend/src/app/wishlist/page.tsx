"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductPhoto } from "@/components/media/ProductPhoto";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Wish = { items: Array<{ wishlistItemId: number; productId: number; name: string; slug: string; effectivePricePaise: number; imageUrl: string | null }> };

export default function WishlistPage() {
  const router = useRouter();
  const [data, setData] = useState<Wish | null>(null);

  useEffect(() => {
    apiFetch<Wish>("/wishlist")
      .then(setData)
      .catch(() => router.push("/login?next=/wishlist"));
  }, [router]);

  if (!data) return <div className="p-10 text-center text-sm">Loading…</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-ink-900">Wishlist</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((i) => (
          <Link
            key={i.wishlistItemId}
            href={`/products/${i.slug}`}
            className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white/85 shadow-sm dark:border-stone-600/40 dark:bg-stone-900/40"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800/60">
              <ProductPhoto
                src={i.imageUrl}
                alt={i.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="p-3 text-sm font-semibold text-brand-navy line-clamp-2 dark:text-stone-100">{i.name}</div>
            <div className="px-3 pb-3 text-sm font-bold">₹{(i.effectivePricePaise / 100).toFixed(0)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
