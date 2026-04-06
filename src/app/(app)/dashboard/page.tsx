'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Briefcase, MessageCircle, Camera, Video, MessageCircle as MessageCircleIcon } from 'lucide-react'

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', icon: Briefcase, subtitle: 'Professional posts' },
  { id: 'twitter', name: 'Twitter', color: '#ffffff', icon: MessageCircle, subtitle: 'Tweets & threads' },
  { id: 'instagram', name: 'Instagram', color: '#e1306c', icon: Camera, subtitle: 'Captions & stories' },
  { id: 'youtube', name: 'YouTube', color: '#ff0000', icon: Video, subtitle: 'Video descriptions' },
]

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const email = user.email || ''
      setFirstName(email.split('@')[0])
    }
    getUser()
  }, [supabase, router])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '0 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '60px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#666666', margin: 0 }}>
            Good morning, {firstName}
          </p>
          <h1 style={{ fontSize: '24px', color: '#ffffff', fontWeight: '500', margin: '8px 0 0' }}>
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