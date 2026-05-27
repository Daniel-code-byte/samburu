'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const programs = [
  {
    tag: 'Programme 01', title: 'Community Health', icon: '🏥', category: 'Health',
    paras: [
      'Access to quality healthcare is not a privilege — it is a right. In Samburu County, geography and poverty have long made this right difficult to realise. Our health programme works to close that gap.',
      'From mobile health clinics to maternal care, from disease prevention to mental health first aid, we meet communities where they are — in their villages, in their homes, on their terms.',
    ],
    bullets: [
      'Mobile health clinics reaching 18 villages monthly',
      'Maternal and child health care for 600+ families',
      'Community health worker training programme',
      'HIV/AIDS awareness and support services',
      'Mental health first aid in 12 schools',
    ],
  },
  {
    tag: 'Programme 02', title: 'Women Empowerment', icon: '👩🏾', category: 'Women',
    paras: [
      'In Samburu, women are the backbone of family and community life. Yet they are too often last in line for resources, rights, and recognition.',
      'We work across economic independence, legal rights, health, and leadership — because true empowerment is not one-dimensional.',
    ],
    bullets: [
      'Business and financial literacy training for 400+ women',
      'Micro-finance and cooperative savings groups',
      'Legal rights and GBV prevention education',
      "Girls' school retention and scholarship support",
      "Women's leadership mentorship circles",
    ],
  },
  {
    tag: 'Programme 03', title: 'Youth Resilience', icon: '🌱', category: 'Youth',
    paras: [
      'Young people in Samburu face a unique set of pressures: a rapidly changing economy, the effects of climate disruption, and the challenge of holding tradition and modernity together.',
      'Our youth resilience programme builds the inner and outer resources young people need to not just survive — but to lead.',
    ],
    bullets: [
      'Annual youth leadership camp for 200+ participants',
      'Vocational skills training in 8 trades',
      'Mental health support and peer counselling',
      'Sports, arts, and cultural identity programmes',
      'Youth community service and civic engagement',
    ],
  },
  {
    tag: 'Programme 04', title: 'Community Care', icon: '🤝', category: 'Community',
    paras: [
      'Some community members need extra support — elders without family networks, people living with disabilities, families facing acute food insecurity, communities hit by climate shocks.',
      'Our community care programme is the safety net that catches those who fall through the cracks — with dignity, speed, and genuine love.',
    ],
    bullets: [
      'Food security and nutrition support for 800+ households',
      'Elder care and home visits for isolated seniors',
      'Disability inclusion and assistive support',
      'Emergency response and drought relief',
      'Community kitchen and nutrition education',
    ],
  },
]

export default function OurWorkPage() {
  const [photoMap, setPhotoMap] = useState({})
  const [allPhotos, setAllPhotos] = useState([])

  useEffect(() => {
    async function fetchPhotos() {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .not('category', 'eq', 'Team')
        .order('created_at', { ascending: false })
        .limit(40)

      if (!data || data.length === 0) return
      setAllPhotos(data)

      const map = {}
      for (const prog of programs) {
        const matching = data.filter(p => p.category === prog.category)
        const pool = matching.length > 0 ? matching : data
        const shuffled = [...pool].sort(() => Math.random() - 0.5)
        map[prog.title] = shuffled.slice(0, 2).map(p => p.url)
      }
      setPhotoMap(map)
    }
    fetchPhotos()
  }, [])

  function randPhoto(exclude = []) {
    if (allPhotos.length === 0) return null
    const pool = allPhotos.filter(p => !exclude.includes(p.url))
    if (pool.length === 0) return allPhotos[Math.floor(Math.random() * allPhotos.length)].url
    return pool[Math.floor(Math.random() * pool.length)].url
  }

  const usedUrls = Object.values(photoMap).flat()

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">Our Work</p>
          <h1>Four Programmes,<br /><em>One Community</em></h1>
          <p>Each programme is rooted in local knowledge, shaped by community voices, and designed for lasting impact — not short-term optics.</p>
        </div>
      </div>

      {programs.map((prog, i) => {
        const imgs = photoMap[prog.title] || []
        const mainImg = imgs[0] || null
        const secondImg = imgs[1] || randPhoto(usedUrls)

        return (
          <section key={prog.tag} className="program-section">
            <div className={`program-layout${i % 2 !== 0 ? ' flip' : ''}`}>

              {/* IMAGE COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mainImg ? (
                  <>
                    <div className="program-img" style={{ flex: secondImg ? '0 0 60%' : '1' }}>
                      <img src={mainImg} alt={prog.title} />
                    </div>
                    {secondImg && (
                      <div className="program-img" style={{ flex: '0 0 38%' }}>
                        <img src={secondImg} alt={`${prog.title} 2`} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="program-img" style={{
                    minHeight: '320px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--navy-panel)',
                  }}>
                    <span style={{ fontSize: '64px', opacity: 0.2 }}>{prog.icon}</span>
                  </div>
                )}
              </div>

              {/* TEXT COLUMN */}
              <div className="program-text">
                <span className="tag">{prog.tag} · {prog.icon}</span>
                <h2>{prog.title}</h2>
                {prog.paras.map((p, j) => <p key={j}>{p}</p>)}
                <ul>{prog.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              </div>
            </div>

            {/* SCATTER STRIP between sections */}
            {i < programs.length - 1 && allPhotos.length > 2 && (() => {
              const strip = [...allPhotos]
                .filter(p => !imgs.includes(p.url))
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
              if (strip.length < 2) return null
              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: strip.length === 3 ? '2fr 1fr 1fr' : '1fr 1fr',
                  gap: '4px',
                  marginTop: '4px',
                }}>
                  {strip.map((p, idx) => (
                    <div key={p.id} style={{
                      aspectRatio: idx === 0 && strip.length === 3 ? '16/7' : '4/3',
                      overflow: 'hidden',
                    }}>
                      <img src={p.url} alt="" style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        filter: 'brightness(0.7) saturate(0.8)',
                      }} />
                    </div>
                  ))}
                </div>
              )
            })()}
          </section>
        )
      })}

      <div className="stats-bar">
        <div className="stats-grid">
          {[['12,000+','Lives Touched'],['4','Core Programmes'],['38','Villages Reached'],['6+','Years of Service']].map(([n,l]) => (
            <div key={n}>
              <div className="stat-number">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="partner-cta">
        <h2>Support a Programme<br /><em>You Believe In</em></h2>
        <p>Choose a programme to sponsor or make a general contribution to help us go further.</p>
        <div className="cta-btns">
          <a href="/donate" className="btn-amber">Donate Now</a>
          <a href="/partner" className="btn-outline">Become a Partner</a>
        </div>
      </section>
    </main>
  )
}
