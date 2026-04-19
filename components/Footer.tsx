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
              <img src="https://ovykholwoiqdaelgkvez.supabase.co/storage/v1/object/public/photos/icon.jpeg" alt="SWR" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 2 }} />
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>Samburu Wellness</div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Resilience</div>
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
              { label: 'Events', href: '/news' },
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
              <a href="tel:+254708588479" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.84rem', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')}
              >
                <Phone size={13} /> +254 708 588 479
              </a>
              <a href="https://wa.me/254708588479" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.84rem', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
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
              © {new Date().getFullYear()} Samburu Wellness &amp; Resilience. All rights reserved.
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
