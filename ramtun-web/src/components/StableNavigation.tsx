'use client'

import { useState, useEffect } from 'react'
import Navigation from './Navigation'

/**
 * Wrapper para Navigation que previene el parpadeo
 * manteniendo el estado de autenticación estable durante navegación
 */
export default function StableNavigation() {
  const [isClient, setIsClient] = useState(false)
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean
    user: unknown
  } | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Leer estado inicial inmediatamente
    try {
      const userData = localStorage.getItem('ramtun_user')
      if (userData) {
        const user = JSON.parse(userData)
        setAuthState({ isAuthenticated: true, user })
      } else {
        setAuthState({ isAuthenticated: false, user: null })
      }
    } catch {
      setAuthState({ isAuthenticated: false, user: null })
    }

    // Escuchar cambios
    const handleStorageChange = () => {
      try {
        const userData = localStorage.getItem('ramtun_user')
        if (userData) {
          const user = JSON.parse(userData)
          setAuthState({ isAuthenticated: true, user })
        } else {
          setAuthState({ isAuthenticated: false, user: null })
        }
      } catch {
        setAuthState({ isAuthenticated: false, user: null })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // También escuchar cambios en el mismo tab
    const interval = setInterval(() => {
      handleStorageChange()
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // No renderizar hasta que tengamos el estado inicial
  if (!isClient || authState === null) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">Ramtun</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500">Cargando...</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return <Navigation />
}
