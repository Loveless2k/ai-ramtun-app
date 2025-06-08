'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import GameHeader from '../components/GameHeader'
import CrosswordGrid from '../components/CrosswordGrid'
import CluesPanel from '../components/CluesPanel'
import GameResults from '../components/GameResults'
import GameTimer from '../components/GameTimer'

interface CrosswordQuestion {
  id: string
  question: string
  answer: string
  category: string
  difficulty: string
  position: {
    row: number
    col: number
    direction: 'horizontal' | 'vertical'
  }
  number: number
}

interface GameData {
  id: string
  title: string
  subject: string
  difficulty: string
  questions: CrosswordQuestion[]
  estimatedTime: string
}

// Mock game data - En producción vendría de la API
const mockGameData: Record<string, GameData> = {
  'revolucion-francesa': {
    id: 'revolucion-francesa',
    title: 'Revolución Francesa',
    subject: 'Historia',
    difficulty: 'Medio',
    estimatedTime: '12-15 min',
    questions: [
      {
        id: '1',
        question: 'Rey de Francia ejecutado durante la revolución',
        answer: 'LUIS',
        category: 'Personajes',
        difficulty: 'Medio',
        position: { row: 2, col: 3, direction: 'horizontal' },
        number: 1
      },
      {
        id: '2',
        question: 'Fortaleza tomada el 14 de julio de 1789',
        answer: 'BASTILLA',
        category: 'Eventos',
        difficulty: 'Medio',
        position: { row: 1, col: 5, direction: 'vertical' },
        number: 2
      },
      {
        id: '3',
        question: 'Líder del período del Terror',
        answer: 'ROBESPIERRE',
        category: 'Personajes',
        difficulty: 'Difícil',
        position: { row: 4, col: 1, direction: 'horizontal' },
        number: 3
      },
      {
        id: '4',
        question: 'Clase social privilegiada antes de la revolución',
        answer: 'NOBLEZA',
        category: 'Sociedad',
        difficulty: 'Fácil',
        position: { row: 6, col: 4, direction: 'vertical' },
        number: 4
      },
      {
        id: '5',
        question: 'Documento que declaraba los derechos fundamentales',
        answer: 'DECLARACION',
        category: 'Documentos',
        difficulty: 'Medio',
        position: { row: 8, col: 2, direction: 'horizontal' },
        number: 5
      }
    ]
  },
  'sistema-solar': {
    id: 'sistema-solar',
    title: 'Sistema Solar',
    subject: 'Ciencias',
    difficulty: 'Fácil',
    estimatedTime: '8-10 min',
    questions: [
      {
        id: '1',
        question: 'Planeta más cercano al Sol',
        answer: 'MERCURIO',
        category: 'Planetas',
        difficulty: 'Fácil',
        position: { row: 2, col: 2, direction: 'horizontal' },
        number: 1
      },
      {
        id: '2',
        question: 'Planeta conocido como el planeta rojo',
        answer: 'MARTE',
        category: 'Planetas',
        difficulty: 'Fácil',
        position: { row: 4, col: 4, direction: 'vertical' },
        number: 2
      },
      {
        id: '3',
        question: 'Estrella central de nuestro sistema',
        answer: 'SOL',
        category: 'Estrellas',
        difficulty: 'Fácil',
        position: { row: 1, col: 6, direction: 'vertical' },
        number: 3
      },
      {
        id: '4',
        question: 'Planeta más grande del sistema solar',
        answer: 'JUPITER',
        category: 'Planetas',
        difficulty: 'Fácil',
        position: { row: 6, col: 1, direction: 'horizontal' },
        number: 4
      }
    ]
  }
}

