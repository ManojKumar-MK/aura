"use client";

import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { useTranslations, useLocale } from "next-intl";
import { Code2, Shield, Brain, Mic, Terminal, BookOpen, UserCheck, Briefcase, ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AcademyProgram } from "@/lib/supabase";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Shield, Brain, Mic, Terminal, BookOpen, UserCheck, Briefcase,
};

const COLOR_CYCLE = [
  "text-primary bg-primary/10 border-primary/20 hover:border-primary/50",
  "text-red-400 bg-red-500/10 border-red-500/20 hover:border-red-500/50",
  "text-accent bg-accent/10 border-accent/20 hover:border-accent/50",
  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50",
];

interface Props {
  programs?: AcademyProgram[];
}

export function AcademySection({ programs = [] }: Props) {
  const t = useTranslations("Academy");

  const locale = useLocale();

  const items = programs.length > 0
    ? programs.map((p, i) => ({
        name:        (locale === "ta" && p.name_ta)        ? p.name_ta        : p.name,
        description: (locale === "ta" && p.description_ta) ? p.description_ta : p.description,
        Icon: ICON_MAP[p.icon] ?? Code2,
        color: COLOR_CYCLE[i % COLOR_CYCLE.length],
      }))
    : [0, 1, 2, 3].map((i) => ({
        name: t(`item${i}.name`),
        description: t(`item${i}.description`),
        Icon: [Code2, Shield, Brain, Mic][i],
        color: COLOR_CYCLE[i],
      }));

  const advantages = [
    { title: t("advantage0Title"), desc: t("advantage0Desc"), icon: UserCheck, color: "text-primary bg-primary/10 border-primary/20" },
    { title: t("advantage1Title"), desc: t("advantage1Desc"), icon: Code2,     color: "text-accent bg-accent/10 border-accent/20" },
    { title: t("advantage2Title"), desc: t("advantage2Desc"), icon: Briefcase, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <section id="academy" className="relative py-24 bg-background overflow-hidden z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-primary/8 rounded-full blur-[100px] mix-blend-screen opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">
              {t("tag")}
            </span>
            <h2 className="font-outfit text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-2xl">
              {t("heading")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base text-muted-foreground max-w-xl">
              {t("subheading")}
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          {items.map(({ name, description, Icon, color }, index) => (
            <StaggerItem key={index}>
              <div className={`relative group h-full flex gap-5 p-6 rounded-2xl bg-card border transition-all duration-300 shadow-sm ${color}`}>
                <div className={`p-3 rounded-xl border shrink-0 h-fit ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-outfit text-base font-bold text-foreground mb-1">{name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <SlideUp className="space-y-6">
            <h3 className="font-outfit text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {t("advantageHeading")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We connect college students to real work environments. You write code that actually runs, guided by developers who do this every day.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => scrollToSection("cta")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-7 py-5 font-bold flex items-center gap-2 group shadow-md shadow-primary/20"
              >
                {t("ctaButton")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </SlideUp>

          <StaggerContainer className="space-y-4">
            {advantages.map((adv, index) => {
              const Icon = adv.icon;
              return (
                <StaggerItem key={index}>
                  <div className="flex gap-4 p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/40 hover:border-border transition-colors duration-300">
                    <div className={`p-2.5 rounded-xl border shrink-0 h-fit ${adv.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-outfit text-base font-bold text-foreground">{adv.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{adv.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
