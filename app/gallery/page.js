'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['All', 'Health', 'Women', 'Youth', 'Community']

export default function GalleryPage() {
  const [photos, setPhotos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive]   = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const [lbIndex,  setLbIndex]  = useState(0)

  useEffect(() => {
    async function fetchPhotos() {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .not('category', 'eq', 'Team')
        .order('created_at', { ascending: false })
      setPhotos(data || [])
      setLoading(false)
    }
    fetchPhotos()
  }, [])

  const filtered = active === 'All' ? photos : photos.filter(p => p.category === active)

  function openLightbox(photo) {
    const idx = filtered.findIndex(p => p.id === photo.id)
    setLbIndex(idx)
    setLightbox(photo)
  }

  function navLightbox(dir) {
    const newIdx = (lbIndex + dir + filtered.length) % filtered.length
    setLbIndex(newIdx)
    setLightbox(filtered[newIdx])
  }

  useEffect(() => {
    function handleKey(e) {
      if (!lightbox) return
      if (e.key === 'Escape')      setLightbox(null)
      if (e.key === 'ArrowRight')  navLightbox(1)
      if (e.key === 'ArrowLeft')   navLightbox(-1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, lbIndex, filtered])

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">Gallery</p>
          <h1>Life in <em>Samburu</em></h1>
          <p>Photographs from the field — moments of resilience, joy, and transformation captured across our programmes.</p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="section-inner">

          <div className="gallery-filters">
            {CATEGORIES.map(cat => (
              <button key={cat}
                className={`gallery-filter-btn${active === cat ? ' active' : ''}`}
                onClick={() => setActive(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{
                display:'inline-block', width:'38px', height:'38px',
                border:'2px solid var(--navy-border)', borderTopColor:'var(--gold)',
                borderRadius:'50%', animation:'spin 0.8s linear infinite',
              }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(20px,2.5vw,28px)', color:'var(--text-bright)', marginBottom:'10px', fontWeight:500 }}>
                No photos in this category yet.
              </p>
              <p style={{ fontSize:'14px', color:'var(--text-dim)' }}>Check back soon or choose a different category.</p>
            </div>
          ) : (
            <div className="masonry-grid">
              {filtered.map(photo => (
                <div key={photo.id} className="masonry-item" onClick={() => openLightbox(photo)}>
                  <img src={photo.url} alt={photo.title || ''} loading="lazy" />
                  <div className="masonry-overlay">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={e => e.target === e.currentTarget && setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lightbox-nav prev" onClick={() => navLightbox(-1)}>‹</button>
          <div style={{ textAlign:'center', maxWidth:'92vw' }}>
            <img src={lightbox.url} alt={lightbox.title || ''} className="lightbox-img" />
            {lightbox.title && (
              <p style={{ color:'rgba(238,244,255,0.55)', marginTop:'12px', fontSize:'13px' }}>{lightbox.title}</p>
            )}
            <p style={{ color:'var(--text-dim)', fontSize:'11px', marginTop:'5px' }}>
              {lbIndex + 1} / {filtered.length}
            </p>
          </div>
          <button className="lightbox-nav next" onClick={() => navLightbox(1)}>›</button>
        </div>
      )}
    </main>
  )
}
