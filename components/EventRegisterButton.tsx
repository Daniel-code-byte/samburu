'use client'

import { useState } from 'react'
import { X, Users, Lock, Loader, AlertCircle, Clock, Search } from 'lucide-react'
import { supabase, checkAlreadyRegistered, getApprovedTicket } from '@/lib/supabase'
import EventTicket from '@/components/EventTicket'
import type { Post, EventRegistration } from '@/lib/supabase'

function genTicketNumber() {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  const rand2 = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `SWR-${rand}-${rand2}`
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

export default function EventRegisterButton({ event }: { event: Post }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'form' | 'payment' | 'pending' | 'ticket' | 'retrieve'>('form')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [approvedReg, setApprovedReg] = useState<EventRegistration | null>(null)

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [mpesa, setMpesa] = useState('')
  const [retrieveEmail, setRetrieveEmail] = useState('')

  const isPaid = event.event_type === 'paid'

  const reset = () => {
    setOpen(false); setStep('form'); setError('')
    setForm({ name: '', email: '', phone: '' })
    setMpesa(''); setApprovedReg(null); setRetrieveEmail('')
  }

  const handleFormNext = async () => {
    if (!form.name || !form.email) { setError('Name and email are required.'); return }
    setError(''); setSaving(true)
    // Check duplicate
    const already = await checkAlreadyRegistered(event.id, form.email)
    if (already) {
      // Check if they have an approved ticket
      const approved = await getApprovedTicket(event.id, form.email)
      setSaving(false)
      if (approved) {
        setApprovedReg(approved)
        setStep('ticket')
      } else {
        setError('You have already registered for this event. Your ticket is pending approval — check back soon.')
      }
      return
    }
    setSaving(false)
    if (isPaid) { setStep('payment') } else { await submitRegistration() }
  }

  const submitRegistration = async () => {
    setSaving(true); setError('')
    try {
      const ticketNumber = genTicketNumber()
      // Free registration = auto-confirmed. Paid = pending_verification
      const status = isPaid ? 'pending_verification' : 'confirmed'
      const { data, error: err } = await supabase.from('event_registrations').insert([{
        event_id: event.id,
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        mpesa_code: isPaid ? mpesa : null,
        ticket_number: ticketNumber,
        status,
      }]).select().single()
      if (err) throw err
      if (status === 'confirmed') {
        setApprovedReg(data)
        setStep('ticket')
      } else {
        setStep('pending')
      }
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed. Please try again.')
    }
    setSaving(false)
  }

  const handleRetrieve = async () => {
    if (!retrieveEmail) { setError('Enter your email.'); return }
    setSaving(true); setError('')
    const approved = await getApprovedTicket(event.id, retrieveEmail)
    setSaving(false)
    if (approved) { setApprovedReg(approved); setStep('ticket') }
    else { setError('No confirmed ticket found for that email. Your payment may still be pending verification.') }
  }

  return (
    <>
      {/* Trigger buttons */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setOpen(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: isPaid ? '#C0472A' : 'var(--teal)', color: '#fff',
          padding: '0.75rem 1.75rem', border: 'none', cursor: 'pointer',
          fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {isPaid ? <><Lock size={15} /> Register &amp; Pay</> : <><Users size={15} /> Register — Free</>}
        </button>
        {/* Already registered? Retrieve ticket */}
        <button onClick={() => { setOpen(true); setStep('retrieve') }} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'underline',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Already registered? Get your ticket
        </button>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
        {isPaid ? `KES ${event.event_price?.toLocaleString()} · Pay via M-Pesa · Ticket issued after admin approval` : 'Free event — your ticket is issued instantly'}
      </p>

      {/* Modal */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', overflowY: 'auto',
        }} onClick={e => { if (e.target === e.currentTarget) reset() }}>
          <div style={{
            background: '#fff', maxWidth: step === 'ticket' ? 560 : 460,
            width: '100%', padding: '2rem', position: 'relative',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)', margin: 'auto',
          }}>
            <button onClick={reset} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              <X size={18} />
            </button>

            {/* ── TICKET STEP ── */}
            {step === 'ticket' && approvedReg && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '0.4rem' }}>Your ticket is confirmed</div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 300 }}>Here's your ticket</h2>
                </div>
                <EventTicket registration={approvedReg} event={event} />
              </div>
            )}

            {/* ── PENDING STEP ── */}
            {step === 'pending' && (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                <div style={{ width: 60, height: 60, background: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Clock size={28} color="#D97706" />
                </div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, marginBottom: '0.75rem' }}>Registration Received</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: 340, margin: '0 auto 1.5rem' }}>
                  We have received your payment details. Our team is verifying your M-Pesa payment. <strong>Your ticket will be ready within 10 minutes</strong> of verification.
                </p>
                <div style={{ background: 'var(--sand)', border: '1px solid var(--border)', padding: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.4rem' }}>M-Pesa you sent to</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600 }}>0708 588 479</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Samburu Wellness Resilience</div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
                  Come back and use <strong>"Already registered? Get your ticket"</strong> to download your ticket once approved.
                </p>
                <button onClick={reset} style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif' }}>
                  Close
                </button>
              </div>
            )}

            {/* ── RETRIEVE STEP ── */}
            {step === 'retrieve' && (
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginBottom: '0.4rem' }}>Retrieve Your Ticket</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.65 }}>Enter the email you registered with to get your ticket.</p>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={lbl}>Email Address</label>
                  <input style={fieldStyle} type="email" placeholder="your@email.com" value={retrieveEmail} onChange={e => { setRetrieveEmail(e.target.value); setError('') }} />
                </div>
                {error && <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#C0472A', fontSize: '0.82rem', marginBottom: '0.75rem', background: '#FFF0EE', padding: '0.65rem 0.75rem' }}><AlertCircle size={14} />{error}</div>}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => { setStep('form'); setError('') }} style={{ flex: 1, padding: '0.65rem', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif' }}>Back</button>
                  <button onClick={handleRetrieve} disabled={saving} style={{ flex: 2, padding: '0.65rem', background: 'var(--teal)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Checking…</> : <><Search size={14} /> Find My Ticket</>}
                  </button>
                </div>
              </div>
            )}

            {/* ── PAYMENT STEP ── */}
            {step === 'payment' && (
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginBottom: '0.5rem' }}>Complete Payment</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                  Send <strong style={{ color: '#C0472A' }}>KES {event.event_price?.toLocaleString()}</strong> via M-Pesa, then enter the confirmation code.
                </p>
                <div style={{ background: 'linear-gradient(135deg, #0D3D49, #1A6475)', color: '#fff', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55, marginBottom: '0.4rem' }}>Send M-Pesa to</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600, letterSpacing: '0.12em' }}>0708 588 479</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: '0.25rem' }}>Samburu Wellness Resilience</div>
                  <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.12)', padding: '0.4rem 0.75rem', display: 'inline-block', fontSize: '0.8rem', fontWeight: 600 }}>
                    Amount: KES {event.event_price?.toLocaleString()}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={lbl}>M-Pesa Confirmation Code *</label>
                  <input style={{ ...fieldStyle, textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.1em', fontWeight: 600 }} placeholder="e.g. QFB3X7K9OP" value={mpesa} onChange={e => { setMpesa(e.target.value.toUpperCase()); setError('') }} />
                </div>
                {error && <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#C0472A', fontSize: '0.82rem', marginBottom: '0.75rem', background: '#FFF0EE', padding: '0.65rem 0.75rem' }}><AlertCircle size={14} />{error}</div>}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => { setStep('form'); setError('') }} style={{ flex: 1, padding: '0.65rem', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif' }}>Back</button>
                  <button onClick={submitRegistration} disabled={saving || !mpesa} style={{ flex: 2, padding: '0.65rem', background: '#C0472A', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: !mpesa ? 0.6 : 1 }}>
                    {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Submitting…</> : 'Submit Registration'}
                  </button>
                </div>
              </div>
            )}

            {/* ── FORM STEP ── */}
            {step === 'form' && (
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginBottom: '0.25rem' }}>
                  {isPaid ? 'Register & Pay' : 'Register — Free'}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>{event.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={lbl}>Full Name *</label>
                    <input style={fieldStyle} placeholder="Your full name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError('') }} />
                  </div>
                  <div>
                    <label style={lbl}>Email Address *</label>
                    <input type="email" style={fieldStyle} placeholder="your@email.com" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError('') }} />
                  </div>
                  <div>
                    <label style={lbl}>Phone (optional)</label>
                    <input type="tel" style={fieldStyle} placeholder="07XX XXX XXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                {error && <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, color: '#C0472A', fontSize: '0.82rem', marginBottom: '0.75rem', background: '#FFF0EE', padding: '0.65rem 0.75rem', lineHeight: 1.5 }}><AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />{error}</div>}
                <button onClick={handleFormNext} disabled={saving} style={{ width: '100%', padding: '0.75rem', background: isPaid ? '#C0472A' : 'var(--teal)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {saving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Checking…</> : isPaid ? 'Next — Proceed to Payment' : 'Confirm Registration'}
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
