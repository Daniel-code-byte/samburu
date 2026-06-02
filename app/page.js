'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [slides, setSlides] = useState([])
  const [news, setNews] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const { data: photos } = await supabase
        .from('photos')
        .select('*')
        .not('category', 'eq', 'Team')
        .order('created_at', { ascending: false })
        .limit(5)
      if (photos && photos.length > 0) {
        setSlides(photos.map(p => ({ url: p.url, caption: p.caption || '' })))
      }
      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3)
      if (posts && posts.length > 0) setNews(posts)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [slides.length])

  const stats = [
    { n: '12,000+', l: 'Lives Touched' },
    { n: '4',       l: 'Active Programmes' },
    { n: '38',      l: 'Villages Reached' },
    { n: '6+',      l: 'Years of Service' },
  ]

  return (
    <main>

      {/* ── HERO ── */}
      <section className="hero">
        {slides.length > 0 ? slides.map((slide, i) => (
          <div key={i} className={`hero-slide${i === current ? ' active' : ''}`}>
            <img src={slide.url} alt="" />
          </div>
        )) : (
          <div className="hero-slide active" style={{ background: 'var(--navy-mid)' }} />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Samburu County, Kenya</p>
          <h1 className="hero-title">
            Rooted in <em>Community,</em><br />
            Driven by Compassion
          </h1>
          <p className="hero-caption">
            Transforming lives across Samburu County — through health, economic empowerment, and community care.
          </p>
          <div className="hero-ctas">
            <a href="/our-work" className="btn-amber">Discover Our Work</a>
            <a href="/partner" className="btn-outline">Partner With Us</a>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button key={i} className={`hero-dot${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)} />
            ))}
          </div>
        )}
      </section>

      {/* ── STATS ── */}
      <section className="stats-bar">
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.n}>
              <div className="stat-number">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO WE ARE INTRO ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="section-inner">
          <div style={{ maxWidth: '760px' }}>
            <p className="section-eyebrow">Who We Are</p>
            <h2 className="section-title">A Community That Knows<br /><em>Its Own Story</em></h2>
            <p style={{ fontSize: 'clamp(15px,1.5vw,19px)', color: 'var(--text-mid)', lineHeight: 1.85, marginBottom: '20px', fontWeight: 300 }}>
              Samburu Wellness &amp; Resilience was founded by people from Samburu — not outsiders arriving with answers, but neighbours, relatives, and community members who grew up knowing the weight of walking miles for water, the grief of preventable loss, and the quiet resilience of their people.
            </p>
            <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'var(--text-dim)', lineHeight: 1.85, marginBottom: '32px' }}>
              In 2018, a small group sat together and asked one question: <em style={{ color: 'var(--text-mid)' }}>what would it take for our communities to truly thrive?</em> Everything we do flows from that conversation.
            </p>
            <a href="/who-we-are" className="btn-outline">Meet Our Team →</a>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="pull-quote-section">
        <div className="pull-quote">
          <blockquote>
            Every community has the seeds of its own strength.<br />Our work is simply to water them.
          </blockquote>
          <cite>— Founders, Samburu Wellness &amp; Resilience</cite>
        </div>
      </section>

      {/* ── 4 PROGRAMMES ── */}
      <section className="section" style={{ background: 'var(--navy-card)' }}>
        <div className="section-inner">
          <p className="section-eyebrow">What We Do</p>
          <h2 className="section-title">Four Pillars of<br /><em>Community Transformation</em></h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'clamp(14px,2vw,22px)', marginTop: 'clamp(28px,4vw,48px)' }}>
            {[
              { n:'01', icon:'🏥', title:'Community Health',    desc:'Mobile clinics, maternal care, and disease prevention meeting communities where they live — in their villages, on their terms.' },
              { n:'02', icon:'👩🏾', title:'Women Empowerment',  desc:'Economic independence, legal rights education, and leadership development for women and girls across every stage of life.' },
              { n:'03', icon:'🌱', title:'Youth Resilience',    desc:'Mentorship, skills training, and mental health support for young people navigating the pressures of a rapidly changing world.' },
              { n:'04', icon:'🤝', title:'Community Care',      desc:'Food security, elder care, disability support, and emergency response — the safety net every community deserves.' },
            ].map(p => (
              <div key={p.n} className="program-card">
                <div className="program-number">{p.n}</div>
                <div className="program-content">
                  <div className="program-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(28px,4vw,48px)' }}>
            <a href="/our-work" className="btn-brown">Explore All Programmes</a>
          </div>
        </div>
      </section>

      {/* ── STORY SECTION ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="section-inner" style={{ maxWidth: '900px' }}>
          <p className="section-eyebrow">The Context</p>
          <h2 className="section-title">Samburu County:<br /><em>Beautiful, Resilient, Underserved</em></h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'var(--text-mid)', lineHeight: 1.85, marginBottom: '18px' }}>
                Samburu County sits in northern Kenya — a land of dramatic landscapes, proud pastoralist heritage, and extraordinary people. It is also one of Kenya's most marginalised counties, with some of the country's lowest rates of access to healthcare, education, and economic opportunity.
              </p>
              <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'var(--text-mid)', lineHeight: 1.85 }}>
                This is not a story of helplessness. The communities of Samburu have survived drought, conflict, and decades of neglect — and they have done so through extraordinary solidarity and ingenuity. Our role is simply to stand with them.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'var(--text-mid)', lineHeight: 1.85, marginBottom: '18px' }}>
                We work across four interconnected areas because poverty is never one-dimensional. A child who is hungry cannot learn. A woman without economic independence cannot protect herself or her children. A young person without hope becomes a community's deepest wound.
              </p>
              <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'var(--text-mid)', lineHeight: 1.85 }}>
                When we address all of these together — health, women's empowerment, youth resilience, and community care — transformation becomes not just possible, but inevitable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECOND QUOTE ── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--steel), var(--navy-light))',
        borderTop: '1px solid var(--navy-border)',
        borderBottom: '1px solid var(--navy-border)',
        padding: 'clamp(48px,7vw,90px) clamp(18px,7vw,120px)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(22px,3.5vw,42px)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--text-bright)',
            lineHeight: 1.45,
            marginBottom: '24px',
          }}>
            "A community that is fed, healthy, and educated is not a burden to anyone. It is the foundation of everything."
          </p>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            — Community Elder, Wamba Division
          </p>
        </div>
      </section>

      {/* ── IMPACT SNAPSHOT ── */}
      <section className="section" style={{ background: 'var(--navy-card)' }}>
        <div className="section-inner" style={{ maxWidth: '900px' }}>
          <p className="section-eyebrow">Impact in Numbers</p>
          <h2 className="section-title">Six Years of <em>Showing Up</em></h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: 'clamp(24px,3vw,40px)' }}>
            {[
              { n: '12,000+', l: 'people reached across all programmes' },
              { n: '38',      l: 'villages with active programme presence' },
              { n: '600+',    l: 'families in maternal health support' },
              { n: '400+',    l: 'women trained in business & finance' },
              { n: '200+',    l: 'youth in annual leadership camp' },
              { n: '800+',    l: 'households supported with food security' },
            ].map(item => (
              <div key={item.n} style={{
                background: 'var(--navy)',
                border: '1px solid var(--navy-border)',
                borderRadius: '10px',
                padding: 'clamp(18px,2.5vw,28px)',
                borderTop: '2px solid var(--gold)',
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(28px,3.5vw,44px)',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  lineHeight: 1,
                  marginBottom: '10px',
                }}>{item.n}</div>
                <div style={{ fontSize: 'clamp(12px,1.1vw,14px)', color: 'var(--text-mid)', lineHeight: 1.55 }}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS / STORIES ── */}
      {news.length > 0 && (
        <section className="section" style={{ background: 'var(--navy)' }}>
          <div className="section-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
              <div>
                <p className="section-eyebrow">Stories &amp; Updates</p>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Latest from <em>the Field</em></h2>
              </div>
              <a href="/news" className="btn-outline">All Stories →</a>
            </div>
            <div className="news-grid">
              {news.map(post => (
                <a key={post.id} href={`/news/${post.slug || post.id}`} className="news-card" style={{ display: 'block' }}>
                  {(post.image_url || post.cover_image) && (
                    <div className="news-card-img">
                      <img src={post.image_url || post.cover_image} alt={post.title} />
                    </div>
                  )}
                  <div className="news-card-body">
                    <div className="news-tag">{post.category || 'Community'}</div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt || (post.content ? post.content.slice(0, 100) + '…' : '')}</p>
                    <div className="news-card-date">
                      {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="partner-cta">
        <h2>Be Part of<br /><em>the Story</em></h2>
        <p>
          Your partnership — financial, professional, or in-kind — directly changes lives in Samburu County.
          No contribution is too small. No connection is too indirect.
        </p>
        <div className="cta-btns">
          <a href="/partner" className="btn-amber">Partner With Us</a>
          <a href="/donate" className="btn-outline">Donate Now</a>
          <a href="/join" className="btn-outline">Join Our Team</a>
        </div>
      </section>

    </main>
  )
}
