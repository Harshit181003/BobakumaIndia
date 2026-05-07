"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Analytics = {
  revenuePaise: number;
  paidOrders: number;
  pendingPaymentOrders: number;
  lowStock: Array<{ id: number; name: string; slug: string; stock_qty: number }>;
};

export default function AdminHomePage() {
  const [a, setA] = useState<Analytics | null>(null);

  useEffect(() => {
    apiFetch<Analytics>("/admin/analytics").then(setA).catch(() => setA(null));
  }, []);

  if (!a) return <p className="text-sm text-ink-900/60">Loading analytics…</p>;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm">
        <div className="text-xs font-bold uppercase text-ink-900/45">Revenue</div>
        <div className="mt-1 text-2xl font-bold text-ink-900">₹{(a.revenuePaise / 100).toFixed(0)}</div>
      </div>
      <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm">
        <div className="text-xs font-bold uppercase text-ink-900/45">Paid orders</div>
        <div className="mt-1 text-2xl font-bold text-ink-900">{a.paidOrders}</div>
      </div>
      <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm">
        <div className="text-xs font-bold uppercase text-ink-900/45">Pending payment</div>
        <div className="mt-1 text-2xl font-bold text-peach-500">{a.pendingPaymentOrders}</div>
      </div>
      <div className="md:col-span-3 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm">
        <div className="text-sm font-semibold text-ink-900">Low stock</div>
        <ul className="mt-2 space-y-1 text-sm text-ink-900/75">
          {a.lowStock.map((p) => (
            <li key={p.id}>
              {p.name} — {p.stock_qty} left
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
