"use client";

import { useState } from "react";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { Star, MessageSquareQuote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export function SocialProofSection() {
  const t = useTranslations("SocialProof");
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [0, 1, 2].map((i) => ({
    quote: t(`item${i}.quote`),
    author: t(`item${i}.author`),
    role: t(`item${i}.role`),
    company: t(`item${i}.company`),
  }));

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

          {/* Stats / Value Props */}
          <FadeIn delay={0.2} className="flex flex-col gap-12">
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-card border border-border/50 rounded-xl shadow-sm">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <h3 className="font-outfit text-2xl font-bold text-foreground mb-2">{t("topEngineeringTitle")}</h3>
                <p className="text-muted-foreground">{t("topEngineeringDesc")}</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-card border border-border/50 rounded-xl shadow-sm">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <h3 className="font-outfit text-2xl font-bold text-foreground mb-2">{t("zeroDebtTitle")}</h3>
                <p className="text-muted-foreground">{t("zeroDebtDesc")}</p>
              </div>
            </div>
          </FadeIn>

          {/* Testimonial Carousel */}
          <FadeIn delay={0.4} className="relative h-[400px] w-full">
            <div className="absolute inset-0 bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col justify-between">
              <MessageSquareQuote className="w-12 h-12 text-primary/20 mb-6" />

              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed font-outfit">
                      &quot;{testimonials[activeIndex].quote}&quot;
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-end justify-between mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`author-${activeIndex}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col"
                  >
                    <span className="font-bold text-foreground font-outfit">{testimonials[activeIndex].author}</span>
                    <span className="text-sm text-muted-foreground">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</span>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-12 h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? "bg-primary" : "bg-border hover:bg-border/80"}`}
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
