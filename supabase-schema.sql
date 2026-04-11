-- ══════════════════════════════════════════════════════════════
-- Samburu Mental Health Association — Supabase Schema
-- Run ALL of this in the Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- 1. TABLES ────────────────────────────────────────────────────

create table if not exists photos (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  url         text not null,
  category    text not null default 'community',
  taken_at    timestamptz,
  created_at  timestamptz default now()
);

create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text not null,
  content      text not null,
  cover_url    text,
  category     text not null default 'News',
  published_at timestamptz default now(),
  created_at   timestamptz default now()
);

create table if not exists programs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  icon        text not null default 'heart',
  "order"     int not null default 0
);

create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  body       text not null,
  created_at timestamptz default now()
);

create table if not exists join_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  interest   text not null default 'Volunteer',
  message    text,
  created_at timestamptz default now()
);

-- 2. ROW LEVEL SECURITY ────────────────────────────────────────

alter table photos       enable row level security;
alter table posts        enable row level security;
alter table programs     enable row level security;
alter table messages     enable row level security;
alter table join_requests enable row level security;

-- Drop existing policies first to avoid conflicts
drop policy if exists "Public read photos"          on photos;
drop policy if exists "Public read posts"           on posts;
drop policy if exists "Public read programs"        on programs;
drop policy if exists "Public insert messages"      on messages;
drop policy if exists "Public insert join_requests" on join_requests;
drop policy if exists "Public read join_requests"   on join_requests;

create policy "Public read photos"          on photos        for select using (true);
create policy "Public read posts"           on posts         for select using (true);
create policy "Public read programs"        on programs      for select using (true);
create policy "Public insert messages"      on messages      for insert with check (true);
create policy "Public insert join_requests" on join_requests for insert with check (true);
create policy "Public read join_requests"   on join_requests for select using (true);

-- 3. STORAGE BUCKET ────────────────────────────────────────────
-- Makes the photos bucket public and allows uploads from the browser

insert into storage.buckets (id, name, public)
  values ('photos', 'photos', true)
  on conflict (id) do update set public = true;

drop policy if exists "Public upload to photos" on storage.objects;
drop policy if exists "Public read from photos" on storage.objects;
drop policy if exists "Public delete from photos" on storage.objects;

create policy "Public upload to photos"  on storage.objects for insert with check (bucket_id = 'photos');
create policy "Public read from photos"  on storage.objects for select using  (bucket_id = 'photos');
create policy "Public delete from photos" on storage.objects for delete using  (bucket_id = 'photos');

-- ── Done! ──────────────────────────────────────────────────────
