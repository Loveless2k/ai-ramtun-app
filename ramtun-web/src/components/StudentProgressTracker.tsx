'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  UserIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface StudentProgress {
  id: string
  name: string
  email: string
  class: string
  crosswordId: string
  crosswordTitle: string
  status: 'completed' | 'in-progress' | 'not-started' | 'overdue'
  score?: number
  timeSpent?: number
  attempts: number
  lastAttempt?: string
  completedAt?: string
  hintsUsed: number
  correctAnswers: number
  totalQuestions: number
}

interface StudentProgressTrackerProps {
  crosswordId?: string
  classId?: string
}

export default function StudentProgressTracker({ 
  crosswordId, 
  classId 
}: StudentProgressTrackerProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Mock data for demonstration
  const mockProgress: StudentProgress[] = [
    {
      id: '1',
      name: 'María González',
      email: 'maria.gonzalez@estudiante.cl',
      class: '8A',
      crosswordId: 'rev-francesa-1',
      crosswordTitle: 'Revolución Francesa',
      status: 'completed',
      score: 95,
      timeSpent: 18,
      attempts: 1,
      lastAttempt: '2024-01-20T10:30:00Z',
      completedAt: '2024-01-20T10:48:00Z',
      hintsUsed: 2,
      correctAnswers: 14,
      totalQuestions: 15
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@estudiante.cl',
      class: '8A',
      crosswordId: 'rev-francesa-1',
      crosswordTitle: 'Revolución Francesa',
      status: 'in-progress',
      timeSpent: 12,
      attempts: 2,
      lastAttempt: '2024-01-21T14:15:00Z',
      hintsUsed: 5,
      correctAnswers: 8,
      totalQuestions: 15
    },
    {
      id: '3',
      name: 'Ana Martínez',
      email: 'ana.martinez@estudiante.cl',
      class: '8B',
      crosswordId: 'rev-francesa-1',
      crosswordTitle: 'Revolución Francesa',
      status: 'completed',
      score: 87,
      timeSpent: 25,
      attempts: 2,
      lastAttempt: '2024-01-19T16:20:00Z',
      completedAt: '2024-01-19T16:45:00Z',
      hintsUsed: 3,
      correctAnswers: 13,
      totalQuestions: 15
    },
    {
      id: '4',
      name: 'Diego Silva',
      email: 'diego.silva@estudiante.cl',
      class: '8A',
      crosswordId: 'rev-francesa-1',
      crosswordTitle: 'Revolución Francesa',
      status: 'not-started',
      timeSpent: 0,
      attempts: 0,
      hintsUsed: 0,
      correctAnswers: 0,
      totalQuestions: 15
    },
    {
      id: '5',
      name: 'Sofía López',
      email: 'sofia.lopez@estudiante.cl',
      class: '8B',
      crosswordId: 'rev-francesa-1',
      crosswordTitle: 'Revolución Francesa',
      status: 'overdue',
      timeSpent: 8,
      attempts: 1,
      lastAttempt: '2024-01-18T11:00:00Z',
      hintsUsed: 1,
      correctAnswers: 5,
      totalQuestions: 15
    }
  ]

  const filteredProgress = mockProgress.filter(student => 
    filterStatus === 'all' || student.status === filterStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'not-started': return 'bg-gray-100 text-gray-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />
      case 'in-progress': return <ClockIcon className="w-4 h-4" />
      case 'not-started': return <UserIcon className="w-4 h-4" />
      case 'overdue': return <XCircleIcon className="w-4 h-4" />
      default: return <UserIcon className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado'
      case 'in-progress': return 'En Progreso'
      case 'not-started': return 'No Iniciado'
      case 'overdue': return 'Atrasado'
      default: return 'Desconocido'
    }
  }

  const calculateStats = () => {
    const total = mockProgress.length
    const completed = mockProgress.filter(s => s.status === 'completed').length
    const inProgress = mockProgress.filter(s => s.status === 'in-progress').length
    const notStarted = mockProgress.filter(s => s.status === 'not-started').length
    const overdue = mockProgress.filter(s => s.status === 'overdue').length
    const averageScore = mockProgress
      .filter(s => s.score)
      .reduce((acc, s) => acc + (s.score || 0), 0) / mockProgress.filter(s => s.score).length || 0

    return { total, completed, inProgress, notStarted, overdue, averageScore }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progreso de Estudiantes</h2>
          <p className="text-gray-600">Monitorea el progreso y rendimiento de tus estudiantes</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setSelectedView('detailed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === 'detailed'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Detallado
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <UserIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">No Iniciados</p>
              <p className="text-2xl font-bold text-gray-600">{stats.notStarted}</p>
            </div>
            <UserIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio</p>
              <p className="text-2xl font-bold text-indigo-600">{Math.round(stats.averageScore)}%</p>
            </div>
            <TrophyIcon className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'completed', 'in-progress', 'not-started', 'overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Todos' : getStatusText(status)}
          </button>
        ))}
      </div>

      {/* Student Progress List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntuación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intentos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProgress.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.class}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {getStatusIcon(student.status)}
                      <span className="ml-1">{getStatusText(student.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.score ? `${student.score}%` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.correctAnswers}/{student.totalQuestions}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(student.correctAnswers / student.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.timeSpent ? `${student.timeSpent}m` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.attempts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => alert(`📊 Detalles de ${student.name}\n\n🎯 Respuestas correctas: ${student.correctAnswers}/${student.totalQuestions}\n💡 Pistas usadas: ${student.hintsUsed}\n⏱️ Tiempo total: ${student.timeSpent}m\n🔄 Intentos: ${student.attempts}\n\n(Vista detallada en desarrollo)`)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
