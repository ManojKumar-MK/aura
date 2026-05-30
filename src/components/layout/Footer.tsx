import { Hexagon, Mail, Phone, ExternalLink, Camera, Briefcase, AtSign, Users, PlayCircle, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

interface Props {
  config?: Record<string, string>;
}

type SocialKey = "instagram" | "linkedin" | "twitter" | "facebook" | "youtube" | "whatsapp";

const SOCIAL_META: Record<SocialKey, { label: string; Icon: React.ElementType }> = {
  instagram: { label: "Instagram",   Icon: Camera        },
  linkedin:  { label: "LinkedIn",    Icon: Briefcase     },
  twitter:   { label: "X / Twitter", Icon: AtSign        },
  facebook:  { label: "Facebook",    Icon: Users         },
  youtube:   { label: "YouTube",     Icon: PlayCircle    },
  whatsapp:  { label: "WhatsApp",    Icon: MessageCircle },
};

const SOCIAL_KEYS: SocialKey[] = ["instagram","linkedin","twitter","facebook","youtube","whatsapp"];

export function Footer({ config = {} }: Props) {
  const contactEmail = config.footer_contact_email  ?? config.contact_email_display ?? "hello@aura.studio";
  const tagline      = config.footer_tagline        ?? "Helping businesses grow online and students build real skills — ecommerce, landing pages, brand marketing, and hands-on tech education.";
  const phone        = config.contact_phone         ?? "";

  const socials = SOCIAL_KEYS
    .map(key => ({ key, url: config[`contact_${key}`] ?? "", ...SOCIAL_META[key] }))
    .filter(s => s.url.trim() !== "");

  const iconCls = "p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground";

  return (
    <footer className="w-full border-t border-border/50 bg-background pt-16 pb-8 px-6 lg:px-12 relative z-10 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

        {/* Brand + contact */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <Hexagon className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-500" />
            <span className="font-outfit text-2xl font-bold tracking-tight text-foreground">Aura</span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{tagline}</p>

          {/* Direct contact */}
          <div className="mt-6 space-y-2">
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                {contactEmail}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                {phone}
              </a>
            )}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            {socials.length > 0
              ? socials.map(({ key, url, label, Icon }) => {
                  const href = key === "whatsapp"
                    ? `https://wa.me/${url.replace(/\D/g, "")}`
                    : url;
                  return (
                    <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={iconCls}>
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })
              : (
                // Fallback — only email icon when no socials configured
                <a href={`mailto:${contactEmail}`} aria-label="Email us" className={iconCls}>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )
            }
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-outfit font-semibold text-foreground mb-4">Services</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ecommerce for Business</a></li>
            <li><a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Landing Page</a></li>
            <li><a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Brand Marketing</a></li>
            <li><a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">IT Consulting & Hosting</a></li>
          </ul>
        </div>

        {/* Academy */}
        <div>
          <h4 className="font-outfit font-semibold text-foreground mb-4">Academy</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="#academy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Master DSA</a></li>
            <li><a href="#academy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security Analyst</a></li>
            <li><a href="#academy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Integration</a></li>
            <li><a href="#academy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Interview Prep</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="w-full max-w-7xl mx-auto pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Aura. All rights reserved.</p>
        <p className="text-xs text-muted-foreground/50">Built with care for startups & students.</p>
      </div>
    </footer>
  );
}
