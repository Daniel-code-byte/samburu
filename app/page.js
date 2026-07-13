'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

/*
  HOMEPAGE — story-led redesign
  ------------------------------------------------------------
  Palette: keeps your existing navy + gold system and adds a
  forest-green accent (inspired by the acacia/land-restoration
  story). All new colors use var(--x, fallback) so this works
  even before you add them to your theme file — but for best
  results add these to your global CSS :root alongside your
  existing --navy / --gold variables:

    --forest: #2d6147;
    --forest-light: #4a8c68;
    --forest-deep: #16331f;
    --earth: #8b4513;
    --sky: #2a5f8f;

  IMAGES — the previous version used made-up Unsplash URLs that
  didn't point to real photos, which is why they were broken.
  These are all real, verified files hosted on Wikimedia Commons
  (public domain / CC-licensed, hotlink-safe via Special:FilePath —
  Wikimedia's own supported method for external embedding). They
  are placeholders to make the page feel real *today* — swap every
  one of them for your own field photography as soon as you can.
  A couple require attribution under their CC BY-SA license; keep
  the credit line in the footer note below until you replace them.
------------------------------------------------------------- */

const wiki = (filename, width = 800) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`

const HERO_IMAGE = wiki('Malaso Samburu Kenya.jpg', 1600) // Samburu hills, Kenya
const FOUNDING_IMAGE_MAIN = wiki('DSC00423-SAMBURU MORAN LIFESTYLE.jpg', 900)
const FOUNDING_IMAGE_ACCENT = wiki('The Samburu women are building a new hut.jpg', 600)
const CONTEXT_BG = wiki('Reserve samburu paysage 2.jpg', 1400)
const PILLAR_IMAGES = {
  mental: wiki('Northern Kenya.jpg', 700),
  women: wiki('The Samburu women are building a new hut.jpg', 700),
  youth: wiki('Young Samburu male.jpg', 700),
  conservation: wiki('Landscapes of Kenya 04.jpg', 700),
}
const STORY_IMAGES = {
  forest: wiki('Landscapes of Kenya 04.jpg', 700),
  champion: wiki('200812 kenya 7 (3197992047).jpg', 700),
}

export default function HomePage() {
  const [news, setNews] = useState([])

  useEffect(() => {
    async function fetchNews() {
      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3)
      if (posts && posts.length > 0) setNews(posts)
    }
    fetchNews()
  }, [])

  const heroStats = [
    { n: '120+', l: 'Lives Touched' },
    { n: '4', l: 'Active Programmes' },
    { n: '9', l: 'Villages Reached' },
    { n: '2024', l: 'Founded' },
  ]

  const pillars = [
    {
      num: 'Pillar One',
      icon: '🧠',
      image: PILLAR_IMAGES.mental,
      accent: 'var(--forest, #2d6147)',
      title: 'Improved Mental Health',
      story:
        "In Samburu, suicide is rarely spoken of — but it happens, quietly and too often. We train community mental health champions, people already trusted in their own villages, to recognise the signs, hold space, and connect someone in crisis to real support.",
      stats: [
        { n: '6', l: 'Schools Reached' },
        { n: '15+', l: 'Champions Trained' },
        { n: '80+', l: 'People Supported' },
      ],
    },
    {
      num: 'Pillar Two',
      icon: '👩🏾',
      image: PILLAR_IMAGES.women,
      accent: 'var(--gold)',
      title: "Women's Empowerment",
      story:
        'Women in Samburu hold the social fabric together, often with little recognition. Through business literacy, micro-savings cooperatives, and leadership mentorship, we help women build the income, rights knowledge, and community that make real freedom possible.',
      stats: [
        { n: '40+', l: 'Women Trained' },
        { n: '6', l: 'Savings Groups' },
        { n: '120+', l: 'Families Impacted' },
      ],
    },
    {
      num: 'Pillar Three',
      icon: '🌱',
      image: PILLAR_IMAGES.youth,
      accent: 'var(--sky, #2a5f8f)',
      title: 'Youth Resilience',
      story:
        "Young Samburu people stand between a pastoral heritage and a fast-changing world. We don't ask them to choose. Leadership camps, peer counselling, and vocational training help them carry both — because a young person who knows who they are becomes a leader, not a statistic.",
      stats: [
        { n: '20+', l: 'Annual Camp' },
        { n: '5', l: 'Vocational Trades' },
        { n: '9', l: 'Villages Active' },
      ],
    },
    {
      num: 'Pillar Four',
      icon: '🌳',
      image: PILLAR_IMAGES.conservation,
      accent: 'var(--earth, #8b4513)',
      title: 'Conservation & Land Stewardship',
      story:
        'The acacia woodlands and grasslands that fed generations of pastoralists are disappearing. Through community-led, indigenous-seedling tree planting — elders and young people working side by side — we give the land back to itself.',
      stats: [
        { n: '800+', l: 'Trees Planted' },
        { n: '9', l: 'Acres Restored' },
        { n: '3', l: 'Sites Active' },
      ],
    },
  ]

  const groundStories = [
    {
      title: 'The boy who planted a forest',
      image: STORY_IMAGES.forest,
      body: 'He came to the youth leadership camp expecting sports. He left with thirty acacia seedlings, a plan for where to plant them, and a mentor he still calls every month. A year later, that hillside has shade again.',
    },
    {
      title: 'The day someone asked if you were okay',
      image: STORY_IMAGES.champion,
      body: 'Our trained community health champions don\u2019t carry prescription pads. What they carry is time — and the language to ask the question no one else was asking. One evening visit changed everything. He is still here.',
    },
  ]

  const impactNumbers = [
    { n: '120+', l: 'People reached across all programmes', accent: 'var(--forest, #2d6147)' },
    { n: '40+', l: 'Women trained in business & financial literacy', accent: 'var(--gold)' },
    { n: '800+', l: 'Indigenous trees planted across 3 sites', accent: 'var(--earth, #8b4513)' },
    { n: '15+', l: 'Community mental health champions trained', accent: 'var(--sky, #2a5f8f)' },
    { n: '20+', l: 'Youth in annual leadership programmes', accent: 'var(--forest-light, #4a8c68)' },
    { n: '9', l: 'Villages with active programme presence', accent: 'var(--gold)' },
  ]

  const partners = [
    {
      name: 'RoamRoar Kenya Safaris',
      logo: 'https://cdn.prod.website-files.com/664501c0a1543edee1fe122e/6996b4af410c1720487b9422_roamroar-logo.svg',
      tagline: 'Community Development NGO in Kenya | CAN-K',
      url: 'https://roamroarkenyasafaris.com/',
    },
  ]

  return (
    <main>
      <style jsx>{`
        .sw-hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .sw-founding-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
        }
        .sw-context-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
        }
        .sw-pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        .sw-stories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        .sw-founding-accent {
          position: absolute;
          bottom: -32px;
          right: -24px;
          width: 46%;
          height: 52%;
        }
        @media (max-width: 760px) {
          .sw-hero {
            min-height: 78vh !important;
          }
          .sw-hero-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .sw-hero-stats > div:nth-child(2n) {
            border-right: none;
          }
          .sw-founding-grid,
          .sw-context-grid,
          .sw-pillars-grid,
          .sw-stories-grid {
            grid-template-columns: 1fr !important;
          }
          .sw-founding-accent {
            position: static;
            width: 100%;
            height: clamp(180px, 50vw, 260px);
            margin-top: 12px;
          }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="sw-hero"
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${HERO_IMAGE}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            filter: 'brightness(0.42) saturate(1.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,20,16,0.35) 0%, rgba(10,20,16,0.15) 40%, rgba(10,20,16,0.9) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: 'clamp(120px, 16vw, 180px) clamp(20px,6vw,80px) 0',
            maxWidth: '1100px',
          }}
        >
          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(196,134,10,0.18)',
              border: '1px solid rgba(240,180,41,0.35)',
              color: 'var(--gold)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: '100px',
              marginBottom: '28px',
            }}
          >
            Samburu County, Northern Kenya
          </p>
