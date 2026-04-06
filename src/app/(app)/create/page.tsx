'use client'

import { useState } from 'react'
import { Wand2, Copy, Check, Loader2, MessageCircle, Camera, Briefcase, Globe } from 'lucide-react'

const platforms = [
  { id: 'twitter', label: 'Twitter / X', icon: MessageCircle, color: '#1d9bf0' },
  { id: 'instagram', label: 'Instagram', icon: Camera, color: '#e1306c' },
  { id: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: '#0a66c2' },
  { id: 'facebook', label: 'Facebook', icon: Globe, color: '#1877f2' },
]

const tones = ['Professional', 'Casual', 'Humorous', 'Inspirational', 'Promotional']

export default function CreatePage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [tone, setTone] = useState('Professional')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone }),
      })
      const data = await res.json()
      setResult(data.content)
    } catch {
      setResult('Error generating content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '56px', fontWeight: '300', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
          Create
        </h1>
        <p style={{ color: '#5a5a5a', margin: 0 }}>
          Generate AI-crafted social media posts in seconds.
        </p>
      </div>

      <div className="card" style={{ borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
        {/* Platform selector */}
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#5a5a5a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Platform
        </label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '9999px',
                border: `1px solid ${platform === p.id ? '#ffffff' : '#1f1f1f'}`,
                background: platform === p.id ? '#ffffff' : 'transparent',
                color: platform === p.id ? '#0c0c0c' : '#5a5a5a',
                fontWeight: platform === p.id ? '500' : '400',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              <p.icon size={15} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Tone */}
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#5a5a5a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Tone
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tones.map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                border: `1px solid ${tone === t ? '#ffffff' : '#1f1f1f'}`,
                background: tone === t ? '#ffffff' : 'transparent',
                color: tone === t ? '#0c0c0c' : '#5a5a5a',
                fontWeight: tone === t ? '500' : '400',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Topic */}
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#5a5a5a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Topic / Idea
        </label>
        <textarea
          className="input-field"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. Launching our new product feature next week, targeting developers..."
          rows={4}
          style={{ resize: 'vertical', lineHeight: '1.6', marginBottom: '20px' }}
        />

        <button className="btn-primary" onClick={generate} disabled={!topic.trim() || loading} style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px', opacity: !topic.trim() || loading ? 0.6 : 1 }}>
          {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Wand2 size={18} />}
          {loading ? 'Generating…' : 'Generate with AI'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card animate-fade-up" style={{ borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#5a5a5a' }}>Generated Post</span>
            <button className="btn-ghost" onClick={copy} style={{ padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              {copied ? <Check size={14} color="#a8ff78" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p style={{ margin: 0, lineHeight: '1.7', whiteSpace: 'pre-wrap', color: '#ffffff', fontSize: '15px' }}>
            {result}
          </p>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
