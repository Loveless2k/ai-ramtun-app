'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../../lib/auth'
import type { AuthUser, RegistrationMetadata } from '../../../lib/auth'
import AuthRedirect from '../../../components/AuthRedirect'

function RegisterPageContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: 'teacher' as 'teacher' | 'student',
    schoolName: '',
    grade: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const [googleUser, setGoogleUser] = useState<AuthUser | null>(null)

  const { signUpWithEmail, signUpWithGoogle } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (!formData.firstName || !formData.lastName) {
      setError('Nombre y apellido son requeridos')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const metadata = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.userType,
        school_name: formData.schoolName,
        grade: formData.grade
      }

      await signUpWithEmail(formData.email, formData.password, metadata)

      // Redirect to verification page or dashboard
      router.push('/auth/verify-email')
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'DEMO_MODE') {
        // Demo mode - don't show error, just stop execution
        return
      }
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signUpWithGoogle()

      if (result?.user) {
        // Check if user already has complete metadata
        const userMetadata = result.user.user_metadata
        const hasCompleteMetadata = userMetadata?.role &&
          userMetadata?.first_name &&
          userMetadata?.last_name &&
          userMetadata?.school_name &&
          (userMetadata?.role === 'teacher' || userMetadata?.grade)

        if (hasCompleteMetadata) {
          // User already has complete info, redirect to dashboard
          const userRole = userMetadata.role
          if (userRole === 'teacher') {
            router.push('/dashboard')
          } else {
            router.push('/student')
          }
        } else {
          // Need to collect additional metadata
          setGoogleUser(result.user)
          setShowMetadataModal(true)
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'DEMO_MODE') {
        // Demo mode - don't show error, just stop execution
        return
      }
      setError(err instanceof Error ? err.message : 'Error al registrarse con Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMetadataSubmit = async (metadata: RegistrationMetadata) => {
    try {
      // Here we would update the user metadata in Supabase
      // For now, we'll simulate the process and redirect
      console.log('Updating user metadata:', metadata)

      // Redirect based on role
      if (metadata.role === 'teacher') {
        router.push('/dashboard')
      } else {
        router.push('/student')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al completar el registro')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ramtun-primary via-ramtun-secondary to-ramtun-accent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Únete a Ramtun</h1>
          <p className="text-gray-600">Crea tu cuenta para comenzar</p>
        </div>

        {/* User Type Selector */}
        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleInputChange('userType', 'teacher')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                formData.userType === 'teacher'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AcademicCapIcon className="w-5 h-5" />
              <span className="font-medium">Profesor</span>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('userType', 'student')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                formData.userType === 'student'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">Estudiante</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 bg-gray-50"
                  placeholder="Juan"
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 bg-gray-50"
                placeholder="Pérez"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 bg-gray-50"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 bg-gray-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 bg-gray-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* School/Grade Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                {formData.userType === 'teacher' ? 'Establecimiento' : 'Colegio'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="schoolName"
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 bg-gray-50"
                  placeholder="Nombre del colegio"
                />
              </div>
            </div>
            {formData.userType === 'student' && (
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Curso
                </label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 bg-gray-50"
                >
                  <option value="">Seleccionar</option>
                  <option value="1-basico">1° Básico</option>
                  <option value="2-basico">2° Básico</option>
                  <option value="3-basico">3° Básico</option>
                  <option value="4-basico">4° Básico</option>
                  <option value="5-basico">5° Básico</option>
                  <option value="6-basico">6° Básico</option>
                  <option value="7-basico">7° Básico</option>
                  <option value="8-basico">8° Básico</option>
                  <option value="1-medio">1° Medio</option>
                  <option value="2-medio">2° Medio</option>
                  <option value="3-medio">3° Medio</option>
                  <option value="4-medio">4° Medio</option>
                </select>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8 border-2 border-indigo-700"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creando cuenta...</span>
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O</span>
            </div>
          </div>
        </div>

        {/* Google OAuth Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continuar con Google</span>
        </motion.button>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              Inicia sesión aquí
            </button>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 text-center">
            🚧 <strong>Modo Demo:</strong> El registro real se implementará con Supabase
          </p>
        </div>
      </motion.div>

      {/* Metadata Modal */}
      {showMetadataModal && googleUser && (
        <MetadataModal
          user={googleUser}
          onSubmit={handleMetadataSubmit}
          onClose={() => setShowMetadataModal(false)}
        />
      )}
    </div>
  )
}

// Metadata Modal Component
function MetadataModal({ user, onSubmit, onClose }: {
  user: AuthUser
  onSubmit: (metadata: RegistrationMetadata) => void
  onClose: () => void
}) {
  const [modalData, setModalData] = useState({
    role: 'teacher' as 'teacher' | 'student',
    schoolName: '',
    grade: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleModalInputChange = (field: string, value: string) => {
    setModalData(prev => ({ ...prev, [field]: value }))
  }

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const metadata: RegistrationMetadata = {
      first_name: user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || '',
      last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
      role: modalData.role,
      school_name: modalData.schoolName,
      grade: modalData.role === 'student' ? modalData.grade : undefined
    }

    await onSubmit(metadata)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Completa tu perfil</h2>
          <p className="text-gray-600">Necesitamos algunos datos adicionales</p>
        </div>

        <form onSubmit={handleModalSubmit} className="space-y-4">
          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de usuario
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleModalInputChange('role', 'teacher')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                  modalData.role === 'teacher'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <AcademicCapIcon className="w-5 h-5" />
                <span className="font-medium">Profesor</span>
              </button>
              <button
                type="button"
                onClick={() => handleModalInputChange('role', 'student')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                  modalData.role === 'student'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">Estudiante</span>
              </button>
            </div>
          </div>

          {/* School Name */}
          <div>
            <label htmlFor="modalSchoolName" className="block text-sm font-medium text-gray-700 mb-1">
              {modalData.role === 'teacher' ? 'Establecimiento' : 'Colegio'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="modalSchoolName"
                type="text"
                value={modalData.schoolName}
                onChange={(e) => handleModalInputChange('schoolName', e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 bg-gray-50"
                placeholder="Nombre del colegio"
              />
            </div>
          </div>

          {/* Grade (only for students) */}
          {modalData.role === 'student' && (
            <div>
              <label htmlFor="modalGrade" className="block text-sm font-medium text-gray-700 mb-1">
                Curso
              </label>
              <select
                id="modalGrade"
                value={modalData.grade}
                onChange={(e) => handleModalInputChange('grade', e.target.value)}
                required
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 bg-gray-50"
              >
                <option value="">Seleccionar</option>
                <option value="1-basico">1° Básico</option>
                <option value="2-basico">2° Básico</option>
                <option value="3-basico">3° Básico</option>
                <option value="4-basico">4° Básico</option>
                <option value="5-basico">5° Básico</option>
                <option value="6-basico">6° Básico</option>
                <option value="7-basico">7° Básico</option>
                <option value="8-basico">8° Básico</option>
                <option value="1-medio">1° Medio</option>
                <option value="2-medio">2° Medio</option>
                <option value="3-medio">3° Medio</option>
                <option value="4-medio">4° Medio</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                'Completar'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <RegisterPageContent />
    </AuthRedirect>
  )
}
