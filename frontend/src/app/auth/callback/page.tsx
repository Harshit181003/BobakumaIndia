"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { setTokens } from "@/lib/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const access = sp.get("accessToken");
    const refresh = sp.get("refreshToken");
    if (!access || !refresh) {
      setErr("Missing tokens");
      return;
    }
    setTokens(access, refresh);
    router.replace("/");
  }, [router, sp]);

  if (err) return <div className="p-10 text-center text-sm text-peach-500">{err}</div>;
  return <div className="p-10 text-center text-sm text-ink-900/60">Signing you in…</div>;
}
