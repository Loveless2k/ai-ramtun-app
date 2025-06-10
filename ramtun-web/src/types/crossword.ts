// Shared TypeScript types for Ramtun crossword functionality
// Consolidates all crossword-related interfaces to prevent duplication

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
  number?: number
}

export interface CrosswordData {
  id: string
  title: string
  subject: string
  difficulty: string
  estimatedTime: string
  questions: CrosswordQuestion[]
}

export interface CrosswordRequest {
  topic: string
  educationLevel: 'basica' | 'media' // 1-8 básica, 1-4 media
  grade: number
  difficulty: 'facil' | 'medio' | 'dificil'
  questionCount: number
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

// Game-specific types
export interface AvailableCrossword {
  id: string
  title: string
  subject: string
  description: string
  difficulty: string
  estimatedTime: string
  isPublic: boolean
  questions: number
}

// Internal algorithm types
export interface PlacedWord {
  word: string
  row: number
  col: number
  direction: 'horizontal' | 'vertical'
  questionId: string
  questionData: Omit<CrosswordQuestion, 'position' | 'number'>
}

export interface Intersection {
  word1: PlacedWord
  word2: PlacedWord
  word1LetterIndex: number
  word2LetterIndex: number
  row: number
  col: number
  letter: string
}

// Dashboard and analytics types
export interface CrosswordStats {
  id: string
  title: string
  subject: string
  grade: string
  difficulty: string
  questions: number
  plays: number
  avgScore: number
  avgTime: string
  createdAt: string
  lastPlayed: string
  status: 'Activo' | 'Borrador' | 'Archivado'
}
