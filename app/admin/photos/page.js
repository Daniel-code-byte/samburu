'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase, uploadPhoto, savePhoto, deletePhoto } from '@/lib/supabase'

export default function AdminPhotos() {
  const [photos, setPhotos] = useState([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title:'', caption:'', category:'Community' })
  const [pending, setPending] = useState([]) // Changed to array
  const [msg, setMsg] = useState('')
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const fileRef = useRef()

  async function loadPhotos() {
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
    setPhotos(data || [])
  }

  useEffect(() => { loadPhotos() }, [])

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    if (files.length > 0) {
      setPending(prev => [...prev, ...files])
      setMsg(`${files.length} photo(s) added to upload queue`)
    }
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'))
    if (files.length > 0) {
      setPending(prev => [...prev, ...files])
      setMsg(`${files.length} photo(s) added to upload queue`)
    }
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  function removePendingFile(index) {
    setPending(prev => prev.filter((_, i) => i !== index))
    if (pending.length === 1) setMsg('')
  }

  async function handleUpload() {
    if (pending.length === 0) return
    
    setUploading(true)
    setMsg('')
    setUploadProgress({ current: 0, total: pending.length })
    
    let successCount = 0
    let errorCount = 0
    const errors = []

    // Process each file sequentially
    for (let i = 0; i < pending.length; i++) {
      const file = pending[i]
      
      try {
        // Generate a unique title for each photo if the form has no title
        const photoTitle = form.title || file.name.replace(/\.[^/.]+$/, '')
        const photoCaption = form.caption || ''
        const photoCategory = form.category || 'Community'
        
        const { url, error: upErr } = await uploadPhoto(file)
        if (upErr || !url) {
          errorCount++
          errors.push(`${file.name}: ${upErr?.message || 'Upload failed'}`)
          setUploadProgress({ current: i + 1, total: pending.length })
          continue
        }
        
        const { error: saveErr } = await savePhoto({ 
          url, 
          title: photoTitle, 
          caption: photoCaption, 
          category: photoCategory 
        })
        
        if (saveErr) {
          errorCount++
          errors.push(`${file.name}: ${saveErr.message}`)
        } else {
          successCount++
        }
        
        setUploadProgress({ current: i + 1, total: pending.length })
      } catch (err) {
        errorCount++
        errors.push(`${file.name}: ${err.message}`)
        setUploadProgress({ current: i + 1, total: pending.length })
      }
    }

    // Show final status
    if (successCount > 0 && errorCount === 0) {
      setMsg(`✅ Successfully uploaded ${successCount} photo(s)!`)
    } else if (successCount > 0 && errorCount > 0) {
      setMsg(`⚠️ ${successCount} uploaded, ${errorCount} failed. Check console for details.`)
      console.error('Upload errors:', errors)
    } else {
      setMsg(`❌ All ${errorCount} upload(s) failed. Check console for details.`)
      console.error('Upload errors:', errors)
    }

    // Reset state
    setPending([])
    setUploadProgress({ current: 0, total: 0 })
    setUploading(false)
    loadPhotos()
    
    // Optionally clear the form
    setForm({ title:'', caption:'', category:'Community' })
  }

  async function handleDelete(id) {
    if (!confirm('Delete this photo?')) return
    await deletePhoto(id)
    loadPhotos()
  }

  // Calculate total size
  const totalSize = pending.reduce((acc, file) => acc + file.size, 0)

  return (
    <div>
      <div className="admin-header">
        <h1>Photos</h1>
        <p>Upload and manage photos for the gallery, hero slider, and across the site.</p>
      </div>

      {/* UPLOAD */}
      <div className="admin-card">
        <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'18px',marginBottom:'20px'}}>Upload New Photos</h3>

        <div
          className={`dropzone${dragging ? ' active' : ''}`}
          onDragOver={e=>{ e.preventDefault(); setDragging(true) }}
          onDragLeave={()=>setDragging(false)}
          onDrop={handleDrop}
          onClick={()=>fileRef.current.click()}
        >
          {pending.length > 0 ? (
            <div>
              <p style={{color:'var(--brown)',fontWeight:600}}>📎 {pending.length} photo(s) ready to upload</p>
              <p style={{fontSize:'13px',marginTop:'4px',color:'var(--text-light)'}}>
                Total: {(totalSize/1024/1024).toFixed(2)} MB
              </p>
              {uploading && (
                <div style={{marginTop:'10px'}}>
                  <div style={{background:'#f0f0f0',borderRadius:'4px',height:'6px',overflow:'hidden'}}>
                    <div style={{
                      background:'var(--amber)',
                      height:'100%',
                      width:`${(uploadProgress.current / uploadProgress.total) * 100}%`,
                      transition:'width 0.3s'
                    }}></div>
                  </div>
                  <p style={{fontSize:'12px',marginTop:'4px'}}>
                    {uploadProgress.current} of {uploadProgress.total} uploaded
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={{fontSize:'36px',marginBottom:'8px'}}>📷</p>
              <p><span>Click to browse</span> or drag & drop multiple images here</p>
              <p style={{fontSize:'13px',color:'var(--text-light)',marginTop:'6px'}}>JPG, PNG, WebP up to 10MB each</p>
            </div>
          )}
          <input 
            ref={fileRef} 
            type="file" 
            accept="image/*" 
            multiple // Added multiple attribute
            style={{display:'none'}} 
            onChange={handleFileChange} 
          />
        </div>

        {pending.length > 0 && (
          <>
            {/* Pending files list */}
            <div style={{marginTop:'16px'}}>
              <p style={{fontSize:'14px',fontWeight:600,color:'var(--brown)',marginBottom:'8px'}}>
                Files to upload:
              </p>
              <div style={{maxHeight:'150px',overflowY:'auto',border:'1px solid var(--sand)',borderRadius:'4px',padding:'8px'}}>
                {pending.map((file, index) => (
                  <div key={index} style={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    padding:'4px 8px',
                    borderBottom:'1px solid #f0f0f0',
                    fontSize:'13px'
                  }}>
                    <span>{file.name}</span>
                    <span style={{fontSize:'11px',color:'var(--text-light)'}}>
                      {(file.size/1024/1024).toFixed(2)} MB
                      {!uploading && (
                        <button 
                          onClick={() => removePendingFile(index)}
                          style={{
                            marginLeft:'12px',
                            background:'none',
                            border:'none',
                            color:'#c0392b',
                            cursor:'pointer',
                            fontSize:'14px'
                          }}
                        >✕</button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form fields - now applied to all photos */}
            <div style={{marginTop:'20px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',alignItems:'end'}}>
              <div className="form-group" style={{marginBottom:0}}>
                <label>Photo Title (applied to all)</label>
                <input 
                  className="form-input" 
                  value={form.title} 
                  onChange={e=>setForm(p=>({...p,title:e.target.value}))} 
                  placeholder="e.g. Community Health Day" 
                />
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label>Caption (applied to all)</label>
                <input 
                  className="form-input" 
                  value={form.caption} 
                  onChange={e=>setForm(p=>({...p,caption:e.target.value}))} 
                  placeholder="Short description" 
                />
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label>Category (applied to all)</label>
                <select 
                  className="form-select" 
                  value={form.category} 
                  onChange={e=>setForm(p=>({...p,category:e.target.value}))}
                >
                  {['Health','Women','Youth','Community','Team'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{marginTop:'20px',display:'flex',gap:'12px',alignItems:'center'}}>
              <button 
                className="btn-amber" 
                onClick={handleUpload} 
                disabled={uploading || pending.length === 0}
              >
                {uploading ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : `Upload ${pending.length} Photo(s)`}
              </button>
              <button 
                className="btn-outline" 
                onClick={() => {
                  if (pending.length > 0 && !confirm('Clear all pending photos?')) return
                  setPending([])
                  setMsg('')
                }} 
                disabled={uploading}
              >
                Clear All
              </button>
              {msg && (
                <p style={{fontSize:'14px',color: msg.includes('✅') ? '#166534' : msg.includes('⚠️') ? '#b45309' : '#c0392b'}}>
                  {msg}
                </p>
              )}
            </div>
          </>
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
