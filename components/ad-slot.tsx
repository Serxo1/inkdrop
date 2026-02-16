"use client";

import { cn } from "@/lib/utils";

/**
 * Ad slot sizes following IAB standard display ad units.
 *
 * - leaderboard:  728 x 90  — horizontal banner (landing page sections)
 * - banner:       468 x 60  — smaller horizontal banner (tool bottom bar)
 * - mrec:         300 x 250 — medium rectangle (sidebar / in-feed)
 * - inline:       fluid     — native in-feed ad matching surrounding cards
 */
export type AdSize = "leaderboard" | "banner" | "mrec" | "inline";

const sizeMap: Record<AdSize, { width: string; height: string }> = {
  leaderboard: { width: "728px", height: "90px" },
  banner: { width: "468px", height: "60px" },
  mrec: { width: "300px", height: "250px" },
  inline: { width: "100%", height: "auto" },
};

interface AdSlotProps {
  /** Unique identifier for this ad placement (for analytics / ad network targeting) */
  id: string;
  /** IAB ad size */
  size: AdSize;
  /** Additional CSS classes for positioning */
  className?: string;
}

/**
 * Placeholder component for ad integration.
 *
 * Replace the inner content with your ad network's script/tag
 * (e.g. Google AdSense, Carbon Ads, EthicalAds, etc.).
 *
 * In production, the dashed border and label will be replaced
 * by the actual ad creative rendered by the ad network SDK.
 */
export function AdSlot({ id, size, className }: AdSlotProps) {
  const dimensions = sizeMap[size];
  const isInline = size === "inline";

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
              maxWidth: dimensions.width,
              width: "100%",
              height: dimensions.height,
            }
      }
    >
      <span className="select-none text-xs tracking-wider uppercase">
        Ad — {size}
      </span>
    </div>
  );
}
