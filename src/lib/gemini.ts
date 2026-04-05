import { createClient } from '@/lib/supabase/server'

/**
 * Common fetch call to DeepSeek.
 */
async function callAI(messages: any[]): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY!
  const modelName = 'deepseek-chat'
  console.log('DeepSeek API key exists:', !!process.env.DEEPSEEK_API_KEY)
  console.log('Fetching from DeepSeek...')
  
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
    }),
  })

  console.log('DeepSeek status:', response.status)

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Unknown API error' }))
    console.error('DeepSeek Error:', errorBody)
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  console.log('DeepSeek data:', JSON.stringify(data))
  return data.choices[0].message.content
}

export async function generateContent(prompt: string): Promise<string> {
  return callAI([{ role: 'user', content: prompt }])
}

export async function askRekall(userMessage: string, userId: string): Promise<string> {
  const supabase = await createClient()

  // Fetch last 10 chat messages for context
  const { data: memoryRows } = await supabase
    .from('memory')
    .select('role, message, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(10)

  // Fetch last 5 posts for contextual personality
  const { data: postRows } = await supabase
    .from('posts')
    .select('platform, content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const recentPosts = postRows?.length ? JSON.stringify(postRows, null, 2) : "No recent posts."
  
  const systemPrompt = `You are Rekall, an AI-powered social media assistant.
I remember the user's past posts and our ongoing conversation.
Context:
Recent User Posts: ${recentPosts}
Goal: Answer the user concisely and creatively. Be helpful and actionable.`

  // Build message history for OpenRouter / DeepSeek
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(memoryRows?.map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.message,
    })) || []),
    { role: 'user', content: userMessage },
  ]

  return callAI(messages)
}

export async function saveMemory(userId: string, role: string, message: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('memory')
    .insert({ user_id: userId, role, message })

  if (error) {
    console.error('saveMemory error:', error.message)
  }
}
