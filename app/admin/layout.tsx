'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Image, FileText, Layers, MessageSquare, Users, LogOut, Menu, X, Heart, ChevronRight } from 'lucide-react'

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, color: 'var(--teal)' },
  { label: 'Photos', href: '/admin/photos', icon: Image, color: '#0EA5E9' },
  { label: 'Posts', href: '/admin/posts', icon: FileText, color: 'var(--rust)' },
  { label: 'Programs', href: '/admin/programs', icon: Layers, color: 'var(--gold)' },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare, color: 'var(--sage)' },
  { label: 'Join Requests', href: '/admin/join', icon: Users, color: '#7C3AED' },
]

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

  const current = NAV.find(n => n.href === pathname)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F6F7', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 256, background: '#0D3D49', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, height: '100vh', zIndex: 100,
        transition: 'transform 0.25s',
        transform: open ? 'translateX(0)' : 'translateX(-256px)',
      }} className="admin-sidebar">

        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0 }}>
            <Heart size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>SMHA Admin</div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Samburu Mental Health</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0.5rem 1.25rem 0.25rem' }}>Content</div>
          {NAV.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.7rem 1.25rem',
                fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                borderLeft: `3px solid ${active ? item.color : 'transparent'}`,
                transition: 'all 0.15s',
                position: 'relative',
              }}>
                <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? item.color + '22' : 'transparent', borderRadius: 4 }}>
                  <Icon size={15} color={active ? item.color : 'rgba(255,255,255,0.5)'} />
                </div>
                {item.label}
                {active && <ChevronRight size={12} style={{ marginLeft: 'auto', color: item.color }} />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none', marginBottom: '0.75rem', transition: 'color 0.15s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
          >
            ↗ View live site
          </Link>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', cursor: 'pointer', padding: 0, transition: 'color 0.15s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--rust)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />}

      {/* ── Main ── */}
      <div style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main">

        {/* Top bar */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #E4EAEB',
          padding: '0 1.5rem', height: 58,
          display: 'flex', alignItems: 'center', gap: '1rem',
          position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 0 #EAF0F1',
        }}>
          <button onClick={() => setOpen(!open)} className="admin-burger" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: 4, display: 'none' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem' }}>
            <span style={{ color: 'var(--muted)' }}>Admin</span>
            <span style={{ color: '#CBD5D7' }}>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{current?.label ?? 'Dashboard'}</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, background: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 700 }}>SMHA</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: 1200 }}>
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
