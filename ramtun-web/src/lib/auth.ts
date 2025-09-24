'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from './supabase'
import type { User } from '@supabase/supabase-js'

export type AuthUser = Omit<User, 'user_metadata'> & {
  user_metadata: {
    first_name?: string
    last_name?: string
    full_name?: string
    role?: 'teacher' | 'student' | 'admin'
    school_name?: string
    grade?: string
  }
}

export type RegistrationMetadata = {
  first_name?: string
  last_name?: string
  role?: 'teacher' | 'student' | 'admin'
  school_name?: string
  grade?: string
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

type GoogleAuthResult = { provider: string; url: string } | undefined
type EmailAuthResult = { user?: AuthUser | null } | undefined

export const useAuth = (): AuthState & {
  signInWithGoogle: () => Promise<GoogleAuthResult>
  signUpWithGoogle: () => Promise<GoogleAuthResult>
  signInWithEmail: (email: string, password: string) => Promise<EmailAuthResult>
  signUpWithEmail: (email: string, password: string, metadata?: RegistrationMetadata) => Promise<unknown>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<unknown>
} => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  // Prevenir hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key'
  }

  useEffect(() => {
    // Solo ejecutar después de hidratación
    if (!isClient) return

    if (!isSupabaseConfigured()) {
      // Demo mode - check localStorage first, then create demo user
      const checkLocalStorageUser = () => {
        try {
          const storedUser = localStorage.getItem('ramtun_user')
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            console.log('🔍 Auth: Found localStorage user:', userData)

            // Convert localStorage user to AuthUser format
            const authUser: AuthUser = {
              id: userData.id,
              email: userData.email,
              user_metadata: userData.user_metadata || {
                first_name: userData.user_metadata?.first_name || (userData.role === 'teacher' ? 'Profesor' : 'Estudiante'),
                last_name: userData.user_metadata?.last_name || 'Demo',
                role: userData.user_metadata?.role || userData.role,
                school_name: userData.user_metadata?.school_name || 'Escuela Demo'
              }
            } as AuthUser

            console.log('🔍 Auth: Converted to AuthUser:', authUser)
            setUser(authUser)
            setIsLoading(false)
            return true
          }
        } catch (error) {
          console.error('Error reading localStorage user:', error)
        }
        return false
      }

      // Try localStorage first
      if (!checkLocalStorageUser()) {
        // Fallback to creating demo user based on URL
        const isInTeacherDashboard = window.location.pathname.startsWith('/dashboard')
        const isInStudentArea = window.location.pathname.startsWith('/student')

        if (isInTeacherDashboard || isInStudentArea) {
          const role = isInTeacherDashboard ? 'teacher' : 'student'
          const demoUser: AuthUser = {
            id: `demo-${role}`,
            email: role === 'teacher' ? 'profesor@demo.com' : 'estudiante@demo.com',
            user_metadata: {
              first_name: role === 'teacher' ? 'Profesor' : 'Estudiante',
              last_name: 'Demo',
              role: role,
              school_name: 'Escuela Demo'
            }
          } as AuthUser

          setUser(demoUser)
        }
        setIsLoading(false)
      }

      // Listen for localStorage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'ramtun_user') {
          checkLocalStorageUser()
        }
      }

      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }

    // Real Supabase auth
    const supabase = createClientComponentClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user as AuthUser || null

        // Validar que el usuario tenga rol asignado
        if (user && !user.user_metadata?.role) {
          console.warn('Usuario sin rol asignado:', user.email)
          // Podrías redirigir a una página de configuración de perfil
        }

        setUser(user)
      } catch (error) {
        console.error('Error getting session:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user as AuthUser || null

        // Validar rol en cambios de sesión
        if (user && !user.user_metadata?.role) {
          console.warn('Usuario sin rol en cambio de sesión:', user.email)
        }

        setUser(user)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [isClient])

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      console.log('Demo: Sign in with Google')
      alert('🚧 Modo Demo: La autenticación con Google estará disponible cuando configures Supabase')
      return
    }

    const supabase = createClientComponentClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  const signUpWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      console.log('Demo: Sign up with Google')
      alert('🚧 Modo Demo Activo\n\n✅ Puedes explorar la plataforma sin registrarte\n🎮 Prueba el crucigrama demo "Sistema Solar"\n📊 Accede a las áreas de demostración\n\n💡 El registro con Google estará disponible cuando se configure Supabase')
      throw new Error('DEMO_MODE') // Throw error to prevent navigation
    }

    const supabase = createClientComponentClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  const signInWithEmail = async (email: string, password: string): Promise<EmailAuthResult> => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      console.log('Demo: Sign in with email:', email)
      alert('🚧 Modo Demo: La autenticación por email estará disponible cuando configures Supabase')
      return
    }

    const supabase = createClientComponentClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { user: (data.user as AuthUser) ?? null }
  }

  const signUpWithEmail = async (email: string, password: string, metadata?: RegistrationMetadata) => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      console.log('Demo: Sign up with email:', email, metadata)
      alert('🚧 Modo Demo Activo\n\n✅ Puedes explorar la plataforma sin registrarte\n🎮 Prueba el crucigrama demo "Sistema Solar"\n📊 Accede a las áreas de demostración\n\n💡 El registro real estará disponible cuando se configure Supabase')
      throw new Error('DEMO_MODE') // Throw error to prevent navigation
    }

    const supabase = createClientComponentClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      // Demo mode - limpiar estado local
      setUser(null)
      setIsLoading(false)
      console.log('Demo: Sign out')
      router.push('/auth/login')
      return
    }

    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    // Limpiar estado local
    setUser(null)
    router.push('/auth/login')
  }

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      console.log('Demo: Reset password for:', email)
      alert('🚧 Modo Demo: El reset de contraseña estará disponible cuando configures Supabase')
      return
    }

    const supabase = createClientComponentClient()
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) throw error
    return data
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signUpWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
  }
}

// Server-side auth helper
export const getServerSession = async () => {
  const { createServerComponentClient } = await import('./supabase')
  const supabase = await createServerComponentClient()

  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Función para verificar si un crucigrama es accesible sin login
export function isCrosswordPublic(gameId: string): boolean {
  // Solo "Sistema Solar" es público para demo
  // Mapeo de IDs numéricos a claves de base de datos
  const idMapping: Record<string, string> = {
    '1': 'sistema-solar',           // Sistema Solar
    '2': 'revolucion-francesa',     // Revolución Francesa
    '3': 'fracciones-basicas',      // Fracciones Básicas
    '4': 'animales-vertebrados',    // Animales Vertebrados
    '5': 'geografia-chile',         // Geografía de Chile
    '6': 'tabla-periodica'          // Tabla Periódica
  }

  // Convertir ID numérico a clave de base de datos si es necesario
  const gameKey = idMapping[gameId] || gameId

  const publicCrosswords = ['sistema-solar']
  return publicCrosswords.includes(gameKey)
}

// Función para obtener información del crucigrama demo
export function getDemoCrosswordInfo() {
  return {
    id: '1',
    title: 'Sistema Solar',
    subject: 'Ciencias',
    description: 'Descubre los planetas y cuerpos celestes en este crucigrama demo.',
    isDemo: true
  }
}
