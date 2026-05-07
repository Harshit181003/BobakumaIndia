import { CurrencyLink } from "./CurrencyLink";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/50 bg-white/40 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-ink-900">Bobakuma India</div>
          <p className="mt-1 max-w-md text-sm text-ink-900/65">Cute, premium lunchboxes — made for everyday joy.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-ink-900/70">
          <CurrencyLink href="/products" className="hover:text-ink-900">
            Shop
          </CurrencyLink>
          <CurrencyLink href="/orders" className="hover:text-ink-900">
            Orders
          </CurrencyLink>
          <a href="https://github.com/Harshit181003/BobakumaIndia" className="hover:text-ink-900" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
