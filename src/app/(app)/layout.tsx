import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: '240px',
          flex: 1,
          padding: '40px',
          minHeight: '100vh',
          background: 'var(--color-bg-base)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
