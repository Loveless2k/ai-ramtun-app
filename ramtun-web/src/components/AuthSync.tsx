'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Componente para sincronizar el estado de autenticación
 * basado en la URL actual y contexto de la aplicación
 */
export default function AuthSync() {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  // Prevenir hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Solo ejecutar en el cliente después de hidratación
    if (!isClient || typeof window === 'undefined') return

    // Detectar contexto basado en la URL
    const isInTeacherDashboard = pathname.startsWith('/dashboard')
    const isInStudentArea = pathname.startsWith('/student')

    // Solo actualizar si no hay datos de usuario existentes
    const existingUser = localStorage.getItem('ramtun_user')

    if (!existingUser && (isInTeacherDashboard || isInStudentArea)) {
      // Usar setTimeout para evitar conflictos con el hook principal
      setTimeout(() => {
        const role = isInTeacherDashboard ? 'teacher' : 'student'
        const demoUser = {
          id: `demo-${role}`,
          email: role === 'teacher' ? 'profesor@demo.com' : 'estudiante@demo.com',
          user_metadata: {
            first_name: role === 'teacher' ? 'Profesor' : 'Estudiante',
            last_name: 'Demo',
            role: role,
            school_name: 'Escuela Demo'
          },
          // Also include role at root level for backward compatibility
          role: role
        }

        localStorage.setItem('ramtun_user', JSON.stringify(demoUser))

        // Disparar evento para que otros componentes se actualicen
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'ramtun_user',
          newValue: JSON.stringify(demoUser)
        }))
      }, 50) // Pequeño delay para evitar race conditions
    }
  }, [isClient, pathname])

  return null // Este componente no renderiza nada
}
