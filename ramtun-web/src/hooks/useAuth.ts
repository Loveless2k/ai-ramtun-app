'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher'
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth(): AuthState {
  // Inicializar con verificación síncrona inmediata
  const getInitialState = (): AuthState => {
    if (typeof window === 'undefined') {
      return { user: null, isLoading: true, isAuthenticated: false }
    }

    try {
      const userData = localStorage.getItem('ramtun_user')
      if (userData) {
        const user = JSON.parse(userData)
        return { user, isLoading: false, isAuthenticated: true }
      }
    } catch (error) {
      console.error('Error reading initial auth state:', error)
    }

    return { user: null, isLoading: false, isAuthenticated: false }
  }

  const [authState, setAuthState] = useState<AuthState>(getInitialState)

  useEffect(() => {
    // Solo ejecutar si no tenemos datos iniciales
    if (authState.isLoading || (!authState.user && typeof window !== 'undefined')) {
      const checkAuth = () => {
        try {
          // Verificar múltiples fuentes de datos de usuario
          let userData = localStorage.getItem('ramtun_user')

          // Si no hay datos en ramtun_user, verificar otras fuentes del sistema existente
          if (!userData) {
            // Verificar si hay datos de sesión del sistema de auth existente
            const existingAuth = localStorage.getItem('supabase.auth.token') ||
                                localStorage.getItem('auth_user') ||
                                sessionStorage.getItem('user_session')

            // También verificar si estamos en el dashboard del profesor (URL-based detection)
            const isInTeacherDashboard = window.location.pathname.startsWith('/dashboard')
            const isInStudentArea = window.location.pathname.startsWith('/student')

            if (existingAuth || isInTeacherDashboard || isInStudentArea) {
              // Crear usuario demo basado en contexto
              const role = isInTeacherDashboard ? 'teacher' : 'student'
              const demoUser = {
                id: 'demo-user',
                email: role === 'teacher' ? 'profesor@demo.com' : 'estudiante@demo.com',
                name: role === 'teacher' ? 'Profesor Demo' : 'Estudiante Demo',
                role: role
              }
              userData = JSON.stringify(demoUser)
              localStorage.setItem('ramtun_user', userData)
            }
          }

          if (userData) {
            const user = JSON.parse(userData)

            // Verificar que el usuario tenga un rol válido
            if (user.role && ['teacher', 'student'].includes(user.role)) {
              setAuthState({
                user,
                isLoading: false,
                isAuthenticated: true
              })
            } else {
              // Usuario sin rol válido, limpiar sesión
              localStorage.removeItem('ramtun_user')
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false
              })
            }
          } else {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false
            })
          }
        } catch (error) {
          console.error('Error checking auth:', error)
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false
          })
        }
      }

      // Solo verificar si es necesario
      checkAuth()
    }

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ramtun_user') {
        const checkAuth = () => {
          try {
            const userData = localStorage.getItem('ramtun_user')
            if (userData) {
              const user = JSON.parse(userData)
              setAuthState({
                user,
                isLoading: false,
                isAuthenticated: true
              })
            } else {
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false
              })
            }
          } catch (error) {
            console.error('Error in storage change handler:', error)
          }
        }
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return authState
}

// Función para verificar si un crucigrama es accesible sin login
export function isCrosswordPublic(gameId: string): boolean {
  // Solo "Sistema Solar" (ID: 2) es público
  const publicCrosswords = ['2']
  return publicCrosswords.includes(gameId)
}

// Función para obtener información del crucigrama demo
export function getDemoCrosswordInfo() {
  return {
    id: '2',
    title: 'Sistema Solar',
    subject: 'Ciencias',
    description: 'Descubre los planetas y cuerpos celestes en este crucigrama demo.',
    isDemo: true
  }
}
