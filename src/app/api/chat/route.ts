import { NextResponse } from 'next/server'
import { askVrixo, saveMemory } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const { userMessage, userId } = await req.json()
    console.log('Request body:', { userMessage, userId })

    if (!userMessage || !userId) {
      return NextResponse.json(
        { error: 'userMessage and userId are required' },
        { status: 400 }
      )
    }

    // Get AI response with full context (memory + posts)
    console.log('Calling askVrixo...')
    const aiResponse = await askVrixo(userMessage, userId)
    console.log('OpenRouter response:', aiResponse)

    // Persist both messages to memory table
    await saveMemory(userId, 'user', userMessage)
    await saveMemory(userId, 'assistant', aiResponse)

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Chat error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
