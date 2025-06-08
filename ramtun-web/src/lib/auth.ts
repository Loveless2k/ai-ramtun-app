'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from './supabase'
import type { User } from '@supabase/supabase-js'

interface AuthUser extends User {
  user_metadata?: {
    first_name?: string
    last_name?: string
    role?: 'teacher' | 'student' | 'admin'
    school_name?: string
    grade?: string
  }
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key'
  }

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Demo mode - no real auth
      setLoading(false)
      return
    }

    // Real Supabase auth
    const supabase = createClientComponentClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user as AuthUser || null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user as AuthUser || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

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

  const signInWithEmail = async (email: string, password: string) => {
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
    return data
  }

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      console.log('Demo: Sign up with email:', email, metadata)
      alert('🚧 Modo Demo: El registro estará disponible cuando configures Supabase')
      return
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
      // Demo mode
      console.log('Demo: Sign out')
      router.push('/auth/login')
      return
    }

    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
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
    loading,
    signInWithGoogle,
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
