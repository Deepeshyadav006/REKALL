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
            content: "Hi! I'm Vrixo AI, your social media assistant. Ask me anything — I can help you craft posts, develop strategies, write captions, and more! 🚀",
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
        content: "Hi! I'm Vrixo AI, your social media assistant. Ask me anything — I can help you craft posts, develop strategies, write captions, and more! 🚀",
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
      <aside style={{ width: '280px', borderRight: '1px solid #222', padding: '24px', display: 'none' }} className="chat-sidebar">
        <button onClick={startNewChat} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <Plus size={18} /> New Chat
        </button>
        
        <h3 style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>Chat History</h3>
        
        {Object.keys(groupedSessions).length === 0 ? (
          <p style={{ color: '#444', fontSize: '14px' }}>No conversations yet</p>
        ) : (
          Object.entries(groupedSessions).map(([date, items]) => (
            <div key={date} style={{ marginBottom: '16px' }}>
              <p style={{ color: '#555', fontSize: '11px', fontWeight: '600', marginBottom: '8px' }}>{date}</p>
              {items.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  style={{ padding: '12px', borderRadius: '8px', background: selectedSession === session.id ? '#222' : 'transparent', cursor: 'pointer', marginBottom: '4px' }}
                >
                  <p style={{ color: '#888', fontSize: '13px', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.message.substring(0, 30)}...
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 24px', color: 'white' }}>
            AI Chat Assistant
          </h1>

          <div style={{ flex: 1, borderRadius: '16px', padding: '24px', background: '#111', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {loadingHistory && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '10px' }}>
                <Loader2 size={20} color="#666" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: '#666', fontSize: '14px' }}>Loading chat history…</span>
              </div>
            )}

            {!loadingHistory && messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.role === 'assistant' ? '#7c3aed' : '#222', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {msg.role === 'assistant' ? <Bot size={18} color="white" /> : <User size={18} color="#888" />}
                </div>
                <div style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: msg.role === 'user' ? '#7c3aed' : '#222', color: 'white', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="white" />
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: '#222', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={16} color="#666" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ color: '#666', fontSize: '13px' }}>Thinking…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Vrixo AI anything about your social media strategy…"
              disabled={loadingHistory}
              style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white', fontSize: '15px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || loadingHistory}
              style={{ padding: '14px 20px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer', opacity: !input.trim() || loading || loadingHistory ? 0.5 : 1 }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .chat-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  )
}
