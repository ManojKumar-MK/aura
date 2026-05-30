"use client";

import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Hexagon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { scrollToSection } from "@/lib/utils";

interface Props {
  config?: Record<string, string>;
}

export function Navbar({ config = {} }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ta" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const allLinks = [
    { name: config.nav_label_services ?? t("services"), id: "services", flag: "show_services" },
    { name: config.nav_label_academy  ?? t("academy"),  id: "academy",  flag: "show_academy"  },
    { name: config.nav_label_work     ?? t("work"),     id: "work",     flag: "show_impact"   },
  ];

  const navLinks = allLinks.filter(link => config[link.flag] !== "false");

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}
    >
      <div
        className={`w-full max-w-6xl mx-4 px-6 py-3 rounded-2xl flex items-center justify-between border transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-border/50 shadow-lg"
            : "bg-background/40 backdrop-blur-sm border-border/20 shadow-sm"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <Hexagon className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-500" />
          <span className="font-outfit text-xl font-bold tracking-tight text-foreground">Aura</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 hover:bg-muted transition-colors text-sm font-medium text-foreground"
          >
            <Globe className="w-4 h-4 text-muted-foreground" />
            {locale === "en" ? "TA" : "EN"}
          </button>

          <Button
            className="hidden md:inline-flex bg-foreground text-background hover:bg-primary transition-colors"
            onClick={() => scrollToSection("cta")}
          >
            {t("startProject")}
          </Button>
          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-24 left-4 right-4 bg-background border border-border/50 rounded-2xl p-6 shadow-xl flex flex-col gap-6 md:hidden"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { scrollToSection(link.id); setMobileMenuOpen(false); }}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors text-left"
            >
              {link.name}
            </button>
          ))}
          <Button className="w-full bg-foreground text-background" onClick={() => { scrollToSection("cta"); setMobileMenuOpen(false); }}>
            {t("startProject")}
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}
