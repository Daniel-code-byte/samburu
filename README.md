# Samburu Wellness & Resilience — Next.js 14 Website

## Quick Start

```bash
tar -xzf samburu-wellness-nextjs.tar.gz
cd samburu-wellness
npm install
npm run dev
```

Open http://localhost:3000

---

## Supabase Setup

1. Go to https://supabase.com → your project `ovykholwoiqdaelgkvez`
2. Go to **SQL Editor** and run the following to create all tables:

```sql
-- Photos table
create table photos (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  title text,
  caption text,
  category text default 'Community',
  created_at timestamptz default now()
);

-- Posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique,
  excerpt text,
  content text,
  category text default 'Community',
  image_url text,
  cover_image text,
  published boolean default false,
  created_at timestamptz default now()
);

-- Messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  subject text,
  message text,
  phone text,
  created_at timestamptz default now()
);

-- Join Requests table
create table join_requests (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  phone text,
  location text,
  role text,
  skills text,
  motivation text,
  created_at timestamptz default now()
);

-- Partnerships table
create table partnerships (
  id uuid default gen_random_uuid() primary key,
  name text,
  org text,
  email text,
  phone text,
  tier text,
  payment_method text,
  message text,
  status text default 'pending',
  created_at timestamptz default now()
);
```

3. Go to **Storage** → create a bucket called `media` → set it to **Public**

4. Go to **Settings → API** → copy your **anon public key**

5. Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

6. In `lib/supabase.js`, the `supabaseAnonKey` line uses `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` automatically.

---

## Enable Row Level Security (RLS)

For each table, enable RLS and add policies in Supabase:

```sql
-- Allow public inserts (for forms)
alter table messages enable row level security;
create policy "Allow inserts" on messages for insert with check (true);
create policy "Allow select for anon" on messages for select using (true);

-- Repeat for join_requests and partnerships
alter table join_requests enable row level security;
create policy "Allow inserts" on join_requests for insert with check (true);
create policy "Allow select for anon" on join_requests for select using (true);

alter table partnerships enable row level security;
create policy "Allow inserts" on partnerships for insert with check (true);
create policy "Allow select for anon" on partnerships for select using (true);
create policy "Allow updates" on partnerships for update using (true);

-- Photos and posts: public read
alter table photos enable row level security;
create policy "Public read" on photos for select using (true);
create policy "Allow inserts" on photos for insert with check (true);
create policy "Allow deletes" on photos for delete using (true);

alter table posts enable row level security;
create policy "Public read" on posts for select using (true);
create policy "Allow inserts" on posts for insert with check (true);
create policy "Allow updates" on posts for update using (true);
create policy "Allow deletes" on posts for delete using (true);
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero slider, pull quote, photo strips, stats, programs, story, news, CTA |
| `/who-we-are` | Story, mission/vision, values, team cards + directory table |
| `/our-work` | 4 programs in alternating photo/text layout |
| `/gallery` | Masonry grid with category filters + lightbox |
| `/news` | Featured post + news grid |
| `/news/[slug]` | Individual post page |
| `/partner` | Partnership tiers, payment methods, application form |
| `/contact` | Contact info + message form |
| `/join` | Team/volunteer sign-up form |
| `/admin` | Password-protected admin dashboard |
| `/admin/photos` | Drag & drop photo upload to Supabase Storage |
| `/admin/posts` | Write, edit, publish/unpublish posts |
| `/admin/messages` | Messages inbox with reply link |
| `/admin/join-requests` | View and contact applicants |
| `/admin/partnerships` | Approve/decline partnership applications |

**Admin password:** `samburu2024admin`

---

## Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variable in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

---

## Design

- **Fonts:** Playfair Display (headings, italic accents) + Outfit (body)
- **Palette:** Deep brown `#2C1810`, Amber `#C68B3C`, Ivory `#FDFAF4`, Sand `#F5EDD8`
- **Navbar:** Transparent on hero → solid dark on scroll
- **Mobile:** Fully responsive, hamburger menu, `clamp()` typography
- **WhatsApp:** Floating button → +254704579936

---

Developed by **Daniel Lepati** · lepatidan5@gmail.com · 0704 579 936
