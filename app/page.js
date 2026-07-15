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

// Supabase-hosted images — instead of hardcoded filenames, this now
// LISTS everything in your 'photos' Storage bucket and uses whatever
// is actually in there, in whatever order Supabase returns them.
// Upload as many photos as you like, named anything — no more pic1,
// pic2 naming needed. First photo found → hero, next four → pillars.
const SUPABASE_BUCKET = 'photos'
const bucketUrl = (name) => supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(name).data.publicUrl

const FOUNDING_IMAGE_MAIN = wiki('DSC00423-SAMBURU MORAN LIFESTYLE.jpg', 900) // kept intact
const FOUNDING_IMAGE_ACCENT = wiki('Young Samburu male.jpg', 600) // swapped in: Samburu warrior portrait
const CONTEXT_BG = wiki('Reserve samburu paysage 2.jpg', 1400)
// Fallbacks shown only until the bucket photos finish loading, or if
// the bucket is empty / unreachable — never a broken image.
const FALLBACK_HERO = wiki('Reserve samburu paysage 2.jpg', 1600)
const FALLBACK_PILLARS = [
  wiki('Northern Kenya.jpg', 700),
  wiki('Landscapes of Kenya 04.jpg', 700),
  wiki('The Samburu women are building a new hut.jpg', 700),
  wiki('200812 kenya 7 (3197992047).jpg', 700),
]

