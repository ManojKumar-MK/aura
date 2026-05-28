"use client";

import { Hexagon, Mail, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const CONTACT_EMAIL = "hello@aura.studio";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full border-t border-border/50 bg-background pt-16 pb-8 px-6 lg:px-12 relative z-10 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <Hexagon className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-500" />
            <span className="font-outfit text-2xl font-bold tracking-tight text-foreground">Aura</span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm">{t("tagline")}</p>
          <div className="flex items-center gap-4 mt-6">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email us"
              className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/company/aura-studio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-outfit font-semibold text-foreground mb-4">{t("servicesHeading")}</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("enterpriseSystems")}</a></li>
            <li><a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("dataPlatforms")}</a></li>
            <li><a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("cloudArchitecture")}</a></li>
            <li><a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("fintechSolutions")}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-outfit font-semibold text-foreground mb-4">{t("companyHeading")}</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("aboutUs")}</a></li>
            <li><a href="#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("process")}</a></li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}?subject=Careers at Aura`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("careers")}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("contact")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{t("copyright")}</p>
        <div className="flex gap-6">
          <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy Policy Inquiry`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("privacyPolicy")}</a>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Terms of Service Inquiry`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("termsOfService")}</a>
        </div>
      </div>
    </footer>
  );
}
