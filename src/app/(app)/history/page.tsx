'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Copy, RefreshCw, Clock, Briefcase, MessageCircle, Camera, Video, LucideIcon } from 'lucide-react'

interface Post {
  id: number
  platform: string
  content: string
  created_at: string
}

const platformConfig: Record<string, { name: string; color: string; icon: LucideIcon }> = {
  linkedin: { name: 'LinkedIn', color: '#0077b5', icon: Briefcase },
  twitter: { name: 'Twitter', color: '#1da1f2', icon: MessageCircle },
  instagram: { name: 'Instagram', color: '#e1306c', icon: Camera },
  youtube: { name: 'YouTube', color: '#ff0000', icon: Video },
}

const filters = ['All', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube']

export default function HistoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: postData } = await supabase
        .from('posts')
        .select('id, platform, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (postData) {
        setPosts(postData)
      }
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'All' || post.platform.toLowerCase() === filter.toLowerCase()
    const matchesSearch = post.content.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const copyPost = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const repost = (post: Post) => {
    router.push(`/create/${post.platform}`)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666666' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '22px', color: 'white', fontWeight: '500', margin: '0 0 24px' }}>Post History</h1>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filter === f ? '#7c3aed' : '#111111',
                color: 'white',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts..."
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #1e1e1e',
            background: '#111111',
            color: 'white',
            fontSize: '14px',
            marginBottom: '24px',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />

        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Clock size={28} color="#666666" />
            </div>
            <h3 style={{ fontSize: '18px', color: 'white', fontWeight: '500', margin: '0 0 8px' }}>No posts yet</h3>
            <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 20px' }}>Create your first post to see it here</p>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#7c3aed',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Create Content
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {filteredPosts.map(post => {
              const config = platformConfig[post.platform.toLowerCase()] || { name: post.platform, color: '#666666', icon: MessageCircle }
              return (
                <div
                  key={post.id}
                  style={{
                    background: '#111111',
                    border: '1px solid #1e1e1e',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: config.color,
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {config.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666666' }}>
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#cccccc', margin: '0 0 12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.content}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => copyPost(post.content)}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#1a1a1a',
                        color: '#888888',
                        cursor: 'pointer'
                      }}
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => repost(post)}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#1a1a1a',
                        color: '#888888',
                        cursor: 'pointer'
                      }}
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}