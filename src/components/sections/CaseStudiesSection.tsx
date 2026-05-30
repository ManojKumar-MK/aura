"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { useTranslations } from "next-intl";
import { scrollToSection } from "@/lib/utils";
import type { CaseStudy } from "@/lib/supabase";

function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const num = parseFloat(value);
  const suffix = value.replace(/[\d.]/g, "");
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView || isNaN(num)) return;
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * num));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isInView, num, duration]);

  if (isNaN(num)) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{count}{suffix}</span>;
}

interface Props {
  caseStudies?: CaseStudy[];
}

export function CaseStudiesSection({ caseStudies = [] }: Props) {
  const t = useTranslations("CaseStudies");

  const items: CaseStudy[] = caseStudies.length > 0 ? caseStudies : [
    {
      id: "0", tag1: t("item0.tag1"), tag2: t("item0.tag2"),
      title: t("item0.title"), description: t("item0.description"),
      stat1_value: "85%", stat1_label: t("item0.stat1Label"),
      stat2_value: "12M+", stat2_label: t("item0.stat2Label"),
      display_order: 0, is_visible: true,
    },
    {
      id: "1", tag1: t("item1.tag"), tag2: "",
      title: t("item1.title"), description: "",
      stat1_value: "200%", stat1_label: t("item1.statLabel"),
      stat2_value: "", stat2_label: "",
      display_order: 1, is_visible: true,
    },
    {
      id: "2", tag1: t("item2.tag"), tag2: "",
      title: t("item2.title"), description: "",
      stat1_value: "90%", stat1_label: t("item2.statLabel"),
      stat2_value: "", stat2_label: "",
      display_order: 2, is_visible: true,
    },
    {
      id: "3", tag1: t("item3.tag"), tag2: "",
      title: t("item3.title"), description: t("item3.description"),
      stat1_value: "", stat1_label: "",
      stat2_value: "", stat2_label: "",
      display_order: 3, is_visible: true,
    },
  ];

  const [main, ...rest] = items;
  const mid = rest.slice(0, 2);
  const last = rest[2];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">

          {/* Main large card */}
          {main && (
            <FadeIn delay={0.1} className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-muted transform group-hover:scale-105 transition-transform duration-700">
                <div className="w-full h-full bg-[linear-gradient(45deg,var(--color-primary)_0%,transparent_100%)] opacity-20" />
              </div>
              <div className="relative z-20 h-full p-8 flex flex-col justify-end">
                <div className="flex gap-4 mb-4">
                  {main.tag1 && <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary uppercase tracking-wide backdrop-blur-sm">{main.tag1}</span>}
                  {main.tag2 && <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent/20 text-accent uppercase tracking-wide backdrop-blur-sm">{main.tag2}</span>}
                </div>
                <h3 className="font-outfit text-3xl font-bold text-foreground mb-2">{main.title}</h3>
                {main.description && <p className="text-muted-foreground w-3/4 mb-6">{main.description}</p>}
                {(main.stat1_value || main.stat2_value) && (
                  <div className="grid grid-cols-2 gap-4">
                    {main.stat1_value && (
                      <div>
                        <p className="text-4xl font-bold text-foreground font-outfit"><AnimatedCounter value={main.stat1_value} /></p>
                        <p className="text-sm text-muted-foreground font-medium">{main.stat1_label}</p>
                      </div>
                    )}
                    {main.stat2_value && (
                      <div>
                        <p className="text-4xl font-bold text-foreground font-outfit"><AnimatedCounter value={main.stat2_value} /></p>
                        <p className="text-sm text-muted-foreground font-medium">{main.stat2_label}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FadeIn>
          )}

          {/* Mid cards */}
          {mid.map((item, i) => (
            <FadeIn key={item.id} delay={0.2 + i * 0.1} className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
              <div className="absolute inset-0 bg-muted transform group-hover:scale-105 transition-transform duration-700">
                <div className={`w-full h-full opacity-20 ${i === 0 ? "bg-[linear-gradient(-45deg,var(--color-accent)_0%,transparent_100%)]" : "bg-[linear-gradient(to_top,var(--color-primary)_0%,transparent_100%)]"}`} />
              </div>
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-foreground/10 text-foreground uppercase tracking-wide">{item.tag1}</span>
                  <h3 className="font-outfit text-2xl font-bold text-foreground mt-4 mb-2">{item.title}</h3>
                </div>
                {item.stat1_value && (
                  <div>
                    <p className={`text-4xl font-bold font-outfit ${i === 0 ? "text-primary" : "text-accent"}`}>
                      <AnimatedCounter value={item.stat1_value} />
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">{item.stat1_label}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}

          {/* Last wide card */}
          {last && (
            <FadeIn delay={0.4} className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-secondary/30 border border-border/50 shadow-xl flex items-center justify-between p-8">
              <div className="max-w-md z-20 relative">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary uppercase tracking-wide">{last.tag1}</span>
                <h3 className="font-outfit text-3xl font-bold text-foreground mt-6 mb-4">{last.title}</h3>
                {last.description && <p className="text-muted-foreground mb-6">{last.description}</p>}
                <button
                  onClick={() => scrollToSection("cta")}
                  className="text-sm font-semibold flex items-center gap-2 group-hover:text-primary transition-colors"
                >
                  {t("readMore")} <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
              <div className="hidden md:block w-72 h-48 rounded-lg bg-card/60 backdrop-blur-md border border-border/50 shadow-2xl relative z-20 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute top-0 w-full h-6 bg-border/40 flex items-center px-2 gap-1">
                  <div className="w-2 h-2 rounded-full bg-foreground/20" />
                  <div className="w-2 h-2 rounded-full bg-foreground/20" />
                  <div className="w-2 h-2 rounded-full bg-foreground/20" />
                </div>
                <div className="p-4 pt-10 h-full flex flex-col gap-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted/60" />
                  <div className="mt-auto h-20 w-full rounded bg-primary/20" />
                </div>
              </div>
            </FadeIn>
          )}

        </div>
      </div>
    </section>
  );
}
