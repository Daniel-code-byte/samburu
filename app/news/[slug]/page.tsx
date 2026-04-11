import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { getPostBySlug } from '@/lib/supabase'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} — Samburu Wellness & Resilience`,
    description: post.excerpt,
  }
}

export default async function NewsSlugPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{
        background: 'var(--teal-deep)',
        padding: post.cover_url ? '0' : '6rem 2rem 5rem',
        position: 'relative',
        minHeight: post.cover_url ? 420 : 'auto',
        overflow: 'hidden',
      }}>
        {post.cover_url && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,61,73,0.5), rgba(13,61,73,0.85))' }} />
          </>
        )}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '5rem 2rem', position: 'relative', zIndex: 1 }}>
          <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <ArrowLeft size={14} /> Back to News
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'var(--teal)', color: '#fff', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', fontWeight: 600 }}>
              {post.category}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} />
              {new Date(post.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400, color: '#fff', lineHeight: 1.1,
          }}>{post.title}</h1>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────── */}
      <section className="section-pad">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--body)', fontStyle: 'italic', marginBottom: '2rem', borderLeft: '3px solid var(--teal)', paddingLeft: '1.5rem' }}>
            {post.excerpt}
          </p>
          <div style={{
            fontSize: '0.97rem', lineHeight: 1.85,
            color: 'var(--body)',
            whiteSpace: 'pre-wrap',
          }}>
            {post.content}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/news" className="btn-outline" style={{ fontSize: '0.82rem' }}>
              <ArrowLeft size={14} /> All News
            </Link>
            <Link href="/contact" className="btn-primary" style={{ fontSize: '0.82rem' }}>
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
