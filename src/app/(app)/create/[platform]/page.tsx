'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Briefcase, MessageCircle, Camera, Video, Wand2, Send, Loader2, LucideIcon } from 'lucide-react'

const platformConfig: Record<string, { name: string; color: string; icon: LucideIcon; charLimit: number }> = {
  linkedin: { name: 'LinkedIn', color: '#0077b5', icon: Briefcase, charLimit: 3000 },
  twitter: { name: 'Twitter', color: '#ffffff', icon: MessageCircle, charLimit: 280 },
  instagram: { name: 'Instagram', color: '#e1306c', icon: Camera, charLimit: 2200 },
  youtube: { name: 'YouTube', color: '#ff0000', icon: Video, charLimit: 5000 },
}

const tones = ['Professional', 'Casual', 'Inspirational', 'Funny']

export default function PlatformPage() {
  const router = useRouter()
  const params = useParams()
  const platform = params.platform as string
  const config = platformConfig[platform]
  
  const supabase = createClient()
  const [userId, setUserId] = useState('')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Professional')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [toast, setToast] = useState('')
  
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)
    }
    getUser()
  }, [supabase, router])

  useEffect(() => {
    if (config) {
      if (chatMessages.length === 0) {
        setChatMessages([
          { role: 'assistant', content: `Hi! I'm here to help with your ${config.name} content. What would you like to create?` }
        ])
      }
    }
  }, [config, chatMessages.length])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  const generateContent = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setShowContent(false)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone }),
      })
      const data = await res.json()
      if (data.content) {
        setContent(data.content)
        setShowContent(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const savePost = async () => {
    if (!content.trim() || !userId) return
    await supabase.from('posts').insert({ user_id: userId, platform, content })
    setToast('Post saved!')
    setTimeout(() => setToast(''), 3000)
  }

  const postToPlatform = () => {
    const encoded = encodeURIComponent(content)
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank')
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(content)
      setToast('Copied! Open Instagram and paste your caption')
      setTimeout(() => setToast(''), 3000)
    } else if (platform === 'youtube') {
      navigator.clipboard.writeText(content)
      setToast('Copied! Open YouTube Studio and paste your description')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading || !userId) return
    const userMsg = chatInput
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userMessage: userMsg,
          userId,
          platform
        }),
      })
      const data = await res.json()
      if (data.response) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setChatLoading(false)
    }
  }

  if (!config) {
    return <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '32px', color: 'white' }}>Invalid platform</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px' }}>
      <button 
        onClick={() => router.push('/dashboard')}
        style={{ background: 'none', border: 'none', color: '#666666', cursor: 'pointer', fontSize: '13px', marginBottom: '16px' }}
      >
        ← Back to Dashboard
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${config.color}26`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <config.icon size={20} color={config.color} />
        </div>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '500', margin: 0 }}>{config.name}</h1>
      </div>

      <div style={{ display: 'flex', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ flex: '0.65', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '500', margin: '0 0 20px' }}>Create your content</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#888888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                What do you want to post about?
              </label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Launching our new AI product next week targeting developers..."
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #1e1e1e', 
                  background: '#0d0d0d', 
                  color: 'white', 
                  fontSize: '14px', 
                  height: '100px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#888888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Tone</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tones.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    style={{ 
                      padding: '6px 16px', 
                      borderRadius: '20px', 
                      border: tone === t ? '1px solid #7c3aed' : '1px solid #2a2a2a', 
                      background: tone === t ? '#7c3aed' : '#1a1a1a', 
                      color: tone === t ? 'white' : '#888888', 
                      fontSize: '13px', 
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateContent}
              disabled={loading || !topic.trim()}
              style={{ 
                width: '100%', 
                height: '44px',
                borderRadius: '8px', 
                border: 'none', 
                background: '#7c3aed', 
                color: 'white', 
                fontSize: '14px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Wand2 size={18} />}
              {loading ? 'Generating...' : 'Generate with Vrixo AI'}
            </button>
          </div>

          {showContent && content && (
            <div style={{ background: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
              <label style={{ color: '#888888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Generated Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #2a2a2a', 
                  background: '#0d0d0d', 
                  color: 'white', 
                  fontSize: '14px', 
                  minHeight: '150px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '12px', color: '#666666' }}>
                {content.length} / {config.charLimit}
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  onClick={savePost}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #2a2a2a', 
                    background: '#1a1a1a', 
                    color: 'white', 
                    fontSize: '14px', 
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Save Post
                </button>
                <button 
                  onClick={postToPlatform}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    background: config.color, 
                    color: 'white', 
                    fontSize: '14px', 
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Post to {config.name}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: '0.35', background: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'white', fontSize: '14px', fontWeight: '500', margin: '0 0 4px' }}>Vrixo AI Assistant</h3>
          <p style={{ color: '#666666', fontSize: '12px', margin: '0 0 16px' }}>Get help with your {config.name} content</p>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', height: '400px' }}>
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '12px', 
                  background: msg.role === 'user' ? '#7c3aed' : '#1a1a1a', 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                  maxWidth: '85%',
                  color: 'white',
                  fontSize: '13px'
                }}
              >
                {msg.content}
              </div>
            ))}
            {chatLoading && (
              <div style={{ padding: '8px 12px', borderRadius: '12px', background: '#1a1a1a', alignSelf: 'flex-start' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: '#666666' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Ask Vrixo for help..."
              style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '8px', 
                border: '1px solid #1e1e1e', 
                background: '#0d0d0d', 
                color: 'white', 
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
            <button 
              onClick={sendChat} 
              disabled={chatLoading || !chatInput.trim()}
              style={{ 
                padding: '10px 16px', 
                borderRadius: '6px', 
                border: 'none', 
                background: '#7c3aed', 
                color: 'white', 
                cursor: 'pointer',
                opacity: chatLoading || !chatInput.trim() ? 0.5 : 1
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1a1a',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: '1px solid #2a2a2a',
          fontSize: '14px'
        }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          div[style*="flex: '0.65'"] { flex: '1 1 100%' !important; }
          div[style*="flex: '0.35'"] { flex: '1 1 100%' !important; }
        }
      `}</style>
    </div>
  )
}