'use client'
import { useState } from 'react'

const AMOUNTS = [500, 1000, 2500, 5000, 10000]

export default function DonatePage() {
  const [selected, setSelected] = useState(null)
  const [custom, setCustom] = useState('')
  const [copied, setCopied] = useState('')

  const amount = custom ? parseInt(custom) : selected

  function copy(text, label) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const impacts = [
    { amount: 'KES 500',    what: 'Feeds a child for a week' },
    { amount: 'KES 1,000',  what: 'Covers a clinic visit' },
    { amount: 'KES 5,000',  what: "Sponsors a girl's school term" },
    { amount: 'KES 10,000', what: 'Trains a health worker' },
  ]

  return (
    <main>

      {/* ── HERO — gentle, not urgent ── */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">Support Our Work</p>
          <h1>Give if <em>You Can</em></h1>
          <p style={{ maxWidth: '560px', lineHeight: 1.8 }}>
            We never want giving to feel like pressure. If something moves you about what we do in Samburu, and you're in a position to help — here's how. Every contribution, at any size, goes directly to the people we serve.
          </p>
        </div>
      </div>

      {/* ── GENTLE INTRO ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <p className="section-eyebrow">Before You Give</p>
          <h2 className="section-title">What your support<br /><em>actually does</em></h2>
          <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'var(--text-mid)', lineHeight: 1.85, marginBottom: '16px' }}>
            In Samburu County, small amounts go a long way. We don't have large overheads or expensive offices — our team is from the community, and our costs are low by design.
          </p>
          <p style={{ fontSize: 'clamp(14px,1.4vw,16px)', color: 'var(--text-dim)', lineHeight: 1.85 }}>
            Below are real examples of what different contribution sizes fund. There's no minimum, no expectation, and no wrong amount.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginTop: 'clamp(28px,4vw,44px)',
          }}>
            {impacts.map(i => (
              <div key={i.amount} style={{
                background: 'var(--navy-card)',
                border: '1px solid var(--navy-border)',
                borderRadius: '10px',
                padding: 'clamp(16px,2vw,22px)',
                borderLeft: '3px solid var(--gold)',
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(20px,2.5vw,26px)',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  marginBottom: '8px',
                }}>{i.amount}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-mid)', lineHeight: 1.55 }}>{i.what}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMOUNT — optional, no pressure ── */}
      <section className="section" style={{ background: 'var(--navy-card)' }}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <p className="section-eyebrow">Optional</p>
          <h2 className="section-title">Pick an amount,<br /><em>or choose your own</em></h2>
          <p style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: 'clamp(20px,3vw,32px)', lineHeight: 1.7 }}>
            This just helps you know what to enter on M-Pesa. You can skip this and enter any amount directly.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {AMOUNTS.map(a => (
              <button
                key={a}
                onClick={() => { setSelected(a); setCustom('') }}
                style={{
                  padding: 'clamp(10px,1.5vw,14px) clamp(18px,2.5vw,28px)',
                  border: selected === a && !custom ? '2px solid var(--gold)' : '1.5px solid var(--navy-border)',
                  background: selected === a && !custom ? 'var(--gold-glow)' : 'var(--navy)',
                  color: selected === a && !custom ? 'var(--gold)' : 'var(--text-mid)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: 'clamp(13px,1.3vw,15px)',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                KES {a.toLocaleString()}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '13px', whiteSpace: 'nowrap' }}>Or enter any amount:</span>
            <div style={{ position: 'relative', maxWidth: '220px', flex: '1 1 180px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '13px', fontWeight: 600 }}>KES</span>
              <input
                type="number"
                className="form-input"
                style={{ paddingLeft: '50px', fontWeight: 700, fontSize: '15px' }}
                value={custom}
                onChange={e => { setCustom(e.target.value); setSelected(null) }}
                placeholder="Your amount"
                min="1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW TO PAY — calm and clear ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <p className="section-eyebrow">How to Send</p>
          <h2 className="section-title">M-Pesa <em>Paybill</em></h2>
          <p style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: 'clamp(24px,3vw,36px)', lineHeight: 1.7 }}>
            The quickest way to give. Takes about 30 seconds on any phone with M-Pesa.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

            {/* Paybill details */}
            <div style={{
              background: 'var(--navy-card)',
              border: '1px solid var(--navy-border)',
              borderRadius: '14px',
              padding: 'clamp(22px,3vw,32px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ fontSize: '28px' }}>📱</div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '15px' }}>Lipa Na M-Pesa</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>Paybill payment</p>
                </div>
              </div>

              {[
                { label: 'Business No. (Paybill)', value: '400200', key: 'paybill' },
                { label: 'Account No.', value: '1155673', key: 'account' },
              ].map(row => (
                <div key={row.key} style={{
                  background: 'var(--navy)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '10px',
                }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>{row.label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <p style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: 'var(--text-bright)', letterSpacing: '0.04em', fontFamily: 'DM Sans, monospace' }}>{row.value}</p>
                    <button
                      onClick={() => copy(row.value, row.key)}
                      style={{
                        background: copied === row.key ? 'rgba(52,194,112,0.2)' : 'var(--gold-glow)',
                        color: copied === row.key ? '#34C270' : 'var(--gold)',
                        border: `1px solid ${copied === row.key ? 'rgba(52,194,112,0.3)' : 'rgba(212,168,75,0.3)'}`,
                        borderRadius: '6px', padding: '6px 12px', fontSize: '11px',
                        cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', whiteSpace: 'nowrap',
                      }}
                    >
                      {copied === row.key ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}

              {amount > 0 && (
                <div style={{ background: 'rgba(52,194,112,0.07)', border: '1px solid rgba(52,194,112,0.18)', borderRadius: '8px', padding: '14px', marginTop: '4px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>Amount to Enter</p>
                  <p style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#34C270' }}>KES {amount.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Steps */}
            <div style={{
              background: 'var(--navy-card)',
              border: '1px solid var(--navy-border)',
              borderRadius: '14px',
              padding: 'clamp(22px,3vw,32px)',
            }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(17px,2vw,21px)', color: 'var(--text-bright)', fontWeight: 600, marginBottom: '20px' }}>Step by step</p>
              {[
                'Open M-Pesa on your phone',
                'Tap Lipa Na M-Pesa',
                'Tap Pay Bill',
                <span key="b">Business No: <strong style={{ color: 'var(--text-bright)' }}>400200</strong></span>,
                <span key="a">Account No: <strong style={{ color: 'var(--text-bright)' }}>1155673</strong></span>,
                amount > 0
                  ? <span key="amt">Amount: <strong style={{ color: '#34C270' }}>KES {amount.toLocaleString()}</strong></span>
                  : 'Enter your chosen amount',
                'Enter your M-Pesa PIN',
                'You\'ll get an SMS confirmation ✓',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '11px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '24px', height: '24px',
                    background: 'var(--gold-glow)',
                    border: '1px solid rgba(212,168,75,0.25)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold)', fontWeight: 700, fontSize: '11px', flexShrink: 0,
                  }}>{i + 1}</div>
                  <p style={{ fontSize: 'clamp(12px,1.2vw,13px)', color: 'var(--text-mid)', lineHeight: 1.55, paddingTop: '4px' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bank transfer — quiet, not pushed */}
          <div style={{
            marginTop: '20px',
            background: 'transparent',
            border: '1px solid var(--navy-border)',
            borderRadius: '10px',
            padding: 'clamp(16px,2vw,22px)',
            display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '22px', flexShrink: 0 }}>🏦</span>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-mid)', fontSize: '14px', marginBottom: '4px' }}>Prefer bank transfer?</p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                Reach us at <a href="mailto:info@samburuwellness.org" style={{ color: 'var(--gold)', fontWeight: 600 }}>info@samburuwellness.org</a> or <a href="tel:+254704579936" style={{ color: 'var(--gold)', fontWeight: 600 }}>+254 704 579 936</a> and we'll send you our bank details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING — warm, not salesy ── */}
      <section className="pull-quote-section">
        <div className="pull-quote" style={{ maxWidth: '680px' }}>
          <blockquote style={{ fontSize: 'clamp(18px,2.5vw,28px)' }}>
            Thank you for even considering this.<br />
            Whatever you decide, we're grateful you're here.
          </blockquote>
          <cite>— Samburu Wellness &amp; Resilience Team</cite>
        </div>
      </section>

    </main>
  )
}
