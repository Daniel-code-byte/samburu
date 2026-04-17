'use client'

import { useEffect, useState } from 'react'
import { Calendar, Plus, Trash2, Users, X, MapPin, Clock, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type SWEvent = {
  id: string; title: string; description: string; location: string
  event_date: string; cover_url: string | null; video_url: string | null
  is_upcoming: boolean; allow_rsvp: boolean; created_at: string
}
type Rsvp = { id: string; event_id: string; name: string; email: string; phone: string | null; created_at: string }

const EMPTY = { title: '', description: '', location: '', event_date: '', cover_url: '', video_url: '', is_upcoming: true, allow_rsvp: true }

export default function AdminEvents() {
  const [events, setEvents] = useState<SWEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [rsvpModal, setRsvpModal] = useState<SWEvent | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[]>([])

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true })
    setEvents(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const set = (k: keyof typeof form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  // Upload MP4 to Supabase storage
  const uploadVideo = async (file: File) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `videos/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('photos').upload(path, file, { contentType: file.type })
      if (error) throw error
      const { data } = supabase.storage.from('photos').getPublicUrl(path)
      set('video_url', data.publicUrl)
    } catch { alert('Upload failed. Try again.') }
    setUploading(false)
  }

  const save = async () => {
    if (!form.title || !form.description || !form.location || !form.event_date) {
      alert('Please fill in Title, Description, Location and Date')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('events').insert([{
        title: form.title,
        description: form.description,
        location: form.location,
        event_date: new Date(form.event_date).toISOString(),
        cover_url: form.cover_url || null,
        video_url: form.video_url || null,
        is_upcoming: form.is_upcoming,
        allow_rsvp: form.allow_rsvp,
      }])
      if (error) throw error
      setForm(EMPTY)
      setShowForm(false)
      await load()
    } catch (e: any) { alert('Error: ' + e.message) }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    await load()
  }

  const toggleUpcoming = async (ev: SWEvent) => {
    await supabase.from('events').update({ is_upcoming: !ev.is_upcoming }).eq('id', ev.id)
    await load()
  }

  const viewRsvps = async (ev: SWEvent) => {
    setRsvpModal(ev)
    const { data } = await supabase.from('event_rsvps').select('*').eq('event_id', ev.id).order('created_at', { ascending: false })
    setRsvps(data ?? [])
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--ink)' }}>Events</h1>
          <p style={{ fontSize: '0.83rem', color: 'var(--muted)' }}>{events.length} total · supports image cover + MP4 video</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 4 }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', marginBottom: '1.25rem' }}>New Event</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }} className="contact-name-email">
              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>Title *</label>
                <input className="field" placeholder="e.g. Samburu Marathon 2025" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>Location *</label>
                <input className="field" placeholder="e.g. Maralal Town" value={form.location} onChange={e => set('location', e.target.value)} />
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }} className="contact-name-email">
              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>Date & Time *</label>
                <input className="field" type="datetime-local" value={form.event_date} onChange={e => set('event_date', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>Cover Image URL (optional)</label>
                <input className="field" placeholder="https://..." value={form.cover_url} onChange={e => set('cover_url', e.target.value)} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>Description *</label>
              <textarea className="field" rows={3} placeholder="Describe the event..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>

            {/* Video Upload */}
            <div>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>Event Video (MP4 upload or paste URL)</label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <input className="field" placeholder="Paste video URL or upload below" value={form.video_url} onChange={e => set('video_url', e.target.value)} style={{ flex: 1, minWidth: 200 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--teal-pale)', color: 'var(--teal)', border: '1px solid var(--teal)', padding: '0 1rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap', height: 42 }}>
                  <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload MP4'}
                  <input type="file" accept="video/mp4,video/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) uploadVideo(e.target.files[0]) }} />
                </label>
              </div>
              {form.video_url && <div style={{ fontSize: '0.74rem', color: 'var(--sage)', marginTop: '0.3rem' }}>✓ Video set</div>}
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_upcoming} onChange={e => set('is_upcoming', e.target.checked)} />
                Mark as Upcoming
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.allow_rsvp} onChange={e => set('allow_rsvp', e.target.checked)} />
                Allow Registration (RSVP)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button onClick={save} disabled={saving || uploading} className="btn-primary">
                {saving ? 'Saving…' : 'Save Event'}
              </button>
              <button onClick={() => { setShowForm(false); setForm(EMPTY) }} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {rsvpModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 500, padding: '1.5rem', maxHeight: '80vh', overflow: 'auto', borderRadius: 4, position: 'relative' }}>
            <button onClick={() => setRsvpModal(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.2rem' }}>RSVPs — {rsvpModal.title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>{rsvps.length} registration{rsvps.length !== 1 ? 's' : ''}</p>
            {rsvps.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontSize: '0.88rem' }}>No registrations yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {rsvps.map(r => (
                  <div key={r.id} style={{ background: 'var(--sand)', padding: '0.85rem 1rem', borderLeft: '3px solid var(--teal)', borderRadius: 2 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--teal)' }}>{r.email}</div>
                    {r.phone && <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{r.phone}</div>}
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{new Date(r.created_at).toLocaleDateString('en-KE')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Loading events…</div>
      ) : events.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem 2rem', textAlign: 'center', borderRadius: 4 }}>
          <Calendar size={40} color="#CBD5D7" style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>No events yet</p>
          <p style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>Click "Add Event" above to create your first event.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {events.map(ev => (
            <div key={ev.id} style={{ background: '#fff', border: '1px solid #E4EAEB', borderRadius: 4, padding: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--ink)' }}>{ev.title}</span>
                  <span style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem', background: ev.is_upcoming ? 'var(--teal-pale)' : '#f3f4f6', color: ev.is_upcoming ? 'var(--teal)' : 'var(--muted)', fontWeight: 600, borderRadius: 2 }}>
                    {ev.is_upcoming ? 'UPCOMING' : 'PAST'}
                  </span>
                  {ev.video_url && <span style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem', background: '#FEF9EC', color: '#92400E', fontWeight: 600, borderRadius: 2 }}>📹 VIDEO</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', color: 'var(--muted)' }}><Clock size={10} /> {new Date(ev.event_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', color: 'var(--muted)' }}><MapPin size={10} /> {ev.location}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button onClick={() => viewRsvps(ev)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--teal-pale)', border: 'none', color: 'var(--teal)', padding: '0.38rem 0.7rem', fontSize: '0.76rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, borderRadius: 2 }}>
                  <Users size={11} /> RSVPs
                </button>
                <button onClick={() => toggleUpcoming(ev)} style={{ background: ev.is_upcoming ? '#FEF9EC' : 'var(--teal-pale)', border: 'none', color: ev.is_upcoming ? '#92400E' : 'var(--teal)', padding: '0.38rem 0.7rem', fontSize: '0.76rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', borderRadius: 2 }}>
                  {ev.is_upcoming ? 'Mark Past' : 'Mark Upcoming'}
                </button>
                <button onClick={() => del(ev.id)} style={{ background: 'var(--rust-pale)', border: 'none', color: 'var(--rust)', padding: '0.38rem 0.5rem', cursor: 'pointer', borderRadius: 2 }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
