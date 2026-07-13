'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const TEAM_SLOTS = [
  {
    slot: 1, pfpKey: 'man_3',
    name: 'Soila Seenoi',
    role: 'Co-Founder & Chairlady',
    email: 'soila@samburuwellness.org',
    caption: 'A humanitarian advocate with a Degree in Community Development, currently pursuing a Master\'s degree. Actively involved in children\'s advocacy, refugee support, and anti-human trafficking projects. Brings strong leadership and deep commitment to community empowerment and sustainable social impact.',
  },
  {
    slot: 2, pfpKey: 'man_1',
    name: 'Patel Lenaruti',
    role: 'Co-Founder & Secretary',
    email: 'patel@samburuwellness.org',
    caption: 'Registered Mental Health and Psychiatric specialist, Palliative Care specialist, Counselling Psychologist and Psychological First Aid Provider. Experienced in holistic care for individuals and families facing chronic and life-limiting conditions — bringing mental health advocacy and inclusion to the heart of our work.',
  },
  {
    slot: 3, pfpKey: 'man_9',
    name: 'Jessica Namusu',
    role: 'Co-Founder & Board Member',
    email: 'email@samburuwellness.org',
    caption: 'Jessica Namusu is a Co Founder and Board member she is a legal professional with special interest in human rights, children\'s law, and International Humanitarian Law. Holding a Bachelor of Laws (LLB), her career is built on an in-depth knowledge of legal frameworks. Her commitment to social impact is reflected in her extensive work organizing events for social-economic empowerment.',
  },
  {
    slot: 4, pfpKey: 'man_2',
    name: 'Naomi Sarolyne',
    role: 'Executive Coordinator',
    email: 'naomi@samburuwellness.org',
    caption: 'Oversees planning, implementation, and monitoring of community programmes. Her talent mentorship initiative identified gifted children and connected them with mentors, training, and educational support — helping them rise above challenges and reach their full potential.',
  },
  {
    slot: 5, pfpKey: 'man_4',
    name: 'Jackline Kathomi',
    role: 'Team Volunteer — Administration',
    email: 'email@samburuwellness.org',
    caption: 'Community Development student supporting the organisation through administrative coordination and day-to-day operations. Assists with records, communications, and smooth programme implementation.',
  },
  {
    slot: 6, pfpKey: 'man_5',
    name: 'Daniel Lepati',
    role: 'IT Manager',
    email: 'lepatidan5@gmail.com',
    caption: 'Manages all technology systems, digital infrastructure, and online presence for Samburu Wellness & Resilience.',
  },
]

const values = [
  { icon: '🤝', name: 'Togetherness',   desc: 'We are stronger together. The wellbeing of one person is inseparable from the wellbeing of the whole community.' },
  { icon: '🔍', name: 'Transparency',   desc: 'Every shilling is accounted for. Every programme is evaluated. Full accountability, always.' },
  { icon: '💪', name: 'Dignity',        desc: 'All our work begins and ends with dignity. Every person we serve is treated as fully human.' },
  { icon: '🌾', name: 'Rootedness',     desc: 'We are a community organisation first. Our strategies emerge from lived experience, not imported models.' },
  { icon: '🌍', name: 'Sustainability', desc: 'We build systems and capacities that outlast any single donor or programme cycle.' },
  { icon: '✊', name: 'Equity',         desc: 'We challenge the structures that keep communities poor — not just manage their symptoms.' },
]

