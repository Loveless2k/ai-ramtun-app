'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  PlayIcon,
  PencilIcon,
  ShareIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface CrosswordPreview {
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
  description: string
  estimatedTime: string
}

export default function CrosswordPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [crossword, setCrossword] = useState<CrosswordPreview | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos del crucigrama
    setTimeout(() => {
      // Mock data basado en el ID
      const mockCrosswords: Record<string, CrosswordPreview> = {
        '1': {
          id: '1',
          title: 'Revolución Francesa',
          subject: 'Historia',
          grade: '8° Básico',
          difficulty: 'Medio',
          questions: 15,
          plays: 89,
          avgScore: 78,
          avgTime: '12 min',
          createdAt: '2024-01-15',
          lastPlayed: '2024-01-20',
          status: 'Activo',
          description: 'Crucigrama educativo sobre los eventos principales de la Revolución Francesa, incluyendo personajes históricos, fechas importantes y conceptos clave.',
          estimatedTime: '10-15 minutos'
        },
        '2': {
          id: '2',
          title: 'Sistema Solar',
          subject: 'Ciencias',
          grade: '6° Básico',
          difficulty: 'Fácil',
          questions: 12,
          plays: 156,
          avgScore: 92,
          avgTime: '8 min',
          createdAt: '2024-01-14',
          lastPlayed: '2024-01-20',
          status: 'Activo',
          description: 'Explora los planetas, el sol y otros cuerpos celestes de nuestro sistema solar a través de preguntas divertidas y educativas.',
          estimatedTime: '8-12 minutos'
        },
        '3': {
          id: '3',
          title: 'Fracciones Básicas',
          subject: 'Matemáticas',
          grade: '5° Básico',
          difficulty: 'Fácil',
          questions: 10,
          plays: 67,
          avgScore: 85,
          avgTime: '10 min',
          createdAt: '2024-01-12',
          lastPlayed: '2024-01-19',
          status: 'Activo',
          description: 'Conceptos fundamentales de fracciones: numerador, denominador, fracciones equivalentes y operaciones básicas.',
          estimatedTime: '8-12 minutos'
        }
      }

      const crosswordData = mockCrosswords[params.id as string]
      if (crosswordData) {
        setCrossword(crosswordData)
      }
      setIsLoading(false)
    }, 800)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando crucigrama...</p>
        </div>
      </div>
    )
  }

  if (!crossword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Crucigrama no encontrado</h1>
          <p className="text-gray-600 mb-6">El crucigrama que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => alert('🚧 Función de compartir en desarrollo')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <ShareIcon className="w-4 h-4" />
              <span>Compartir</span>
            </button>
            <button
              onClick={() => alert('🚧 Editor en desarrollo')}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors flex items-center space-x-2"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{crossword.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{crossword.subject}</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{crossword.grade}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  crossword.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                  crossword.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {crossword.difficulty}
                </span>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">{crossword.description}</p>
              
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Simular inicio de juego
                    alert(`🎮 Iniciando crucigrama "${crossword.title}"\n\n🚧 La interfaz de juego estará disponible en la próxima versión.\n\nCaracterísticas del juego:\n• ${crossword.questions} preguntas\n• Tiempo estimado: ${crossword.estimatedTime}\n• Dificultad: ${crossword.difficulty}`)
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3"
                >
                  <PlayIcon className="w-6 h-6" />
                  <span className="text-lg">Jugar Crucigrama</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vista Previa del Crucigrama</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Vista Previa Interactiva</h4>
                <p className="text-gray-600 text-sm mb-4">
                  La vista previa del crucigrama estará disponible en la próxima versión
                </p>
                <p className="text-xs text-gray-500">
                  Incluirá: Grid interactivo, preguntas numeradas, y navegación por celdas
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Jugadas</span>
                  </div>
                  <span className="font-bold text-gray-900">{crossword.plays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrophyIcon className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Promedio</span>
                  </div>
                  <span className="font-bold text-gray-900">{crossword.avgScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Tiempo promedio</span>
                  </div>
                  <span className="font-bold text-gray-900">{crossword.avgTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Preguntas</span>
                  </div>
                  <span className="font-bold text-gray-900">{crossword.questions}</span>
                </div>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Creado:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(crossword.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Última jugada:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(crossword.lastPlayed).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    crossword.status === 'Activo' ? 'bg-green-100 text-green-800' :
                    crossword.status === 'Borrador' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {crossword.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo estimado:</span>
                  <span className="ml-2 font-medium text-gray-900">{crossword.estimatedTime}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
