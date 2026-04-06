'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Briefcase, MessageCircle, Camera, Video, Loader2, Send, Upload, Copy, Check, ExternalLink, LucideIcon } from 'lucide-react'

const platformConfig: Record<string, { name: string; color: string; icon: LucideIcon; charLimit: number }> = {
  linkedin: { name: 'LinkedIn', color: '#0077b5', icon: Briefcase, charLimit: 3000 },
  twitter: { name: 'Twitter / X', color: '#000000', icon: MessageCircle, charLimit: 280 },
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
  const [context, setContext] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageDesc, setImageDesc] = useState('')
  
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
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  const generateContent = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, context, imageDesc }),
      })
      const data = await res.json()
      if (data.content) {
        setContent(data.content)
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
    alert('Post saved!')
  }

  const publishPost = () => {
    const encoded = encodeURIComponent(content)
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?text=${encoded}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank')
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(content)
      alert('Text copied! Open Instagram and paste.')
    } else if (platform === 'youtube') {
      navigator.clipboard.writeText(content)
      alert('Description copied! Open YouTube Studio.')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
      setImageDesc('Image uploaded by user')
    }
    reader.readAsDataURL(file)
  }

  const copyContent = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = chatInput
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userMessage: `User is creating content for ${config.name}. ${userMsg}`, 
          userId 
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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', borderBottom: '1px solid #222' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <config.icon size={20} color="white" />
        </div>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: 0 }}>{config.name}</h1>
      </header>

      <div style={{ display: 'flex', flex: 1, gap: '24px', padding: '24px' }}>
        <div style={{ flex: '0.6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#111', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 20px' }}>AI Content Generator</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>What do you want to post about?</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Enter your topic..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0a0a0a', color: 'white', fontSize: '15px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Tone</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tones.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: tone === t ? '1px solid #7c3aed' : '1px solid #333', background: tone === t ? '#7c3aed' : 'transparent', color: tone === t ? 'white' : '#888', fontSize: '14px', cursor: 'pointer' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Additional context (optional)</label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Any additional details..."
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0a0a0a', color: 'white', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Upload image (optional)</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px dashed #333', color: '#666', cursor: 'pointer' }}>
                <Upload size={18} />
                <span>Upload image (jpg, png, gif)</span>
                <input type="file" accept="image/jpeg,image/png,image/gif" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              {imagePreview && (
                <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                  <button onClick={() => { setImagePreview(null); setImageDesc('') }} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#333', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>×</button>
                </div>
              )}
            </div>

            <button
              onClick={generateContent}
              disabled={loading || !topic.trim()}
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: 'white', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
              Generate
            </button>
          </div>

          {content && (
            <div style={{ background: '#111', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: '#888', fontSize: '14px' }}>Generated Content ({content.length}/{config.charLimit})</label>
                <button onClick={copyContent} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={6}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0a0a0a', color: 'white', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={savePost} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Save Post
                </button>
                <button onClick={publishPost} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: config.color, color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <ExternalLink size={16} /> Publish to {config.name}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: '0.4', background: '#111', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 16px' }}>AI Chatbot</h2>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '12px', background: msg.role === 'user' ? '#222' : '#0a0a0a', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>{msg.content}</p>
              </div>
            ))}
            {chatLoading && (
              <div style={{ padding: '12px', borderRadius: '12px', background: '#0a0a0a', alignSelf: 'flex-start' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: '#666' }} />
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
              placeholder="Ask about your content..."
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0a0a0a', color: 'white', fontSize: '14px' }}
            />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
