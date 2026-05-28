"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { ShoppingCart, BarChart3, GraduationCap, BookOpen, Palette, Megaphone, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { scrollToSection } from "@/lib/utils";

const serviceConfig = [
  { icon: ShoppingCart,  color: "text-primary",    glow: "from-primary/20",    border: "group-hover:border-primary/50",    bg: "bg-primary/10"    },
  { icon: BarChart3,     color: "text-accent",     glow: "from-accent/20",     border: "group-hover:border-accent/50",     bg: "bg-accent/10"     },
  { icon: GraduationCap, color: "text-orange-400", glow: "from-orange-500/20", border: "group-hover:border-orange-500/50", bg: "bg-orange-500/10" },
  { icon: BookOpen,      color: "text-yellow-400", glow: "from-yellow-500/20", border: "group-hover:border-yellow-500/50", bg: "bg-yellow-500/10" },
  { icon: Palette,       color: "text-pink-400",   glow: "from-pink-500/20",   border: "group-hover:border-pink-500/50",   bg: "bg-pink-500/10"   },
  { icon: Megaphone,     color: "text-teal-400",   glow: "from-teal-500/20",   border: "group-hover:border-teal-500/50",   bg: "bg-teal-500/10"   },
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

export function ServicesSection() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="relative py-32 overflow-hidden bg-background">
      {/* Subtle background grid */}
      <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">What We Build</span>
            <h2 className="font-outfit text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Capabilities designed for{" "}
              <span className="text-gradient">scale</span>.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t("subheading")}
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceConfig.map((cfg, index) => {
            const Icon = cfg.icon;
            return (
              <StaggerItem key={index}>
                <TiltCard>
                  {/* Card base */}
                  <div className={`relative h-full border border-border/50 ${cfg.border} bg-card transition-all duration-300 rounded-2xl p-8 shadow-sm`}>
                    {/* Top gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.glow.replace('/20', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    {/* Glow bleed */}
                    <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${cfg.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className="relative z-10">
                      <div className={`mb-6 p-4 rounded-xl ${cfg.bg} w-fit`}>
                        <Icon className={`w-7 h-7 ${cfg.color}`} />
                      </div>
                      <h3 className="font-outfit text-xl font-semibold mb-3 text-foreground">
                        {t(`item${index}.title`)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {t(`item${index}.description`)}
                      </p>
                      <motion.button
                        onClick={() => scrollToSection("cta")}
                        className={`mt-8 flex items-center gap-1 text-sm font-medium ${cfg.color} cursor-pointer`}
                        whileHover="hover"
                      >
                        {t("learnMore")}
                        <motion.span
                          variants={{ hover: { x: 4 } }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </motion.button>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
