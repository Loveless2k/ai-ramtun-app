'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PuzzlePieceIcon,
  UserGroupIcon,
  CheckCircleIcon,
  SparklesIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChartBarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  PlayIcon,
  ShareIcon,
  UsersIcon,
  DocumentTextIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline'
import {
  ChartBarIcon as ChartBarSolid,
  BookOpenIcon as BookOpenSolid,
  AcademicCapIcon as AcademicCapSolid
} from '@heroicons/react/24/solid'
import CrosswordGenerator from '@/components/CrosswordGenerator'
import CrosswordSharingSystem from '@/components/CrosswordSharingSystem'
import StudentProgressTracker from '@/components/StudentProgressTracker'
import TeacherCollaboration from '@/components/TeacherCollaboration'
import CrosswordTemplateLibrary from '@/components/CrosswordTemplateLibrary'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import { useDashboard } from './layout'

// Types
import type { CrosswordStats } from '../../types/crossword'

interface DashboardMetrics {
  totalCrosswords: number
  totalPlays: number
  avgEngagement: number
  activeStudents: number
  thisWeekPlays: number
  thisWeekGrowth: number
  completionRate: number
  averageRating: number
}

interface RecentActivity {
  id: string
  type: 'completion' | 'high_score' | 'new_attempt'
  student: string
  crossword: string
  score?: number
  time: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

// Mock data - En producción vendría de la API
const mockStats: DashboardMetrics = {
  totalCrosswords: 24,
  totalPlays: 347,
  avgEngagement: 89,
  activeStudents: 156,
  thisWeekPlays: 45,
  thisWeekGrowth: 12,
  completionRate: 89,
  averageRating: 4.8
}

const mockRecentCrosswords: CrosswordStats[] = [
  {
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
    status: 'Activo'
  },
  {
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
    status: 'Activo'
  },
  {
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
    status: 'Activo'
  },
  {
    id: '4',
    title: 'Geometría Básica',
    subject: 'Matemáticas',
    grade: '7° Básico',
    difficulty: 'Medio',
    questions: 14,
    plays: 43,
    avgScore: 71,
    avgTime: '15 min',
    createdAt: '2024-01-10',
    lastPlayed: '2024-01-18',
    status: 'Activo'
  },
  {
    id: '5',
    title: 'Guerra del Pacífico',
    subject: 'Historia',
    grade: '8° Básico',
    difficulty: 'Difícil',
    questions: 18,
    plays: 0,
    avgScore: 0,
    avgTime: '0 min',
    createdAt: '2024-01-21',
    lastPlayed: '2024-01-21',
    status: 'Borrador'
  },
  {
    id: '6',
    title: 'Tabla Periódica Antigua',
    subject: 'Ciencias',
    grade: '1° Medio',
    difficulty: 'Medio',
    questions: 12,
    plays: 234,
    avgScore: 76,
    avgTime: '14 min',
    createdAt: '2023-12-15',
    lastPlayed: '2023-12-20',
    status: 'Archivado'
  }
]

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'completion',
    student: 'María González',
    crossword: 'Sistema Solar',
    score: 95,
    time: 'Hace 2 minutos',
    icon: CheckCircleIcon,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: '2',
    type: 'high_score',
    student: 'Carlos Rodríguez',
    crossword: 'Fracciones Básicas',
    score: 100,
    time: 'Hace 15 minutos',
    icon: TrophyIcon,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: '3',
    type: 'new_attempt',
    student: '8 estudiantes',
    crossword: 'Revolución Francesa',
    time: 'Hace 1 hora',
    icon: UserGroupIcon,
    color: 'bg-blue-100 text-blue-600'
  }
]

