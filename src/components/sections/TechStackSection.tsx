"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";
import { LayoutDashboard, Database, Server, Cpu, Shield, Braces, CloudLightning, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const popIn = (delay: number) => ({
  initial: { opacity: 0, scale: 0 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { delay, duration: 0.4, ease: EASE },
});

export function TechStackSection() {
  const t = useTranslations("TechStack");

  return (
    <section className="relative py-32 bg-background overflow-hidden flex flex-col items-center justify-center">
      {/* Title */}
      <div className="container mx-auto px-6 text-center max-w-4xl relative z-20 mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">{t("label")}</span>
        <h2 className="font-outfit text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Built on modern, <br className="hidden md:block" />
          <span className="text-gradient">uncompromised</span> technology.
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          {t("subheading")}
        </p>
      </div>

      {/* Orbiting Tech Stack Visualization */}
      <div className="relative w-full max-w-[800px] h-[500px] sm:h-[600px] flex items-center justify-center">

        {/* Core Center */}
        <FadeIn delay={0.2} className="relative z-30">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/15 border border-primary/50 flex items-center justify-center shadow-[0_0_80px_-5px_var(--color-primary)] backdrop-blur-xl">
            <Activity className="w-10 h-10 md:w-16 md:h-16 text-primary" />
          </div>
        </FadeIn>

        {/* Orbit 1 */}
        <div className="absolute inset-0 m-auto w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
          <motion.div {...popIn(0.4)} className="absolute -top-6 left-1/2 -ml-6 w-12 h-12 rounded-full bg-card border border-border/80 flex items-center justify-center shadow-lg animate-[spin_20s_linear_infinite_reverse]">
            <LayoutDashboard className="w-5 h-5 text-foreground" />
          </motion.div>
          <motion.div {...popIn(0.5)} className="absolute -bottom-6 left-1/2 -ml-6 w-12 h-12 rounded-full bg-card border border-border/80 flex items-center justify-center shadow-lg animate-[spin_20s_linear_infinite_reverse]">
            <Braces className="w-5 h-5 text-accent" />
          </motion.div>
        </div>

        {/* Orbit 2 */}
        <div className="absolute inset-0 m-auto w-[380px] h-[380px] md:w-[550px] md:h-[550px] rounded-full border border-accent/20 animate-[spin_35s_linear_infinite_reverse]">
          <motion.div {...popIn(0.6)} className="absolute top-1/4 -left-6 w-12 h-12 rounded-full bg-card border border-border/80 flex items-center justify-center shadow-lg animate-[spin_35s_linear_infinite]">
            <Database className="w-5 h-5 text-blue-500" />
          </motion.div>
          <motion.div {...popIn(0.7)} className="absolute bottom-1/4 -right-6 w-12 h-12 rounded-full bg-card border border-border/80 flex items-center justify-center shadow-lg animate-[spin_35s_linear_infinite]">
            <Server className="w-5 h-5 text-purple-500" />
          </motion.div>
          <motion.div {...popIn(0.8)} className="absolute -bottom-6 left-1/2 -ml-6 w-12 h-12 rounded-full bg-card border border-border/80 flex items-center justify-center shadow-lg animate-[spin_35s_linear_infinite]">
            <CloudLightning className="w-5 h-5 text-yellow-500" />
          </motion.div>
        </div>

        {/* Orbit 3 (Faint outer) */}
        <div className="hidden sm:block absolute inset-0 m-auto w-[750px] h-[750px] rounded-full border border-border/10 animate-[spin_50s_linear_infinite]">
          <motion.div {...popIn(0.9)} className="absolute top-1/2 -left-6 w-12 h-12 rounded-full bg-card border border-border/80 flex items-center justify-center shadow-lg animate-[spin_50s_linear_infinite_reverse]">
            <Cpu className="w-5 h-5 text-green-500" />
          </motion.div>
          <motion.div {...popIn(1.0)} className="absolute top-1/4 -right-2 w-12 h-12 rounded-full bg-card border border-border/80 flex items-center justify-center shadow-lg animate-[spin_50s_linear_infinite_reverse]">
            <Shield className="w-5 h-5 text-red-500" />
          </motion.div>
        </div>

        {/* Floating background particles */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-primary/50 blur-sm animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-accent/50 blur-sm animate-pulse delay-700" />
          <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-foreground/20 blur-sm animate-pulse delay-1000" />
        </div>
      </div>
    </section>
  );
}
