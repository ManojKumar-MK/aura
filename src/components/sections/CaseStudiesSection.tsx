"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { useTranslations } from "next-intl";
import { scrollToSection } from "@/lib/utils";

function AnimatedCounter({ from, to, duration = 2, suffix = "" }: { from: number, to: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * (to - from) + from));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function CaseStudiesSection() {
  const t = useTranslations("CaseStudies");

  return (
    <section id="work" className="relative py-32 bg-background overflow-hidden z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <SlideUp className="text-center mb-24">
          <h2 className="font-outfit text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Proven <span className="text-gradient italic">impact</span>.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </SlideUp>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">

          {/* Main Large Card */}
          <FadeIn delay={0.1} className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-muted transform group-hover:scale-105 transition-transform duration-700">
              <div className="w-full h-full bg-[linear-gradient(45deg,var(--color-primary)_0%,transparent_100%)] opacity-20 pulse-slow" />
            </div>
            <div className="relative z-20 h-full p-8 flex flex-col justify-end">
              <div className="flex gap-4 mb-4">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary uppercase tracking-wide backdrop-blur-sm">{t("item0.tag1")}</span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent/20 text-accent uppercase tracking-wide backdrop-blur-sm">{t("item0.tag2")}</span>
              </div>
              <h3 className="font-outfit text-3xl font-bold text-foreground mb-2">{t("item0.title")}</h3>
              <p className="text-muted-foreground w-3/4 mb-6">{t("item0.description")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-4xl font-bold text-foreground font-outfit">
                    <AnimatedCounter from={0} to={85} suffix="%" />
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{t("item0.stat1Label")}</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground font-outfit">
                    <AnimatedCounter from={0} to={12} suffix="M+" />
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{t("item0.stat2Label")}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Smart CRM Card */}
          <FadeIn delay={0.2} className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
            <div className="absolute inset-0 bg-muted transform group-hover:scale-105 transition-transform duration-700">
              <div className="w-full h-full bg-[linear-gradient(-45deg,var(--color-accent)_0%,transparent_100%)] opacity-20" />
            </div>
            <div className="relative z-20 h-full p-8 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-foreground/10 text-foreground uppercase tracking-wide backdrop-blur-sm">{t("item1.tag")}</span>
                <h3 className="font-outfit text-2xl font-bold text-foreground mt-4 mb-2">{t("item1.title")}</h3>
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground font-outfit text-primary">
                  <AnimatedCounter from={0} to={200} suffix="%" />
                </p>
                <p className="text-sm text-muted-foreground font-medium">{t("item1.statLabel")}</p>
              </div>
            </div>
          </FadeIn>

          {/* Data Analytics Card */}
          <FadeIn delay={0.3} className="md:col-span-1 group relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
            <div className="absolute inset-0 bg-muted transform group-hover:scale-105 transition-transform duration-700">
              <div className="w-full h-full bg-[linear-gradient(to_top,var(--color-yellow-500)_0%,transparent_100%)] opacity-10" />
            </div>
            <div className="relative z-20 h-full p-8 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-foreground/10 text-foreground uppercase tracking-wide backdrop-blur-sm">{t("item2.tag")}</span>
                <h3 className="font-outfit text-2xl font-bold text-foreground mt-4 mb-2">{t("item2.title")}</h3>
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground font-outfit text-accent">
                  <AnimatedCounter from={0} to={90} suffix="%" />
                </p>
                <p className="text-sm text-muted-foreground font-medium">{t("item2.statLabel")}</p>
              </div>
            </div>
          </FadeIn>

          {/* Command Center Card */}
          <FadeIn delay={0.4} className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-secondary/30 border border-border/50 shadow-xl flex items-center justify-between p-8">
            <div className="max-w-md z-20 relative">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary uppercase tracking-wide backdrop-blur-sm">{t("item3.tag")}</span>
              <h3 className="font-outfit text-3xl font-bold text-foreground mt-6 mb-4">{t("item3.title")}</h3>
              <p className="text-muted-foreground mb-6">{t("item3.description")}</p>
              <button
                onClick={() => scrollToSection("cta")}
                className="text-sm font-semibold flex items-center gap-2 group-hover:text-primary transition-colors"
              >
                {t("readMore")} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
            {/* Mock visual placeholder */}
            <div className="hidden md:block w-72 h-48 rounded-lg bg-card/60 backdrop-blur-md border border-border/50 shadow-2xl relative z-20 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 w-full h-6 bg-border/40 flex items-center px-2 gap-1">
                <div className="w-2 h-2 rounded-full bg-foreground/20"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/20"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/20"></div>
              </div>
              <div className="p-4 pt-10 h-full flex flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-muted"></div>
                <div className="h-4 w-1/2 rounded bg-muted/60"></div>
                <div className="mt-auto h-20 w-full rounded bg-primary/20"></div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
