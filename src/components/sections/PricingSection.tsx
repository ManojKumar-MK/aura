"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { scrollToSection } from "@/lib/utils";

const planPrices = [
  { monthly: 8000, yearly: 7200, popular: false },
  { monthly: 15000, yearly: 13500, popular: true },
  { monthly: 28000, yearly: 25000, popular: false },
];

const featureIncluded = [
  [true, true, true, false, false],
  [true, true, true, true, false],
  [true, true, true, true, true],
];

export function PricingSection() {
  const t = useTranslations("Pricing");
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="relative py-32 bg-secondary/10 overflow-hidden z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <SlideUp className="text-center mb-16">
          <h2 className="font-outfit text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Transparent, <span className="text-gradient italic">predictable</span> investment.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("subheading")}
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              {t("monthly")}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 rounded-full bg-border flex items-center p-1 cursor-pointer transition-colors hover:bg-border/80 relative"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={`w-6 h-6 rounded-full bg-primary shadow-md ${isYearly ? "ml-auto" : "ml-0"}`}
              />
            </button>
            <span className={`flex items-center gap-2 text-sm font-semibold ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              {t("yearly")} <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs whitespace-nowrap">{t("saveLabel")}</span>
            </span>
          </div>
        </SlideUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {planPrices.map((plan, index) => (
            <StaggerItem key={index}>
              <div
                className={`relative flex flex-col p-8 rounded-3xl ${
                  plan.popular
                    ? "bg-card border-2 border-primary/60 shadow-[0_0_60px_-10px_var(--color-primary)] scale-100 md:scale-105 z-10"
                    : "bg-card border border-border/50 shadow-xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground bg-primary rounded-full shadow-lg">
                      {t("mostPopular")}
                    </span>
                  </div>
                )}

                <h3 className="font-outfit text-2xl font-bold text-foreground mb-2">
                  {t(`item${index}.name`)}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 h-10">
                  {t(`item${index}.description`)}
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isYearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="text-5xl font-black font-outfit text-foreground"
                    >
                      ${(isYearly ? plan.yearly : plan.monthly).toLocaleString()}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-muted-foreground font-medium">{t("perMonth")}</span>
                </div>

                <ul className="flex flex-col gap-4 mb-8 flex-1">
                  {featureIncluded[index].map((included, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {included ? (
                        <Check className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/30 shrink-0" />
                      )}
                      <span className={`text-sm ${included ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {t(`item${index}.feature${idx}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => scrollToSection("cta")}
                  className={`w-full py-6 rounded-xl font-bold text-lg ${
                    plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-foreground hover:bg-border"
                  }`}
                >
                  {t("getStarted")}
                </Button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
