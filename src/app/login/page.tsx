'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [mode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [, setSuccess] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Check your email to confirm your account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <span style={{ color: '#0c0c0c', fontSize: '40px', fontWeight: 'bold' }}>V</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '300', color: 'white', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Welcome to Vrixo</h1>
        <p style={{ color: '#5a5a5a', fontSize: '16px', margin: 0 }}>Your AI-powered social media assistant</p>
      </div>

      <div style={{ background: '#141414', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', border: '1px solid #1f1f1f' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#5a5a5a" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '8px', border: '1px solid #1f1f1f', background: '#0c0c0c', color: 'white', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#5a5a5a" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              style={{ width: '100%', padding: '14px 44px 14px 44px', borderRadius: '8px', border: '1px solid #1f1f1f', background: '#0c0c0c', color: 'white', fontSize: '15px', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5a5a5a', padding: 0 }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(168, 255, 120, 0.1)', color: '#a8ff78', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '14px', borderRadius: '9999px', border: 'none', background: '#f0f0f0', color: '#0c0c0c', fontSize: '15px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            Sign In
          </button>

          <button
            type="button"
            onClick={async () => {
              setError('')
              setLoading(true)
              try {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                setSuccess('Check your email to confirm your account!')
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An error occurred')
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            style={{ padding: '14px', borderRadius: '9999px', border: '1px solid #1f1f1f', background: 'transparent', color: '#ffffff', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
          >
            Sign Up
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
