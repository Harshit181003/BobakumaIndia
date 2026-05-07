"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Row = { id: number; user_id: number; status: string; total_paise: number };

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Row[]>([]);

  async function reload() {
    const r = await apiFetch<{ items: Row[] }>("/admin/orders");
    setItems(r.items as Row[]);
  }

  useEffect(() => {
    void reload();
  }, []);

  return (
    <div className="overflow-auto rounded-3xl border border-white/60 bg-white/70">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream-100/80 text-xs uppercase text-ink-900/55">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">User</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Total</th>
            <th className="px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o.id} className="border-t border-white/50">
              <td className="px-3 py-2">{o.id}</td>
              <td className="px-3 py-2">{o.user_id}</td>
              <td className="px-3 py-2">{o.status}</td>
              <td className="px-3 py-2">₹{(o.total_paise / 100).toFixed(0)}</td>
              <td className="px-3 py-2">
                <select
                  className="rounded-xl border border-white/70 bg-white px-2 py-1 text-xs"
                  defaultValue={o.status}
                  onChange={async (e) => {
                    await apiFetch(`/admin/orders/${o.id}/status`, {
                      method: "PATCH",
                      body: JSON.stringify({ status: e.target.value })
                    });
                    void reload();
                  }}
                >
                  {["PENDING_PAYMENT", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
