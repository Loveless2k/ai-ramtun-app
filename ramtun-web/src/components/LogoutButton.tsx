'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../lib/auth'

interface LogoutButtonProps {
  variant?: 'button' | 'menu-item'
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export default function LogoutButton({ 
  variant = 'button', 
  className = '',
  showIcon = true,
  showText = true
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signOut, user } = useAuth()

  const handleLogout = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Error al cerrar sesión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  const baseClasses = variant === 'button' 
    ? 'inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200'
    : 'flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors'

  const variantClasses = variant === 'button'
    ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
    : 'text-gray-700 hover:text-red-600'

  return (
    <motion.button
      whileHover={{ scale: variant === 'button' ? 1.02 : 1 }}
      whileTap={{ scale: variant === 'button' ? 0.98 : 1 }}
      onClick={handleLogout}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses} ${className}`}
      title={`Cerrar sesión (${user.email})`}
    >
      {showIcon && (
        <ArrowRightOnRectangleIcon 
          className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} 
        />
      )}
      {showText && (
        <span>
          {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </span>
      )}
    </motion.button>
  )
}

// Componente específico para el header
export function HeaderLogoutButton() {
  return (
    <LogoutButton 
      variant="button"
      className="text-sm"
      showIcon={true}
      showText={true}
    />
  )
}

// Componente específico para menús dropdown
export function MenuLogoutButton() {
  return (
    <LogoutButton 
      variant="menu-item"
      showIcon={true}
      showText={true}
    />
  )
}
