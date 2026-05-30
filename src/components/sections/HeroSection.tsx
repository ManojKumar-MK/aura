"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Play, Code2, MoveDown } from "lucide-react";
import { scrollToSection } from "@/lib/utils";


interface Props {
  config?: Record<string, string>;
}

export function HeroSection({ config = {} }: Props) {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const ta = locale === "ta";

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const mesh1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const mesh2Y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const badge        = (ta && config.badge_ta)          ? config.badge_ta          : (config.badge          ?? t("available"));
  const title        = (ta && config.heading_ta)        ? config.heading_ta        : (config.heading        ?? t("title"));
  const subtitle     = (ta && config.subheading_ta)     ? config.subheading_ta     : (config.subheading     ?? t("subtitle"));
  const ctaPrimary   = (ta && config.cta_primary_ta)   ? config.cta_primary_ta   : (config.cta_primary   ?? t("startProject"));
  const ctaSecondary = (ta && config.cta_secondary_ta) ? config.cta_secondary_ta : (config.cta_secondary ?? t("viewShowcase"));

  return (
    <section ref={sectionRef} className="dot-grid relative min-h-[95vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      <motion.div
        style={{ y: mesh1Y }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse pointer-events-none"
      />
      <motion.div
        style={{ y: mesh2Y }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] mix-blend-screen opacity-30 pointer-events-none"
      />

      <StaggerContainer className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <StaggerItem>
          <button
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground mb-8 cursor-pointer hover:bg-muted transition-colors text-left"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            {badge}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </StaggerItem>

        <StaggerItem>
          <h1 className="font-outfit text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{title}</span>
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
            {subtitle}
          </p>
        </StaggerItem>

        <StaggerItem className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <MagneticButton onClick={() => scrollToSection("contact")}>
            {ctaPrimary} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
          <MagneticButton variant="outline" onClick={() => scrollToSection("academy")}>
            <Play className="w-5 h-5" /> {ctaSecondary}
          </MagneticButton>
        </StaggerItem>
      </StaggerContainer>

      {/* Floating Dashboard Mockup */}
      <FadeIn delay={0.8} duration={1} className="relative w-full max-w-5xl mx-auto mt-24 z-20 px-4">
        <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-[0_0_80px_-20px_var(--color-primary)] lg:-rotate-1 hover:rotate-0 transition-transform duration-700">
          <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border/40">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-muted-foreground/60 font-mono">aura — live</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500 font-mono">live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/40">
            <div className="p-4 font-mono text-xs space-y-1.5">
              <p className="text-muted-foreground/60 mb-3 text-[11px] uppercase tracking-wider">Student Progress</p>
              <p><span className="text-green-400">✓</span> <span className="text-muted-foreground">DSA module complete</span></p>
              <p><span className="text-green-400">✓</span> <span className="text-muted-foreground">Security lab passed</span></p>
              <p><span className="text-primary">→</span> <span className="text-foreground">AI Integration — active</span></p>
              <p className="pl-4 text-muted-foreground/60">Building LLM pipeline…</p>
              <p><span className="text-green-400">✓</span> <span className="text-green-400 font-semibold">Mock interview: passed</span></p>
              <div className="mt-3 flex items-center gap-1 text-muted-foreground/50">
                <span>$</span>
                <span className="border-r border-foreground/60 animate-pulse">&nbsp;</span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <p className="text-muted-foreground/60 text-[11px] uppercase tracking-wider font-mono">Academy Stats</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                  <p className="text-2xl font-black font-outfit text-primary">4<span className="text-sm">+</span></p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Programs</p>
                </div>
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <p className="text-2xl font-black font-outfit text-accent">100<span className="text-sm">%</span></p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Hands-on</p>
                </div>
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                  <p className="text-2xl font-black font-outfit text-green-400">Real</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Projects</p>
                </div>
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                  <p className="text-2xl font-black font-outfit text-yellow-400">1:1</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Mentoring</p>
                </div>
              </div>
              <div className="mt-auto">
                <svg viewBox="0 0 200 40" className="w-full h-8 opacity-60">
                  <polyline points="0,35 25,28 50,30 75,18 100,22 125,10 150,14 175,6 200,8"
                    fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="0,35 25,28 50,30 75,18 100,22 125,10 150,14 175,6 200,8 200,40 0,40"
                    fill="var(--color-primary)" fillOpacity="0.08" />
                </svg>
              </div>
            </div>

            <div className="p-4 space-y-2.5">
              <p className="text-muted-foreground/60 text-[11px] uppercase tracking-wider font-mono">Our Services</p>
              {[
                { name: "Ecommerce Store", status: "delivered", color: "text-green-400" },
                { name: "Landing Page", status: "delivered", color: "text-green-400" },
                { name: "Brand Marketing", status: "delivered", color: "text-green-400" },
                { name: "DSA Mentorship", status: "live", color: "text-green-400" },
                { name: "AI Integration", status: "live", color: "text-green-400" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3 h-3 text-muted-foreground/50" />
                    <span className="text-foreground/80 font-mono">{d.name}</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${d.color}`}>{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <SlideUp delay={1.2} className="w-full mt-32 flex flex-col items-center opacity-70">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="opacity-50"
        >
          <MoveDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </SlideUp>
    </section>
  );
}
