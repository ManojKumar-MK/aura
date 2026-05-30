"use client";

import { useState } from "react";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { Star, MessageSquareQuote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Testimonial } from "@/lib/supabase";

interface Props {
  testimonials?: Testimonial[];
  config?: Record<string, string>;
}

export function SocialProofSection({ testimonials = [], config = {} }: Props) {
  const t = useTranslations("SocialProof");
  const [activeIndex, setActiveIndex] = useState(0);

  const items = testimonials.length > 0
    ? testimonials.map((t) => ({ quote: t.quote, author: t.author, role: t.role, company: t.company }))
    : [0, 1, 2].map((i) => ({
        quote:   t(`item${i}.quote`),
        author:  t(`item${i}.author`),
        role:    t(`item${i}.role`),
        company: t(`item${i}.company`),
      }));

  const prop1Title = config.sp_prop1_title ?? t("topEngineeringTitle");
  const prop1Desc  = config.sp_prop1_desc  ?? t("topEngineeringDesc");
  const prop2Title = config.sp_prop2_title ?? t("zeroDebtTitle");
  const prop2Desc  = config.sp_prop2_desc  ?? t("zeroDebtDesc");

  const safeIndex = Math.min(activeIndex, items.length - 1);

  return (
    <section className="relative py-32 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <SlideUp className="text-center mb-20">
          <h2 className="font-outfit text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Trusted by the <span className="text-gradient italic">best</span>.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </SlideUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <FadeIn delay={0.2} className="flex flex-col gap-12">
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-card border border-border/50 rounded-xl shadow-sm">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <h3 className="font-outfit text-2xl font-bold text-foreground mb-2">{prop1Title}</h3>
                <p className="text-muted-foreground">{prop1Desc}</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-card border border-border/50 rounded-xl shadow-sm">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <h3 className="font-outfit text-2xl font-bold text-foreground mb-2">{prop2Title}</h3>
                <p className="text-muted-foreground">{prop2Desc}</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="relative h-[400px] w-full">
            <div className="absolute inset-0 bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col justify-between">
              <MessageSquareQuote className="w-12 h-12 text-primary/20 mb-6" />

              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed font-outfit">
                      &quot;{items[safeIndex]?.quote}&quot;
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-end justify-between mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`author-${safeIndex}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col"
                  >
                    <span className="font-bold text-foreground font-outfit">{items[safeIndex]?.author}</span>
                    <span className="text-sm text-muted-foreground">{items[safeIndex]?.role}, {items[safeIndex]?.company}</span>
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-2">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-12 h-1.5 rounded-full transition-all duration-300 ${safeIndex === idx ? "bg-primary" : "bg-border hover:bg-border/80"}`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
