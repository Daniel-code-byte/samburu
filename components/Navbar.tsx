'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/news' },
  { label: 'Donate', href: '/donate' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 90,
        background: scrolled ? 'rgba(253,252,250,0.97)' : 'var(--white)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 24px rgba(14,28,32,0.08)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 66,
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ovykholwoiqdaelgkvez.supabase.co/storage/v1/object/public/photos/icon.jpeg"
              alt="SMHA Logo"
              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 2 }}
            />
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
                Samburu Wellness Resilience
              </div>
              <div style={{ fontSize: '0.57rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Association
              </div>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }} className="desktop-nav">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} style={{
                padding: '0.5rem 0.85rem', fontSize: '0.84rem', fontWeight: 500,
                color: pathname.startsWith(item.href) ? 'var(--teal)' : 'var(--body)',
                textDecoration: 'none',
                borderBottom: pathname.startsWith(item.href) ? '2px solid var(--teal)' : '2px solid transparent',
                transition: 'color 0.15s',
              }}>
                {item.label}
              </Link>
            ))}
            <Link href="/join" className="btn-primary" style={{ marginLeft: '0.75rem', fontSize: '0.79rem', padding: '0.5rem 1.2rem' }}>
              Join Us
            </Link>
          </nav>

          <button onClick={() => setOpen(!open)} className="mobile-burger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: 6 }}
            aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div style={{ borderTop: '1px solid var(--border)', background: '#fff', padding: '1rem 2rem 1.5rem' }}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} style={{
                display: 'block', padding: '0.75rem 0', fontSize: '0.95rem', fontWeight: 500,
                color: 'var(--body)', textDecoration: 'none', borderBottom: '1px solid var(--border)',
              }}>
                {item.label}
              </Link>
            ))}
            <Link href="/join" className="btn-primary" style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
              Join Us
            </Link>
          </div>
        )}
      </header>

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-burger { display: none !important; }
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
