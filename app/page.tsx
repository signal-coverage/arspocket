import { LandingNav } from "@/components/landing/nav";
import { HeroSection } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { FeaturesSection } from "@/components/landing/features";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { StatsSection } from "@/components/landing/stats";
import { BenefitsSection } from "@/components/landing/benefits";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { FaqSection } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/cta-final";
import { LandingFooter } from "@/components/landing/footer";

export const Home = () => (
  <main className="force-light min-h-screen bg-white overflow-x-hidden">
    <LandingNav />
    <HeroSection />
    <SocialProof />
    <FeaturesSection />
    <DashboardPreview />
    <StatsSection />
    <BenefitsSection />
    <TestimonialsSection />
    <FaqSection />
    <FinalCta />
    <LandingFooter />
  </main>
);

export default Home;
