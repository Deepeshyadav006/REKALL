import { Clock, FileText, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'History – Rekall',
  description: 'View your past AI-generated content and conversations.',
}

export default function HistoryPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px' }}>
          <span className="gradient-text">History</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          Your past content and AI conversations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Posts Generated', value: '0', icon: FileText, color: '#7c3aed' },
          { label: 'Chat Sessions', value: '0', icon: MessageSquare, color: '#06b6d4' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card" style={{ borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color }}>{value}</p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div
        className="glass-card"
        style={{ borderRadius: '16px', padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}
      >
        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={32} color="#7c3aed" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>No history yet</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, maxWidth: '360px', lineHeight: '1.6' }}>
          Your generated posts and AI chat sessions will appear here once you start using Rekall.
        </p>
        <a href="/create" className="btn-primary" style={{ marginTop: '8px', textDecoration: 'none', padding: '10px 24px', display: 'inline-block' }}>
          Create your first post →
        </a>
      </div>
    </div>
  )
}
