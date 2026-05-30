"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import type { FaqItem } from "@/lib/supabase";

interface Props {
  faqs?: FaqItem[];
}

export function FaqSection({ faqs = [] }: Props) {
  const t = useTranslations("Faq");

  const items = faqs.length > 0
    ? faqs.map((f) => ({ question: f.question, answer: f.answer }))
    : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
        question: t(`item${i}.question`),
        answer:   t(`item${i}.answer`),
      }));

  return (
    <section className="relative py-32 bg-secondary/10 overflow-hidden z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn className="text-center mb-16">
          <h2 className="font-outfit text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Commonly asked <span className="text-gradient italic">questions</span>.
          </h2>
          <p className="text-lg text-muted-foreground mx-auto">
            {t("subheading")}
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-10 shadow-xl">
          <StaggerContainer>
            <Accordion className="w-full">
              {items.map((faq, index) => (
                <StaggerItem key={index}>
                  <AccordionItem value={`item-${index}`} className="border-b border-border/50 last:border-0 py-2">
                    <AccordionTrigger className="text-left font-outfit text-lg md:text-xl font-semibold hover:no-underline hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </StaggerItem>
              ))}
            </Accordion>
          </StaggerContainer>
        </FadeIn>
      </div>
    </section>
  );
}
