'use client'

import { useEffect, useState } from 'react'
import { Mail, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { adminGetMessages } from '@/lib/supabase'

type Msg = { id: string; name: string; email: string; subject: string; body: string; created_at: string }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    adminGetMessages().then((data) => { setMessages(data as Msg[]); setLoading(false) })
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Messages</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{messages.length} contact form submissions</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading messages…</div>
      ) : messages.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8EA', padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
          <Mail size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No messages yet</p>
          <p style={{ fontSize: '0.85rem' }}>When people fill the contact form, their messages appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {messages.map((m) => (
            <div key={m.id} style={{ background: '#fff', border: '1px solid #E2E8EA', overflow: 'hidden' }}>
              <div
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', gap: '1rem' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem' }}>{m.name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--teal)' }}>{m.email}</span>
                    <span style={{ fontSize: '0.72rem', background: 'var(--teal-pale)', color: 'var(--teal)', padding: '0.1rem 0.45rem' }}>{m.subject}</span>
                  </div>
                  {expanded !== m.id && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.body}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={11} /> {new Date(m.created_at).toLocaleDateString('en-KE')}
                  </span>
                  {expanded === m.id ? <ChevronUp size={15} color="var(--muted)" /> : <ChevronDown size={15} color="var(--muted)" />}
                </div>
              </div>
              {expanded === m.id && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #F0F4F5' }}>
                  <div style={{ background: '#F8FAFA', padding: '1rem', marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--body)', whiteSpace: 'pre-wrap' }}>
                    {m.body}
                  </div>
                  <a href={`mailto:${m.email}?subject=Re: ${m.subject}`} className="btn-primary" style={{ marginTop: '0.75rem', display: 'inline-flex', fontSize: '0.8rem', padding: '0.45rem 1rem' }}>
                    Reply by email
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
