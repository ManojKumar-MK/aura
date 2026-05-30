import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function score(query: string, target: string): number {
  const q = normalize(query);
  const t = normalize(target);
  if (t.includes(q) || q.includes(t)) return 3;
  const qWords = q.split(/\s+/);
  const matches = qWords.filter(w => w.length > 2 && t.includes(w));
  return matches.length;
}

export async function POST(req: NextRequest) {
  const { message, contactEmail } = await req.json() as { message: string; contactEmail?: string };
  const email = contactEmail ?? "hello@aura.studio";
  const q = normalize(message);

  // Tamil shortcut
  if (/[அ-ஹா-ூெ-ொாிீுூெேைொோௌ]/.test(message) || message.toLowerCase().includes("tamil")) {
    return NextResponse.json({
      reply: "நாங்கள் தமிழிலும் உங்களுக்கு உதவ தயாராக இருக்கிறோம். உங்கள் கேள்வியை சொல்லுங்கள்!",
    });
  }

  const [{ data: services }, { data: programs }, { data: faqs }, { data: cfg }] = await Promise.all([
    supabase.from("services").select("title,description").eq("is_visible", true),
    supabase.from("academy_programs").select("name,description").eq("is_visible", true),
    supabase.from("faq_items").select("question,answer").eq("is_visible", true),
    supabase.from("site_config").select("key,value").in("key", ["chatbot_contact_email"]),
  ]);

  const resolvedEmail = cfg?.find((r: { key: string }) => r.key === "chatbot_contact_email")?.value ?? email;

  // 1. FAQ match — highest priority
  if (faqs?.length) {
    const best = faqs
      .map((f: { question: string; answer: string }) => ({ ...f, s: score(message, f.question) }))
      .sort((a, b) => b.s - a.s)[0];
    if (best.s >= 2) {
      return NextResponse.json({ reply: best.answer });
    }
  }

  // 2. Academy program match
  if (programs?.length) {
    const best = programs
      .map((p: { name: string; description: string }) => ({ ...p, s: score(message, p.name + " " + p.description) }))
      .sort((a, b) => b.s - a.s)[0];
    if (best.s >= 2) {
      return NextResponse.json({
        reply: `**${best.name}** — ${best.description}\n\nWant to join? Email us at ${resolvedEmail}.`,
      });
    }
  }

  // 3. Service match
  if (services?.length) {
    const best = services
      .map((s: { title: string; description: string }) => ({ ...s, s: score(message, s.title + " " + s.description) }))
      .sort((a, b) => b.s - a.s)[0];
    if (best.s >= 2) {
      return NextResponse.json({
        reply: `**${best.title}** — ${best.description}\n\nGet started at ${resolvedEmail}.`,
      });
    }
  }

  // 4. General keyword fallbacks
  if (q.includes("academy") || q.includes("course") || q.includes("learn") || q.includes("student")) {
    const list = programs?.map((p: { name: string }) => `• ${p.name}`).join("\n") ?? "";
    return NextResponse.json({
      reply: `Aura Academy offers hands-on programs for college students:\n${list}\n\nReal projects, real mentors. Email ${resolvedEmail} to join.`,
    });
  }

  if (q.includes("service") || q.includes("build") || q.includes("store") || q.includes("website")) {
    const list = services?.map((s: { title: string }) => `• ${s.title}`).join("\n") ?? "";
    return NextResponse.json({
      reply: `We offer:\n${list}\n\nEmail ${resolvedEmail} to get started.`,
    });
  }

  if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("price") || q.includes("cost")) {
    return NextResponse.json({
      reply: `You can reach us at ${resolvedEmail}. We reply within 24 hours.`,
    });
  }

  // 5. Default
  return NextResponse.json({
    reply: `Thanks for reaching out! Email us at ${resolvedEmail} and we'll get back to you within 24 hours.`,
  });
}
