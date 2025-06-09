'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

interface AuthRedirectProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * Componente que redirige usuarios autenticados lejos de páginas de auth
 * Evita que usuarios logueados accedan a login/register
 */
export default function AuthRedirect({ children, redirectTo }: AuthRedirectProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [isClient, setIsClient] = useState(false)

  // Prevenir hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isLoading && isAuthenticated && user) {
      // Determinar a dónde redirigir basado en el rol del usuario
      const defaultRedirect = user.role === 'teacher' ? '/dashboard' : '/student/dashboard'
      const targetUrl = redirectTo || defaultRedirect

      console.log(`Usuario ya autenticado (${user.role}), redirigiendo a: ${targetUrl}`)
      router.replace(targetUrl)
    }
  }, [isClient, isAuthenticated, isLoading, user, router, redirectTo])

  // No renderizar hasta que se hidrate
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Mostrar loading mientras verificamos auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Si está autenticado, no mostrar contenido (se redirigirá)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo a tu dashboard...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar el contenido (página de login/register)
  return <>{children}</>
}
