'use client'

import { useRef } from 'react'
import { Download, MapPin, Calendar, Shield } from 'lucide-react'
import type { EventRegistration, Post } from '@/lib/supabase'

interface Props {
  registration: EventRegistration
  event: Post
}

export default function EventTicket({ registration, event }: Props) {
  const ticketRef = useRef<HTMLDivElement>(null)

  const dateStr = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date TBA'

  const timeStr = event.event_date
    ? new Date(event.event_date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
    : ''

  const downloadTicket = () => {
    const el = ticketRef.current
    if (!el) return
    // Use html2canvas approach via print
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>Ticket — ${registration.ticket_number}</title>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#F3F6F7;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'DM Sans',sans-serif;padding:2rem}
        @media print{body{background:white;padding:0}}
      </style>
      </head><body>
      ${el.outerHTML}
      <script>setTimeout(()=>{window.print();window.close()},400)</script>
      </body></html>
    `)
    win.document.close()
  }

  // Build ticket number display blocks
  const parts = registration.ticket_number.split('-')

  return (
    <div style={{ width: '100%' }}>
      {/* ── The Ticket ── */}
      <div ref={ticketRef} style={{
        maxWidth: 520, margin: '0 auto',
        fontFamily: "'DM Sans', sans-serif",
        filter: 'drop-shadow(0 8px 32px rgba(13,61,73,0.18))',
      }}>
        {/* Top half */}
        <div style={{
          background: 'linear-gradient(135deg, #0D3D49 0%, #1A6475 60%, #0D3D49 100%)',
          padding: '0',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background pattern */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} viewBox="0 0 520 280" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="tp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="#fff"/>
                <path d="M0 20 Q10 10 20 20 Q30 30 40 20" stroke="#fff" strokeWidth="0.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="520" height="280" fill="url(#tp)"/>
          </svg>

          {/* Acacia silhouette decoration */}
          <svg style={{ position: 'absolute', bottom: 0, right: -20, opacity: 0.08, width: 180, height: 130 }} viewBox="0 0 180 130">
            <line x1="90" y1="130" x2="90" y2="55" stroke="#fff" strokeWidth="6"/>
            <line x1="90" y1="90" x2="55" y2="60" stroke="#fff" strokeWidth="4"/>
            <line x1="90" y1="78" x2="130" y2="52" stroke="#fff" strokeWidth="4"/>
            <ellipse cx="55" cy="52" rx="38" ry="12" fill="#fff"/>
            <ellipse cx="90" cy="40" rx="50" ry="13" fill="#fff"/>
            <ellipse cx="128" cy="46" rx="36" ry="11" fill="#fff"/>
          </svg>

          <div style={{ position: 'relative', padding: '1.75rem 1.75rem 1.5rem' }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.25rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5"/>
                      <path d="M12 5 Q16 10 12 15 Q8 10 12 5Z" fill="rgba(255,255,255,0.8)"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', fontWeight: 400, color: '#fff', letterSpacing: '0.04em' }}>Samburu Wellness Resilience</span>
                </div>
                <div style={{ fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Official Event Ticket • Kenya</div>
              </div>
              {registration.status === 'confirmed'
                ? <div style={{ background: '#22c55e', color: '#fff', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.3rem 0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Shield size={10}/> Verified
                  </div>
                : <div style={{ background: '#f59e0b', color: '#fff', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.3rem 0.8rem' }}>
                    Pending
                  </div>
              }
            </div>

            {/* Event name */}
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem,4vw,1.9rem)', fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
              {event.title}
            </h2>

            {/* Date / Location row */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {event.event_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                  <Calendar size={13}/> {dateStr}{timeStr ? ` · ${timeStr}` : ''}
                </div>
              )}
              {event.event_location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                  <MapPin size={13}/> {event.event_location}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tear line */}
        <div style={{ position: 'relative', height: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: -12, width: 24, height: 24, borderRadius: '50%', background: '#F3F6F7', zIndex: 2 }}/>
          <div style={{ flex: 1, borderTop: '2px dashed #CBD5D7', margin: '0 16px' }}/>
          <div style={{ position: 'absolute', right: -12, width: 24, height: 24, borderRadius: '50%', background: '#F3F6F7', zIndex: 2 }}/>
        </div>

        {/* Bottom half */}
        <div style={{ background: '#fff', padding: '1.5rem 1.75rem 1.75rem', border: '1px solid #E2E8EA', borderTop: 'none' }}>
          {/* Attendee info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9AACAF', marginBottom: '0.25rem' }}>Attendee</div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0D2B32' }}>{registration.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9AACAF', marginBottom: '0.25rem' }}>Email</div>
              <div style={{ fontSize: '0.82rem', color: '#4A6870', wordBreak: 'break-all' }}>{registration.email}</div>
            </div>
            {event.event_type === 'paid' && event.event_price && (
              <div>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9AACAF', marginBottom: '0.25rem' }}>Amount Paid</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#C0472A' }}>KES {event.event_price.toLocaleString()}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9AACAF', marginBottom: '0.25rem' }}>Issued</div>
              <div style={{ fontSize: '0.82rem', color: '#4A6870' }}>{new Date(registration.created_at).toLocaleDateString('en-KE')}</div>
            </div>
          </div>

          {/* Ticket number — the centrepiece */}
          <div style={{ background: 'linear-gradient(135deg, #0D3D49, #1A6475)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '0.4rem' }}>Ticket Number</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 600, color: '#fff', letterSpacing: '0.2em' }}>
                {parts.join(' · ')}
              </div>
            </div>
            {/* Mini QR-style decoration */}
            <div style={{ flexShrink: 0 }}>
              <svg width="54" height="54" viewBox="0 0 54 54">
                <rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                <rect x="8" y="8" width="8" height="8" fill="rgba(255,255,255,0.7)"/>
                <rect x="32" y="2" width="20" height="20" rx="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                <rect x="38" y="8" width="8" height="8" fill="rgba(255,255,255,0.7)"/>
                <rect x="2" y="32" width="20" height="20" rx="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                <rect x="8" y="38" width="8" height="8" fill="rgba(255,255,255,0.7)"/>
                <rect x="32" y="28" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="38" y="28" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="44" y="28" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="32" y="34" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="44" y="34" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="32" y="40" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="38" y="40" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="44" y="40" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="38" y="46" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
              </svg>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.62rem', color: '#9AACAF', letterSpacing: '0.08em' }}>
              Present this ticket at the entrance · samburuwellness.org
            </div>
            <div style={{ fontSize: '0.6rem', color: '#B0BCBE', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              © SWR {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* Download button */}
      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <button
          onClick={downloadTicket}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--teal)', color: '#fff',
            padding: '0.7rem 1.75rem', border: 'none', cursor: 'pointer',
            fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Download size={15}/> Download / Print Ticket
        </button>
      </div>
    </div>
  )
}
