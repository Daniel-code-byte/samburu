'use client'

import { useEffect, useState } from 'react'
import { Trash2, Plus, X, Loader } from 'lucide-react'
import { supabase, adminInsertProgram, adminDeleteProgram, type Program } from '@/lib/supabase'

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', icon: 'heart', order: 0 })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('programs').select('*').order('order', { ascending: true })
    setPrograms(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title || !form.description) return
    setSaving(true)
    try {
      await adminInsertProgram(form)
      setForm({ title: '', description: '', icon: 'heart', order: programs.length })
      setShowForm(false)
      await load()
    } catch { alert('Error saving program') }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this program?')) return
    await adminDeleteProgram(id)
    await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Programs</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{programs.length} programs. Note: the site also shows 4 default programs even if this table is empty.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gold)' }}>
          <Plus size={15} /> Add Program
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #E2E8EA', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>New Program</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Title *</label>
                <input className="field" placeholder="Program name" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Display Order</label>
                <input className="field" type="number" value={form.order} onChange={(e) => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Description *</label>
              <textarea className="field" rows={3} placeholder="Describe this program..." value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={save} disabled={saving || !form.title || !form.description} className="btn-primary" style={{ background: 'var(--gold)', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : 'Save Program'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading…</div>
      ) : programs.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', marginBottom: '0.4rem' }}>No custom programs</p>
          <p style={{ fontSize: '0.85rem' }}>The site shows 4 built-in programs. Add here to override or extend them.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {programs.map((p) => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #E2E8EA', padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.72rem', background: '#FEF3E2', color: 'var(--gold)', padding: '0.1rem 0.4rem', marginRight: '0.5rem' }}>#{p.order}</span>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>{p.description}</div>
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
