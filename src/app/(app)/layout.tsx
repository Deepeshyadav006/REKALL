'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email || '')
    }
    checkUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/chat', label: 'Chat' },
    { href: '/history', label: 'History' },
    { href: '/dashboard', label: 'Create' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        height: '56px',
        background: '#0d0d0d',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '28px', 
            height: '28px', 
            background: '#7c3aed', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '8px'
          }}>
            <span style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>V</span>
          </div>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>Vrixo</span>
        </div>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {navItems.map((item) => (
            <a
              key={item.href + item.label}
              href={item.href}
              style={{
                padding: '8px 0',
                color: pathname === item.href ? 'white' : '#888888',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                position: 'relative',
                transition: 'color 0.2s ease'
              }}
            >
              {item.label}
              {pathname === item.href && (
                <span style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#7c3aed',
                  borderRadius: '1px'
                }} />
              )}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#666666', fontSize: '13px' }}>{userEmail}</span>
          <button 
            onClick={handleLogout} 
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: '1px solid #1e1e1e', 
              background: 'transparent', 
              color: '#888888', 
              fontSize: '13px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ paddingTop: '56px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}