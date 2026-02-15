"use client";

import { useCallback, useState } from "react";

export function useRecentColors(maxColors = 8) {
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const addRecentColor = useCallback(
    (color: string) => {
      if (!color || color === "none") return;
      setRecentColors((prev) => {
        const filtered = prev.filter((c) => c !== color);
        return [color, ...filtered].slice(0, maxColors);
      });
    },
    [maxColors]
  );

  return { recentColors, addRecentColor };
}
