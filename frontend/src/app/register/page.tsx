"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { apiFetch, getApiError, getApiFetchUrl, setTokens } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="relative mx-auto max-w-md px-4 py-16">
      <div className="pointer-events-none absolute left-1/2 top-8 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-sage/15 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-sage">{t("nav.register")}</p>
        <h1 className="mt-2 text-center font-display text-3xl font-medium text-brand-navy dark:text-stone-50">
          {t("auth.createTitle", "Create your Bobakuma account")}
        </h1>
      </motion.div>

      <Card className="relative mt-10 space-y-4 p-7">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          try {
            const r = await apiFetch<{ tokens: { accessToken: string; refreshToken: string } }>("/auth/register", {
              method: "POST",
              body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password })
            });
            setTokens(r.tokens.accessToken, r.tokens.refreshToken);
            router.push("/");
          } catch (e) {
            const tried =
              e && typeof e === "object" && "apiBase" in e ? String((e as { apiBase: unknown }).apiBase) : getApiFetchUrl("/auth/register");
            const { status, errorCode } = getApiError(e);
            if (status === 409 || errorCode === "EMAIL_IN_USE") setErr(t("auth.emailInUse"));
            else if (status === 400) setErr(t("auth.invalidInput"));
            else if (e instanceof TypeError) setErr(`${t("auth.networkError")} (${tried})`);
            else if (e && typeof e === "object" && "message" in e && (e as Error).message === "FETCH_FAILED")
              setErr(`${t("auth.networkError")} (${tried})`);
            else setErr(t("auth.registerFailed"));
          }
        }}
      >
        <Input placeholder={t("auth.name", "Name")} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        <Input placeholder={t("auth.email", "Email")} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" />
        <Input
          placeholder={t("auth.passwordMin", "Password (min 8 chars)")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        {err && <p className="text-xs font-semibold text-peach-500">{err}</p>}
        <Button type="submit" className="w-full" size="lg">
          {t("nav.register", "Register")}
        </Button>
      </form>
      </Card>
      <p className="mt-8 text-center text-sm text-stone-600 dark:text-stone-400">
        {t("auth.haveAccount", "Already have an account?")}{" "}
        <Link href="/login" className="font-semibold text-brand-gold hover:underline dark:text-brand-gold-light">
          {t("nav.login", "Login")}
        </Link>
      </p>
    </div>
  );
}
