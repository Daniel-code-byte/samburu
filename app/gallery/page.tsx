import type { Metadata } from 'next'
import { getPhotos } from '@/lib/supabase'
import GalleryClient from '@/components/GalleryClient'

export const metadata: Metadata = {
  title: 'Gallery — Samburu Mental Health Association',
  description: 'A window into our work and the Samburu community we serve.',
}

export default async function GalleryPage() {
  const photos = await getPhotos()

  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <section style={{ background: 'var(--teal-deep)', padding: '6rem 2rem 5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Visual Stories</div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 5vw, 4rem)',
            fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem',
          }}>
            Life in the<br /><em>Samburu community</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Every photo tells a story of strength, joy, healing, and belonging. Browse moments captured across our villages.
          </p>
        </div>
      </section>

      {/* ── Gallery grid ────────────────────────────────── */}
      <section className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <GalleryClient photos={photos} />
        </div>
      </section>

      {/* ── Upload note ─────────────────────────────────── */}
      <section style={{ background: 'var(--sand)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            New photos can be added via the admin dashboard.
          </p>
        </div>
      </section>
    </>
  )
}
