"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type AdSize = "leaderboard" | "banner" | "mrec" | "inline";

const sizeMap: Record<AdSize, { width: number; height: number } | null> = {
  leaderboard: { width: 728, height: 90 },
  banner: { width: 468, height: 60 },
  mrec: { width: 300, height: 250 },
  inline: null,
};

interface AdSlotProps {
  id: string;
  size: AdSize;
  className?: string;
}

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export function AdSlot({ id, size, className }: AdSlotProps) {
  const dimensions = sizeMap[size];
  const isInline = size === "inline";
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ID || pushed.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
      pushed.current = true;
    } catch {
      // adsbygoogle not loaded yet — silently ignore
    }
  }, []);

  // Fallback placeholder when AdSense is not configured
  if (!ADSENSE_ID) {
    return (
      <div
        data-ad-slot={id}
        data-ad-size={size}
        className={cn(
          "flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-muted-foreground/50",
          isInline ? "min-h-[100px] w-full p-4" : "mx-auto",
          className,
        )}
        style={
          isInline
            ? undefined
            : {
                maxWidth: `${dimensions!.width}px`,
                width: "100%",
                height: `${dimensions!.height}px`,
              }
        }
      >
        <span className="select-none text-xs tracking-wider uppercase">
          Ad — {size}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg bg-muted/20",
        isInline ? "min-h-[100px] w-full" : "mx-auto",
        className,
      )}
      style={
        isInline
          ? undefined
          : {
              maxWidth: `${dimensions!.width}px`,
              width: "100%",
              minHeight: `${dimensions!.height}px`,
            }
      }
    >
      <ins
        className="adsbygoogle"
        style={
          isInline
            ? { display: "block" }
            : {
                display: "inline-block",
                width: `${dimensions!.width}px`,
                height: `${dimensions!.height}px`,
              }
        }
        data-ad-client={ADSENSE_ID}
        data-ad-slot={id}
        {...(isInline
          ? { "data-ad-format": "fluid", "data-ad-layout-key": "-fb+5w+4e-db+86" }
          : {})}
      />
    </div>
  );
}
