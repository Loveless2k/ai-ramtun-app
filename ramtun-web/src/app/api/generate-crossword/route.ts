import { NextRequest, NextResponse } from 'next/server'
import { generateCrossword, generateCrosswordDemo, validateOpenAIConfig } from '@/lib/openai'
import { PerfectCrosswordGenerator } from '@/utils/perfectCrosswordGenerator'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { CrosswordRequest } from '@/types/crossword'

export async function POST(request: NextRequest) {
  try {
    // 🔒 PHASE 1: Authentication and Authorization Check
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    // Check if user is authenticated
    if (!session?.user) {
      console.log('❌ API: Unauthenticated access attempt to crossword generator')
      return NextResponse.json(
        { error: 'Authentication required. Please log in to generate crosswords.' },
        { status: 401 }
      )
    }

    // Check if user has teacher role
    const userRole = session.user.user_metadata?.role
    console.log('👤 API: User role attempting generator access:', userRole)

    if (userRole !== 'teacher') {
      console.log('🚫 API: Non-teacher access denied to crossword generator')
      return NextResponse.json(
        {
          error: 'Teacher access required. Only teachers can generate crosswords.',
          userRole: userRole,
          requiredRole: 'teacher'
        },
        { status: 403 }
      )
    }

    console.log('✅ API: Teacher access granted for crossword generation')

    const body = await request.json()
    
    // Validate request
    const { topic, educationLevel, grade, difficulty, questionCount } = body
    
    if (!topic || !educationLevel || !grade || !difficulty || !questionCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate topic length and content
    if (typeof topic !== 'string' || topic.trim().length < 3) {
      return NextResponse.json(
        { error: 'Topic must be at least 3 characters long' },
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
    const hasApiKey = validateOpenAIConfig()

    let result
    let actuallyUsedOpenAI = false

    if (hasApiKey) {
      try {
        // Use real OpenAI API
        console.log('🤖 Usando OpenAI API para generar crucigrama')
        result = await generateCrossword(crosswordRequest)
        actuallyUsedOpenAI = true

        // Apply perfect crossword algorithm to the generated questions
        if (result.questions.length > 0) {
          console.log('🎯 Aplicando algoritmo perfecto a preguntas generadas por IA')
          const generator = new PerfectCrosswordGenerator(15)

          // Convert to format expected by perfect algorithm
          const questionsForAlgorithm = result.questions.map(q => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
            category: q.category,
            difficulty: q.difficulty
          }))

          const perfectQuestions = generator.generatePerfectCrossword(questionsForAlgorithm)

          // Update result with perfect positioning
          result.questions = perfectQuestions.map((q) => ({
            ...q,
            position: q.position
          }))

          console.log('✅ Crucigrama perfecto generado con IA + algoritmo')
        }

      } catch (error) {
        console.error('❌ Error con OpenAI API, fallback a modo demo:', error)
        result = await generateCrosswordDemo(crosswordRequest)
        actuallyUsedOpenAI = false // Importante: marcar que NO se usó OpenAI
      }
    } else {
      // Use demo mode
      console.log('🎭 Usando modo demo - no hay API key de OpenAI configurada')
      result = await generateCrosswordDemo(crosswordRequest)
      actuallyUsedOpenAI = false
    }

    return NextResponse.json({
      ...result,
      generated_with: actuallyUsedOpenAI ? 'openai' : 'demo',
      timestamp: new Date().toISOString()
    })
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
