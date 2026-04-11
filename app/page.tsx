import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Users, Leaf, Star } from 'lucide-react'
import HeroSlider from '@/components/HeroSlider'
import { getCommunityPhotos, getPosts } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Samburu Wellness & Resilience',
  description: 'Promoting mental wellbeing in Samburu County through awareness, community engagement, stigma reduction and linkage to support services.',
}

const PILLARS = [
  { icon: Heart, label: 'Awareness & Education', desc: 'Raising mental health awareness through culturally sensitive education and community outreach.', color: 'var(--rust)', href: '/programs#health' },
  { icon: Users, label: 'Stigma Reduction', desc: 'Reducing stigma and discrimination through open community dialogue and education.', color: 'var(--teal)', href: '/programs#women' },
  { icon: Star, label: 'Community Support', desc: 'Promoting community-based support networks and appropriate referrals for those in need.', color: 'var(--gold)', href: '/programs#youth' },
  { icon: Leaf, label: 'Suicide Prevention', desc: 'Supporting prevention through awareness, peer support, and linkage to professional services.', color: 'var(--sage)', href: '/programs#community' },
]

const STATS = [
  { num: '12+', label: 'Villages Reached' },
  { num: '2,400+', label: 'People Served' },
  { num: '8', label: 'Active Programs' },
  { num: '6 yrs', label: 'Community Impact' },
]

export default async function HomePage() {
  const [communityPhotos, posts] = await Promise.all([getCommunityPhotos(), getPosts()])
  const recentPosts = posts.slice(0, 3)

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        {/* Background slider */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <HeroSlider />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,61,73,0.88) 45%, rgba(13,61,73,0.3))' }} />
        </div>

        {/* Text */}
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '5rem 2rem', width: '100%' }}>
          <div className="fade-up fade-up-1" style={{
            fontSize: '0.67rem', letterSpacing: '0.26em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
            marginBottom: '1.25rem',
          }}>
            Samburu County, Kenya
          </div>
          <h1 className="fade-up fade-up-2" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.6rem, 5vw, 4rem)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.08,
            marginBottom: '1.25rem',
            maxWidth: 560,
          }}>
            Mental health<br /><em>for every Samburu.</em>
          </h1>
          <p className="fade-up fade-up-3" style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: '1rem',
            lineHeight: 1.7,
            maxWidth: 420,
            marginBottom: '2.25rem',
          }}>
            We promote mental wellbeing through awareness, community engagement, stigma reduction and linkage to support services.
          </p>
          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/programs" className="btn-rust">
              Our Programs <ArrowRight size={14} />
            </Link>
            <Link href="/about" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem',
              textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)',
              paddingBottom: '2px',
            }}>
              About us →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: 'var(--teal)', padding: '2.25rem 2rem' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: '1rem',
        }} className="stats-grid">
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{s.num}</div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.05em', marginTop: '0.15rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Program pillars ── */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div className="eyebrow">What We Do</div>
            <div className="teal-rule" />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300 }}>
              Four pillars of <em>mental health work</em>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}>
            {PILLARS.map((p) => {
              const Icon = p.icon
              return (
                <Link key={p.label} href={p.href} className="sw-card" style={{ padding: '1.75rem', textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    width: 44, height: 44,
                    background: p.color + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem',
                  }}>
                    <Icon size={20} color={p.color} />
                  </div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.2rem', fontWeight: 600,
                    color: 'var(--ink)', marginBottom: '0.6rem',
                  }}>{p.label}</h3>
                  <p style={{ fontSize: '0.86rem', lineHeight: 1.65, color: 'var(--body)' }}>{p.desc}</p>
                  <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: p.color, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                    Learn more <ArrowRight size={12} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Gallery preview ── */}
      {communityPhotos.length > 0 && (
        <section className="section-pad">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="eyebrow">Gallery</div>
                <div className="teal-rule" />
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 300 }}>
                  Life in the <em>Samburu community</em>
                </h2>
              </div>
              <Link href="/gallery" className="btn-outline">View all photos</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {communityPhotos.slice(0, 6).map((p, i) => (
                <div key={p.id} className="img-zoom" style={{
                  aspectRatio: i === 0 ? '1/1' : '4/3',
                  gridRow: i === 0 ? 'span 2' : undefined,
                  position: 'relative',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Vision callout ── */}
      <section style={{ background: 'var(--teal-deep)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.67rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>Our Vision</div>
          <blockquote style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: '#fff', lineHeight: 1.35,
            marginBottom: '1.5rem',
          }}>
            &ldquo;A mentally healthy, informed and supportive community.&rdquo;
          </blockquote>
          <Link href="/about" className="btn-outline-white">Read our story</Link>
        </div>
      </section>

      {/* ── Latest news ── */}
      {recentPosts.length > 0 && (
        <section className="section-pad" style={{ background: 'var(--sand)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="eyebrow">Latest</div>
                <div className="teal-rule" />
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 300 }}>News & Updates</h2>
              </div>
              <Link href="/news" className="btn-outline">All news</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="sw-card" style={{ textDecoration: 'none', display: 'block' }}>
                  {post.cover_url && (
                    <div className="img-zoom" style={{ height: 190, position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--teal)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      {post.category}
                    </div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6 }}>{post.excerpt}</p>
                    <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Read more <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section-pad">
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow">Get Involved</div>
          <div className="teal-rule" style={{ margin: '0.75rem auto 0' }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 300, margin: '0.5rem 0 1rem' }}>
            Be part of the <em>change</em>
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            Through volunteering, donating, or sharing our work — every act of support helps us reach more Samburu families.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary">Reach Out to Us</Link>
            <Link href="/programs" className="btn-outline">Explore Programs</Link>
          </div>
        </div>
      </section>
    </>
  )
}
