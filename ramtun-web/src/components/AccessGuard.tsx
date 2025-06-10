'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LockClosedIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface AccessGuardProps {
  gameId: string
  gameTitle: string
  gameSubject: string
}

export default function AccessGuard({ gameTitle, gameSubject }: Omit<AccessGuardProps, 'gameId'>) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        {/* Lock Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <LockClosedIcon className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contenido Premium</h1>
        <p className="text-gray-600 mb-6">
          <strong>{gameTitle}</strong> ({gameSubject}) requiere una cuenta para acceder.
        </p>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrophyIcon className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-700">Progreso guardado y logros</span>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ChartBarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Estadísticas detalladas</span>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserGroupIcon className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-gray-700">Acceso a todos los crucigramas</span>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <StarIcon className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-700">Experiencia personalizada</span>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            💡 <strong>¿Quieres probar primero?</strong><br />
            Juega nuestro crucigrama demo &quot;Sistema Solar&quot; sin registrarte.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth/register')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Crear Cuenta Gratis
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth/login')}
            className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
          >
            Ya tengo cuenta
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/game/2')}
            className="w-full bg-green-50 text-green-700 py-3 px-6 rounded-lg font-semibold border-2 border-green-200 hover:border-green-300 transition-all duration-200"
          >
            🎮 Probar Demo: Sistema Solar
          </motion.button>

          <button
            onClick={() => router.push('/')}
            className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </motion.div>
    </div>
  )
}
