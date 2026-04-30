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
      <header className="nav-header">
        <div className="nav-inner">

          {/* LOGO */}
          <Link href="/" className="logo">
            <img
              src="https://ovykholwoiqdaelgkvez.supabase.co/storage/v1/object/public/photos/icon.jpeg"
              alt="logo"
            />
            <div>
              <div className="logo-title">Samburu Wellness</div>
              <div className="logo-sub">Resilience</div>
            </div>
          </Link>

          {/* DESKTOP */}
          <nav className="desktop-nav">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
            <Link href="/join" className="cta">
              Join Us
            </Link>
          </nav>

          {/* BURGER */}
          <button onClick={() => setOpen(!open)} className="burger">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${open ? 'open' : ''}`}>
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-link"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/join" className="cta mobile-cta">
            Join Us
          </Link>
        </div>
      </header>

      <style>{`

        /* HEADER */
        .nav-header {
          position: sticky;
          top: 0;
          z-index: 90;
          background: var(--white);
          border-bottom: 1px solid var(--border);
        }

        .nav-inner {
          max-width: 1200px;
          margin: auto;
          padding: 0 2rem;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* LOGO */
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo img {
          width: 40px;
          height: 40px;
          border-radius: 3px;
        }

        .logo-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--ink);
        }

        .logo-sub {
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* DESKTOP */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .nav-link {
          padding: 0.5rem 0.9rem;
          font-size: 0.85rem;
          color: var(--body);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #6C63FF; /* blue-purple */
        }

        /* CTA */
        .cta {
          margin-left: 0.8rem;
          padding: 0.5rem 1.3rem;
          font-size: 0.8rem;
          background: linear-gradient(135deg, #6C63FF, #8A7CFF);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(108,99,255,0.3);
        }

        /* BURGER */
        .burger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* MOBILE MENU */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #0D1B2A; /* deep premium dark */
          overflow: hidden;

          max-height: 0;
          opacity: 0;
          transform: translateY(-12px);

          transition: all 0.35s ease;
        }

        .mobile-menu.open {
          max-height: 520px;
          opacity: 1;
          transform: translateY(0);
          padding: 1.2rem 2rem 1.5rem;
        }

        /* LINKS */
        .mobile-link {
          display: block;
          padding: 0.9rem 0;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          font-size: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);

          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .mobile-menu.open .mobile-link {
          opacity: 1;
          transform: translateY(0);
        }

        .mobile-link:hover {
          color: #8A7CFF;
          padding-left: 6px;
        }

        .mobile-cta {
          display: block;
          text-align: center;
          margin-top: 1rem;
        }

        /* RESPONSIVE */
        @media (max-width: 860px) {
          .desktop-nav { display: none; }
          .burger { display: block; }
        }

      `}</style>
    </>
  )
}
