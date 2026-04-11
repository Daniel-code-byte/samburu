import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { getPosts } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'News — Samburu Mental Health Association',
  description: 'Updates, stories, and insights from the Samburu Mental Health Association community.',
}

export default async function NewsPage() {
  const posts = await getPosts()

  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <section style={{ background: 'var(--teal-deep)', padding: '6rem 2rem 5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Stories & Updates</div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 5vw, 4rem)',
            fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem',
          }}>
            News from the<br /><em>ground</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Read about program updates, community milestones, and stories of resilience from across Samburu.
          </p>
        </div>
      </section>

      {/* ── Posts ───────────────────────────────────────── */}
      <section className="section-pad">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{
              background: 'var(--sand)',
              border: '2px dashed var(--border-md)',
              padding: '6rem 2rem',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                Stories coming soon
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
                News and updates will appear here. Posts can be added via the admin dashboard.
              </p>
            </div>
          ) : (
            <>
              {/* Featured first post */}
              {posts[0] && (
                <Link href={`/news/${posts[0].slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '3rem' }}>
                  <div className="sw-card" style={{
                    display: 'grid',
                    gridTemplateColumns: posts[0].cover_url ? '1.2fr 1fr' : '1fr',
                    overflow: 'hidden',
                    minHeight: 340,
                  }}>
                    {posts[0].cover_url && (
                      <div className="img-zoom" style={{ position: 'relative', minHeight: 340 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={posts[0].cover_url} alt={posts[0].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{
                          background: 'var(--teal-pale)', color: 'var(--teal)',
                          fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                          padding: '0.25rem 0.75rem', fontWeight: 600,
                        }}>{posts[0].category}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} />
                          {new Date(posts[0].published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem' }}>
                        {posts[0].title}
                      </h2>
                      <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{posts[0].excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--teal)', fontSize: '0.85rem', fontWeight: 500 }}>
                        Read full story <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest of posts */}
              {posts.length > 1 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem',
                }}>
                  {posts.slice(1).map((post) => (
                    <Link key={post.id} href={`/news/${post.slug}`} className="sw-card" style={{ textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
                      {post.cover_url && (
                        <div className="img-zoom" style={{ height: 200, position: 'relative' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{
                            background: 'var(--teal-pale)', color: 'var(--teal)',
                            fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                            padding: '0.2rem 0.65rem', fontWeight: 600,
                          }}>{post.category}</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Calendar size={11} />
                            {new Date(post.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.3, marginBottom: '0.65rem', color: 'var(--ink)' }}>
                          {post.title}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>{post.excerpt}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--teal)', fontSize: '0.8rem', fontWeight: 500 }}>
                          Read more <ArrowRight size={12} />
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
