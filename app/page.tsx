import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { AppPreview } from "@/components/landing/app-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <AppPreview />
      <HowItWorks />
      <Features />
      <CtaSection />
      <Footer />
    </div>
  );
}
