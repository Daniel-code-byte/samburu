import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Users, Leaf, Star, Phone, MapPin, ChevronDown } from 'lucide-react'
import HeroSlider from '@/components/HeroSlider'
import { getCommunityPhotos, getPosts } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Samburu Wellness Resilience — Rooted in Community',
  description: 'Samburu Wellness Resilience — promoting mental wellbeing in Samburu County through awareness, community engagement and support.',
}

const PILLARS = [
  {
    icon: Heart,
    label: 'Awareness & Education',
    desc: 'Raising mental health awareness within Samburu communities through culturally sensitive education and outreach.',
    color: 'var(--rust)',
    bg: '#c0533318',
    href: '/programs#health',
    num: '01',
  },
  {
    icon: Users,
    label: 'Stigma Reduction',
    desc: 'Reducing stigma and discrimination associated with mental illness through open community dialogue.',
    color: 'var(--teal)',
    bg: '#2a7c7c18',
    href: '/programs#women',
    num: '02',
  },
  {
    icon: Star,
    label: 'Community Support',
    desc: 'Identifying risk factors and promoting community-based support networks and appropriate referrals.',
    color: 'var(--gold)',
    bg: '#c9960018',
    href: '/programs#youth',
    num: '03',
  },
  {
    icon: Leaf,
    label: 'Suicide Prevention',
    desc: 'Supporting prevention efforts through awareness, peer support, and linkage to professional services.',
    color: 'var(--sage)',
    bg: '#5a7a5018',
    href: '/programs#community',
    num: '04',
  },
]

const STATS = [
  { num: '12+', label: 'Villages Reached' },
  { num: '2,400+', label: 'People Served' },
  { num: '8', label: 'Active Programs' },
  { num: '6 yrs', label: 'Community Impact' },
]

