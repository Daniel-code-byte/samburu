'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Heart, Shield } from 'lucide-react'

const ADMIN_PASSWORD = 'samburu2024admin'

export default function AdminLogin() {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const router = useRouter()

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('sw_admin', '1')
      router.push('/admin/dashboard')
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D3D49 0%, #1A5C6B 50%, #0D3D49 100%)',
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: 400, borderRadius: 8,
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
        animation: shaking ? 'shake 0.4s ease' : undefined,
        overflow: 'hidden',
      }}>
        <div style={{ background: 'var(--teal)', padding: '2rem', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Heart size={26} color="#fff" />
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
            Samburu Mental Health
          </div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', marginTop: '0.25rem' }}>
            Admin Dashboard
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
            Enter your password to manage the website
          </p>

          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <input
              type={show ? 'text' : 'password'}
              className="field"
              placeholder="Admin password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              style={{ borderColor: error ? 'var(--rust)' : undefined, paddingRight: '2.5rem', fontSize: '0.95rem' }}
              autoFocus
            />
            <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div style={{ color: 'var(--rust)', fontSize: '0.82rem', marginBottom: '0.75rem', textAlign: 'center', background: 'var(--rust-pale)', padding: '0.5rem', borderRadius: 2 }}>
              Wrong password. Try again.
            </div>
          )}

          <button
            onClick={login}
            style={{
              width: '100%', background: 'var(--teal)', color: '#fff', border: 'none',
              padding: '0.9rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', borderRadius: 2, transition: 'background 0.2s',
            }}
          >
            Enter Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: '1.25rem', fontSize: '0.74rem', color: '#C0CCCE' }}>
            <Shield size={11} /> Password: samburu2024admin
          </div>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
    </div>
  )
}
