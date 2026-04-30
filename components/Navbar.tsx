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
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

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
      </header>

      {/* 🔥 OVERLAY */}
      <div
        className={`overlay ${open ? 'show' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* 🔥 MOBILE MENU */}
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

        <Link href="/join" className="mobile-cta">
          Join Us
        </Link>
      </div>

      <style>{`

        /* HEADER */
        .nav-header {
          position: sticky;
          top: 0;
          z-index: 1000;
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
          gap: 0.3rem;
        }

        .nav-link {
          padding: 0.5rem 0.9rem;
          font-size: 0.85rem;
          color: var(--body);
          text-decoration: none;
        }

        .nav-link:hover {
          color: var(--teal);
        }

        .cta {
          margin-left: 0.8rem;
          padding: 0.5rem 1.3rem;
          font-size: 0.8rem;
          background: var(--rust);
          color: white;
          border-radius: 4px;
          text-decoration: none;
        }

        /* BURGER */
        .burger {
          display: none;
          background: none;
          border: none;
        }

        /* 🔥 OVERLAY */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 998;
        }

        .overlay.show {
          opacity: 1;
          pointer-events: auto;
        }

        /* 🔥 MOBILE MENU */
        .mobile-menu {
          position: fixed;
          top: 66px;
          left: 0;
          width: 100%;
          z-index: 999;

          background: linear-gradient(
            180deg,
            var(--teal-deep),
            #123944
          );

          box-shadow: 0 20px 60px rgba(0,0,0,0.3);

          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(-12px);

          transition: all 0.35s ease;
        }

        .mobile-menu.open {
          max-height: 520px;
          opacity: 1;
          transform: translateY(0);
          padding: 1.2rem 2rem 1.6rem;
        }

        /* LINKS */
        .mobile-link {
          display: block;
          padding: 0.95rem 0;
          font-size: 1rem;
          color: rgba(255,255,255,0.92);
          text-decoration: none;
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
          color: var(--gold);
          padding-left: 6px;
        }

        /* CTA */
        .mobile-cta {
          display: block;
          text-align: center;
          margin-top: 1rem;
          padding: 0.75rem;

          background: var(--rust);
          color: white;
          border-radius: 4px;
          text-decoration: none;
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
