"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export function ProductActions({ productId, slug }: { productId: number; slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "cart" | "wish">(null);

  async function addCart() {
    setBusy("cart");
    try {
      await apiFetch("/cart/items", { method: "POST", body: JSON.stringify({ productId, qty: 1 }) });
      router.push("/cart");
    } catch {
      router.push(`/login?next=/products/${slug}`);
    } finally {
      setBusy(null);
    }
  }

  async function addWish() {
    setBusy("wish");
    try {
      await apiFetch("/wishlist/items", { method: "POST", body: JSON.stringify({ productId }) });
      router.push("/wishlist");
    } catch {
      router.push(`/login?next=/products/${slug}`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => void addCart()}
        className="rounded-3xl bg-ink-900 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft disabled:opacity-60"
      >
        {busy === "cart" ? "Adding…" : "Add to cart"}
      </button>
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => void addWish()}
        className="rounded-3xl border border-white/70 bg-white/70 px-6 py-3 text-sm font-semibold text-ink-900 shadow-sm backdrop-blur disabled:opacity-60"
      >
        {busy === "wish" ? "Saving…" : "Wishlist"}
      </button>
    </div>
  );
}
