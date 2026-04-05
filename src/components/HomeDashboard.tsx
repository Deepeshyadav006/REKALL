'use client'

import { Sparkles, TrendingUp, MessageSquare, PenSquare } from 'lucide-react'

const stats = [
  { label: 'Posts Created', value: '0', icon: PenSquare, color: '#7c3aed' },
  { label: 'AI Chats', value: '0', icon: MessageSquare, color: '#06b6d4' },
  { label: 'Engagement Score', value: '—', icon: TrendingUp, color: '#10b981' },
]

export default function HomeDashboard({ firstName }: { firstName: string }) {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Sparkles size={28} color="#7c3aed" />
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '800',
              margin: 0,
              background: 'linear-gradient(135deg, #f0f0ff, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome back, {firstName} 👋
          </h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '16px' }}>
          Here&apos;s what&apos;s happening with your social presence today.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="glass-card"
            style={{ borderRadius: '16px', padding: '24px', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: '500' }}>{label}</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <span style={{ fontSize: '36px', fontWeight: '700', color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card" style={{ borderRadius: '16px', padding: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginTop: 0, marginBottom: '20px', color: 'var(--color-text-primary)' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <a href="/create" style={{ textDecoration: 'none' }}>
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(91,33,182,0.08))',
                border: '1px solid rgba(124,58,237,0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)')}
            >
              <PenSquare size={24} color="#7c3aed" style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '15px' }}>Create Post</p>
              <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '13px' }}>Generate AI-powered content</p>
            </div>
          </a>
          <a href="/chat" style={{ textDecoration: 'none' }}>
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))',
                border: '1px solid rgba(6,182,212,0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)')}
            >
              <MessageSquare size={24} color="#06b6d4" style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '15px' }}>AI Chat</p>
              <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '13px' }}>Get strategy advice</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
