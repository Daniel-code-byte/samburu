'use client'

import { useEffect, useState } from 'react'
import { getHeroPhotos, type Photo } from '@/lib/supabase'

const FALLBACK = [
  { bg: '#0D3D49', text: 'Mental Health for Every Samburu' },
  { bg: '#1A5C6B', text: 'Awareness · Support · Healing' },
  { bg: '#2A3E4A', text: 'Reducing Stigma. Building Resilience.' },
]

// Filter out icon/logo images that shouldn't appear in the slideshow
function isIconImage(url: string): boolean {
  const lower = url.toLowerCase()
  // Match icon.jpg, icon.jpeg, icon.png, logo.jpg, logo.jpeg, logo.png etc.
  return /\/(icon|logo)\.(jpe?g|png|webp|gif)(\?|$)/i.test(lower)
}

export default function HeroSlider() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    getHeroPhotos().then((all) => {
      // Filter out icon/logo images from slideshow
      const slideshowPhotos = all.filter(p => !isIconImage(p.url))
      setPhotos(slideshowPhotos)
    })
  }, [])

  const count = photos.length > 0 ? photos.length : FALLBACK.length

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % count), 5000)
    return () => clearInterval(t)
  }, [count])

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', minHeight: 500, background: '#0D3D49' }}>
      
      {photos.length > 0 ? (
        photos.map((p, i) => (
          <div key={p.id} style={{
            position: 'absolute', inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}>
            {/* Use img tag to avoid Next.js domain restrictions during dev */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(13,61,73,0.2) 0%, rgba(13,61,73,0.5) 100%)',
            }} />
          </div>
        ))
      ) : (
        FALLBACK.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            background: s.bg,
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
              color: 'rgba(255,255,255,0.12)',
              textAlign: 'center',
              padding: '2rem',
              lineHeight: 1.3,
            }}>
              {s.text}
            </div>
          </div>
        ))
      )}

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 6, zIndex: 10,
      }}>
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 22 : 7, height: 7,
            borderRadius: 4,
            background: i === idx ? '#fff' : 'rgba(255,255,255,0.3)',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.3s', padding: 0,
          }} />
        ))}
      </div>
    </div>
  )
}
