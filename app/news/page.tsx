import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, MapPin, Play } from 'lucide-react'
import { getPosts } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Events — Samburu Wellness Resilience',
  description: 'Upcoming events, community activities, and mental health awareness campaigns across Samburu County.',
}

// Force dynamic rendering so new events always show immediately
export const dynamic = 'force-dynamic'
export const revalidate = 0

function isVideo(url: string | null) {
  if (!url) return false
  return /\.(mp4|mov|webm|ogg)(\?|$)/i.test(url)
}

export default async function EventsPage() {
  const allPosts = await getPosts()
  // Only show Events category
  const posts = allPosts.filter(p => p.category === 'Event')

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--teal-deep)', padding: 'clamp(3rem,8vw,6rem) 1.5rem clamp(2.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
            Events & Updates
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: '1.25rem' }}>
            Events &<br /><em>Community Updates</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.9rem,2.5vw,1.05rem)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Upcoming events, community activities, and mental health awareness campaigns across Samburu County.
          </p>
        </div>
      </section>

      {/* Events list */}
      <section style={{ padding: 'clamp(2.5rem,6vw,5rem) 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ background: 'var(--sand)', border: '1px solid var(--border)', padding: 'clamp(3rem,8vw,5rem) 2rem', textAlign: 'center' }}>
              <Calendar size={48} style={{ margin: '0 auto 1rem', color: 'var(--teal-pale)', opacity: 0.5 }} />
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem,4vw,1.8rem)', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                No events yet
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
                Events will appear here once added via the admin dashboard.
              </p>
            </div>
          ) : (
            <>
              {/* Featured first event */}
              <Link href={`/news/${posts[0].slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
                <div className="sw-card" style={{ display: 'grid', gridTemplateColumns: posts[0].cover_url ? '1fr 1fr' : '1fr', overflow: 'hidden', minHeight: 'clamp(240px,40vw,340px)' }}>
                  {posts[0].cover_url && (
                    <div style={{ position: 'relative', minHeight: 220, background: '#000', overflow: 'hidden' }}>
                      {isVideo(posts[0].cover_url) ? (
                        <div style={{ position: 'relative', height: '100%', minHeight: 240 }}>
                          <video src={posts[0].cover_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={22} color="var(--teal)" style={{ marginLeft: 3 }} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={posts[0].cover_url} alt={posts[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 240 }} />
                      )}
                    </div>
                  )}
                  <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ background: 'var(--teal-pale)', color: 'var(--teal)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: '1rem', alignSelf: 'flex-start' }}>
                      Featured Event
                    </span>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
                      {posts[0].title}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} /> {new Date(posts[0].published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>{posts[0].excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--teal)', fontSize: '0.85rem', fontWeight: 500 }}>
                      View details & participate <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Rest of events grid */}
              {posts.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,300px), 1fr))', gap: '1.25rem' }}>
                  {posts.slice(1).map((post) => (
                    <Link key={post.id} href={`/news/${post.slug}`} className="sw-card" style={{ textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
                      {post.cover_url && (
                        <div style={{ height: 190, position: 'relative', background: '#000', overflow: 'hidden' }}>
                          {isVideo(post.cover_url) ? (
                            <>
                              <video src={post.cover_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Play size={16} color="var(--teal)" style={{ marginLeft: 2 }} />
                                </div>
                              </div>
                            </>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.cover_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          )}
                        </div>
                      )}
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                          <span style={{ background: 'var(--teal-pale)', color: 'var(--teal)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.18rem 0.6rem', fontWeight: 600 }}>Event</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Calendar size={11} /> {new Date(post.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.1rem,2.5vw,1.25rem)', fontWeight: 600, lineHeight: 1.3, marginBottom: '0.5rem', color: 'var(--ink)' }}>
                          {post.title}
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.9rem' }}>{post.excerpt}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--teal)', fontSize: '0.8rem', fontWeight: 500 }}>
                          View & participate <ArrowRight size={12} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
