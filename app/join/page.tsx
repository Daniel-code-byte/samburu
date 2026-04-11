'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Users, Leaf, Star, CheckCircle, Send } from 'lucide-react'
import { submitJoinRequest } from '@/lib/supabase'

type Status = 'idle' | 'sending' | 'success' | 'error'

const INTERESTS = ['Volunteer', 'Donate', 'Spread the Word', 'Partner with Us', 'Community Member', 'Researcher / Student', 'Other']

const WHY = [
  { icon: Heart, title: 'Make a real difference', body: 'Your involvement directly helps Samburu people access mental health awareness and support.' },
  { icon: Users, title: 'Join a movement', body: 'Be part of a growing network of people committed to mental health dignity in Samburu County.' },
  { icon: Leaf, title: 'Honour culture', body: 'Our mental health approach respects and is guided by Samburu identity, traditions and ways of knowing.' },
  { icon: Star, title: 'Build something lasting', body: 'We work for the long term — your contribution creates change that endures.' },
]

export default function JoinPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: 'Volunteer', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.email) return
    setStatus('sending')
    try {
      await submitJoinRequest({ name: form.name, email: form.email, phone: form.phone || null, interest: form.interest, message: form.message || null })
      setStatus('success')
    } catch { setStatus('error') }
  }

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--teal-deep)', padding: '6rem 2rem 5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Get Involved</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Join the<br /><em>Samburu family</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Whether you volunteer, donate, or spread awareness — your involvement directly supports mental health in Samburu County.
          </p>
        </div>
      </section>

      {/* Why join */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="eyebrow">Why Join</div>
            <div className="teal-rule" style={{ margin: '0.75rem auto 0' }} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, marginTop: '0.5rem' }}>Your presence matters</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
            {WHY.map((w) => {
              const Icon = w.icon
              return (
                <div key={w.title} className="sw-card" style={{ padding: '1.75rem' }}>
                  <div style={{ width: 44, height: 44, background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Icon size={20} color="var(--teal)" />
                  </div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.6rem' }}>{w.title}</h3>
                  <p style={{ fontSize: '0.87rem', lineHeight: 1.65, color: 'var(--muted)' }}>{w.body}</p>
                </div>
              )
            })}
          </div>

          {/* Sign up form */}
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--white)', border: '1px solid var(--border)' }}>
                <CheckCircle size={52} color="var(--sage)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '0.75rem' }}>Welcome aboard!</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Thank you for signing up. Our team will be in touch with you soon about how you can get involved.
                </p>
                <Link href="/" className="btn-primary">Back to Home</Link>
              </div>
            ) : (
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', padding: '2.5rem' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginBottom: '0.4rem' }}>Sign me up</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '2rem' }}>Fill in your details and we'll reach out about next steps.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.73rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Full Name *</label>
                      <input className="field" placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.73rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Email *</label>
                      <input className="field" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.73rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Phone (optional)</label>
                    <input className="field" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.73rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.6rem' }}>How would you like to help?</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {INTERESTS.map((i) => (
                        <button key={i} onClick={() => set('interest', i)} style={{
                          padding: '0.38rem 0.9rem', fontSize: '0.78rem',
                          fontFamily: 'DM Sans, sans-serif',
                          border: `1.5px solid ${form.interest === i ? 'var(--teal)' : 'var(--border-md)'}`,
                          background: form.interest === i ? 'var(--teal)' : 'transparent',
                          color: form.interest === i ? '#fff' : 'var(--body)',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>{i}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.73rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.35rem' }}>Message (optional)</label>
                    <textarea className="field" rows={3} placeholder="Tell us a bit about yourself or how you'd like to help..." value={form.message} onChange={(e) => set('message', e.target.value)} style={{ resize: 'vertical' }} />
                  </div>

                  {status === 'error' && <p style={{ color: 'var(--rust)', fontSize: '0.83rem' }}>Something went wrong. Please try again.</p>}

                  <button onClick={submit} disabled={status === 'sending' || !form.name || !form.email} className="btn-primary" style={{ justifyContent: 'center', opacity: (!form.name || !form.email) ? 0.5 : 1 }}>
                    {status === 'sending' ? 'Submitting…' : <><Send size={14} /> Submit</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
