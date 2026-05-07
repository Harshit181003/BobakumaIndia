"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
          <Link key={i.wishlistItemId} href={`/products/${i.slug}`} className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-sm">
            <div className="relative aspect-[4/3] bg-cream-100">
              {i.imageUrl ? <Image src={i.imageUrl} alt="" fill className="object-cover" sizes="300px" /> : null}
            </div>
            <div className="p-3 text-sm font-semibold text-ink-900 line-clamp-2">{i.name}</div>
            <div className="px-3 pb-3 text-sm font-bold">₹{(i.effectivePricePaise / 100).toFixed(0)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
