export const dynamic = "force-dynamic";

import { HeroSection }        from "@/components/sections/HeroSection";
import { ServicesSection }    from "@/components/sections/ServicesSection";
import { AcademySection }     from "@/components/sections/AcademySection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { FaqSection }         from "@/components/sections/FaqSection";
import {
  getServices, getAcademyPrograms, getSiteConfig,
  getCaseStudies, getTestimonials, getFaqItems,
} from "@/lib/supabase";

const DEFAULT_ORDER = ["hero","services","academy","casestudies","testimonials","faq"];

export default async function Home() {
  const [services, programs, config, caseStudies, testimonials, faqs] = await Promise.all([
    getServices().catch(() => []),
    getAcademyPrograms().catch(() => []),
    getSiteConfig().catch(() => ({} as Record<string, string>)),
    getCaseStudies().catch(() => []),
    getTestimonials().catch(() => []),
    getFaqItems().catch(() => []),
  ]);

  let order: string[] = DEFAULT_ORDER;
  try {
    if (config.section_order) {
      const saved = JSON.parse(config.section_order) as string[];
      // Remove "contact" from order if it was saved previously
      order = saved.filter(id => id !== "contact");
    }
  } catch { /* use default */ }

  const sections: Record<string, React.ReactNode> = {
    hero:         <HeroSection config={config} />,
    services:     config.show_services     !== "false" ? <ServicesSection services={services} /> : null,
    academy:      config.show_academy      !== "false" ? <AcademySection programs={programs} /> : null,
    casestudies:  config.show_impact       !== "false" ? <CaseStudiesSection caseStudies={caseStudies} /> : null,
    testimonials: config.show_testimonials !== "false" ? <SocialProofSection testimonials={testimonials} config={config} /> : null,
    faq:          config.show_faq          !== "false" ? <FaqSection faqs={faqs} /> : null,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {order.map(id => sections[id] ? <div key={id}>{sections[id]}</div> : null)}
    </div>
  );
}
