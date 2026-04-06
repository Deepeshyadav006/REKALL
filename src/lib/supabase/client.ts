import { createBrowserClient } from '@supabase/ssr'

function getEnv(key: string): string {
  if (typeof window !== 'undefined') {
    return (window as any).ENV?.[key] || process.env[key] || ''
  }
  return process.env[key] || ''
}

export function createClient() {
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
