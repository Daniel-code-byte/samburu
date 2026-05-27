'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/photos', label: 'Photos', icon: '📷' },
  { href: '/admin/posts', label: 'Posts & Events', icon: '📝' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/join-requests', label: 'Join Requests', icon: '👥' },
  { href: '/admin/partnerships', label: 'Partnerships', icon: '🤝' },
]

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthed(sessionStorage.getItem('swadmin') === '1')
    }
  }, [])

  function login(e) {
    e.preventDefault()
    if (pw === 'admin987') {
      sessionStorage.setItem('swadmin', '1')
      setAuthed(true)
    } else {
      setErr('Incorrect password. Please try again.')
    }
  }

  if (!authed) {
    return (
      <div style={{minHeight:'100vh',background:'var(--brown)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
        <div style={{background:'white',borderRadius:'8px',padding:'48px',width:'100%',maxWidth:'420px',textAlign:'center'}}>
          <div style={{width:'56px',height:'56px',background:'var(--amber)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'24px',fontFamily:'Playfair Display,serif',fontWeight:700,color:'white'}}>SW</div>
          <h2 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'24px',marginBottom:'6px'}}>Admin Access</h2>
          <p style={{color:'var(--text-light)',fontSize:'14px',marginBottom:'28px'}}>Samburu Wellness & Resilience</p>
          <form onSubmit={login}>
            <input
              type="password"
              placeholder="Enter admin password"
              className="form-input"
              value={pw}
              onChange={e=>{ setPw(e.target.value); setErr('') }}
              style={{marginBottom:'16px',textAlign:'center'}}
            />
            {err && <p style={{color:'#c0392b',fontSize:'13px',marginBottom:'12px'}}>{err}</p>}
            <button type="submit" className="btn-amber" style={{width:'100%',padding:'12px'}}>Enter Dashboard</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>Samburu Wellness</h2>
          <span>Admin Dashboard</span>
        </div>
        <nav className="admin-nav">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item${pathname === item.href ? ' active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{padding:'16px 24px',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
          <a href="/" style={{fontSize:'13px',color:'rgba(253,250,244,0.5)',display:'flex',alignItems:'center',gap:'6px'}}>← Back to Site</a>
          <button onClick={()=>{ sessionStorage.removeItem('swadmin'); setAuthed(false) }} style={{marginTop:'10px',fontSize:'13px',color:'rgba(253,250,244,0.4)',background:'none',border:'none',cursor:'pointer',padding:0}}>Log Out</button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
