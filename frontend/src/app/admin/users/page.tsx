"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Row = { id: number; email: string | null; role: string; name: string | null; is_active: number };

export default function AdminUsersPage() {
  const [items, setItems] = useState<Row[]>([]);

  async function reload() {
    const r = await apiFetch<{ items: Row[] }>("/admin/users");
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
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Role</th>
            <th className="px-3 py-2">Active</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="border-t border-white/50">
              <td className="px-3 py-2">{u.id}</td>
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">
                <select
                  className="rounded-xl border border-white/70 bg-white px-2 py-1 text-xs"
                  defaultValue={u.role}
                  onChange={async (e) => {
                    await apiFetch(`/admin/users/${u.id}`, {
                      method: "PATCH",
                      body: JSON.stringify({ role: e.target.value })
                    });
                    void reload();
                  }}
                >
                  {["CUSTOMER", "ADMIN", "SUPER_ADMIN", "VENDOR"].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-3 py-2">{u.is_active ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
