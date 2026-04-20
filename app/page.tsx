export default function Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .maint-root {
          min-height: 100vh;
          width: 100%;
          background: #0D3D49;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .maint-landscape {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 1; }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.15); opacity: 0.7; }
        }

        .maint-star { animation: twinkle ease-in-out infinite; }

        .maint-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 5vw, 2.5rem);
          max-width: 580px;
          width: 100%;
        }

        .maint-logo-wrap {
          animation: floatUp 0.8s ease 0.1s both;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .maint-logo-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.6rem;
        }

        .maint-org-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 3vw, 1.15rem);
          font-weight: 400;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.06em;
        }

        .maint-org-sub {
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .maint-divider {
          animation: floatUp 0.8s ease 0.22s both;
          width: 42px;
          height: 2px;
          background: linear-gradient(90deg, #C0472A, #E8864A);
          margin: 0 auto 2rem;
        }

        .maint-headline {
          animation: floatUp 0.8s ease 0.32s both;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 8vw, 3.6rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .maint-headline em {
          font-style: italic;
          color: rgba(255,255,255,0.65);
        }

        .maint-message {
          animation: floatUp 0.8s ease 0.42s both;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 3vw, 1.15rem);
          font-weight: 300;
          font-style: italic;
          line-height: 1.85;
          color: rgba(255,255,255,0.6);
          max-width: 400px;
          margin: 0 auto 2.5rem;
        }

        .maint-badge {
          animation: floatUp 0.8s ease 0.52s both;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.16);
          color: rgba(255,255,255,0.65);
          padding: 0.65rem 1.6rem;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .maint-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .maint-footer {
          animation: floatUp 0.8s ease 0.62s both;
          margin-top: 3rem;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
        }

        @media (max-width: 480px) {
          .maint-headline { font-size: 2.2rem; }
          .maint-message  { font-size: 1rem; }
        }
      `}</style>

      <div className="maint-root">

        {/* ── Illustrated landscape background ── */}
        <svg className="maint-landscape" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">

          {/* Sky */}
          <rect width="1440" height="900" fill="#0D3D49"/>
          <rect width="1440" height="520" fill="#071E25" opacity="0.55"/>

          {/* Stars */}
          {[
            [120,58,1.2,3.1,0],[280,38,0.8,2.4,0.5],[430,75,1.4,3.8,0.2],
            [600,28,1.0,2.9,1.0],[718,52,0.7,4.2,0.7],[905,42,1.3,3.4,0.3],
            [1055,22,0.9,2.7,0.9],[1195,68,1.1,3.6,0.4],[1355,46,0.8,4.5,1.2],
            [185,118,0.9,3.2,0.8],[822,88,0.6,2.5,1.5],[1105,108,1.2,3.9,0.1],
            [48,158,0.7,4.1,2.0],[1398,136,1.0,2.8,0.6],[340,145,0.8,3.5,1.1],
            [970,30,1.1,4.0,0.3],[650,138,0.6,2.6,1.8],[1240,155,0.9,3.3,0.7],
          ].map(([cx,cy,r,dur,delay],i) => (
            <circle key={i} className="maint-star" cx={cx} cy={cy} r={r} fill="#fff"
              style={{animationDuration:`${dur}s`,animationDelay:`${delay}s`}}/>
          ))}

          {/* Moon */}
          <circle cx="1282" cy="112" r="40" fill="#1A5C6B" opacity="0.35"/>
          <circle cx="1282" cy="112" r="30" fill="#EDE5D0" opacity="0.88"/>
          <circle cx="1268" cy="100" r="20" fill="#0D3D49" opacity="0.48"/>

          {/* Far mountains */}
          <path d="M0 610 Q200 460 400 530 Q580 590 760 490 Q940 395 1120 470 Q1290 545 1440 510 L1440 900 L0 900Z" fill="#082830" opacity="0.88"/>

          {/* Mid hills */}
          <path d="M0 690 Q220 590 440 635 Q660 680 860 595 Q1060 510 1240 590 Q1360 645 1440 620 L1440 900 L0 900Z" fill="#061E25"/>

          {/* Ground */}
          <path d="M0 780 Q360 745 720 768 Q1080 790 1440 758 L1440 900 L0 900Z" fill="#040E12"/>
          <rect x="0" y="845" width="1440" height="55" fill="#030C0F"/>

          {/* Warm horizon glow */}
          <ellipse cx="720" cy="625" rx="520" ry="55" fill="#C0472A" opacity="0.065"/>
          <ellipse cx="720" cy="648" rx="300" ry="25" fill="#E8864A" opacity="0.055"/>

          {/* Acacia left ── trunk + branches + canopy */}
          <line x1="175" y1="900" x2="175" y2="672" stroke="#12180A" strokeWidth="9"/>
          <line x1="175" y1="758" x2="118" y2="705" stroke="#12180A" strokeWidth="5"/>
          <line x1="175" y1="736" x2="245" y2="690" stroke="#12180A" strokeWidth="5"/>
          <line x1="175" y1="720" x2="148" y2="690" stroke="#12180A" strokeWidth="3"/>
          <ellipse cx="128" cy="693" rx="52" ry="16" fill="#0A2610" opacity="0.92"/>
          <ellipse cx="175" cy="666" rx="72" ry="17" fill="#0C3012"/>
          <ellipse cx="247" cy="678" rx="52" ry="15" fill="#0A2610" opacity="0.88"/>
          <ellipse cx="155" cy="678" rx="38" ry="11" fill="#0C3012" opacity="0.7"/>

          {/* Acacia right ── trunk + branches + canopy */}
          <line x1="1265" y1="900" x2="1265" y2="692" stroke="#12180A" strokeWidth="8"/>
          <line x1="1265" y1="772" x2="1200" y2="720" stroke="#12180A" strokeWidth="5"/>
          <line x1="1265" y1="750" x2="1332" y2="708" stroke="#12180A" strokeWidth="5"/>
          <line x1="1265" y1="730" x2="1290" y2="700" stroke="#12180A" strokeWidth="3"/>
          <ellipse cx="1205" cy="708" rx="50" ry="15" fill="#0A2610" opacity="0.92"/>
          <ellipse cx="1265" cy="684" rx="68" ry="16" fill="#0C3012"/>
          <ellipse cx="1330" cy="696" rx="50" ry="14" fill="#0A2610" opacity="0.88"/>
          <ellipse cx="1282" cy="695" rx="35" ry="10" fill="#0C3012" opacity="0.7"/>

          {/* Small acacia mid-right */}
          <line x1="1055" y1="900" x2="1055" y2="755" stroke="#12180A" strokeWidth="5"/>
          <line x1="1055" y1="790" x2="1020" y2="762" stroke="#12180A" strokeWidth="3"/>
          <ellipse cx="1020" cy="756" rx="32" ry="10" fill="#0A2610" opacity="0.85"/>
          <ellipse cx="1055" cy="746" rx="44" ry="12" fill="#0C3012"/>
          <ellipse cx="1085" cy="754" rx="30" ry="9" fill="#0A2610" opacity="0.8"/>

          {/* Giraffe silhouette 1 — distant left */}
          <g transform="translate(355,650)" opacity="0.55">
            <rect x="16" y="0" width="6" height="52" fill="#080F05" rx="2"/>
            <rect x="14" y="-26" width="10" height="32" fill="#080F05" rx="3"/>
            <rect x="18" y="-50" width="4" height="26" fill="#080F05" rx="2"/>
            <ellipse cx="20" cy="-52" rx="7" ry="5" fill="#080F05"/>
            <rect x="8" y="36" width="5" height="22" fill="#080F05" rx="1"/>
            <rect x="26" y="36" width="5" height="22" fill="#080F05" rx="1"/>
          </g>

          {/* Giraffe silhouette 2 — larger center-right */}
          <g transform="translate(870,608)" opacity="0.68">
            <rect x="20" y="0" width="8" height="68" fill="#080F05" rx="2"/>
            <rect x="17" y="-34" width="13" height="42" fill="#080F05" rx="3"/>
            <rect x="22" y="-64" width="5" height="32" fill="#080F05" rx="2"/>
            <ellipse cx="25" cy="-66" rx="9" ry="6" fill="#080F05"/>
            <rect x="7" y="46" width="6" height="30" fill="#080F05" rx="1"/>
            <rect x="31" y="46" width="6" height="30" fill="#080F05" rx="1"/>
          </g>

          {/* Giraffe silhouette 3 — small far right */}
          <g transform="translate(1150,670)" opacity="0.4">
            <rect x="10" y="0" width="4" height="38" fill="#080F05" rx="2"/>
            <rect x="8" y="-18" width="8" height="24" fill="#080F05" rx="2"/>
            <rect x="11" y="-36" width="3" height="20" fill="#080F05" rx="1"/>
            <ellipse cx="13" cy="-38" rx="5" ry="4" fill="#080F05"/>
            <rect x="4" y="26" width="4" height="16" fill="#080F05" rx="1"/>
            <rect x="18" y="26" width="4" height="16" fill="#080F05" rx="1"/>
          </g>

          {/* Ground mist */}
          <rect x="0" y="810" width="1440" height="40" fill="#0D3D49" opacity="0.22"/>
        </svg>

        {/* ── Main content ── */}
        <div className="maint-content">

          <div className="maint-logo-wrap">
            <div className="maint-logo-circle">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="17" cy="17" r="11" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4"/>
                <path d="M17 8 Q22 14 17 19 Q12 14 17 8Z" fill="rgba(255,255,255,0.55)"/>
                <circle cx="17" cy="23" r="2.2" fill="rgba(255,255,255,0.45)"/>
              </svg>
            </div>
            <div className="maint-org-name">Samburu Wellness Resilience</div>
            <div className="maint-org-sub">Samburu County, Kenya</div>
          </div>

          <div className="maint-divider"/>

          <h1 className="maint-headline">
            We&rsquo;ll be back<br/>
            <em>very soon</em>
          </h1>

          <p className="maint-message">
            Our site is currently undergoing maintenance. We are working hard to bring you a better experience. Thank you for your patience and continued support.
          </p>

          <div className="maint-badge">
            <div className="maint-dot"/>
            Back online shortly
          </div>

          <div className="maint-footer">
            Samburu County, Kenya &nbsp;&middot;&nbsp; samburuwellness.org
          </div>

        </div>
      </div>
    </>
  )
}