export default function GamePage() {
  const params = useParams()
  const gameId = params.id as string
  
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, boolean>>({})
  const [hints, setHints] = useState<Record<string, string>>({})
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  // Load game data
  useEffect(() => {
    const data = mockGameData[gameId]
    if (data) {
      setGameData(data)
      setSelectedQuestion(data.questions[0]?.id || null)
    }
  }, [gameId])

  // Callback para actualizar tiempo desde el componente timer aislado
  const handleTimeUpdate = useCallback((newTime: number) => {
    setTimeElapsed(newTime)
  }, [])

  // Check completion
  useEffect(() => {
    if (gameData) {
      const totalQuestions = gameData.questions.length
      const correctCount = Object.values(correctAnswers).filter(Boolean).length
      
      if (correctCount === totalQuestions && correctCount > 0) {
        setIsCompleted(true)
        calculateScore()
      }
    }
  }, [correctAnswers, gameData])

  const calculateScore = useCallback(() => {
    if (!gameData) return

    const totalQuestions = gameData.questions.length
    const correctCount = Object.values(correctAnswers).filter(Boolean).length
    const accuracy = (correctCount / totalQuestions) * 100

    // Bonus por tiempo (máximo 20 puntos)
    const timeBonus = Math.max(0, 20 - Math.floor(timeElapsed / 30))
    
    // Bonus por no usar pistas (máximo 10 puntos)
    const hintBonus = Math.max(0, 10 - (3 - hintsRemaining) * 3)

    const finalScore = Math.min(100, Math.round(accuracy + timeBonus + hintBonus))
    setScore(finalScore)
  }, [correctAnswers, gameData, timeElapsed, hintsRemaining])

  const handleAnswerSubmit = (questionId: string, answer: string) => {
    if (!gameData) return

    const question = gameData.questions.find(q => q.id === questionId)
    if (!question) return

    const isCorrect = answer.toUpperCase() === question.answer.toUpperCase()
    
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }))
    setCorrectAnswers(prev => ({ ...prev, [questionId]: isCorrect }))
  }

  const handleHint = () => {
    if (hintsRemaining === 0 || !selectedQuestion || !gameData) return

    const question = gameData.questions.find(q => q.id === selectedQuestion)
    if (!question || hints[selectedQuestion]) return

    // Generate hint (first letter + length)
    const hint = `Comienza con "${question.answer[0]}" y tiene ${question.answer.length} letras`
    
    setHints(prev => ({ ...prev, [selectedQuestion]: hint }))
    setHintsRemaining(prev => prev - 1)
  }

  const handlePlayAgain = () => {
    setUserAnswers({})
    setCorrectAnswers({})
    setHints({})
    setHintsRemaining(3)
    setTimeElapsed(0)
    setIsPaused(false)
    setIsCompleted(false)
    setScore(0)
    if (gameData) {
      setSelectedQuestion(gameData.questions[0]?.id || null)
    }
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando crucigrama...</p>
        </div>
      </div>
    )
  }

  const completedQuestions = Object.values(correctAnswers).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Timer aislado que actualiza DOM directamente */}
      <GameTimer
        isPaused={isPaused}
        isCompleted={isCompleted}
        onTimeUpdate={handleTimeUpdate}
        timerId="game-timer-display"
      />

      <GameHeader
        title={gameData.title}
        subject={gameData.subject}
        difficulty={gameData.difficulty}
        totalQuestions={gameData.questions.length}
        completedQuestions={completedQuestions}
        score={score}
        timeElapsed={timeElapsed}
        isPaused={isPaused}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        onHint={handleHint}
        hintsRemaining={hintsRemaining}
      />

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crossword Grid */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CrosswordGrid
                questions={gameData.questions}
                onAnswerChange={handleAnswerSubmit}
                onQuestionSelect={setSelectedQuestion}
                selectedQuestion={selectedQuestion}
                userAnswers={userAnswers}
                correctAnswers={correctAnswers}
                isCompleted={isCompleted}
              />
            </motion.div>
          </div>

          {/* Clues Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-full"
            >
              <CluesPanel
                questions={gameData.questions}
                selectedQuestion={selectedQuestion}
                onQuestionSelect={setSelectedQuestion}
                userAnswers={userAnswers}
                correctAnswers={correctAnswers}
                onAnswerSubmit={handleAnswerSubmit}
                hints={hints}
                isCompleted={isCompleted}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {isCompleted && (
        <GameResults
          title={gameData.title}
          subject={gameData.subject}
          difficulty={gameData.difficulty}
          score={score}
          totalQuestions={gameData.questions.length}
          correctAnswers={completedQuestions}
          timeElapsed={timeElapsed}
          hintsUsed={3 - hintsRemaining}
          onPlayAgain={handlePlayAgain}
          gameId={gameId}
        />
      )}
    </div>
  )
}
