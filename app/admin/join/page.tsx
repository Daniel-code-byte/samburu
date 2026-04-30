'use client'

import { useEffect, useState } from 'react'
import { Users, Calendar, Phone, Mail, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type JoinReq = { id: string; name: string; email: string; phone: string | null; interest: string; message: string | null; created_at: string }

const INTEREST_COLORS: Record<string, string> = {
  'Volunteer': '#1A7A8A',
  'Donate': '#2A9D5C',
  'Spread the Word': '#7C3AED',
  'Partner with Us': '#C0472A',
  'Community Member': '#D97706',
  'Researcher / Student': '#0EA5E9',
  'Other': '#6B7280',
}

export default function AdminJoin() {
  const [requests, setRequests] = useState<JoinReq[]>([])
  const [filtered, setFiltered] = useState<JoinReq[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterInterest, setFilterInterest] = useState('All')

  useEffect(() => {
    supabase.from('join_requests').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setRequests(data ?? []); setFiltered(data ?? []); setLoading(false) })
  }, [])

  useEffect(() => {
    let res = requests
    if (search) res = res.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()))
    if (filterInterest !== 'All') res = res.filter(r => r.interest === filterInterest)
    setFiltered(res)
  }, [search, filterInterest, requests])

  const interests = ['All', ...Array.from(new Set(requests.map(r => r.interest)))]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Members &amp; Join Requests</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{requests.length} people who want to get involved</p>
      </div>

      {/* Filters */}
      {requests.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9AACAF' }} />
            <input
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2rem', border: '1px solid #D0D8DA', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', borderRadius: 2 }}
            />
          </div>
          <select value={filterInterest} onChange={e => setFilterInterest(e.target.value)}
            style={{ padding: '0.55rem 0.75rem', border: '1px solid #D0D8DA', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', borderRadius: 2 }}>
            {interests.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{filtered.length} shown</div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading…</div>
      ) : requests.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
          <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No members yet</p>
          <p style={{ fontSize: '0.85rem' }}>When people sign up via the "Join Us" page, they appear here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E2E8EA', padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ fontSize: '0.9rem' }}>No results match your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
          {filtered.map((r) => {
            const color = INTEREST_COLORS[r.interest] ?? '#6B7280'
            return (
              <div key={r.id} style={{ background: '#fff', border: '1px solid #E2E8EA', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.95rem' }}>{r.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                      <Calendar size={10} /> {new Date(r.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.66rem', background: color + '18', color, padding: '0.2rem 0.6rem', fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{r.interest}</span>
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
                </div>
                {r.message && (
                  <div style={{ background: '#F8FAFA', padding: '0.65rem 0.75rem', fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--body)', borderLeft: '2px solid var(--teal-pale)', marginTop: '0.5rem' }}>
                    {r.message}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
