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
    const prompt = buildPromptZero(request)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un experto en educación chilena especializado en crear crucigramas educativos. Generas contenido alineado con el currículum nacional chileno y adaptado al nivel cognitivo de los estudiantes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    return parseCrosswordResponse(response, request)
  } catch (error) {
    console.error('Error generating crossword:', error)
    throw new Error('Failed to generate crossword')
  }
}

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

INSTRUCCIONES:
1. ANALIZA el tema y determina la MATERIA más apropiada (Historia, Ciencias, Matemáticas, Lenguaje, etc.)
2. INFIERE el contexto curricular chileno para ${levelDescription}
3. GENERA ${request.questionCount} preguntas de crucigrama adaptadas al nivel cognitivo
4. ENFÓCATE en conceptos clave, vocabulario apropiado y conocimientos fundamentales
5. ASEGÚRATE de que las respuestas sean palabras simples (sin espacios ni caracteres especiales)

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

EJEMPLO para "Revolución Francesa" - 8° Básico:
- Materia: Historia
- Preguntas sobre: personajes clave, fechas importantes, conceptos fundamentales
- Vocabulario apropiado para 14 años
- Respuestas: LUIS, BASTILLA, ROBESPIERRE, etc.

GENERA EL CRUCIGRAMA AHORA:
`
}

// Parse OpenAI response into structured format
function parseCrosswordResponse(response: string, request: CrosswordRequest): CrosswordResponse {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate and structure the response
    return {
      subject: parsed.subject || 'General',
      topic: parsed.topic || request.topic,
      level: parsed.level || `${request.grade}° ${request.educationLevel}`,
      grade: parsed.grade || request.grade,
      questions: parsed.questions?.map((q: any, index: number) => ({
        id: q.id || (index + 1).toString(),
        question: q.question || '',
        answer: q.answer?.toUpperCase() || '',
        category: q.category || 'General',
        difficulty: q.difficulty || request.difficulty,
      })) || [],
      metadata: {
        generatedAt: new Date().toISOString(),
        totalQuestions: parsed.questions?.length || 0,
        estimatedTime: parsed.metadata?.estimatedTime || '15-20 minutos'
      }
    }
  } catch (error) {
    console.error('Error parsing response:', error)
    
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

// Demo function for testing (uses mock data when no API key)
export async function generateCrosswordDemo(request: CrosswordRequest): Promise<CrosswordResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    subject: 'Historia',
    topic: request.topic,
    level: `${request.grade}° ${request.educationLevel}`,
    grade: request.grade,
    questions: [
      {
        id: '1',
        question: 'Rey de Francia ejecutado durante la revolución',
        answer: 'LUIS',
        category: 'Personajes',
        difficulty: request.difficulty
      },
      {
        id: '2',
        question: 'Fortaleza tomada el 14 de julio de 1789',
        answer: 'BASTILLA',
        category: 'Eventos',
        difficulty: request.difficulty
      },
      {
        id: '3',
        question: 'Líder del período del Terror',
        answer: 'ROBESPIERRE',
        category: 'Personajes',
        difficulty: request.difficulty
      }
    ],
    metadata: {
      generatedAt: new Date().toISOString(),
      totalQuestions: 3,
      estimatedTime: '15-20 minutos'
    }
  }
}
