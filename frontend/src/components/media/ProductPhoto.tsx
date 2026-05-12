"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const PLACEHOLDER = "/hero-1.jpeg";

/**
 * Plain <img> so any CDN / S3 URL works without next/image remotePatterns.
 * Falls back to a local placeholder on error or missing src.
 */
export function ProductPhoto({
  src,
  alt,
  className
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const effective = !src || broken ? PLACEHOLDER : src;

  return (
    <img
      src={effective}
      alt={alt}
      className={cn(className)}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}
