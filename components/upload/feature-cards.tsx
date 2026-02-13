"use client";

import { Download, Palette, Save } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ComponentType, SVGProps } from "react";

const featureIcons: ComponentType<SVGProps<SVGSVGElement>>[] = [
  Palette,
  Save,
  Download,
];

export function FeatureCards() {
  const { t } = useI18n();

  return (
    <div className="grid w-full max-w-[480px] grid-cols-3 gap-4">
      {t.upload.features.map((feature, i) => {
        const Icon = featureIcons[i];
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center"
          >
            <Icon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-[13px] font-semibold">{feature.title}</h3>
            <p className="text-[11px] leading-snug text-muted-foreground">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
