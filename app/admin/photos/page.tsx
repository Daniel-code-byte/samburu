'use client'

import { useEffect, useState, useRef } from 'react'
import { Trash2, Plus, X, Loader, Upload, CheckCircle, AlertCircle, Image } from 'lucide-react'
import { supabase, adminDeletePhoto, type Photo } from '@/lib/supabase'

const CATS = ['community', 'events', 'programs', 'team', 'other']
const lbl: React.CSSProperties = { fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }

type UploadState = 'idle' | 'uploading' | 'saving' | 'done' | 'error'

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ title: '', description: '', category: 'community' })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
    setPhotos(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const pickFile = (f: File) => {
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) { setErrorMsg('Please select an image or video file.'); return }
    setFile(f); setPreview(URL.createObjectURL(f)); setErrorMsg('')
  }

  const save = async () => {
    if (!form.title || !file) return
    setSaving(true); setErrorMsg('')
    try {
      setUploadState('uploading')
      const ext = file.name.split('.').pop()
      const isVid = file.type.startsWith('video/')
      const folder = isVid ? 'videos' : 'gallery'
      const fileName = `${folder}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('photos').upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (upErr) throw upErr
      const url = supabase.storage.from('photos').getPublicUrl(fileName).data.publicUrl
      setUploadState('saving')
      const { error } = await supabase.from('photos').insert([{
        title: form.title,
        description: form.description || null,
        url,
        category: form.category,
        taken_at: null,
      }])
      if (error) throw error
      setUploadState('done')
      setForm({ title: '', description: '', category: 'community' })
      setFile(null); setPreview(null); setShowForm(false)
      setTimeout(() => setUploadState('idle'), 1500)
      await load()
    } catch (err: any) {
      setUploadState('error')
      const msg = err?.message ?? JSON.stringify(err) ?? 'Upload failed.'
      console.error('Photo upload error:', err)
      setErrorMsg(msg)
    }
    setSaving(false)
  }

  const del = async (id: string, url: string) => {
    if (!confirm('Delete this photo/video?')) return
    try {
      // Extract storage path from URL
      const match = url.match(/\/photos\/(.+)$/)
      if (match) await supabase.storage.from('photos').remove([match[1]])
    } catch {}
    await adminDeletePhoto(id)
    await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Photos & Videos</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{photos.length} items uploaded</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Add Photo / Video
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #E2E8EA', borderRadius: 4, padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>Upload Photo or Video</h2>
            <button onClick={() => { setShowForm(false); setFile(null); setPreview(null); setErrorMsg('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            <div>
              <label style={lbl}>File *</label>
              {!preview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }}
                  onClick={() => inputRef.current?.click()}
                  style={{ border: `2px dashed ${dragging ? 'var(--teal)' : '#D1D9DB'}`, borderRadius: 4, padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--teal-pale)' : '#FAFCFC', transition: 'all 0.2s' }}>
                  <Upload size={28} color={dragging ? 'var(--teal)' : '#9AACAF'} style={{ margin: '0 auto 0.75rem' }} />
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>Click to upload</div>
                  <div style={{ fontSize: '0.74rem', color: '#B0BCBE' }}>Images (JPG, PNG, WEBP) or Videos (MP4, MOV)</div>
                  <input ref={inputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && pickFile(e.target.files[0])} />
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  {file?.type.startsWith('video/') ? (
                    <video src={preview} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 4, display: 'block' }} controls muted />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="preview" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 4, display: 'block' }} />
                  )}
                  <button onClick={() => { setFile(null); setPreview(null) }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={13} /></button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={lbl}>Title *</label>
                <input className="field" placeholder="e.g. Community outreach 2024" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label style={lbl}>Category</label>
                <select className="field" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Description (optional)</label>
                <textarea className="field" rows={3} placeholder="Brief description..." value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
            </div>
          </div>
          {errorMsg && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--rust)', fontSize: '0.82rem', background: 'var(--rust-pale)', padding: '0.75rem', borderRadius: 2, marginTop: '1rem' }}><AlertCircle size={14} /> {errorMsg}</div>}
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={save} disabled={saving || !form.title || !file} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: (!form.title || !file) ? 0.5 : 1 }}>
              {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} />{uploadState === 'uploading' ? 'Uploading…' : 'Saving…'}</> : <><Upload size={14} /> Upload</>}
            </button>
            <button onClick={() => { setShowForm(false); setFile(null); setPreview(null); setErrorMsg('') }} className="btn-outline">Cancel</button>
            {uploadState === 'done' && <span style={{ color: 'var(--sage)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 5 }}><CheckCircle size={15} /> Uploaded!</span>}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading…</div>
      ) : photos.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem', textAlign: 'center', color: 'var(--muted)', borderRadius: 4 }}>
          <Image size={44} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.4rem' }}>No photos yet</p>
          <p style={{ fontSize: '0.85rem' }}>Click "Add Photo / Video" to upload your first item.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {photos.map((p) => (
            <div key={p.id} style={{ position: 'relative', background: '#000', borderRadius: 4, overflow: 'hidden', aspectRatio: '4/3' }}>
              {p.url.match(/\.(mp4|mov|webm|ogg)/i) ? (
                <video src={p.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', marginBottom: '0.15rem' }}>{p.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{p.category}</div>
                  </div>
                  <button onClick={() => del(p.id, p.url)} style={{ background: 'rgba(220,50,50,0.85)', border: 'none', borderRadius: 3, padding: '0.3rem', cursor: 'pointer', display: 'flex', color: '#fff' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
