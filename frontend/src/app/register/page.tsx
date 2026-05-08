"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch, setTokens } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold text-ink-900">{t("auth.createTitle", "Create your Bobakuma account")}</h1>
      <form
        className="space-y-3 rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          try {
            const r = await apiFetch<{ tokens: { accessToken: string; refreshToken: string } }>("/auth/register", {
              method: "POST",
              body: JSON.stringify({ name, email, password })
            });
            setTokens(r.tokens.accessToken, r.tokens.refreshToken);
            router.push("/");
          } catch {
            setErr("Could not register — email may already be in use.");
          }
        }}
      >
        <input className="w-full rounded-2xl border border-white/70 bg-white px-3 py-2 text-sm" placeholder={t("auth.name", "Name")} value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded-2xl border border-white/70 bg-white px-3 py-2 text-sm" placeholder={t("auth.email", "Email")} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <input
          className="w-full rounded-2xl border border-white/70 bg-white px-3 py-2 text-sm"
          placeholder={t("auth.passwordMin", "Password (min 8 chars)")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={8}
        />
        {err && <p className="text-xs font-semibold text-peach-500">{err}</p>}
        <button type="submit" className="w-full rounded-2xl bg-ink-900 py-2.5 text-sm font-semibold text-cream-50">
          {t("nav.register", "Register")}
        </button>
      </form>
      <p className="text-center text-sm text-ink-900/60">
        {t("auth.haveAccount", "Already have an account?")}{" "}
        <Link href="/login" className="font-semibold text-lavender-500">
          {t("nav.login", "Login")}
        </Link>
      </p>
    </div>
  );
}