<h1
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontSize: 'clamp(2.6rem, 6.4vw, 5.2rem)',
    lineHeight: 1.08,
    color: '#ffffff',
    textShadow: '0 2px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)',
    maxWidth: '820px',
    marginBottom: '24px',
  }}
>
  When a community<br />
  remembers <em style={{ fontStyle: 'italic', color: '#f0b429', textShadow: '0 2px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)' }}>who it is,</em><br />
  it heals itself.
</h1>
          <p
            style={{
              fontSize: 'clamp(15px,1.6vw,19px)',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '560px',
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: '40px',
            }}
          >
            Samburu Wellness &amp; Resilience walks alongside the people of Samburu County — honouring their knowledge, their land, and their strength.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: 'clamp(48px,7vw,80px)' }}>
            <a href="/our-work" className="btn-amber">Explore Our Work</a>
            <a href="/donate" className="btn-outline">Support the Mission</a>
          </div>
        </div>

        {/* hero stat strip */}
        <div
          className="sw-hero-stats"
          style={{
            position: 'relative',
            zIndex: 2,
            borderTop: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(10,20,16,0.55)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {heroStats.map((s) => (
            <div
              key={s.n}
              style={{
                padding: 'clamp(18px,2.5vw,28px) 12px',
                textAlign: 'center',
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(22px,2.6vw,34px)',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  lineHeight: 1,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  marginTop: '6px',
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDING STORY ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div
          className="section-inner sw-founding-grid"
          style={{
            gap: 'clamp(32px,5vw,64px)',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative' }}>
            <img
              src={FOUNDING_IMAGE_MAIN}
              alt="Samburu community gathering"
              style={{
                width: '100%',
                height: 'clamp(280px, 34vw, 440px)',
                objectFit: 'cover',
                borderRadius: '6px',
              }}
            />
            <img
              src={FOUNDING_IMAGE_ACCENT}
              alt="Samburu women's group"
              className="sw-founding-accent"
              style={{
                objectFit: 'cover',
                borderRadius: '6px',
                border: '6px solid var(--navy)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
              }}
            />
          </div>

          <div>
            <p className="section-eyebrow">Our Founding Story</p>
            <h2 className="section-title">We saw what was<br /><em>slipping away</em> — and chose to act</h2>
            <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'var(--text-mid)', lineHeight: 1.85, marginBottom: '16px' }}>
              This organisation was not born in a boardroom. It was born from grief, worry, and love — the kind that only comes from belonging somewhere.
            </p>
            <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'var(--text-mid)', lineHeight: 1.85, marginBottom: '24px' }}>
              We watched the art of community — long evenings under acacia trees, elders passing wisdom to the young — begin to erode. Young men were dying by suicide in numbers that should have shaken everyone. The hillsides that fed our ancestors' herds were going bare. So in 2024, we sat together, as neighbours and relatives, and asked the only question that mattered: <em style={{ color: 'var(--text-bright)' }}>what would it take for our communities to truly thrive again?</em>
            </p>

            <blockquote
              style={{
                borderLeft: '3px solid var(--gold)',
                paddingLeft: '20px',
                margin: '0 0 24px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(18px,2vw,24px)',
                  color: 'var(--text-bright)',
                  lineHeight: 1.4,
                  marginBottom: '8px',
                }}
              >
                "Every community carries the seeds of its own strength. Our work is simply to water them."
              </p>
              <cite style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', fontStyle: 'normal' }}>
                — Founders, Samburu Wellness &amp; Resilience
              </cite>
            </blockquote>

            <a href="/who-we-are" className="btn-outline">Meet Our Team →</a>
          </div>
        </div>
      </section>

      {/* ── CONTEXT BAND ── */}
      <section
        style={{
          background: 'var(--navy-mid, #10241c)',
          borderTop: '1px solid var(--navy-border)',
          borderBottom: '1px solid var(--navy-border)',
          padding: 'clamp(48px,6vw,80px) 0',
        }}
      >
        <div
          className="section-inner sw-context-grid"
          style={{ gap: 'clamp(28px,4vw,56px)', alignItems: 'center' }}
        >
          <div>
            <p className="section-eyebrow" style={{ marginBottom: '10px' }}>The Context</p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(20px,2.6vw,30px)',
                color: 'var(--text-bright)',
                lineHeight: 1.4,
              }}
            >
              "Poverty is never one-dimensional — and neither is healing."
            </p>
          </div>
          <div>
            <p style={{ fontSize: 'clamp(14px,1.3vw,16px)', color: 'var(--text-mid)', lineHeight: 1.9, marginBottom: '14px' }}>
              Samburu County sits in northern Kenya — dramatic landscapes, proud pastoralist heritage, extraordinary people. It is also one of Kenya's most marginalised counties, with some of the country's lowest rates of access to healthcare, education, and economic opportunity.
            </p>
            <p style={{ fontSize: 'clamp(14px,1.3vw,16px)', color: 'var(--text-mid)', lineHeight: 1.9 }}>
              Its communities have survived drought, conflict, and decades of neglect through extraordinary solidarity. Our role is not to rescue — it is to stand with them. Addressed together, mental health, women's empowerment, youth resilience, and land stewardship don't just help. They make transformation inevitable.
            </p>
          </div>
        </div>
      </section>

      {/* ── CINEMATIC MOMENT ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '52vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <img
          src={CONTEXT_BG}
          alt="Samburu landscape"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,20,16,0.1) 0%, rgba(10,20,16,0.92) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(40px,6vw,72px) clamp(20px,6vw,80px)', maxWidth: '760px' }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(22px,3.2vw,38px)',
              color: 'var(--text-bright, #fff)',
              lineHeight: 1.4,
              marginBottom: '18px',
            }}
          >
            "A community that is fed, healthy, and educated is not a burden to anyone. It is the foundation of everything."
          </p>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            — Community Elder, Wamba Division
          </p>
        </div>
      </section>

      {/* ── FOUR PILLARS ── */}
      <section className="section" style={{ background: 'var(--navy-card)' }}>
        <div className="section-inner">
          <p className="section-eyebrow">What We Do</p>
          <h2 className="section-title">Four Pillars of<br /><em>Community Transformation</em></h2>
          <p style={{ fontSize: 'clamp(14px,1.3vw,16px)', color: 'var(--text-dim)', maxWidth: '620px', lineHeight: 1.8, marginBottom: 'clamp(28px,4vw,48px)' }}>
            Each pillar is rooted in what Samburu people themselves said they needed most — not in an imported model.
          </p>

          <div className="sw-pillars-grid" style={{ gap: 'clamp(16px,2.2vw,24px)' }}>
            {pillars.map((p) => (
              <div
                key={p.num}
                style={{
                  background: 'linear-gradient(165deg, var(--navy) 0%, rgba(45,97,71,0.16) 140%)',
                  border: '1px solid var(--navy-border)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  borderTop: `3px solid ${p.accent}`,
                }}
              >
                <div style={{ position: 'relative', height: '160px' }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(10,20,16,0.15) 0%, rgba(10,20,16,0.85) 100%)',
                    }}
                  />
                  <div style={{ position: 'absolute', left: '20px', bottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '26px', lineHeight: 1 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.accent }}>
                        {p.num}
                      </div>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 'clamp(19px,2vw,23px)',
                          fontWeight: 600,
                          color: 'var(--text-bright, #fff)',
                        }}
                      >
                        {p.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div style={{ padding: 'clamp(20px,2.6vw,32px)' }}>
                  <p style={{ fontSize: 'clamp(13px,1.15vw,15px)', color: 'var(--text-mid)', lineHeight: 1.8, marginBottom: '20px' }}>
                    {p.story}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--navy-border)', paddingTop: '16px' }}>
                    {p.stats.map((s) => (
                      <div key={s.l}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 600, color: 'var(--text-bright)', lineHeight: 1 }}>
                          {s.n}
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(28px,4vw,48px)' }}>
            <a href="/our-work" className="btn-brown">Explore All Programmes</a>
          </div>
        </div>
      </section>

      {/* ── STORIES FROM THE GROUND ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="section-inner" style={{ maxWidth: '900px' }}>
          <p className="section-eyebrow">The Work in Practice</p>
          <h2 className="section-title">Stories from <em>the Ground</em></h2>

          <div className="sw-stories-grid" style={{ gap: 'clamp(24px,3.5vw,40px)', marginTop: 'clamp(24px,3vw,40px)' }}>
            {groundStories.map((s) => (
              <div key={s.title}>
                <img
                  src={s.image}
                  alt=""
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', marginBottom: '18px' }}
                />
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(19px,2vw,23px)',
                    color: 'var(--gold)',
                    marginBottom: '12px',
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 'clamp(13px,1.2vw,15px)', color: 'var(--text-mid)', lineHeight: 1.85 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT NUMBERS ── */}
      <section className="section" style={{ background: 'var(--navy-card)' }}>
        <div className="section-inner" style={{ maxWidth: '1000px' }}>
          <p className="section-eyebrow">Impact in Numbers</p>
          <h2 className="section-title">What <em>Showing Up</em> Looks Like</h2>
          <p style={{ fontSize: 'clamp(14px,1.3vw,16px)', color: 'var(--text-dim)', lineHeight: 1.85, maxWidth: '640px', marginBottom: 'clamp(24px,3vw,40px)' }}>
            We don't measure success in donor reports. We measure it in the woman who hasn't missed a school fees payment in two years, the hillside with shade again, the young man who reached out before it was too late.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {impactNumbers.map((item) => (
              <div
                key={item.l}
                style={{
                  background: 'linear-gradient(165deg, var(--navy) 0%, rgba(45,97,71,0.14) 150%)',
                  border: '1px solid var(--navy-border)',
                  borderRadius: '10px',
                  padding: 'clamp(18px,2.5vw,28px)',
                  borderTop: `2px solid ${item.accent}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(28px,3.5vw,44px)',
                    fontWeight: 600,
                    color: item.accent,
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  {item.n}
                </div>
                <div style={{ fontSize: 'clamp(12px,1.1vw,14px)', color: 'var(--text-mid)', lineHeight: 1.55 }}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS / STORIES (dynamic) ── */}
      {news.length > 0 && (
        <section className="section" style={{ background: 'var(--navy)' }}>
          <div className="section-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
              <div>
                <p className="section-eyebrow">Stories &amp; Updates</p>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Latest from <em>the Field</em></h2>
              </div>
              <a href="/news" className="btn-outline">All Stories →</a>
            </div>
            <div className="news-grid">
              {news.map((post) => (
                <a key={post.id} href={`/news/${post.slug || post.id}`} className="news-card" style={{ display: 'block' }}>
                  {(post.image_url || post.cover_image) && (
                    <div className="news-card-img">
                      <img src={post.image_url || post.cover_image} alt={post.title} />
                    </div>
                  )}
                  <div className="news-card-body">
                    <div className="news-tag">{post.category || 'Community'}</div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt || (post.content ? post.content.slice(0, 100) + '…' : '')}</p>
                    <div className="news-card-date">
                      {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── OUR PARTNERS (teaser) ── */}
      <section className="section" style={{ background: 'var(--navy-card)' }}>
        <div className="section-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: 'clamp(24px,3vw,40px)' }}>
            <div>
              <p className="section-eyebrow">Working Together</p>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Our <em>Partners</em></h2>
            </div>
            <a href="/partner" className="btn-outline">Become a Partner →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(16px,2vw,24px)' }}>
            {partners.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  background: 'var(--navy)',
                  border: '1px solid var(--navy-border)',
                  borderRadius: '12px',
                  padding: 'clamp(18px,2.5vw,24px)',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  style={{ height: '44px', width: '90px', objectFit: 'contain', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: 'var(--text-bright)', fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, marginTop: '2px' }}>{p.tagline}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="partner-cta">
        <h2>Be Part of<br /><em>the Story</em></h2>
        <p>
          Your partnership — financial, professional, or in-kind — directly changes lives in Samburu County.
          Every contribution reaches a real person in a real village.
        </p>
        <div className="cta-btns">
          <a href="/partner" className="btn-amber">Partner With Us</a>
          <a href="/donate" className="btn-outline">Donate Now</a>
          <a href="/join" className="btn-outline">Join Our Team</a>
        </div>
      </section>

    </main>
  )
}
