"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { ShoppingCart, FileText, Megaphone, BarChart3, Palette, Globe, Code2, Zap } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { Service } from "@/lib/supabase";

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingCart, FileText, Megaphone, BarChart3, Palette, Globe, Code2, Zap,
};

const COLOR_CYCLE = [
  { color: "text-primary",    glow: "from-primary/20",    border: "group-hover:border-primary/50",    bg: "bg-primary/10"    },
  { color: "text-accent",     glow: "from-accent/20",     border: "group-hover:border-accent/50",     bg: "bg-accent/10"     },
  { color: "text-pink-400",   glow: "from-pink-500/20",   border: "group-hover:border-pink-500/50",   bg: "bg-pink-500/10"   },
  { color: "text-orange-400", glow: "from-orange-500/20", border: "group-hover:border-orange-500/50", bg: "bg-orange-500/10" },
  { color: "text-teal-400",   glow: "from-teal-500/20",   border: "group-hover:border-teal-500/50",   bg: "bg-teal-500/10"   },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(yPct * 14);
    setRotateY(xPct * -14);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      animate={{ rotateX, rotateY, transformPerspective: 1000 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative rounded-2xl overflow-hidden group ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  services?: Service[];
}

export function ServicesSection({ services = [] }: Props) {
  const t = useTranslations("Services");
  const locale = useLocale();

  const items = services.length > 0
    ? services.map((s, i) => ({
        title:       (locale === "ta" && s.title_ta)       ? s.title_ta       : s.title,
        description: (locale === "ta" && s.description_ta) ? s.description_ta : s.description,
        Icon: ICON_MAP[s.icon] ?? ShoppingCart,
        cfg: COLOR_CYCLE[i % COLOR_CYCLE.length],
      }))
    : [0, 1, 2].map((i) => ({
        title: t(`item${i}.title`),
        description: t(`item${i}.description`),
        Icon: [ShoppingCart, FileText, Megaphone][i],
        cfg: COLOR_CYCLE[i],
      }));

  return (
    <section id="services" className="relative py-24 overflow-hidden bg-background">
      <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">What We Build</span>
            <h2 className="font-outfit text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("heading")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base text-muted-foreground max-w-xl">
              {t("subheading")}
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ title, description, Icon, cfg }, index) => (
            <StaggerItem key={index}>
              <TiltCard>
                <div className={`relative h-full border border-border/50 ${cfg.border} bg-card transition-all duration-300 rounded-2xl p-7 shadow-sm`}>
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.glow.replace('/20', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${cfg.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                  <div className="relative z-10">
                    <div className={`mb-5 p-3 rounded-xl ${cfg.bg} w-fit`}>
                      <Icon className={`w-6 h-6 ${cfg.color}`} />
                    </div>
                    <h3 className="font-outfit text-lg font-semibold mb-2 text-foreground">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
