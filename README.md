# Samburu Mental Health Association — Website

## Quick Start

```bash
cd sw
cp .env.example .env.local
# Fill in your Supabase credentials
npm install
npm run dev
```

## .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup
1. Go to **SQL Editor** in Supabase and run the full `supabase-schema.sql` file
2. That's it — all tables, policies and storage bucket are created automatically

## Admin Dashboard
- URL: `yourdomain.com/admin`
- Password: `samburu2024admin`
- Change password in: `app/admin/page.tsx` line 3

## Pages
| Route | What it is |
|-------|-----------|
| `/` | Homepage |
| `/about` | Mission, vision, objectives, team |
| `/programs` | 4 mental health programs |
| `/gallery` | Photo gallery |
| `/news` | News & stories |
| `/contact` | Contact form |
| `/join` | Sign-up form |
| `/donate` | M-Pesa + PayPal |
| `/admin` | Admin dashboard |

## Hosting on Vercel (free, 10 minutes)
1. Push the `sw` folder to a GitHub repository
2. Go to vercel.com → New Project → import the repo
3. Set environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Deploy — done!

---
*Developed by Daniel Lepati · lepatidan5@gmail.com · 0704 579 936*
