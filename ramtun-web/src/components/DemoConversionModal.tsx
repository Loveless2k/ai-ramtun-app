'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  BookOpenIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface DemoConversionModalProps {
  isOpen: boolean
  onClose: () => void
  score: number
  timeElapsed: number
}

export default function DemoConversionModal({ 
  isOpen, 
  onClose, 
  score, 
  timeElapsed 
}: DemoConversionModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleRegister = () => {
    router.push('/auth/register')
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Excelente trabajo!</h2>
            <p className="text-indigo-100">Has completado el crucigrama demo</p>
          </div>
        </div>

        {/* Results */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <StarIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{score}%</p>
              <p className="text-sm text-gray-600">Puntuación</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm font-bold">⏱</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatTime(timeElapsed)}</p>
              <p className="text-sm text-gray-600">Tiempo</p>
            </div>
          </div>

          {/* Unlock Message */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">🎉 ¡Te gustó el demo!</h3>
            <p className="text-sm text-green-700">
              Regístrate gratis para desbloquear <strong>15+ crucigramas</strong> más y guardar tu progreso.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-gray-700">Acceso a todos los crucigramas</span>
            </div>
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-gray-700">Estadísticas y progreso guardado</span>
            </div>
            <div className="flex items-center space-x-3">
              <TrophyIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-gray-700">Sistema de logros y achievements</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🚀 Crear Cuenta Gratis
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
            >
              Ya tengo cuenta
            </motion.button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
            >
              Continuar explorando
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
