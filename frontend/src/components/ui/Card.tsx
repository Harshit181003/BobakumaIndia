import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-stone-200/60 bg-white/80 shadow-[0_8px_40px_-12px_rgba(30,42,74,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]",
        className
      )}
      {...props}
    />
  );
}
