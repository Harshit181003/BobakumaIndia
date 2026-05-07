"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "@/lib/api";

export function Chatbot() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = msg.trim();
    if (!text) return;
    setMsg("");
    setLog((l) => [...l, { role: "user", text }]);
    setLoading(true);
    try {
      const r = await apiFetch<{ answer: string }>("/support/chat", { method: "POST", body: JSON.stringify({ message: text }) });
      setLog((l) => [...l, { role: "bot", text: r.answer }]);
    } catch {
      setLog((l) => [...l, { role: "bot", text: "Sorry — I couldn’t reach support right now. Try again soon." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="w-[min(92vw,360px)] overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-soft backdrop-blur"
          >
            <div className="border-b border-white/60 bg-gradient-to-r from-blush-50 to-lavender-50 px-4 py-3">
              <div className="text-sm font-semibold text-ink-900">{t("chat.title")}</div>
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto px-3 py-3 text-sm">
              {log.length === 0 && <p className="text-ink-900/60">Ask me about shipping, materials, or order help.</p>}
              {log.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "ml-8 rounded-2xl bg-ink-900 px-3 py-2 text-cream-50" : "mr-8 rounded-2xl bg-cream-100 px-3 py-2 text-ink-900"}
                >
                  {m.text}
                </div>
              ))}
              {loading && <div className="text-xs text-ink-900/50">Thinking…</div>}
            </div>
            <div className="flex gap-2 border-t border-white/60 p-3">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void send()}
                placeholder={t("chat.placeholder")}
                className="flex-1 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => void send()}
                className="rounded-2xl bg-ink-900 px-3 py-2 text-xs font-semibold text-cream-50"
              >
                {t("chat.send")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-gradient-to-br from-blush-500 to-peach-500 px-5 py-3 text-sm font-bold text-white shadow-soft"
      >
        {t("chat.open")}
      </motion.button>
    </div>
  );
}
