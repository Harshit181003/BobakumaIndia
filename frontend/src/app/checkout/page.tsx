"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

type Order = { id: number; totalPaise: number; status: string };

export default function CheckoutPage() {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const [shipping, setShipping] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingLine1: "",
    shippingLine2: "",
    shippingCity: "",
    shippingState: "",
    shippingPostal: "",
    shippingCountry: "India",
    couponCode: "",
    notes: ""
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setErr(null);
    try {
      const { order } = await apiFetch<{ order: Order }>("/orders/checkout", {
        method: "POST",
        body: JSON.stringify(shipping)
      });

      const rp = await apiFetch<{
        keyId?: string;
        razorpayOrderId: string;
        amountPaise: number;
        currency: string;
      }>(`/orders/${order.id}/razorpay-order`, { method: "POST", body: JSON.stringify({}) });

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? rp.keyId;
      if (!key || !scriptReady) throw new Error("Razorpay not ready");

      const rzp = new window.Razorpay({
        key,
        amount: rp.amountPaise,
        currency: rp.currency,
        order_id: rp.razorpayOrderId,
        name: "Bobakuma India",
        description: `Order #${order.id}`,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await apiFetch("/orders/payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });
            router.push(`/orders/${order.id}`);
          } catch {
            setErr("Payment verification failed — contact support with your order ID.");
          }
        },
        theme: { color: "#FF6B9A" }
      });
      rzp.open();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Checkout failed";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptReady(true)} />
      <h1 className="text-2xl font-semibold text-ink-900">Checkout</h1>
      <p className="mt-2 text-sm text-ink-900/60">Secure payments powered by Razorpay (test keys in dev).</p>

      <div className="mt-6 space-y-2 rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur">
        {Object.entries(shipping).map(([k, v]) => (
          <label key={k} className="block text-xs font-bold uppercase tracking-wide text-ink-900/45">
            {k}
            <input
              className="mt-1 w-full rounded-2xl border border-white/70 bg-white px-3 py-2 text-sm font-normal text-ink-900"
              value={v}
              onChange={(e) => setShipping((s) => ({ ...s, [k]: e.target.value }))}
            />
          </label>
        ))}
      </div>

      {err && <p className="mt-3 text-sm font-semibold text-peach-500">{err}</p>}

      <button
        type="button"
        disabled={busy}
        onClick={() => void pay()}
        className="mt-6 w-full rounded-3xl bg-ink-900 py-3 text-sm font-bold text-cream-50 shadow-soft disabled:opacity-50"
      >
        {busy ? "Working…" : "Pay with Razorpay"}
      </button>
    </div>
  );
}
