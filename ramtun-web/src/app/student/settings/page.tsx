'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  EyeIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function StudentSettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-600">Personaliza tu experiencia en Ramtun</p>
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
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Progreso</span>
              </button>
              <button
                onClick={() => router.push('/student/settings')}
                className="border-indigo-500 text-indigo-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span>Configuración</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <UserIcon className="w-8 h-8 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Perfil</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value="Estudiante Demo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
              <input
                type="text"
                value="8° Básico"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <BellIcon className="w-8 h-8 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Preferencias</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
                <p className="text-sm text-gray-600">Recibir notificaciones sobre nuevos crucigramas</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Efectos de Sonido</h3>
                <p className="text-sm text-gray-600">Reproducir sonidos durante el juego</p>
              </div>
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEffects ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Modo Oscuro</h3>
                <p className="text-sm text-gray-600">Cambiar a tema oscuro</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-100 text-center">
          <ShieldCheckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Más Configuraciones</h3>
          <p className="text-gray-600 mb-6">
            Configuraciones de privacidad, gestión de cuenta y preferencias avanzadas.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              🚧 <strong>Próximamente:</strong> Configuraciones completas de cuenta y privacidad
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
