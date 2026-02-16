import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { AdSlot } from "@/components/ad-slot";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />

      {/* Ad: between How It Works and Features — natural content break */}
      <div className="flex justify-center px-6 py-8">
        <AdSlot id="7470629890" size="leaderboard" />
      </div>

      <Features />
      <CtaSection />

      {/* Ad: above footer — below-the-fold, non-intrusive */}
      <div className="flex justify-center px-6 pb-10">
        <AdSlot id="7219348454" size="leaderboard" />
      </div>

      <Footer />
    </div>
  );
}
