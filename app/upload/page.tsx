"use client";

import { Header } from "@/components/landing/header";
import { DropZone } from "@/components/upload/drop-zone";
import { FeatureCards } from "@/components/upload/feature-cards";
import { AdSlot } from "@/components/ad-slot";
import { useI18n } from "@/lib/i18n";

export default function UploadPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <h1 className="text-center text-[40px] font-extrabold leading-tight tracking-tight">
          {t.upload.title}
        </h1>
        <p className="mt-3 max-w-md text-center text-base text-muted-foreground">
          {t.upload.subtitle}
        </p>

        <div className="mt-10 w-full max-w-[480px]">
          <DropZone />
        </div>

        <div className="mt-10">
          <FeatureCards />
        </div>

        {/* Ad: below feature cards — user already saw the main upload action */}
        <div className="mt-12 w-full max-w-[480px]">
          <AdSlot id="upload-bottom" size="leaderboard" />
        </div>
      </main>
    </div>
  );
}
