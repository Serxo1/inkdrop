import Script from "next/script";

export function GoogleAnalytics() {
  return (
    <Script
      src="https://umami-analytics-coral-eight.vercel.app/script.js"
      data-website-id="8ce8ff26-3eea-4753-a73e-65b784b66df1"
      strategy="afterInteractive"
    />
  );
}
