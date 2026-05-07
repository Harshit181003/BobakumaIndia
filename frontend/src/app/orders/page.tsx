"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Row = { id: number; status: string; totalPaise: number; createdAt: string };

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Row[] | null>(null);

  useEffect(() => {
    apiFetch<{ orders: Row[] }>("/orders")
      .then((r) => setOrders(r.orders))
      .catch(() => router.push("/login?next=/orders"));
  }, [router]);

  if (!orders) return <div className="p-10 text-center text-sm">Loading orders…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-ink-900">Orders</h1>
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <Link key={o.id} href={`/orders/${o.id}`} className="block rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-ink-900">Order #{o.id}</div>
              <div className="text-sm font-bold">₹{(o.totalPaise / 100).toFixed(0)}</div>
            </div>
            <div className="mt-1 text-xs text-ink-900/55">
              {o.status} · {new Date(o.createdAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
