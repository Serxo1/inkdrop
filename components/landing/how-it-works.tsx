"use client";

import { useI18n } from "@/lib/i18n";
import { Download, Palette, Upload } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

const stepIcons: ComponentType<SVGProps<SVGSVGElement>>[] = [
  Upload,
  Palette,
  Download,
];

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4 rounded-xl bg-muted/50 px-6 py-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-base font-bold text-background">
        {number}
      </div>
      <Icon className="h-7 w-7 text-primary" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="whitespace-pre-line text-center text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how-it-works" className="flex flex-col items-center px-6 py-20 md:px-20">
      <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        {t.howItWorks.title}
      </h2>
      <p className="mt-4 text-center text-base text-muted-foreground md:text-lg">
        {t.howItWorks.subtitle}
      </p>

      <div className="mt-12 grid w-full max-w-4xl gap-6 sm:grid-cols-2 md:grid-cols-3">
        {t.howItWorks.steps.map((step, i) => (
          <StepCard
            key={i}
            number={i + 1}
            icon={stepIcons[i]}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </section>
  );
}
