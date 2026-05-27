'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ photos:0, posts:0, messages:0, joins:0, partnerships:0 })

  useEffect(() => {
    async function fetchCounts() {
      const tables = ['photos','posts','messages','join_requests','partnerships']
      const results = await Promise.all(tables.map(t => supabase.from(t).select('id', { count:'exact', head:true })))
      setCounts({
        photos: results[0].count || 0,
        posts: results[1].count || 0,
        messages: results[2].count || 0,
        joins: results[3].count || 0,
        partnerships: results[4].count || 0,
      })
    }
    fetchCounts()
  }, [])

  const stats = [
    { label: 'Photos', value: counts.photos, icon: '📷', href: '/admin/photos', color: '#C68B3C' },
    { label: 'Posts', value: counts.posts, icon: '📝', href: '/admin/posts', color: '#2C1810' },
    { label: 'Messages', value: counts.messages, icon: '✉️', href: '/admin/messages', color: '#5C3D2E' },
    { label: 'Join Requests', value: counts.joins, icon: '👥', href: '/admin/join-requests', color: '#8B6355' },
    { label: 'Partnerships', value: counts.partnerships, icon: '🤝', href: '/admin/partnerships', color: '#C68B3C' },
  ]

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here's an overview of your site content.</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',gap:'20px',marginBottom:'32px'}}>
        {stats.map(s => (
          <a key={s.label} href={s.href} style={{display:'block',background:'white',borderRadius:'8px',padding:'24px',boxShadow:'0 2px 12px rgba(44,24,16,0.07)',borderTop:`4px solid ${s.color}`,textDecoration:'none'}}>
            <div style={{fontSize:'28px',marginBottom:'8px'}}>{s.icon}</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'32px',fontWeight:700,color:'var(--brown)',lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:'13px',color:'var(--text-light)',marginTop:'4px',fontWeight:500}}>{s.label}</div>
          </a>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
        <div className="admin-card">
          <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'18px',marginBottom:'16px'}}>Quick Actions</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {[
              { label:'Upload New Photo', href:'/admin/photos' },
              { label:'Write New Post', href:'/admin/posts' },
              { label:'View Messages', href:'/admin/messages' },
              { label:'Review Partnerships', href:'/admin/partnerships' },
            ].map(a => (
              <a key={a.label} href={a.href} className="btn-outline" style={{textAlign:'center',display:'block'}}>{a.label}</a>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--brown)',fontSize:'18px',marginBottom:'16px'}}>Site Info</h3>
          <p style={{fontSize:'14px',color:'var(--text-mid)',marginBottom:'8px'}}>🌍 <strong>URL:</strong> samburuwellness.org</p>
          <p style={{fontSize:'14px',color:'var(--text-mid)',marginBottom:'8px'}}>📧 <strong>Email:</strong> info@samburuwellness.org</p>
          <p style={{fontSize:'14px',color:'var(--text-mid)',marginBottom:'8px'}}>📞 <strong>Phone:</strong> +254 704 579 936</p>
          <p style={{fontSize:'14px',color:'var(--text-mid)',marginBottom:'8px'}}>🗄️ <strong>Database:</strong> Supabase</p>
          <div style={{marginTop:'20px',padding:'12px',background:'var(--sand)',borderRadius:'6px'}}>
            <p style={{fontSize:'13px',color:'var(--text-mid)'}}>All pages use <code style={{background:'rgba(44,24,16,0.08)',padding:'1px 5px',borderRadius:'3px'}}>revalidate = 0</code> — content updates appear instantly.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