export default function WhoWeArePage() {
  const [storyImg, setStoryImg] = useState(null)
  const [pfpMap, setPfpMap]     = useState({})

  useEffect(() => {
    async function fetchData() {
      const { data: photos } = await supabase
        .from('photos')
        .select('url')
        .not('category', 'eq', 'Team')
        .order('created_at', { ascending: false })
        .limit(1)
      if (photos && photos[0]) setStoryImg(photos[0].url)

      const { data: teamPhotos } = await supabase
        .from('photos')
        .select('url, title')
        .eq('category', 'Team')
      if (teamPhotos) {
        const map = {}
        teamPhotos.forEach(p => { if (p.title) map[p.title] = p.url })
        setPfpMap(map)
      }
    }
    fetchData()
  }, [])

  return (
    <main>

      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">Who We Are</p>
          <h1>A Community That<br /><em>Knows Its Own Story</em></h1>
          <p>Founded by people from Samburu, for Samburu — driven by lived experience and deep love for home.</p>
        </div>
      </div>

      {/* ── STORY ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="story-block">
          <div className="story-img">
            {storyImg
              ? <img src={storyImg} alt="Our story" />
              : <div style={{ width:'100%', height:'100%', minHeight:'300px', background:'var(--navy-panel)', borderRadius:'12px' }} />
            }
          </div>
          <div className="story-text">
            <p className="section-eyebrow">Our Founding Story</p>
            <h2 className="section-title">We Started With <em>One Question</em></h2>
            <p>In 2018, a group of Samburu County residents — nurses, teachers, mothers, elders — sat together and asked: what would it take for our communities to truly thrive?</p>
            <p>The answer was not a single programme or a single donor. It was a long-term commitment to seeing people whole — their health, their livelihoods, their dignity, and their futures.</p>
            <p>Samburu Wellness &amp; Resilience was born from that conversation. We are not just an NGO. We are a movement of neighbours caring for neighbours.</p>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="section" style={{ background: 'var(--navy-card)' }}>
        <div className="section-inner">
          <p className="section-eyebrow">Purpose &amp; Direction</p>
          <h2 className="section-title">Mission &amp; <em>Vision</em></h2>
          <div className="mv-grid">
            <div className="mv-card mission">
              <div className="mv-label">Our Mission</div>
              <h3>To empower Samburu communities through integrated health, social, and economic programmes that restore dignity and build lasting resilience.</h3>
              <p>We work at the intersection of health equity, economic justice, and social inclusion — because communities cannot thrive when any of these are missing.</p>
            </div>
            <div className="mv-card vision">
              <div className="mv-label">Our Vision</div>
              <h3>A Samburu County where every person lives with dignity, health, and hope — regardless of gender, age, or circumstance.</h3>
              <p>We envision communities that are self-determining, resilient, and proud of their heritage and future.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="section-inner">
          <p className="section-eyebrow">What Guides Us</p>
          <h2 className="section-title">Our Core <em>Values</em></h2>
          <div className="values-grid">
            {values.map(v => (
              <div key={v.name} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.name}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="section" style={{ background: 'var(--navy-card)' }}>
        <div className="section-inner">
          <p className="section-eyebrow">The People</p>
          <h2 className="section-title">Meet Our <em>Team</em></h2>
          <p style={{ color:'var(--text-mid)', fontSize:'clamp(13px,1.3vw,16px)', maxWidth:'560px', lineHeight:1.7, marginBottom:'8px' }}>
            The dedicated individuals behind every programme, every clinic visit, every community gathering.
          </p>

          <div className="team-grid">
            {TEAM_SLOTS.map(member => {
              const pfpUrl  = pfpMap[member.pfpKey]
              const isEmpty = member.name === 'Name Here'
              const initials = isEmpty
                ? String(member.slot)
                : member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

              return (
                <div key={member.slot} className="team-card">
                  <div className="team-card-inner">
                    <div className="team-card-header">
                      <span className="slot-badge">#{member.slot}</span>
                      <div className="team-avatar">
                        {pfpUrl
                          ? <img src={pfpUrl} alt={member.name} />
                          : <span className="avatar-placeholder">{initials}</span>
                        }
                      </div>
                    </div>

                    <div className="team-card-body">
                      <h3 className="team-name">
                        {isEmpty
                          ? <span style={{ color:'var(--text-dim)', fontStyle:'italic' }}>Team Member {member.slot}</span>
                          : member.name
                        }
                      </h3>

                      <p className="team-role">
                        {isEmpty
                          ? <span style={{ color:'var(--text-dim)' }}>—</span>
                          : member.role
                        }
                      </p>

                      {!isEmpty && (
                        <a href={`mailto:${member.email}`} className="team-email">
                          {member.email}
                        </a>
                      )}

                      {member.caption && (
                        <p className="team-caption">
                          {member.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="partner-cta">
        <h2>Ready to <em>Work With Us?</em></h2>
        <p>Join a growing network of partners, volunteers, and community members building a better Samburu.</p>
        <div className="cta-btns">
          <a href="/partner" className="btn-amber">Partner With Us</a>
          <a href="/contact" className="btn-outline">Get In Touch</a>
        </div>
      </section>

      {/* ── STYLES ── */}
      <style jsx>{`
        /* ── TEAM GRID ── */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 28px;
          margin-top: 36px;
          width: 100%;
        }

        .team-card {
          background: var(--navy-panel, #1a2332);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s ease;
          overflow: hidden;
          min-height: 380px;
          display: flex;
          flex-direction: column;
        }

        .team-card:hover {
          transform: translateY(-4px);
          border-color: rgba(251, 191, 36, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .team-card-inner {
          padding: 28px 24px 32px;
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 16px;
        }

        .team-card-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 8px;
        }

        .slot-badge {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          border: 1px solid rgba(251, 191, 36, 0.15);
          flex-shrink: 0;
        }

        .team-avatar {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--navy, #0f172a);
          border: 2px solid rgba(251, 191, 36, 0.15);
          transition: border-color 0.3s ease;
          margin-left: auto;
        }

        .team-card:hover .team-avatar {
          border-color: rgba(251, 191, 36, 0.4);
        }

        .team-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #fbbf24;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .team-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .team-name {
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 700;
          color: white;
          margin: 0;
          line-height: 1.2;
        }

        .team-role {
          font-size: clamp(13px, 1.1vw, 15px);
          color: #fbbf24;
          font-weight: 500;
          margin: 0;
          line-height: 1.4;
        }

        .team-email {
          font-size: 12px;
          color: var(--text-dim, #94a3b8);
          text-decoration: none;
          transition: color 0.2s ease;
          margin-top: 2px;
          font-family: monospace;
        }

        .team-email:hover {
          color: #fbbf24;
          text-decoration: underline;
        }

        .team-caption {
          font-size: 13px;
          color: var(--text-dim, #94a3b8);
          line-height: 1.7;
          margin: 8px 0 0 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .team-caption.expanded {
          -webkit-line-clamp: unset;
          overflow: visible;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .team-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .team-card-inner {
            padding: 24px 20px 28px;
          }

          .team-card {
            min-height: 320px;
          }

          .team-avatar {
            width: 70px;
            height: 70px;
          }

          .team-card-header {
            gap: 16px;
          }

          .team-caption {
            -webkit-line-clamp: 3;
          }
        }

        @media (max-width: 480px) {
          .team-grid {
            gap: 16px;
          }

          .team-card-inner {
            padding: 20px 16px 24px;
          }

          .team-card {
            min-height: 280px;
          }

          .team-avatar {
            width: 60px;
            height: 60px;
          }

          .team-name {
            font-size: 17px;
          }

          .team-role {
            font-size: 13px;
          }

          .team-caption {
            font-size: 12px;
            -webkit-line-clamp: 2;
          }

          .slot-badge {
            font-size: 10px;
            padding: 3px 10px;
          }
        }

        @media (min-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .team-card {
            min-height: 420px;
          }

          .team-avatar {
            width: 90px;
            height: 90px;
          }
        }

        @media (min-width: 1400px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }

          .team-card {
            min-height: 460px;
          }

          .team-card-inner {
            padding: 32px 28px 36px;
          }

          .team-avatar {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </main>
  )
}
