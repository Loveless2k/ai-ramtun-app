'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Temporary mock user type for demo
type User = {
  id: string
  email: string
} | null

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false) // Set to false for demo
  const router = useRouter()

  // Temporary mock implementation for demo
  useEffect(() => {
    setLoading(false)
  }, [])

  const signInWithGoogle = async () => {
    // Mock implementation for demo
    console.log('Sign in with Google - Demo mode')
  }

  const signInWithEmail = async (email: string, password: string) => {
    // Mock implementation for demo
    console.log('Sign in with email - Demo mode')
  }

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    // Mock implementation for demo
    console.log('Sign up with email - Demo mode')
  }

  const signOut = async () => {
    // Mock implementation for demo
    console.log('Sign out - Demo mode')
  }

  const resetPassword = async (email: string) => {
    // Mock implementation for demo
    console.log('Reset password - Demo mode')
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
