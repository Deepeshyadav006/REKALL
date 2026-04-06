'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, Home, MessageSquare, History, Plus } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email || '')
      setIsAuthenticated(true)
    }
    checkUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/create', icon: Plus, label: 'Create' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <header className="header-glass" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            background: 'var(--color-accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '0'
          }}>
            <span style={{ color: '#0c0c0c', fontSize: '18px', fontWeight: '800' }}>V</span>
          </div>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>Vrixo</span>
        </div>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '0',
                border: pathname === item.href ? '1px solid var(--color-accent)' : '1px solid transparent',
                background: pathname === item.href ? 'rgba(212, 255, 0, 0.1)' : 'transparent',
                color: pathname === item.href ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <item.icon size={16} />
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{userEmail}</span>
          <button 
            onClick={handleLogout} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 16px', 
              borderRadius: '0', 
              border: '1px solid var(--color-border)', 
              background: 'transparent', 
              color: 'var(--color-text-secondary)', 
              fontSize: '13px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
