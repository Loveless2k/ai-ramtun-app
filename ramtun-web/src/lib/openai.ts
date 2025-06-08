import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Types for crossword generation
export interface CrosswordRequest {
  topic: string
  educationLevel: 'basica' | 'media' // 1-8 básica, 1-4 media
  grade: number
  difficulty: 'facil' | 'medio' | 'dificil'
  questionCount: number
}

export interface CrosswordQuestion {
  id: string
  question: string
  answer: string
  category: string
  difficulty: 'facil' | 'medio' | 'dificil'
  position?: {
    row: number
    col: number
    direction: 'horizontal' | 'vertical'
  }
}

export interface CrosswordResponse {
  subject: string
  topic: string
  level: string
  grade: number
  questions: CrosswordQuestion[]
  metadata: {
    generatedAt: string
    totalQuestions: number
    estimatedTime: string
  }
}

// Prompt-Zero implementation based on Phase 1 design
export async function generateCrossword(request: CrosswordRequest): Promise<CrosswordResponse> {
  try {
    console.log('🤖 Generando crucigrama con OpenAI...', request)

    const prompt = buildPromptZero(request)

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: RAMTUN_PROMPT_ZERO
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    console.log('✅ Respuesta de OpenAI recibida')

    const result = parseCrosswordResponse(response, request)

    // Log usage information
    if (completion.usage) {
      console.log('📊 OpenAI Usage:', {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens
      })
    }

    return result
  } catch (error) {
    console.error('❌ Error generating crossword:', error)
    throw new Error(`Failed to generate crossword: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Prompt-Zero especializado para Ramtun (basado en documentación Fase 1)
const RAMTUN_PROMPT_ZERO = `
Eres Ramtun AI, un sistema especializado en la generación de crucigramas educativos para el sistema educativo chileno.

IDENTIDAD Y PROPÓSITO:
- Especialista en educación básica y media chilena (1° básico a 4° medio)
- Experto en curriculum nacional chileno
- Generador de contenido gamificado educativo
- Adaptador de dificultad según nivel cognitivo

REGLAS DE GENERACIÓN:
1. ANÁLISIS DEL TEMA:
   - Identifica automáticamente la materia (Historia, Ciencias, Matemáticas, Lenguaje, etc.)
   - Determina el nivel educativo apropiado
   - Selecciona conceptos clave del curriculum chileno

2. GENERACIÓN DE PREGUNTAS:
   - Crea entre 8-15 preguntas según dificultad
   - Respuestas de 3-15 letras (solo letras, sin números ni símbolos)
   - Vocabulario apropiado para el nivel educativo
   - Conceptos fundamentales del tema

3. DIFICULTAD ADAPTATIVA:
   - FÁCIL: Conceptos básicos, vocabulario simple, 8-10 preguntas
   - MEDIO: Conceptos intermedios, relaciones causa-efecto, 10-12 preguntas
   - DIFÍCIL: Conceptos avanzados, análisis crítico, 12-15 preguntas

4. CALIDAD EDUCATIVA:
   - Preguntas claras y precisas
   - Respuestas inequívocas
   - Contenido curricular relevante
   - Vocabulario apropiado para la edad

IMPORTANTE:
- Responde SOLO con JSON válido
- NO agregues texto adicional
- Asegúrate de que las respuestas sean palabras válidas para crucigrama
- Adapta el contenido al curriculum chileno específico
`

// Build the Prompt-Zero based on Phase 1 specifications
function buildPromptZero(request: CrosswordRequest): string {
  const levelDescription = request.educationLevel === 'basica'
    ? `${request.grade}° básico (${6 + request.grade} años)`
    : `${request.grade}° medio (${14 + request.grade} años)`

  return `
TEMA: "${request.topic}"
NIVEL EDUCATIVO: ${levelDescription}
DIFICULTAD: ${request.difficulty}
CANTIDAD DE PREGUNTAS: ${request.questionCount}

Genera un crucigrama educativo siguiendo las reglas establecidas.

FORMATO DE RESPUESTA (JSON):
{
  "subject": "materia inferida",
  "topic": "${request.topic}",
  "level": "${levelDescription}",
  "grade": ${request.grade},
  "questions": [
    {
      "id": "1",
      "question": "pregunta clara y educativa",
      "answer": "RESPUESTA",
      "category": "subcategoría del tema",
      "difficulty": "${request.difficulty}"
    }
  ],
  "metadata": {
    "generatedAt": "fecha actual",
    "totalQuestions": ${request.questionCount},
    "estimatedTime": "tiempo estimado en minutos"
  }
}
`
}

// Parse OpenAI response into structured format
function parseCrosswordResponse(response: string, request: CrosswordRequest): CrosswordResponse {
  try {
    // Parse JSON response directly (since we're using json_object format)
    const parsed = JSON.parse(response)

    // Validate that we have questions
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format: missing questions array')
    }

    // Validate and clean questions
    const validatedQuestions = parsed.questions
      .map((q: any, index: number) => ({
        id: q.id || (index + 1).toString(),
        question: q.question || q.pregunta || '',
        answer: (q.answer || q.respuesta || '').toUpperCase().replace(/[^A-Z]/g, ''),
        category: q.category || q.categoria || 'General',
        difficulty: q.difficulty || q.dificultad || request.difficulty,
      }))
      .filter((q: any) =>
        q.question.length > 0 &&
        q.answer.length >= 3 &&
        q.answer.length <= 15 &&
        /^[A-Z]+$/.test(q.answer)
      )

    if (validatedQuestions.length < 5) {
      throw new Error(`Insufficient valid questions generated: ${validatedQuestions.length}`)
    }

    console.log(`✅ ${validatedQuestions.length} preguntas válidas procesadas`)

    // Calculate estimated time based on question count and difficulty
    const baseTime = validatedQuestions.length * 1.5 // 1.5 minutes per question
    const difficultyMultiplier = request.difficulty === 'facil' ? 0.8 : request.difficulty === 'dificil' ? 1.3 : 1.0
    const estimatedMinutes = Math.round(baseTime * difficultyMultiplier)

    return {
      subject: parsed.subject || parsed.materia || 'General',
      topic: parsed.topic || parsed.tema || request.topic,
      level: parsed.level || parsed.nivel || `${request.grade}° ${request.educationLevel}`,
      grade: parsed.grade || request.grade,
      questions: validatedQuestions,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalQuestions: validatedQuestions.length,
        estimatedTime: `${estimatedMinutes}-${estimatedMinutes + 3} minutos`
      }
    }
  } catch (error) {
    console.error('❌ Error parsing response:', error)
    console.error('Raw response:', response)

    // Fallback: create a basic response
    return {
      subject: 'General',
      topic: request.topic,
      level: `${request.grade}° ${request.educationLevel}`,
      grade: request.grade,
      questions: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        totalQuestions: 0,
        estimatedTime: '15-20 minutos'
      }
    }
  }
}

// Validation functions
export function validateOpenAIConfig(): boolean {
  return !!process.env.OPENAI_API_KEY
}

export async function testOpenAIConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!validateOpenAIConfig()) {
      return { success: false, error: 'OpenAI API key not configured' }
    }

    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Test connection. Respond with 'OK'." }],
      max_tokens: 10
    })

    if (completion.choices[0]?.message?.content) {
      return { success: true }
    } else {
      return { success: false, error: 'No response from OpenAI' }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Demo function for testing (uses mock data when no API key)
export async function generateCrosswordDemo(request: CrosswordRequest): Promise<CrosswordResponse> {
  console.log('🎭 Usando modo demo para:', request.topic)

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Generate demo questions based on topic
  const demoQuestions = generateDemoQuestions(request.topic, request.questionCount)

  return {
    subject: inferSubjectFromTopic(request.topic),
    topic: request.topic,
    level: `${request.grade}° ${request.educationLevel}`,
    grade: request.grade,
    questions: demoQuestions.map((q, index) => ({
      ...q,
      id: (index + 1).toString(),
      difficulty: request.difficulty
    })),
    metadata: {
      generatedAt: new Date().toISOString(),
      totalQuestions: demoQuestions.length,
      estimatedTime: `${Math.round(demoQuestions.length * 1.5)}-${Math.round(demoQuestions.length * 1.5) + 3} minutos`
    }
  }
}

// Helper functions for demo mode
function inferSubjectFromTopic(topic: string): string {
  const topicLower = topic.toLowerCase()

  if (topicLower.includes('historia') || topicLower.includes('revolución') || topicLower.includes('independencia')) {
    return 'Historia'
  } else if (topicLower.includes('matemática') || topicLower.includes('geometría') || topicLower.includes('álgebra')) {
    return 'Matemáticas'
  } else if (topicLower.includes('ciencia') || topicLower.includes('biología') || topicLower.includes('física') || topicLower.includes('química')) {
    return 'Ciencias'
  } else if (topicLower.includes('lenguaje') || topicLower.includes('literatura') || topicLower.includes('gramática')) {
    return 'Lenguaje'
  }

  return 'General'
}

function generateDemoQuestions(topic: string, count: number): Omit<CrosswordQuestion, 'id' | 'difficulty'>[] {
  const topicLower = topic.toLowerCase()

  // Demo questions for common topics
  const demoSets: Record<string, Omit<CrosswordQuestion, 'id' | 'difficulty'>[]> = {
    'revolución francesa': [
      { question: 'Rey de Francia ejecutado durante la revolución', answer: 'LUIS', category: 'Personajes' },
      { question: 'Fortaleza tomada el 14 de julio de 1789', answer: 'BASTILLA', category: 'Eventos' },
      { question: 'Líder del período del Terror', answer: 'ROBESPIERRE', category: 'Personajes' },
      { question: 'Clase social privilegiada antes de la revolución', answer: 'NOBLEZA', category: 'Sociedad' },
      { question: 'Documento que declaraba los derechos fundamentales', answer: 'DECLARACION', category: 'Documentos' }
    ],
    'sistema solar': [
      { question: 'Planeta más cercano al Sol', answer: 'MERCURIO', category: 'Planetas' },
      { question: 'Planeta conocido como el planeta rojo', answer: 'MARTE', category: 'Planetas' },
      { question: 'Estrella central de nuestro sistema', answer: 'SOL', category: 'Estrellas' },
      { question: 'Planeta más grande del sistema solar', answer: 'JUPITER', category: 'Planetas' },
      { question: 'Satélite natural de la Tierra', answer: 'LUNA', category: 'Satélites' }
    ]
  }

  // Find matching demo set
  for (const [key, questions] of Object.entries(demoSets)) {
    if (topicLower.includes(key)) {
      return questions.slice(0, Math.min(count, questions.length))
    }
  }

  // Fallback generic questions
  return [
    { question: `Concepto principal de ${topic}`, answer: 'CONCEPTO', category: 'General' },
    { question: `Elemento importante de ${topic}`, answer: 'ELEMENTO', category: 'General' },
    { question: `Aspecto clave de ${topic}`, answer: 'ASPECTO', category: 'General' }
  ].slice(0, count)
}
