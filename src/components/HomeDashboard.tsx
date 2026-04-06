'use client'

import Link from 'next/link'
import { Sparkles, TrendingUp, MessageSquare, PenSquare } from 'lucide-react'

const stats = [
  { label: 'Posts Created', value: '0', icon: PenSquare, color: '#a8ff78' },
  { label: 'AI Chats', value: '0', icon: MessageSquare, color: '#a8ff78' },
  { label: 'Engagement Score', value: '—', icon: TrendingUp, color: '#a8ff78' },
]

export default function HomeDashboard({ firstName }: { firstName: string }) {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Sparkles size={28} color="#a8ff78" />
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '300',
              margin: 0,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            Welcome back, {firstName}
          </h1>
        </div>
        <p style={{ color: '#5a5a5a', margin: 0, fontSize: '16px' }}>
          Here&apos;s what&apos;s happening with your social presence today.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="card"
            style={{ borderRadius: '16px', padding: '24px', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#5a5a5a', fontSize: '13px', fontWeight: '400' }}>{label}</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 255, 120, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <span style={{ fontSize: '36px', fontWeight: '300', color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ borderRadius: '16px', padding: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '400', marginTop: 0, marginBottom: '20px', color: '#ffffff' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: '#141414',
                border: '1px solid #1f1f1f',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3a3a3a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1f1f1f')}
            >
              <PenSquare size={24} color="#ffffff" style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0, fontWeight: '500', color: '#ffffff', fontSize: '15px' }}>Create Post</p>
              <p style={{ margin: '4px 0 0', color: '#5a5a5a', fontSize: '13px' }}>Generate AI-powered content</p>
            </div>
          </Link>
          <Link href="/chat" style={{ textDecoration: 'none' }}>
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: '#141414',
                border: '1px solid #1f1f1f',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3a3a3a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1f1f1f')}
            >
              <MessageSquare size={24} color="#ffffff" style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0, fontWeight: '500', color: '#ffffff', fontSize: '15px' }}>AI Chat</p>
              <p style={{ margin: '4px 0 0', color: '#5a5a5a', fontSize: '13px' }}>Get strategy advice</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
