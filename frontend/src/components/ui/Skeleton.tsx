import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-stone-200/70 dark:bg-white/[0.08]",
        className
      )}
      aria-hidden
    />
  );
}
