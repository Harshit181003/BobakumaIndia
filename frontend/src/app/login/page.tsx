"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { API, apiFetch, getApiError, setTokens } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/";
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold text-ink-900">{t("auth.welcomeBack", "Welcome back")}</h1>
      <form
        className="space-y-3 rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          try {
            const r = await apiFetch<{ tokens: { accessToken: string; refreshToken: string } }>("/auth/login", {
              method: "POST",
              body: JSON.stringify({ email: email.trim().toLowerCase(), password })
            });
            setTokens(r.tokens.accessToken, r.tokens.refreshToken);
            router.push(next);
          } catch (e) {
            const { status, errorCode } = getApiError(e);
            if (status === 403 || errorCode === "ACCOUNT_DISABLED") setErr(t("auth.accountDisabled"));
            else if (status === 400) setErr(t("auth.invalidInput"));
            else if (e instanceof TypeError) setErr(t("auth.networkError"));
            else setErr(t("auth.loginFailed"));
          }
        }}
      >
        <input className="w-full rounded-2xl border border-white/70 bg-white px-3 py-2 text-sm" placeholder={t("auth.email", "Email")} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <input className="w-full rounded-2xl border border-white/70 bg-white px-3 py-2 text-sm" placeholder={t("auth.password", "Password")} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        {err && <p className="text-xs font-semibold text-peach-500">{err}</p>}
        <button type="submit" className="w-full rounded-2xl bg-ink-900 py-2.5 text-sm font-semibold text-cream-50">
          {t("nav.login", "Login")}
        </button>
      </form>
      <a
        href={`${API}/api/auth/google`}
        className="block rounded-2xl border border-white/70 bg-white/80 py-2.5 text-center text-sm font-semibold text-ink-900"
      >
        Continue with Google
      </a>
      <p className="text-center text-sm text-ink-900/60">
        {t("auth.newHere", "New here?")}{" "}
        <Link href="/register" className="font-semibold text-lavender-500">
          {t("auth.createAccount", "Create an account")}
        </Link>
      </p>
    </div>
  );
}
