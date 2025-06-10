'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import GameHeader from '../components/GameHeader'
import CrosswordGrid from '../components/CrosswordGrid'
import CluesPanel from '../components/CluesPanel'
import GameResults from '../components/GameResults'
import GameTimer from '../components/GameTimer'
import AccessGuard from '../../../components/AccessGuard'
import DemoConversionModal from '../../../components/DemoConversionModal'
import { generatePerfectCrossword } from '../../../utils/perfectCrosswordGenerator'
import type { CrosswordData } from '../../../types/crossword'
import { useAuth, isCrosswordPublic } from '../../../lib/auth'

// Función para obtener datos del juego usando el algoritmo universal
const getGameData = (gameId: string): CrosswordData | null => {
  // El algoritmo universal maneja todos los temas disponibles
  const perfectCrossword = generatePerfectCrossword(gameId)
  if (perfectCrossword) {
    console.log(`✅ Crucigrama universal generado para: ${gameId}`)
    return perfectCrossword
  }

  console.log(`❌ Tema no encontrado: ${gameId}`)
  return null
}

// ✅ Mock data eliminado - El algoritmo universal maneja todos los casos


export default function GamePage() {
  const params = useParams()
  const gameId = params.id as string
  const { isAuthenticated, isLoading } = useAuth()

  const [gameData, setGameData] = useState<CrosswordData | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, boolean>>({})
  const [hints, setHints] = useState<Record<string, string>>({})
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showConversionModal, setShowConversionModal] = useState(false)

  // Check if user has access to this crossword
  const isPublicCrossword = isCrosswordPublic(gameId)
  const hasAccess = isAuthenticated || isPublicCrossword

  // Load game data using universal algorithm
  useEffect(() => {
    const data = getGameData(gameId)
    if (data) {
      setGameData(data)
      setSelectedQuestion(data.questions[0]?.id || null)
    } else {
      console.error(`❌ No se pudo cargar el crucigrama: ${gameId}`)
    }
  }, [gameId])

  // Callback para actualizar tiempo desde el componente timer aislado
  const handleTimeUpdate = useCallback((newTime: number) => {
    setTimeElapsed(newTime)
  }, [])

  // Define calculateScore before using it in useEffect
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

  // Check completion
  useEffect(() => {
    if (gameData) {
      const totalQuestions = gameData.questions.length
      const correctCount = Object.values(correctAnswers).filter(Boolean).length

      if (correctCount === totalQuestions && correctCount > 0) {
        setIsCompleted(true)
        calculateScore()

        // Show conversion modal for demo users
        if (!isAuthenticated && isPublicCrossword) {
          setTimeout(() => {
            setShowConversionModal(true)
          }, 2000) // Show after 2 seconds to let them see the results first
        }
      }
    }
  }, [correctAnswers, gameData, isAuthenticated, isPublicCrossword, calculateScore])

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

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Show access guard if user doesn't have access
  if (!hasAccess) {
    return (
      <AccessGuard
        gameId={gameId}
        gameTitle={gameData?.title || 'Crucigrama'}
        gameSubject={gameData?.subject || 'Educativo'}
      />
    )
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
        selectedQuestion={selectedQuestion}
        questions={gameData.questions}
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
        />
      )}

      {/* Demo Conversion Modal */}
      <DemoConversionModal
        isOpen={showConversionModal}
        onClose={() => setShowConversionModal(false)}
        score={score}
        timeElapsed={timeElapsed}
      />
    </div>
  )
}
