import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://inkdrop.polyaxis.com.br"),
  title: "Inkdrop — Edit SVGs like you mean it",
  description:
    "Recolor paths, reshape curves, move layers around. All in your browser. No account. No backend. No BS. A free tool by Polyaxis.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Inkdrop — Edit SVGs like you mean it",
    description:
      "Recolor paths, reshape curves, move layers around. All in your browser. No account, no backend, no BS.",
    siteName: "Inkdrop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkdrop — Edit SVGs like you mean it",
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
        <ThemeProvider>
          <TooltipProvider>
            <I18nProvider>{children}</I18nProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
