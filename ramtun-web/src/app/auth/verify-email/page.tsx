'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { EnvelopeIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { createClientComponentClient } from '../../../lib/supabase'

function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const handleEmailVerification = useCallback(async (token: string) => {
    setIsVerifying(true)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      })

      if (error) {
        setVerificationStatus('error')
        setMessage('Error al verificar el email. El enlace puede haber expirado.')
        return
      }

      if (data.user) {
        setVerificationStatus('success')
        setMessage('¡Email verificado exitosamente!')

        // Redirect to appropriate dashboard based on user role
        const userRole = data.user.user_metadata?.role || 'student'
        setTimeout(() => {
          if (userRole === 'teacher') {
            router.push('/dashboard')
          } else {
            router.push('/student/dashboard')
          }
        }, 2000)
      }
    } catch {
      setVerificationStatus('error')
      setMessage('Error inesperado durante la verificación.')
    } finally {
      setIsVerifying(false)
    }
  }, [router, supabase.auth])

  useEffect(() => {
    // Check if this is a verification callback
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    if (token && type === 'signup') {
      handleEmailVerification(token)
    }
  }, [searchParams, handleEmailVerification])

  const resendVerificationEmail = async () => {
    try {
      // This would need the user's email - for now just show a message
      setMessage('Para reenviar el email de verificación, intenta registrarte nuevamente.')
    } catch {
      setMessage('Error al reenviar el email de verificación.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ramtun-primary via-ramtun-secondary to-ramtun-accent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
            verificationStatus === 'success'
              ? 'bg-green-100'
              : verificationStatus === 'error'
              ? 'bg-red-100'
              : 'bg-blue-100'
          }`}
        >
          {verificationStatus === 'success' ? (
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          ) : verificationStatus === 'error' ? (
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          ) : (
            <EnvelopeIcon className="w-8 h-8 text-blue-600" />
          )}
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {verificationStatus === 'success'
            ? '¡Verificación Exitosa!'
            : verificationStatus === 'error'
            ? 'Error de Verificación'
            : 'Verifica tu Email'
          }
        </h1>

        {/* Message */}
        <div className="mb-6">
          {isVerifying ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Verificando...</span>
            </div>
          ) : message ? (
            <p className={`text-sm ${
              verificationStatus === 'success'
                ? 'text-green-600'
                : verificationStatus === 'error'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}>
              {message}
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600">
                Hemos enviado un enlace de verificación a tu correo electrónico.
              </p>
              <p className="text-sm text-gray-500">
                Haz clic en el enlace para activar tu cuenta y comenzar a usar Ramtun.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {verificationStatus === 'pending' && !isVerifying && (
            <>
              <button
                onClick={resendVerificationEmail}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Reenviar Email
              </button>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                Volver al Login
              </button>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <button
                onClick={() => router.push('/auth/register')}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Intentar Registro Nuevamente
              </button>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                Ir al Login
              </button>
            </>
          )}

          {verificationStatus === 'success' && (
            <div className="text-sm text-gray-500">
              Redirigiendo automáticamente...
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            ¿No recibiste el email? Revisa tu carpeta de spam o correo no deseado.
          </p>
        </div>
      </motion.div>
    </div>
  )

}

export default function VerifyEmailPageWrapper() {
  return (
    <Suspense fallback={<div />}>
      <VerifyEmailPage />
    </Suspense>
  )
}
