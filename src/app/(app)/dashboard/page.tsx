'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Briefcase, MessageCircle, Camera, Video, MessageSquare, LogOut, Send } from 'lucide-react'

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', icon: Briefcase, subtitle: 'Professional posts & articles' },
  { id: 'twitter', name: 'Twitter / X', color: '#000000', icon: MessageCircle, subtitle: 'Tweets & threads' },
  { id: 'instagram', name: 'Instagram', color: '#e1306c', icon: Camera, subtitle: 'Captions & stories' },
  { id: 'youtube', name: 'YouTube', color: '#ff0000', icon: Video, subtitle: 'Descriptions & scripts' },
]

interface ChatHistory {
  id: number
  message: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email || '')
      
      const { data: memoryRows } = await supabase
        .from('memory')
        .select('id, message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (memoryRows) {
        setChatHistory(memoryRows.reverse())
      }
    }
    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0c' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #1f1f1f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0c0c0c', fontSize: '20px', fontWeight: 'bold' }}>V</span>
          </div>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: '500' }}>Vrixo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#5a5a5a', fontSize: '14px' }}>{userEmail}</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid #1f1f1f', background: 'transparent', color: '#ffffff', fontSize: '14px', cursor: 'pointer' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)' }}>
        <aside className="sidebar" style={{ width: '280px', borderRight: '1px solid #1f1f1f', padding: '24px' }}>
          <h3 style={{ color: '#5a5a5a', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Recent Chats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chatHistory.map((chat) => (
              <div key={chat.id} style={{ padding: '12px', borderRadius: '8px', background: '#141414', cursor: 'pointer' }}>
                <p style={{ color: '#5a5a5a', fontSize: '13px', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {chat.message.substring(0, 30)}...
                </p>
                <span style={{ color: '#3a3a3a', fontSize: '11px' }}>{formatTime(chat.created_at)}</span>
              </div>
            ))}
          </div>
          <a href="/chat" style={{ display: 'block', marginTop: '16px', color: '#ffffff', fontSize: '14px', textDecoration: 'none' }}>View all</a>
        </aside>

        <main style={{ flex: 1, padding: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '56px', fontWeight: '300', margin: '0 0 32px', letterSpacing: '-0.03em' }}>What are you creating today?</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {platforms.map((platform) => (
              <div key={platform.id} style={{ background: '#141414', borderRadius: '16px', padding: '24px', border: '1px solid #1f1f1f' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <platform.icon size={24} color="#0c0c0c" />
                </div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '500', margin: '0 0 4px' }}>{platform.name}</h3>
                <p style={{ color: '#5a5a5a', fontSize: '14px', margin: '0 0 16px' }}>{platform.subtitle}</p>
                <button onClick={() => router.push(`/create/${platform.id}`)} style={{ width: '100%', padding: '12px', borderRadius: '9999px', border: 'none', background: '#f0f0f0', color: '#0c0c0c', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                  Create Content
                </button>
              </div>
            ))}
          </div>

          <div onClick={() => router.push('/chat')} style={{ maxWidth: '600px', margin: '0 auto', background: '#141414', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid #1f1f1f' }}>
            <MessageSquare size={20} color="#5a5a5a" />
            <span style={{ color: '#5a5a5a', flex: 1 }}>Chat with Vrixo...</span>
            <button onClick={(e) => { e.stopPropagation(); router.push('/chat') }} style={{ padding: '8px 16px', borderRadius: '9999px', border: 'none', background: '#f0f0f0', color: '#0c0c0c', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={16} /> Send
            </button>
          </div>
        </main>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .sidebar { display: block !important; }
        }
      `}</style>
    </div>
  )
}
