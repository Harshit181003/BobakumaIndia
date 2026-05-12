"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { apiFetch, getApiError, getApiFetchUrl, setTokens } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/";
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="relative mx-auto max-w-md px-4 py-16">
      <div className="pointer-events-none absolute left-1/2 top-8 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-gold/15 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-sage">{t("nav.login")}</p>
        <h1 className="mt-2 text-center font-display text-3xl font-medium text-brand-navy dark:text-stone-50">
          {t("auth.welcomeBack", "Welcome back")}
        </h1>
        <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">Bobakuma — {t("footer.brandLine")}</p>
      </motion.div>

      <Card className="relative mt-10 space-y-4 p-7">
        <form
          className="space-y-4"
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
              const tried =
                e && typeof e === "object" && "apiBase" in e ? String((e as { apiBase: unknown }).apiBase) : getApiFetchUrl("/auth/login");
              const { status, errorCode } = getApiError(e);
              if (status === 403 || errorCode === "ACCOUNT_DISABLED") setErr(t("auth.accountDisabled"));
              else if (status === 400) setErr(t("auth.invalidInput"));
              else if (e instanceof TypeError) setErr(`${t("auth.networkError")} (${tried})`);
              else if (e && typeof e === "object" && "message" in e && (e as Error).message === "FETCH_FAILED")
                setErr(`${t("auth.networkError")} (${tried})`);
              else setErr(t("auth.loginFailed"));
            }
          }}
        >
          <Input placeholder={t("auth.email", "Email")} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" />
          <Input
            placeholder={t("auth.password", "Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
          />
          {err && <p className="text-xs font-semibold text-peach-500">{err}</p>}
          <Button type="submit" className="w-full" size="lg">
            {t("nav.login", "Login")}
          </Button>
        </form>
      </Card>

      <p className="mt-8 text-center text-sm text-stone-600 dark:text-stone-400">
        {t("auth.newHere", "New here?")}{" "}
        <Link href="/register" className="font-semibold text-brand-gold hover:underline dark:text-brand-gold-light">
          {t("auth.createAccount", "Create an account")}
        </Link>
      </p>
    </div>
  );
}
