'use client'

import { useEffect, useState } from 'react'
import { getHeroPhotos, type Photo } from '@/lib/supabase'

const FALLBACK_BG = ['#0D3D49', '#1A5C6B', '#0E2830']

export default function HeroSlider() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    getHeroPhotos().then((all) => {
      // Skip the icon — filter out any photo whose URL contains 'icon'
      const filtered = all.filter(p => !p.url.toLowerCase().includes('icon'))
      setPhotos(filtered)
    })
  }, [])

  const count = photos.length > 0 ? photos.length : FALLBACK_BG.length

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % count), 5000)
    return () => clearInterval(t)
  }, [count])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {photos.length > 0 ? (
        photos.map((p, i) => (
          <div key={p.id} style={{
            position: 'absolute', inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))
      ) : (
        FALLBACK_BG.map((bg, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            background: bg,
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }} />
        ))
      )}

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 24, right: 32,
        display: 'flex', gap: 6, zIndex: 10,
      }}>
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 20 : 6, height: 6,
            borderRadius: 3,
            background: i === idx ? '#fff' : 'rgba(255,255,255,0.35)',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.3s', padding: 0,
          }} />
        ))}
      </div>
    </div>
  )
}