export default function DashboardPage() {
  const { activeTab, setActiveTab } = useDashboard()
  const [quickTopic, setQuickTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [crosswords, setCrosswords] = useState<CrosswordStats[]>(mockRecentCrosswords)
  const [isLoading, setIsLoading] = useState(true)

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const handleQuickGenerate = async () => {
    if (!quickTopic.trim()) return

    setIsGenerating(true)
    // Simular procesamiento del tema
    setTimeout(() => {
      setIsGenerating(false)
      // Cambiar al tab generator con parámetros preconfigurados
      const params = new URLSearchParams({
        topic: quickTopic.trim(),
        source: 'quick-generator',
        level: 'basica',
        grade: '8',
        difficulty: 'medio'
      })
      // Cambiar al tab generator en lugar de redirigir a página externa
      setActiveTab('generator')
      // Opcional: Guardar parámetros en localStorage para autocompletado
      localStorage.setItem('quickGeneratorParams', params.toString())
    }, 1500)
  }

  // Simplified tabs - main navigation is handled by sidebar
  const tabs = [
    { id: 'overview', name: 'Resumen', icon: ChartBarIcon, iconSolid: ChartBarSolid },
    { id: 'crosswords', name: 'Mis Crucigramas', icon: BookOpenIcon, iconSolid: BookOpenSolid },
    { id: 'sharing', name: 'Compartidos', icon: ShareIcon, iconSolid: ShareIcon }, // 🚀 PHASE 2
    { id: 'progress', name: 'Progreso', icon: UsersIcon, iconSolid: UsersIcon }, // 🚀 PHASE 2
    { id: 'collaboration', name: 'Colaboración', icon: UserGroupIcon, iconSolid: UserGroupIcon }, // 🚀 PHASE 3
    { id: 'templates', name: 'Templates', icon: DocumentTextIcon, iconSolid: DocumentTextIcon }, // 🚀 PHASE 3
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* Secondary Navigation - Only show for overview and related tabs */}
      {['overview', 'crosswords', 'sharing', 'progress', 'collaboration', 'templates'].includes(activeTab) && (
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = activeTab === tab.id ? tab.iconSolid : tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {activeTab === 'overview' && (
            <OverviewTab
              metrics={mockStats}
              crosswords={crosswords}
              recentActivity={mockRecentActivity}
              quickTopic={quickTopic}
              setQuickTopic={setQuickTopic}
              isGenerating={isGenerating}
              handleQuickGenerate={handleQuickGenerate}
            />
          )}
          {activeTab === 'generator' && (
            <GeneratorTab />
          )}
          {activeTab === 'crosswords' && (
            <CrosswordsTab crosswords={crosswords} setCrosswords={setCrosswords} />
          )}
          {activeTab === 'sharing' && (
            <SharingTab />
          )}
          {activeTab === 'progress' && (
            <ProgressTab />
          )}
          {activeTab === 'collaboration' && (
            <CollaborationTab />
          )}
          {activeTab === 'templates' && (
            <TemplatesTab />
          )}
          {activeTab === 'analytics' && (
            <AdvancedAnalyticsTab />
          )}
          {activeTab === 'library' && (
            <LibraryTab />
          )}
        </motion.div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({
  metrics,
  crosswords,
  recentActivity,
  quickTopic,
  setQuickTopic,
  isGenerating,
  handleQuickGenerate
}: {
  metrics: DashboardMetrics
  crosswords: CrosswordStats[]
  recentActivity: RecentActivity[]
  quickTopic: string
  setQuickTopic: (topic: string) => void
  isGenerating: boolean
  handleQuickGenerate: () => void
}) {
  const metricCards = [
    {
      title: 'Total Crucigramas',
      value: metrics.totalCrosswords,
      icon: PuzzlePieceIcon,
      color: 'bg-blue-500',
      change: '+3 este mes'
    },
    {
      title: 'Total Jugadas',
      value: metrics.totalPlays,
      icon: UserGroupIcon,
      color: 'bg-green-500',
      change: `+${metrics.thisWeekGrowth}% esta semana`
    },
    {
      title: 'Engagement Promedio',
      value: `${metrics.avgEngagement}%`,
      icon: TrophyIcon,
      color: 'bg-purple-500',
      change: '+5% vs mes anterior'
    },
    {
      title: 'Estudiantes Activos',
      value: metrics.activeStudents,
      icon: AcademicCapIcon,
      color: 'bg-orange-500',
      change: '+12 nuevos esta semana'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-3">
            ¡Bienvenido de vuelta, Profesor! 👋
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Tienes {metrics.activeStudents} estudiantes activos esperando nuevos desafíos.
            Usa el <strong>Generador Rápido</strong> para crear crucigramas con IA en segundos.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <p className="text-sm text-green-600 mt-1">{metric.change}</p>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions - Streamlined */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Generator */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Generador Rápido</h3>
              <p className="text-sm text-gray-600">Crea un crucigrama con IA en 30 segundos</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema del Crucigrama
              </label>
              <input
                type="text"
                value={quickTopic}
                onChange={(e) => setQuickTopic(e.target.value)}
                placeholder="Ej: Revolución Francesa, Sistema Solar..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
                onKeyPress={(e) => e.key === 'Enter' && handleQuickGenerate()}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleQuickGenerate}
              disabled={!quickTopic.trim() || isGenerating}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all ${
                !quickTopic.trim() || isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <ClockIcon className="w-5 h-5 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Generar con IA
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                <p className="text-sm text-gray-600">Últimas acciones de tus estudiantes</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.student} {activity.type === 'completion' ? 'completó' :
                     activity.type === 'high_score' ? `obtuvo ${activity.score}% en` :
                     'iniciaron'} &quot;{activity.crossword}&quot;
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Crosswords */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crucigramas Más Populares</h3>
        <div className="space-y-4">
          {crosswords.slice(0, 3).map((crossword) => (
            <div key={crossword.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <BookOpenIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{crossword.title}</h4>
                  <p className="text-sm text-gray-600">{crossword.subject} • {crossword.difficulty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{crossword.plays} jugadas</p>
                <p className="text-sm text-gray-600">{crossword.avgScore}% promedio</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Crosswords Tab Component
function CrosswordsTab({ crosswords, setCrosswords }: {
  crosswords: CrosswordStats[],
  setCrosswords: React.Dispatch<React.SetStateAction<CrosswordStats[]>>
}) {
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'score'>('recent')

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este crucigrama?')) {
      setCrosswords(prev => prev.filter(c => c.id !== id))
    }
  }

  const filteredCrosswords = crosswords.filter(crossword => {
    if (filter === 'all') return true
    if (filter === 'active') return crossword.status === 'Activo'
    if (filter === 'draft') return crossword.status === 'Borrador'
    if (filter === 'archived') return crossword.status === 'Archivado'
    return true
  })

  const sortedCrosswords = [...filteredCrosswords].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'popular') return b.plays - a.plays
    if (sortBy === 'score') return b.avgScore - a.avgScore
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Crucigramas</h2>
          <p className="text-gray-600">Gestiona y analiza tus crucigramas creados ({sortedCrosswords.length} total)</p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'active', label: 'Activos' },
            { key: 'draft', label: 'Borradores' },
            { key: 'archived', label: 'Archivados' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as 'all' | 'active' | 'draft' | 'archived')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'score')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="recent">Más recientes</option>
          <option value="popular">Más populares</option>
          <option value="score">Mejor puntuación</option>
        </select>
      </div>

      {/* Crosswords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCrosswords.map((crossword, index) => (
          <motion.div
            key={crossword.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{crossword.title}</h3>
                <p className="text-gray-600 text-sm">{crossword.subject} • {crossword.grade}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                crossword.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                crossword.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {crossword.difficulty}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Jugadas:</span>
                <span className="font-bold text-gray-900">{crossword.plays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Promedio:</span>
                <span className="font-bold text-gray-900">{crossword.avgScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Tiempo promedio:</span>
                <span className="font-bold text-gray-900">{crossword.avgTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Última jugada:</span>
                <span className="font-bold text-gray-900">{new Date(crossword.lastPlayed).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = `/crossword/${crossword.id}`}
                className="flex-1 bg-indigo-50 text-indigo-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center space-x-1 min-h-[36px]"
              >
                <EyeIcon className="w-4 h-4" />
                <span>Ver</span>
              </button>
              <button
                onClick={() => alert('🚧 Editor de Crucigramas en Desarrollo\n\nEsta funcionalidad estará disponible en la próxima versión:\n\n✨ Editor visual drag & drop\n🎨 Personalización de diseño\n📝 Edición de preguntas\n🔧 Ajustes de dificultad\n\n¡Mantente atento a las actualizaciones!')}
                className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1 min-h-[36px]"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDelete(crossword.id)}
                className="bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center min-h-[36px] min-w-[36px]"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedCrosswords.length === 0 && (
        <div className="text-center py-12">
          <PuzzlePieceIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay crucigramas</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' ? 'Aún no has creado ningún crucigrama.' : `No hay crucigramas ${filter === 'active' ? 'activos' : filter === 'draft' ? 'en borrador' : 'archivados'}.`}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('generator')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Crear mi primer crucigrama
          </motion.button>
        </div>
      )}
    </div>
  )
}

// Analytics Tab Component
function AnalyticsTab({ metrics }: { metrics: DashboardMetrics }) {
  // Chart data for future implementation
  // const chartData = [
  //   { name: 'Lun', jugadas: 12, completados: 8 },
  //   { name: 'Mar', jugadas: 19, completados: 15 },
  //   { name: 'Mié', jugadas: 15, completados: 12 },
  //   { name: 'Jue', jugadas: 22, completados: 18 },
  //   { name: 'Vie', jugadas: 28, completados: 24 },
  //   { name: 'Sáb', jugadas: 8, completados: 6 },
  //   { name: 'Dom', jugadas: 5, completados: 4 }
  // ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics y Métricas</h2>
          <p className="text-gray-600">Analiza el rendimiento y engagement de tus estudiantes</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
            Esta semana
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
            Este mes
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Completación</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.completionRate}%</p>
              <p className="text-sm text-green-600 mt-1">+5% vs semana anterior</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-gray-900">11.5 min</p>
              <p className="text-sm text-blue-600 mt-1">-2 min vs semana anterior</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Puntuación Promedio</p>
              <p className="text-3xl font-bold text-gray-900">84%</p>
              <p className="text-sm text-purple-600 mt-1">+3% vs semana anterior</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrophyIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Semanal</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Gráfico de actividad semanal</p>
              <p className="text-sm text-gray-500">Próximamente</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Materia</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Análisis por materia</p>
              <p className="text-sm text-gray-500">Próximamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudiantes Destacados</h3>
        <div className="space-y-4">
          {[
            { name: 'María González', score: 98, crosswords: 12, time: '8 min promedio' },
            { name: 'Carlos Rodríguez', score: 95, crosswords: 15, time: '9 min promedio' },
            { name: 'Ana Martínez', score: 92, crosswords: 10, time: '11 min promedio' }
          ].map((student, index) => (
            <div key={student.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.crosswords} crucigramas completados</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{student.score}%</p>
                <p className="text-sm text-gray-600">{student.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Library Tab Component
function LibraryTab() {
  const { setActiveTab } = useDashboard()
  const subjects = [
    { name: 'Historia', count: 8, icon: BookOpenIcon, color: 'bg-red-100 text-red-600' },
    { name: 'Ciencias', count: 6, icon: AcademicCapIcon, color: 'bg-green-100 text-green-600' },
    { name: 'Matemáticas', count: 5, icon: PuzzlePieceIcon, color: 'bg-blue-100 text-blue-600' },
    { name: 'Lenguaje', count: 3, icon: BookOpenIcon, color: 'bg-purple-100 text-purple-600' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Contenido</h2>
          <p className="text-gray-600">Explora y organiza crucigramas por materia y nivel</p>
        </div>
        <button
          onClick={() => alert('🚧 Biblioteca Completa en Desarrollo\n\nPróximamente disponible:\n\n📚 Biblioteca compartida entre profesores\n🔍 Filtros por materia, nivel y dificultad\n⭐ Sistema de calificaciones y reseñas\n📤 Importar/exportar crucigramas\n🤝 Colaboración entre educadores\n\n¡Mantente atento a las actualizaciones!')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Explorar Biblioteca
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <motion.div
            key={subject.name}
            whileHover={{ scale: 1.05 }}
            onClick={() => alert(`🚧 Biblioteca de ${subject.name} en Desarrollo\n\nPróximamente:\n\n📚 ${subject.count} crucigramas de ${subject.name}\n🔍 Filtros por nivel educativo\n⭐ Calificaciones de otros profesores\n📤 Compartir y colaborar\n\n¡Mantente atento a las actualizaciones!`)}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${subject.color}`}>
                <subject.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{subject.count}</span>
            </div>
            <h3 className="font-semibold text-gray-900">{subject.name}</h3>
            <p className="text-sm text-gray-600">crucigramas disponibles</p>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximamente</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <p className="text-gray-700">Biblioteca compartida entre profesores</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <p className="text-gray-700">Filtros por nivel educativo y dificultad</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <p className="text-gray-700">Sistema de calificaciones y reseñas</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <p className="text-gray-700">Importar/exportar crucigramas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sugerencias IA</h3>
          <div className="space-y-3">
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-indigo-900">Revolución Industrial</p>
                  <p className="text-xs text-indigo-600">Basado en tu historial de Historia</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Cambiar al tab generator con tema preconfigurado
                    const params = new URLSearchParams({
                      topic: 'Revolución Industrial',
                      source: 'ai-suggestion',
                      level: 'media',
                      grade: '1',
                      difficulty: 'medio'
                    })
                    localStorage.setItem('quickGeneratorParams', params.toString())
                    setActiveTab('generator')
                  }}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-indigo-700 transition-colors"
                >
                  Crear
                </motion.button>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-green-900">Ecosistemas</p>
                  <p className="text-xs text-green-600">Popular en Ciencias 6° Básico</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Cambiar al tab generator con tema preconfigurado
                    const params = new URLSearchParams({
                      topic: 'Ecosistemas',
                      source: 'ai-suggestion',
                      level: 'basica',
                      grade: '6',
                      difficulty: 'facil'
                    })
                    localStorage.setItem('quickGeneratorParams', params.toString())
                    setActiveTab('generator')
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors"
                >
                  Crear
                </motion.button>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-blue-900">Álgebra Básica</p>
                  <p className="text-xs text-blue-600">Recomendado para tu nivel</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Cambiar al tab generator con tema preconfigurado
                    const params = new URLSearchParams({
                      topic: 'Álgebra Básica',
                      source: 'ai-suggestion',
                      level: 'media',
                      grade: '1',
                      difficulty: 'medio'
                    })
                    localStorage.setItem('quickGeneratorParams', params.toString())
                    setActiveTab('generator')
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  Crear
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generator Tab Component
function GeneratorTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generador de Crucigramas IA</h2>
          <p className="text-gray-600">Crea crucigramas educativos personalizados con inteligencia artificial</p>
        </div>
      </div>

      {/* Generator Component */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <CrosswordGenerator />
      </div>
    </div>
  )
}

// 🚀 PHASE 2: Sharing Tab Component
function SharingTab() {
  const handleShare = (crosswordId: string, options: any) => {
    console.log('Sharing crossword:', crosswordId, options)
    // Implementation for sharing functionality
  }

  const handleRevoke = (crosswordId: string) => {
    console.log('Revoking access for crossword:', crosswordId)
    // Implementation for revoking access
  }

  return (
    <div className="space-y-6">
      <CrosswordSharingSystem
        crosswords={[]}
        onShare={handleShare}
        onRevoke={handleRevoke}
      />
    </div>
  )
}

// 🚀 PHASE 2: Progress Tab Component
function ProgressTab() {
  return (
    <div className="space-y-6">
      <StudentProgressTracker />
    </div>
  )
}

// 🚀 PHASE 3: Collaboration Tab Component
function CollaborationTab() {
  return (
    <div className="space-y-6">
      <TeacherCollaboration />
    </div>
  )
}

// 🚀 PHASE 3: Templates Tab Component
function TemplatesTab() {
  return (
    <div className="space-y-6">
      <CrosswordTemplateLibrary />
    </div>
  )
}

// 🚀 PHASE 3: Advanced Analytics Tab Component
function AdvancedAnalyticsTab() {
  return (
    <div className="space-y-6">
      <AdvancedAnalytics />
    </div>
  )
}
