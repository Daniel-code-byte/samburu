'use client'
import { useState, useEffect } from 'react'
import { getAllPartnerships, updatePartnershipStatus } from '@/lib/supabase'

export default function AdminPartnerships() {
  const [partnerships, setPartnerships] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  async function load() {
    const data = await getAllPartnerships()
    setPartnerships(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function setStatus(id, status) {
    await updatePartnershipStatus(id, status)
    load()
    if (selected?.id === id) setSelected(p => ({ ...p, status }))
  }

  function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) }

  const filtered = filter === 'all' ? partnerships : partnerships.filter(p => p.status === filter)

  const statusBadge = { pending: 'badge-yellow', approved: 'badge-green', declined: 'badge-red' }

  return (
    <div>
      <div className="admin-header">
        <h1>Partnerships</h1>
        <p>Review, approve, and manage partnership applications.</p>
      </div>

      <div style={{display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
        {['all','pending','approved','declined'].map(f => (
          <button
            key={f}
            onClick={()=>setFilter(f)}
            style={{padding:'7px 18px',borderRadius:'3px',border:`2px solid ${filter===f ? 'var(--amber)' : 'var(--sand-dark)'}`,background:filter===f ? 'var(--amber)' : 'white',color:filter===f ? 'white' : 'var(--text-mid)',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:600,cursor:'pointer',textTransform:'capitalize'}}
          >{f} {f==='all' ? `(${partnerships.length})` : `(${partnerships.filter(p=>p.status===f).length})`}</button>
        ))}
      </div>

      {loading ? <p style={{color:'var(--text-light)'}}>Loading...</p> : (
        <div style={{display:'grid',gridTemplateColumns:selected ? '1fr 1.4fr' : '1fr',gap:'20px'}}>
          <div className="admin-card" style={{padding:0,overflow:'hidden'}}>
            {filtered.length === 0 ? (
              <p style={{color:'var(--text-light)',textAlign:'center',padding:'40px 20px'}}>No {filter !== 'all' ? filter : ''} partnerships.</p>
            ) : (
              filtered.map(p => (
                <div
                  key={p.id}
                  onClick={()=>setSelected(selected?.id === p.id ? null : p)}
                  style={{padding:'16px 20px',borderBottom:'1px solid var(--sand)',cursor:'pointer',background:selected?.id===p.id ? 'rgba(198,139,60,0.08)' : 'white',borderLeft:selected?.id===p.id ? '3px solid var(--amber)' : '3px solid transparent',transition:'all 0.15s'}}
                >
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px',marginBottom:'6px'}}>
                    <p style={{fontWeight:600,color:'var(--brown)',fontSize:'14px'}}>{p.name}</p>
                    <span className={`badge ${statusBadge[p.status] || 'badge-yellow'}`}>{p.status || 'pending'}</span>
                  </div>
                  <p style={{fontSize:'12px',color:'var(--text-light)'}}>{p.org || 'Individual'} · {p.tier}</p>
                  <p style={{fontSize:'12px',color:'var(--text-light)',marginTop:'2px'}}>{fmt(p.created_at)}</p>
                </div>
              ))
            )}
          </div>

          {selected && (
            <div className="admin-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
                <div>
                  <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'18px',marginBottom:'4px'}}>{selected.name}</h3>
                  <p style={{fontSize:'13px',color:'var(--text-light)'}}>{selected.org || 'Individual partner'}</p>
                </div>
                <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'var(--text-light)'}}>✕</button>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'20px'}}>
                {[
                  ['Email', selected.email],
                  ['Phone', selected.phone || '—'],
                  ['Tier', selected.tier],
                  ['Payment Method', selected.payment_method || '—'],
                  ['Status', selected.status || 'pending'],
                  ['Applied', fmt(selected.created_at)],
                ].map(([label, val]) => (
                  <div key={label} style={{padding:'10px 14px',background:'var(--sand)',borderRadius:'4px'}}>
                    <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-light)',marginBottom:'2px'}}>{label}</p>
                    <p style={{fontSize:'14px',color:'var(--text-dark)',fontWeight: label==='Status' ? 600 : 400,textTransform: label==='Status' ? 'capitalize' : 'none'}}>{val}</p>
                  </div>
                ))}
              </div>

              {selected.message && (
                <div style={{marginBottom:'20px'}}>
                  <p style={{fontSize:'12px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-light)',marginBottom:'8px'}}>Message</p>
                  <p style={{fontSize:'14px',color:'var(--text-mid)',lineHeight:1.7,background:'var(--sand)',padding:'14px',borderRadius:'4px'}}>{selected.message}</p>
                </div>
              )}

              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                <button className="btn-amber" onClick={()=>setStatus(selected.id,'approved')} disabled={selected.status==='approved'}>✓ Approve</button>
                <button
                  onClick={()=>setStatus(selected.id,'declined')}
                  disabled={selected.status==='declined'}
                  style={{background:'#fee2e2',color:'#991b1b',border:'none',padding:'10px 20px',borderRadius:'3px',fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:700,cursor:'pointer',letterSpacing:'0.05em',textTransform:'uppercase'}}
                >✕ Decline</button>
                <a href={`mailto:${selected.email}?subject=Your Partnership Application - Samburu Wellness`} className="btn-outline">Reply by Email</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
