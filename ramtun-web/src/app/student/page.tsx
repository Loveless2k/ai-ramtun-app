'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  PlayIcon,
  StarIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface AvailableCrossword {
  id: string
  title: string
  subject: string
  grade: string
  difficulty: string
  questions: number
  estimatedTime: string
  description: string
  plays: number
  avgScore: number
  isNew?: boolean
  isPopular?: boolean
}

export default function StudentPage() {
  const [crosswords, setCrosswords] = useState<AvailableCrossword[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - En producción vendría de la API
  const mockCrosswords: AvailableCrossword[] = [
    {
      id: '1',
      title: 'Revolución Francesa',
      subject: 'Historia',
      grade: '8° Básico',
      difficulty: 'Medio',
      questions: 15,
      estimatedTime: '10-15 min',
      description: 'Explora los eventos principales de la Revolución Francesa.',
      plays: 89,
      avgScore: 78,
      isPopular: true
    },
    {
      id: '2',
      title: 'Sistema Solar',
      subject: 'Ciencias',
      grade: '6° Básico',
      difficulty: 'Fácil',
      questions: 12,
      estimatedTime: '8-12 min',
      description: 'Descubre los planetas y cuerpos celestes.',
      plays: 156,
      avgScore: 92,
      isPopular: true
    },
    {
      id: '3',
      title: 'Fracciones Básicas',
      subject: 'Matemáticas',
      grade: '5° Básico',
      difficulty: 'Fácil',
      questions: 10,
      estimatedTime: '8-12 min',
      description: 'Conceptos fundamentales de fracciones.',
      plays: 67,
      avgScore: 85
    },
    {
      id: '4',
      title: 'Geometría Básica',
      subject: 'Matemáticas',
      grade: '7° Básico',
      difficulty: 'Medio',
      questions: 14,
      estimatedTime: '12-18 min',
      description: 'Formas geométricas y sus propiedades.',
      plays: 43,
      avgScore: 71,
      isNew: true
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setCrosswords(mockCrosswords)
      setIsLoading(false)
    }, 1000)
  }, [])

  const subjects = ['all', 'Historia', 'Ciencias', 'Matemáticas', 'Lenguaje']
  const difficulties = ['all', 'Fácil', 'Medio', 'Difícil']

  const filteredCrosswords = crosswords.filter(crossword => {
    const subjectMatch = selectedSubject === 'all' || crossword.subject === selectedSubject
    const difficultyMatch = selectedDifficulty === 'all' || crossword.difficulty === selectedDifficulty
    return subjectMatch && difficultyMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800'
      case 'Medio': return 'bg-yellow-100 text-yellow-800'
      case 'Difícil': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Historia': return BookOpenIcon
      case 'Ciencias': return AcademicCapIcon
      case 'Matemáticas': return TrophyIcon
      default: return BookOpenIcon
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando crucigramas...</p>
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
                <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ramtun Estudiante</h1>
                <p className="text-gray-600">Selecciona un crucigrama para jugar</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">¡Bienvenido!</p>
              <p className="text-lg font-semibold text-indigo-600">Estudiante Demo</p>
            </div>
          </div>
        </div>
      </div>

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
                style={{ color: '#111827' }}
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
                style={{ color: '#111827' }}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crucigramas Disponibles</p>
                <p className="text-3xl font-bold text-gray-900">{filteredCrosswords.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(crosswords.reduce((acc, c) => acc + c.avgScore, 0) / crosswords.length)}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jugadas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {crosswords.reduce((acc, c) => acc + c.plays, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Crosswords Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrosswords.map((crossword, index) => {
            const SubjectIcon = getSubjectIcon(crossword.subject)
            return (
              <motion.div
                key={crossword.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 relative overflow-hidden flex flex-col h-full"
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {crossword.isNew && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Nuevo
                    </span>
                  )}
                  {crossword.isPopular && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>

                {/* Header Section - Fixed Height */}
                <div className="flex items-start space-x-4 mb-4 min-h-[80px]">
                  <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                    <SubjectIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>{crossword.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{crossword.subject}</span>
                      <span>•</span>
                      <span>{crossword.grade}</span>
                    </div>
                  </div>
                </div>

                {/* Description Section - Fixed Height */}
                <div className="mb-4 h-[40px] flex items-start">
                  <p className="text-gray-700 text-sm" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{crossword.description}</p>
                </div>

                {/* Details Section - Consistent Spacing */}
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex justify-between items-center text-sm h-[24px]">
                    <span className="text-gray-600">Dificultad:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(crossword.difficulty)}`}>
                      {crossword.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm h-[24px]">
                    <span className="text-gray-600">Preguntas:</span>
                    <span className="font-medium text-gray-900">{crossword.questions}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm h-[24px]">
                    <span className="text-gray-600">Tiempo estimado:</span>
                    <span className="font-medium text-gray-900">{crossword.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm h-[24px]">
                    <span className="text-gray-600">Promedio:</span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">{crossword.avgScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Button Section - Fixed at Bottom */}
                <div className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = `/game/${crossword.id}`}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <PlayIcon className="w-5 h-5" />
                    <span>Jugar Ahora</span>
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredCrosswords.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay crucigramas disponibles</h3>
            <p className="text-gray-600">
              No se encontraron crucigramas con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
