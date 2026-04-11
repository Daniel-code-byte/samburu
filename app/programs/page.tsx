import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Users, Star, Leaf, ArrowRight, CheckCircle } from 'lucide-react'
import { getPrograms } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Programs — Samburu Wellness & Resilience',
  description: 'Explore our community programs across health, women empowerment, youth, and community care.',
}

const DEFAULT_PROGRAMS = [
  {
    id: 'health', anchor: 'health', icon: Heart, color: 'var(--rust)', bg: 'var(--rust-pale)',
    title: 'Health & Wellness',
    description: 'Bringing quality healthcare closer to Samburu communities through mobile clinics, maternal health support, and mental wellness programs rooted in cultural understanding.',
    points: ['Mobile health clinics visiting 12+ villages quarterly', 'Maternal and child health support', 'Mental wellness and trauma-informed care', 'Health education and disease prevention'],
  },
  {
    id: 'women', anchor: 'women', icon: Users, color: 'var(--teal)', bg: 'var(--teal-pale)',
    title: 'Women & Girls',
    description: 'Empowering Samburu women and girls with education, economic opportunities, and safe spaces to heal, grow, and lead.',
    points: ["Girls' education scholarships and support", "Women's economic empowerment groups", 'Safe house and survivor support', 'Leadership training for young women'],
  },
  {
    id: 'youth', anchor: 'youth', icon: Star, color: 'var(--gold)', bg: 'var(--gold-pale)',
    title: 'Youth Resilience',
    description: 'Nurturing the next generation of Samburu leaders through mentorship, skills development, and programs that honour both tradition and opportunity.',
    points: ['Youth mentorship and life skills', 'Vocational training and apprenticeships', 'Sports and arts for wellbeing', 'Cultural pride and identity programs'],
  },
  {
    id: 'community', anchor: 'community', icon: Leaf, color: 'var(--sage)', bg: 'var(--sage-pale)',
    title: 'Community Care',
    description: 'Strengthening the communal bonds, elder care, and traditional support systems that make Samburu communities resilient from within.',
    points: ['Elder care and dignity programs', 'Community conflict resolution', 'Food security and nutrition support', 'Environmental stewardship initiatives'],
  },
]

export default async function ProgramsPage() {
  await getPrograms()

  return (
    <>
      <section style={{ background: 'var(--teal-deep)', padding: '6rem 2rem 5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Our Work</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: 300, color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Programs that<br /><em>transform lives</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            Each program is designed with and for the Samburu community — addressing mental health through awareness, peer support, stigma reduction, and professional linkage.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {DEFAULT_PROGRAMS.map((prog) => {
            const Icon = prog.icon
            return (
              <div key={prog.id} id={prog.anchor} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '2.5rem', background: prog.bg, borderLeft: `4px solid ${prog.color}` }}>
                  <div style={{ width: 56, height: 56, background: prog.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Icon size={26} color={prog.color} />
                  </div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>
                    {prog.title}
                  </h2>
                  <p style={{ fontSize: '0.93rem', lineHeight: 1.75, color: 'var(--body)' }}>{prog.description}</p>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: prog.color, marginBottom: '1.25rem', fontWeight: 600 }}>
                    What this includes
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {prog.points.map((pt) => (
                      <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--body)' }}>
                        <CheckCircle size={16} color={prog.color} style={{ flexShrink: 0, marginTop: 3 }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: 6, background: prog.color }}>
                    Get involved <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
