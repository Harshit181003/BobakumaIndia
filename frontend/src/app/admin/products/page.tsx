"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Row = { id: number; name: string; slug: string; stock_qty: number; is_active: number; price_paise: number };

export default function AdminProductsPage() {
  const [items, setItems] = useState<Row[]>([]);

  async function reload() {
    const r = await apiFetch<{ items: Row[] }>("/admin/products");
    setItems(r.items as Row[]);
  }

  useEffect(() => {
    void reload();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-900/60">Manage catalog via API or extend this UI with create/edit forms.</p>
      <div className="overflow-auto rounded-3xl border border-white/60 bg-white/70">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-100/80 text-xs uppercase text-ink-900/55">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">₹</th>
              <th className="px-3 py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-white/50">
                <td className="px-3 py-2">{p.id}</td>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-ink-900/60">{p.slug}</td>
                <td className="px-3 py-2">{(p.price_paise / 100).toFixed(0)}</td>
                <td className="px-3 py-2">{p.stock_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
