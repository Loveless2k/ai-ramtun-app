'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  TrophyIcon,
  UserIcon,
  PlayIcon,
  StarIcon,
  ClockIcon,
  BookOpenIcon,
  FireIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  XCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../../lib/auth'

interface StudentStats {
  totalGames: number
  averageScore: number
  totalTime: string
  completedCrosswords: number
  currentStreak: number
  bestScore: number
  weeklyGames: number
  monthlyGames: number
  favoriteSubject: string
  totalPoints: number
  level: number
  nextLevelPoints: number
}

interface RecentGame {
  id: string
  title: string
  subject: string
  score: number
  completedAt: string
  timeSpent: string
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  questionsCorrect: number
  totalQuestions: number
  hintsUsed: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  category: 'games' | 'score' | 'streak' | 'time' | 'subject'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface WeeklyProgress {
  day: string
  games: number
  score: number
  time: number
}

interface SubjectProgress {
  subject: string
  gamesPlayed: number
  averageScore: number
  bestScore: number
  totalTime: string
  improvement: number
}

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const { user } = useAuth()

  // Mock data - En producción vendría de la API
  const studentStats: StudentStats = {
    totalGames: 24,
    averageScore: 87,
    totalTime: '4h 32m',
    completedCrosswords: 18,
    currentStreak: 5,
    bestScore: 98,
    weeklyGames: 7,
    monthlyGames: 24,
    favoriteSubject: 'Ciencias',
    totalPoints: 2450,
    level: 8,
    nextLevelPoints: 2800
  }

  const recentGames: RecentGame[] = [
    {
      id: '1',
      title: 'Sistema Solar',
      subject: 'Ciencias',
      score: 95,
      completedAt: 'Hace 2 horas',
      timeSpent: '8m 45s',
      difficulty: 'Medio',
      questionsCorrect: 19,
      totalQuestions: 20,
      hintsUsed: 2
    },
    {
      id: '2',
      title: 'Revolución Francesa',
      subject: 'Historia',
      score: 82,
      completedAt: 'Ayer',
      timeSpent: '12m 30s',
      difficulty: 'Difícil',
      questionsCorrect: 14,
      totalQuestions: 17,
      hintsUsed: 5
    },
    {
      id: '3',
      title: 'Fracciones Básicas',
      subject: 'Matemáticas',
      score: 91,
      completedAt: 'Hace 2 días',
      timeSpent: '9m 15s',
      difficulty: 'Fácil',
      questionsCorrect: 10,
      totalQuestions: 11,
      hintsUsed: 1
    },
    {
      id: '4',
      title: 'Geografía de Chile',
      subject: 'Historia',
      score: 88,
      completedAt: 'Hace 3 días',
      timeSpent: '11m 20s',
      difficulty: 'Medio',
      questionsCorrect: 15,
      totalQuestions: 17,
      hintsUsed: 3
    },
    {
      id: '5',
      title: 'Animales Vertebrados',
      subject: 'Ciencias',
      score: 76,
      completedAt: 'Hace 4 días',
      timeSpent: '15m 45s',
      difficulty: 'Medio',
      questionsCorrect: 13,
      totalQuestions: 17,
      hintsUsed: 6
    }
  ]

  // Datos de progreso semanal
  const weeklyProgress: WeeklyProgress[] = [
    { day: 'Lun', games: 2, score: 85, time: 18 },
    { day: 'Mar', games: 1, score: 92, time: 12 },
    { day: 'Mié', games: 3, score: 78, time: 35 },
    { day: 'Jue', games: 1, score: 95, time: 9 },
    { day: 'Vie', games: 2, score: 88, time: 22 },
    { day: 'Sáb', games: 0, score: 0, time: 0 },
    { day: 'Dom', games: 1, score: 91, time: 11 }
  ]

