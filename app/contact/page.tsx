'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { sendMessage } from '@/lib/supabase'

type Status = 'idle' | 'sending' | 'success' | 'error'

const SUBJECTS = ['General Inquiry', 'Volunteer', 'Donation', 'Media & Press', 'Partnership', 'Other']

const TEAM_EMAILS = [
  { role: 'Chair', email: 'soila.seenoi@samburuwellness.org', alias: 'chair@samburuwellness.org' },
  { role: 'Coordinator', email: 'bushe.sarolyne@samburuwellness.org', alias: 'coordinator@samburuwellness.org' },
  { role: 'Treasurer', email: 'namusu@samburuwellness.org', alias: 'treasurer@samburuwellness.org' },
  { role: 'Secretary', email: 'patel@samburuwellness.org', alias: 'secretary@samburuwellness.org' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], body: '' })
  const [status, setStatus] = useState<Status>('idle')

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.email || !form.body) return
    setStatus('sending')
    try {
      await sendMessage(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: SUBJECTS[0], body: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section style={{ background: 'var(--teal-deep)', padding: '6rem 2rem 5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Reach Out</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Let&apos;s build<br /><em>something together</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Whether you want to volunteer, donate, collaborate, or simply learn more — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="contact-layout" style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div>
            <div className="eyebrow">Get in Touch</div>
            <div className="teal-rule" />
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2rem)', fontWeight: 300, marginBottom: '2rem' }}>
              We&apos;re always<br />happy to talk
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
              <a href="tel:+254704579936" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--body)' }}>
                <div style={{ width: 40, height: 40, background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={16} color="var(--teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>Phone</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>+254 708588479</div>
                </div>
              </a>

              <a href="mailto:chair@samburuwellness.org" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--body)' }}>
                <div style={{ width: 40, height: 40, background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={16} color="var(--teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>Email</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>chair@samburuwellness.org</div>
                </div>
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={16} color="var(--teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>Location</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>Samburu County, Kenya</div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem', fontWeight: 600 }}>Team Directory</div>
              <div style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
                {TEAM_EMAILS.map((t, i) => (
                  <div key={t.role} style={{ padding: '0.9rem 1.1rem', borderBottom: i < TEAM_EMAILS.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--white)' : 'var(--sand)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', minWidth: 90 }}>{t.role}</div>
                    <a href={`mailto:${t.alias}`} style={{ fontSize: '0.78rem', color: 'var(--teal)', textDecoration: 'underline' }}>{t.alias}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--border)', background: 'var(--sage-pale)' }}>
                <CheckCircle size={48} color="var(--sage)" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '0.75rem' }}>Message received!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  Thank you for reaching out. Someone from our team will get back to you shortly.
                </p>
                <button onClick={() => setStatus('idle')} className="btn-outline">Send another message</button>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border)', padding: '2.5rem', background: 'var(--white)' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', marginBottom: '0.4rem' }}>Send us a message</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '2rem' }}>We read every message and respond within 2 business days.</p>

                {status === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--rust-pale)', border: '1px solid var(--rust)', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: 'var(--rust)', fontSize: '0.85rem' }}>
                    <AlertCircle size={15} /> Failed to send. Please try emailing us directly.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div className="contact-name-email" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Your Name *</label>
                      <input className="field" placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Email *</label>
                      <input className="field" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.6rem' }}>Subject</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {SUBJECTS.map((s) => (
                        <button key={s} onClick={() => set('subject', s)} style={{ padding: '0.38rem 0.9rem', fontSize: '0.78rem', fontFamily: 'DM Sans, sans-serif', border: `1.5px solid ${form.subject === s ? 'var(--teal)' : 'var(--border-md)'}`, background: form.subject === s ? 'var(--teal)' : 'transparent', color: form.subject === s ? '#fff' : 'var(--body)', cursor: 'pointer', transition: 'all 0.15s' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Message *</label>
                    <textarea className="field" rows={5} placeholder="Tell us how you'd like to get involved, or ask us anything..." value={form.body} onChange={(e) => set('body', e.target.value)} style={{ resize: 'vertical' }} />
                  </div>

                  <button onClick={submit} disabled={status === 'sending' || !form.name || !form.email || !form.body} className="btn-primary" style={{ justifyContent: 'center', opacity: (!form.name || !form.email || !form.body) ? 0.5 : 1 }}>
                    {status === 'sending' ? 'Sending…' : (<>Send Message <Send size={14} /></>)}
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
