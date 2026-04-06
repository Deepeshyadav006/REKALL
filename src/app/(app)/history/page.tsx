import Link from 'next/link'
import { Clock, FileText, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'History – Vrixo',
  description: 'View your past AI-generated content and conversations.',
}

export default function HistoryPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '56px', fontWeight: '300', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
          History
        </h1>
        <p style={{ color: '#5a5a5a', margin: 0 }}>
          Your past content and AI conversations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Posts Generated', value: '0', icon: FileText, color: '#a8ff78' },
          { label: 'Chat Sessions', value: '0', icon: MessageSquare, color: '#a8ff78' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(168, 255, 120, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: '300', color }}>{value}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#5a5a5a' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div
        className="card"
        style={{ borderRadius: '16px', padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}
      >
        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(168, 255, 120, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={32} color="#a8ff78" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '300', margin: 0 }}>No history yet</h2>
        <p style={{ color: '#5a5a5a', margin: 0, maxWidth: '360px', lineHeight: '1.6' }}>
          Your generated posts and AI chat sessions will appear here once you start using Vrixo.
        </p>
        <Link href="/dashboard" className="btn-primary" style={{ marginTop: '8px', textDecoration: 'none', padding: '10px 24px', display: 'inline-block' }}>
          Create your first post →
        </Link>
      </div>
    </div>
  )
}
