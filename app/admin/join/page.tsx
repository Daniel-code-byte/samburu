'use client'

import { useEffect, useState } from 'react'
import { Users, Calendar, Phone, Mail } from 'lucide-react'
import { adminGetJoinRequests } from '@/lib/supabase'

type JoinReq = { id: string; name: string; email: string; phone: string | null; interest: string; message: string | null; created_at: string }

export default function AdminJoin() {
  const [requests, setRequests] = useState<JoinReq[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetJoinRequests().then((data) => { setRequests(data as JoinReq[]); setLoading(false) })
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Join Requests</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{requests.length} people who want to get involved</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading…</div>
      ) : requests.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
          <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No join requests yet</p>
          <p style={{ fontSize: '0.85rem' }}>When people sign up via the "Join Us" page, they appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {requests.map((r) => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid #E2E8EA', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.95rem' }}>{r.name}</div>
                <span style={{ fontSize: '0.68rem', background: '#EDE9FE', color: '#7C3AED', padding: '0.15rem 0.5rem', whiteSpace: 'nowrap' }}>{r.interest}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: r.message ? '0.75rem' : 0 }}>
                <a href={`mailto:${r.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--teal)', textDecoration: 'none' }}>
                  <Mail size={12} /> {r.email}
                </a>
                {r.phone && (
                  <a href={`tel:${r.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none' }}>
                    <Phone size={12} /> {r.phone}
                  </a>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.74rem', color: 'var(--muted)' }}>
                  <Calendar size={11} /> {new Date(r.created_at).toLocaleDateString('en-KE')}
                </div>
              </div>
              {r.message && (
                <div style={{ background: '#F8FAFA', padding: '0.75rem', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--body)', borderLeft: '2px solid var(--teal-pale)' }}>
                  {r.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
