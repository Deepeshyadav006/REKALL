'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

interface ChatSession {
  id: number
  message: string
  created_at: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      const { data: memoryRows } = await supabase
        .from('memory')
        .select('role, message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (memoryRows && memoryRows.length > 0) {
        const history: Message[] = memoryRows.map(row => ({
          role: row.role as 'user' | 'assistant',
          content: row.message,
          timestamp: row.created_at,
        }))
        setMessages(history)
        
        const allSessions = await supabase
          .from('memory')
          .select('id, message, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (allSessions.data) {
          setSessions(allSessions.data)
        }
      } else {
        setMessages([
          {
            role: 'assistant',
            content: "Hi! I'm Vrixo AI, your social media assistant. Ask me anything — I can help you craft posts, develop strategies, write captions, and more!",
          },
        ])
      }

      setLoadingHistory(false)
    }

    init()
  }, [supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startNewChat = async () => {
    setSelectedSession(null)
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm Vrixo AI, your social media assistant. Ask me anything — I can help you craft posts, develop strategies, write captions, and more!",
      },
    ])
  }

  const loadSession = async (sessionId: number) => {
    setSelectedSession(sessionId)
    setLoadingHistory(true)
    
    const { data: memoryRows } = await supabase
      .from('memory')
      .select('role, message, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (memoryRows) {
      const history: Message[] = memoryRows.map(row => ({
        role: row.role as 'user' | 'assistant',
        content: row.message,
        timestamp: row.created_at,
      }))
      setMessages(history)
    }
    setLoadingHistory(false)
  }

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const groups: Record<string, ChatSession[]> = {}
    sessions.forEach(session => {
      const date = new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      if (!groups[date]) groups[date] = []
      groups[date].push(session)
    })
    return groups
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading || !userId) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: text, userId }),
      })
      const data = await res.json()

      if (data.error) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Something went wrong. Please try again.' },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.response },
        ])
        
        const { data: newSessions } = await supabase
          .from('memory')
          .select('id, message, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        if (newSessions) {
          setSessions(newSessions)
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const groupedSessions = groupSessionsByDate(sessions)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex' }}>
      <aside style={{ width: '240px', background: '#0d0d0d', borderRight: '1px solid #1a1a1a', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={startNewChat} 
          style={{ 
            width: '100%', 
            padding: '10px', 
            borderRadius: '8px', 
            border: 'none', 
            background: '#7c3aed', 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: '500', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            marginBottom: '16px',
            fontFamily: 'inherit'
          }}
        >
          <Plus size={16} /> New Chat
        </button>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {Object.keys(groupedSessions).length === 0 ? (
            <p style={{ color: '#444444', fontSize: '13px' }}>No conversations yet</p>
          ) : (
            Object.entries(groupedSessions).map(([date, items]) => (
              <div key={date} style={{ marginBottom: '16px' }}>
                <p style={{ color: '#666666', fontSize: '11px', fontWeight: '500', marginBottom: '8px' }}>{date}</p>
                {items.map(session => (
                  <div
                    key={session.id}
                    onClick={() => loadSession(session.id)}
                    style={{ 
                      padding: '10px', 
                      borderRadius: '8px', 
                      background: selectedSession === session.id ? '#1a1a1a' : 'transparent', 
                      cursor: 'pointer', 
                      marginBottom: '4px',
                      borderLeft: selectedSession === session.id ? '2px solid #7c3aed' : '2px solid transparent'
                    }}
                  >
                    <p style={{ color: '#888888', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.message.substring(0, 35)}...
                    </p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '680px', margin: '0 auto', width: '100%', padding: '24px' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {loadingHistory && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '10px' }}>
                <Loader2 size={20} color="#666666" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: '#666666', fontSize: '14px' }}>Loading chat history...</span>
              </div>
            )}

            {!loadingHistory && messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '12px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: msg.role === 'assistant' ? '#1a1a1a' : '#7c3aed', 
                  flexShrink: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {msg.role === 'assistant' ? <Bot size={18} color="#ffffff" /> : <User size={18} color="#ffffff" />}
                </div>
                <div style={{ 
                  maxWidth: '70%', 
                  padding: '12px 16px', 
                  borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0', 
                  background: msg.role === 'user' ? '#7c3aed' : '#111111', 
                  color: 'white', 
                  fontSize: '14px', 
                  lineHeight: '1.5'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="#ffffff" />
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '12px 12px 12px 0', background: '#111111', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={16} color="#666666" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ color: '#666666', fontSize: '13px' }}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #1a1a1a' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Vrixo AI anything..."
              disabled={loadingHistory}
              style={{ 
                flex: 1, 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #1a1a1a', 
                background: '#111111', 
                color: 'white', 
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || loadingHistory}
              style={{ 
                padding: '12px 20px', 
                borderRadius: '10px', 
                border: 'none', 
                background: '#7c3aed', 
                color: 'white', 
                cursor: 'pointer',
                opacity: !input.trim() || loading || loadingHistory ? 0.5 : 1
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          aside { display: none !important; }
        }
      `}</style>
    </div>
  )
}