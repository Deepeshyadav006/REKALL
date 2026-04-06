'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Briefcase, MessageCircle, Camera, Video, MessageCircle as MessageCircleIcon } from 'lucide-react'

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', icon: Briefcase, subtitle: 'Professional posts' },
  { id: 'twitter', name: 'Twitter', color: '#ffffff', icon: MessageCircle, subtitle: 'Tweets & threads' },
  { id: 'instagram', name: 'Instagram', color: '#e1306c', icon: Camera, subtitle: 'Captions & stories' },
  { id: 'youtube', name: 'YouTube', color: '#ff0000', icon: Video, subtitle: 'Video descriptions' },
]

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setLoading(false)
    }
    getUser()
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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '0 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '60px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', color: '#ffffff', fontWeight: '500', margin: '0' }}>
            What are you creating today?
          </h1>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 160px)', 
          gap: '16px', 
          justifyContent: 'center',
          marginTop: '40px'
        }}>
          {platforms.map((platform) => (
            <div 
              key={platform.id}
              onClick={() => router.push(`/create/${platform.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1e1e1e'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              style={{ 
                width: '160px', 
                height: '180px',
                background: '#111111',
                border: '1px solid #1e1e1e',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px',
                borderRadius: '10px',
                background: `${platform.color}26`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <platform.icon size={24} color={platform.color} />
              </div>
              <p style={{ fontSize: '14px', color: 'white', fontWeight: '500', margin: '12px 0 0' }}>
                {platform.name}
              </p>
              <p style={{ fontSize: '11px', color: '#555555', margin: '4px 0 0' }}>
                {platform.subtitle}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => router.push('/chat')}
            style={{ 
              background: '#7c3aed',
              color: 'white',
              borderRadius: '10px',
              padding: '12px 32px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MessageCircleIcon size={18} />
            Chat with Vrixo AI
          </button>
          <p style={{ fontSize: '12px', color: '#444444', marginTop: '8px' }}>
            Ask anything about your social media strategy
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: repeat(2, 160px) !important;
          }
        }
      `}</style>
    </div>
  )
}