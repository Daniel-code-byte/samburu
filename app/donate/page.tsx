import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Shield, Smartphone, Globe, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Donate — Samburu Mental Health Association',
  description: 'Support mental health work in Samburu County through M-Pesa or PayPal.',
}

const IMPACT = [
  { amount: 'KSh 500', label: 'Provides health supplies for one family for a month' },
  { amount: 'KSh 1,500', label: 'Supports a girl\'s school fees for one term' },
  { amount: 'KSh 5,000', label: 'Funds a community wellness workshop' },
  { amount: 'KSh 10,000+', label: 'Sponsors a full youth mentorship program' },
]

export default function DonatePage() {
  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--teal-deep)', padding: '6rem 2rem 5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Support Our Work</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Give to the<br /><em>Samburu community</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 2rem' }}>
            Your donation goes directly to mental health awareness, community support, and stigma reduction programs in Samburu County.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#mpesa" className="btn-rust" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Smartphone size={15} /> Donate via M-Pesa
            </a>
            <a href="#paypal" className="btn-outline-white">
              <Globe size={15} /> Donate via PayPal
            </a>
          </div>
        </div>
      </section>

      {/* Mission note */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow">Why It Matters</div>
          <div className="teal-rule" style={{ margin: '0.75rem auto 0' }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Mental health is a community issue
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--body)', lineHeight: 1.8, maxWidth: 680, margin: '0 auto' }}>
            In Samburu County, access to mental health support is limited. Your donation helps us reach more people through awareness campaigns, community engagement, stigma reduction and peer support programs. Every contribution — no matter the size — makes a real difference to real families.
          </p>
        </div>
      </section>

      {/* M-Pesa */}
      <section id="mpesa" className="section-pad">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div className="eyebrow">Local Giving</div>
              <div className="teal-rule" />
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, marginBottom: '1rem' }}>
                Donate via<br /><em>M-Pesa</em>
              </h2>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--body)', marginBottom: '1.5rem' }}>
                The fastest and easiest way to give if you're in Kenya. Send directly to our M-Pesa number — your donation is processed instantly.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Open M-Pesa on your phone',
                  'Select "Send Money" or "Lipa na M-Pesa"',
                  'Enter the number below',
                  'Enter your amount and confirm',
                  'Use your name as the reference',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--body)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--teal-deep)', padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Smartphone size={28} color="#fff" />
              </div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>M-Pesa Number</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                0704 579 936
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Samburu Mental Health Association</div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                After sending, you'll receive an M-Pesa confirmation SMS. You can screenshot and send to us at chair@samburuwellness.org
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PayPal */}
      <section id="paypal" className="section-pad" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ background: '#003087', padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>PayPal</div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>International Donations</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Send to our PayPal email address. Accepts all major cards and PayPal balance worldwide.
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>PayPal Email</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>lepatidan5@gmail.com</div>
              </div>
              <a
                href="https://paypal.me/samburuwellness"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0070BA', color: '#fff', padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.2s' }}
              >
                <Globe size={15} /> Donate on PayPal
              </a>
            </div>

            <div>
              <div className="eyebrow">International Giving</div>
              <div className="teal-rule" />
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, marginBottom: '1rem' }}>
                Donate via<br /><em>PayPal</em>
              </h2>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--body)', marginBottom: '1.5rem' }}>
                For international donors or anyone who prefers to give online. PayPal accepts credit/debit cards, bank transfers, and PayPal balance from anywhere in the world.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['Accepted worldwide', 'Secure & encrypted', 'Instant confirmation', 'All major currencies accepted'].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--body)' }}>
                    <CheckCircle size={15} color="var(--sage)" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust note */}
      <section style={{ background: 'var(--teal-deep)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <Shield size={36} color="rgba(255,255,255,0.4)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>100% goes to mental health programs</h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            We are a grassroots mental health organisation. Every donation funds awareness campaigns, community support, and suicide prevention programs in Samburu. You can reach us any time to ask how funds are used.
          </p>
          <Link href="/contact" className="btn-outline-white">Contact us with questions</Link>
        </div>
      </section>
    </>
  )
}
