type RegionsRes = {
  markets: { code: string; country: string; label: string; symbol: string }[];
  fx: { inrToNpr: number; inrToLkr: number; adjustNp: number; adjustLk: number };
  note: string;
};

type SampleRes = {
  baseInrRupees: number;
  estimates: {
    IN: { formatted: string };
    NP: { formatted: string };
    LK: { formatted: string };
  };
};

export async function SubcontinentPricingIntro() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  let regions: RegionsRes | null = null;
  let sample: SampleRes | null = null;
  try {
    const [r1, r2] = await Promise.all([
      fetch(`${base}/api/pricing/regions`, { next: { revalidate: 120 } }),
      fetch(`${base}/api/pricing/sample?inr=899`, { next: { revalidate: 120 } })
    ]);
    if (r1.ok) regions = (await r1.json()) as RegionsRes;
    if (r2.ok) sample = (await r2.json()) as SampleRes;
  } catch {
    /* offline / API down */
  }

  return (
    <section className="border-b border-mint-100/80 bg-gradient-to-b from-mint-50/90 via-cream-50 to-cream-50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-900/45">South Asia pricing</p>
        <h2 className="mt-2 text-balance text-2xl font-semibold text-ink-900 md:text-3xl">
          One catalog in India (INR). Friendly estimates for Nepal and Sri Lanka.
        </h2>
        <p className="mt-3 max-w-3xl text-pretty text-sm leading-relaxed text-ink-900/70 md:text-base">
          We anchor every list price in <strong className="font-semibold text-ink-900">Indian rupees</strong> because checkout runs
          through Razorpay in India. For neighbors, we translate those amounts into{" "}
          <strong className="font-semibold text-ink-900">Nepalese rupees</strong> and{" "}
          <strong className="font-semibold text-ink-900">Sri Lankan rupees</strong> using configurable FX and optional regional
          adjustments—so shoppers can reason about value in their own currency, even though the charge is still in INR.
        </p>

        {sample && (
          <div className="mt-6 rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur md:p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-900/45">Example (₹{sample.baseInrRupees} list)</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-mint-50/80 px-4 py-3">
                <div className="text-xs text-ink-900/50">India — checkout currency</div>
                <div className="mt-1 text-lg font-bold text-ink-900">{sample.estimates.IN.formatted}</div>
              </div>
              <div className="rounded-2xl bg-cream-100/80 px-4 py-3">
                <div className="text-xs text-ink-900/50">Nepal — estimate</div>
                <div className="mt-1 text-lg font-bold text-ink-900">{sample.estimates.NP.formatted}</div>
              </div>
              <div className="rounded-2xl bg-peach-50/80 px-4 py-3">
                <div className="text-xs text-ink-900/50">Sri Lanka — estimate</div>
                <div className="mt-1 text-lg font-bold text-ink-900">{sample.estimates.LK.formatted}</div>
              </div>
            </div>
          </div>
        )}

        {regions && (
          <p className="mt-4 text-xs leading-relaxed text-ink-900/55">
            Server rates (tune in <code className="rounded bg-white/60 px-1 py-0.5 text-[11px]">.env</code>): 1 INR ≈{" "}
            {regions.fx.inrToNpr.toFixed(2)} NPR, 1 INR ≈ {regions.fx.inrToLkr.toFixed(2)} LKR
            {regions.fx.adjustNp !== 1 || regions.fx.adjustLk !== 1
              ? ` · regional multipliers NP ×${regions.fx.adjustNp} · LK ×${regions.fx.adjustLk}`
              : ""}
            . {regions.note}
          </p>
        )}
      </div>
    </section>
  );
}
