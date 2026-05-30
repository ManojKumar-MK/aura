export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ChatbotWidget } from "@/components/ui/chatbot";
import { getSiteConfig } from "@/lib/supabase";
import { ClientLayout } from "@/components/layout/client-layout";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura | Enterprise Software & Cloud Architecture",
  description: "Aura is a premier software development studio building custom enterprise software, internal tools, and AI-assisted cloud platforms for modern companies.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [messages, siteConfig] = await Promise.all([
    getMessages(),
    getSiteConfig().catch(() => ({} as Record<string, string>)),
  ]);

  let inquiryOptions: string[] = [];
  try {
    if (siteConfig.inquiry_options) inquiryOptions = JSON.parse(siteConfig.inquiry_options) as string[];
  } catch { /* use empty */ }

  const contactEmail = siteConfig.footer_contact_email ?? "hello@aura.studio";
  const showEmail    = siteConfig.modal_show_email === "true";

  return (
    <html lang={locale} className={`dark ${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col pt-24 font-sans">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ClientLayout inquiryOptions={inquiryOptions} contactEmail={contactEmail} showEmail={showEmail}>
              <div className="bg-noise mix-blend-overlay"></div>
              {siteConfig.show_navbar !== "false" && <Navbar config={siteConfig} />}
              <main className="flex-1 w-full bg-background relative z-10">{children}</main>
              <ChatbotWidget config={siteConfig} />
              <Footer config={siteConfig} />
            </ClientLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
