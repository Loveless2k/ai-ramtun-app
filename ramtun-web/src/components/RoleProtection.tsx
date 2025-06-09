'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

interface RoleProtectionProps {
  children: React.ReactNode
  allowedRoles: ('teacher' | 'student')[]
  redirectTo?: string
}

/**
 * Componente que protege rutas basado en el rol REAL del usuario
 * Previene acceso no autorizado a dashboards incorrectos
 */
export default function RoleProtection({ children, allowedRoles, redirectTo }: RoleProtectionProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated || !user) {
        console.log('Usuario no autenticado, redirigiendo a login')
        router.replace('/auth/login')
        return
      }

      // Si está autenticado pero no tiene el rol correcto
      if (!allowedRoles.includes(user.role)) {
        const correctDashboard = user.role === 'teacher' ? '/dashboard' : '/student'
        const targetUrl = redirectTo || correctDashboard
        
        console.log(`Usuario con rol ${user.role} intentó acceder a área no autorizada, redirigiendo a: ${targetUrl}`)
        
        // Mostrar mensaje de error antes de redirigir
        alert(`⚠️ Acceso Denegado\n\nTu cuenta es de tipo "${user.role === 'teacher' ? 'Profesor' : 'Estudiante'}".\nSerás redirigido a tu dashboard correspondiente.`)
        
        router.replace(targetUrl)
        return
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles, redirectTo])

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
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600">Acceso no autorizado, redirigiendo...</p>
        </div>
      </div>
    )
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>
}
