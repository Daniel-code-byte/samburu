import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, Lock, Globe, DollarSign } from 'lucide-react'
import { getPostBySlug } from '@/lib/supabase'
import EventRegisterButton from '@/components/EventRegisterButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return { title: `${post.title} — Samburu Wellness Resilience`, description: post.excerpt }
}

const TYPE_INFO: Record<string, { label: string; color: string; icon: any; desc: string }> = {
  public:            { label: 'Open to All',     color: '#2A9D5C', icon: Globe, desc: 'This is a public event — everyone is welcome, no registration needed.' },
  free_registration: { label: 'Free — Register', color: '#1A7A8A', icon: Users, desc: 'Free event — register to secure your spot.' },
  paid:              { label: 'Paid Event',       color: '#C0472A', icon: Lock,  desc: 'Registration required. Payment via M-Pesa.' },
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const typeInfo = post.event_type ? TYPE_INFO[post.event_type] : null
  const TypeIcon = typeInfo?.icon
  const paragraphs = post.content.split('\n').filter(Boolean)

  return (
    <>
      <section style={{ background: 'var(--teal-deep)', padding: 'clamp(3rem,8vw,5rem) 1.5rem clamp(2rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <ArrowLeft size={13} /> All Events
          </Link>
          {typeInfo && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: typeInfo.color, color: '#fff', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.3rem 0.85rem', marginBottom: '1rem' }}>
              {TypeIcon && <TypeIcon size={12} />} {typeInfo.label}
            </div>
          )}
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,5vw,3.4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '1.25rem' }}>{post.title}</h1>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {post.event_date && <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13} />{new Date(post.event_date).toLocaleDateString('en-KE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>}
            {post.event_location && <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} />{post.event_location}</span>}
            {post.event_type === 'paid' && post.event_price && <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><DollarSign size={13} />KES {post.event_price.toLocaleString()}</span>}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(2.5rem,6vw,5rem) 1.5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {post.cover_url && (
            <div style={{ marginBottom: '2.5rem', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt={post.title} style={{ width: '100%', maxHeight: 460, objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* Event type info bar */}
          {typeInfo && (
            <div style={{ background: typeInfo.color + '12', border: `1px solid ${typeInfo.color}30`, padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: typeInfo.color }}>
              {TypeIcon && <TypeIcon size={16} style={{ flexShrink: 0 }} />}
              <span>{typeInfo.desc}</span>
            </div>
          )}

          <p style={{ fontSize: 'clamp(1rem,2.5vw,1.1rem)', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid var(--teal-pale)', paddingLeft: '1.25rem' }}>{post.excerpt}</p>

          <div style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--ink)' }}>
            {paragraphs.map((p, i) => <p key={i} style={{ marginBottom: '1.25rem' }}>{p}</p>)}
          </div>

          {/* Event details card */}
          {(post.event_date || post.event_location || post.event_capacity || post.event_price) && (
            <div style={{ background: 'var(--sand)', border: '1px solid var(--border)', padding: '1.5rem', margin: '2.5rem 0' }}>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Event Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem' }}>
                {post.event_date && (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Date &amp; Time</div>
                    <div style={{ fontWeight: 500, fontSize: '0.92rem' }}>{new Date(post.event_date).toLocaleDateString('en-KE',{weekday:'short',day:'numeric',month:'long',year:'numeric'})}</div>
                  </div>
                )}
                {post.event_location && (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Location</div>
                    <div style={{ fontWeight: 500, fontSize: '0.92rem' }}>{post.event_location}</div>
                  </div>
                )}
                {post.event_capacity && (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Capacity</div>
                    <div style={{ fontWeight: 500, fontSize: '0.92rem' }}>{post.event_capacity} people</div>
                  </div>
                )}
                {post.event_type === 'paid' && post.event_price && (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Entry Fee</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--rust)' }}>KES {post.event_price.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA — only show register button if NOT public */}
          {post.event_type && post.event_type !== 'public' && (
            <EventRegisterButton event={post} />
          )}

          {post.event_type === 'public' && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#2A9D5C12', border: '1px solid #2A9D5C30', display: 'flex', alignItems: 'center', gap: 10, color: '#2A9D5C', fontSize: '0.9rem' }}>
              <Globe size={18} style={{ flexShrink: 0 }} />
              This is a public event — everyone is welcome. Just show up!
            </div>
          )}

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              <ArrowLeft size={13} /> Back to all events
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
