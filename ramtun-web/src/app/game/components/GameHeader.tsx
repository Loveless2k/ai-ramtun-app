'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ClockIcon,
  StarIcon,
  TrophyIcon,
  PauseIcon,
  PlayIcon,
  HomeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface GameHeaderProps {
  title: string
  subject: string
  difficulty: string
  totalQuestions: number
  completedQuestions: number
  score: number
  timeElapsed: number
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onHint: () => void
  hintsRemaining: number
  selectedQuestion?: string | null
  questions?: Array<{
    id: string
    question: string
    answer: string
    number: number
    position: { direction: 'horizontal' | 'vertical' }
  }>
}

export default function GameHeader({
  title,
  subject,
  difficulty,
  totalQuestions,
  completedQuestions,
  score,
  timeElapsed,
  isPaused,
  onPause,
  onResume,
  onHint,
  hintsRemaining,
  selectedQuestion,
  questions
}: GameHeaderProps) {
  const [displayTime, setDisplayTime] = useState('')

  useEffect(() => {
    const minutes = Math.floor(timeElapsed / 60)
    const seconds = timeElapsed % 60
    setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
  }, [timeElapsed])

  const progressPercentage = (completedQuestions / totalQuestions) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-100 text-green-800'
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800'
      case 'Difícil':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStars = (score: number) => {
    if (score >= 90) return 5
    if (score >= 80) return 4
    if (score >= 70) return 3
    if (score >= 60) return 2
    if (score >= 50) return 1
    return 0
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left Section - Game Info */}
          <div className="flex items-center space-x-4">
            <Link
              href="/game"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Volver a juegos"
            >
              <HomeIcon className="w-5 h-5" />
            </Link>
            
            <div className="hidden sm:block w-px h-8 bg-gray-300" />
            
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600">{subject}</p>
            </div>
          </div>

          {/* Center Section - Progress */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Progress Bar */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Progreso</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {completedQuestions}/{totalQuestions}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-bold text-gray-900">{score}</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < getStars(score)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center space-x-3">
            {/* Timer */}
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <ClockIcon className="w-4 h-4 text-gray-600" />
              <span
                id="game-timer-display"
                className="font-mono text-sm font-medium text-gray-900"
              >
                {displayTime}
              </span>
            </div>

            {/* Selected Question Indicator */}
            {selectedQuestion && questions && (
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-700">
                  Pregunta {questions.find(q => q.id === selectedQuestion)?.number || '?'}
                  {questions.find(q => q.id === selectedQuestion)?.position.direction === 'horizontal' ? 'H' : 'V'}
                </span>
              </div>
            )}

            {/* Hint Button */}
            <button
              onClick={onHint}
              disabled={hintsRemaining === 0}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                hintsRemaining > 0
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title={`${hintsRemaining} pistas restantes`}
            >
              <QuestionMarkCircleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Pista</span>
              <span className="bg-white px-1.5 py-0.5 rounded text-xs">
                {hintsRemaining}
              </span>
            </button>

            {/* Pause/Resume Button */}
            <button
              onClick={isPaused ? onResume : onPause}
              className="flex items-center space-x-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg font-medium text-sm transition-colors"
            >
              {isPaused ? (
                <>
                  <PlayIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Reanudar</span>
                </>
              ) : (
                <>
                  <PauseIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Pausar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progreso: {completedQuestions}/{totalQuestions}
            </span>
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-gray-900">{score}</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-3 h-3 ${
                      i < getStars(score)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-8 text-center shadow-xl">
            <PauseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Juego Pausado</h3>
            <p className="text-gray-600 mb-6">Haz clic en "Reanudar" para continuar</p>
            <button
              onClick={onResume}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlayIcon className="w-5 h-5 inline mr-2" />
              Reanudar Juego
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
