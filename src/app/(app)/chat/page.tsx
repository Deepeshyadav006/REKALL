'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // On mount: get current user + fetch existing chat history
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      // Fetch existing memory rows for this user
      const { data: memoryRows } = await supabase
        .from('memory')
        .select('role, message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (memoryRows && memoryRows.length > 0) {
        const history: Message[] = memoryRows.map(row => ({
          role: row.role as 'user' | 'assistant',
          content: row.message,
        }))
        setMessages(history)
      } else {
        // Show welcome message if no history
        setMessages([
          {
            role: 'assistant',
            content:
              "Hi! I'm Rekall AI, your social media assistant. Ask me anything — I can help you craft posts, develop strategies, write captions, and more! 🚀",
          },
        ])
      }

      setLoadingHistory(false)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading || !userId) return

    // Optimistically show user message
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 80px)',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 24px',
        }}
      >
        <span className="gradient-text">AI Chat Assistant</span>
      </h1>

      {/* Messages */}
      <div
        className="glass-card"
        style={{
          flex: 1,
          borderRadius: '16px',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {/* Loading history spinner */}
        {loadingHistory && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              gap: '10px',
            }}
          >
            <Loader2
              size={20}
              color="var(--color-brand-secondary)"
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <span
              style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}
            >
              Loading chat history…
            </span>
          </div>
        )}

        {/* Chat messages */}
        {!loadingHistory &&
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background:
                    msg.role === 'assistant'
                      ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                      : 'var(--color-bg-elevated)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border:
                    msg.role === 'user'
                      ? '1px solid var(--color-border)'
                      : 'none',
                }}
              >
                {msg.role === 'assistant' ? (
                  <Bot size={18} color="white" />
                ) : (
                  <User size={18} color="var(--color-text-secondary)" />
                )}
              </div>

              {/* Bubble */}
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius:
                    msg.role === 'user'
                      ? '16px 4px 16px 16px'
                      : '4px 16px 16px 16px',
                  background:
                    msg.role === 'user'
                      ? 'linear-gradient(135deg, #7c3aed, #5b21b6)'
                      : 'var(--color-bg-elevated)',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={18} color="white" />
            </div>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '4px 16px 16px 16px',
                background: 'var(--color-bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Loader2
                size={16}
                color="var(--color-brand-secondary)"
                style={{ animation: 'spin 1s linear infinite' }}
              />
              <span
                style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}
              >
                Thinking…
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask Rekall AI anything about your social media strategy…"
          disabled={loadingHistory}
          style={{ flex: 1 }}
        />
        <button
          onClick={sendMessage}
          className="btn-primary"
          disabled={!input.trim() || loading || loadingHistory}
          style={{
            padding: '12px 20px',
            opacity: !input.trim() || loading || loadingHistory ? 0.5 : 1,
          }}
        >
          <Send size={18} />
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
