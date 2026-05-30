"use client";

import { useState } from "react";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { ArrowRight, Loader2, Phone, Mail, Camera, Briefcase, AtSign, Users, PlayCircle, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  config?: Record<string, string>;
}

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Camera,
  linkedin:  Briefcase,
  twitter:   AtSign,
  facebook:  Users,
  youtube:   PlayCircle,
  whatsapp:  MessageCircle,
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin:  "LinkedIn",
  twitter:   "Twitter / X",
  facebook:  "Facebook",
  youtube:   "YouTube",
  whatsapp:  "WhatsApp",
};

export function CtaSection({ config = {} }: Props) {
  const t = useTranslations("Cta");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const contactEmail   = config.cta_email       ?? "hello@aura.studio";
  const heading        = config.cta_heading      ?? t("heading");
  const subheading     = config.cta_subheading   ?? t("subheading");
  const placeholder    = config.cta_placeholder  ?? t("emailPlaceholder");
  const buttonText     = config.cta_button       ?? t("submitButton");
  const successMessage = config.cta_success      ?? t("successMessage");
  const showName       = config.cta_show_name    !== "false";
  const showMessage    = config.cta_show_message !== "false";

  const phone          = config.contact_phone    ?? "";
  const displayEmail   = config.contact_email_display ?? contactEmail;

  // Collect configured social links
  const socials = (["instagram","linkedin","twitter","facebook","youtube","whatsapp"] as const)
    .map(key => ({ key, url: config[`contact_${key}`] ?? "" }))
    .filter(s => s.url.trim() !== "");

  const hasDirectContact = phone || displayEmail || socials.length > 0;

  const fieldCls = "w-full px-6 py-4 bg-card text-foreground rounded-2xl border border-border/50 focus:outline-none focus:border-primary/50 text-base transition-colors placeholder:text-muted-foreground/50";

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);

    // Save to DB
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    }).catch(() => {});

    // Show success first, then open mailto after a brief delay
    setLoading(false);
    setSent(true);
    const savedName = name;
    const savedEmail = email;
    const savedMessage = message;
    setName(""); setEmail(""); setMessage("");

    const body = [
      savedName    ? `Name: ${savedName}`        : "",
      `Email: ${savedEmail}`,
      savedMessage ? `Message:\n${savedMessage}` : "",
    ].filter(Boolean).join("\n\n");

    setTimeout(() => {
      window.open(`mailto:${contactEmail}?subject=New Enquiry&body=${encodeURIComponent(body)}`, "_blank");
    }, 400);
  };

  return (
    <section id="cta" className="relative py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-pulse" />
        <div className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-accent/20 rounded-full blur-[80px] mix-blend-screen opacity-50 animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <SlideUp>
            <h2 className="font-outfit text-4xl md:text-6xl font-black tracking-tight mb-6">
              {heading}
            </h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subheading}
            </p>
          </SlideUp>
        </div>

        <div className={`grid gap-12 items-start ${hasDirectContact ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto"}`}>

          {/* Contact form */}
          <FadeIn delay={0.2}>
            {sent ? (
              <div className="py-10 px-8 rounded-2xl bg-primary/10 border border-primary/30 text-primary font-outfit font-semibold text-lg text-center">
                {successMessage}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {showName && (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={fieldCls}
                  />
                )}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-60 transition duration-500 blur-sm" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    required
                    className={`relative ${fieldCls} z-10`}
                  />
                </div>
                {showMessage && (
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message or question (optional)"
                    rows={4}
                    className={`${fieldCls} resize-none`}
                  />
                )}
                <div className="mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl px-8 py-4 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-primary/20"
                  >
                    {loading
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                      : <>{buttonText} <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
              </form>
            )}
          </FadeIn>

          {/* Direct contact info */}
          {hasDirectContact && (
            <FadeIn delay={0.35} className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Or reach us directly</p>

              {/* Phone */}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                    <p className="font-outfit font-semibold text-foreground">{phone}</p>
                  </div>
                </a>
              )}

              {/* Email */}
              {displayEmail && (
                <a
                  href={`mailto:${displayEmail}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/40 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <p className="font-outfit font-semibold text-foreground">{displayEmail}</p>
                  </div>
                </a>
              )}

              {/* Social links */}
              {socials.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-3">Follow us</p>
                  <div className="flex flex-wrap gap-3">
                    {socials.map(({ key, url }) => {
                      const Icon = SOCIAL_ICONS[key];
                      const href = key === "whatsapp"
                        ? `https://wa.me/${url.replace(/\D/g, "")}`
                        : url;
                      return (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={SOCIAL_LABELS[key]}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:text-primary text-muted-foreground transition-all text-sm font-medium group"
                        >
                          <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          {SOCIAL_LABELS[key]}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </FadeIn>
          )}

        </div>
      </div>
    </section>
  );
}
