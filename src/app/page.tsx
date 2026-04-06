'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function RootPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #1e1e1e', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: '#7c3aed', 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 32px'
        }}>
          <span style={{ color: 'white', fontSize: '36px', fontWeight: '700' }}>V</span>
        </div>
        
        <h1 style={{ fontSize: '48px', fontWeight: '600', color: 'white', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Welcome to Vrixo
        </h1>
        <p style={{ fontSize: '18px', color: '#888888', margin: '0 0 48px', maxWidth: '400px' }}>
          AI-powered social media content creation for every platform
        </p>
        
        <button
          onClick={() => router.push('/login')}
          style={{
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 40px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s ease'
          }}
        >
          Get Started
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}