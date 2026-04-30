'use client'

import { useState } from 'react'
import { Heart, Users, Leaf, Star, CheckCircle, Send, AlertCircle } from 'lucide-react'
import { submitJoinRequest, checkAlreadyJoined } from '@/lib/supabase'

type Status = 'idle' | 'checking' | 'sending' | 'success' | 'already' | 'error'

const INTERESTS = ['Volunteer', 'Donate', 'Spread the Word', 'Partner with Us', 'Community Member', 'Researcher / Student', 'Other']

const WHY = [
  { icon: Heart,  title: 'Make a real difference', body: 'Your involvement directly helps Samburu people access mental health awareness and support.' },
  { icon: Users,  title: 'Join a movement',         body: 'Be part of a growing network committed to mental health dignity in Samburu County.' },
  { icon: Leaf,   title: 'Honour culture',          body: 'Our approach respects and is guided by Samburu identity, traditions and ways of knowing.' },
  { icon: Star,   title: 'Build something lasting', body: 'We work for the long term — your contribution creates change that endures.' },
]

export default function JoinPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: 'Volunteer', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.email) return
    setStatus('checking')
    try {
      // Check duplicate
      const already = await checkAlreadyJoined(form.email)
      if (already) { setStatus('already'); return }
      setStatus('sending')
      await submitJoinRequest({ name: form.name, email: form.email, phone: form.phone || null, interest: form.interest, message: form.message || null })
      setStatus('success')
    } catch { setStatus('error') }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.9rem',
    border: '1px solid #D0D8DA', borderRadius: 2,
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', outline: 'none',
  }
  const lbl: React.CSSProperties = { fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--teal-deep)', padding: 'clamp(3rem,8vw,6rem) 1.5rem clamp(2.5rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Get Involved</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem,6vw,4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: '1.25rem' }}>
            Join the<br /><em>Samburu family</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.9rem,2.5vw,1.05rem)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Whether you volunteer, donate, or spread awareness — your involvement directly supports mental health in Samburu County.
          </p>
        </div>
      </section>

      {/* Why join */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="eyebrow">Why Join</div>
            <div className="teal-rule" style={{ margin: '0.75rem auto 0' }} />
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 300, marginTop: '0.5rem' }}>Your presence matters</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
            {WHY.map((w) => {
              const Icon = w.icon
              return (
                <div key={w.title} className="sw-card" style={{ padding: '1.5rem' }}>
                  <div style={{ width: 44, height: 44, background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Icon size={20} color="var(--teal)" />
                  </div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{w.title}</h3>
                  <p style={{ fontSize: '0.87rem', lineHeight: 1.65, color: 'var(--body)' }}>{w.body}</p>
                </div>
              )
            })}
          </div>

          {/* ── Join form ── */}
          <div style={{ maxWidth: 580, margin: '0 auto' }}>
            <div className="sw-card" style={{ padding: 'clamp(1.5rem,4vw,2.5rem)' }}>

              {/* SUCCESS */}
              {status === 'success' && (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ width: 60, height: 60, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <CheckCircle size={30} color="#2A9D5C" />
                  </div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, marginBottom: '0.75rem' }}>Welcome to the family!</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.75 }}>
                    Thank you, <strong>{form.name}</strong>! Your request has been received. Our team will be in touch with you soon.
                  </p>
                </div>
              )}

              {/* ALREADY JOINED */}
              {status === 'already' && (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ width: 60, height: 60, background: 'var(--teal-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <Heart size={28} color="var(--teal)" />
                  </div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, marginBottom: '0.75rem' }}>You're already with us!</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.75 }}>
                    We already have a request from <strong>{form.email}</strong>. Our team will reach out soon. Thank you for your enthusiasm!
                  </p>
                </div>
              )}

              {/* FORM */}
              {(status === 'idle' || status === 'checking' || status === 'sending' || status === 'error') && (
                <>
                  <div style={{ marginBottom: '1.75rem' }}>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 300, marginBottom: '0.4rem' }}>Sign up to join us</h2>
                    <p style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>Fill in your details and we'll be in touch.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={lbl}>Full Name *</label>
                      <input style={fieldStyle} placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div>
                      <label style={lbl}>Email Address *</label>
                      <input type="email" style={fieldStyle} placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div>
                      <label style={lbl}>Phone (optional)</label>
                      <input type="tel" style={fieldStyle} placeholder="07XX XXX XXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                    <div>
                      <label style={lbl}>How do you want to help?</label>
                      <select style={fieldStyle} value={form.interest} onChange={e => set('interest', e.target.value)}>
                        {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Message (optional)</label>
                      <textarea style={{ ...fieldStyle, minHeight: 90, resize: 'vertical' }} placeholder="Tell us more about how you'd like to get involved…" value={form.message} onChange={e => set('message', e.target.value)} />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#C0472A', fontSize: '0.82rem', background: '#FFF0EE', padding: '0.65rem 0.75rem', marginBottom: '0.75rem' }}>
                      <AlertCircle size={14} /> Something went wrong. Please try again.
                    </div>
                  )}

                  <button
                    onClick={submit}
                    disabled={!form.name || !form.email || status === 'checking' || status === 'sending'}
                    style={{
                      width: '100%', padding: '0.8rem 1.5rem',
                      background: 'var(--teal)', color: '#fff',
                      border: 'none', cursor: (!form.name || !form.email) ? 'not-allowed' : 'pointer',
                      fontSize: '0.92rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: (!form.name || !form.email) ? 0.5 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {(status === 'checking' || status === 'sending')
                      ? <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />{status === 'checking' ? 'Checking…' : 'Sending…'}</>
                      : <><Send size={15} /> Join Samburu Wellness Resilience</>
                    }
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
