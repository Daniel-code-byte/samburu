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
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: scrolled ? 'rgba(253,252,250,0.97)' : 'var(--white)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 24px rgba(14,28,32,0.08)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 66,
        }}>

          {/* LOGO */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="https://ovykholwoiqdaelgkvez.supabase.co/storage/v1/object/public/photos/icon.jpeg"
              alt="SWR Logo"
              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 2 }}
            />
            <div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 1.1
              }}>
                Samburu Wellness
              </div>
              <div style={{
                fontSize: '0.57rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--muted)'
              }}>
                Resilience
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
            <Link href="/join" className="btn-primary join-btn">
              Join Us
            </Link>
          </nav>

          {/* BURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="mobile-burger"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${open ? 'open' : ''}`}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="mobile-link">
              {item.label}
            </Link>
          ))}
          <Link href="/join" className="btn-primary mobile-join">
            Join Us
          </Link>
        </div>
      </header>

      {/* STYLES */}
      <style>{`

        /* Desktop */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .nav-link {
          padding: 0.5rem 0.85rem;
          font-size: 0.84rem;
          font-weight: 500;
          color: var(--body);
          text-decoration: none;
        }

        .join-btn {
          margin-left: 0.75rem;
          font-size: 0.79rem;
          padding: 0.5rem 1.2rem;
        }

        /* Burger */
        .mobile-burger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ink);
        }

        /* Mobile Menu Base */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: var(--teal-deep);
          padding: 0 2rem;
          overflow: hidden;

          max-height: 0;
          opacity: 0;
          transform: translateY(-10px);

          transition:
            max-height 0.4s ease,
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        /* OPEN STATE */
        .mobile-menu.open {
          max-height: 500px;
          opacity: 1;
          transform: translateY(0);
          padding: 1rem 2rem 1.5rem;
        }

        /* Links */
        .mobile-link {
          display: block;
          padding: 0.85rem 0;
          font-size: 1rem;
          font-weight: 500;
          color: #fff;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: padding 0.2s;
        }

        .mobile-link:hover {
          padding-left: 6px;
        }

        .mobile-join {
          margin-top: 1rem;
          display: block;
          text-align: center;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .desktop-nav { display: none; }
          .mobile-burger { display: block; }
        }

      `}</style>
    </>
  )
}