export default function HomePage() {
  const [news, setNews] = useState([])
  const [bucketPhotos, setBucketPhotos] = useState([])

  useEffect(() => {
    async function fetchBucketPhotos() {
      const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })
      if (error || !data) return
      const imageFiles = data.filter((f) => f.name && /\.(jpe?g|png|webp|gif)$/i.test(f.name))
      const urls = imageFiles.map((f) => bucketUrl(f.name))
      if (urls.length > 0) setBucketPhotos(urls)
    }
    fetchBucketPhotos()
  }, [])

  // hero uses the first bucket photo; pillars use the next four —
  // falls back to the Wikimedia placeholders if the bucket is empty
  const HERO_IMAGE = bucketPhotos[0] || FALLBACK_HERO
  const PILLAR_IMAGES = {
    heritage: bucketPhotos[1] || FALLBACK_PILLARS[0],
    womenYouth: bucketPhotos[2] || FALLBACK_PILLARS[1],
    livelihoods: bucketPhotos[3] || FALLBACK_PILLARS[2],
    conservation: bucketPhotos[4] || FALLBACK_PILLARS[3],
  }

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
    { n: '4', l: 'Pillars of Care' },
    { n: '9', l: 'Villages Reached' },
    { n: '2024', l: 'Founded' },
  ]

  const pillars = [
    {
      num: 'Pillar One',
      badge: 'I',
      icon: '🧵',
      image: PILLAR_IMAGES.heritage,
      accent: 'var(--gold)',
      title: 'Community Wellbeing & Heritage',
      paras: [
        "In Samburu, wellbeing was never just the absence of illness — it was belonging: knowing your clan, your age-set, the beadwork pattern that marks your family, the stories that explain why the land looks the way it does. For a generation raised between the manyatta and the market town, much of that started to feel optional, then forgotten.",
        "This pillar exists to make sure it isn't. We host heritage gatherings where elders and young people sit in the same circle — not as teacher and student, but as keepers of the same inheritance, each holding a piece the other has lost.",
      ],
      quote:
        "\"The braid pattern belonged to her grandmother, and her grandmother's grandmother before that. She had never learned it herself — there hadn't been time, or someone patient enough to show her. It took one heritage afternoon, four hours, and more laughter than either of them expected, for the pattern to pass hands again.\"",
      list: [
        'Elders and youth gathering as equals, not instructors and students',
        'Oral history, song, and beadwork passed hand to hand again',
        'Pride in identity treated as part of healing, not separate from it',
      ],
    },
    {
      num: 'Pillar Two',
      badge: 'II',
      icon: '👩🏾',
      image: PILLAR_IMAGES.womenYouth,
      accent: 'var(--sky, #2f86bd)',
      title: 'Women & Youth Empowerment',
      paras: [
        "Women in Samburu hold the social fabric together, often with little recognition — and young people stand between a pastoral heritage and a fast-changing world. We didn't want to keep treating these as separate stories, because in most households, they aren't. A mother's income and a daughter's education rise and fall together.",
        "Through business literacy, micro-savings cooperatives, leadership mentorship, and vocational training — alongside practical support like reusable sanitary products — we help build the income, confidence, and community that make real freedom possible, for women and the young people watching them.",
      ],
      quote:
        '"For years the maths was simple and nobody said it out loud: no pads meant no school, for up to a week, every month. The day we handed out reusable pads at Milimani Senior School, the girls didn\'t just take them politely — they held them over their heads like trophies. It was never really about the pads. It was about someone finally doing the maths with them, out loud, and fixing it."',
      stats: [
        { n: '40+', l: 'Women Trained' },
        { n: '120+', l: 'Families Impacted' },
        { n: '20+', l: 'Youth in Leadership' },
      ],
    },
    {
      num: 'Pillar Three',
      badge: 'III',
      icon: '🔥',
      image: PILLAR_IMAGES.livelihoods,
      accent: 'var(--forest, #379764)',
      title: 'Sustainable Livelihoods',
      paras: [
        'For as long as anyone could remember, a bag of charcoal meant a tree came down first. It was the fastest way to turn a hillside into school fees — and we are not naive enough to think you can ask a family to stop feeding its children in the name of conservation. So instead, we asked a different question: what if the fuel didn\u2019t require the tree at all?',
        'A circle of women now sits together most weeks, rolling waste plant matter into charcoal briquettes by hand, one small dark sphere at a time. It is slow, unglamorous work. It is also, quietly, one of the more hopeful things happening in Samburu right now.',
      ],
      quote: '"Nobody asked them to stop needing an income. We just asked what it could be made of instead."',
      list: [
        "Income that doesn't require cutting a single living tree",
        'A fuel product made almost entirely from waste already on the ground',
        "Work that fits around the rest of a woman's day, done in community",
      ],
    },
    {
      num: 'Pillar Four',
      badge: 'IV',
      icon: '🌳',
      image: PILLAR_IMAGES.conservation,
      accent: 'var(--earth, #b0591f)',
      title: 'Conservation & Stewardship',
      paras: [
        'The acacia woodlands and grasslands that fed generations of pastoralists are disappearing. Through community-led, indigenous-seedling tree planting — elders and young people working side by side — we give the land back to itself.',
      ],
      quote:
        '"He came to a youth leadership camp expecting sports and left with thirty acacia seedlings, a plan for exactly where each one would go, and a mentor he still calls once a month. A year on, that hillside has shade again — the kind goats rest under, and grandmothers, and everyone who remembers when it wasn\u2019t there."',
      stats: [
        { n: '800+', l: 'Trees Planted' },
        { n: '9', l: 'Acres Restored' },
        { n: '3', l: 'Sites Active' },
      ],
    },
  ]

  const impactNumbers = [
    { n: '120+', l: 'People reached across all four pillars', accent: 'var(--forest, #379764)' },
    { n: '40+', l: 'Women trained in business & financial literacy', accent: 'var(--gold)' },
    { n: '800+', l: 'Indigenous trees planted across 3 sites', accent: 'var(--earth, #b0591f)' },
    { n: '50+', l: 'Households supported with community care', accent: 'var(--sky, #2f86bd)' },
    { n: '20+', l: 'Youth in annual leadership programmes', accent: 'var(--forest-light, #57b884)' },
    { n: '9', l: 'Villages with active programme presence', accent: 'var(--gold)' },
  ]

  const partners = [
    {
      name: 'RoamRoar Kenya Safaris',
      logo: 'https://cdn.prod.website-files.com/664501c0a1543edee1fe122e/6996b4af410c1720487b9422_roamroar-logo.svg',
      tagline: 'Community Development Partner in Kenya',
      url: 'https://roamroarkenyasafaris.com/',
    },
  ]

  return (
    <main>
      <style jsx global>{`
        :root {
          --navy: #10241f;
          --navy-mid: #163530;
          --navy-card: #1b3d36;
          --navy-light: #234a40;
          --navy-border: rgba(255, 255, 255, 0.1);
          --steel: #235271;
          --gold: #f5b731;
          --forest: #379764;
          --forest-light: #57b884;
          --forest-deep: #1c4a34;
          --sky: #2f86bd;
          --earth: #b0591f;
          --text-bright: #ffffff;
          --text-mid: #c3d0c9;
          --text-dim: #93a49c;
        }
        body {
          background: var(--navy);
        }
      `}</style>
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
            filter: 'brightness(0.72) saturate(1.35) contrast(1.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,20,16,0.18) 0%, rgba(10,20,16,0.05) 38%, rgba(10,20,16,0.88) 100%)',
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
            remembers <em style={{ fontStyle: 'italic', color: 'var(--gold)', textShadow: '0 2px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)' }}>who it is,</em><br />
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
            Samburu Wellness &amp; Resilience walks alongside the people of Samburu County — across four pillars, four ways of saying the same thing: we see you, and we are not going anywhere.
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
              alt="Samburu warrior"
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

            <a href="/who-we-are#team" className="btn-outline">Meet Our Team →</a>
          </div>
        </div>
      </section>

      {/* ── CONTEXT BAND ── */}
      <section
        style={{
          background: 'linear-gradient(120deg, var(--navy-mid) 0%, var(--steel) 55%, var(--navy-mid) 100%)',
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
              Its communities have survived drought, conflict, and decades of neglect through extraordinary solidarity. Our role is not to rescue — it is to stand with them. Addressed together, women's empowerment, youth resilience, community care, and land stewardship don't just help. They make transformation inevitable.
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
                  background: 'linear-gradient(165deg, var(--navy) 0%, rgba(55,151,100,0.22) 140%)',
                  border: '1px solid var(--navy-border)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  borderTop: `3px solid ${p.accent}`,
                }}
              >
                <div style={{ position: 'relative', height: 'clamp(220px, 24vw, 280px)' }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
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
                  {p.paras.map((para, idx) => (
                    <p
                      key={idx}
                      style={{
                        fontSize: 'clamp(13px,1.15vw,15px)',
                        color: 'var(--text-mid)',
                        lineHeight: 1.8,
                        marginBottom: idx === p.paras.length - 1 ? '18px' : '12px',
                      }}
                    >
                      {para}
                    </p>
                  ))}

                  <blockquote
                    style={{
                      borderLeft: `2px solid ${p.accent}`,
                      paddingLeft: '14px',
                      margin: '0 0 20px',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: 'italic',
                        fontSize: 'clamp(13.5px,1.2vw,15.5px)',
                        color: 'var(--text-bright)',
                        lineHeight: 1.7,
                      }}
                    >
                      {p.quote}
                    </p>
                  </blockquote>

                  {p.list ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--navy-border)', paddingTop: '16px' }}>
                      {p.list.map((item) => (
                        <li
                          key={item}
                          style={{
                            fontSize: 'clamp(12px,1.05vw,13.5px)',
                            color: 'var(--text-dim)',
                            lineHeight: 1.6,
                            marginBottom: '8px',
                            paddingLeft: '16px',
                            position: 'relative',
                          }}
                        >
                          <span style={{ position: 'absolute', left: 0, color: p.accent }}>—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
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
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(28px,4vw,48px)' }}>
            <a href="/our-work" className="btn-brown">Explore All Programmes</a>
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
                  background: 'linear-gradient(165deg, var(--navy) 0%, rgba(55,151,100,0.2) 150%)',
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
          Every contribution reaches a real person, on one of four paths, in a real village.
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
