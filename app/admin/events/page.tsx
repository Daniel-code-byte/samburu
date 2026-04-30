'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, X, Loader, Users, Lock, Globe, ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Post, EventRegistration } from '@/lib/supabase'

const lbl: React.CSSProperties = { fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }
const field: React.CSSProperties = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #D0D8DA', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#FAFCFC', borderRadius: 2 }

function autoSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36) }

const EVENT_TYPES = [
  { value: 'public',            label: 'Public — Open to All',      icon: Globe, color: '#2A9D5C', desc: 'Anyone can attend, no registration needed' },
  { value: 'free_registration', label: 'Free — Registration Required', icon: Users, color: '#1A7A8A', desc: 'Free but attendees must register' },
  { value: 'paid',              label: 'Paid Event',                 icon: Lock,  color: '#C0472A', desc: 'Attendees pay via M-Pesa to register' },
]

export default function AdminEvents() {
  const [events, setEvents] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [expandedRegs, setExpandedRegs] = useState<string | null>(null)
  const [regs, setRegs] = useState<Record<string, EventRegistration[]>>({})
  const [loadingRegs, setLoadingRegs] = useState(false)

  const blank = { title: '', excerpt: '', content: '', cover_url: '', event_type: 'public' as Post['event_type'], event_date: '', event_location: '', event_price: '', event_capacity: '' }
  const [form, setForm] = useState(blank)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').eq('category', 'Event').order('published_at', { ascending: false })
    setEvents(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const toggleRegs = async (eventId: string) => {
    if (expandedRegs === eventId) { setExpandedRegs(null); return }
    setExpandedRegs(eventId)
    if (!regs[eventId]) {
      setLoadingRegs(true)
      const { data } = await supabase.from('event_registrations').select('*').eq('event_id', eventId).order('created_at', { ascending: false })
      setRegs(r => ({ ...r, [eventId]: data ?? [] }))
      setLoadingRegs(false)
    }
  }

  const save = async () => {
    if (!form.title || !form.excerpt || !form.content) { setErrorMsg('Title, excerpt and description are required.'); return }
    setSaving(true); setErrorMsg('')
    try {
      const payload: any = {
        title: form.title,
        slug: autoSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        cover_url: form.cover_url || null,
        category: 'Event',
        published_at: new Date().toISOString(),
        event_type: form.event_type,
        event_date: form.event_date || null,
        event_location: form.event_location || null,
        event_price: form.event_type === 'paid' && form.event_price ? Number(form.event_price) : null,
        event_capacity: form.event_capacity ? Number(form.event_capacity) : null,
      }
      const { error } = await supabase.from('posts').insert([payload])
      if (error) throw error
      setForm(blank); setShowForm(false)
      await load()
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Failed to save event.')
    }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this event and all its registrations?')) return
    await supabase.from('event_registrations').delete().eq('event_id', id)
    await supabase.from('posts').delete().eq('id', id)
    await load()
  }

  const verifyPayment = async (regId: string, eventId: string) => {
    await supabase.from('event_registrations').update({ status: 'confirmed' }).eq('id', regId)
    const { data } = await supabase.from('event_registrations').select('*').eq('event_id', eventId).order('created_at', { ascending: false })
    setRegs(r => ({ ...r, [eventId]: data ?? [] }))
  }

  const selectedType = EVENT_TYPES.find(t => t.value === form.event_type)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Events</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{events.length} event{events.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Create Event
        </button>
      </div>

      {/* ── Create form ── */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #E2E8EA', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem' }}>New Event</h2>
            <button onClick={() => { setShowForm(false); setForm(blank); setErrorMsg('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>

          {/* Event type selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={lbl}>Event Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.75rem' }}>
              {EVENT_TYPES.map(t => {
                const Icon = t.icon
                const active = form.event_type === t.value
                return (
                  <button key={t.value} onClick={() => setForm(f => ({ ...f, event_type: t.value as Post['event_type'] }))}
                    style={{ padding: '0.9rem', border: `2px solid ${active ? t.color : '#E2E8EA'}`, background: active ? t.color + '0F' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.35rem', color: active ? t.color : 'var(--muted)' }}>
                      <Icon size={15} /><span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em' }}>{t.label}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{t.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Event Title *</label>
              <input style={field} placeholder="e.g. Community Mental Health Forum" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Event Date</label>
              <input type="datetime-local" style={field} value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Location</label>
              <input style={field} placeholder="e.g. Maralal Town Hall" value={form.event_location} onChange={e => setForm(f => ({ ...f, event_location: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Capacity (optional)</label>
              <input type="number" style={field} placeholder="e.g. 100" value={form.event_capacity} onChange={e => setForm(f => ({ ...f, event_capacity: e.target.value }))} />
            </div>
            {form.event_type === 'paid' && (
              <div>
                <label style={lbl}>Price (KES) *</label>
                <input type="number" style={field} placeholder="e.g. 500" value={form.event_price} onChange={e => setForm(f => ({ ...f, event_price: e.target.value }))} />
              </div>
            )}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Cover Image URL (optional)</label>
              <input style={field} placeholder="https://..." value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Short Description *</label>
              <input style={field} placeholder="One sentence summary shown on the events list" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Full Details *</label>
              <textarea style={{ ...field, minHeight: 120, resize: 'vertical' }} placeholder="Full event description, schedule, what to bring, etc." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            </div>
          </div>

          {errorMsg && <div style={{ color: 'var(--rust)', fontSize: '0.82rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}><span>⚠</span>{errorMsg}</div>}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={save} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : 'Publish Event'}
            </button>
            <button onClick={() => { setShowForm(false); setForm(blank); setErrorMsg('') }} className="btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Events list ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading…</div>
      ) : events.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.4rem' }}>No events yet</p>
          <p style={{ fontSize: '0.85rem' }}>Click "Create Event" to add your first event.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map(ev => {
            const typeInfo = EVENT_TYPES.find(t => t.value === ev.event_type)
            const TypeIcon = typeInfo?.icon
            const evRegs = regs[ev.id] ?? []
            const isExpanded = expandedRegs === ev.id

            return (
              <div key={ev.id} style={{ background: '#fff', border: '1px solid #E2E8EA' }}>
                <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      {typeInfo && TypeIcon && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: typeInfo.color + '18', color: typeInfo.color, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.55rem' }}>
                          <TypeIcon size={10} /> {typeInfo.label}
                        </span>
                      )}
                      {ev.event_date && <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{new Date(ev.event_date).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})}</span>}
                      {ev.event_location && <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>📍 {ev.event_location}</span>}
                      {ev.event_type === 'paid' && ev.event_price && <span style={{ fontSize: '0.75rem', color: 'var(--rust)', fontWeight: 600 }}>KES {ev.event_price.toLocaleString()}</span>}
                    </div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{ev.excerpt}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                    <a href={`/news/${ev.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--teal)', textDecoration: 'none', padding: '0.4rem 0.75rem', border: '1px solid var(--teal)', borderRadius: 2 }}>
                      <Eye size={13} /> View
                    </a>
                    {ev.event_type !== 'public' && (
                      <button onClick={() => toggleRegs(ev.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--ink)', background: 'var(--sand)', border: '1px solid var(--border)', padding: '0.4rem 0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                        <Users size={13} /> Registrations {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    )}
                    <button onClick={() => del(ev.id)} style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', background: '#FFF0EE', border: '1px solid #F5C5BF', cursor: 'pointer', color: 'var(--rust)', borderRadius: 2 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Registrations panel */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #E2E8EA', padding: '1.25rem', background: '#FAFCFC' }}>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.9rem' }}>
                      Registrations {!loadingRegs && `(${evRegs.length})`}
                    </div>
                    {loadingRegs ? (
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading…</div>
                    ) : evRegs.length === 0 ? (
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No registrations yet.</div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: 'var(--sand)' }}>
                              {['Ticket', 'Name', 'Email', 'Phone', ev.event_type === 'paid' ? 'M-Pesa Code' : '', 'Status', ev.event_type === 'paid' ? 'Action' : ''].filter(Boolean).map(h => (
                                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.7rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {evRegs.map((r, i) => (
                              <tr key={r.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#FAFCFC' }}>
                                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--teal)' }}>{r.ticket_number}</td>
                                <td style={{ padding: '0.55rem 0.75rem' }}>{r.name}</td>
                                <td style={{ padding: '0.55rem 0.75rem', color: 'var(--muted)' }}>{r.email}</td>
                                <td style={{ padding: '0.55rem 0.75rem', color: 'var(--muted)' }}>{r.phone ?? '—'}</td>
                                {ev.event_type === 'paid' && <td style={{ padding: '0.55rem 0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>{r.mpesa_code ?? '—'}</td>}
                                <td style={{ padding: '0.55rem 0.75rem' }}>
                                  <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: r.status === 'confirmed' ? '#2A9D5C18' : '#C0472A18', color: r.status === 'confirmed' ? '#2A9D5C' : '#C0472A' }}>
                                    {r.status === 'confirmed' ? '✓ Confirmed' : 'Pending'}
                                  </span>
                                </td>
                                {ev.event_type === 'paid' && (
                                  <td style={{ padding: '0.55rem 0.75rem' }}>
                                    {r.status !== 'confirmed' && (
                                      <button onClick={() => verifyPayment(r.id, ev.id)} style={{ fontSize: '0.72rem', background: '#2A9D5C', color: '#fff', border: 'none', padding: '0.25rem 0.6rem', cursor: 'pointer', borderRadius: 2 }}>
                                        Verify Payment
                                      </button>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
