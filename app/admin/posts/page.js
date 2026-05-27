'use client'
import { useState, useEffect } from 'react'
import { supabase, savePost, updatePost, deletePost } from '@/lib/supabase'

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminPosts() {
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title:'', slug:'', excerpt:'', content:'', category:'Community', image_url:'', published:false })
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }

  useEffect(() => { loadPosts() }, [])

  function startNew() {
    setEditing('new')
    setForm({ title:'', slug:'', excerpt:'', content:'', category:'Community', image_url:'', published:false })
    setMsg('')
  }

  function startEdit(post) {
    setEditing(post.id)
    setForm({ title:post.title||'', slug:post.slug||'', excerpt:post.excerpt||'', content:post.content||'', category:post.category||'Community', image_url:post.image_url||'', published:!!post.published })
    setMsg('')
  }

  async function handleSave() {
    if (!form.title) { setMsg('Title is required'); return }
    setSaving(true)
    const data = { ...form, slug: form.slug || slugify(form.title) }
    let error
    if (editing === 'new') {
      ({ error } = await savePost(data))
    } else {
      ({ error } = await updatePost(editing, data))
    }
    setSaving(false)
    if (error) { setMsg('Error: ' + error.message); return }
    setMsg('Saved!')
    setEditing(null)
    loadPosts()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post?')) return
    await deletePost(id)
    loadPosts()
  }

  async function togglePublished(post) {
    await updatePost(post.id, { published: !post.published })
    loadPosts()
  }

  if (editing !== null) {
    return (
      <div>
        <div className="admin-header">
          <h1>{editing === 'new' ? 'New Post' : 'Edit Post'}</h1>
          <p>Write and publish news, stories, and updates.</p>
        </div>
        <div className="admin-card">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input className="form-input" value={form.title} onChange={e=>{ setForm(p=>({...p,title:e.target.value,slug:slugify(e.target.value)})) }} placeholder="Post title" />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input className="form-input" value={form.slug} onChange={e=>setForm(p=>({...p,slug:e.target.value}))} placeholder="post-url-slug" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select className="form-select" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                {['Health','Women','Youth','Community','News'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Cover Image URL</label>
              <input className="form-input" value={form.image_url} onChange={e=>setForm(p=>({...p,image_url:e.target.value}))} placeholder="https://..." />
            </div>
          </div>
          <div className="form-group">
            <label>Excerpt</label>
            <textarea className="form-textarea" value={form.excerpt} onChange={e=>setForm(p=>({...p,excerpt:e.target.value}))} placeholder="Short summary (shown in news cards)" style={{minHeight:'80px'}} />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea className="form-textarea" value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="Full post content..." style={{minHeight:'280px'}} />
          </div>
          <div className="form-group" style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <input type="checkbox" id="pub" checked={form.published} onChange={e=>setForm(p=>({...p,published:e.target.checked}))} style={{width:'18px',height:'18px',accentColor:'var(--amber)'}} />
            <label htmlFor="pub" style={{textTransform:'none',fontSize:'15px',marginBottom:0,fontWeight:500}}>Publish immediately</label>
          </div>
          <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
            <button className="btn-amber" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Post'}</button>
            <button className="btn-outline" onClick={()=>setEditing(null)}>Cancel</button>
            {msg && <p style={{fontSize:'14px',color:msg==='Saved!' ? '#166534' : '#c0392b'}}>{msg}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'16px'}}>
        <div>
          <h1>Posts & Events</h1>
          <p>Manage your news stories, event announcements, and updates.</p>
        </div>
        <button className="btn-amber" onClick={startNew}>+ New Post</button>
      </div>

      <div className="admin-card">
        {posts.length === 0 ? (
          <p style={{color:'var(--text-light)',textAlign:'center',padding:'40px 0'}}>No posts yet. Create your first post above.</p>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td style={{fontWeight:600,maxWidth:'280px'}}>{post.title}</td>
                    <td>{post.category}</td>
                    <td>
                      <span className={`badge ${post.published ? 'badge-green' : 'badge-yellow'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{whiteSpace:'nowrap'}}>{new Date(post.created_at).toLocaleDateString('en-GB')}</td>
                    <td>
                      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                        <button onClick={()=>startEdit(post)} style={{fontSize:'12px',padding:'4px 10px',background:'var(--sand)',border:'1px solid var(--sand-dark)',borderRadius:'3px',cursor:'pointer',fontFamily:'Outfit,sans-serif'}}>Edit</button>
                        <button onClick={()=>togglePublished(post)} style={{fontSize:'12px',padding:'4px 10px',background:post.published ? '#fef9c3' : '#dcfce7',border:'none',borderRadius:'3px',cursor:'pointer',fontFamily:'Outfit,sans-serif'}}>{post.published ? 'Unpublish' : 'Publish'}</button>
                        <button onClick={()=>handleDelete(post.id)} style={{fontSize:'12px',padding:'4px 10px',background:'#fee2e2',border:'none',borderRadius:'3px',cursor:'pointer',fontFamily:'Outfit,sans-serif',color:'#991b1b'}}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
