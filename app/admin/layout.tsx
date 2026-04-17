'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Image, Layers, MessageSquare, Users, LogOut, Menu, X, Heart, ChevronRight, Calendar, Star, FileText, Video } from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Content',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, color: 'var(--teal)' },
      { label: 'Photos', href: '/admin/photos', icon: Image, color: '#0EA5E9' },
      { label: 'Videos', href: '/admin/videos', icon: Video, color: '#EC4899' },
      { label: 'Programs', href: '/admin/programs', icon: Layers, color: 'var(--gold)' },
    ]
  },
  {
    label: 'News & Events',
    items: [
      { label: 'News Posts', href: '/admin/posts', icon: FileText, color: 'var(--rust)' },
      { label: 'Events', href: '/admin/events', icon: Calendar, color: '#F59E0B' },
    ]
  },
  {
    label: 'Community',
    items: [
      { label: 'Members', href: '/admin/members', icon: Star, color: '#7C3AED' },
      { label: 'Join Requests', href: '/admin/join', icon: Users, color: '#0EA5E9' },
      { label: 'Messages', href: '/admin/messages', icon: MessageSquare, color: 'var(--sage)' },
    ]
  },
]

const ALL_NAV = NAV_GROUPS.flatMap(g => g.items)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [auth, setAuth] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (pathname === '/admin') { setAuth(true); return }
    const ok = sessionStorage.getItem('sw_admin') === '1'
    if (!ok) router.push('/admin')
    else setAuth(true)
  }, [pathname, router])

  const logout = () => { sessionStorage.removeItem('sw_admin'); router.push('/admin') }

  if (!auth) return null
  if (pathname === '/admin') return <>{children}</>

  const current = ALL_NAV.find(n => n.href === pathname)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F6F7', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 230, background: '#0D3D49', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, height: '100vh', zIndex: 100,
        transition: 'transform 0.25s',
        transform: open ? 'translateX(0)' : 'translateX(-230px)',
        overflowY: 'auto',
      }} className="admin-sidebar">

        {/* Logo */}
        <div style={{ padding: '1.1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0 }}>
            <Heart size={14} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>SWR Admin</div>
            <div style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Samburu Wellness</div>
          </div>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, padding: '0.4rem 0' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <div style={{ fontSize: '0.57rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0.7rem 1rem 0.2rem' }}>
                {group.label}
              </div>
              {group.items.map(item => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '0.55rem 1rem',
                    fontSize: '0.81rem', fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    textDecoration: 'none',
                    borderLeft: `3px solid ${active ? item.color : 'transparent'}`,
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? item.color + '22' : 'transparent', borderRadius: 4 }}>
                      <Icon size={13} color={active ? item.color : 'rgba(255,255,255,0.45)'} />
                    </div>
                    {item.label}
                    {active && <ChevronRight size={10} style={{ marginLeft: 'auto', color: item.color }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: '0.76rem', textDecoration: 'none', marginBottom: '0.5rem' }}>
            ↗ View live site
          </Link>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.76rem', cursor: 'pointer', padding: 0 }}>
            <LogOut size={12} /> Log out
          </button>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />}

      {/* ── Main ── */}
      <div style={{ flex: 1, marginLeft: 230, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main">
        <header style={{ background: '#fff', borderBottom: '1px solid #E4EAEB', padding: '0 1.25rem', height: 52, display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setOpen(!open)} className="admin-burger" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: 4, display: 'none' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.81rem' }}>
            <span style={{ color: 'var(--muted)' }}>Admin</span>
            <span style={{ color: '#CBD5D7' }}>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{current?.label ?? 'Dashboard'}</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ width: 28, height: 28, background: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 700 }}>SWR</span>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.5rem', maxWidth: 1200 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) { .admin-sidebar { transform: translateX(0) !important; } }
        @media (max-width: 768px) { .admin-main { margin-left: 0 !important; } .admin-burger { display: flex !important; } }
      `}</style>
    </div>
  )
}
