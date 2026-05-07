"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/cn";

type Me = { user: { role: string } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    apiFetch<Me>("/auth/me")
      .then((r) => {
        if (r.user.role !== "ADMIN" && r.user.role !== "SUPER_ADMIN") {
          router.replace("/");
          setOk(false);
          return;
        }
        setOk(true);
      })
      .catch(() => router.replace("/login?next=/admin"));
  }, [router]);

  if (ok === false) return null;
  if (ok === null) return <div className="p-10 text-center text-sm text-ink-900/60">Checking admin access…</div>;

  const tabs = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/users", label: "Users" }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-ink-900">Admin</h1>
        <Link href="/" className="text-sm font-semibold text-lavender-500">
          ← Storefront
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold",
              pathname === t.href ? "bg-ink-900 text-cream-50" : "bg-white/70 text-ink-900"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
