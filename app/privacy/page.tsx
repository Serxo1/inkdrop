"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useI18n();
  const { privacy } = t.legal;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <h1 className="text-3xl font-bold tracking-tight">{privacy.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {privacy.lastUpdated}
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          {privacy.intro}
        </p>

        <div className="mt-10 space-y-8">
          {privacy.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
