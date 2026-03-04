"use client";

import { Mail, Github } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useI18n } from "@/lib/i18n";

export default function ContactPage() {
  const { t } = useI18n();
  const { contact } = t.legal;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <h1 className="text-3xl font-bold tracking-tight">{contact.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {contact.subtitle}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Email card */}
          <a
            href="mailto:suporte@polyaxis.com.br"
            className="group flex flex-col gap-3 rounded-xl border border-border p-6 transition-colors hover:border-foreground/20 hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail size={20} />
            </div>
            <h2 className="text-base font-semibold">{contact.email.title}</h2>
            <p className="text-sm text-muted-foreground">
              {contact.email.description}
            </p>
            <span className="mt-auto text-sm font-medium text-primary">
              suporte@polyaxis.com.br
            </span>
          </a>

          {/* GitHub card */}
          <a
            href="https://github.com/Serxo1/inkdrop/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 rounded-xl border border-border p-6 transition-colors hover:border-foreground/20 hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Github size={20} />
            </div>
            <h2 className="text-base font-semibold">{contact.github.title}</h2>
            <p className="text-sm text-muted-foreground">
              {contact.github.description}
            </p>
            <span className="mt-auto text-sm font-medium text-primary">
              github.com/Serxo1/inkdrop
            </span>
          </a>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {contact.response}
        </p>
      </main>
      <Footer />
    </div>
  );
}
