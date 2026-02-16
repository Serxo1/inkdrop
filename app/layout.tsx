import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleAnalytics } from "@/components/google-analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://inkdrop-alpha.vercel.app"),
  title: {
    default: "Inkdrop — Free Online SVG Editor",
    template: "%s | Inkdrop",
  },
  description:
    "Recolor paths, reshape curves, move layers around. All in your browser. No account. No backend. No BS. A free tool by Polyaxis.",
  keywords: [
    "SVG editor",
    "free SVG editor",
    "online SVG editor",
    "edit SVG online",
    "SVG color changer",
    "recolor SVG",
    "SVG tool",
    "vector editor",
    "browser SVG editor",
  ],
  authors: [{ name: "Polyaxis", url: "https://polyaxis.com.br" }],
  creator: "Polyaxis",
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "https://inkdrop-alpha.vercel.app",
  },
  openGraph: {
    title: "Inkdrop — Free Online SVG Editor",
    description:
      "Recolor paths, reshape curves, move layers around. All in your browser. No account, no backend, no BS.",
    siteName: "Inkdrop",
    type: "website",
    url: "https://inkdrop-alpha.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkdrop — Free Online SVG Editor",
    description:
      "Recolor paths, reshape curves, move layers around. All in your browser. Free and open source.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            strategy="beforeInteractive"
            crossOrigin="anonymous"
          />
        )}
        <GoogleAnalytics />
        <ThemeProvider>
          <TooltipProvider>
            <I18nProvider>{children}</I18nProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