export default async function HomePage() {
  const [communityPhotos, allPosts] = await Promise.all([getCommunityPhotos(), getPosts()])
  const recentEvents = allPosts.filter(p => p.category === 'Event').slice(0, 3)

  return (
    <>
      <style>{`
        /* ── Responsive hero ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 88vh;
        }
        .hero-text {
          background: var(--teal-deep);
          padding: 5rem 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .hero-slider-wrap {
          position: relative;
          min-height: 500px;
        }

        /* ── Stats bar ── */
        .stats-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          text-align: center;
        }

        /* ── Pillars ── */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        /* ── Gallery ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .gallery-item-0 {
          aspect-ratio: 1/1;
          grid-row: span 2;
        }
        .gallery-item-other {
          aspect-ratio: 4/3;
        }

        /* ── Events ── */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* ── CTA buttons ── */
        .cta-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ── Pillar card hover ── */
        .pillar-card {
          padding: 2rem;
          text-decoration: none;
          display: block;
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          overflow: hidden;
        }
        .pillar-card::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .pillar-card:hover::before { transform: scaleX(1); }
        .pillar-card:hover { transform: translateY(-4px); }

        /* ── Scroll hint ── */
        .scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 4rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255,255,255,0.35);
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        /* ── Marquee banner ── */
        .marquee-wrap {
          overflow: hidden;
          background: var(--rust);
          padding: 0.6rem 0;
        }
        .marquee-inner {
          display: flex;
          gap: 3rem;
          white-space: nowrap;
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-item {
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }
        .marquee-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
        }

        /* ── Vision section ── */
        .vision-lines {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            60deg, transparent, transparent 40px,
            rgba(255,255,255,0.025) 40px, rgba(255,255,255,0.025) 41px
          );
        }

        /* ── "Get involved" band ── */
        .involve-band {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .hero-text {
            padding: 4rem 1.5rem 3rem;
            order: 1;
          }
          .hero-slider-wrap {
            min-height: 280px;
            order: 2;
          }
          .scroll-hint { display: none; }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .pillars-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          .gallery-item-0 {
            grid-row: span 1;
            aspect-ratio: 4/3;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }

          .involve-band {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        /* ── TABLET ── */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            min-height: 75vh;
          }
          .hero-text {
            padding: 4rem 2.5rem;
          }
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* ── Number label on pillar ── */
        .pillar-num {
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1;
          opacity: 0.06;
          color: var(--ink);
          pointer-events: none;
          user-select: none;
        }

        /* ── Quote decoration ── */
        .quote-deco {
          font-family: 'Cormorant Garamond', serif;
          font-size: 8rem;
          line-height: 0.5;
          color: rgba(255,255,255,0.08);
          display: block;
          margin-bottom: -1rem;
          user-select: none;
        }

        /* ── Location chip ── */
        .loc-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.3rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 1.75rem;
        }
      `}</style>

      {/* ── Marquee banner ─────────────────────────────── */}
      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee-inner">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="marquee-item">
              Mental Health Awareness <span className="marquee-dot" />
              Community Wellbeing <span className="marquee-dot" />
              Stigma-Free Samburu <span className="marquee-dot" />
              You Are Not Alone <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-grid">
        {/* Left: Text */}
        <div className="hero-text" style={{ position: 'relative' }}>
          <div className="fade-up fade-up-1 loc-chip">
            <MapPin size={11} /> Samburu County, Kenya
          </div>

          <h1 className="fade-up fade-up-2" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.05,
            marginBottom: '1.25rem',
          }}>
            Mental health<br />
            <em style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--gold)' }}>for every Samburu.</em>
          </h1>

          <div className="fade-up fade-up-2" style={{
            width: 48,
            height: 2,
            background: 'var(--rust)',
            marginBottom: '1.5rem',
          }} />

          <p className="fade-up fade-up-3" style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1rem',
            lineHeight: 1.8,
            maxWidth: 400,
            marginBottom: '2.5rem',
          }}>
            We promote mental wellbeing in Samburu County through awareness, community engagement, stigma reduction and linkage to support services.
          </p>

          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/programs" className="btn-rust" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              Our Programs <ArrowRight size={15} />
            </Link>
            <Link href="/about" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem',
              textDecoration: 'none',
              paddingBottom: '2px',
              borderBottom: '1px solid rgba(255,255,255,0.25)',
              transition: 'color 0.2s',
            }}>
              Our story →
            </Link>
          </div>

          <div className="scroll-hint">
            Scroll <ChevronDown size={14} />
          </div>
        </div>

        {/* Right: Slider */}
        <div className="hero-slider-wrap">
          <HeroSlider />
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section style={{ background: 'var(--teal)', padding: '2.5rem 1.5rem' }}>
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center',
              padding: '0.75rem',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
            }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 700,
                color: '#fff',
              }}>{s.num}</div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.08em',
                marginTop: '0.25rem',
                textTransform: 'uppercase',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Program pillars ──────────────────────────────── */}
      <section className="section-pad samburu-pattern" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', marginBottom: '3rem', gap: '1rem' }}>
            <div>
              <div className="eyebrow">What We Do</div>
              <div className="teal-rule" />
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, marginTop: '0.5rem' }}>
                Four pillars of<br /><em>mental health work</em>
              </h2>
            </div>
            <Link href="/programs" style={{
              fontSize: '0.8rem',
              color: 'var(--teal)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              All programs <ArrowRight size={13} />
            </Link>
          </div>

          <div className="pillars-grid">
            {PILLARS.map((p) => {
              const Icon = p.icon
              return (
                <Link key={p.label} href={p.href} className="sw-card pillar-card" style={{ color: p.color }}>
                  <div className="pillar-num">{p.num}</div>
                  <div style={{
                    width: 52, height: 52,
                    background: p.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem',
                    borderRadius: 2,
                  }}>
                    <Icon size={22} color={p.color} />
                  </div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.35rem', fontWeight: 600,
                    color: 'var(--ink)', marginBottom: '0.75rem',
                    lineHeight: 1.2,
                  }}>{p.label}</h3>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--body)' }}>{p.desc}</p>
                  <div style={{
                    marginTop: '1.5rem',
                    fontSize: '0.78rem',
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}>Learn more <ArrowRight size={12} /></div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Community gallery ──────────────────────────────── */}
      <section className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow">Gallery</div>
              <div className="teal-rule" />
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300 }}>
                Life in the<br /><em>Samburu community</em>
              </h2>
            </div>
            <Link href="/gallery" className="btn-outline">View all photos</Link>
          </div>

          {communityPhotos.length > 0 ? (
            <div className="gallery-grid">
              {communityPhotos.slice(0, 6).map((p, i) => (
                <div
                  key={p.id}
                  className={`img-zoom ${i === 0 ? 'gallery-item-0' : 'gallery-item-other'}`}
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--teal-pale)',
              padding: '5rem 2rem',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--teal-deep)', marginBottom: '0.5rem' }}>
                Photos coming soon
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--teal)', opacity: 0.8 }}>
                Community photos will appear here once uploaded.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Vision callout ──────────────────────────────── */}
      <section style={{
        background: 'var(--teal-deep)',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="vision-lines" />
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <span className="quote-deco">&ldquo;</span>
          <blockquote style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#fff',
            lineHeight: 1.3,
            marginBottom: '1.5rem',
          }}>
            A mentally healthy, informed and supportive community.
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            We promote mental wellbeing in Samburu County through awareness, community engagement, physical activity, stigma reduction and linkage to appropriate mental health support services.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" className="btn-outline-white">Read our story</Link>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '2px',
            }}>
              <Phone size={13} /> Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest events ────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow">Upcoming & Recent</div>
              <div className="teal-rule" />
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300 }}>Latest Events</h2>
            </div>
            <Link href="/news" className="btn-outline">All events</Link>
          </div>

          {recentEvents.length > 0 ? (
            <div className="events-grid">
              {recentEvents.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="sw-card" style={{ textDecoration: 'none', display: 'block' }}>
                  {post.cover_url && (
                    <div className="img-zoom" style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--rust)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {post.category}
                    </div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.6rem', lineHeight: 1.3, color: 'var(--ink)' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65 }}>{post.excerpt}</p>
                    <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Read more <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              padding: '4rem 2rem',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                Events coming soon
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>News and updates will appear here.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Get involved ─────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem' }}>
        <div className="involve-band">
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>
              Get Involved
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 300,
              color: '#fff',
              margin: 0,
              lineHeight: 1.15,
            }}>
              Be part of the <em style={{ color: 'var(--gold)' }}>change you want to see.</em>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Link href="/contact" className="btn-rust" style={{ whiteSpace: 'nowrap' }}>
              Reach Out <ArrowRight size={14} />
            </Link>
            <Link href="/programs" style={{
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              Explore Programs →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
