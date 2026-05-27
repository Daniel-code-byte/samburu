'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase, uploadPhoto, savePhoto, deletePhoto } from '@/lib/supabase'

export default function AdminPhotos() {
  const [photos, setPhotos] = useState([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title:'', caption:'', category:'Community' })
  const [pending, setPending] = useState(null)
  const [msg, setMsg] = useState('')
  const fileRef = useRef()

  async function loadPhotos() {
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
    setPhotos(data || [])
  }

  useEffect(() => { loadPhotos() }, [])

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) setPending(file)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) setPending(file)
  }

  async function handleUpload() {
    if (!pending) return
    setUploading(true)
    setMsg('')
    const { url, error: upErr } = await uploadPhoto(pending)
    if (upErr || !url) { setMsg('Upload failed: ' + (upErr?.message || 'unknown error')); setUploading(false); return }
    const { error: saveErr } = await savePhoto({ url, title: form.title, caption: form.caption, category: form.category })
    if (saveErr) { setMsg('Save failed: ' + saveErr.message); setUploading(false); return }
    setMsg('Photo uploaded successfully!')
    setPending(null)
    setForm({ title:'', caption:'', category:'Community' })
    setUploading(false)
    loadPhotos()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this photo?')) return
    await deletePhoto(id)
    loadPhotos()
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Photos</h1>
        <p>Upload and manage photos for the gallery, hero slider, and across the site.</p>
      </div>

      {/* UPLOAD */}
      <div className="admin-card">
        <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'18px',marginBottom:'20px'}}>Upload New Photo</h3>

        <div
          className={`dropzone${dragging ? ' active' : ''}`}
          onDragOver={e=>{ e.preventDefault(); setDragging(true) }}
          onDragLeave={()=>setDragging(false)}
          onDrop={handleDrop}
          onClick={()=>fileRef.current.click()}
        >
          {pending ? (
            <div>
              <p style={{color:'var(--brown)',fontWeight:600}}>📎 {pending.name}</p>
              <p style={{fontSize:'13px',marginTop:'4px',color:'var(--text-light)'}}>Ready to upload · {(pending.size/1024/1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <p style={{fontSize:'36px',marginBottom:'8px'}}>📷</p>
              <p><span>Click to browse</span> or drag & drop an image here</p>
              <p style={{fontSize:'13px',color:'var(--text-light)',marginTop:'6px'}}>JPG, PNG, WebP up to 10MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange} />
        </div>

        {pending && (
          <div style={{marginTop:'20px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',alignItems:'end'}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label>Photo Title</label>
              <input className="form-input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Community Health Day" />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label>Caption</label>
              <input className="form-input" value={form.caption} onChange={e=>setForm(p=>({...p,caption:e.target.value}))} placeholder="Short description" />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label>Category</label>
              <select className="form-select" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                {['Health','Women','Youth','Community','Team'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}

        {pending && (
          <div style={{marginTop:'20px',display:'flex',gap:'12px',alignItems:'center'}}>
            <button className="btn-amber" onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Photo'}</button>
            <button className="btn-outline" onClick={()=>setPending(null)} disabled={uploading}>Cancel</button>
            {msg && <p style={{fontSize:'14px',color: msg.includes('success') ? '#166534' : '#c0392b'}}>{msg}</p>}
          </div>
        )}
      </div>

      {/* GRID */}
      <div className="admin-card">
        <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'18px',marginBottom:'20px'}}>Photo Library ({photos.length})</h3>
        {photos.length === 0 ? (
          <p style={{color:'var(--text-light)',textAlign:'center',padding:'40px 0'}}>No photos yet. Upload your first photo above.</p>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))',gap:'12px'}}>
            {photos.map(p => (
              <div key={p.id} style={{position:'relative',borderRadius:'4px',overflow:'hidden',background:'var(--sand)'}}>
                <img src={p.url} alt={p.title} style={{width:'100%',aspectRatio:'4/3',objectFit:'cover',display:'block'}} />
                <div style={{padding:'8px'}}>
                  <p style={{fontSize:'12px',fontWeight:600,color:'var(--brown)',marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.title || 'Untitled'}</p>
                  <p style={{fontSize:'11px',color:'var(--text-light)'}}>{p.category}</p>
                </div>
                <button
                  onClick={()=>handleDelete(p.id)}
                  style={{position:'absolute',top:'6px',right:'6px',background:'rgba(192,57,43,0.85)',color:'white',border:'none',borderRadius:'50%',width:'24px',height:'24px',cursor:'pointer',fontSize:'12px',display:'flex',alignItems:'center',justifyContent:'center'}}
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
