import { NextRequest, NextResponse } from 'next/server'
import { generateCrossword, generateCrosswordDemo, CrosswordRequest } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request
    const { topic, educationLevel, grade, difficulty, questionCount } = body
    
    if (!topic || !educationLevel || !grade || !difficulty || !questionCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate education level and grade
    if (educationLevel === 'basica' && (grade < 1 || grade > 8)) {
      return NextResponse.json(
        { error: 'Grade must be between 1-8 for educación básica' },
        { status: 400 }
      )
    }

    if (educationLevel === 'media' && (grade < 1 || grade > 4)) {
      return NextResponse.json(
        { error: 'Grade must be between 1-4 for educación media' },
        { status: 400 }
      )
    }

    // Validate question count
    if (questionCount < 5 || questionCount > 20) {
      return NextResponse.json(
        { error: 'Question count must be between 5-20' },
        { status: 400 }
      )
    }

    const crosswordRequest: CrosswordRequest = {
      topic,
      educationLevel,
      grade: parseInt(grade),
      difficulty,
      questionCount: parseInt(questionCount)
    }

    // Check if OpenAI API key is configured
    const hasApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key'
    
    let result
    if (hasApiKey) {
      // Use real OpenAI API
      result = await generateCrossword(crosswordRequest)
    } else {
      // Use demo mode
      console.log('Using demo mode - no OpenAI API key configured')
      result = await generateCrosswordDemo(crosswordRequest)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in generate-crossword API:', error)
    return NextResponse.json(
      { error: 'Failed to generate crossword' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Ramtun Crossword Generator API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/generate-crossword',
      description: 'Generate educational crosswords with AI'
    },
    parameters: {
      topic: 'string - Educational topic',
      educationLevel: 'basica | media',
      grade: 'number - 1-8 for básica, 1-4 for media',
      difficulty: 'facil | medio | dificil',
      questionCount: 'number - 5-20 questions'
    }
  })
}
