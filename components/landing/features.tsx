"use client";

import { useI18n } from "@/lib/i18n";
import { Code, Database, ShieldOff, Zap } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

const featureIcons: ComponentType<SVGProps<SVGSVGElement>>[] = [
  ShieldOff,
  Database,
  Code,
  Zap,
];

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6 md:p-7">
      <Icon className="h-[22px] w-[22px] text-primary" />
      <h3 className="text-[15px] font-bold">{title}</h3>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function Features() {
  const { t } = useI18n();

  return (
    <section className="bg-muted/50 px-6 py-16 md:px-20 md:py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">
        {t.features.title}
      </h2>

      <div className="mx-auto mt-12 grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.features.items.map((feat, i) => (
          <FeatureCard
            key={i}
            icon={featureIcons[i]}
            title={feat.title}
            description={feat.description}
          />
        ))}
      </div>
    </section>
  );
}
