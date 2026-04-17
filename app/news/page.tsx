'use client'

import { useEffect, useState, useRef } from 'react'
import { Trash2, Plus, X, Loader, Calendar, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Evt = { id: string; title: string; slug: string; excerpt: string; content: string; cover_url: string | null; category: string; published_at: string }
type UploadState = 'idle' | 'uploading' | 'saving' | 'done' | 'error'

const lbl: React.CSSProperties = { fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }

export default function AdminEvents() {
  const [events, setEvents] = useState<Evt[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', event_date: '', location: '' })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').eq('category', 'Event').order('published_at', { ascending: false })
    setEvents((data ?? []) as Evt[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const pickFile = (f: File) => {
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) { setErrorMsg('Please select an image or video file.'); return }
    setCoverFile(f); setPreview(URL.createObjectURL(f)); setErrorMsg('')
  }

  const save = async () => {
    if (!form.title || !form.excerpt || !form.content) return
    setSaving(true); setErrorMsg('')
    try {
      let cover_url: string | null = null
      if (coverFile) {
        setUploadState('uploading')
        const ext = coverFile.name.split('.').pop()
        const fileName = `events/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('photos').upload(fileName, coverFile, { cacheControl: '3600', upsert: false })
        if (upErr) throw upErr
        cover_url = supabase.storage.from('photos').getPublicUrl(fileName).data.publicUrl
      }
      setUploadState('saving')
      const body = `${form.location ? '📍 ' + form.location + '\n\n' : ''}${form.event_date ? '📅 ' + form.event_date + '\n\n' : ''}${form.content}`
      const { error } = await supabase.from('posts').insert([{ title: form.title, slug: form.slug || autoSlug(form.title), excerpt: form.excerpt, content: body, cover_url, category: 'Event', published_at: new Date().toISOString() }])
      if (error) throw error
      setUploadState('done')
      setForm({ title: '', slug: '', excerpt: '', content: '', event_date: '', location: '' })
      setCoverFile(null); setPreview(null); setShowForm(false)
      setTimeout(() => setUploadState('idle'), 1500)
      await load()
    } catch (err: any) { setUploadState('error'); setErrorMsg(err?.message ?? 'Failed to save.') }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this event?')) return
    await supabase.from('posts').delete().eq('id', id); await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Events</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{events.length} events published</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0EA5E9' }}>
          <Plus size={15} /> Add Event
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #E2E8EA', borderRadius: 4, padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>New Event</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start', marginBottom: '1.25rem' }}>
            <div>
              <label style={lbl}>Cover Photo (optional)</label>
              {!preview ? (
                <div onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }}
                  onClick={() => inputRef.current?.click()}
                  style={{ border: `2px dashed ${dragging ? 'var(--teal)' : '#D1D9DB'}`, borderRadius: 4, padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--teal-pale)' : '#FAFCFC', transition: 'all 0.2s' }}>
                  <Upload size={28} color={dragging ? 'var(--teal)' : '#9AACAF'} style={{ margin: '0 auto 0.75rem' }} />
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>Click to upload cover image</div>
                  <div style={{ fontSize: '0.74rem', color: '#B0BCBE' }}>or drag & drop · JPG, PNG, MP4</div>
                  <input ref={inputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && pickFile(e.target.files[0])} />
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {coverFile?.type.startsWith('video/') ? (<video src={preview ?? ''} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 4, display: 'block' }} controls muted />) : (<img src={preview ?? ''} alt="preview" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 4, display: 'block' }} />)}
                  <button onClick={() => { setCoverFile(null); setPreview(null) }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={13} /></button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={lbl}>Event Title *</label>
                <input className="field" placeholder="e.g. Mental Health Awareness Day" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: autoSlug(e.target.value) }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={lbl}>Date</label>
                  <input className="field" type="date" value={form.event_date} onChange={(e) => setForm(f => ({ ...f, event_date: e.target.value }))} />
                </div>
                <div>
                  <label style={lbl}>Location</label>
                  <input className="field" placeholder="Samburu" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={lbl}>Short Summary *</label>
                <input className="field" placeholder="One sentence summary" value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} />
              </div>
            </div>
          </div>
          <div>
            <label style={lbl}>Full Description *</label>
            <textarea className="field" rows={5} placeholder="Describe the event in detail..." value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          {errorMsg && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--rust)', fontSize: '0.82rem', background: 'var(--rust-pale)', padding: '0.75rem', borderRadius: 2, marginTop: '1rem' }}><AlertCircle size={14} /> {errorMsg}</div>}
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={save} disabled={saving || !form.title || !form.excerpt || !form.content} className="btn-primary" style={{ background: '#0EA5E9', display: 'flex', alignItems: 'center', gap: 6, opacity: (!form.title || !form.excerpt || !form.content) ? 0.5 : 1 }}>
              {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} />{uploadState === 'uploading' ? 'Uploading image…' : 'Saving…'}</> : <><Calendar size={14} /> Publish Event</>}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            {uploadState === 'done' && <span style={{ color: 'var(--sage)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 5 }}><CheckCircle size={15} /> Saved!</span>}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading…</div>
      ) : events.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem', textAlign: 'center', color: 'var(--muted)', borderRadius: 4 }}>
          <Calendar size={44} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.4rem' }}>No events yet</p>
          <p style={{ fontSize: '0.85rem' }}>Click "Add Event" to publish your first event.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {events.map((e) => (
            <div key={e.id} style={{ background: '#fff', border: '1px solid #E2E8EA', borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
              {e.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.cover_url} alt={e.title} style={{ width: 100, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ padding: '1rem 1.25rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem', fontSize: '0.92rem' }}>{e.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: '0.2rem' }}><Calendar size={11} /> {new Date(e.published_at).toLocaleDateString('en-KE')}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.excerpt}</div>
                </div>
                <button onClick={() => del(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0B0AE', flexShrink: 0 }}
                  onMouseEnter={(el) => ((el.currentTarget as HTMLElement).style.color = 'var(--rust)')}
                  onMouseLeave={(el) => ((el.currentTarget as HTMLElement).style.color = '#C0B0AE')}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
