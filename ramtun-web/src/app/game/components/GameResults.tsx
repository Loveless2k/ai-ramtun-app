'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  TrophyIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  HomeIcon,
  ShareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface GameResultsProps {
  title: string
  subject: string
  difficulty: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeElapsed: number
  hintsUsed: number
  onPlayAgain: () => void
  gameId: string
}

export default function GameResults({
  title,
  subject,
  difficulty,
  score,
  totalQuestions,
  correctAnswers,
  timeElapsed,
  hintsUsed,
  onPlayAgain,
  gameId
}: GameResultsProps) {
  const getStars = (score: number) => {
    if (score >= 90) return 5
    if (score >= 80) return 4
    if (score >= 70) return 3
    if (score >= 60) return 2
    if (score >= 50) return 1
    return 0
  }

  const getPerformanceMessage = (score: number) => {
    if (score >= 95) return { message: "¡Perfecto! Eres un maestro", emoji: "🏆", color: "text-yellow-600" }
    if (score >= 90) return { message: "¡Excelente trabajo!", emoji: "🌟", color: "text-yellow-600" }
    if (score >= 80) return { message: "¡Muy bien hecho!", emoji: "👏", color: "text-green-600" }
    if (score >= 70) return { message: "¡Buen trabajo!", emoji: "👍", color: "text-blue-600" }
    if (score >= 60) return { message: "¡Sigue practicando!", emoji: "💪", color: "text-orange-600" }
    return { message: "¡No te rindas!", emoji: "🎯", color: "text-red-600" }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const stars = getStars(score)
  const performance = getPerformanceMessage(score)
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <TrophyIcon className="w-16 h-16 mx-auto text-yellow-300" />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">¡Crucigrama Completado!</h2>
          <p className="text-indigo-100">{title}</p>
          <p className="text-indigo-200 text-sm">{subject} • {difficulty}</p>
        </div>

        {/* Score Section */}
        <div className="p-6 text-center border-b border-gray-200">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <div className="text-4xl font-bold text-gray-900 mb-2">{score}%</div>
            <div className="flex justify-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  <StarIcon
                    className={`w-8 h-8 ${
                      i < stars
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <div className={`text-lg font-semibold ${performance.color}`}>
              <span className="text-2xl mr-2">{performance.emoji}</span>
              {performance.message}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-4">Estadísticas del Juego</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-green-700">Correctas</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <XCircleIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-red-700">Incorrectas</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <ClockIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-blue-700">Tiempo</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <ChartBarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
              <div className="text-sm text-purple-700">Precisión</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Pistas utilizadas:</span>
              <span className="font-medium text-gray-900">{hintsUsed}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-600">Tiempo promedio por pregunta:</span>
              <span className="font-medium text-gray-900">
                {Math.round(timeElapsed / totalQuestions)}s
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            Jugar de Nuevo
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/game"
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Más Juegos
            </Link>
            
            <button
              onClick={() => {
                const text = `¡Completé "${title}" en Ramtun! Obtuve ${score}% (${stars} estrellas) en ${formatTime(timeElapsed)}`
                navigator.clipboard.writeText(text).then(() => {
                  alert('¡Resultado copiado al portapapeles!')
                }).catch(() => {
                  alert('No se pudo copiar al portapapeles')
                })
              }}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Compartir
            </button>
          </div>
        </div>

        {/* Achievements */}
        {(score >= 90 || timeElapsed < 300 || hintsUsed === 0) && (
          <div className="p-6 pt-0">
            <h4 className="font-semibold text-gray-900 mb-3">🏆 Logros Desbloqueados</h4>
            <div className="space-y-2">
              {score >= 90 && (
                <div className="flex items-center space-x-3 bg-yellow-50 p-3 rounded-lg">
                  <div className="text-2xl">🌟</div>
                  <div>
                    <div className="font-medium text-yellow-800">Maestro del Conocimiento</div>
                    <div className="text-sm text-yellow-700">Obtuviste más del 90% de respuestas correctas</div>
                  </div>
                </div>
              )}
              
              {timeElapsed < 300 && (
                <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className="font-medium text-blue-800">Velocidad Relámpago</div>
                    <div className="text-sm text-blue-700">Completaste el crucigrama en menos de 5 minutos</div>
                  </div>
                </div>
              )}
              
              {hintsUsed === 0 && (
                <div className="flex items-center space-x-3 bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <div className="font-medium text-purple-800">Mente Brillante</div>
                    <div className="text-sm text-purple-700">Completaste sin usar pistas</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
