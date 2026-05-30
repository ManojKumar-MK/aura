import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });

export const metadata: Metadata = { title: "Admin — Aura" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-background text-foreground font-sans min-h-screen">
        <div className="bg-noise mix-blend-overlay" />
        {children}
      </body>
    </html>
  );
}
