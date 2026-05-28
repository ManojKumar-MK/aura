import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ChatbotWidget } from "@/components/ui/chatbot";

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
  const messages = await getMessages();

  return (
    <html lang={locale} className={`dark ${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col pt-24 font-sans">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div className="bg-noise mix-blend-overlay"></div>
            <Navbar />
            <main className="flex-1 w-full bg-background relative z-10">{children}</main>
            <ChatbotWidget />
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
