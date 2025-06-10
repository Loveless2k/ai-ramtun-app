'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  HeartIcon,
  PlayIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useAuth } from '../../../lib/auth'
import StudentNavigation from '../../../components/StudentNavigation'

interface Crossword {
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
}

export default function StudentLibrary() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('Todas')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas')
  const [selectedGrade, setSelectedGrade] = useState('Todos')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('recommended')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - En producción vendría de la API
  const [crosswords, setCrosswords] = useState<Crossword[]>([
    {
      id: '1',
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
      description: 'Explora los planetas, lunas y otros cuerpos celestes de nuestro sistema solar.',
      tags: ['planetas', 'espacio', 'astronomía'],
      createdAt: '2024-01-15',
      lastPlayed: '2024-01-20',
      myBestScore: 95,
      completionRate: 89,
      isRecommended: true,
      isNew: false,
      isTrending: true
    },
    {
      id: '2',
      title: 'Revolución Francesa',
      subject: 'Historia',
      grade: '8° Básico',
      difficulty: 'Difícil',
      questions: 18,
      estimatedTime: '25-30 min',
      plays: 156,
      avgScore: 76,
      rating: 4.6,
      isPublic: true,
      isFavorite: true,
      thumbnail: '🏛️',
      description: 'Descubre los eventos, personajes y consecuencias de la Revolución Francesa.',
      tags: ['revolución', 'francia', 'historia moderna'],
      createdAt: '2024-01-12',
      lastPlayed: '2024-01-18',
      myBestScore: 82,
      completionRate: 72,
      isRecommended: true,
      isNew: false,
      isTrending: false
    },
    {
      id: '3',
      title: 'Fracciones Básicas',
      subject: 'Matemáticas',
      grade: '5° Básico',
      difficulty: 'Fácil',
      questions: 10,
      estimatedTime: '10-15 min',
      plays: 445,
      avgScore: 92,
      rating: 4.9,
      isPublic: true,
      isFavorite: false,
      thumbnail: '🔢',
      description: 'Aprende y practica conceptos fundamentales de fracciones.',
      tags: ['fracciones', 'números', 'matemática básica'],
      createdAt: '2024-01-10',
      completionRate: 94,
      isRecommended: false,
      isNew: false,
      isTrending: true
    },
    {
      id: '4',
      title: 'Animales Vertebrados',
      subject: 'Ciencias',
      grade: '4° Básico',
      difficulty: 'Fácil',
      questions: 8,
      estimatedTime: '8-12 min',
      plays: 312,
      avgScore: 89,
      rating: 4.7,
      isPublic: true,
      isFavorite: false,
      thumbnail: '🦎',
      description: 'Conoce las características de los diferentes grupos de animales vertebrados.',
      tags: ['animales', 'vertebrados', 'biología'],
      createdAt: '2024-01-08',
      completionRate: 91,
      isRecommended: true,
      isNew: false,
      isTrending: false
    },
    {
      id: '5',
      title: 'Geografía de Chile',
      subject: 'Historia',
      grade: '7° Básico',
      difficulty: 'Medio',
      questions: 15,
      estimatedTime: '18-22 min',
      plays: 198,
      avgScore: 84,
      rating: 4.5,
      isPublic: true,
      isFavorite: true,
      thumbnail: '🗺️',
      description: 'Explora las regiones, ciudades y características geográficas de Chile.',
      tags: ['chile', 'geografía', 'regiones'],
      createdAt: '2024-01-05',
      lastPlayed: '2024-01-16',
      myBestScore: 88,
      completionRate: 78,
      isRecommended: false,
      isNew: false,
      isTrending: false
    },
    {
      id: '6',
      title: 'Tabla Periódica',
      subject: 'Ciencias',
      grade: '1° Medio',
      difficulty: 'Difícil',
      questions: 20,
      estimatedTime: '30-35 min',
      plays: 89,
      avgScore: 71,
      rating: 4.4,
      isPublic: true,
      isFavorite: false,
      thumbnail: '⚛️',
      description: 'Domina los elementos químicos y sus propiedades fundamentales.',
      tags: ['química', 'elementos', 'ciencia'],
      createdAt: '2024-01-03',
      completionRate: 65,
      isRecommended: false,
      isNew: true,
      isTrending: false
    }
  ])

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Cargar favoritos del usuario
    const savedFavorites = localStorage.getItem('ramtun_favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Filtros y búsqueda
  const subjects = ['Todas', ...Array.from(new Set(crosswords.map(c => c.subject)))]
  const difficulties = ['Todas', 'Fácil', 'Medio', 'Difícil']
  const grades = ['Todos', ...Array.from(new Set(crosswords.map(c => c.grade))).sort()]

  const filteredCrosswords = crosswords.filter(crossword => {
    const matchesSearch = crossword.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crossword.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crossword.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = selectedSubject === 'Todas' || crossword.subject === selectedSubject
    const matchesDifficulty = selectedDifficulty === 'Todas' || crossword.difficulty === selectedDifficulty
    const matchesGrade = selectedGrade === 'Todos' || crossword.grade === selectedGrade

    return matchesSearch && matchesSubject && matchesDifficulty && matchesGrade
  })

  // Ordenamiento
  const sortedCrosswords = [...filteredCrosswords].sort((a, b) => {
    switch (sortBy) {
      case 'recommended':
        return (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0) || b.rating - a.rating
      case 'popular':
        return b.plays - a.plays
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'difficulty':
        const difficultyOrder = { 'Fácil': 1, 'Medio': 2, 'Difícil': 3 }
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      default:
        return 0
    }
  })

  const toggleFavorite = (crosswordId: string) => {
    const newFavorites = favorites.includes(crosswordId)
      ? favorites.filter(id => id !== crosswordId)
      : [...favorites, crosswordId]
    
    setFavorites(newFavorites)
    localStorage.setItem('ramtun_favorites', JSON.stringify(newFavorites))
    
    // Actualizar estado local del crucigrama
    setCrosswords(prev => prev.map(c => 
      c.id === crosswordId ? { ...c, isFavorite: !c.isFavorite } : c
    ))
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
          <p className="text-gray-600">Cargando biblioteca...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StudentNavigation
        title="Biblioteca de Crucigramas"
        subtitle={`Descubre y juega crucigramas educativos • ${sortedCrosswords.length} disponibles`}
        icon={<BookOpenIcon className="w-6 h-6 text-indigo-600" />}
        showBackButton={true}
        backUrl="/student/dashboard"
        backLabel="Volver al Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar crucigramas por título, materia o tema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              />
            </div>

            {/* View Mode and Filters Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Filtros</span>
              </button>

              <div className="flex bg-white border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  >
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  >
                    <option value="recommended">Recomendados</option>
                    <option value="popular">Más populares</option>
                    <option value="rating">Mejor valorados</option>
                    <option value="newest">Más recientes</option>
                    <option value="difficulty">Por dificultad</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {sortedCrosswords.length} crucigramas encontrados
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSubject('Todas')
                    setSelectedDifficulty('Todas')
                    setSelectedGrade('Todos')
                    setSortBy('recommended')
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{crosswords.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <HeartSolidIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favoritos</p>
                <p className="text-xl font-bold text-gray-900">{favorites.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FireIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Trending</p>
                <p className="text-xl font-bold text-gray-900">{crosswords.filter(c => c.isTrending).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-xl font-bold text-gray-900">{crosswords.filter(c => c.lastPlayed).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Crosswords Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCrosswords.map((crossword) => (
              <motion.div
                key={crossword.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{crossword.thumbnail}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{crossword.title}</h3>
                          {crossword.isNew && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              Nuevo
                            </span>
                          )}
                          {crossword.isTrending && (
                            <FireIcon className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{crossword.subject} • {crossword.grade}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(crossword.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {favorites.includes(crossword.id) ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{crossword.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {crossword.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{crossword.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">{crossword.plays} jugadas</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <ClockIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold text-gray-900">{crossword.estimatedTime}</span>
                      </div>
                      <p className="text-xs text-gray-600">{crossword.questions} preguntas</p>
                    </div>
                  </div>

                  {/* Difficulty and Score */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(crossword.difficulty)}`}>
                      {crossword.difficulty}
                    </span>
                    {crossword.myBestScore && (
                      <div className="flex items-center space-x-1">
                        <TrophyIcon className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm font-semibold ${getScoreColor(crossword.myBestScore)}`}>
                          {crossword.myBestScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Tasa de completación</span>
                      <span>{crossword.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${crossword.completionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => router.push(`/game/${crossword.id}`)}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <PlayIcon className="w-5 h-5" />
                    <span>{crossword.lastPlayed ? 'Jugar de nuevo' : 'Jugar ahora'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {sortedCrosswords.map((crossword) => (
                <motion.div
                  key={crossword.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-3xl">{crossword.thumbnail}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{crossword.title}</h3>
                          {crossword.isNew && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              Nuevo
                            </span>
                          )}
                          {crossword.isTrending && (
                            <FireIcon className="w-4 h-4 text-orange-500" />
                          )}
                          {crossword.isRecommended && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              Recomendado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{crossword.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{crossword.subject} • {crossword.grade}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(crossword.difficulty)}`}>
                            {crossword.difficulty}
                          </span>
                          <span>{crossword.questions} preguntas</span>
                          <span>{crossword.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Stats */}
                      <div className="text-center">
                        <div className="flex items-center space-x-1 mb-1">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-gray-900">{crossword.rating}</span>
                        </div>
                        <p className="text-xs text-gray-600">{crossword.plays} jugadas</p>
                      </div>

                      {crossword.myBestScore && (
                        <div className="text-center">
                          <div className="flex items-center space-x-1 mb-1">
                            <TrophyIcon className="w-4 h-4 text-yellow-500" />
                            <span className={`text-sm font-semibold ${getScoreColor(crossword.myBestScore)}`}>
                              {crossword.myBestScore}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">Mi mejor</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(crossword.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {favorites.includes(crossword.id) ? (
                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/game/${crossword.id}`)}
                          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center space-x-2"
                        >
                          <PlayIcon className="w-4 h-4" />
                          <span>Jugar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedCrosswords.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpenIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron crucigramas</h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar los filtros de búsqueda o explora otras categorías
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedSubject('Todas')
                setSelectedDifficulty('Todas')
                setSelectedGrade('Todos')
                setSortBy('recommended')
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
