"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API, apiFetch, getAccessToken } from "@/lib/api";

type OrderDetail = {
  id: number;
  status: string;
  totalPaise: number;
  items: Array<{ name: string; qty: number; unitPricePaise: number }>;
  shipping: { name: string; city: string; state: string; postal: string };
  createdAt: string;
};

const steps = ["PENDING_PAYMENT", "PAID", "PACKED", "SHIPPED", "DELIVERED"] as const;

function stepIndex(status: string) {
  if (status === "CANCELLED" || status === "REFUNDED") return -1;
  const i = steps.indexOf(status as (typeof steps)[number]);
  return i >= 0 ? i : 0;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    apiFetch<{ order: OrderDetail }>(`/orders/${id}`)
      .then((r) => setOrder(r.order))
      .catch(() => router.push("/login"));
  }, [id, router]);

  if (!order) return <div className="p-10 text-center text-sm">Loading…</div>;

  const si = stepIndex(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/orders" className="text-xs font-semibold text-lavender-500">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ink-900">Order #{order.id}</h1>
      <p className="text-sm text-ink-900/60">
        {order.status} · {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="mt-6 rounded-[2rem] border border-white/60 bg-white/70 p-4">
        <div className="text-xs font-bold uppercase text-ink-900/45">Tracking</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {steps.map((s, idx) => (
            <div
              key={s}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                si >= idx ? "bg-ink-900 text-cream-50" : "bg-cream-100 text-ink-900/45"
              }`}
            >
              {s.replace("_", " ")}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {order.items.map((it, i) => (
          <div key={i} className="flex justify-between rounded-2xl bg-white/60 px-3 py-2 text-sm">
            <span>
              {it.name} × {it.qty}
            </span>
            <span className="font-bold">₹{((it.unitPricePaise * it.qty) / 100).toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-3xl bg-ink-900 px-4 py-3 text-cream-50">
        <span>Total</span>
        <span className="text-lg font-bold">₹{(order.totalPaise / 100).toFixed(0)}</span>
      </div>

      <button
        type="button"
        className="mt-4 rounded-3xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-ink-900"
        onClick={async () => {
          const token = getAccessToken();
          const res = await fetch(`${API}/api/orders/${order.id}/invoice`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `bobakuma-order-${order.id}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Download invoice (PDF)
      </button>
    </div>
  );
}
