"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Play, Code2, MoveDown } from "lucide-react";
import { scrollToSection } from "@/lib/utils";

const companies = [
  "Microsoft", "Stripe", "Linear", "Vercel", "Scale", "Brex", "Arc", "Ramp"
];

export function HeroSection() {
  const t = useTranslations("Hero");
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // Parallax offsets for the two gradient blobs
  const mesh1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const mesh2Y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} className="dot-grid relative min-h-[95vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Animated Gradient Meshes — now with parallax */}
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground mb-8 cursor-pointer hover:bg-muted transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            {t("available")}
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </StaggerItem>

        <StaggerItem>
          <h1 className="font-outfit text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t("title")}</span>
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
            {t("subtitle")}
          </p>
        </StaggerItem>

        <StaggerItem className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <MagneticButton onClick={() => scrollToSection("cta")}>
            {t("startProject")} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
          <MagneticButton variant="outline" onClick={() => scrollToSection("work")}>
            <Play className="w-5 h-5" /> {t("viewShowcase")}
          </MagneticButton>
        </StaggerItem>
      </StaggerContainer>

      {/* Floating Dashboard Mockup */}
      <FadeIn delay={0.8} duration={1} className="relative w-full max-w-5xl mx-auto mt-24 z-20 px-4">
        <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-[0_0_80px_-20px_var(--color-primary)] lg:-rotate-1 hover:rotate-0 transition-transform duration-700">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border/40">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-muted-foreground/60 font-mono">aura-platform — production</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500 font-mono">live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/40">

            {/* Panel 1 — Terminal */}
            <div className="p-4 font-mono text-xs space-y-1.5">
              <p className="text-muted-foreground/60 mb-3 text-[11px] uppercase tracking-wider">Deploy Log</p>
              <p><span className="text-green-400">✓</span> <span className="text-muted-foreground">Tests passed</span> <span className="text-muted-foreground/40">312ms</span></p>
              <p><span className="text-green-400">✓</span> <span className="text-muted-foreground">Build optimised</span></p>
              <p><span className="text-primary">→</span> <span className="text-foreground">Deploying api-v3.2.0</span></p>
              <p className="pl-4 text-muted-foreground/60">Uploading assets…</p>
              <p className="pl-4 text-muted-foreground/60">Warming edge nodes…</p>
              <p><span className="text-green-400">✓</span> <span className="text-green-400 font-semibold">Production live</span></p>
              <div className="mt-3 flex items-center gap-1 text-muted-foreground/50">
                <span>$</span>
                <span className="border-r border-foreground/60 animate-pulse">&nbsp;</span>
              </div>
            </div>

            {/* Panel 2 — Live metrics */}
            <div className="p-4 flex flex-col gap-3">
              <p className="text-muted-foreground/60 text-[11px] uppercase tracking-wider font-mono">System Health</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                  <p className="text-2xl font-black font-outfit text-primary">99.9<span className="text-sm">%</span></p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Uptime SLA</p>
                </div>
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <p className="text-2xl font-black font-outfit text-accent">12M<span className="text-sm">+</span></p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Req / day</p>
                </div>
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                  <p className="text-2xl font-black font-outfit text-green-400">38<span className="text-sm">ms</span></p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">P99 latency</p>
                </div>
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                  <p className="text-2xl font-black font-outfit text-yellow-400">0</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Incidents</p>
                </div>
              </div>
              {/* Sparkline */}
              <div className="mt-auto">
                <svg viewBox="0 0 200 40" className="w-full h-8 opacity-60">
                  <polyline points="0,35 25,28 50,30 75,18 100,22 125,10 150,14 175,6 200,8"
                    fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="0,35 25,28 50,30 75,18 100,22 125,10 150,14 175,6 200,8 200,40 0,40"
                    fill="var(--color-primary)" fillOpacity="0.08" />
                </svg>
              </div>
            </div>

            {/* Panel 3 — Recent deployments */}
            <div className="p-4 space-y-2.5">
              <p className="text-muted-foreground/60 text-[11px] uppercase tracking-wider font-mono">Recent Deploys</p>
              {[
                { name: "api-gateway", version: "v3.2.0", status: "live", color: "text-green-400" },
                { name: "auth-service", version: "v2.1.4", status: "live", color: "text-green-400" },
                { name: "data-pipeline", version: "v1.9.0", status: "live", color: "text-green-400" },
                { name: "ml-inference", version: "v0.8.2", status: "staging", color: "text-yellow-400" },
                { name: "cdn-assets",   version: "v4.0.1", status: "live", color: "text-green-400" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3 h-3 text-muted-foreground/50" />
                    <span className="text-foreground/80 font-mono">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/50 font-mono">{d.version}</span>
                    <span className={`text-[10px] font-semibold ${d.color}`}>{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Marquee & Scroll Indicator */}
      <SlideUp delay={1.2} className="w-full mt-32 flex flex-col items-center opacity-70">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">Trusted by industry leaders</p>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <motion.ul
            className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
            animate={{ x: [0, -1000] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          >
            {[...companies, ...companies].map((company, i) => (
              <li key={i} className="text-xl md:text-2xl font-bold text-muted-foreground/50 font-outfit">
                {company}
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-20 opacity-50"
        >
          <MoveDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </SlideUp>
    </section>
  );
}
