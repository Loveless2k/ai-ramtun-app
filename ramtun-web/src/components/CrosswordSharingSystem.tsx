'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShareIcon,
  UserGroupIcon,
  ClockIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../lib/auth'

interface SharedCrossword {
  id: string
  title: string
  subject: string
  grade: string
  difficulty: string
  questions: number
  sharedWith: string[]
  createdAt: string
  dueDate?: string
  timeLimit?: number
  maxAttempts?: number
  allowHints: boolean
  status: 'active' | 'draft' | 'archived'
  completions: number
  averageScore: number
}

interface CrosswordSharingSystemProps {
  crosswords: SharedCrossword[]
  onShare: (crosswordId: string, options: any) => void
  onRevoke: (crosswordId: string) => void
}

export default function CrosswordSharingSystem({ 
  crosswords, 
  onShare, 
  onRevoke 
}: CrosswordSharingSystemProps) {
  const { user } = useAuth()
  const [selectedCrossword, setSelectedCrossword] = useState<string | null>(null)
  const [shareOptions, setShareOptions] = useState({
    shareWithClass: '',
    dueDate: '',
    timeLimit: 0,
    maxAttempts: 0,
    allowHints: true,
    instructions: ''
  })

  // Mock data for demonstration
  const mockCrosswords: SharedCrossword[] = [
    {
      id: '1',
      title: 'Revolución Francesa',
      subject: 'Historia',
      grade: '8° Básico',
      difficulty: 'Medio',
      questions: 15,
      sharedWith: ['8A', '8B'],
      createdAt: '2024-01-15',
      dueDate: '2024-01-22',
      timeLimit: 30,
      maxAttempts: 3,
      allowHints: true,
      status: 'active',
      completions: 24,
      averageScore: 87
    },
    {
      id: '2',
      title: 'Sistema Solar',
      subject: 'Ciencias',
      grade: '6° Básico',
      difficulty: 'Fácil',
      questions: 12,
      sharedWith: ['6A'],
      createdAt: '2024-01-10',
      status: 'active',
      allowHints: true,
      completions: 18,
      averageScore: 92
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800'
      case 'Medio': return 'bg-yellow-100 text-yellow-800'
      case 'Difícil': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crucigramas Compartidos</h2>
          <p className="text-gray-600">Gestiona y monitorea los crucigramas asignados a tus estudiantes</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg">
          <span className="text-indigo-800 font-medium">{mockCrosswords.length} crucigramas activos</span>
        </div>
      </div>

      {/* Crosswords Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockCrosswords.map((crossword) => (
          <motion.div
            key={crossword.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{crossword.title}</h3>
                <p className="text-gray-600 text-sm">{crossword.subject} • {crossword.grade}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crossword.status)}`}>
                  {crossword.status === 'active' ? 'Activo' : crossword.status === 'draft' ? 'Borrador' : 'Archivado'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(crossword.difficulty)}`}>
                  {crossword.difficulty}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{crossword.completions}</div>
                <div className="text-xs text-gray-500">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{crossword.averageScore}%</div>
                <div className="text-xs text-gray-500">Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{crossword.questions}</div>
                <div className="text-xs text-gray-500">Preguntas</div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <UserGroupIcon className="w-4 h-4 mr-2" />
                <span>Compartido con: {crossword.sharedWith.join(', ')}</span>
              </div>
              {crossword.dueDate && (
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>Fecha límite: {new Date(crossword.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              {crossword.timeLimit && (
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <span>Límite: {crossword.timeLimit} minutos</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => alert('🚀 Ver Resultados\n\n📊 Estadísticas detalladas\n👥 Progreso por estudiante\n📈 Análisis de rendimiento\n\n(Funcionalidad en desarrollo)')}
                className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
              >
                <EyeIcon className="w-4 h-4" />
                <span>Ver Resultados</span>
              </button>
              <button
                onClick={() => alert('🔗 Compartir Enlace\n\n📋 Enlace copiado al portapapeles\n📤 Listo para enviar a estudiantes\n\n(Simulación)')}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
              >
                <ShareIcon className="w-4 h-4" />
                <span>Compartir</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres archivar este crucigrama?')) {
                    alert('📁 Crucigrama archivado exitosamente')
                  }
                }}
                className="bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {mockCrosswords.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay crucigramas compartidos</h3>
          <p className="text-gray-600 mb-4">Crea y comparte tu primer crucigrama con tus estudiantes</p>
          <button
            onClick={() => window.location.href = '/generator'}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Crear Crucigrama
          </button>
        </div>
      )}
    </div>
  )
}
