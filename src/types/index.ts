export interface Database {
  public: {
    Tables: {
      memory: {
        Row: {
          id: string
          user_id: string
          role: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          message: string
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          platform: string
          content: string
          status: string
          scheduled_at?: string
          published_at?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          content: string
          status?: string
          scheduled_at?: string
          published_at?: string
          created_at?: string
        }
      }
    }
  }
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  platform: 'twitter' | 'instagram' | 'linkedin' | 'facebook'
  content: string
  status: 'draft' | 'scheduled' | 'published'
  scheduled_at?: string
  published_at?: string
  created_at: string
}
