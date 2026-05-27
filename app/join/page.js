'use client'
import { useState } from 'react'
import { submitJoinRequest } from '@/lib/supabase'

export default function JoinPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', location:'', role:'', skills:'', motivation:'' })
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await submitJoinRequest(form)
    setStatus(error ? 'error' : 'success')
  }

  const roles = ['Community Health Worker','Women Empowerment Facilitator','Youth Mentor','Field Officer','Communications & Media','Finance & Admin','Technology Support','General Volunteer']
  const whyJoin = [
    { icon:'🌍', title:'Real Impact', text:'Your work directly improves lives across Samburu County.' },
    { icon:'🌱', title:'Grow With Us', text:'We invest in the professional and personal development of our team.' },
    { icon:'🤝', title:'Deep Community', text:'Join a team that is genuinely family — rooted, caring, and committed.' },
    { icon:'✊', title:'Social Justice', text:'Be part of a movement, not just an organisation.' },
  ]

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">Join Our Team</p>
          <h1>Be Part of the<br /><em>Change</em></h1>
          <p>Samburu Wellness & Resilience is built by people who care deeply. If that's you, we want to hear from you.</p>
        </div>
      </div>

      <section className="section" style={{background:'var(--navy)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',className:'join-grid',style:{},gap:'clamp(32px,5vw,72px)',alignItems:'start'}}>
          <div>
            <p className="section-eyebrow">Why Join Us</p>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(24px,2.8vw,36px)',color:'var(--text-bright)',marginBottom:'24px',lineHeight:1.2,fontWeight:500}}>Work That <em style={{color:'var(--gold)'}}>Matters</em></h2>
            {whyJoin.map(item => (
              <div key={item.title} style={{display:'flex',gap:'14px',marginBottom:'22px',alignItems:'flex-start',padding:'16px',background:'var(--navy-card)',borderRadius:'10px',border:'1px solid var(--navy-border)'}}>
                <div style={{fontSize:'26px',flexShrink:0}}>{item.icon}</div>
                <div>
                  <h4 style={{fontFamily:'Cormorant Garamond,serif',color:'var(--text-bright)',fontSize:'clamp(16px,1.5vw,19px)',marginBottom:'4px',fontWeight:500}}>{item.title}</h4>
                  <p style={{fontSize:'clamp(12px,1.1vw,14px)',color:'var(--text-mid)',lineHeight:1.6}}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            {status === 'success' ? (
              <div style={{background:'var(--navy-card)',border:'1.5px solid var(--gold)',borderRadius:'12px',padding:'clamp(36px,4vw,52px)',textAlign:'center'}}>
                <div style={{fontSize:'52px',marginBottom:'16px'}}>🌟</div>
                <h3 style={{fontFamily:'Cormorant Garamond,serif',color:'var(--text-bright)',fontSize:'clamp(22px,2.5vw,28px)',marginBottom:'14px',fontWeight:500}}>Application Received!</h3>
                <p style={{color:'var(--text-mid)',maxWidth:'360px',margin:'0 auto',lineHeight:1.7,fontSize:'14px'}}>Thank you for wanting to be part of Samburu Wellness & Resilience. We'll review your application and be in touch within 5 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{background:'var(--navy-card)',border:'1px solid var(--navy-border)',borderRadius:'12px',padding:'clamp(22px,3vw,36px)'}}>
                <div className="form-row">
                  <div className="form-group"><label>Full Name *</label><input className="form-input" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your full name" /></div>
                  <div className="form-group"><label>Email Address *</label><input className="form-input" type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="your@email.com" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Phone Number</label><input className="form-input" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+254..." /></div>
                  <div className="form-group"><label>Location *</label><input className="form-input" required value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="Town / County / Country" /></div>
                </div>
                <div className="form-group">
                  <label>Preferred Role *</label>
                  <select className="form-select" required value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                    <option value="">Select a role</option>
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Skills & Experience</label><textarea className="form-textarea" value={form.skills} onChange={e=>setForm(p=>({...p,skills:e.target.value}))} placeholder="Tell us about your relevant skills, training, or experience..." style={{minHeight:'110px'}} /></div>
                <div className="form-group"><label>Why Do You Want to Join? *</label><textarea className="form-textarea" required value={form.motivation} onChange={e=>setForm(p=>({...p,motivation:e.target.value}))} placeholder="What motivates you to work with Samburu Wellness & Resilience?" style={{minHeight:'130px'}} /></div>
                <button type="submit" className="btn-amber" disabled={status==='sending'} style={{fontSize:'14px',padding:'13px 28px',width:'100%'}}>
                  {status==='sending' ? 'Submitting...' : 'Submit Application →'}
                </button>
                {status==='error' && <p style={{color:'#ef4444',marginTop:'12px',fontSize:'13px'}}>Something went wrong. Please email us at info@samburuwellness.org</p>}
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
