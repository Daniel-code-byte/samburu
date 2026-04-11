'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--teal-deep)', color: 'rgba(255,255,255,0.8)', padding: '4rem 2rem 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://ovykholwoiqdaelgkvez.supabase.co/storage/v1/object/public/photos/icon.jpeg" alt="SMHA" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 2 }} />
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>Samburu Wellness</div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>& Resilience</div>
              </div>
            </div>
            <p style={{ fontSize: '0.84rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: '1.25rem' }}>
              Promoting mental wellbeing in Samburu County through awareness, community engagement, stigma reduction and linkage to appropriate support services.
            </p>
            <Link href="/join" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--rust)', color: '#fff',
              padding: '0.55rem 1.2rem', fontSize: '0.78rem',
              fontFamily: 'DM Sans, sans-serif', textDecoration: 'none',
              fontWeight: 500, letterSpacing: '0.04em',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              <Heart size={12} /> Join Us
            </Link>
          </div>

          {/* Navigate */}
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>Navigate</div>
            {[
              { label: 'About Us', href: '/about' },
              { label: 'Programs', href: '/programs' },
              { label: 'Gallery', href: '/gallery' },
              { label: 'News', href: '/news' },
              { label: 'Donate', href: '/donate' },
              { label: 'Join Us', href: '/join' },
              { label: 'Contact', href: '/contact' },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{
                display: 'block', color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none', fontSize: '0.87rem', marginBottom: '0.55rem',
                transition: 'color 0.15s',
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
              >{l.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <a href="mailto:chair@samburuwellness.org" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.84rem', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')}
              >
                <Mail size={13} /> chair@samburuwellness.org
              </a>
              <a href="tel:+254704579936" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.84rem', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')}
              >
                <Phone size={13} /> +254 704 579 936
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem' }}>
                <MapPin size={13} /> Samburu County, Kenya
              </div>
            </div>
          </div>

          {/* Donate CTA */}
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>Support Us</div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Your donation reaches Samburu families directly — through health, education, and community care.
              </p>
              <Link href="/donate" style={{
                display: 'block', textAlign: 'center',
                background: '#25D366', color: '#fff',
                padding: '0.6rem 1rem', fontSize: '0.8rem',
                fontFamily: 'DM Sans, sans-serif', textDecoration: 'none',
                fontWeight: 500, transition: 'opacity 0.2s',
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.3)' }}>
              © {new Date().getFullYear()} Samburu Wellness & Resilience. All rights reserved.
            </div>
            <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 5 }}>
              Made with <Heart size={10} style={{ color: 'var(--rust)' }} /> in Kenya
            </div>
          </div>
          {/* Developer credit */}
          <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span>Developed by Daniel Lepati</span>
            <a href="tel:+254704579936" style={{ color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}>0704 579 936</a>
            <a href="mailto:lepatidan5@gmail.com" style={{ color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}>lepatidan5@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
