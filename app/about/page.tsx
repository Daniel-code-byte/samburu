import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — Samburu Wellness & Resilience',
  description: 'Our story, mission, values, and team.',
}

const TEAM = [
  { name: 'Soila Seenoi', role: 'Chair', email: 'soila.seenoi@samburuwellness.org', alias: 'chair@samburuwellness.org', init: 'SS', color: 'var(--teal)' },
  { name: 'Bushe Sarolyne', role: 'Coordinator', email: 'bushe.sarolyne@samburuwellness.org', alias: 'coordinator@samburuwellness.org', init: 'BS', color: 'var(--rust)' },
  { name: 'Namusu', role: 'Treasurer', email: 'namusu@samburuwellness.org', alias: 'treasurer@samburuwellness.org', init: 'N', color: 'var(--gold)' },
  { name: 'Patel', role: 'Secretary', email: 'patel@samburuwellness.org', alias: 'secretary@samburuwellness.org', init: 'P', color: 'var(--sage)' },
]

const VALUES = [
  { title: 'Awareness & Education', body: 'Raising awareness and understanding of mental health and wellbeing within Samburu communities through open dialogue and culturally sensitive education.' },
  { title: 'Stigma Reduction', body: 'Reducing stigma and discrimination associated with mental illness through education and open community dialogue — so that no one suffers in silence.' },
  { title: 'Community Support', body: 'Identifying key social, economic and environmental factors contributing to poor mental health and promoting community-based support and appropriate referrals.' },
  { title: 'Suicide Prevention', body: 'Supporting suicide prevention efforts through awareness, early identification of risk, peer support and linkage to professional mental health services.' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Page header ─────────────────────────────────── */}
      <section style={{
        background: 'var(--teal-deep)',
        padding: '6rem 2rem 5rem',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Who We Are</div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 5vw, 4rem)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
          }}>
            Mental health for<br /><em>every Samburu</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            The Samburu Wellness & Resilience works within communities to promote wellbeing, reduce stigma, and connect people to the support they deserve.
          </p>
        </div>
      </section>

      {/* ── Story ───────────────────────────────────────── */}
      <section className="section-pad">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
          <div>
            <div className="eyebrow">Our Mission</div>
            <div className="teal-rule" />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, marginBottom: '1.5rem' }}>
              Why we exist
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--body)', marginBottom: '1.25rem' }}>
              To promote mental wellbeing in Samburu County through awareness, community engagement, physical activity, stigma reduction and linkage to appropriate mental health support services.
            </p>
            <div style={{ background: 'var(--teal-pale)', borderLeft: '4px solid var(--teal)', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--teal-deep)', lineHeight: 1.5 }}>
                &ldquo;A mentally healthy, informed and supportive Samburu community.&rdquo;
              </div>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--teal)', marginTop: '0.5rem', fontWeight: 600 }}>Our Vision</div>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--body)' }}>
              We believe mental health is a right — not a privilege. Working alongside Samburu communities, we address the social, cultural and economic factors that affect wellbeing and create pathways to support.
            </p>
          </div>

          <div>
            <div className="eyebrow">Our Objectives</div>
            <div className="teal-rule" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {VALUES.map((v) => (
                <div key={v.title} style={{
                  padding: '1.5rem',
                  borderLeft: '3px solid var(--teal)',
                  background: 'var(--teal-pale)',
                }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {v.title}
                  </h3>
                  <p style={{ fontSize: '0.87rem', lineHeight: 1.65, color: 'var(--body)' }}>{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team & contacts ─────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="eyebrow">Leadership</div>
            <div className="teal-rule" style={{ margin: '0.75rem auto 0' }} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, marginTop: '0.5rem' }}>
              Meet the team
            </h2>
          </div>

          {/* Team cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}>
            {TEAM.map((m) => (
              <div key={m.email} className="sw-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64,
                  borderRadius: '50%',
                  background: m.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{m.init}</span>
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>{m.name}</div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: m.color, marginBottom: '1rem' }}>{m.role}</div>
                <a href={`mailto:${m.alias}`} className="team-email-link">
                  <Mail size={13} /> {m.alias}
                </a>
              </div>
            ))}
          </div>

          {/* Contact table */}
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--ink)' }}>
              Official Contact Directory
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--white)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-md)' }}>
                    {['Role', 'Primary Email', 'Official Alias'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '0.9rem 1.25rem',
                        fontSize: '0.72rem', letterSpacing: '0.14em',
                        textTransform: 'uppercase', color: 'var(--muted)',
                        fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEAM.map((m, i) => (
                    <tr key={m.email} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--sand)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)' }}>{m.role}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <a href={`mailto:${m.email}`} style={{ fontSize: '0.85rem', color: 'var(--teal)', textDecoration: 'underline' }}>{m.email}</a>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <a href={`mailto:${m.alias}`} style={{ fontSize: '0.85rem', color: 'var(--teal)', textDecoration: 'underline' }}>{m.alias}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Developer credit (discreet) ─────────────────── */}
      <section style={{ background: 'var(--teal-deep)', padding: '2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
            Website developed by Daniel Lepati
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a href="tel:+254704579936" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Phone size={11} /> 0704 579 936
            </a>
            <a href="mailto:lepatidan5@gmail.com" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Mail size={11} /> lepatidan5@gmail.com
            </a>
          </div>
        </div>
      </section>


    </>
  )
}
