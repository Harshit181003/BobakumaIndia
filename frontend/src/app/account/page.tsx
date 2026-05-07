"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Me = { user: { id: number; email: string | null; name: string | null; role: string } };

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    apiFetch<Me>("/auth/me")
      .then(setMe)
      .catch(() => router.push("/login?next=/account"));
  }, [router]);

  if (!me) return <div className="p-10 text-center text-sm">Loading…</div>;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold text-ink-900">Account</h1>
      <div className="mt-6 rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-soft">
        <div className="text-sm text-ink-900/55">Name</div>
        <div className="text-lg font-semibold text-ink-900">{me.user.name ?? "—"}</div>
        <div className="mt-4 text-sm text-ink-900/55">Email</div>
        <div className="text-lg font-semibold text-ink-900">{me.user.email ?? "—"}</div>
        <div className="mt-4 text-sm text-ink-900/55">Role</div>
        <div className="text-lg font-semibold text-ink-900">{me.user.role}</div>
      </div>
    </div>
  );
}
