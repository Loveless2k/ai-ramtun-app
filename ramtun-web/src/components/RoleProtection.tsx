'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/auth'

interface RoleProtectionProps {
  children: React.ReactNode
  allowedRoles: ('teacher' | 'student' | 'admin')[]
  redirectTo?: string
}

/**
 * Componente que protege rutas basado en el rol REAL del usuario
 * Previene acceso no autorizado a dashboards incorrectos
 */
export default function RoleProtection({ children, allowedRoles, redirectTo }: RoleProtectionProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  // Prevenir hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isLoading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated || !user) {
        console.log('Usuario no autenticado, redirigiendo a login')
        router.replace('/auth/login')
        return
      }

      // Si está autenticado pero no tiene el rol correcto
      const userRole = user.user_metadata?.role
      if (!userRole || !allowedRoles.includes(userRole)) {
        const correctDashboard = userRole === 'teacher' ? '/dashboard' : '/play'
        const targetUrl = redirectTo || correctDashboard

        console.log(`Usuario con rol ${userRole} intentó acceder a área no autorizada, redirigiendo a: ${targetUrl}`)

        // Evitar loops infinitos - solo mostrar alerta si no estamos ya en la página de destino
        const currentPath = window.location.pathname
        if (currentPath !== targetUrl) {
          // Mostrar mensaje de error antes de redirigir
          alert(`⚠️ Acceso Denegado\n\nTu cuenta es de tipo "${userRole === 'teacher' ? 'Profesor' : 'Estudiante'}".\nSerás redirigido a tu dashboard correspondiente.`)

          router.replace(targetUrl)
        }
        return
      }

      // Usuario autenticado con rol correcto
      console.log(`✅ RoleProtection: Usuario autenticado con rol ${userRole} - acceso permitido a roles: ${allowedRoles.join(', ')}`)
      setIsAuthorized(true)
    }
  }, [isClient, isAuthenticated, isLoading, user, router, allowedRoles, redirectTo])

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

  // Mostrar loading mientras verificamos
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar contenido
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo a login...</p>
        </div>
      </div>
    )
  }

  // Si no tiene el rol correcto, no mostrar contenido
  const userRole = user.user_metadata?.role
  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600">Acceso no autorizado, redirigiendo...</p>
        </div>
      </div>
    )
  }

  // Esperar autorización antes de mostrar contenido
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>
}
