"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutTemplate, ShoppingCart, GraduationCap, HelpCircle,
  Save, Plus, Trash2, Eye, EyeOff, LogOut, ExternalLink,
  CheckCircle2, Loader2, AlertTriangle, Hexagon, ChevronRight,
  Trophy, Star, Link2, Mail, MessageCircle, Sparkles, Layers, Inbox, Circle,
  Users, UserPlus, Shield, ChevronDown,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Service, AcademyProgram, CaseStudy, Testimonial } from "@/lib/supabase";

type Tab = "hero" | "services" | "academy" | "faq" | "casestudies" | "testimonials" | "footer" | "contact" | "chatbot" | "layout" | "submissions" | "team";
type FaqItem = { id: string; question: string; answer: string; display_order: number; is_visible: boolean };
type HeroConfig = {
  heading: string; subheading: string; badge: string; cta_primary: string; cta_secondary: string;
  heading_ta: string; subheading_ta: string; badge_ta: string; cta_primary_ta: string; cta_secondary_ta: string;
};

const DEFAULT_HERO: HeroConfig = {
  heading: "Scale your vision without limits.",
  subheading: "We build ecommerce stores, landing pages, and brand marketing solutions that help businesses grow online.",
  badge: "Now accepting new clients",
  cta_primary: "Start your project",
  cta_secondary: "View showcase",
  heading_ta: "", subheading_ta: "", badge_ta: "", cta_primary_ta: "", cta_secondary_ta: "",
};

const ICON_OPTIONS = ["ShoppingCart", "FileText", "Megaphone", "BarChart3", "Palette", "Globe", "Code2", "Zap", "Star", "Layers"];
const ACADEMY_ICON_OPTIONS = ["Code2", "Shield", "Brain", "Mic", "Terminal", "BookOpen", "UserCheck", "Briefcase", "Cpu", "Rocket"];

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const staggerList = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const cardVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

// ── Translation utility ───────────────────────────────────────────────────────

async function translateToTamil(text: string): Promise<string> {
  if (!text.trim()) return "";
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ta`
  );
  const data = await res.json();
  if (data.responseStatus === 200) return data.responseData.translatedText as string;
  throw new Error("Translation failed");
}

// ── Primitives ────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline = false, hint }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string;
}) {
  const base =
    "w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/60 text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all duration-200 resize-none font-sans";
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      {multiline
        ? <textarea rows={3} className={base} value={value} onChange={(e) => onChange(e.target.value)} />
        : <input className={base} value={value} onChange={(e) => onChange(e.target.value)} />}
      {hint && <p className="text-xs text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

function TamilField({ label, value, sourceValue, onChange }: {
  label: string; value: string; sourceValue: string; onChange: (v: string) => void;
}) {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");

  const autoTranslate = async () => {
    if (!sourceValue.trim()) return;
    setTranslating(true);
    setError("");
    try {
      const result = await translateToTamil(sourceValue);
      onChange(result);
    } catch {
      setError("Translation failed — try again");
    }
    setTranslating(false);
  };

  const base = "w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/60 text-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all duration-200 resize-none font-sans";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
        <button
          type="button"
          onClick={autoTranslate}
          disabled={translating || !sourceValue.trim()}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {translating
            ? <><Loader2 className="w-3 h-3 animate-spin" />Translating…</>
            : <><Sparkles className="w-3 h-3" />Auto-translate</>}
        </button>
      </div>
      <textarea
        rows={2}
        className={base}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tamil text (auto or type manually)…"
        dir="auto"
      />
      {error
        ? <p className="text-xs text-destructive">{error}</p>
        : <p className="text-xs text-muted-foreground/60">Leave empty → English shown for Tamil visitors</p>}
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/60 text-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all duration-200 font-sans"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SaveBtn({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={saving}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 ${
        saved
          ? "bg-green-500/15 text-green-400 border border-green-500/30"
          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
      }`}
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saving ? "Saving…" : saved ? "Saved" : "Save"}
    </motion.button>
  );
}

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors duration-200"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </motion.button>
  );
}

