import { cn } from "@/lib/cn";

/**
 * Brand mark inspired by the Bobakuma “premium lunch boxes” logo:
 * geometric bear + BOBAKUMA wordmark (SVG, scales cleanly).
 */
export function BobakumaLogo({
  className,
  showWordmark = true,
  /** Show BOBAKUMA text on small screens too (e.g. footer). */
  alwaysShowWordmark = false,
  iconClassName
}: {
  className?: string;
  showWordmark?: boolean;
  alwaysShowWordmark?: boolean;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <svg
        viewBox="0 0 120 120"
        className={cn("h-9 w-9 shrink-0 sm:h-10 sm:w-10", iconClassName)}
        aria-hidden
      >
        {/* Side rails */}
        <line
          x1="9"
          y1="32"
          x2="9"
          y2="102"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-stone-900 dark:stroke-stone-100"
        />
        <rect x="5" y="22" width="8" height="6" rx="1.5" className="fill-[#c9a86c] dark:fill-[#d4bc7a]" />
        <line
          x1="111"
          y1="32"
          x2="111"
          y2="102"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-stone-900 dark:stroke-stone-100"
        />
        <rect x="107" y="22" width="8" height="6" rx="1.5" className="fill-[#c9a86c] dark:fill-[#d4bc7a]" />

        {/* Ears */}
        <ellipse cx="43" cy="33" rx="10" ry="7.5" className="fill-[#c9a86c] dark:fill-[#d4bc7a]" />
        <ellipse cx="77" cy="33" rx="10" ry="7.5" className="fill-[#c9a86c] dark:fill-[#d4bc7a]" />

        {/* Top cap — black block */}
        <rect x="33" y="36" width="54" height="16" rx="7" className="fill-stone-900 dark:fill-stone-100" />

        {/* Face — tan with black eyes */}
        <rect x="32" y="48" width="56" height="26" rx="9" className="fill-[#c9a86c] dark:fill-[#d4bc7a]" />
        <circle cx="47" cy="58" r="3.8" className="fill-stone-900 dark:fill-stone-900" />
        <circle cx="73" cy="58" r="3.8" className="fill-stone-900 dark:fill-stone-900" />

        {/* Muzzle */}
        <rect x="49" y="62" width="22" height="17" rx="3" className="fill-white dark:fill-stone-200" />
        <path
          d="M 60 65 v 7 M 55.5 68.5 L 60 73 L 64.5 68.5"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-stone-900 dark:stroke-stone-800"
        />

        {/* Mid band */}
        <rect x="35" y="74" width="50" height="9" rx="2" className="fill-stone-900 dark:fill-stone-100" />

        {/* Lower torso + boba pearl */}
        <rect x="32" y="82" width="56" height="28" rx="6" className="fill-[#c9a86c] dark:fill-[#d4bc7a]" />
        <circle cx="60" cy="96" r="12" className="fill-stone-900 dark:fill-stone-100" />
      </svg>

      {showWordmark ? (
        <div className={cn("min-w-0 flex-col leading-tight", alwaysShowWordmark ? "flex" : "hidden sm:flex")}>
          <span className="font-sans text-[13px] font-bold tracking-[0.14em] text-stone-900 dark:text-stone-100">
            BOBAKUMA
          </span>
          <span className="mt-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.26em] text-stone-800 dark:text-stone-300">
            Premium lunch boxes
          </span>
        </div>
      ) : null}
    </div>
  );
}
