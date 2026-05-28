"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, PenTool, Braces, TextSelect, Rocket, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

const stepIcons = [
  <Search key="search" className="w-10 h-10 text-primary" />,
  <PenTool key="pen" className="w-10 h-10 text-primary" />,
  <Braces key="braces" className="w-10 h-10 text-primary" />,
  <TextSelect key="text" className="w-10 h-10 text-primary" />,
  <Rocket key="rocket" className="w-10 h-10 text-primary" />,
  <TrendingUp key="trend" className="w-10 h-10 text-primary" />,
];

const stepIds = ["01", "02", "03", "04", "05", "06"];

export function ProcessSection() {
  const t = useTranslations("Process");
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  const steps = stepIcons.map((icon, i) => ({
    id: stepIds[i],
    icon,
    title: t(`item${i}.title`),
    description: t(`item${i}.description`),
  }));

  return (
    <section ref={targetRef} id="process" className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden border-t border-border/50 bg-gradient-to-b from-background to-background/50">

        {/* Intro text on the left */}
        <div className="absolute top-24 md:top-32 left-6 md:left-24 z-20 max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-outfit text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            How we <span className="text-gradient italic">deliver</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            {t("subheading")}
          </motion.p>
        </div>

        {/* Horizontal scroll container */}
        <motion.div style={{ x }} className="flex gap-12 px-6 md:px-24 mt-48 lg:mt-32 pb-12 w-max">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative w-[85vw] sm:w-[50vw] md:w-[400px] h-[400px] flex flex-col justify-between p-8 rounded-3xl bg-card border border-border/50 shrink-0 shadow-lg group hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="font-outfit text-6xl font-black text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                  {step.id}
                </div>
                <div className="p-4 bg-background rounded-2xl border border-border">
                  {step.icon}
                </div>
              </div>
              <div>
                <h3 className="font-outfit text-3xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
              </div>
              {index !== steps.length - 1 && (
                <div className="absolute right-[-48px] top-1/2 w-12 h-0.5 bg-border -translate-y-1/2">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border" />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
