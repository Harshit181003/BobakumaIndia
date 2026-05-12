import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-stone-200/80 bg-white/95 px-4 py-3 text-sm text-brand-navy shadow-inner shadow-stone-100/50 outline-none transition placeholder:text-stone-400 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/20 dark:border-white/15 dark:bg-white/[0.07] dark:text-stone-100",
        className
      )}
      {...props}
    />
  );
});