function VisibilityToggle({ visible, onChange }: { visible: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!visible)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
        visible
          ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
          : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted"
      }`}
    >
      {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      {visible ? "Visible" : "Hidden"}
    </motion.button>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full py-4 rounded-2xl border border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
    >
      <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
      {label}
    </motion.button>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────

function AdminCard({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  return (
    <motion.div
      variants={cardVariant}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.06 }}
      className="relative group card-glow bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:border-border transition-colors duration-300 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );
}

// ── Login screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_authed", "1");
        onLogin();
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Could not reach server. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="dot-grid min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative card-glow bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl p-10 w-full max-w-sm shadow-2xl shadow-primary/10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Hexagon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-outfit text-xl font-bold"><span className="text-gradient">Aura Admin</span></h1>
            <p className="text-xs text-muted-foreground">Content management</p>
          </div>
        </div>

        <div className="space-y-4">
          <Field label="Password" value={pw} onChange={setPw} hint="Enter your admin password to continue" />
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </motion.div>
          )}
          <motion.button
            onClick={submit}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign in"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Hero tab ──────────────────────────────────────────────────────────────────

function HeroTab() {
  const [cfg, setCfg] = useState<HeroConfig>(DEFAULT_HERO);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_config").select("*").then(({ data }) => {
      if (!data?.length) return;
      const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
      setCfg((p) => ({ ...p, ...map }));
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await supabase.from("site_config").upsert(
      Object.entries(cfg).map(([key, value]) => ({ key, value })),
      { onConflict: "key" }
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key: keyof HeroConfig) => (v: string) => setCfg((c) => ({ ...c, [key]: v }));

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">

      {/* English content */}
      <AdminCard>
        <h3 className="font-outfit font-semibold text-foreground mb-5 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-primary inline-block" />
          Hero Banner — English
        </h3>
        <div className="space-y-4">
          <Field label="Badge text" value={cfg.badge} onChange={set("badge")} hint="Small pill shown above the heading" />
          <Field label="Heading" value={cfg.heading} onChange={set("heading")} multiline />
          <Field label="Subheading" value={cfg.subheading} onChange={set("subheading")} multiline />
        </div>
      </AdminCard>

      {/* Tamil content */}
      <AdminCard index={1}>
        <h3 className="font-outfit font-semibold text-foreground mb-5 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-accent inline-block" />
          Hero Banner — தமிழ்
        </h3>
        <div className="space-y-4">
          <TamilField label="Badge text (Tamil)" value={cfg.badge_ta} sourceValue={cfg.badge} onChange={set("badge_ta")} />
          <TamilField label="Heading (Tamil)" value={cfg.heading_ta} sourceValue={cfg.heading} onChange={set("heading_ta")} />
          <TamilField label="Subheading (Tamil)" value={cfg.subheading_ta} sourceValue={cfg.subheading} onChange={set("subheading_ta")} />
        </div>
      </AdminCard>

      {/* CTA Buttons */}
      <AdminCard index={2}>
        <h3 className="font-outfit font-semibold text-foreground mb-5 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-pink-500 inline-block" />
          Call to Action Buttons
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Primary button (English)" value={cfg.cta_primary} onChange={set("cta_primary")} />
            <Field label="Secondary button (English)" value={cfg.cta_secondary} onChange={set("cta_secondary")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TamilField label="Primary button (Tamil)" value={cfg.cta_primary_ta} sourceValue={cfg.cta_primary} onChange={set("cta_primary_ta")} />
            <TamilField label="Secondary button (Tamil)" value={cfg.cta_secondary_ta} sourceValue={cfg.cta_secondary} onChange={set("cta_secondary_ta")} />
          </div>
        </div>
      </AdminCard>

      <div className="flex justify-end pt-2">
        <SaveBtn onClick={save} saving={saving} saved={saved} />
      </div>
    </motion.div>
  );
}

// ── Services tab ──────────────────────────────────────────────────────────────

function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("services").select("*").order("display_order");
    if (data) setServices(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (id: string, field: keyof Service, value: string | boolean | number) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const saveOne = async (s: Service) => {
    setSaving(s.id);
    await supabase.from("services").upsert(s);
    setSaving(null);
    setSaved(s.id);
    setTimeout(() => setSaved(null), 2500);
  };

  const addNew = async () => {
    const { data } = await supabase.from("services").insert({
      title: "New Service",
      description: "Describe this service.",
      icon: "ShoppingCart",
      color: "primary",
      display_order: services.length,
      is_visible: true,
    }).select().single();
    if (data) setServices((prev) => [...prev, data]);
  };

  const deleteOne = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">
      {services.map((s, i) => (
        <AdminCard key={s.id} index={i}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="font-outfit text-xs font-bold text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1 border border-border/40">
                #{s.display_order + 1}
              </span>
              <h3 className="font-outfit font-semibold text-foreground text-sm">{s.title || "Untitled"}</h3>
            </div>
            <VisibilityToggle visible={s.is_visible} onChange={(v) => update(s.id, "is_visible", v)} />
          </div>
          <div className="space-y-4">
            <Field label="Title (English)" value={s.title} onChange={(v) => update(s.id, "title", v)} />
            <TamilField label="Title (Tamil)" value={s.title_ta ?? ""} sourceValue={s.title} onChange={(v) => update(s.id, "title_ta", v)} />
            <Field label="Description (English)" value={s.description} onChange={(v) => update(s.id, "description", v)} multiline />
            <TamilField label="Description (Tamil)" value={s.description_ta ?? ""} sourceValue={s.description} onChange={(v) => update(s.id, "description_ta", v)} />
            <SelectField label="Icon" value={s.icon} options={ICON_OPTIONS} onChange={(v) => update(s.id, "icon", v)} />
          </div>
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/40">
            <SaveBtn onClick={() => saveOne(s)} saving={saving === s.id} saved={saved === s.id} />
            <DeleteBtn onClick={() => deleteOne(s.id)} />
          </div>
        </AdminCard>
      ))}
      <AddBtn onClick={addNew} label="Add a new service" />
    </motion.div>
  );
}

// ── Academy tab ───────────────────────────────────────────────────────────────

function AcademyTab() {
  const [programs, setPrograms] = useState<AcademyProgram[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("academy_programs").select("*").order("display_order");
    if (data) setPrograms(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (id: string, field: keyof AcademyProgram, value: string | boolean | number) =>
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const saveOne = async (p: AcademyProgram) => {
    setSaving(p.id);
    await supabase.from("academy_programs").upsert(p);
    setSaving(null);
    setSaved(p.id);
    setTimeout(() => setSaved(null), 2500);
  };

  const addNew = async () => {
    const { data } = await supabase.from("academy_programs").insert({
      name: "New Program",
      description: "Describe this program.",
      icon: "Code2",
      display_order: programs.length,
      is_visible: true,
    }).select().single();
    if (data) setPrograms((prev) => [...prev, data]);
  };

  const deleteOne = async (id: string) => {
    await supabase.from("academy_programs").delete().eq("id", id);
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">
      {programs.map((p, i) => (
        <AdminCard key={p.id} index={i}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="font-outfit text-xs font-bold text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1 border border-border/40">
                #{p.display_order + 1}
              </span>
              <h3 className="font-outfit font-semibold text-foreground text-sm">{p.name || "Untitled"}</h3>
            </div>
            <VisibilityToggle visible={p.is_visible} onChange={(v) => update(p.id, "is_visible", v)} />
          </div>
          <div className="space-y-4">
            <Field label="Program name (English)" value={p.name} onChange={(v) => update(p.id, "name", v)} />
            <TamilField label="Program name (Tamil)" value={p.name_ta ?? ""} sourceValue={p.name} onChange={(v) => update(p.id, "name_ta", v)} />
            <Field label="Description (English)" value={p.description} onChange={(v) => update(p.id, "description", v)} multiline />
            <TamilField label="Description (Tamil)" value={p.description_ta ?? ""} sourceValue={p.description} onChange={(v) => update(p.id, "description_ta", v)} />
            <SelectField label="Icon" value={p.icon} options={ACADEMY_ICON_OPTIONS} onChange={(v) => update(p.id, "icon", v)} />
          </div>
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/40">
            <SaveBtn onClick={() => saveOne(p)} saving={saving === p.id} saved={saved === p.id} />
            <DeleteBtn onClick={() => deleteOne(p.id)} />
          </div>
        </AdminCard>
      ))}
      <AddBtn onClick={addNew} label="Add a new program" />
    </motion.div>
  );
}

// ── FAQ tab ───────────────────────────────────────────────────────────────────

function FaqTab() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("faq_items").select("*").order("display_order");
    if (data) setItems(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (id: string, field: keyof FaqItem, value: string | boolean | number) =>
    setItems((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));

  const saveOne = async (f: FaqItem) => {
    setSaving(f.id);
    await supabase.from("faq_items").upsert(f);
    setSaving(null);
    setSaved(f.id);
    setTimeout(() => setSaved(null), 2500);
  };

  const addNew = async () => {
    const { data } = await supabase.from("faq_items").insert({
      question: "New question?",
      answer: "Write your answer here.",
      display_order: items.length,
      is_visible: true,
    }).select().single();
    if (data) setItems((prev) => [...prev, data]);
  };

  const deleteOne = async (id: string) => {
    await supabase.from("faq_items").delete().eq("id", id);
    setItems((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">
      {items.map((f, i) => (
        <AdminCard key={f.id} index={i}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="font-outfit text-xs font-bold text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1 border border-border/40">
                Q{f.display_order + 1}
              </span>
              <p className="font-outfit font-semibold text-foreground text-sm truncate max-w-xs">{f.question}</p>
            </div>
            <VisibilityToggle visible={f.is_visible} onChange={(v) => update(f.id, "is_visible", v)} />
          </div>
          <div className="space-y-4">
            <Field label="Question" value={f.question} onChange={(v) => update(f.id, "question", v)} />
            <Field label="Answer" value={f.answer} onChange={(v) => update(f.id, "answer", v)} multiline />
          </div>
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/40">
            <SaveBtn onClick={() => saveOne(f)} saving={saving === f.id} saved={saved === f.id} />
            <DeleteBtn onClick={() => deleteOne(f.id)} />
          </div>
        </AdminCard>
      ))}
      <AddBtn onClick={addNew} label="Add a new FAQ" />
    </motion.div>
  );
}

// ── Case Studies tab ──────────────────────────────────────────────────────────

function CaseStudiesTab() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [sectionVisible, setSectionVisible] = useState(true);
  const [sectionSaving, setSectionSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("case_studies").select("*").order("display_order");
    if (data) setItems(data);
    const { data: cfg } = await supabase.from("site_config").select("value").eq("key", "show_impact").single();
    if (cfg) setSectionVisible(cfg.value !== "false");
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggleSection = async (v: boolean) => {
    setSectionVisible(v);
    setSectionSaving(true);
    await supabase.from("site_config").upsert({ key: "show_impact", value: v ? "true" : "false" }, { onConflict: "key" });
    setSectionSaving(false);
  };

  const update = (id: string, field: keyof CaseStudy, value: string | boolean | number) =>
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const saveOne = async (s: CaseStudy) => {
    setSaving(s.id);
    await supabase.from("case_studies").upsert(s);
    setSaving(null); setSaved(s.id);
    setTimeout(() => setSaved(null), 2500);
  };

  const addNew = async () => {
    const { data } = await supabase.from("case_studies").insert({
      tag1: "New Tag", tag2: "", title: "New Case Study", description: "",
      stat1_value: "", stat1_label: "", stat2_value: "", stat2_label: "",
      display_order: items.length, is_visible: true,
    }).select().single();
    if (data) setItems((prev) => [...prev, data]);
  };

  const deleteOne = async (id: string) => {
    await supabase.from("case_studies").delete().eq("id", id);
    setItems((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">
      {/* Section-level visibility toggle */}
      <AdminCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-outfit font-semibold text-foreground text-sm">Show &quot;Proven Impact&quot; section</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Hides the entire section from the landing page</p>
          </div>
          <div className="flex items-center gap-3">
            {sectionSaving && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
            <VisibilityToggle visible={sectionVisible} onChange={toggleSection} />
          </div>
        </div>
      </AdminCard>

      {items.map((s, i) => (
        <AdminCard key={s.id} index={i + 1}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="font-outfit text-xs font-bold text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1 border border-border/40">#{s.display_order + 1}</span>
              <h3 className="font-outfit font-semibold text-foreground text-sm truncate max-w-xs">{s.title}</h3>
            </div>
            <VisibilityToggle visible={s.is_visible} onChange={(v) => update(s.id, "is_visible", v)} />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tag 1" value={s.tag1} onChange={(v) => update(s.id, "tag1", v)} />
              <Field label="Tag 2" value={s.tag2} onChange={(v) => update(s.id, "tag2", v)} hint="Optional" />
            </div>
            <Field label="Title" value={s.title} onChange={(v) => update(s.id, "title", v)} />
            <Field label="Description" value={s.description} onChange={(v) => update(s.id, "description", v)} multiline hint="Optional" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stat 1 value" value={s.stat1_value} onChange={(v) => update(s.id, "stat1_value", v)} hint='e.g. "85%" or "3x"' />
              <Field label="Stat 1 label" value={s.stat1_label} onChange={(v) => update(s.id, "stat1_label", v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stat 2 value" value={s.stat2_value} onChange={(v) => update(s.id, "stat2_value", v)} hint="Optional" />
              <Field label="Stat 2 label" value={s.stat2_label} onChange={(v) => update(s.id, "stat2_label", v)} hint="Optional" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/40">
            <SaveBtn onClick={() => saveOne(s)} saving={saving === s.id} saved={saved === s.id} />
            <DeleteBtn onClick={() => deleteOne(s.id)} />
          </div>
        </AdminCard>
      ))}
      <AddBtn onClick={addNew} label="Add a new case study" />
    </motion.div>
  );
}

// ── Testimonials tab ──────────────────────────────────────────────────────────

function TestimonialsTab() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("testimonials").select("*").order("display_order");
    if (data) setItems(data);
  }, []);
  useEffect(() => { load(); }, [load]);

  const update = (id: string, field: keyof Testimonial, value: string | boolean | number) =>
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  const saveOne = async (t: Testimonial) => {
    setSaving(t.id);
    await supabase.from("testimonials").upsert(t);
    setSaving(null); setSaved(t.id);
    setTimeout(() => setSaved(null), 2500);
  };

  const addNew = async () => {
    const { data } = await supabase.from("testimonials").insert({
      quote: "Add a testimonial quote here.", author: "Name", role: "Role", company: "Company",
      display_order: items.length, is_visible: true,
    }).select().single();
    if (data) setItems((prev) => [...prev, data]);
  };

  const deleteOne = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">
      {items.map((t, i) => (
        <AdminCard key={t.id} index={i}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="font-outfit text-xs font-bold text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1 border border-border/40">#{t.display_order + 1}</span>
              <h3 className="font-outfit font-semibold text-foreground text-sm">{t.author} · {t.company}</h3>
            </div>
            <VisibilityToggle visible={t.is_visible} onChange={(v) => update(t.id, "is_visible", v)} />
          </div>
          <div className="space-y-4">
            <Field label="Quote" value={t.quote} onChange={(v) => update(t.id, "quote", v)} multiline />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Author name" value={t.author} onChange={(v) => update(t.id, "author", v)} />
              <Field label="Role" value={t.role} onChange={(v) => update(t.id, "role", v)} />
              <Field label="Company" value={t.company} onChange={(v) => update(t.id, "company", v)} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/40">
            <SaveBtn onClick={() => saveOne(t)} saving={saving === t.id} saved={saved === t.id} />
            <DeleteBtn onClick={() => deleteOne(t.id)} />
          </div>
        </AdminCard>
      ))}
      <AddBtn onClick={addNew} label="Add a testimonial" />
    </motion.div>
  );
}

// ── Footer tab ────────────────────────────────────────────────────────────────

function FooterTab() {
  const KEYS = [
    "footer_tagline","footer_contact_email",
    "contact_phone","contact_email_display",
    "contact_instagram","contact_linkedin","contact_twitter","contact_facebook","contact_youtube","contact_whatsapp",
  ];
  const [cfg, setCfg] = useState<Record<string, string>>({
    footer_tagline:        "",
    footer_contact_email:  "hello@aura.studio",
    contact_phone:         "",
    contact_email_display: "",
    contact_instagram:     "",
    contact_linkedin:      "",
    contact_twitter:       "",
    contact_facebook:      "",
    contact_youtube:       "",
    contact_whatsapp:      "",
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    supabase.from("site_config").select("*").in("key", KEYS).then(({ data }) => {
      if (!data?.length) return;
      const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
      setCfg((p) => ({ ...p, ...map }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setSaving(true);
    await supabase.from("site_config").upsert(
      Object.entries(cfg).map(([key, value]) => ({ key, value })),
      { onConflict: "key" }
    );
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const set = (k: string) => (v: string) => setCfg((c) => ({ ...c, [k]: v }));

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">
      {/* Branding */}
      <AdminCard>
        <h3 className="font-outfit font-semibold text-foreground mb-5 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-primary inline-block" />Branding & Contact
        </h3>
        <div className="space-y-4">
          <Field label="Tagline" value={cfg.footer_tagline} onChange={set("footer_tagline")} multiline hint="Shown below the logo in the footer" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" value={cfg.footer_contact_email} onChange={set("footer_contact_email")} hint="Shown as clickable email in footer" />
            <Field label="Phone" value={cfg.contact_phone} onChange={set("contact_phone")} hint='e.g. +91 98765 43210' />
          </div>
        </div>
      </AdminCard>

      {/* Social links */}
      <AdminCard index={1}>
        <h3 className="font-outfit font-semibold text-foreground mb-5 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-pink-500 inline-block" />Social Media Links
          <span className="text-xs font-normal text-muted-foreground ml-1">(leave empty to hide)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Instagram" value={cfg.contact_instagram} onChange={set("contact_instagram")} hint="https://instagram.com/..." />
          <Field label="LinkedIn"  value={cfg.contact_linkedin}  onChange={set("contact_linkedin")}  hint="https://linkedin.com/..." />
          <Field label="Twitter / X" value={cfg.contact_twitter} onChange={set("contact_twitter")}  hint="https://twitter.com/..." />
          <Field label="Facebook"  value={cfg.contact_facebook}  onChange={set("contact_facebook")}  hint="https://facebook.com/..." />
          <Field label="YouTube"   value={cfg.contact_youtube}   onChange={set("contact_youtube")}   hint="https://youtube.com/..." />
          <Field label="WhatsApp"  value={cfg.contact_whatsapp}  onChange={set("contact_whatsapp")}  hint="Phone number only: 919876543210" />
        </div>
      </AdminCard>

      <div className="flex justify-end">
        <SaveBtn onClick={save} saving={saving} saved={saved} />
      </div>
    </motion.div>
  );
}

// ── Contact / CTA tab ─────────────────────────────────────────────────────────

// ── Chatbot tab ───────────────────────────────────────────────────────────────

function ChatbotTab() {
  const KEYS = ["chatbot_enabled", "chatbot_name", "chatbot_greeting", "chatbot_contact_email"];
  const [cfg, setCfg] = useState<Record<string, string>>({
    chatbot_enabled: "true",
    chatbot_name: "Aura Assistant",
    chatbot_greeting: "Hi! Ask me about our services, academy programs, or anything else!",
    chatbot_contact_email: "hello@aura.studio",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_config").select("*").in("key", KEYS).then(({ data }) => {
      if (!data?.length) return;
      const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
      setCfg((p) => ({ ...p, ...map }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setSaving(true);
    await supabase.from("site_config").upsert(
      Object.entries(cfg).map(([key, value]) => ({ key, value })),
      { onConflict: "key" }
    );
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const set = (k: string) => (v: string) => setCfg((c) => ({ ...c, [k]: v }));

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">
      <AdminCard>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-outfit font-semibold text-foreground flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-primary inline-block" />Chat Widget
          </h3>
          <VisibilityToggle
            visible={cfg.chatbot_enabled === "true"}
            onChange={(v) => set("chatbot_enabled")(v ? "true" : "false")}
          />
        </div>
        <div className="space-y-4">
          <Field label="Bot name" value={cfg.chatbot_name} onChange={set("chatbot_name")} />
          <Field label="Greeting message" value={cfg.chatbot_greeting} onChange={set("chatbot_greeting")} multiline hint="First message the bot shows when opened" />
          <Field label="Contact email (shown in bot replies)" value={cfg.chatbot_contact_email} onChange={set("chatbot_contact_email")} />
        </div>
      </AdminCard>

      <InquiryOptionsManager />

      <div className="flex justify-end">
        <SaveBtn onClick={save} saving={saving} saved={saved} />
      </div>
    </motion.div>
  );
}

// ── Layout tab ────────────────────────────────────────────────────────────────

type SectionDef = {
  id: Tab;
  label: string;
  desc: string;
  icon: React.ElementType;
  configKey?: string;
  accent: string;
  alwaysOn?: boolean;
};

const PAGE_SECTIONS: SectionDef[] = [
  { id: "hero",         label: "Hero",          desc: "Badge, heading, subheading & CTA buttons",   icon: LayoutTemplate,  accent: "from-primary/30 to-primary/5",      alwaysOn: true },
  { id: "services",     label: "Services",      desc: "Ecommerce, Landing Page, Brand Marketing",   icon: ShoppingCart,    accent: "from-accent/30 to-accent/5",        configKey: "show_services" },
  { id: "academy",      label: "Academy",       desc: "DSA, Security, AI Integration, Interview",   icon: GraduationCap,   accent: "from-orange-500/30 to-orange-500/5", configKey: "show_academy" },
  { id: "casestudies",  label: "Impact",        desc: "Case studies with stats",                    icon: Trophy,          accent: "from-yellow-500/30 to-yellow-500/5", configKey: "show_impact" },
  { id: "testimonials", label: "Testimonials",  desc: "Student and client reviews",                 icon: Star,            accent: "from-pink-500/30 to-pink-500/5",     configKey: "show_testimonials" },
  { id: "faq",          label: "FAQ",           desc: "Common questions and answers",               icon: HelpCircle,      accent: "from-teal-500/30 to-teal-500/5",    configKey: "show_faq" },
];

// nav label keys for sections that appear in the navbar
const NAV_LABEL_KEYS: Partial<Record<Tab, string>> = {
  services: "nav_label_services",
  academy:  "nav_label_academy",
  casestudies: "nav_label_work",
};

// which DB table/count to show per section
const SECTION_COUNT_TABLES: Partial<Record<Tab, string>> = {
  services:     "services",
  academy:      "academy_programs",
  casestudies:  "case_studies",
  testimonials: "testimonials",
  faq:          "faq_items",
};

const DEFAULT_ORDER: Tab[] = ["hero","services","academy","casestudies","testimonials","faq","contact"];

function LayoutTab({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [visibility,  setVisibility]  = useState<Record<string, boolean>>({});
  const [navLabels,   setNavLabels]   = useState<Record<string, string>>({});
  const [counts,      setCounts]      = useState<Record<string, number>>({});
  const [order,       setOrder]       = useState<Tab[]>(DEFAULT_ORDER);
  const [saving,      setSaving]      = useState<string | null>(null);
  const [labelSaving, setLabelSaving] = useState<string | null>(null);
  useEffect(() => {
    // Load visibility + nav labels + section order from site_config
    const visKeys   = PAGE_SECTIONS.filter(s => s.configKey).map(s => s.configKey!);
    const labelKeys = Object.values(NAV_LABEL_KEYS) as string[];
    const allKeys   = [...visKeys, ...labelKeys, "section_order"];

    supabase.from("site_config").select("key,value").in("key", allKeys).then(({ data }) => {
      const vis: Record<string, boolean>  = {};
      const lbl: Record<string, string>   = {};
      visKeys.forEach(k => { vis[k] = true; });
      data?.forEach((r: { key: string; value: string }) => {
        if (visKeys.includes(r.key))    vis[r.key] = r.value !== "false";
        if (labelKeys.includes(r.key))  lbl[r.key] = r.value;
        if (r.key === "section_order") {
          try { setOrder(JSON.parse(r.value) as Tab[]); } catch { /* use default */ }
        }

      });
      setVisibility(vis);
      setNavLabels(lbl);
    });

    // Load item counts per section
    const tableEntries = Object.entries(SECTION_COUNT_TABLES) as [Tab, string][];
    Promise.all(
      tableEntries.map(async ([sectionId, table]) => {
        const { count } = await supabase.from(table).select("id", { count: "exact", head: true }).eq("is_visible", true);
        return [sectionId, count ?? 0] as [Tab, number];
      })
    ).then(results => {
      setCounts(Object.fromEntries(results));
    });
  }, []);

  const toggle = async (configKey: string, value: boolean) => {
    setVisibility(v => ({ ...v, [configKey]: value }));
    setSaving(configKey);
    await supabase.from("site_config").upsert({ key: configKey, value: value ? "true" : "false" }, { onConflict: "key" });
    setSaving(null);
  };

  const saveNavLabel = async (labelKey: string, value: string) => {
    setLabelSaving(labelKey);
    await supabase.from("site_config").upsert({ key: labelKey, value }, { onConflict: "key" });
    setLabelSaving(null);
  };

  const moveSection = async (idx: number, dir: -1 | 1) => {
    const newOrder = [...order];
    const swap = idx + dir;
    if (swap < 0 || swap >= newOrder.length) return;
    [newOrder[idx], newOrder[swap]] = [newOrder[swap], newOrder[idx]];
    setOrder(newOrder);
    await supabase.from("site_config").upsert(
      { key: "section_order", value: JSON.stringify(newOrder) },
      { onConflict: "key" }
    );
  };

  // Render sections in current order
  const orderedSections = order
    .map(id => PAGE_SECTIONS.find(s => s.id === id))
    .filter(Boolean) as SectionDef[];

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">Control every section — reorder with arrows, toggle visibility, rename nav labels.</p>
        <a href="/" target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />View live
        </a>
      </div>

      {orderedSections.map((section, i) => {
        const Icon       = section.icon;
        const isVisible  = section.alwaysOn ? true : (visibility[section.configKey!] ?? true);
        const isSaving   = saving === section.configKey;
        const labelKey   = NAV_LABEL_KEYS[section.id];
        const countTable = SECTION_COUNT_TABLES[section.id];
        const itemCount  = countTable !== undefined ? (counts[section.id] ?? null) : null;
        const isFirst    = i === 0;
        const isLast     = i === orderedSections.length - 1;

        return (
          <motion.div
            key={section.id}
            variants={cardVariant}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.04 }}
            className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 ${
              isVisible ? "bg-card border-border/50" : "bg-muted/20 border-border/30 opacity-60"
            }`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${section.accent} rounded-l-2xl`} />
            <div className={`absolute inset-0 bg-gradient-to-r ${section.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            <div className="relative px-5 pt-4 pb-3">
              {/* Top row */}
              <div className="flex items-center gap-3">
                {/* Up/down reorder buttons */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    disabled={isFirst || section.alwaysOn}
                    onClick={() => moveSection(i, -1)}
                    className="p-0.5 rounded text-muted-foreground/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 -rotate-90" />
                  </button>
                  <button
                    disabled={isLast || section.alwaysOn}
                    onClick={() => moveSection(i, 1)}
                    className="p-0.5 rounded text-muted-foreground/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                </div>

                {/* Icon */}
                <div className="p-2 rounded-lg bg-muted/60 border border-border/40 shrink-0">
                  <Icon className="w-4 h-4 text-foreground/70" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-outfit font-semibold text-sm text-foreground">{section.label}</p>
                    {section.alwaysOn && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/40">Always on</span>
                    )}
                    {!isVisible && !section.alwaysOn && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">Hidden</span>
                    )}
                    {itemCount !== null && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/40">
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{section.desc}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                  {!section.alwaysOn && (
                    <VisibilityToggle visible={isVisible} onChange={(v) => toggle(section.configKey!, v)} />
                  )}
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onNavigate(section.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors border border-primary/20"
                  >
                    Edit <ChevronRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>

              {/* Navbar label row — only for sections that appear in navbar */}
              {labelKey && isVisible && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/60 shrink-0 w-20">Nav label:</span>
                  <div className="relative flex-1">
                    <input
                      className="w-full px-3 py-1.5 rounded-lg bg-muted/40 border border-border/50 text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                      value={navLabels[labelKey] ?? ""}
                      onChange={(e) => setNavLabels(l => ({ ...l, [labelKey]: e.target.value }))}
                      onBlur={(e) => e.target.value && saveNavLabel(labelKey, e.target.value)}
                      placeholder={section.label}
                    />
                    {labelSaving === labelKey && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-muted-foreground" />}
                  </div>
                </div>
              )}

              {/* Preview strip */}
              {isVisible && (
                <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-border/60 via-border/30 to-transparent" />
              )}
            </div>
          </motion.div>
        );
      })}

      <p className="text-xs text-muted-foreground/50 text-center pt-2">
        ↕ arrows reorder sections · nav label overrides what shows in the top navigation bar
      </p>
    </motion.div>
  );
}

