'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  StarIcon,
  EyeIcon,
  DocumentChartBarIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  overview: {
    totalCrosswords: number
    totalPlays: number
    averageScore: number
    totalStudents: number
    engagementRate: number
    completionRate: number
  }
  trends: {
    playsThisWeek: number
    playsLastWeek: number
    scoresThisWeek: number
    scoresLastWeek: number
    newStudentsThisWeek: number
  }
  topPerformers: {
    crosswords: Array<{
      id: string
      title: string
      plays: number
      avgScore: number
      completionRate: number
    }>
    students: Array<{
      id: string
      name: string
      totalScore: number
      crosswordsCompleted: number
      averageTime: number
    }>
  }
  subjectPerformance: Array<{
    subject: string
    crosswords: number
    avgScore: number
    totalPlays: number
    engagement: number
  }>
  timeAnalysis: {
    peakHours: Array<{ hour: number; plays: number }>
    weeklyPattern: Array<{ day: string; plays: number }>
    monthlyTrend: Array<{ month: string; plays: number; scores: number }>
  }
  difficultyAnalysis: {
    easy: { plays: number; avgScore: number; completionRate: number }
    medium: { plays: number; avgScore: number; completionRate: number }
    hard: { plays: number; avgScore: number; completionRate: number }
  }
}

export default function AdvancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month')
  const [selectedMetric, setSelectedMetric] = useState<'plays' | 'scores' | 'engagement'>('plays')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  // Mock analytics data
  const mockAnalytics: AnalyticsData = {
    overview: {
      totalCrosswords: 24,
      totalPlays: 1247,
      averageScore: 84.2,
      totalStudents: 156,
      engagementRate: 89.5,
      completionRate: 76.8
    },
    trends: {
      playsThisWeek: 89,
      playsLastWeek: 76,
      scoresThisWeek: 86.4,
      scoresLastWeek: 82.1,
      newStudentsThisWeek: 8
    },
    topPerformers: {
      crosswords: [
        { id: '1', title: 'Sistema Solar', plays: 234, avgScore: 92.1, completionRate: 89.2 },
        { id: '2', title: 'Revolución Francesa', plays: 189, avgScore: 87.5, completionRate: 82.4 },
        { id: '3', title: 'Fracciones Básicas', plays: 156, avgScore: 85.3, completionRate: 78.9 }
      ],
      students: [
        { id: '1', name: 'María González', totalScore: 2847, crosswordsCompleted: 18, averageTime: 12.5 },
        { id: '2', name: 'Carlos Rodríguez', totalScore: 2634, crosswordsCompleted: 16, averageTime: 14.2 },
        { id: '3', name: 'Ana Martínez', totalScore: 2521, crosswordsCompleted: 15, averageTime: 13.8 }
      ]
    },
    subjectPerformance: [
      { subject: 'Ciencias', crosswords: 8, avgScore: 88.4, totalPlays: 456, engagement: 92.1 },
      { subject: 'Historia', crosswords: 6, avgScore: 82.7, totalPlays: 378, engagement: 87.3 },
      { subject: 'Matemáticas', crosswords: 7, avgScore: 79.2, totalPlays: 289, engagement: 84.6 },
      { subject: 'Lenguaje', crosswords: 3, avgScore: 86.9, totalPlays: 124, engagement: 89.8 }
    ],
    timeAnalysis: {
      peakHours: [
        { hour: 10, plays: 89 }, { hour: 14, plays: 156 }, { hour: 16, plays: 234 }, { hour: 20, plays: 67 }
      ],
      weeklyPattern: [
        { day: 'Lun', plays: 45 }, { day: 'Mar', plays: 67 }, { day: 'Mié', plays: 89 },
        { day: 'Jue', plays: 78 }, { day: 'Vie', plays: 56 }, { day: 'Sáb', plays: 23 }, { day: 'Dom', plays: 12 }
      ],
      monthlyTrend: [
        { month: 'Oct', plays: 234, scores: 82.1 }, { month: 'Nov', plays: 289, scores: 84.3 },
        { month: 'Dic', plays: 345, scores: 86.2 }, { month: 'Ene', plays: 379, scores: 84.2 }
      ]
    },
    difficultyAnalysis: {
      easy: { plays: 567, avgScore: 91.2, completionRate: 94.5 },
      medium: { plays: 489, avgScore: 82.7, completionRate: 78.3 },
      hard: { plays: 191, avgScore: 71.4, completionRate: 62.8 }
    }
  }

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData(mockAnalytics)
    }, 1000)
  }, [])

  const calculateTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isNeutral: Math.abs(change) < 1
    }
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const playsTrend = calculateTrend(analyticsData.trends.playsThisWeek, analyticsData.trends.playsLastWeek)
  const scoresTrend = calculateTrend(analyticsData.trends.scoresThisWeek, analyticsData.trends.scoresLastWeek)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Avanzados</h2>
          <p className="text-gray-600">Análisis detallado del rendimiento y engagement de tus crucigramas</p>
        </div>
        <div className="flex space-x-2">
          {['week', 'month', 'quarter'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Trimestre'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jugadas</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalPlays.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {playsTrend.isPositive ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  playsTrend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {playsTrend.value}% vs semana anterior
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Puntuación Promedio</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.averageScore}%</p>
              <div className="flex items-center mt-2">
                {scoresTrend.isPositive ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  scoresTrend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {scoresTrend.value}% vs semana anterior
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Engagement</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.engagementRate}%</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">
                  {analyticsData.trends.newStudentsThisWeek} nuevos estudiantes
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance by Subject */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Materia</h3>
        <div className="space-y-4">
          {analyticsData.subjectPerformance.map((subject) => (
            <div key={subject.subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                  <p className="text-sm text-gray-600">{subject.crosswords} crucigramas</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-900">{subject.totalPlays}</p>
                  <p className="text-gray-600">Jugadas</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{subject.avgScore}%</p>
                  <p className="text-gray-600">Promedio</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{subject.engagement}%</p>
                  <p className="text-gray-600">Engagement</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Crosswords */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crucigramas Más Populares</h3>
          <div className="space-y-3">
            {analyticsData.topPerformers.crosswords.map((crossword, index) => (
              <div key={crossword.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{crossword.title}</h4>
                    <p className="text-sm text-gray-600">{crossword.plays} jugadas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{crossword.avgScore}%</p>
                  <p className="text-sm text-gray-600">promedio</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudiantes Destacados</h3>
          <div className="space-y-3">
            {analyticsData.topPerformers.students.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.crosswordsCompleted} completados</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{student.totalScore}</p>
                  <p className="text-sm text-gray-600">puntos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis por Dificultad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(analyticsData.difficultyAnalysis).map(([difficulty, data]) => (
            <div key={difficulty} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 capitalize">
                  {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {data.plays} jugadas
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Promedio:</span>
                  <span className="font-medium text-gray-900">{data.avgScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completados:</span>
                  <span className="font-medium text-gray-900">{data.completionRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Exportar Reportes</h3>
            <p className="text-gray-600">Descarga reportes detallados para presentaciones o análisis</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => alert('📊 Exportando Reporte PDF\n\n📄 Reporte completo generado\n📈 Incluye gráficos y estadísticas\n📧 Enviado por email\n\n(Funcionalidad simulada)')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
            >
              <DocumentChartBarIcon className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => alert('📊 Exportando Datos Excel\n\n📊 Datos en formato Excel\n📈 Listo para análisis avanzado\n💾 Descarga iniciada\n\n(Funcionalidad simulada)')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
            >
              <PresentationChartLineIcon className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
