import { NextResponse } from 'next/server'
import { generateContent } from '@/lib/gemini'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, platform, tone } = await req.json()

    const platformGuide: Record<string, string> = {
      twitter: 'Twitter/X (max 280 characters, punchy and engaging, use 2-3 relevant hashtags)',
      instagram: 'Instagram (engaging caption with emojis, 5-10 hashtags at the end, storytelling approach)',
      linkedin: 'LinkedIn (professional, insightful, longer form is fine, include a call to action, 3-5 hashtags)',
      facebook: 'Facebook (conversational, can be longer, encourage comments, 2-3 hashtags)',
    }

    const prompt = `You are an expert social media copywriter. Write a ${tone.toLowerCase()} social media post for ${platformGuide[platform] || platform}.

Topic/Idea: ${topic}

Guidelines:
- Match the platform's character/style requirements exactly
- Use the ${tone} tone throughout
- Make it engaging and likely to get high engagement
- Include appropriate emojis if relevant to the platform and tone
- Only provide the post content, no extra explanation

Write the post now:`

    const content = await generateContent(prompt)
    const finalContent = content.trim()

    // Save to posts table
    await supabase.from('posts').insert({
      user_id: user.id,
      platform,
      content: finalContent,
    })

    return NextResponse.json({ content: finalContent })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json({ content: 'Error generating content. Please try again.' }, { status: 500 })
  }
}
