'use client'
import { useState, useEffect } from 'react'
import { getAllMessages } from '@/lib/supabase'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getAllMessages()
      setMessages(data)
      setLoading(false)
    }
    load()
  }, [])

  function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) }

  return (
    <div>
      <div className="admin-header">
        <h1>Messages</h1>
        <p>Incoming contact form messages from your website visitors.</p>
      </div>

      {loading ? <p style={{color:'var(--text-light)'}}>Loading messages...</p> : (
        <div style={{display:'grid',gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr',gap:'20px'}}>
          <div className="admin-card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid var(--sand-dark)',background:'var(--sand)'}}>
              <p style={{fontWeight:600,color:'var(--brown)',fontSize:'15px'}}>Inbox ({messages.length})</p>
            </div>
            {messages.length === 0 ? (
              <p style={{color:'var(--text-light)',textAlign:'center',padding:'40px 20px'}}>No messages yet.</p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={()=>setSelected(selected?.id === msg.id ? null : msg)}
                  style={{padding:'16px 20px',borderBottom:'1px solid var(--sand)',cursor:'pointer',background: selected?.id === msg.id ? 'rgba(198,139,60,0.08)' : 'white',borderLeft: selected?.id === msg.id ? '3px solid var(--amber)' : '3px solid transparent',transition:'all 0.15s'}}
                >
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
                    <p style={{fontWeight:600,color:'var(--brown)',fontSize:'14px'}}>{msg.name}</p>
                    <p style={{fontSize:'11px',color:'var(--text-light)',whiteSpace:'nowrap'}}>{fmt(msg.created_at)}</p>
                  </div>
                  <p style={{fontSize:'13px',color:'var(--text-mid)',marginTop:'2px',fontWeight:500}}>{msg.subject || '(No subject)'}</p>
                  <p style={{fontSize:'12px',color:'var(--text-light)',marginTop:'4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{msg.message}</p>
                </div>
              ))
            )}
          </div>

          {selected && (
            <div className="admin-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
                <div>
                  <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'18px',marginBottom:'4px'}}>{selected.subject || '(No subject)'}</h3>
                  <p style={{fontSize:'13px',color:'var(--text-light)'}}>From: <strong>{selected.name}</strong> · {selected.email}</p>
                </div>
                <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'var(--text-light)'}}>✕</button>
              </div>
              <div style={{background:'var(--sand)',borderRadius:'6px',padding:'20px',marginBottom:'20px'}}>
                <p style={{fontSize:'15px',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.message}</p>
              </div>
              <div style={{fontSize:'13px',color:'var(--text-light)',marginBottom:'20px'}}>
                <p>📧 {selected.email}</p>
                {selected.phone && <p>📞 {selected.phone}</p>}
                <p>🕐 {fmt(selected.created_at)}</p>
              </div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message to Samburu Wellness'}`} className="btn-amber" style={{display:'inline-block'}}>Reply via Email</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
