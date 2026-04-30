import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, Lock, Globe } from 'lucide-react'
import { getPosts } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Events — Samburu Wellness Resilience',
  description: 'Upcoming events and community activities across Samburu County.',
}
export const dynamic = 'force-dynamic'
export const revalidate = 0

const TYPE_LABEL: Record<string, { label: string; color: string; icon: any }> = {
  public:           { label: 'Open to All',    color: '#2A9D5C', icon: Globe },
  free_registration:{ label: 'Free — Register',color: '#1A7A8A', icon: Users },
  paid:             { label: 'Paid Event',      color: '#C0472A', icon: Lock  },
}

export default async function EventsPage() {
  const all = await getPosts()
  const events = all.filter(p => p.category === 'Event')

  return (
    <>
      <section style={{ background: 'var(--teal-deep)', padding: 'clamp(3rem,8vw,6rem) 1.5rem clamp(2.5rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Community Events</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem,6vw,3.8rem)', fontWeight: 300, color: '#fff', lineHeight: 1.08, marginBottom: '1rem' }}>
            Events &amp; <em>Activities</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.9rem,2.5vw,1.05rem)', lineHeight: 1.75 }}>
            Upcoming events, community activities and mental health campaigns across Samburu County.
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(2.5rem,6vw,5rem) 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--muted)' }}>
              <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem' }}>No events yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,320px),1fr))', gap: '1.5rem' }}>
              {events.map(ev => {
                const typeInfo = ev.event_type ? TYPE_LABEL[ev.event_type] : null
                const TypeIcon = typeInfo?.icon
                return (
                  <Link key={ev.id} href={`/news/${ev.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="sw-card">
                    {ev.cover_url && (
                      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ev.cover_url} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {typeInfo && (
                          <div style={{ position: 'absolute', top: 12, right: 12, background: typeInfo.color, color: '#fff', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 0.7rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                            {TypeIcon && <TypeIcon size={11} />} {typeInfo.label}
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{ padding: '1.25rem' }}>
                      {!ev.cover_url && typeInfo && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: typeInfo.color + '18', color: typeInfo.color, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          {TypeIcon && <TypeIcon size={11} />} {typeInfo.label}
                        </div>
                      )}
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25, marginBottom: '0.5rem', color: 'var(--ink)' }}>{ev.title}</h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.9rem' }}>{ev.excerpt}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.76rem', color: 'var(--muted)' }}>
                        {ev.event_date && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} />{new Date(ev.event_date).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})}</span>}
                        {ev.event_location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{ev.event_location}</span>}
                        {ev.event_type === 'paid' && ev.event_price && <span style={{ color: 'var(--rust)', fontWeight: 600 }}>KES {ev.event_price.toLocaleString()}</span>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
