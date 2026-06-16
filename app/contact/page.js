'use client'
import { useState } from 'react'
import { submitMessage } from '@/lib/supabase'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await submitMessage(form)
    setStatus(error ? 'error' : 'success')
  }

  const contacts = [
    { icon:'📍', label:'Location', text:<>Samburu County, Kenya<br />P.O. Box 00100 – Maralal</> },
    { icon:'📞', label:'Phone', text:<a href="tel:+254708588479" style={{color:'var(--gold)'}}>+254 708 588479</a> },
    { icon:'✉️', label:'Email', text:<a href="mailto:info@samburuwellness.org" style={{color:'var(--gold)'}}>info@samburuwellness.org</a> },
    { icon:'💬', label:'WhatsApp', text:<a href="https://wa.me/254704579936" target="_blank" rel="noopener noreferrer" style={{color:'var(--gold)'}}>Chat with us on WhatsApp</a> },
    { icon:'🕐', label:'Office Hours', text:<>Mon – Fri: 8:00 AM – 5:00 PM EAT<br />Saturday: 9:00 AM – 1:00 PM</> },
  ]

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">Contact Us</p>
          <h1>We'd Love to<br /><em>Hear from You</em></h1>
          <p>Whether you're a potential partner, journalist, researcher, or simply curious — our door is always open.</p>
        </div>
      </div>

      <section className="section" style={{background:'var(--navy)'}}>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            {contacts.map((c,i) => (
              <div key={i} className="contact-item">
                <div className="contact-icon">{c.icon}</div>
                <div className="contact-item-text">
                  <p>{c.label}</p>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
            <div style={{marginTop:'28px',padding:'clamp(18px,2.5vw,26px)',background:'var(--navy-card)',borderRadius:'10px',borderLeft:'3px solid var(--gold)',border:'1px solid var(--navy-border)',borderLeftWidth:'3px'}}>
              <p style={{fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',fontSize:'clamp(15px,1.5vw,18px)',color:'var(--text-bright)',lineHeight:1.6,fontWeight:300}}>
                "No question is too small. Every conversation could be the beginning of a partnership that changes lives."
              </p>
            </div>
          </div>

          <div>
            <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(22px,2.5vw,32px)',color:'var(--text-bright)',marginBottom:'24px',fontWeight:500}}>Send a <em style={{color:'var(--gold)'}}>Message</em></h3>
            {status === 'success' ? (
              <div style={{background:'var(--navy-card)',border:'1.5px solid var(--gold)',borderRadius:'12px',padding:'clamp(32px,4vw,48px)',textAlign:'center'}}>
                <div style={{fontSize:'48px',marginBottom:'16px'}}>✉️</div>
                <h3 style={{fontFamily:'Cormorant Garamond,serif',color:'var(--text-bright)',fontSize:'clamp(20px,2.5vw,26px)',marginBottom:'12px',fontWeight:500}}>Message Received!</h3>
                <p style={{color:'var(--text-mid)',fontSize:'14px'}}>We'll get back to you within 1–2 business days. Thank you for reaching out.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{background:'var(--navy-card)',border:'1px solid var(--navy-border)',borderRadius:'12px',padding:'clamp(22px,3vw,36px)'}}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input className="form-input" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input className="form-input" type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input className="form-input" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} placeholder="What is this about?" />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea className="form-textarea" required value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Tell us what's on your mind..." style={{minHeight:'180px'}} />
                </div>
                <button type="submit" className="btn-amber" disabled={status==='sending'} style={{fontSize:'14px',padding:'13px 28px',width:'100%'}}>
                  {status==='sending' ? 'Sending...' : 'Send Message →'}
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
