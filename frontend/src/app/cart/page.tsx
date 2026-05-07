"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Cart = {
  items: Array<{
    cartItemId: number;
    productId: number;
    name: string;
    slug: string;
    qty: number;
    unitPricePaise: number;
    lineTotalPaise: number;
  }>;
  subtotalPaise: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    apiFetch<Cart>("/cart")
      .then(setCart)
      .catch(() => router.push("/login?next=/cart"));
  }, [router]);

  if (!cart) return <div className="p-10 text-center text-sm text-ink-900/60">Loading cart…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-ink-900">Your cart</h1>
      {cart.items.length === 0 ? (
        <p className="mt-6 text-sm text-ink-900/65">
          Empty cart.{" "}
          <Link href="/products" className="font-semibold text-lavender-500">
            Shop lunchboxes
          </Link>
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {cart.items.map((i) => (
            <div key={i.cartItemId} className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/70 p-4">
              <div>
                <Link href={`/products/${i.slug}`} className="font-semibold text-ink-900">
                  {i.name}
                </Link>
                <div className="text-xs text-ink-900/55">Qty {i.qty}</div>
              </div>
              <div className="text-sm font-bold">₹{(i.lineTotalPaise / 100).toFixed(0)}</div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-3xl bg-ink-900 px-4 py-3 text-cream-50">
            <span className="text-sm font-semibold">Subtotal</span>
            <span className="text-lg font-bold">₹{(cart.subtotalPaise / 100).toFixed(0)}</span>
          </div>
          <Link href="/checkout" className="block rounded-3xl bg-gradient-to-r from-blush-500 to-peach-500 py-3 text-center text-sm font-bold text-white shadow-soft">
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
