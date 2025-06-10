'use client'

import { useState, useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'


interface CrosswordDetail {
  id: string
  title: string
  subject: string
  grade: string
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  questions: number
  estimatedTime: string
  plays: number
  avgScore: number
  rating: number
  isPublic: boolean
  isFavorite: boolean
  thumbnail: string
  description: string
  tags: string[]
  createdAt: string
  lastPlayed?: string
  myBestScore?: number
  completionRate: number
  isRecommended?: boolean
  isNew?: boolean
  isTrending?: boolean
  author: string
  objectives: string[]
  topics: string[]
  reviews: {
    id: string
    user: string
    rating: number
    comment: string
    date: string
  }[]
  relatedCrosswords: {
    id: string
    title: string
    subject: string
    thumbnail: string
    rating: number
  }[]
}

export default function CrosswordDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [crossword, setCrossword] = useState<CrosswordDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // Simular carga de datos del crucigrama
    setTimeout(() => {
      // Mock data basado en el ID
      const mockCrossword: CrosswordDetail = {
        id: params.id as string,
        title: 'Sistema Solar',
        subject: 'Ciencias',
        grade: '6° Básico',
        difficulty: 'Medio',
        questions: 12,
        estimatedTime: '15-20 min',
        plays: 234,
        avgScore: 87,
        rating: 4.8,
        isPublic: true,
        isFavorite: false,
        thumbnail: '🌌',
        description: 'Explora los planetas, lunas y otros cuerpos celestes de nuestro sistema solar. Este crucigrama te ayudará a aprender sobre las características únicas de cada planeta, sus lunas principales y otros objetos fascinantes del espacio.',
        tags: ['planetas', 'espacio', 'astronomía', 'sistema solar'],
        createdAt: '2024-01-15',
        lastPlayed: '2024-01-20',
        myBestScore: 95,
        completionRate: 89,
        isRecommended: true,
        isNew: false,
        isTrending: true,
        author: 'Prof. María González',
        objectives: [
          'Identificar los 8 planetas del sistema solar',
          'Conocer las características principales de cada planeta',
          'Aprender sobre lunas y otros cuerpos celestes',
          'Comprender las distancias relativas en el espacio'
        ],
        topics: [
          'Planetas interiores (Mercurio, Venus, Tierra, Marte)',
          'Planetas exteriores (Júpiter, Saturno, Urano, Neptuno)',
          'Lunas principales (Luna, Europa, Titán, etc.)',
          'Cinturón de asteroides',
          'Cometas y meteoritos'
        ],
        reviews: [
          {
            id: '1',
            user: 'Ana M.',
            rating: 5,
            comment: '¡Excelente crucigrama! Aprendí mucho sobre los planetas.',
            date: '2024-01-18'
          },
          {
            id: '2',
            user: 'Carlos R.',
            rating: 4,
            comment: 'Muy educativo, aunque algunas preguntas son un poco difíciles.',
            date: '2024-01-16'
          },
          {
            id: '3',
            user: 'Sofía L.',
            rating: 5,
            comment: 'Me encantó! Perfecto para mi nivel.',
            date: '2024-01-14'
          }
        ],
        relatedCrosswords: [
          {
            id: '4',
            title: 'Animales Vertebrados',
            subject: 'Ciencias',
            thumbnail: '🦎',
            rating: 4.7
          },
          {
            id: '6',
            title: 'Tabla Periódica',
            subject: 'Ciencias',
            thumbnail: '⚛️',
            rating: 4.4
          }
        ]
      }
      
      setCrossword(mockCrossword)
      setIsFavorite(mockCrossword.isFavorite)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Aquí se guardaría en localStorage o API
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800'
      case 'Medio': return 'bg-yellow-100 text-yellow-800'
      case 'Difícil': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando crucigrama...</p>
        </div>
      </div>
    )
  }

  if (!crossword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Crucigrama no encontrado</h2>
          <p className="text-gray-600 mb-6">El crucigrama que buscas no existe o no está disponible.</p>
          <button
            onClick={() => router.push('/student/library')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver a la biblioteca
          </button>
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
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-400" />
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ShareIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-6xl">{crossword.thumbnail}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{crossword.title}</h1>
                        {crossword.isNew && (
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                            Nuevo
                          </span>
                        )}
                        {crossword.isTrending && (
                          <FireIcon className="w-6 h-6 text-orange-500" />
                        )}
                      </div>
                      <p className="text-lg text-gray-600 mb-2">{crossword.subject} • {crossword.grade}</p>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(crossword.difficulty)}`}>
                          {crossword.difficulty}
                        </span>
                        <div className="flex items-center space-x-1">
                          <StarIcon className="w-5 h-5 text-yellow-500" />
                          <span className="font-semibold text-gray-900">{crossword.rating}</span>
                          <span className="text-gray-600">({crossword.reviews.length} reseñas)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">{crossword.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {crossword.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <BookOpenIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-2xl font-bold text-gray-900">{crossword.questions}</span>
                    </div>
                    <p className="text-sm text-gray-600">Preguntas</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <ClockIcon className="w-5 h-5 text-green-500" />
                      <span className="text-2xl font-bold text-gray-900">{crossword.estimatedTime.split('-')[0]}</span>
                    </div>
                    <p className="text-sm text-gray-600">Minutos aprox.</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <PlayIcon className="w-5 h-5 text-purple-500" />
                      <span className="text-2xl font-bold text-gray-900">{crossword.plays}</span>
                    </div>
                    <p className="text-sm text-gray-600">Jugadas</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <TrophyIcon className="w-5 h-5 text-yellow-500" />
                      <span className={`text-2xl font-bold ${getScoreColor(crossword.avgScore)}`}>{crossword.avgScore}%</span>
                    </div>
                    <p className="text-sm text-gray-600">Promedio</p>
                  </div>
                </div>

                {/* My Progress */}
                {crossword.myBestScore && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mi Progreso</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <TrophyIcon className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm text-gray-600">Mi mejor puntuación</span>
                        </div>
                        <p className={`text-2xl font-bold ${getScoreColor(crossword.myBestScore)}`}>
                          {crossword.myBestScore}%
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <ClockIcon className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-gray-600">Última vez jugado</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{crossword.lastPlayed}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => router.push(`/game/${crossword.id}`)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  <PlayIcon className="w-6 h-6" />
                  <span>{crossword.lastPlayed ? 'Jugar de nuevo' : 'Comenzar crucigrama'}</span>
                </button>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Objetivos de Aprendizaje</h2>
              <div className="space-y-3">
                {crossword.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{objective}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics Covered */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Temas Cubiertos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crossword.topics.map((topic, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <LightBulbIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 font-medium">{topic}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Creado por</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{crossword.author}</p>
                  <p className="text-sm text-gray-600">Profesor de {crossword.subject}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reseñas</h3>
              <div className="space-y-4">
                {crossword.reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{review.user}</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Crosswords */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crucigramas Relacionados</h3>
              <div className="space-y-3">
                {crossword.relatedCrosswords.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => router.push(`/student/library/${related.id}`)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="text-2xl">{related.thumbnail}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{related.title}</p>
                      <p className="text-sm text-gray-600">{related.subject}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{related.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
