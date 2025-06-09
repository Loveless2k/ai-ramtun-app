'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  TrophyIcon,
  ChartBarIcon,
  UserIcon,
  PlayIcon,
  StarIcon,
  ClockIcon,
  BookOpenIcon,
  FireIcon,
  CheckCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

interface StudentStats {
  totalGames: number
  averageScore: number
  totalTime: string
  completedCrosswords: number
  currentStreak: number
  bestScore: number
}

interface RecentGame {
  id: string
  title: string
  subject: string
  score: number
  completedAt: string
  timeSpent: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - En producción vendría de la API
  const studentStats: StudentStats = {
    totalGames: 24,
    averageScore: 87,
    totalTime: '4h 32m',
    completedCrosswords: 18,
    currentStreak: 5,
    bestScore: 98
  }

  const recentGames: RecentGame[] = [
    {
      id: '1',
      title: 'Sistema Solar',
      subject: 'Ciencias',
      score: 95,
      completedAt: 'Hace 2 horas',
      timeSpent: '8m 45s'
    },
    {
      id: '2',
      title: 'Revolución Francesa',
      subject: 'Historia',
      score: 82,
      completedAt: 'Ayer',
      timeSpent: '12m 30s'
    },
    {
      id: '3',
      title: 'Fracciones Básicas',
      subject: 'Matemáticas',
      score: 91,
      completedAt: 'Hace 2 días',
      timeSpent: '9m 15s'
    }
  ]

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primera Victoria',
      description: 'Completa tu primer crucigrama',
      icon: '🏆',
      unlocked: true,
      unlockedAt: 'Hace 1 semana'
    },
    {
      id: '2',
      title: 'Racha de Fuego',
      description: 'Completa 5 crucigramas seguidos',
      icon: '🔥',
      unlocked: true,
      unlockedAt: 'Hace 2 días'
    },
    {
      id: '3',
      title: 'Perfeccionista',
      description: 'Obtén 100% en un crucigrama',
      icon: '⭐',
      unlocked: false
    },
    {
      id: '4',
      title: 'Explorador',
      description: 'Juega crucigramas de 3 materias diferentes',
      icon: '🗺️',
      unlocked: true,
      unlockedAt: 'Hace 3 días'
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: HomeIcon },
    { id: 'games', name: 'Mis Juegos', icon: PlayIcon },
    { id: 'achievements', name: 'Logros', icon: TrophyIcon },
    { id: 'profile', name: 'Perfil', icon: UserIcon }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">¡Hola, Estudiante!</h2>
            <p className="text-blue-100">
              Tienes una racha de {studentStats.currentStreak} días. ¡Sigue así!
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm text-blue-100">Nivel: Intermedio</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Juegos</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.totalGames}</p>
            </div>
            <PlayIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.averageScore}%</p>
            </div>
            <StarIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Racha</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.currentStreak}</p>
            </div>
            <FireIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mejor</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.bestScore}%</p>
            </div>
            <TrophyIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Juegos Recientes</h3>
        <div className="space-y-3">
          {recentGames.map((game) => (
            <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{game.title}</p>
                  <p className="text-sm text-gray-600">{game.subject} • {game.completedAt}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">{game.score}%</p>
                <p className="text-sm text-gray-600">{game.timeSpent}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => window.location.href = '/student'}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left"
        >
          <PlayIcon className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Jugar Ahora</h3>
          <p className="text-indigo-100">Explora crucigramas disponibles</p>
        </button>
        <button
          onClick={() => router.push('/student/progress')}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left"
        >
          <ChartBarIcon className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Ver Progreso</h3>
          <p className="text-green-100">Análisis detallado de rendimiento</p>
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left"
        >
          <TrophyIcon className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Ver Logros</h3>
          <p className="text-yellow-100">Descubre tus achievements</p>
        </button>
      </div>
    </div>
  )

  const renderGames = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mis Juegos</h2>
        <button
          onClick={() => window.location.href = '/student'}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Explorar Más
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial Completo</h3>
        <div className="space-y-3">
          {recentGames.map((game) => (
            <div key={game.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{game.title}</p>
                  <p className="text-sm text-gray-600">{game.subject}</p>
                  <p className="text-xs text-gray-500">{game.completedAt}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-lg text-gray-900">{game.score}%</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4" />
                  <span>{game.timeSpent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Estudiante</h1>
                <p className="text-gray-600">Tu centro de control personal</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">¡Bienvenido!</p>
              <p className="text-lg font-semibold text-indigo-600">Estudiante Demo</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => router.push('/student')}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2"
              >
                <BookOpenIcon className="w-4 h-4" />
                <span>Crucigramas</span>
              </button>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="border-indigo-500 text-indigo-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => router.push('/student/progress')}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Progreso</span>
              </button>
              <button
                onClick={() => router.push('/student/settings')}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span>Configuración</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'games' && renderGames()}
              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Logros</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          achievement.unlocked
                            ? 'bg-white border-green-200 shadow-lg'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                              {achievement.title}
                            </h3>
                            <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                              {achievement.description}
                            </p>
                            {achievement.unlocked && achievement.unlockedAt && (
                              <p className="text-xs text-green-600 mt-2">
                                Desbloqueado {achievement.unlockedAt}
                              </p>
                            )}
                          </div>
                          {achievement.unlocked && (
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
                  <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuración de Perfil</h3>
                  <p className="text-gray-600">Personalización y configuración próximamente</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
