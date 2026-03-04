"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();
  const { about } = t.legal;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <h1 className="text-3xl font-bold tracking-tight">{about.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{about.subtitle}</p>

        <div className="mt-12 space-y-10">
          {(
            [about.mission, about.howItWorks, about.openSource, about.team] as {
              title: string;
              content: string;
            }[]
          ).map((block, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold">{block.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {block.content}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
