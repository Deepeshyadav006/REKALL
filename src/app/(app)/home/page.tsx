import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HomeDashboard from '@/components/HomeDashboard'

export const metadata = {
  title: 'Home – Rekall',
  description: 'Your AI-powered social media command center.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  return <HomeDashboard firstName={firstName} />
}
