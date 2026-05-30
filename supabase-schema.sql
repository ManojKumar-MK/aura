-- Run this in your Supabase SQL editor to create the required tables.

create table if not exists site_config (
  key text primary key,
  value text not null default '',
  updated_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null default 'ShoppingCart',
  color text not null default 'primary',
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists academy_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  icon text not null default 'Code2',
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz default now()
);

-- Enable public read access (landing page reads without auth)
alter table site_config enable row level security;
alter table services enable row level security;
alter table academy_programs enable row level security;
alter table faq_items enable row level security;

create policy "public read site_config"    on site_config    for select using (true);
create policy "public read services"       on services       for select using (true);
create policy "public read academy"        on academy_programs for select using (true);
create policy "public read faq"            on faq_items      for select using (true);

-- Allow all writes via anon key (admin page uses the anon key directly)
-- For production, replace with a service_role key in the admin page.
create policy "anon write site_config"    on site_config    for all using (true) with check (true);
create policy "anon write services"       on services       for all using (true) with check (true);
create policy "anon write academy"        on academy_programs for all using (true) with check (true);
create policy "anon write faq"            on faq_items      for all using (true) with check (true);

-- Seed default services
insert into services (title, description, icon, color, display_order) values
  ('Ecommerce for Business', 'Get your products online fast. We build clean, easy-to-manage stores with cart, checkout, and payment support.', 'ShoppingCart', 'primary', 0),
  ('Landing Page', 'A sharp, conversion-focused page that tells your story, captures leads, and makes a strong first impression.', 'FileText', 'accent', 1),
  ('Brand Marketing', 'Logo, colour palette, and social presence — everything you need to look professional and be remembered.', 'Megaphone', 'pink', 2)
on conflict do nothing;

-- Seed default academy programs
insert into academy_programs (name, description, icon, display_order) values
  ('Master DSA', 'Build a solid foundation in Data Structures and Algorithms — the core skill every developer interview tests. Solve real problems, not just textbook exercises.', 'Code2', 0),
  ('Security Analyst', 'Learn how to find and fix vulnerabilities. Understand web security, network threats, and how to think like an attacker to defend like a pro.', 'Shield', 1),
  ('AI Integration', 'Go beyond theory — learn to build real AI-powered features. Connect LLMs to apps, automate tasks, and ship working AI tools.', 'Brain', 2),
  ('Interview Preparation Guidance', 'Get structured, personalised guidance to crack technical interviews. Mock sessions, feedback, and a roadmap built around your gaps.', 'Mic', 3)
on conflict do nothing;

-- ── New tables (run these after the initial schema) ────────────────────────

create table if not exists case_studies (
  id uuid primary key default gen_random_uuid(),
  tag1 text not null default '',
  tag2 text not null default '',
  title text not null,
  description text not null default '',
  stat1_value text not null default '',
  stat1_label text not null default '',
  stat2_value text not null default '',
  stat2_label text not null default '',
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  role text not null,
  company text not null,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz default now()
);

alter table case_studies enable row level security;
alter table testimonials enable row level security;

create policy "public read case_studies" on case_studies for select using (true);
create policy "public read testimonials" on testimonials for select using (true);
create policy "anon write case_studies" on case_studies for all using (true) with check (true);
create policy "anon write testimonials" on testimonials for all using (true) with check (true);

-- ── Tamil translation columns (run after initial schema) ───────────────────
-- Adds optional Tamil fields to services and academy_programs.
-- Leave empty to fall back to English.

alter table services add column if not exists title_ta text not null default '';
alter table services add column if not exists description_ta text not null default '';

alter table academy_programs add column if not exists name_ta text not null default '';
alter table academy_programs add column if not exists description_ta text not null default '';

-- Section visibility flags (stored in site_config as key/value)
-- Keys: show_impact, show_testimonials
-- Values: "true" or "false"

-- ── Contact form submissions ───────────────────────────────────────────────

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null,
  message text not null default '',
  is_read boolean not null default false,
  created_at timestamptz default now()
);

alter table contact_submissions enable row level security;
create policy "public insert submissions" on contact_submissions for insert with check (true);
create policy "anon read submissions"   on contact_submissions for select using (true);
create policy "anon update submissions" on contact_submissions for update using (true) with check (true);
create policy "anon delete submissions" on contact_submissions for delete using (true);

-- ── Team members (admin users) ──────────────────────────────────────────────
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz default now()
);
alter table team_members enable row level security;
create policy "anon all team_members" on team_members for all using (true) with check (true);