  // Progreso por materias
  const subjectProgress: SubjectProgress[] = [
    {
      subject: 'Ciencias',
      gamesPlayed: 8,
      averageScore: 89,
      bestScore: 98,
      totalTime: '1h 45m',
      improvement: 12
    },
    {
      subject: 'Historia',
      gamesPlayed: 6,
      averageScore: 84,
      bestScore: 95,
      totalTime: '1h 20m',
      improvement: 8
    },
    {
      subject: 'Matemáticas',
      gamesPlayed: 5,
      averageScore: 91,
      bestScore: 96,
      totalTime: '58m',
      improvement: 15
    },
    {
      subject: 'Lenguaje',
      gamesPlayed: 3,
      averageScore: 82,
      bestScore: 87,
      totalTime: '42m',
      improvement: 5
    },
    {
      subject: 'Inglés',
      gamesPlayed: 2,
      averageScore: 78,
      bestScore: 85,
      totalTime: '28m',
      improvement: -3
    }
  ]

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primera Victoria',
      description: 'Completa tu primer crucigrama',
      icon: '🏆',
      unlocked: true,
      unlockedAt: 'Hace 1 semana',
      category: 'games',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Racha de Fuego',
      description: 'Completa 5 crucigramas seguidos',
      icon: '🔥',
      unlocked: true,
      unlockedAt: 'Hace 2 días',
      category: 'streak',
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Perfeccionista',
      description: 'Obtén 100% en un crucigrama',
      icon: '⭐',
      unlocked: false,
      progress: 98,
      maxProgress: 100,
      category: 'score',
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Explorador',
      description: 'Juega crucigramas de 3 materias diferentes',
      icon: '🗺️',
      unlocked: true,
      unlockedAt: 'Hace 3 días',
      category: 'subject',
      rarity: 'common'
    },
    {
      id: '5',
      title: 'Velocista',
      description: 'Completa un crucigrama en menos de 5 minutos',
      icon: '⚡',
      unlocked: false,
      progress: 6,
      maxProgress: 5,
      category: 'time',
      rarity: 'rare'
    },
    {
      id: '6',
      title: 'Científico',
      description: 'Completa 10 crucigramas de Ciencias',
      icon: '🔬',
      unlocked: false,
      progress: 8,
      maxProgress: 10,
      category: 'subject',
      rarity: 'rare'
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
            <h2 className="text-2xl font-bold mb-2">¡Hola, {user?.user_metadata?.name || 'Estudiante'}!</h2>
            <p className="text-blue-100">
              Tienes una racha de {studentStats.currentStreak} días. ¡Sigue así!
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-300">⭐</span>
                <span className="text-sm">{studentStats.totalPoints} puntos</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-green-300">📊</span>
                <span className="text-sm">Nivel {studentStats.level}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm text-blue-100">Materia favorita:</p>
            <p className="text-lg font-semibold">{studentStats.favoriteSubject}</p>
          </div>
        </div>

        {/* Progress to next level */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-100 mb-1">
            <span>Progreso al Nivel {studentStats.level + 1}</span>
            <span>{studentStats.totalPoints}/{studentStats.nextLevelPoints}</span>
          </div>
          <div className="w-full bg-blue-400 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(studentStats.totalPoints / studentStats.nextLevelPoints) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-600 mb-1">Juegos</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.totalGames}</p>
            </div>
            <div className="flex items-center justify-center">
              <PlayIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-600 mb-1">Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.averageScore}%</p>
            </div>
            <div className="flex items-center justify-center">
              <StarIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-600 mb-1">Racha</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.currentStreak}</p>
            </div>
            <div className="flex items-center justify-center">
              <FireIcon className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-600 mb-1">Mejor</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.bestScore}%</p>
            </div>
            <div className="flex items-center justify-center">
              <TrophyIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso Semanal</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-600 mb-2">{day.day}</div>
              <div
                className="bg-indigo-100 rounded-lg mx-auto transition-all duration-300 hover:bg-indigo-200"
                style={{
                  height: `${Math.max(20, (day.games / Math.max(...weeklyProgress.map(d => d.games))) * 60)}px`,
                  width: '100%'
                }}
              >
                <div className="flex items-end justify-center h-full">
                  <span className="text-xs font-medium text-indigo-700 pb-1">
                    {day.games > 0 ? day.games : ''}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {day.games > 0 ? `${day.score}%` : '-'}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Esta semana: {weeklyProgress.reduce((sum, day) => sum + day.games, 0)} juegos</span>
          <span>Promedio: {Math.round(weeklyProgress.filter(d => d.games > 0).reduce((sum, day) => sum + day.score, 0) / weeklyProgress.filter(d => d.games > 0).length)}%</span>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso por Materias</h3>
        <div className="space-y-4">
          {subjectProgress.map((subject, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    subject.improvement > 0
                      ? 'bg-green-100 text-green-800'
                      : subject.improvement < 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Juegos:</span>
                  <div className="font-semibold">{subject.gamesPlayed}</div>
                </div>
                <div>
                  <span className="text-gray-600">Promedio:</span>
                  <div className="font-semibold">{subject.averageScore}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Mejor:</span>
                  <div className="font-semibold">{subject.bestScore}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo:</span>
                  <div className="font-semibold">{subject.totalTime}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${subject.averageScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Games */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Juegos Recientes</h3>
        <div className="space-y-3">
          {recentGames.slice(0, 3).map((game) => (
            <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
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
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    game.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                    game.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{game.timeSpent}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>{game.questionsCorrect}/{game.totalQuestions}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LightBulbIcon className="w-4 h-4" />
                  <span>{game.hintsUsed} pistas</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setActiveTab('games')}
          className="w-full mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Ver historial completo →
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          onClick={() => router.push('/student')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left flex flex-col h-full min-h-[120px]"
        >
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 text-center leading-tight">Jugar Ahora</h3>
          <p className="text-indigo-100 text-center text-xs sm:text-sm flex-grow leading-tight">Explora crucigramas disponibles</p>
        </button>
        <button
          onClick={() => router.push('/student/library')}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left flex flex-col h-full min-h-[120px]"
        >
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 text-center leading-tight">Biblioteca</h3>
          <p className="text-blue-100 text-center text-xs sm:text-sm flex-grow leading-tight">Descubre nuevos crucigramas</p>
        </button>
        <button
          onClick={() => router.push('/student/leaderboard')}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left flex flex-col h-full min-h-[120px]"
        >
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <TrophyIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 text-center leading-tight">
            <span className="hidden sm:inline">Clasificaciones</span>
            <span className="sm:hidden">Ranking</span>
          </h3>
          <p className="text-yellow-100 text-center text-xs sm:text-sm flex-grow leading-tight">Compite con otros estudiantes</p>
        </button>
        <button
          onClick={() => router.push('/student/challenges')}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left flex flex-col h-full min-h-[120px]"
        >
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 text-center leading-tight">Desafíos</h3>
          <p className="text-green-100 text-center text-xs sm:text-sm flex-grow leading-tight">Completa retos diarios</p>
        </button>
        <button
          onClick={() => router.push('/student/powerups')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left flex flex-col h-full min-h-[120px]"
        >
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <LightBulbIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 text-center leading-tight">Power-ups</h3>
          <p className="text-purple-100 text-center text-xs sm:text-sm flex-grow leading-tight">Mejora tu experiencia</p>
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left flex flex-col h-full min-h-[120px]"
        >
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <FireIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 text-center leading-tight">Logros</h3>
          <p className="text-red-100 text-center text-xs sm:text-sm flex-grow leading-tight">Descubre tus achievements</p>
        </button>
      </div>
    </div>
  )

  const renderGames = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mis Juegos</h2>
        <button
          onClick={() => router.push('/student')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Explorar Más
        </button>
      </div>

      {/* Game Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Esta semana</p>
              <p className="text-xl font-bold text-gray-900">{studentStats.weeklyGames}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Este mes</p>
              <p className="text-xl font-bold text-gray-900">{studentStats.monthlyGames}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-xl font-bold text-gray-900">{studentStats.completedCrosswords}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial Completo</h3>
        <div className="space-y-3">
          {recentGames.map((game) => (
            <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
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
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    game.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                    game.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{game.timeSpent}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>{game.questionsCorrect}/{game.totalQuestions}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LightBulbIcon className="w-4 h-4" />
                  <span>{game.hintsUsed} pistas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4" />
                  <span>{Math.round((game.questionsCorrect / game.totalQuestions) * 100)}% precisión</span>
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
            <nav className="-mb-px flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto">
              <button
                onClick={() => router.push('/student')}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              >
                <PlayIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Jugar</span>
              </button>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="border-indigo-500 text-indigo-600 whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => router.push('/student/library')}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              >
                <BookOpenIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Biblioteca</span>
              </button>
              <button
                onClick={() => router.push('/student/leaderboard')}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              >
                <TrophyIcon className="w-4 h-4" />
                <span className="hidden sm:inline lg:inline">Clasificaciones</span>
                <span className="sm:hidden">Ranking</span>
              </button>
              <button
                onClick={() => router.push('/student/challenges')}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Desafíos</span>
              </button>
              <button
                onClick={() => router.push('/student/powerups')}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              >
                <LightBulbIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Power-ups</span>
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
                    className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-overflow-wrap">{tab.name}</span>
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
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Logros</h2>
                    <div className="text-sm text-gray-600">
                      {achievements.filter(a => a.unlocked).length} de {achievements.length} desbloqueados
                    </div>
                  </div>

                  {/* Achievement Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
                      const total = achievements.filter(a => a.rarity === rarity).length
                      const unlocked = achievements.filter(a => a.rarity === rarity && a.unlocked).length
                      return (
                        <div key={rarity} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${
                              rarity === 'common' ? 'text-gray-600' :
                              rarity === 'rare' ? 'text-blue-600' :
                              rarity === 'epic' ? 'text-purple-600' :
                              'text-yellow-600'
                            }`}>
                              {unlocked}/{total}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">{rarity}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

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
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                                {achievement.title}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                achievement.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                                achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                                achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {achievement.rarity}
                              </span>
                            </div>
                            <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                              {achievement.description}
                            </p>

                            {/* Progress bar for locked achievements */}
                            {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Progreso</span>
                                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                                    style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {achievement.unlocked && achievement.unlockedAt && (
                              <p className="text-xs text-green-600 mt-2">
                                Desbloqueado {achievement.unlockedAt}
                              </p>
                            )}
                          </div>
                          {achievement.unlocked ? (
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircleIcon className="w-6 h-6 text-gray-300" />
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