// ── Submissions tab ───────────────────────────────────────────────────────────

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// ── Inquiry options manager (inside Submissions tab) ─────────────────────────

function InquiryOptionsManager() {
  const [options,    setOptions]    = useState<string[]>([]);
  const [newOpt,     setNewOpt]     = useState("");
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [showEmail,  setShowEmail]  = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_config").select("key,value")
      .in("key", ["inquiry_options", "modal_show_email"])
      .then(({ data }) => {
        data?.forEach((r: { key: string; value: string }) => {
          if (r.key === "inquiry_options") {
            try { setOptions(JSON.parse(r.value) as string[]); } catch { /* ignore */ }
          }
          if (r.key === "modal_show_email") setShowEmail(r.value === "true");
        });
      });
  }, []);

  const toggleEmail = async (v: boolean) => {
    setShowEmail(v);
    setEmailSaving(true);
    await supabase.from("site_config").upsert({ key: "modal_show_email", value: v ? "true" : "false" }, { onConflict: "key" });
    setEmailSaving(false);
  };

  const save = async (updated: string[]) => {
    setSaving(true);
    await supabase.from("site_config").upsert(
      { key: "inquiry_options", value: JSON.stringify(updated) },
      { onConflict: "key" }
    );
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const add = () => {
    const trimmed = newOpt.trim();
    if (!trimmed || options.includes(trimmed)) return;
    const updated = [...options, trimmed];
    setOptions(updated);
    setNewOpt("");
    save(updated);
  };

  const remove = (opt: string) => {
    const updated = options.filter(o => o !== opt);
    setOptions(updated);
    save(updated);
  };

  return (
    <AdminCard>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-outfit font-semibold text-foreground flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-accent inline-block" />
          "What are you looking for?" Options
        </h3>
        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
        {saved  && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
      </div>
      <p className="text-xs text-muted-foreground mb-4">These appear in the contact form dropdown when visitors click "Get in Touch" or "Join the Program".</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {options.map(opt => (
          <div key={opt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/50 text-sm text-foreground">
            {opt}
            <button
              onClick={() => remove(opt)}
              className="text-muted-foreground hover:text-destructive transition-colors ml-1"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newOpt}
          onChange={e => setNewOpt(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Add a new option…"
          className="flex-1 px-4 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
        />
        <motion.button
          onClick={add}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium border border-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </motion.button>
      </div>

      {/* Show email toggle */}
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-border/40">
        <div>
          <p className="text-sm font-medium text-foreground">Show email address in form</p>
          <p className="text-xs text-muted-foreground mt-0.5">Displays "Or email us directly at…" below the submit button</p>
        </div>
        <div className="flex items-center gap-2">
          {emailSaving && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
          <VisibilityToggle visible={showEmail} onChange={toggleEmail} />
        </div>
      </div>
    </AdminCard>
  );
}

function SubmissionsTab({ onUnreadChange }: { onUnreadChange?: (n: number) => void }) {
  const [items,    setItems]    = useState<Submission[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setItems(data);
      const unreadN = data.filter((s: Submission) => !s.is_read).length;
      onUnreadChange?.(unreadN);
    }
    setLoading(false);
  }, [onUnreadChange]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string, is_read: boolean) => {
    const updated = items.map(s => s.id === id ? { ...s, is_read } : s);
    setItems(updated);
    onUnreadChange?.(updated.filter(s => !s.is_read).length);
    await supabase.from("contact_submissions").update({ is_read }).eq("id", id);
  };

  const deleteOne = async (id: string) => {
    const updated = items.filter(s => s.id !== id);
    setItems(updated);
    onUnreadChange?.(updated.filter(s => !s.is_read).length);
    await supabase.from("contact_submissions").delete().eq("id", id);
    if (expanded === id) setExpanded(null);
  };

  // Auto-mark as read when expanded
  const toggle = (id: string, isRead: boolean) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!isRead) markRead(id, true);
  };

  const markAllRead = async () => {
    const unreadIds = items.filter(s => !s.is_read).map(s => s.id);
    if (!unreadIds.length) return;
    setItems(prev => prev.map(s => ({ ...s, is_read: true })));
    onUnreadChange?.(0);
    await supabase.from("contact_submissions").update({ is_read: true }).in("id", unreadIds);
  };

  const unread = items.filter(s => !s.is_read).length;
  const total  = items.length;

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",  value: total,        color: "text-foreground",    bg: "bg-muted/40"       },
          { label: "Unread", value: unread,        color: "text-primary",       bg: "bg-primary/10"     },
          { label: "Read",   value: total - unread, color: "text-green-400",   bg: "bg-green-500/10"   },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-border/40 text-center`}>
            <p className={`font-outfit text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : unread > 0 ? `${unread} unread message${unread > 1 ? "s" : ""}` : "All caught up!"}
        </p>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark all read
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={load}
            className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-border border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Message list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No submissions yet.
        </div>
      ) : (
        items.map((s, i) => {
          const isExpanded = expanded === s.id;
          return (
            <motion.div
              key={s.id}
              variants={cardVariant}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.04 }}
              className={`relative group card-glow rounded-2xl border overflow-hidden transition-all duration-300 ${
                s.is_read ? "bg-card border-border/40" : "bg-card border-primary/30 shadow-sm shadow-primary/10"
              }`}
            >
              {/* Unread accent */}
              {!s.is_read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent rounded-l-2xl" />}

              {/* Header row — click to expand */}
              <button
                onClick={() => toggle(s.id, s.is_read)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                {/* Unread dot */}
                <div className="shrink-0 w-5 flex items-center justify-center">
                  {!s.is_read
                    ? <Circle className="w-2 h-2 fill-primary text-primary" />
                    : <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/30" />}
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-outfit font-semibold text-sm ${s.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                      {s.name || "Anonymous"}
                    </p>
                    {!s.is_read && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">New</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                </div>

                {/* Time + chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground/60 hidden sm:block">
                    {new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-border/40">
                      {s.message ? (
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-l-2 border-primary/30 pl-3 my-3">
                          {s.message}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground/50 italic my-3">No message provided.</p>
                      )}

                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={() => markRead(s.id, !s.is_read)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            s.is_read
                              ? "bg-muted/40 text-muted-foreground border-border/40 hover:bg-muted"
                              : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {s.is_read ? "Mark unread" : "Mark as read"}
                        </motion.button>

                        <a
                          href={`mailto:${s.email}?subject=Re: Your enquiry`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" /> Reply
                        </a>

                        <DeleteBtn onClick={() => deleteOne(s.id)} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
}

// ── Team tab ──────────────────────────────────────────────────────────────────

type TeamMember = { id: string; name: string; email: string; role: string; is_active: boolean; created_at: string };

function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [newName,  setNewName]  = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole,  setNewRole]  = useState("admin");
  const [adding,   setAdding]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("team_members").select("*").order("created_at");
    if (data) setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addMember = async () => {
    if (!newName.trim() || !newEmail.trim()) return;
    setAdding(true);
    const { data } = await supabase.from("team_members").insert({
      name: newName.trim(), email: newEmail.trim(), role: newRole, is_active: true,
    }).select().single();
    if (data) setMembers(prev => [...prev, data]);
    setNewName(""); setNewEmail(""); setNewRole("admin"); setShowAdd(false);
    setAdding(false);
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, is_active } : m));
    await supabase.from("team_members").update({ is_active }).eq("id", id);
  };

  const changeRole = async (id: string, role: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    await supabase.from("team_members").update({ role }).eq("id", id);
  };

  const removeMember = async (id: string) => {
    await supabase.from("team_members").delete().eq("id", id);
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const inputCls = "px-4 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all font-sans";

  return (
    <motion.div variants={staggerList} animate="animate" className="space-y-4">

      {/* Info card */}
      <AdminCard>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-outfit font-semibold text-foreground text-sm mb-1">Admin Access</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Team members listed here share the same admin password set in your <code className="font-mono bg-muted px-1 rounded">ADMIN_PASSWORD</code> env variable. Add members to track who has access and their roles.
            </p>
          </div>
        </div>
      </AdminCard>

      {/* Add member */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <AdminCard>
              <h3 className="font-outfit font-semibold text-foreground mb-5 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" /> Add Team Member
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <input value={newName}  onChange={e => setNewName(e.target.value)}  placeholder="Full name"  className={`${inputCls} w-full`} />
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email"      className={`${inputCls} w-full`} type="email" />
                <select value={newRole} onChange={e => setNewRole(e.target.value)}  className={`${inputCls} w-full`}>
                  <option value="admin">Admin — full access</option>
                  <option value="viewer">Viewer — read only</option>
                </select>
              </div>
              <div className="flex gap-2">
                <motion.button onClick={addMember} disabled={adding || !newName.trim() || !newEmail.trim()}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60 transition-colors hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {adding ? "Adding…" : "Add Member"}
                </motion.button>
                <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
              </div>
            </AdminCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member list header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{loading ? "Loading…" : `${members.length} team member${members.length !== 1 ? "s" : ""}`}</p>
        {!showAdd && (
          <motion.button onClick={() => setShowAdd(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            <UserPlus className="w-3.5 h-3.5" /> Invite Member
          </motion.button>
        )}
      </div>

      {/* Members */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No team members yet. Click "Invite Member" to add someone.
        </div>
      ) : (
        members.map((m, i) => (
          <AdminCard key={m.id} index={i}>
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-border/50 flex items-center justify-center shrink-0">
                <span className="font-outfit font-bold text-sm text-foreground">
                  {m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-outfit font-semibold text-sm ${m.is_active ? "text-foreground" : "text-muted-foreground"}`}>{m.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    m.role === "admin"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-muted text-muted-foreground border-border/40"
                  }`}>
                    {m.role === "admin" ? "Admin" : "Viewer"}
                  </span>
                  {!m.is_active && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">Inactive</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{m.email}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={m.role}
                  onChange={e => changeRole(m.id, e.target.value)}
                  className="text-xs px-2 py-1.5 rounded-lg bg-muted/40 border border-border/50 text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>

                <VisibilityToggle visible={m.is_active} onChange={v => toggleActive(m.id, v)} />

                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => removeMember(m.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </AdminCard>
        ))
      )}
    </motion.div>
  );
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType; desc: string; section?: string }[] = [
  { id: "submissions",  label: "Inbox",        icon: Inbox,           desc: "Contact form submissions",     section: "Communication" },
  { id: "team",         label: "Team",         icon: Users,           desc: "Members & access roles",       section: "Communication" },
  { id: "layout",       label: "Page Layout",  icon: Layers,          desc: "Section order & visibility",   section: "Content" },
  { id: "hero",         label: "Hero",         icon: LayoutTemplate,  desc: "Banner, heading & CTAs",       section: "Content" },
  { id: "services",     label: "Services",     icon: ShoppingCart,    desc: "What you offer",               section: "Content" },
  { id: "academy",      label: "Academy",      icon: GraduationCap,   desc: "Programs & courses",           section: "Content" },
  { id: "casestudies",  label: "Impact",       icon: Trophy,          desc: "Proven impact / case studies", section: "Content" },
  { id: "testimonials", label: "Testimonials", icon: Star,            desc: "Trusted by the best",          section: "Content" },
  { id: "faq",          label: "FAQ",          icon: HelpCircle,      desc: "Common questions",             section: "Content" },
  { id: "footer",       label: "Footer",       icon: Link2,           desc: "Tagline, email & social links",section: "Settings" },
  { id: "chatbot",      label: "Chatbot",      icon: MessageCircle,   desc: "Chat widget settings",         section: "Settings" },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed,      setAuthed]      = useState(false);
  const [tab,         setTab]         = useState<Tab>("submissions");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true);
    // Fetch initial unread count
    supabase.from("contact_submissions").select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .then(({ count }) => { if (count !== null) setUnreadCount(count); });
  }, []);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const activeTab = TABS.find((t) => t.id === tab)!;
  const sections  = [...new Set(TABS.map(t => t.section))];

  const SidebarNav = () => (
    <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
      {sections.map(section => (
        <div key={section}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-3 mb-1.5">{section}</p>
          <div className="space-y-0.5">
            {TABS.filter(t => t.section === section).map((t) => {
              const Icon   = t.icon;
              const active = tab === t.id;
              const badge  = t.id === "submissions" && unreadCount > 0 ? unreadCount : 0;
              return (
                <motion.button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  whileHover={{ x: 2 }}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group overflow-hidden ${
                    active ? "bg-primary/10 text-primary border border-primary/20"
                           : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-primary to-accent" />}
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none mb-0.5">{t.label}</p>
                    <p className={`text-xs truncate ${active ? "text-primary/70" : "text-muted-foreground/60"}`}>{t.desc}</p>
                  </div>
                  {badge > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                  {active && !badge && <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border/50 bg-card/40 backdrop-blur-sm sticky top-0 h-screen relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[80px] opacity-30 pointer-events-none" />
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Hexagon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-outfit font-bold text-sm"><span className="text-gradient">Aura Admin</span></p>
                <p className="text-xs text-muted-foreground">Content panel</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </div>

        <SidebarNav />

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border/40 space-y-1">
          {isSupabaseConfigured ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-green-400 bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              Connected to Supabase
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-destructive bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Supabase not connected
            </div>
          )}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            View live site
          </a>
          <button
            onClick={() => { sessionStorage.removeItem("admin_authed"); setAuthed(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 min-w-0 relative">
        <div className="dot-grid absolute inset-0 opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />
        {/* Mobile topbar */}
        <div className="md:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-primary" />
            <span className="font-outfit font-bold text-sm text-foreground">Aura Admin</span>
          </div>
          <div className="flex gap-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`p-2 rounded-lg transition-colors ${tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Page header */}
        <div className="px-6 md:px-10 pt-10 pb-6 border-b border-border/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + "-header"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-medium">
                <span>{activeTab.section ?? "Content"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-foreground">{activeTab.label}</span>
              </div>
              <h1 className="font-outfit text-2xl md:text-3xl font-bold"><span className="text-gradient">{activeTab.label}</span></h1>
              <p className="text-muted-foreground text-sm mt-1">{activeTab.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tab content */}
        <div className="px-6 md:px-10 py-8 w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {tab === "layout"       && <LayoutTab onNavigate={setTab} />}
              {tab === "submissions"  && <SubmissionsTab onUnreadChange={setUnreadCount} />}
              {tab === "team"         && <TeamTab />}
              {tab === "hero"         && <HeroTab />}
              {tab === "services"     && <ServicesTab />}
              {tab === "academy"      && <AcademyTab />}
              {tab === "casestudies"  && <CaseStudiesTab />}
              {tab === "testimonials" && <TestimonialsTab />}
              {tab === "faq"          && <FaqTab />}

              {tab === "footer"       && <FooterTab />}
              {tab === "chatbot"      && <ChatbotTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
