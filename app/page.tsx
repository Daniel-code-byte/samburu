import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Users, Leaf, Shield, Star } from 'lucide-react'
import HeroSlider from '@/components/HeroSlider'
import { getCommunityPhotos, getPosts } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Samburu Wellness Resilience — Rooted in Community',
  description: 'Samburu Wellness Resilience — promoting mental wellbeing in Samburu County through awareness, community engagement and support.',
}

const PILLARS = [
  { icon: Heart, label: 'Awareness & Education', desc: 'Raising mental health awareness within Samburu communities through culturally sensitive education and outreach.', color: 'var(--rust)', href: '/programs#health' },
  { icon: Users, label: 'Stigma Reduction', desc: 'Reducing stigma and discrimination associated with mental illness through open community dialogue.', color: 'var(--teal)', href: '/programs#women' },
  { icon: Star, label: 'Community Support', desc: 'Identifying risk factors and promoting community-based support networks and appropriate referrals.', color: 'var(--gold)', href: '/programs#youth' },
  { icon: Leaf, label: 'Suicide Prevention', desc: 'Supporting prevention efforts through awareness, peer support, and linkage to professional services.', color: 'var(--sage)', href: '/programs#community' },
]

const STATS = [
  { num: '12+', label: 'Villages Reached' },
  { num: '2,400+', label: 'People Served' },
  { num: '8', label: 'Active Programs' },
  { num: '6 yrs', label: 'Community Impact' },
]

export default async function HomePage() {
  const [communityPhotos, allPosts] = await Promise.all([getCommunityPhotos(), getPosts()])
  const recentEvents = allPosts.filter(p => p.category === "Event").slice(0, 3)
  const recentPosts = allPosts.filter(p => p.category !== "Event").slice(0, 3)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '88vh',
      }}>
        {/* Left: Text */}
        <div style={{
          background: 'var(--teal-deep)',
          padding: '5rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div className="fade-up fade-up-1" style={{
            fontSize: '0.68rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
            marginBottom: '1.5rem',
          }}>
            Samburu County, Kenya
          </div>
          <h1 className="fade-up fade-up-2" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
          }}>
            Mental health<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400 }}>for every Samburu.</em>
          </h1>
          <p className="fade-up fade-up-3" style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            maxWidth: 420,
            marginBottom: '2.5rem',
          }}>
            We promote mental wellbeing in Samburu County through awareness, community engagement, stigma reduction and linkage to support services.
          </p>
          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/programs" className="btn-rust">
              Our Programs <ArrowRight size={15} />
            </Link>
            <Link href="/about" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem',
              textDecoration: 'none', paddingBottom: '2px',
              borderBottom: '1px solid rgba(255,255,255,0.3)',
            }}>
              About us →
            </Link>
          </div>
        </div>

        {/* Right: Slider */}
        <div style={{ position: 'relative', minHeight: 500 }}>
          <HeroSlider />
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section style={{ background: 'var(--teal)', padding: '2.5rem 2rem' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '2.2rem', fontWeight: 700,
                color: '#fff',
              }}>{s.num}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Program pillars ──────────────────────────────── */}
      <section className="section-pad samburu-pattern" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="eyebrow">What We Do</div>
            <div className="teal-rule" style={{ margin: '0.75rem auto 0' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 300, marginTop: '0.5rem' }}>
              Four pillars of<br /><em>mental health work</em>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {PILLARS.map((p) => {
              const Icon = p.icon
              return (
                <Link key={p.label} href={p.href} className="sw-card" style={{
                  padding: '2rem',
                  textDecoration: 'none',
                  display: 'block',
                }}>
                  <div style={{
                    width: 48, height: 48,
                    background: p.color + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <Icon size={22} color={p.color} />
                  </div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.3rem', fontWeight: 600,
                    color: 'var(--ink)', marginBottom: '0.75rem',
                  }}>{p.label}</h3>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--body)' }}>{p.desc}</p>
                  <div style={{
                    marginTop: '1.25rem',
                    fontSize: '0.8rem', color: p.color,
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontWeight: 500,
                  }}>Learn more <ArrowRight size={13} /></div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Community in photos ──────────────────────────── */}
      <section className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {communityPhotos.slice(0, 6).map((p, i) => (
                <div key={p.id} className="img-zoom" style={{
                  aspectRatio: i === 0 ? '1/1' : '4/3',
                  gridRow: i === 0 ? 'span 2' : undefined,
                  position: 'relative',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--teal-pale)',
              borderRadius: 4,
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

      {/* ── Mission callout ──────────────────────────────── */}
      <section style={{
        background: 'var(--teal-deep)',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)',
        }} />
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
            Our Vision
          </div>
          <blockquote style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#fff',
            lineHeight: 1.3,
            marginBottom: '1rem',
          }}>
            &ldquo;A mentally healthy, informed and supportive community.&rdquo;
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 600, margin: '0 auto 2rem' }}>
            We promote mental wellbeing in Samburu County through awareness, community engagement, physical activity, stigma reduction and linkage to appropriate mental health support services.
          </p>
          <Link href="/about" className="btn-outline-white">
            Read our story
          </Link>
        </div>
      </section>

      {/* ── Latest news ──────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow">Upcoming & Recent</div>
              <div className="teal-rule" />
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300 }}>Latest Events</h2>
            </div>
            <Link href="/news" className="btn-outline">All events</Link>
          </div>

          {recentEvents.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {recentEvents.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="sw-card" style={{ textDecoration: 'none', display: 'block' }}>
                  {post.cover_url && (
                    <div className="img-zoom" style={{ height: 200, position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {post.category}
                    </div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.6rem', lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>{post.excerpt}</p>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
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
                Stories coming soon
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
                News and updates will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="section-pad">
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow">Get Involved</div>
          <div className="teal-rule" style={{ margin: '0.75rem auto 0' }} />
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 300, margin: '0.5rem 0 1.25rem' }}>
            Be part of the<br /><em>change you want to see</em>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Whether through volunteering, donating, or sharing our work — every act of support helps us reach more Samburu people who need mental health care.
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
