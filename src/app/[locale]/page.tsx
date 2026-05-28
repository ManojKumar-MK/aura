import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";

import { FaqSection } from "@/components/sections/FaqSection";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <CaseStudiesSection />
      <TechStackSection />
      <SocialProofSection />

      <FaqSection />
      <CtaSection />
    </div>
  );
}
