'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Briefcase, MessageCircle, Camera, Video, MessageSquare, Send } from 'lucide-react'

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', icon: Briefcase, subtitle: 'Professional posts & articles', size: 'bento-medium' },
  { id: 'twitter', name: 'Twitter / X', color: '#000000', icon: MessageCircle, subtitle: 'Tweets & threads', size: 'bento-medium' },
  { id: 'instagram', name: 'Instagram', color: '#e1306c', icon: Camera, subtitle: 'Captions & stories', size: 'bento-medium' },
  { id: 'youtube', name: 'YouTube', color: '#ff0000', icon: Video, subtitle: 'Descriptions & scripts', size: 'bento-medium' },
]

interface ChatHistory {
  id: number
  message: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      const { data: memoryRows } = await supabase
        .from('memory')
        .select('id, message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4)
      
      if (memoryRows) {
        setChatHistory(memoryRows.reverse())
      }
    }
    getUser()
  }, [supabase, router])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="bento-grid">
        <div className="bento-item bento-large" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            letterSpacing: '-0.03em', 
            margin: '0 0 16px',
            lineHeight: '1.1'
          }}>
            What are you<br />
            <span style={{ color: 'var(--color-accent)' }}>creating today?</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', margin: '0 0 24px', maxWidth: '500px' }}>
            Generate viral content for any platform with AI. Select a platform to get started.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => router.push('/chat')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} /> Start Chatting
            </button>
          </div>
        </div>

        <div className="bento-item bento-medium" onClick={() => router.push('/chat')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--color-accent)', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} color="#0c0c0c" />
            </div>
            <div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '0' }}>AI Chat</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', margin: '4px 0 0' }}>Free-form conversation</p>
            </div>
          </div>
          <div style={{ background: 'var(--color-bg-base)', borderRadius: '0', padding: '16px', border: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Ask anything...</span>
          </div>
        </div>

        {platforms.map((platform) => (
          <div 
            key={platform.id} 
            className={`bento-item ${platform.size}`}
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`/create/${platform.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: platform.color, 
                borderRadius: '0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <platform.icon size={20} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700', margin: '0' }}>{platform.name}</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', margin: '0 0 16px' }}>{platform.subtitle}</p>
            <button className="btn-primary" style={{ width: '100%', fontSize: '13px', padding: '10px 16px' }}>
              Create Content
            </button>
          </div>
        ))}

        <div className="bento-item bento-wide">
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '0 0 20px' }}>Recent Activity</h3>
          {chatHistory.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {chatHistory.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => router.push('/history')}
                  style={{ 
                    padding: '16px', 
                    background: 'var(--color-bg-base)', 
                    borderRadius: '0', 
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {chat.message.substring(0, 50)}...
                  </p>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    {formatDate(chat.created_at)} · {formatTime(chat.created_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: '0' }}>No recent activity. Start creating!</p>
          )}
        </div>
      </div>
    </div>
  )
}
