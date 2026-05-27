'use client'
import { useState } from 'react'

const AMOUNTS = [500, 1000, 2500, 5000, 10000]

export default function DonatePage() {
  const [selected, setSelected] = useState(1000)
  const [custom, setCustom] = useState('')
  const [copied, setCopied] = useState('')

  const amount = custom ? parseInt(custom) : selected

  function copy(text, label) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const impacts = [
    { n: 'KES 500', l: 'Feeds a child for a week' },
    { n: 'KES 1,000', l: 'Covers a clinic visit' },
    { n: 'KES 5,000', l: "Sponsors a girl's school term" },
    { n: 'KES 10,000', l: 'Trains a health worker' },
  ]

  const steps = [
    'Go to M-Pesa on your phone',
    'Select Lipa Na M-Pesa',
    'Select Pay Bill',
    <>Enter Business No: <strong style={{color:'var(--text-bright)'}}>400200</strong></>,
    <>Enter Account No: <strong style={{color:'var(--text-bright)'}}>1155673</strong></>,
    amount > 0 ? <>Enter Amount: <strong style={{color:'var(--gold)'}}>KES {amount.toLocaleString()}</strong></> : 'Enter your chosen amount',
    'Enter your M-Pesa PIN and confirm',
    'You will receive an SMS confirmation ✓',
  ]

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">Donate</p>
          <h1>Give to <em>Samburu</em></h1>
          <p>Every contribution — large or small — directly funds healthcare, women's empowerment, youth programmes, and community care across Samburu County.</p>
        </div>
      </div>

      <section className="stats-bar">
        <div className="stats-grid">
          {impacts.map(i => (
            <div key={i.n}>
              <div className="stat-number" style={{fontSize:'clamp(18px,2.5vw,30px)'}}>{i.n}</div>
              <div className="stat-label">{i.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{background:'var(--navy)'}}>
        <div className="section-inner" style={{maxWidth:'860px'}}>

          {/* AMOUNT */}
          <p className="section-eyebrow">Step 1</p>
          <h2 className="section-title" style={{marginBottom:'28px'}}>Choose an <em>Amount</em></h2>
          <div style={{display:'flex',flexWrap:'wrap',gap:'10px',marginBottom:'18px'}}>
            {AMOUNTS.map(a => (
              <button key={a} onClick={() => { setSelected(a); setCustom('') }}
                style={{
                  padding:'clamp(10px,1.5vw,14px) clamp(16px,2vw,26px)',
                  border: selected === a && !custom ? '2px solid var(--gold)' : '1.5px solid var(--navy-border)',
                  background: selected === a && !custom ? 'var(--gold-glow)' : 'var(--navy-card)',
                  color: selected === a && !custom ? 'var(--gold)' : 'var(--text-mid)',
                  borderRadius:'8px', fontWeight:700, fontSize:'clamp(13px,1.3vw,16px)',
                  cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all 0.2s',
                }}>
                KES {a.toLocaleString()}
              </button>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'48px',flexWrap:'wrap'}}>
            <span style={{color:'var(--text-dim)',fontSize:'13px',whiteSpace:'nowrap'}}>Or enter amount:</span>
            <div style={{position:'relative',maxWidth:'220px',flex:'1 1 180px'}}>
              <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'var(--text-dim)',fontSize:'13px',fontWeight:600}}>KES</span>
              <input type="number" className="form-input" style={{paddingLeft:'50px',fontWeight:700,fontSize:'15px'}}
                value={custom} onChange={e => setCustom(e.target.value)} placeholder="Other amount" min="1" />
            </div>
          </div>

          {/* MPESA */}
          <p className="section-eyebrow">Step 2</p>
          <h2 className="section-title" style={{marginBottom:'24px'}}>M-Pesa <em>Paybill</em></h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'20px',marginBottom:'40px'}}>

            <div style={{background:'var(--navy-card)',border:'1.5px solid var(--gold)',borderRadius:'12px',padding:'clamp(20px,3vw,32px)',boxShadow:'0 8px 32px rgba(212,168,75,0.08)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'22px'}}>
                <div style={{width:'46px',height:'46px',background:'rgba(52,194,112,0.15)',borderRadius:'10px',border:'1px solid rgba(52,194,112,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>📱</div>
                <div>
                  <p style={{fontWeight:700,color:'var(--text-bright)',fontSize:'16px'}}>M-Pesa Paybill</p>
                  <p style={{fontSize:'11px',color:'var(--text-dim)'}}>Lipa Na M-Pesa</p>
                </div>
              </div>
              {[
                {label:'Business Number (Paybill)', value:'400200', key:'paybill'},
                {label:'Account Number', value:'1155673', key:'account'},
              ].map(row => (
                <div key={row.key} style={{background:'var(--navy-panel)',borderRadius:'8px',padding:'16px',marginBottom:'10px'}}>
                  <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:'8px'}}>{row.label}</p>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px'}}>
                    <p style={{fontSize:'clamp(22px,3vw,30px)',fontWeight:800,color:'var(--text-bright)',letterSpacing:'0.04em',fontFamily:'DM Sans,monospace'}}>{row.value}</p>
                    <button onClick={() => copy(row.value, row.key)}
                      style={{background:copied===row.key?'rgba(52,194,112,0.2)':'var(--gold-glow)',color:copied===row.key?'#34C270':'var(--gold)',border:`1px solid ${copied===row.key?'rgba(52,194,112,0.3)':'rgba(212,168,75,0.3)'}`,borderRadius:'6px',padding:'6px 12px',fontSize:'11px',cursor:'pointer',fontWeight:700,transition:'all 0.2s',whiteSpace:'nowrap'}}>
                      {copied===row.key?'✓ Copied':'Copy'}
                    </button>
                  </div>
                </div>
              ))}
              {amount > 0 && (
                <div style={{background:'rgba(52,194,112,0.08)',border:'1px solid rgba(52,194,112,0.2)',borderRadius:'8px',padding:'14px'}}>
                  <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:'6px'}}>Amount</p>
                  <p style={{fontSize:'clamp(20px,3vw,28px)',fontWeight:800,color:'#34C270'}}>KES {amount.toLocaleString()}</p>
                </div>
              )}
            </div>

            <div style={{background:'var(--navy-card)',border:'1px solid var(--navy-border)',borderRadius:'12px',padding:'clamp(20px,3vw,32px)'}}>
              <p style={{fontWeight:700,color:'var(--text-bright)',fontSize:'15px',marginBottom:'18px',fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(17px,2vw,22px)'}}>How to pay on M-Pesa</p>
              {steps.map((step, i) => (
                <div key={i} style={{display:'flex',gap:'12px',marginBottom:'12px',alignItems:'flex-start'}}>
                  <div style={{width:'26px',height:'26px',background:'var(--gold-glow)',border:'1px solid rgba(212,168,75,0.3)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',fontWeight:700,fontSize:'12px',flexShrink:0}}>{i+1}</div>
                  <p style={{fontSize:'clamp(12px,1.2vw,14px)',color:'var(--text-mid)',lineHeight:1.55,paddingTop:'4px'}}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BANK */}
          <div style={{background:'var(--navy-card)',borderRadius:'12px',padding:'clamp(20px,3vw,28px)',marginBottom:'28px',border:'1px solid var(--navy-border)',display:'flex',gap:'16px',alignItems:'flex-start',flexWrap:'wrap'}}>
            <span style={{fontSize:'28px',flexShrink:0}}>🏦</span>
            <div>
              <p style={{fontWeight:700,color:'var(--text-bright)',fontSize:'16px',marginBottom:'6px',fontFamily:'Cormorant Garamond,serif'}}>Bank Transfer</p>
              <p style={{fontSize:'13px',color:'var(--text-dim)',marginBottom:'8px'}}>For international donors or larger contributions</p>
              <p style={{color:'var(--text-mid)',fontSize:'14px'}}>Contact us at <a href="mailto:info@samburuwellness.org" style={{color:'var(--gold)',fontWeight:600}}>info@samburuwellness.org</a> or <a href="tel:+254704579936" style={{color:'var(--gold)',fontWeight:600}}>+254 704 579 936</a> for bank details.</p>
            </div>
          </div>

          {/* THANK YOU */}
          <div style={{background:'linear-gradient(135deg,var(--navy-card),var(--steel))',borderRadius:'12px',padding:'clamp(28px,4vw,44px)',textAlign:'center',border:'1px solid var(--navy-border)'}}>
            <p style={{fontSize:'40px',marginBottom:'14px'}}>🙏</p>
            <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(20px,2.5vw,28px)',marginBottom:'12px',color:'var(--text-bright)',fontWeight:500}}>Every Shilling Makes a <em style={{color:'var(--gold)'}}>Difference</em></h3>
            <p style={{fontSize:'clamp(13px,1.3vw,15px)',color:'var(--text-mid)',maxWidth:'500px',margin:'0 auto 18px',lineHeight:1.75}}>Your donation is handled with full transparency. After giving, you'll receive a confirmation SMS from M-Pesa. For a receipt, email us anytime.</p>
            <a href="mailto:info@samburuwellness.org" style={{display:'inline-block',color:'var(--gold)',fontWeight:600,fontSize:'13px',letterSpacing:'0.05em'}}>info@samburuwellness.org</a>
          </div>
        </div>
      </section>
    </main>
  )
}
