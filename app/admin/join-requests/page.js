'use client'
import { useState, useEffect } from 'react'
import { getAllJoinRequests } from '@/lib/supabase'

export default function AdminJoinRequests() {
  const [requests, setRequests] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getAllJoinRequests()
      setRequests(data)
      setLoading(false)
    }
    load()
  }, [])

  function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) }

  return (
    <div>
      <div className="admin-header">
        <h1>Join Requests</h1>
        <p>Applications from people who want to join your team or volunteer.</p>
      </div>

      {loading ? <p style={{color:'var(--text-light)'}}>Loading...</p> : (
        <>
          <div className="admin-card">
            <p style={{color:'var(--text-light)',fontSize:'14px',marginBottom:'16px'}}>{requests.length} application{requests.length !== 1 ? 's' : ''} received</p>
            {requests.length === 0 ? (
              <p style={{color:'var(--text-light)',textAlign:'center',padding:'40px 0'}}>No join requests yet.</p>
            ) : (
              <div style={{overflowX:'auto'}}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(r => (
                      <tr key={r.id}>
                        <td style={{fontWeight:600}}>{r.name}</td>
                        <td><a href={`mailto:${r.email}`} style={{color:'var(--amber)'}}>{r.email}</a></td>
                        <td>{r.role || '—'}</td>
                        <td>{r.location || '—'}</td>
                        <td style={{whiteSpace:'nowrap'}}>{fmt(r.created_at)}</td>
                        <td>
                          <button
                            onClick={()=>setSelected(selected?.id === r.id ? null : r)}
                            style={{fontSize:'12px',padding:'4px 12px',background:'var(--sand)',border:'1px solid var(--sand-dark)',borderRadius:'3px',cursor:'pointer',fontFamily:'Outfit,sans-serif'}}
                          >View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selected && (
            <div className="admin-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
                <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'18px'}}>Application: {selected.name}</h3>
                <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'var(--text-light)'}}>✕</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
                {[
                  ['Email', selected.email],
                  ['Phone', selected.phone || '—'],
                  ['Role Applied For', selected.role || '—'],
                  ['Location', selected.location || '—'],
                  ['Date Applied', fmt(selected.created_at)],
                ].map(([label, val]) => (
                  <div key={label} style={{padding:'12px',background:'var(--sand)',borderRadius:'4px'}}>
                    <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-light)',marginBottom:'4px'}}>{label}</p>
                    <p style={{fontSize:'14px',color:'var(--text-dark)'}}>{val}</p>
                  </div>
                ))}
              </div>
              {selected.skills && (
                <div style={{marginBottom:'16px'}}>
                  <p style={{fontSize:'12px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-light)',marginBottom:'8px'}}>Skills & Experience</p>
                  <p style={{fontSize:'14px',color:'var(--text-mid)',lineHeight:1.7,background:'var(--sand)',padding:'14px',borderRadius:'4px'}}>{selected.skills}</p>
                </div>
              )}
              {selected.motivation && (
                <div style={{marginBottom:'20px'}}>
                  <p style={{fontSize:'12px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-light)',marginBottom:'8px'}}>Motivation</p>
                  <p style={{fontSize:'14px',color:'var(--text-mid)',lineHeight:1.7,background:'var(--sand)',padding:'14px',borderRadius:'4px'}}>{selected.motivation}</p>
                </div>
              )}
              <a href={`mailto:${selected.email}?subject=Your Application to Samburu Wellness & Resilience`} className="btn-amber" style={{display:'inline-block'}}>Contact Applicant</a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
