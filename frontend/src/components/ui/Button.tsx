import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-brand-navy to-brand-navy-deep text-white shadow-[0_12px_40px_-12px_rgba(30,42,74,0.55)] hover:shadow-[0_16px_48px_-12px_rgba(30,42,74,0.45)] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white/90 text-brand-navy border border-stone-200/80 shadow-sm hover:bg-white hover:border-brand-gold/40 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-brand-navy/80 hover:bg-stone-100/80 hover:text-brand-navy",
  outline:
    "border-2 border-brand-navy/15 bg-transparent text-brand-navy hover:border-brand-gold/50 hover:bg-brand-sand/50"
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: "sm" | "md" | "lg" }
>(function Button({ className, variant = "primary", size = "md", ...props }, ref) {
  const sizes = {
    sm: "rounded-xl px-4 py-2 text-xs font-semibold",
    md: "rounded-2xl px-5 py-2.5 text-sm font-semibold",
    lg: "rounded-2xl px-8 py-3.5 text-sm font-semibold tracking-wide"
  } as const;

  return (
    <button
      ref={ref}
      type={props.type ?? "button"}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
