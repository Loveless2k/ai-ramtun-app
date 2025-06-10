'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  TrophyIcon,
  FireIcon,
  StarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon,
  SparklesIcon,
  BoltIcon,
  AcademicCapIcon,
  ClockIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../../lib/auth'
import { LeaderboardEntry } from '../../../lib/gamification'

export default function LeaderboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'class'>('global')
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - En producción vendría de la API
  const [leaderboardData, setLeaderboardData] = useState<{
    global: LeaderboardEntry[]
    weekly: LeaderboardEntry[]
    class: LeaderboardEntry[]
    myPosition: {
      global: number
      weekly: number
      class: number
    }
  }>({
    global: [
      {
        id: '1',
        name: 'Ana Martínez',
        avatar: '👩‍🎓',
        points: 2850,
        level: 9,
        streak: 12,
        gamesPlayed: 45,
        averageScore: 94,
        rank: 1,
        change: 0,
        badges: ['🏆', '🔥', '🧠']
      },
      {
        id: '2',
        name: 'Carlos Rodríguez',
        avatar: '👨‍🎓',
        points: 2720,
        level: 8,
        streak: 8,
        gamesPlayed: 42,
        averageScore: 91,
        rank: 2,
        change: 1,
        badges: ['⚡', '🎯']
      },
      {
        id: '3',
        name: 'Sofía González',
        avatar: '👩‍🎓',
        points: 2650,
        level: 8,
        streak: 15,
        gamesPlayed: 38,
        averageScore: 89,
        rank: 3,
        change: -1,
        badges: ['🔥', '📚']
      },
      {
        id: '4',
        name: 'Diego Fernández',
        avatar: '👨‍🎓',
        points: 2480,
        level: 7,
        streak: 6,
        gamesPlayed: 41,
        averageScore: 87,
        rank: 4,
        change: 2,
        badges: ['🎮', '🔬']
      },
      {
        id: '5',
        name: 'Valentina López',
        avatar: '👩‍🎓',
        points: 2350,
        level: 7,
        streak: 9,
        gamesPlayed: 35,
        averageScore: 92,
        rank: 5,
        change: 0,
        badges: ['⭐', '🎯']
      },
      {
        id: 'current',
        name: user?.user_metadata?.name || 'Tú',
        avatar: '🎓',
        points: 1850,
        level: 6,
        streak: 5,
        gamesPlayed: 28,
        averageScore: 85,
        rank: 12,
        change: 3,
        badges: ['🎮', '📈']
      }
    ],
    weekly: [],
    class: [],
    myPosition: {
      global: 12,
      weekly: 8,
      class: 3
    }
  })

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      // Generar datos para weekly y class basados en global
      const weeklyData = leaderboardData.global.map((player, index) => ({
        ...player,
        points: Math.floor(player.points * 0.3),
        rank: index + 1,
        change: Math.floor(Math.random() * 5) - 2
      }))

      const classData = leaderboardData.global.slice(0, 8).map((player, index) => ({
        ...player,
        rank: index + 1,
        change: Math.floor(Math.random() * 3) - 1
      }))

      setLeaderboardData(prev => ({
        ...prev,
        weekly: weeklyData,
        class: classData
      }))
      setIsLoading(false)
    }, 1000)
  }, [])

  const getCurrentData = () => {
    return leaderboardData[activeTab] || []
  }

  const getMyPosition = () => {
    return leaderboardData.myPosition[activeTab] || 0
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <SparklesIcon className="w-6 h-6 text-yellow-500" />
      case 2: return <TrophyIcon className="w-6 h-6 text-gray-400" />
      case 3: return <TrophyIcon className="w-6 h-6 text-orange-500" />
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUpIcon className="w-4 h-4 text-green-500" />
    if (change < 0) return <ChevronDownIcon className="w-4 h-4 text-red-500" />
    return <MinusIcon className="w-4 h-4 text-gray-400" />
  }

  const getLevelTitle = (level: number) => {
    const titles = {
      1: "Novato", 2: "Aprendiz", 3: "Estudiante", 4: "Explorador", 5: "Conocedor",
      6: "Experto", 7: "Maestro", 8: "Sabio", 9: "Genio", 10: "Leyenda"
    }
    return titles[level as keyof typeof titles] || "Desconocido"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clasificaciones...</p>
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
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clasificaciones</h1>
                <p className="text-gray-600">Compite con otros estudiantes</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tu posición actual</p>
              <p className="text-2xl font-bold text-indigo-600">#{getMyPosition()}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'global', name: 'Global', icon: TrophyIcon },
                { id: 'weekly', name: 'Semanal', icon: FireIcon },
                { id: 'class', name: 'Mi Clase', icon: AcademicCapIcon }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Position Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🎓</div>
              <div>
                <h3 className="text-xl font-bold">Tu Posición</h3>
                <p className="text-indigo-100">
                  {user?.user_metadata?.name || 'Estudiante'} • Nivel {leaderboardData.global.find(p => p.id === 'current')?.level}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">#{getMyPosition()}</div>
              <div className="flex items-center space-x-1 text-indigo-100">
                {getChangeIcon(leaderboardData.global.find(p => p.id === 'current')?.change || 0)}
                <span className="text-sm">
                  {Math.abs(leaderboardData.global.find(p => p.id === 'current')?.change || 0)} posiciones
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{leaderboardData.global.find(p => p.id === 'current')?.points}</div>
              <div className="text-sm text-indigo-100">Puntos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{leaderboardData.global.find(p => p.id === 'current')?.streak}</div>
              <div className="text-sm text-indigo-100">Racha</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{leaderboardData.global.find(p => p.id === 'current')?.gamesPlayed}</div>
              <div className="text-sm text-indigo-100">Juegos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{leaderboardData.global.find(p => p.id === 'current')?.averageScore}%</div>
              <div className="text-sm text-indigo-100">Promedio</div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">🏆 Podio de Campeones</h2>
          <div className="flex justify-center items-end space-x-4">
            {getCurrentData().slice(0, 3).map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 text-center ${
                  index === 0 ? 'border-yellow-300 transform scale-110' :
                  index === 1 ? 'border-gray-300' :
                  'border-orange-300'
                } ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
                style={{ 
                  height: index === 0 ? '200px' : index === 1 ? '180px' : '160px',
                  minWidth: '160px'
                }}
              >
                <div className="mb-3">
                  {getRankIcon(player.rank)}
                </div>
                <div className="text-3xl mb-2">{player.avatar}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{player.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{getLevelTitle(player.level)}</p>
                <div className="text-lg font-bold text-indigo-600">{player.points}</div>
                <div className="text-xs text-gray-500">puntos</div>
                <div className="flex justify-center space-x-1 mt-2">
                  {player.badges.slice(0, 3).map((badge, i) => (
                    <span key={i} className="text-sm">{badge}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Clasificación Completa - {activeTab === 'global' ? 'Global' : activeTab === 'weekly' ? 'Esta Semana' : 'Mi Clase'}
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {getCurrentData().map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  player.id === 'current' ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(player.rank)}
                      {getChangeIcon(player.change)}
                    </div>
                    
                    <div className="text-3xl">{player.avatar}</div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        {player.id === 'current' && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                            Tú
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Nivel {player.level} • {getLevelTitle(player.level)}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        {player.badges.map((badge, i) => (
                          <span key={i} className="text-sm">{badge}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{player.points}</div>
                      <div className="text-xs text-gray-500">Puntos</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <FireIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-lg font-bold text-gray-900">{player.streak}</span>
                      </div>
                      <div className="text-xs text-gray-500">Racha</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <PlayIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-lg font-bold text-gray-900">{player.gamesPlayed}</span>
                      </div>
                      <div className="text-xs text-gray-500">Juegos</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-lg font-bold text-gray-900">{player.averageScore}%</span>
                      </div>
                      <div className="text-xs text-gray-500">Promedio</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">¡Sigue Subiendo!</h3>
            <p className="text-green-100 mb-6">
              Juega más crucigramas para ganar puntos y subir en las clasificaciones
            </p>
            <button
              onClick={() => router.push('/student/library')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explorar Crucigramas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
