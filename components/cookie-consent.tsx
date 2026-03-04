"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const COOKIE_KEY = "inkdrop-cookie-consent";

export function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-background/95 px-4 py-4 backdrop-blur-lg sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <p className="flex-1 text-center text-sm text-muted-foreground sm:text-left">
          {t.legal.cookieConsent.message}{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            {t.legal.cookieConsent.learnMore}
          </Link>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {t.legal.cookieConsent.decline}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-80"
          >
            {t.legal.cookieConsent.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
