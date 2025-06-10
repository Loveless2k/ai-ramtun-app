'use client'

import { useRouter } from 'next/navigation'
import {
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon,
  HomeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default function StudentProgressPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Progreso</h1>
                <p className="text-gray-600">Revisa tu rendimiento y estadísticas</p>
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
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => router.push('/student/progress')}
                className="border-indigo-500 text-indigo-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2"
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
        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crucigramas Completados</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-3xl font-bold text-gray-900">85%</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <StarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Total</p>
                <p className="text-3xl font-bold text-gray-900">4.2h</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Racha Actual</p>
                <p className="text-3xl font-bold text-gray-900">7 días</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-100 text-center">
          <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Progreso Detallado</h3>
          <p className="text-gray-600 mb-6">
            Gráficos detallados, análisis de rendimiento por materia y recomendaciones personalizadas.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              🚧 <strong>Próximamente:</strong> Análisis completo de progreso y estadísticas avanzadas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
