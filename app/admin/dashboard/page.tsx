'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Image, FileText, Layers, MessageSquare, Users, ArrowRight, TrendingUp, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ photos: 0, posts: 0, programs: 0, messages: 0, joins: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [p, po, pr, m, j] = await Promise.all([
        supabase.from('photos').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('programs').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('join_requests').select('id', { count: 'exact', head: true }),
      ])
      setCounts({ photos: p.count ?? 0, posts: po.count ?? 0, programs: pr.count ?? 0, messages: m.count ?? 0, joins: j.count ?? 0 })
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Photos', count: counts.photos, icon: Image, href: '/admin/photos', color: '#0EA5E9', bg: '#E0F2FE', desc: 'Gallery images' },
    { label: 'News Posts', count: counts.posts, icon: FileText, href: '/admin/posts', color: 'var(--rust)', bg: 'var(--rust-pale)', desc: 'Published stories' },
    { label: 'Programs', count: counts.programs, icon: Layers, href: '/admin/programs', color: 'var(--gold)', bg: 'var(--gold-pale)', desc: 'Active programs' },
    { label: 'Messages', count: counts.messages, icon: MessageSquare, href: '/admin/messages', color: 'var(--sage)', bg: 'var(--sage-pale)', desc: 'Contact form inbox' },
    { label: 'Join Requests', count: counts.joins, icon: Users, href: '/admin/join', color: '#7C3AED', bg: '#EDE9FE', desc: 'People who signed up' },
  ]

  return (
    <div>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, var(--teal-deep), var(--teal))', borderRadius: 6, padding: '2rem', marginBottom: '2rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.06 }}>
          <Heart size={160} />
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Welcome back</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '0.4rem' }}>
            Samburu Mental Health Dashboard
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>Manage your website content from here. Everything updates live on the site.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Link key={c.label} href={c.href} style={{ background: '#fff', border: '1px solid #E4EAEB', borderRadius: 6, padding: '1.25rem', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ width: 38, height: 38, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
                  <Icon size={17} color={c.color} />
                </div>
                <ArrowRight size={13} color="#C0CCCE" />
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
                {loading ? '…' : c.count}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', marginTop: '0.2rem' }}>{c.label}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{c.desc}</div>
            </Link>
          )
        })}
      </div>

      {/* Quick actions */}
      <div style={{ background: '#fff', border: '1px solid #E4EAEB', borderRadius: 6, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { label: '📷 Upload Photo', href: '/admin/photos', bg: '#0EA5E9' },
            { label: '✍️ Write Post', href: '/admin/posts', bg: 'var(--rust)' },
            { label: '📬 Read Messages', href: '/admin/messages', bg: 'var(--sage)' },
            { label: '👥 See Who Joined', href: '/admin/join', bg: '#7C3AED' },
          ].map((a) => (
            <Link key={a.href} href={a.href} style={{
              background: a.bg, color: '#fff', padding: '0.6rem 1.2rem',
              fontSize: '0.84rem', fontWeight: 500, textDecoration: 'none',
              borderRadius: 2, fontFamily: 'DM Sans, sans-serif',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Help note */}
      <div style={{ background: 'var(--teal-pale)', border: '1px solid var(--border)', borderRadius: 6, padding: '1.25rem', fontSize: '0.84rem', color: 'var(--teal-deep)', lineHeight: 1.7 }}>
        <strong>💡 How to use this dashboard:</strong> Click any section in the left menu to manage it.
        Photos you upload will appear on the <strong>Gallery</strong> page and homepage. Posts you write appear in <strong>News</strong>.
        Messages from the contact form land in <strong>Messages</strong>. People who sign up via Join Us appear in <strong>Join Requests</strong>.
      </div>
    </div>
  )
}
