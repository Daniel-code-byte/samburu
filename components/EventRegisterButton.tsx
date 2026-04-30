'use client'

import { useState } from 'react'
import { X, Ticket, CheckCircle, AlertCircle, Loader, Users, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/supabase'

function genTicket(eventId: string) {
  const prefix = 'SWR'
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${prefix}-${rand}`
}

export default function EventRegisterButton({ event }: { event: Post }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'form' | 'payment' | 'done'>('form')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ticket, setTicket] = useState('')

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [mpesa, setMpesa] = useState('')

  const isPaid = event.event_type === 'paid'

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError('Name and email are required.'); return }
    if (isPaid && step === 'form') { setStep('payment'); return }
    if (isPaid && !mpesa) { setError('Please enter your M-Pesa confirmation code.'); return }
    setSaving(true); setError('')
    try {
      const ticketNumber = genTicket(event.id)
      const { error: err } = await supabase.from('event_registrations').insert([{
        event_id: event.id,
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        mpesa_code: isPaid ? mpesa : null,
        ticket_number: ticketNumber,
        status: isPaid ? 'pending_verification' : 'confirmed',
      }])
      if (err) throw err
      setTicket(ticketNumber)
      setStep('done')
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed. Please try again.')
    }
    setSaving(false)
  }

  const reset = () => {
    setOpen(false); setStep('form'); setError('')
    setForm({ name: '', email: '', phone: '' }); setMpesa(''); setTicket('')
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.9rem',
    border: '1px solid #D0D8DA', borderRadius: 2,
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
    outline: 'none', background: '#FAFCFC',
  }
  const lbl: React.CSSProperties = {
    fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600,
  }

  return (
    <>
      {/* ── Trigger button ── */}
      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: isPaid ? 'var(--rust)' : 'var(--teal)',
            color: '#fff', padding: '0.75rem 1.75rem',
            border: 'none', cursor: 'pointer', fontSize: '0.9rem',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
            letterSpacing: '0.04em', transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {isPaid ? <><Lock size={15} /> Register &amp; Pay</> : <><Users size={15} /> Register for Free</>}
        </button>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          {isPaid ? `Entry fee: KES ${event.event_price?.toLocaleString()} — Pay via M-Pesa` : 'Free registration — secure your spot now'}
        </p>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }} onClick={e => { if (e.target === e.currentTarget) reset() }}>
          <div style={{
            background: '#fff', maxWidth: 480, width: '100%',
            padding: '2rem', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            <button onClick={reset} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              <X size={18} />
            </button>

            {/* Done state */}
            {step === 'done' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle size={52} color="#2A9D5C" style={{ margin: '0 auto 1rem' }} />
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                  {isPaid ? 'Registration Received!' : 'You\'re Registered!'}
                </h2>
                {isPaid ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                    Your registration is pending payment verification. We will confirm your spot once your M-Pesa payment is verified.
                  </p>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                    Your spot is confirmed! See you at the event.
                  </p>
                )}
                {/* Ticket */}
                <div style={{ background: 'var(--teal-deep)', color: '#fff', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <Ticket size={22} style={{ opacity: 0.7 }} />
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>Your Ticket Number</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600, letterSpacing: '0.15em' }}>{ticket}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.55 }}>Save this number — present it at the event</div>
                </div>
                <button onClick={reset} style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif' }}>
                  Close
                </button>
              </div>
            )}

            {/* Payment step */}
            {step === 'payment' && (
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginBottom: '0.5rem' }}>Complete Payment</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                  Send <strong style={{ color: 'var(--rust)' }}>KES {event.event_price?.toLocaleString()}</strong> via M-Pesa to the number below, then enter your confirmation code.
                </p>
                <div style={{ background: 'var(--sand)', border: '1px solid var(--border)', padding: '1rem 1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.4rem' }}>M-Pesa Pay To</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 600, letterSpacing: '0.1em' }}>0708 588 479</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Samburu Wellness Resilience</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={lbl}>M-Pesa Confirmation Code *</label>
                  <input style={fieldStyle} placeholder="e.g. QFB3X7K9OP" value={mpesa} onChange={e => setMpesa(e.target.value.toUpperCase())} />
                </div>
                {error && <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--rust)', fontSize: '0.82rem', marginBottom: '0.75rem' }}><AlertCircle size={14} />{error}</div>}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setStep('form')} style={{ flex: 1, padding: '0.65rem', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif' }}>Back</button>
                  <button onClick={handleSubmit} disabled={saving} style={{ flex: 2, padding: '0.65rem', background: 'var(--rust)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Confirming…</> : 'Confirm Registration'}
                  </button>
                </div>
              </div>
            )}

            {/* Form step */}
            {step === 'form' && (
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginBottom: '0.25rem' }}>
                  {isPaid ? 'Register for this Event' : 'Register — Free'}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>{event.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={lbl}>Full Name *</label>
                    <input style={fieldStyle} placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={lbl}>Email Address *</label>
                    <input type="email" style={fieldStyle} placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label style={lbl}>Phone (optional)</label>
                    <input type="tel" style={fieldStyle} placeholder="07XX XXX XXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                {error && <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--rust)', fontSize: '0.82rem', marginBottom: '0.75rem' }}><AlertCircle size={14} />{error}</div>}
                <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '0.75rem', background: isPaid ? 'var(--rust)' : 'var(--teal)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Processing…</> : isPaid ? 'Next — Proceed to Payment' : 'Confirm Registration'}
                </button>
              </div>
            )}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      )}
    </>
  )
}
