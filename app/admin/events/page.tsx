'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, X, Loader, Users, Lock, Globe, ChevronDown, ChevronUp, Eye, Upload, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Post, EventRegistration } from '@/lib/supabase'

const lbl: React.CSSProperties = { fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }
const field: React.CSSProperties = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #D0D8DA', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#FAFCFC', borderRadius: 2 }

function autoSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36) }

const EVENT_TYPES = [
  { value: 'public',             label: 'Public — Open to All',       icon: Globe, color: '#2A9D5C', desc: 'Anyone can attend, no registration' },
  { value: 'free_registration',  label: 'Free — Registration Required', icon: Users, color: '#1A7A8A', desc: 'Free but must register for a ticket' },
  { value: 'paid',               label: 'Paid Event',                  icon: Lock,  color: '#C0472A', desc: 'Registration + M-Pesa payment required' },
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
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const blank = { title: '', excerpt: '', content: '', event_type: 'public' as Post['event_type'], event_date: '', event_location: '', event_price: '', event_capacity: '' }
  const [form, setForm] = useState(blank)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').eq('category', 'Event').order('published_at', { ascending: false })
    setEvents(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const pickFile = (f: File) => {
    if (!f.type.startsWith('image/')) { setErrorMsg('Please select an image file.'); return }
    setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); setErrorMsg('')
  }

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
    if (form.event_type === 'paid' && !form.event_price) { setErrorMsg('Price is required for paid events.'); return }
    setSaving(true); setErrorMsg('')
    try {
      let cover_url: string | null = null
      if (coverFile) {
        setUploading(true)
        const ext = coverFile.name.split('.').pop()
        const fileName = `events/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('photos').upload(fileName, coverFile, { cacheControl: '3600', upsert: false })
        if (upErr) throw upErr
        cover_url = supabase.storage.from('photos').getPublicUrl(fileName).data.publicUrl
        setUploading(false)
      }
      const payload: any = {
        title: form.title, slug: autoSlug(form.title),
        excerpt: form.excerpt, content: form.content,
        cover_url, category: 'Event',
        published_at: new Date().toISOString(),
        event_type: form.event_type,
        event_date: form.event_date || null,
        event_location: form.event_location || null,
        event_price: form.event_type === 'paid' && form.event_price ? Number(form.event_price) : null,
        event_capacity: form.event_capacity ? Number(form.event_capacity) : null,
      }
      const { error } = await supabase.from('posts').insert([payload])
      if (error) throw error
      setForm(blank); setCoverFile(null); setCoverPreview(null); setShowForm(false)
      await load()
    } catch (e: any) {
      setUploading(false)
      setErrorMsg(e?.message ?? 'Failed to save event.')
    }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this event and all registrations?')) return
    await supabase.from('event_registrations').delete().eq('event_id', id)
    await supabase.from('posts').delete().eq('id', id)
    await load()
  }

  const verifyPayment = async (regId: string, eventId: string) => {
    await supabase.from('event_registrations').update({ status: 'confirmed' }).eq('id', regId)
    const { data } = await supabase.from('event_registrations').select('*').eq('event_id', eventId).order('created_at', { ascending: false })
    setRegs(r => ({ ...r, [eventId]: data ?? [] }))
  }

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
            <button onClick={() => { setShowForm(false); setForm(blank); setCoverFile(null); setCoverPreview(null); setErrorMsg('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>

          {/* Event type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={lbl}>Event Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: '0.75rem' }}>
              {EVENT_TYPES.map(t => {
                const Icon = t.icon
                const active = form.event_type === t.value
                return (
                  <button key={t.value} onClick={() => setForm(f => ({ ...f, event_type: t.value as Post['event_type'] }))}
                    style={{ padding: '0.9rem', border: `2px solid ${active ? t.color : '#E2E8EA'}`, background: active ? t.color + '0F' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.3rem', color: active ? t.color : 'var(--muted)' }}>
                      <Icon size={14} /><span style={{ fontSize: '0.76rem', fontWeight: 600 }}>{t.label}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{t.desc}</div>
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
              <label style={lbl}>Date &amp; Time</label>
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

            {/* Cover image upload */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Cover Image</label>
              {!coverPreview ? (
                <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #D1D9DB', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#FAFCFC', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#D1D9DB')}>
                  <Upload size={22} color="#9AACAF" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem' }}>Click to upload cover image</div>
                  <div style={{ fontSize: '0.72rem', color: '#B0BCBE' }}>JPG, PNG, WEBP</div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && pickFile(e.target.files[0])} />
                </div>
              ) : (
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPreview} alt="preview" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                  <button onClick={() => { setCoverFile(null); setCoverPreview(null) }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={13} /></button>
                </div>
              )}
            </div>

            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Short Description *</label>
              <input style={field} placeholder="One-line summary shown on the events list" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Full Details *</label>
              <textarea style={{ ...field, minHeight: 100, resize: 'vertical' }} placeholder="Full event description, schedule, what to expect…" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            </div>
          </div>

          {errorMsg && <div style={{ color: '#C0472A', fontSize: '0.82rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, background: '#FFF0EE', padding: '0.65rem 0.75rem' }}>⚠ {errorMsg}</div>}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={save} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} />{uploading ? 'Uploading image…' : 'Saving…'}</> : 'Publish Event'}
            </button>
            <button onClick={() => { setShowForm(false); setForm(blank); setCoverFile(null); setCoverPreview(null); setErrorMsg('') }} className="btn-outline">Cancel</button>
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
            const pendingCount = evRegs.filter(r => r.status !== 'confirmed').length

            return (
              <div key={ev.id} style={{ background: '#fff', border: '1px solid #E2E8EA' }}>
                <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {ev.cover_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.cover_url} alt={ev.title} style={{ width: 80, height: 60, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      {typeInfo && TypeIcon && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: typeInfo.color + '18', color: typeInfo.color, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.55rem' }}>
                          <TypeIcon size={10} /> {typeInfo.label}
                        </span>
                      )}
                      {ev.event_date && <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{new Date(ev.event_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                      {ev.event_location && <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>📍 {ev.event_location}</span>}
                      {ev.event_type === 'paid' && ev.event_price && <span style={{ fontSize: '0.74rem', color: '#C0472A', fontWeight: 600 }}>KES {ev.event_price.toLocaleString()}</span>}
                    </div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{ev.excerpt}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexShrink: 0, flexWrap: 'wrap' }}>
                    <a href={`/news/${ev.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--teal)', textDecoration: 'none', padding: '0.35rem 0.65rem', border: '1px solid var(--teal)' }}>
                      <Eye size={12} /> View
                    </a>
                    {ev.event_type !== 'public' && (
                      <button onClick={() => toggleRegs(ev.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--ink)', background: pendingCount > 0 ? '#FEF3C7' : 'var(--sand)', border: `1px solid ${pendingCount > 0 ? '#F59E0B' : 'var(--border)'}`, padding: '0.35rem 0.65rem', cursor: 'pointer' }}>
                        <Users size={12} />
                        {isExpanded ? 'Hide' : `Registrations${evRegs.length > 0 ? ` (${evRegs.length})` : ''}`}
                        {pendingCount > 0 && <span style={{ background: '#F59E0B', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '0.62rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{pendingCount}</span>}
                        {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                    )}
                    <button onClick={() => del(ev.id)} style={{ display: 'flex', alignItems: 'center', padding: '0.35rem', background: '#FFF0EE', border: '1px solid #F5C5BF', cursor: 'pointer', color: '#C0472A' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Registrations panel */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #E2E8EA', padding: '1.25rem', background: '#FAFCFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                      <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                        Registrations {!loadingRegs && `(${evRegs.length})`}
                      </div>
                      {pendingCount > 0 && (
                        <div style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                          ⚠ {pendingCount} pending payment verification
                        </div>
                      )}
                    </div>
                    {loadingRegs ? (
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading…</div>
                    ) : evRegs.length === 0 ? (
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No registrations yet.</div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', minWidth: 500 }}>
                          <thead>
                            <tr style={{ background: 'var(--sand)' }}>
                              {['Ticket No.', 'Name', 'Email', 'Phone', ev.event_type === 'paid' ? 'M-Pesa Code' : null, 'Status', ev.event_type === 'paid' ? 'Action' : null].filter(Boolean).map(h => (
                                <th key={h!} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.68rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {evRegs.map((r, i) => (
                              <tr key={r.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#FAFCFC' }}>
                                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--teal)', fontSize: '0.78rem' }}>{r.ticket_number}</td>
                                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 500 }}>{r.name}</td>
                                <td style={{ padding: '0.55rem 0.75rem', color: 'var(--muted)' }}>{r.email}</td>
                                <td style={{ padding: '0.55rem 0.75rem', color: 'var(--muted)' }}>{r.phone ?? '—'}</td>
                                {ev.event_type === 'paid' && <td style={{ padding: '0.55rem 0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#0D3D49' }}>{r.mpesa_code ?? '—'}</td>}
                                <td style={{ padding: '0.55rem 0.75rem' }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.55rem', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: r.status === 'confirmed' ? '#2A9D5C18' : '#F59E0B18', color: r.status === 'confirmed' ? '#2A9D5C' : '#D97706' }}>
                                    {r.status === 'confirmed' ? <><CheckCircle size={10} /> Confirmed</> : '⏳ Pending'}
                                  </span>
                                </td>
                                {ev.event_type === 'paid' && (
                                  <td style={{ padding: '0.55rem 0.75rem' }}>
                                    {r.status !== 'confirmed' ? (
                                      <button onClick={() => verifyPayment(r.id, ev.id)} style={{ fontSize: '0.72rem', background: '#2A9D5C', color: '#fff', border: 'none', padding: '0.28rem 0.65rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
                                        ✓ Verify &amp; Issue Ticket
                                      </button>
                                    ) : (
                                      <span style={{ fontSize: '0.72rem', color: '#9AACAF' }}>Ticket issued</span>
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
