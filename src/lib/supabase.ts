import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const isConfigured =
  supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://");

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient("https://placeholder.supabase.co", "placeholder");

export const isSupabaseConfigured = isConfigured;

// ── Types ─────────────────────────────────────────────────────────────────────

export type Service = {
  id: string;
  title: string;
  title_ta: string;
  description: string;
  description_ta: string;
  icon: string;
  color: string;
  display_order: number;
  is_visible: boolean;
};

export type AcademyProgram = {
  id: string;
  name: string;
  name_ta: string;
  description: string;
  description_ta: string;
  icon: string;
  display_order: number;
  is_visible: boolean;
};

export type SiteConfig = {
  key: string;
  value: string;
};

export type CaseStudy = {
  id: string;
  tag1: string;
  tag2: string;
  title: string;
  description: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  display_order: number;
  is_visible: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  display_order: number;
  is_visible: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_visible: boolean;
};

// ── Fetchers ──────────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_visible", true)
    .order("display_order");
  if (error || !data?.length) return [];
  return data;
}

export async function getAcademyPrograms(): Promise<AcademyProgram[]> {
  const { data, error } = await supabase
    .from("academy_programs")
    .select("*")
    .eq("is_visible", true)
    .order("display_order");
  if (error || !data?.length) return [];
  return data;
}

export async function getSiteConfig(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("site_config").select("*");
  if (error || !data?.length) return {};
  return Object.fromEntries(data.map((r: SiteConfig) => [r.key, r.value]));
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("is_visible", true)
    .order("display_order");
  if (error || !data?.length) return [];
  return data;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_visible", true)
    .order("display_order");
  if (error || !data?.length) return [];
  return data;
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .eq("is_visible", true)
    .order("display_order");
  if (error || !data?.length) return [];
  return data;
}
