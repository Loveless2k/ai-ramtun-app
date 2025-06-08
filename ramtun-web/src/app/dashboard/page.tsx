'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PuzzlePieceIcon,
  UserGroupIcon,
  CheckCircleIcon,
  StarIcon,
  SparklesIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

// Mock data - En producción vendría de la API
const mockStats = {
  totalCrosswords: 24,
  completionRate: 89,
  activeStudents: 156,
  averageRating: 4.8
}

const mockRecentCrosswords = [
  {
    id: 1,
    title: 'Revolución Francesa',
    subject: 'Historia',
    grade: '8° Básico',
    difficulty: 'Medio',
    questions: 15,
    completions: 23,
    createdAt: '2024-01-15',
    status: 'Activo'
  },
  {
    id: 2,
    title: 'Sistema Solar',
    subject: 'Ciencias',
    grade: '6° Básico', 
    difficulty: 'Fácil',
    questions: 12,
    completions: 18,
    createdAt: '2024-01-14',
    status: 'Activo'
  },
  {
    id: 3,
    title: 'Fracciones Básicas',
    subject: 'Matemáticas',
    grade: '5° Básico',
    difficulty: 'Fácil',
    questions: 10,
    completions: 31,
    createdAt: '2024-01-12',
    status: 'Completado'
  }
]

export default function DashboardPage() {
  const [quickTopic, setQuickTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleQuickGenerate = async () => {
    if (!quickTopic.trim()) return
    
    setIsGenerating(true)
    // Simular generación
    setTimeout(() => {
      setIsGenerating(false)
      window.location.href = `/generator?topic=${encodeURIComponent(quickTopic)}`
    }, 2000)
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">
            ¡Bienvenido de vuelta, Profesor! 👋
          </h1>
          <p className="text-indigo-100 text-lg">
            Tienes {mockStats.activeStudents} estudiantes activos esperando nuevos desafíos.
            ¿Qué crucigrama crearemos hoy?
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crucigramas Creados</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.totalCrosswords}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <PuzzlePieceIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+3 este mes</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa Completación</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+5% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.activeStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600 font-medium">12 nuevos esta semana</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calificación Promedio</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(mockStats.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Generator */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Generador Rápido</h3>
              <p className="text-sm text-gray-600">Crea un crucigrama en 30 segundos</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleQuickGenerate()}
              />
            </div>
            
            <button
              onClick={handleQuickGenerate}
              disabled={!quickTopic.trim() || isGenerating}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all ${
                !quickTopic.trim() || isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
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
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  María completó "Sistema Solar"
                </p>
                <p className="text-xs text-gray-500">Hace 2 minutos</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <StarIcon className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Carlos obtuvo 5 estrellas en "Fracciones"
                </p>
                <p className="text-xs text-gray-500">Hace 15 minutos</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  8 estudiantes iniciaron "Revolución Francesa"
                </p>
                <p className="text-xs text-gray-500">Hace 1 hora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
