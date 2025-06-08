'use client'

import { useState } from 'react'
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

// Mock data - En producción vendría de la API
const mockAnalytics = {
  overview: {
    totalStudents: 156,
    activeThisWeek: 89,
    averageScore: 87.5,
    totalTimeSpent: 2340, // minutos
    completionRate: 78.3,
    averageAttempts: 2.1
  },
  weeklyData: [
    { day: 'Lun', students: 45, completions: 23, avgScore: 85 },
    { day: 'Mar', students: 52, completions: 31, avgScore: 88 },
    { day: 'Mié', students: 48, completions: 28, avgScore: 82 },
    { day: 'Jue', students: 61, completions: 35, avgScore: 91 },
    { day: 'Vie', students: 38, completions: 22, avgScore: 86 },
    { day: 'Sáb', students: 15, completions: 8, avgScore: 89 },
    { day: 'Dom', students: 12, completions: 6, avgScore: 92 }
  ],
  topCrosswords: [
    { title: 'Sistema Solar', completions: 45, avgScore: 92, difficulty: 'Fácil' },
    { title: 'Revolución Francesa', completions: 38, avgScore: 85, difficulty: 'Medio' },
    { title: 'Fracciones Básicas', completions: 42, avgScore: 88, difficulty: 'Fácil' },
    { title: 'Independencia Chile', completions: 31, avgScore: 79, difficulty: 'Medio' },
    { title: 'Geometría Básica', completions: 28, avgScore: 83, difficulty: 'Medio' }
  ],
  topStudents: [
    { name: 'María González', completions: 12, avgScore: 95, streak: 7 },
    { name: 'Carlos Rodríguez', completions: 11, avgScore: 92, streak: 5 },
    { name: 'Ana Martínez', completions: 10, avgScore: 89, streak: 4 },
    { name: 'Diego López', completions: 9, avgScore: 87, streak: 3 },
    { name: 'Sofía Hernández', completions: 8, avgScore: 91, streak: 6 }
  ],
  subjectPerformance: [
    { subject: 'Matemáticas', avgScore: 85, completions: 89, improvement: 5.2 },
    { subject: 'Historia', avgScore: 82, completions: 76, improvement: -2.1 },
    { subject: 'Ciencias', avgScore: 88, completions: 94, improvement: 7.8 },
    { subject: 'Lenguaje', avgScore: 79, completions: 67, improvement: 1.5 }
  ]
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) {
      return <TrendingUpIcon className="w-4 h-4 text-green-500" />
    } else if (improvement < 0) {
      return <TrendingDownIcon className="w-4 h-4 text-red-500" />
    }
    return null
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Analiza el rendimiento de tus estudiantes</p>
        </div>
        
        {/* Period Selector */}
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 3 meses</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalytics.overview.activeThisWeek}</p>
              <p className="text-sm text-gray-500">de {mockAnalytics.overview.totalStudents} total</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12% vs semana anterior</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Puntuación Promedio</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalytics.overview.averageScore}%</p>
              <p className="text-sm text-gray-500">en todos los crucigramas</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+3.2% vs mes anterior</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Total</p>
              <p className="text-3xl font-bold text-gray-900">{formatTime(mockAnalytics.overview.totalTimeSpent)}</p>
              <p className="text-sm text-gray-500">tiempo de estudio</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+18% vs semana anterior</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Semanal</h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {mockAnalytics.weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{day.students} estudiantes</span>
                    <span className="text-sm text-gray-500">{day.completions} completadas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(day.students / 70) * 100}%` }}
                    />
                  </div>
                </div>
                <div className={`text-sm font-medium ${getScoreColor(day.avgScore)}`}>
                  {day.avgScore}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Rendimiento por Materia</h3>
            <AcademicCapIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {mockAnalytics.subjectPerformance.map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                    <div className="flex items-center space-x-2">
                      {getImprovementIcon(subject.improvement)}
                      <span className={`text-sm font-medium ${
                        subject.improvement > 0 ? 'text-green-600' : 
                        subject.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Promedio: {subject.avgScore}%</span>
                    <span>{subject.completions} completadas</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${subject.avgScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Crosswords */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Crucigramas Más Populares</h3>
          
          <div className="space-y-4">
            {mockAnalytics.topCrosswords.map((crossword, index) => (
              <div key={crossword.title} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{crossword.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{crossword.completions} completadas</span>
                    <span className={getScoreColor(crossword.avgScore)}>
                      {crossword.avgScore}% promedio
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {crossword.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Mejores Estudiantes</h3>
          
          <div className="space-y-4">
            {mockAnalytics.topStudents.map((student, index) => (
              <div key={student.name} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{student.completions} completados</span>
                    <span className={getScoreColor(student.avgScore)}>
                      {student.avgScore}% promedio
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-1"></span>
                      {student.streak} días seguidos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ChartBarIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.completionRate}%</p>
          <p className="text-sm text-gray-600">Tasa de Completación</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.averageAttempts}</p>
          <p className="text-sm text-gray-600">Intentos Promedio</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <StarIcon className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">4.7</p>
          <p className="text-sm text-gray-600">Satisfacción Estudiantes</p>
        </div>
      </div>
    </div>
  )
}
