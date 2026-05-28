'use client'
import { useState } from 'react'
import { submitPartnership } from '@/lib/supabase'

export default function PartnerPage() {
  const [form, setForm] = useState({ name:'', org:'', email:'', phone:'', tier:'Community Partner', message:'', payment_method:'' })
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await submitPartnership({ ...form, status: 'pending' })
    setStatus(error ? 'error' : 'success')
  }

  const tiers = [
    { badge:'Community Level', name:'Community Partner', accent:'var(--sky)',
      features:['Logo on website','Quarterly impact reports','Social media recognition','Programme updates newsletter','Community dedication certificate'] },
    { badge:'Organisational Level', name:'Organisational Partner', featured:true, accent:'var(--gold)',
      features:['All Community Partner benefits','Named programme sponsorship','Annual site visit invitation','Co-branded campaign materials','Board advisory opportunity','Priority event invitations'] },
    { badge:'Global Level', name:'Global Partner', accent:'var(--gold)',
      features:['All Organisational Partner benefits','Strategic programme co-design','Annual CEO briefing','Joint press release opportunity','VIP impact trip to Samburu','Bespoke impact reporting'] },
  ]

  const payments = [
    { icon:'📱', name:'M-Pesa', detail:'+254 708 588479', sub:'Business: Samburu Wellness' },
    { icon:'🌐', name:'PayPal', detail:'paypal.me/samburuwellness', sub:'International donors welcome' },
    { icon:'🏦', name:'Bank Transfer', detail:'Equity Bank Kenya', sub:'Contact us for account details' },
  ]

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">Partner With Us</p>
          <h1>Invest in a<br /><em>Story That Lasts</em></h1>
          <p>Partnerships are built on trust, transparency, and genuine shared purpose — not just logo placement.</p>
        </div>
      </div>

      {/* TIERS */}
      <section className="section" style={{background:'var(--navy)'}}>
        <div className="section-inner">
          <p className="section-eyebrow">Partnership Levels</p>
          <h2 className="section-title">Choose Your <em>Level of Impact</em></h2>
          <div className="tiers-grid">
            {tiers.map(tier => (
              <div key={tier.name} className={`tier-card${tier.featured ? ' featured' : ''}`} style={tier.featured ? {} : {borderTopColor:tier.accent}}>
                {tier.featured && (
                  <div style={{position:'absolute',top:'-1px',right:'18px',background:'var(--gold)',color:'#04101F',fontSize:'9px',fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:'0 0 6px 6px'}}>Most Popular</div>
                )}
                <div className="tier-badge">{tier.badge}</div>
                <div className="tier-name">{tier.name}</div>
                <ul className="tier-features">
                  {tier.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className={tier.featured ? 'btn-amber' : 'btn-outline'}
                  onClick={() => { setForm(p => ({...p, tier: tier.name})); document.getElementById('partner-form').scrollIntoView({behavior:'smooth'}) }}
                  style={{width:'100%',textAlign:'center'}}>
                  Apply for This Tier
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT METHODS */}
      <section className="section" style={{background:'var(--navy-card)'}}>
        <div className="section-inner">
          <p className="section-eyebrow">How to Give</p>
          <h2 className="section-title">Payment <em>Methods</em></h2>
          <p style={{color:'var(--text-mid)',maxWidth:'560px',fontSize:'clamp(13px,1.3vw,16px)',marginBottom:'8px',lineHeight:1.7}}>We accept contributions through multiple channels to make giving accessible from anywhere in the world.</p>
          <div className="payment-methods">
            {payments.map(p => (
              <div key={p.name} className="payment-card">
                <div className="pay-icon">{p.icon}</div>
                <h4>{p.name}</h4>
                <p>{p.detail}</p>
                <p>{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="section" style={{background:'var(--navy)'}} id="partner-form">
        <div className="section-inner">
          <p className="section-eyebrow">Get Started</p>
          <h2 className="section-title">Partnership <em>Application</em></h2>
          <div style={{maxWidth:'700px'}}>
            {status === 'success' ? (
              <div style={{background:'var(--navy-card)',border:'1.5px solid var(--gold)',borderRadius:'12px',padding:'clamp(36px,4vw,52px)',textAlign:'center'}}>
                <div style={{fontSize:'48px',marginBottom:'16px'}}>🤝</div>
                <h3 style={{fontFamily:'Cormorant Garamond,serif',color:'var(--text-bright)',fontSize:'clamp(22px,2.5vw,28px)',marginBottom:'12px',fontWeight:500}}>Thank You for Your Interest!</h3>
                <p style={{color:'var(--text-mid)',fontSize:'14px'}}>We've received your application and will be in touch within 3 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{background:'var(--navy-card)',border:'1px solid var(--navy-border)',borderRadius:'12px',padding:'clamp(22px,3vw,36px)'}}>
                <div className="form-row">
                  <div className="form-group"><label>Full Name *</label><input className="form-input" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your full name" /></div>
                  <div className="form-group"><label>Organisation</label><input className="form-input" value={form.org} onChange={e=>setForm(p=>({...p,org:e.target.value}))} placeholder="Organisation name (if applicable)" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Email Address *</label><input className="form-input" type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="your@email.com" /></div>
                  <div className="form-group"><label>Phone Number</label><input className="form-input" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+254..." /></div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Partnership Tier *</label>
                    <select className="form-select" required value={form.tier} onChange={e=>setForm(p=>({...p,tier:e.target.value}))}>
                      <option>Community Partner</option>
                      <option>Organisational Partner</option>
                      <option>Global Partner</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preferred Payment Method</label>
                    <select className="form-select" value={form.payment_method} onChange={e=>setForm(p=>({...p,payment_method:e.target.value}))}>
                      <option value="">Select method</option>
                      <option>M-Pesa</option>
                      <option>PayPal</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Tell Us About Your Interest</label><textarea className="form-textarea" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="What draws you to partner with us? Any specific programmes or areas you'd like to support?" /></div>
                <button type="submit" className="btn-amber" disabled={status==='sending'} style={{fontSize:'14px',padding:'13px 28px',width:'100%'}}>
                  {status==='sending' ? 'Submitting...' : 'Submit Application →'}
                </button>
                {status==='error' && <p style={{color:'#ef4444',marginTop:'12px',fontSize:'13px'}}>Something went wrong. Please try again or email us directly.</p>}
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
