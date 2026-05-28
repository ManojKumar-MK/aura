"use client";

import { useState } from "react";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const CONTACT_EMAIL = "hello@aura.studio";

export function CtaSection() {
  const t = useTranslations("Cta");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email.trim()) return;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Consultation Request&body=Hi Aura team,%0D%0A%0D%0AMy email is: ${encodeURIComponent(email)}%0D%0A%0D%0AI would like to schedule a consultation.`;
    setSent(true);
    setEmail("");
  };

  return (
    <section id="cta" className="relative py-40 overflow-hidden bg-background">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-pulse" />
        <div className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-accent/20 rounded-full blur-[80px] mix-blend-screen opacity-50 animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center flex flex-col items-center">
        <SlideUp>
          <h2 className="font-outfit text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
            {t("heading")}
          </h2>
        </SlideUp>

        <SlideUp delay={0.1}>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16">
            {t("subheading")}
          </p>
        </SlideUp>

        <FadeIn delay={0.2} className="w-full max-w-md mx-auto">
          {sent ? (
            <div className="py-6 px-8 rounded-full bg-primary/10 border border-primary/30 text-primary font-outfit font-semibold text-lg">
              {t("successMessage")}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full opacity-30 group-hover:opacity-100 transition duration-500 blur-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className="relative w-full px-8 py-5 bg-card text-foreground rounded-full border border-border/50 focus:outline-none focus:border-primary/50 text-lg transition-colors placeholder:text-muted-foreground/50 z-10"
                />
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="relative rounded-full px-8 py-5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-all"
                >
                  {t("submitButton")} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
