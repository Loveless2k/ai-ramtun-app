'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  AcademicCapIcon, 
  PlayIcon, 
  LockClosedIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../lib/auth'

interface AvailableCrossword {
  id: string
  title: string
  subject: string
  description: string
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  estimatedTime: string
  isPublic: boolean
  questions: number
}

export default function PlayPage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuth()
  const [crosswords, setCrosswords] = useState<AvailableCrossword[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [isLoadingCrosswords, setIsLoadingCrosswords] = useState(true)

  // Obtener rol del usuario
  const userRole = user?.user_metadata?.role || 'student'
  const isTeacher = userRole === 'teacher'

  useEffect(() => {
    // Simular carga de crucigramas disponibles
    const loadCrosswords = async () => {
      setIsLoadingCrosswords(true)
      
      // Datos de ejemplo - en producción vendría de la API
      const availableCrosswords: AvailableCrossword[] = [
        {
          id: '2',
          title: 'Sistema Solar',
          subject: 'Ciencias',
          description: 'Explora los planetas y cuerpos celestes de nuestro sistema solar.',
          difficulty: 'Medio',
          estimatedTime: '15-20 min',
          isPublic: true,
          questions: 12
        },
        {
          id: '3',
          title: 'Independencia de Chile',
          subject: 'Historia',
          description: 'Descubre los eventos y personajes clave de la independencia chilena.',
          difficulty: 'Medio',
          estimatedTime: '20-25 min',
          isPublic: false,
          questions: 15
        },
        {
          id: '4',
          title: 'Geometría Básica',
          subject: 'Matemáticas',
          description: 'Aprende sobre figuras geométricas y sus propiedades.',
          difficulty: 'Fácil',
          estimatedTime: '10-15 min',
          isPublic: false,
          questions: 10
        },
        {
          id: '5',
          title: 'Revolución Francesa',
          subject: 'Historia',
          description: 'Conoce los eventos que marcaron la Revolución Francesa.',
          difficulty: 'Difícil',
          estimatedTime: '25-30 min',
          isPublic: false,
          questions: 18
        }
      ]

      setCrosswords(availableCrosswords)
      setIsLoadingCrosswords(false)
    }

    loadCrosswords()
  }, [])

  // Filtros
  const subjects = ['all', ...Array.from(new Set(crosswords.map(c => c.subject)))]
  const difficulties = ['all', 'Fácil', 'Medio', 'Difícil']

  const filteredCrosswords = crosswords.filter(crossword => {
    const matchesSubject = selectedSubject === 'all' || crossword.subject === selectedSubject
    const matchesDifficulty = selectedDifficulty === 'all' || crossword.difficulty === selectedDifficulty
    return matchesSubject && matchesDifficulty
  })

  // Verificar acceso
  const hasAccess = (crossword: AvailableCrossword) => {
    return isAuthenticated || crossword.isPublic
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <PlayIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isTeacher ? 'Ramtun - Área de Juegos' : 'Ramtun Estudiante'}
                </h1>
                <p className="text-gray-600">
                  {isTeacher 
                    ? 'Prueba y juega crucigramas para validar la experiencia de tus estudiantes'
                    : 'Selecciona un crucigrama para jugar'
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                ¡Bienvenido{isTeacher ? ' Profesor' : ''}!
              </p>
              {isTeacher && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ← Volver al Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Info Banner */}
      {isTeacher && (
        <div className="bg-indigo-50 border-b border-indigo-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-3">
              <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
              <p className="text-indigo-800 text-sm">
                <strong>Modo Profesor:</strong> Puedes jugar cualquier crucigrama para probar la experiencia que tendrán tus estudiantes.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject} className="text-gray-900 bg-white py-2">
                    {subject === 'all' ? 'Todas las materias' : subject}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="text-gray-900 bg-white py-2">
                    {difficulty === 'all' ? 'Todas las dificultades' : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingCrosswords && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando crucigramas...</p>
          </div>
        )}

        {/* Crosswords Grid */}
        {!isLoadingCrosswords && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrosswords.map((crossword, index) => {
              const hasAccessToCrossword = hasAccess(crossword)
              const isPublic = crossword.isPublic

              return (
                <motion.div
                  key={crossword.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                    hasAccessToCrossword ? 'border-gray-200 hover:border-indigo-300' : 'border-gray-300'
                  } flex flex-col h-full`}
                >
                  {/* Header */}
                  <div className={`p-6 ${hasAccessToCrossword ? 'bg-gradient-to-r from-indigo-50 to-purple-50' : 'bg-gray-50'} flex-shrink-0`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={`text-xl font-bold ${hasAccessToCrossword ? 'text-gray-900' : 'text-gray-600'}`}>
                        {crossword.title}
                      </h3>
                      {isPublic && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${hasAccessToCrossword ? 'text-indigo-600' : 'text-gray-500'} mb-2`}>
                      {crossword.subject}
                    </p>
                    <p className={`text-sm ${hasAccessToCrossword ? 'text-gray-700' : 'text-gray-500'} leading-relaxed`}>
                      {crossword.description}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${hasAccessToCrossword ? 'text-gray-900' : 'text-gray-500'}`}>
                          {crossword.difficulty}
                        </div>
                        <div className="text-xs text-gray-500">Dificultad</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${hasAccessToCrossword ? 'text-gray-900' : 'text-gray-500'} flex items-center justify-center`}>
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {crossword.estimatedTime.split('-')[0]}
                        </div>
                        <div className="text-xs text-gray-500">Minutos</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${hasAccessToCrossword ? 'text-gray-900' : 'text-gray-500'} flex items-center justify-center`}>
                          <BookOpenIcon className="w-4 h-4 mr-1" />
                          {crossword.questions}
                        </div>
                        <div className="text-xs text-gray-500">Preguntas</div>
                      </div>
                    </div>

                    {/* Button Section - Fixed at Bottom */}
                    <div className="mt-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = `/game/${crossword.id}`}
                        className={`w-full py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
                          hasAccessToCrossword
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                        }`}
                      >
                        {hasAccessToCrossword ? (
                          <>
                            <PlayIcon className="w-5 h-5" />
                            <span>{isPublic ? 'Probar Demo' : (isTeacher ? 'Probar Crucigrama' : 'Jugar Ahora')}</span>
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="w-5 h-5" />
                            <span>Requiere Cuenta</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingCrosswords && filteredCrosswords.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-700 font-medium text-lg">No se encontraron crucigramas</p>
            <p className="text-gray-500 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
