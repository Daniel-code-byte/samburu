'use client'

import { useEffect, useState, useRef } from 'react'
import { Trash2, Upload, ImageIcon, CheckCircle, AlertCircle, X } from 'lucide-react'
import { supabase, adminDeletePhoto, type Photo } from '@/lib/supabase'

const CATS = ['community', 'health', 'women', 'youth', 'culture']

type UploadState = 'idle' | 'uploading' | 'saving' | 'done' | 'error'

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('community')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
    setPhotos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const pickFile = (f: File) => {
    if (!f.type.startsWith('image/')) { setErrorMsg('Please select an image file.'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setErrorMsg('')
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }

  const upload = async () => {
    if (!file || !title) return
    setUploadState('uploading')
    setProgress(0)
    setErrorMsg('')

    try {
      // Upload to Supabase storage
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      
      setProgress(30)
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError
      setProgress(70)
      setUploadState('saving')

      // Get public URL
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName)
      const publicUrl = urlData.publicUrl

      // Save to photos table
      const { error: dbError } = await supabase.from('photos').insert([{
        title, description, url: publicUrl, category, taken_at: null
      }])
      if (dbError) throw dbError

      setProgress(100)
      setUploadState('done')
      setTitle(''); setDescription(''); setCategory('community')
      setFile(null); setPreview(null)
      setTimeout(() => setUploadState('idle'), 2000)
      await load()
    } catch (err: any) {
      setUploadState('error')
      setErrorMsg(err?.message ?? 'Upload failed. Check your Supabase storage bucket is named "photos" and is public.')
    }
  }

  const del = async (id: string, url: string) => {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    // Delete from storage
    const fileName = url.split('/').pop()
    if (fileName) await supabase.storage.from('photos').remove([fileName])
    await adminDeletePhoto(id)
    await load()
  }

  const clearFile = () => { setFile(null); setPreview(null); setUploadState('idle') }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--ink)' }}>Photos</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{photos.length} photos · Upload images directly from your device</p>
      </div>

      {/* Upload card */}
      <div style={{ background: '#fff', border: '1px solid #E2E8EA', borderRadius: 4, padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--ink)' }}>
          Upload New Photo
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Drop zone */}
          <div>
            {!preview ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? 'var(--teal)' : '#D1D9DB'}`,
                  borderRadius: 4, padding: '3rem 2rem',
                  textAlign: 'center', cursor: 'pointer',
                  background: dragging ? 'var(--teal-pale)' : '#FAFCFC',
                  transition: 'all 0.2s',
                }}
              >
                <Upload size={36} color={dragging ? 'var(--teal)' : '#9AACAF'} style={{ margin: '0 auto 1rem' }} />
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.4rem' }}>
                  Click to choose a photo
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>or drag and drop here</div>
                <div style={{ fontSize: '0.75rem', color: '#B0BCBE', marginTop: '0.5rem' }}>JPG, PNG, WEBP</div>
                <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && pickFile(e.target.files[0])} />
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 4, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button onClick={clearFile} style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff',
                }}>
                  <X size={14} />
                </button>
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center' }}>
                  {file?.name} · {file ? (file.size / 1024 / 1024).toFixed(1) : 0}MB
                </div>
              </div>
            )}
          </div>

          {/* Fields — always shown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={lbl}>Photo Title *</label>
              <input className="field" placeholder="e.g. Community gathering at the river" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Category</label>
              <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATS.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.3rem' }}>Community photos show on the homepage</div>
            </div>
            <div>
              <label style={lbl}>Description (optional)</label>
              <input className="field" placeholder="Brief caption..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Upload button + status */}
            {uploadState === 'done' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--sage)', fontWeight: 600, fontSize: '0.9rem' }}>
                <CheckCircle size={18} /> Photo uploaded successfully!
              </div>
            ) : (
              <button
                onClick={upload}
                disabled={!file || !title || uploadState === 'uploading' || uploadState === 'saving'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: (!file || !title) ? '#CBD5D7' : 'var(--teal)',
                  color: '#fff', border: 'none', padding: '0.85rem',
                  fontSize: '0.9rem', fontWeight: 600, cursor: (!file || !title) ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif', transition: 'background 0.2s', borderRadius: 2,
                }}
              >
                {uploadState === 'uploading' && <><Spinner /> Uploading… {progress}%</>}
                {uploadState === 'saving' && <><Spinner /> Saving to gallery…</>}
                {(uploadState === 'idle' || uploadState === 'error') && <><Upload size={16} /> Upload Photo</>}
              </button>
            )}

            {/* Progress bar */}
            {(uploadState === 'uploading' || uploadState === 'saving') && (
              <div style={{ background: '#E8F0F1', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                <div style={{ background: 'var(--teal)', height: '100%', width: `${progress}%`, transition: 'width 0.4s', borderRadius: 99 }} />
              </div>
            )}

            {errorMsg && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'var(--rust)', fontSize: '0.82rem', background: 'var(--rust-pale)', padding: '0.75rem', borderRadius: 2 }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo grid */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--ink)' }}>All Photos</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
          <Spinner /> <span style={{ marginLeft: 8 }}>Loading photos…</span>
        </div>
      ) : photos.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem', textAlign: 'center', color: 'var(--muted)', borderRadius: 4 }}>
          <ImageIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.4rem' }}>No photos yet</p>
          <p style={{ fontSize: '0.85rem' }}>Upload your first photo above.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {photos.map((p) => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #E2E8EA', borderRadius: 4, overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', background: 'var(--teal-pale)', color: 'var(--teal)', padding: '0.15rem 0.5rem', borderRadius: 2, textTransform: 'capitalize' }}>{p.category}</span>
                  <button onClick={() => del(p.id, p.url)} title="Delete photo" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0B0AE', padding: 4, transition: 'color 0.15s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--rust)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#C0B0AE')}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const lbl: React.CSSProperties = { fontSize: '0.73rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }

function Spinner() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></svg>
}
