import { NextResponse } from 'next/server'
import { generateContent } from '@/lib/gemini'
import { createClient } from '@/lib/supabase/server'

const platformPrompts: Record<string, string> = {
  linkedin: "Write a professional LinkedIn post about [topic]. Use a hook in the first line. Add 3-5 relevant hashtags. Maximum 3000 characters.",
  twitter: "Write an engaging tweet about [topic]. Maximum 280 characters. No hashtags unless essential.",
  instagram: "Write an Instagram caption about [topic]. Engaging opener, storytelling middle, call to action end. Add 10 relevant hashtags at the bottom.",
  youtube: "Write a YouTube video description about [topic]. Include timestamps placeholder, links section, and relevant tags. Maximum 5000 characters.",
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, platform, tone, context, imageDesc } = await req.json()

    if (!platform || !platformPrompts[platform]) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    const basePrompt = platformPrompts[platform]
    let prompt = basePrompt.replace('[topic]', topic)

    if (tone) {
      prompt = `Write with a ${tone.toLowerCase()} tone. ${prompt}`
    }

    if (context) {
      prompt = `Additional context: ${context}. ${prompt}`
    }

    if (imageDesc) {
      prompt = `The user has also provided an image showing: ${imageDesc}. ${prompt}`
    }

    const content = await generateContent(prompt)
    const finalContent = content.trim()

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
