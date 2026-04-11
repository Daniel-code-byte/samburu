'use client'

import { useState } from 'react'
import { X, ImageIcon } from 'lucide-react'
import type { Photo } from '@/lib/supabase'

const CATEGORIES = ['All', 'community', 'health', 'women', 'youth', 'culture']

export default function GalleryClient({ photos }: { photos: Photo[] }) {
  const [cat, setCat] = useState('All')
  const [lightbox, setLightbox] = useState<Photo | null>(null)

  const filtered = cat === 'All' ? photos : photos.filter(p => p.category.toLowerCase() === cat.toLowerCase())

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: '0.45rem 1.1rem', fontSize: '0.8rem', fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em',
            border: `1.5px solid ${cat === c ? 'var(--teal)' : 'var(--border-md)'}`,
            background: cat === c ? 'var(--teal)' : 'transparent',
            color: cat === c ? '#fff' : 'var(--body)',
            cursor: 'pointer', transition: 'all 0.2s',
            textTransform: 'capitalize',
          }}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--muted)' }}>
          <ImageIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
            {photos.length === 0 ? 'Photos coming soon' : 'No photos in this category'}
          </p>
          <p style={{ fontSize: '0.88rem' }}>
            {photos.length === 0 ? 'Photos will appear here once uploaded via the admin dashboard.' : 'Try selecting a different category above.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map((p) => (
            <div key={p.id} className="img-zoom sw-card" style={{ cursor: 'pointer', aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }} onClick={() => setLightbox(p)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(13,61,73,0.7) 0%, transparent 55%)',
                display: 'flex', alignItems: 'flex-end', padding: '1rem',
              }}>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#fff', fontSize: '1rem', fontWeight: 600 }}>{p.title}</div>
                  {p.description && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{p.description}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.93)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem',
        }}>
          <button onClick={() => setLightbox(null)} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: '#fff', cursor: 'pointer', padding: 8, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={20} />
          </button>
          <div style={{ maxWidth: '90vw', maxHeight: '85vh', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.url} alt={lightbox.title} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
            <div style={{ color: '#fff', marginTop: '0.75rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{lightbox.title}</div>
          </div>
        </div>
      )}
    </div>
  )
}
