import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Play } from 'lucide-react'
import { getPosts, getPostBySlug } from '@/lib/supabase'

// Force dynamic so individual event pages also update immediately
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Samburu Wellness Resilience`,
    description: post.excerpt,
    openGraph: post.cover_url ? { images: [post.cover_url] } : undefined,
  }
}

function isVideo(url: string | null) {
  if (!url) return false
  return /\.(mp4|mov|webm|ogg)(\?|$)/i.test(url)
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const paragraphs = post.content.split('\n').filter(Boolean)

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--teal-deep)', padding: 'clamp(3rem,8vw,5rem) 1.5rem clamp(2rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.15s' }}
            onMouseEnter={undefined} onMouseLeave={undefined}
          >
            <ArrowLeft size={13} /> Back to Events
          </Link>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>
            {post.category}
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} /> {new Date(post.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: 'clamp(2.5rem,6vw,5rem) 1.5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Cover media */}
          {post.cover_url && (
            <div style={{ marginBottom: '2.5rem', borderRadius: 2, overflow: 'hidden' }}>
              {isVideo(post.cover_url) ? (
                <video src={post.cover_url} controls style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover_url} alt={post.title} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }} />
              )}
            </div>
          )}

          {/* Excerpt */}
          <p style={{ fontSize: 'clamp(1rem,2.5vw,1.15rem)', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid var(--teal-pale)', paddingLeft: '1.25rem' }}>
            {post.excerpt}
          </p>

          {/* Body paragraphs */}
          <div style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--ink)' }}>
            {paragraphs.map((para, i) => (
              <p key={i} style={{ marginBottom: '1.25rem' }}>{para}</p>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/join" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--teal)', color: '#fff', padding: '0.65rem 1.4rem', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', transition: 'opacity 0.2s' }}>
              Get Involved
            </Link>
            <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              <ArrowLeft size={13} /> All Events
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
