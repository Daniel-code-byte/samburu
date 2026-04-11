'use client'

import { useEffect, useState } from 'react'
import { Trash2, Plus, X, Loader, Calendar } from 'lucide-react'
import { supabase, adminInsertPost, adminDeletePost, type Post } from '@/lib/supabase'

const CATS = ['News', 'Health', 'Community', 'Women', 'Youth', 'Programs', 'Story']

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', cover_url: '', category: 'News' })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').order('published_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const save = async () => {
    if (!form.title || !form.excerpt || !form.content) return
    setSaving(true)
    try {
      await adminInsertPost({
        title: form.title,
        slug: form.slug || autoSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        cover_url: form.cover_url || null,
        category: form.category,
        published_at: new Date().toISOString(),
      })
      setForm({ title: '', slug: '', excerpt: '', content: '', cover_url: '', category: 'News' })
      setShowForm(false)
      await load()
    } catch { alert('Error saving post. Slug may already exist.') }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await adminDeletePost(id)
    await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Posts</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{posts.length} published stories</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--rust)' }}>
          <Plus size={15} /> New Post
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #E2E8EA', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>New Post</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Title *</label>
                <input className="field" placeholder="Post title" value={form.title}
                  onChange={(e) => { setForm(f => ({ ...f, title: e.target.value, slug: autoSlug(e.target.value) })) }} />
              </div>
              <div>
                <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Category</label>
                <select className="field" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>
                URL Slug (auto-generated)
              </label>
              <input className="field" placeholder="url-slug" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Cover Image URL (optional)</label>
              <input className="field" placeholder="https://..." value={form.cover_url} onChange={(e) => setForm(f => ({ ...f, cover_url: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Excerpt * (short summary)</label>
              <input className="field" placeholder="One or two sentences summarising the post" value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Full Content *</label>
              <textarea className="field" rows={8} placeholder="Write the full post here..." value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={save} disabled={saving || !form.title || !form.excerpt || !form.content} className="btn-primary" style={{ background: 'var(--rust)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : 'Publish Post'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading posts…</div>
      ) : posts.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No posts yet</p>
          <p style={{ fontSize: '0.85rem' }}>Click "New Post" to publish your first story.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {posts.map((p) => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #E2E8EA', padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', background: '#FEF3E2', color: 'var(--gold)', padding: '0.15rem 0.5rem' }}>{p.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={11} /> {new Date(p.published_at).toLocaleDateString('en-KE')}
                  </span>
                </div>
              </div>
              <button onClick={() => del(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rust)', flexShrink: 0 }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
