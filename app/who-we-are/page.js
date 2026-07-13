'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const TEAM_SLOTS = [
  {
    slot: 1, pfpKey: 'man_3',
    name: 'Soila Seenoi',
    role: 'Co-Founder & Chairlady',
    caption: 'A humanitarian advocate with a Degree in Community Development, currently pursuing a Master\'s degree. Actively involved in children\'s advocacy, refugee support, and anti-human trafficking projects. Brings strong leadership and deep commitment to community empowerment and sustainable social impact.',
  },
  {
    slot: 2, pfpKey: 'man_1',
    name: 'Patel Lenaruti',
    role: 'Co-Founder & Secretary',
    caption: 'Registered Mental Health and Psychiatric specialist, Palliative Care specialist, Counselling Psychologist and Psychological First Aid Provider. Experienced in holistic care for individuals and families facing chronic and life-limiting conditions — bringing mental health advocacy and inclusion to the heart of our work.',
  },
  {
    slot: 3, pfpKey: 'man_9',
    name: 'Jessica Namusu',
    role: 'Co-Founder & Board Member',
    caption: 'Jessica Namusu is a Co Founder and Board member she is a legal professional with special interest in human rights, children\'s law, and International Humanitarian Law. Holding a Bachelor of Laws (LLB), her career is built on an in-depth knowledge of legal frameworks. Her commitment to social impact is reflected in her extensive work organizing events for social-economic empowerment.',
  },
  {
    slot: 4, pfpKey: 'man_2',
    name: 'Naomi Sarolyne',
    role: 'Executive Coordinator',
    caption: 'Oversees planning, implementation, and monitoring of community programmes. Her talent mentorship initiative identified gifted children and connected them with mentors, training, and educational support — helping them rise above challenges and reach their full potential.',
  },
  {
    slot: 5, pfpKey: 'man_4',
    name: 'Jackline Kathomi',
    role: 'Team Volunteer — Administration',
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
  const [lightboxImage, setLightboxImage] = useState(null)

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

  const openLightbox = (imageUrl) => {
    setLightboxImage(imageUrl)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    document.body.style.overflow = 'auto'
  }

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
                    {/* Large Image Section */}
                    <div 
                      className="team-image-wrapper"
                      onClick={() => pfpUrl && openLightbox(pfpUrl)}
                      style={{ cursor: pfpUrl ? 'pointer' : 'default' }}
                    >
                      {pfpUrl
                        ? <img src={pfpUrl} alt={member.name} className="team-image" />
                        : <div className="team-image-placeholder">
                            <span className="avatar-initials">{initials}</span>
                          </div>
                      }
                      {pfpUrl && (
                        <div className="image-overlay">
                          <span className="view-icon">🔍</span>
                          <span className="view-text">Click to view</span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="team-content">
                      <div className="team-header">
                        <span className="slot-badge">#{member.slot}</span>
                      </div>

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

                      {member.email && (
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

      {/* ── LIGHTBOX ── */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <img src={lightboxImage} alt="Team member" />
          </div>
        </div>
      )}

      {/* ── STYLES ── */}
      <style jsx>{`
        /* ── TEAM GRID ── */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 32px;
          margin-top: 36px;
          width: 100%;
        }

        .team-card {
          background: var(--navy-panel, #1a2332);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .team-card:hover {
          transform: translateY(-4px);
          border-color: rgba(251, 191, 36, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .team-card-inner {
          display: flex;
          flex-direction: column;
        }

        /* ── IMAGE SECTION ── */
        .team-image-wrapper {
          width: 100%;
          aspect-ratio: 4/3;
          position: relative;
          overflow: hidden;
          background: var(--navy, #0f172a);
          cursor: pointer;
        }

        .team-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .team-card:hover .team-image {
          transform: scale(1.05);
        }

        .team-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e293b, #0f172a);
        }

        .avatar-initials {
          font-size: 64px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 2px;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          gap: 8px;
        }

        .team-image-wrapper:hover .image-overlay {
          opacity: 1;
        }

        .view-icon {
          font-size: 32px;
          color: white;
        }

        .view-text {
          color: white;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        /* ── CONTENT SECTION ── */
        .team-content {
          padding: 20px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .team-header {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 4px;
        }

        .slot-badge {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          border: 1px solid rgba(251, 191, 36, 0.15);
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
        }

        /* ── LIGHTBOX ── */
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.92);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-content img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        }

        .lightbox-close {
          position: absolute;
          top: -50px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 32px;
          cursor: pointer;
          padding: 8px 12px;
          transition: color 0.2s ease;
          z-index: 10;
        }

        .lightbox-close:hover {
          color: #fbbf24;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .team-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .team-content {
            padding: 16px 20px 24px;
          }

          .team-image-wrapper {
            aspect-ratio: 16/10;
          }

          .avatar-initials {
            font-size: 48px;
          }

          .lightbox-content {
            max-width: 95vw;
          }

          .lightbox-close {
            top: -45px;
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .team-grid {
            gap: 20px;
          }

          .team-content {
            padding: 14px 16px 20px;
          }

          .team-image-wrapper {
            aspect-ratio: 4/3;
          }

          .avatar-initials {
            font-size: 40px;
          }

          .team-name {
            font-size: 17px;
          }

          .team-role {
            font-size: 13px;
          }

          .team-caption {
            font-size: 12px;
          }

          .view-text {
            font-size: 12px;
          }

          .view-icon {
            font-size: 24px;
          }

          .lightbox-close {
            top: -40px;
            font-size: 24px;
          }
        }

        @media (min-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .team-image-wrapper {
            aspect-ratio: 16/11;
          }
        }

        @media (min-width: 1400px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 36px;
          }

          .team-content {
            padding: 24px 28px 32px;
          }

          .team-image-wrapper {
            aspect-ratio: 16/10;
          }

          .avatar-initials {
            font-size: 72px;
          }
        }
      `}</style>
    </main>
  )
}
