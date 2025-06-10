'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  CalendarDaysIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  StarIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  LockClosedIcon,
  GiftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../../lib/auth'
import { DailyChallenge, generateDailyChallenges } from '../../../lib/gamification'

export default function ChallengesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [challenges, setChallenges] = useState<DailyChallenge[]>([])
  const [weeklyChallenge, setWeeklyChallenge] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [playerLevel, setPlayerLevel] = useState(6)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const dailyChallenges = generateDailyChallenges()
      
      // Simular progreso en algunos desafíos
      dailyChallenges[0].progress = 1 // 1/3 juegos completados
      dailyChallenges[1].progress = 0 // 0/2 puntuaciones altas
      dailyChallenges[2].progress = 0 // 0/1 juego rápido

      setChallenges(dailyChallenges)
      
      // Desafío semanal mock
      setWeeklyChallenge({
        id: 'weekly_master',
        title: 'Maestro de la Semana',
        description: 'Completa 15 crucigramas esta semana',
        icon: '👑',
        target: 15,
        progress: 8,
        reward: {
          points: 500,
          powerUps: ['double_xp', 'score_boost'],
          achievements: ['weekly_champion']
        },
        expiresAt: getEndOfWeek(),
        type: 'games',
        difficulty: 'epic'
      })
      
      setIsLoading(false)
    }, 1000)
  }, [])

  function getEndOfWeek() {
    const now = new Date()
    const endOfWeek = new Date(now)
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()))
    endOfWeek.setHours(23, 59, 59, 999)
    return endOfWeek.toISOString()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'games': return <PlayIcon className="w-6 h-6" />
      case 'score': return <TrophyIcon className="w-6 h-6" />
      case 'time': return <BoltIcon className="w-6 h-6" />
      case 'streak': return <FireIcon className="w-6 h-6" />
      default: return <StarIcon className="w-6 h-6" />
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expirado'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    
    return `${hours}h ${minutes}m`
  }

  const isUnlocked = (challenge: DailyChallenge) => {
    // Los desafíos se desbloquean según el nivel del jugador
    const requiredLevels = {
      'easy': 1,
      'medium': 3,
      'hard': 5,
      'epic': 7
    }
    return playerLevel >= requiredLevels[challenge.difficulty]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando desafíos...</p>
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
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CalendarDaysIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Desafíos Diarios</h1>
                <p className="text-gray-600">Completa desafíos para ganar recompensas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tu nivel actual</p>
              <p className="text-2xl font-bold text-indigo-600">Nivel {playerLevel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weekly Challenge */}
        {weeklyChallenge && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 Desafío Semanal</h2>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{weeklyChallenge.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">{weeklyChallenge.title}</h3>
                    <p className="text-purple-100">{weeklyChallenge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{weeklyChallenge.progress}/{weeklyChallenge.target}</div>
                  <div className="text-sm text-purple-100">Progreso</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-purple-400 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-300"
                    style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.target) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Rewards */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <StarIcon className="w-5 h-5" />
                    <span className="font-semibold">{weeklyChallenge.reward.points} puntos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GiftIcon className="w-5 h-5" />
                    <span className="font-semibold">{weeklyChallenge.reward.powerUps.length} power-ups</span>
                  </div>
                </div>
                <div className="text-sm text-purple-100">
                  Expira en {getTimeRemaining(weeklyChallenge.expiresAt)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Challenges */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Desafíos de Hoy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => {
              const unlocked = isUnlocked(challenge)
              const completed = challenge.progress >= challenge.target
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                    completed ? 'border-green-200 bg-green-50' :
                    unlocked ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          completed ? 'bg-green-100 text-green-600' :
                          unlocked ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {completed ? <CheckCircleIcon className="w-6 h-6" /> :
                           unlocked ? getChallengeIcon(challenge.type) :
                           <LockClosedIcon className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                            {challenge.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl">{challenge.icon}</div>
                    </div>

                    {/* Description */}
                    <p className={`text-sm mb-4 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {challenge.description}
                    </p>

                    {/* Progress */}
                    {unlocked && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progreso</span>
                          <span>{challenge.progress}/{challenge.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`rounded-full h-2 transition-all duration-300 ${
                              completed ? 'bg-green-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Rewards */}
                    <div className="mb-4">
                      <h4 className={`text-sm font-medium mb-2 ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                        Recompensas:
                      </h4>
                      <div className="space-y-1">
                        <div className={`flex items-center space-x-2 text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          <StarIcon className="w-4 h-4" />
                          <span>{challenge.reward.points} puntos</span>
                        </div>
                        {challenge.reward.powerUps && challenge.reward.powerUps.map((powerUp, i) => (
                          <div key={i} className={`flex items-center space-x-2 text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                            <SparklesIcon className="w-4 h-4" />
                            <span>Power-up: {powerUp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time Remaining */}
                    <div className={`text-xs mb-4 ${unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                      <ClockIcon className="w-4 h-4 inline mr-1" />
                      Expira en {getTimeRemaining(challenge.expiresAt)}
                    </div>

                    {/* Action Button */}
                    {unlocked && !completed && (
                      <button
                        onClick={() => router.push('/student/library')}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Comenzar Desafío
                      </button>
                    )}
                    
                    {completed && (
                      <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center font-medium">
                        ¡Completado! 🎉
                      </div>
                    )}
                    
                    {!unlocked && (
                      <div className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg text-center font-medium">
                        Desbloquea en nivel {challenge.difficulty === 'medium' ? 3 : challenge.difficulty === 'hard' ? 5 : 7}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Challenge Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Consejos para Completar Desafíos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrophyIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Planifica tu tiempo</h4>
                <p className="text-sm text-gray-600">Los desafíos se renuevan cada día a medianoche</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FireIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Mantén tu racha</h4>
                <p className="text-sm text-gray-600">Completa desafíos diarios para mantener tu racha activa</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BoltIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Usa power-ups</h4>
                <p className="text-sm text-gray-600">Los power-ups pueden ayudarte a completar desafíos más difíciles</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <StarIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Sube de nivel</h4>
                <p className="text-sm text-gray-600">Niveles más altos desbloquean desafíos más difíciles y mejores recompensas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
