'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/photos', label: 'Photos', icon: '📷' },
  { href: '/admin/posts', label: 'Posts & Events', icon: '📝' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/join-requests', label: 'Join Requests', icon: '👥' },
  { href: '/admin/partnerships', label: 'Partnerships', icon: '🤝' },
]

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthed(sessionStorage.getItem('swadmin') === '1')
    }
  }, [])

  // Close sidebar when route changes (mobile nav tap)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  function login(e) {
    e.preventDefault()
    if (pw === 'admin987') {
      sessionStorage.setItem('swadmin', '1')
      setAuthed(true)
    } else {
      setErr('Incorrect password. Please try again.')
    }
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--navy)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
      }}>
        <div style={{
          background: 'var(--navy-card)', border: '1px solid var(--navy-border)',
          borderRadius: '12px', padding: 'clamp(32px,5vw,48px)',
          width: '100%', maxWidth: '420px', textAlign: 'center'
        }}>
          <div style={{
            width: '56px', height: '56px', background: 'var(--gold)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '20px',
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#04101F'
          }}>SW</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', color: 'var(--text-bright)',
            fontSize: '24px', marginBottom: '6px'
          }}>Admin Access</h2>
          <p style={{ color: 'var(--text-mid)', fontSize: '14px', marginBottom: '28px' }}>
            Samburu Wellness & Resilience
          </p>
          <form onSubmit={login}>
            <input
              type="password"
              placeholder="Enter admin password"
              className="form-input"
              value={pw}
              onChange={e => { setPw(e.target.value); setErr('') }}
              style={{ marginBottom: '16px', textAlign: 'center' }}
            />
            {err && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{err}</p>}
            <button type="submit" className="btn-amber" style={{ width: '100%', padding: '12px' }}>
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">

      {/* ── MOBILE TOP BAR ── */}
      <header className="admin-topbar">
        <button
          className="admin-menu-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
        <span className="admin-topbar-title">
          {NAV.find(n => n.pathname === pathname)?.label ?? 'Dashboard'}
        </span>
        <a href="/" className="admin-topbar-back">← Site</a>
      </header>

      {/* ── SIDEBAR OVERLAY (mobile) ── */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-brand">
          <h2>Samburu Wellness</h2>
          <span>Admin Dashboard</span>
          {/* Close button — visible on mobile only */}
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >✕</button>
        </div>

        <nav className="admin-nav">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item${pathname === item.href ? ' active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 22px', borderTop: '1px solid var(--navy-border)' }}>
          <a href="/" style={{
            fontSize: '13px', color: 'var(--text-dim)',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>← Back to Site</a>
          <button
            onClick={() => { sessionStorage.removeItem('swadmin'); setAuthed(false) }}
            style={{
              marginTop: '10px', fontSize: '13px', color: 'var(--text-dim)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0
            }}
          >Log Out</button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main">
        {children}
      </main>

    </div>
  )
}
