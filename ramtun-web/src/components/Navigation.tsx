'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bars3Icon,
  XMarkIcon,
  PuzzlePieceIcon,
  AcademicCapIcon,
  UserIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import { useAuth } from '../lib/auth'
import { useRouter, usePathname } from 'next/navigation'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Prevenir hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])



  // Manejar scroll al cargar página con hash
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash
      if (hash && pathname === '/') {
        const element = document.getElementById(hash.substring(1))
        if (element) {
          // Pequeño delay para asegurar que la página esté completamente cargada
          setTimeout(() => {
            const yOffset = -80 // Offset para compensar la navegación fija
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
          }, 100)
        }
      }
    }

    // Ejecutar al cargar la página
    handleHashScroll()

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashScroll)

    return () => {
      window.removeEventListener('hashchange', handleHashScroll)
    }
  }, [pathname])

  // Función para manejar navegación con anchors
  const handleAnchorNavigation = (href: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault()

    // Si el href contiene un anchor (/#section)
    if (href.includes('#')) {
      const [path, anchor] = href.split('#')

      // Si estamos en la homepage, hacer scroll suave
      if (pathname === '/' && path === '/') {
        const element = document.getElementById(anchor)
        if (element) {
          const yOffset = -80 // Offset para compensar la navegación fija
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      } else {
        // Si estamos en otra página, navegar a la homepage con el anchor
        router.push(href)
      }
    } else {
      // Para enlaces normales, usar navegación estándar
      router.push(href)
    }
  }

  // Helper para obtener información del dashboard según el rol
  const getDashboardInfo = (userRole?: string) => {
    if (userRole === 'teacher') {
      return {
        text: 'Dashboard Profesor',
        icon: <AcademicCapIcon className="w-4 h-4" />,
        url: '/dashboard'
      }
    } else if (userRole === 'student') {
      return {
        text: 'Dashboard Estudiante',
        icon: <UserIcon className="w-4 h-4" />,
        url: '/student/dashboard'
      }
    } else {
      return {
        text: 'Dashboard',
        icon: <ChevronRightIcon className="w-4 h-4" />,
        url: '/dashboard'
      }
    }
  }

  // Navegación contextual según estado de autenticación
  const getNavItems = () => {
    const baseItems = [
      { name: 'Inicio', href: '/' },
    ]

    // 🔒 REMOVED: Generator access moved to dashboard sidebar only
    // Teachers access Generator through Dashboard → Generador tab

    // Item "Jugar" contextual - accesible para todos los usuarios autenticados
    const playItem = isAuthenticated
      ? { name: 'Jugar', href: '/play' } // Usuario autenticado va a área de juegos
      : { name: 'Jugar', href: '/game', badge: 'Demo Gratis' } // Usuario no autenticado ve demo

    const endItems = [
      { name: 'Características', href: '/#features' },
      { name: 'Precios', href: '/#pricing' },
      { name: 'Contacto', href: '/#contact' },
    ]

    return [...baseItems, playItem, ...endItems]
  }

  const navItems = getNavItems()

  return (
    <nav className="fixed top-0 w-full bg-white/98 backdrop-blur-md border-b border-gray-300 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <PuzzlePieceIcon className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Ramtun</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => handleAnchorNavigation(item.href, e)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium relative cursor-pointer flex items-center"
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isClient || isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Cargando...</span>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 truncate max-w-32">
                  Hola, {user.user_metadata?.first_name || user.email}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await signOut()
                    } catch (error) {
                      console.error('Error al cerrar sesión:', error)
                    }
                  }}
                  className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 flex items-center justify-center"
                >
                  Cerrar Sesión
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const dashboardInfo = getDashboardInfo(user.user_metadata?.role)
                    window.location.href = dashboardInfo.url
                  }}
                  className="flex items-center justify-center space-x-2"
                >
                  {(() => {
                    const dashboardInfo = getDashboardInfo(user.user_metadata?.role)
                    return (
                      <>
                        {dashboardInfo.icon}
                        <span>{dashboardInfo.text}</span>
                      </>
                    )
                  })()}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.location.href = '/auth/login'}
                  className="h-9 px-4 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  style={{
                    color: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    border: '1px solid rgba(79, 70, 229, 0.2)'
                  }}
                >
                  Iniciar Sesión
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.href = '/auth/register'}
                  className="flex items-center justify-center"
                >
                  Registrarse
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              icon={isOpen ? <XMarkIcon className="w-6 h-6 text-gray-900" /> : <Bars3Icon className="w-6 h-6 text-gray-900" />}
              animation="none"
              className="text-gray-900 hover:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block text-gray-900 hover:text-indigo-600 transition-colors duration-200 font-semibold py-2 relative cursor-pointer"
                  onClick={(e) => {
                    handleAnchorNavigation(item.href, e)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </motion.a>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {!isClient || isLoading ? (
                  <div className="flex items-center justify-center space-x-2 py-4">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500">Cargando...</span>
                  </div>
                ) : isAuthenticated && user ? (
                  <>
                    <p className="text-sm font-semibold text-gray-900 text-center">
                      Hola, {user.user_metadata?.first_name || user.email}
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full flex items-center justify-center space-x-2"
                        onClick={() => {
                          const dashboardInfo = getDashboardInfo(user.user_metadata?.role)
                          window.location.href = dashboardInfo.url
                          setIsOpen(false)
                        }}
                      >
                        {(() => {
                          const dashboardInfo = getDashboardInfo(user.user_metadata?.role)
                          return (
                            <>
                              {dashboardInfo.icon}
                              <span>{dashboardInfo.text}</span>
                            </>
                          )
                        })()}
                      </Button>
                      <button
                        onClick={async () => {
                          try {
                            await signOut()
                            setIsOpen(false)
                          } catch (error) {
                            console.error('Error al cerrar sesión:', error)
                          }
                        }}
                        className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 flex items-center justify-center"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold"
                      onClick={() => {
                        window.location.href = '/auth/login'
                        setIsOpen(false)
                      }}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full flex items-center justify-center"
                      onClick={() => {
                        window.location.href = '/auth/register'
                        setIsOpen(false)
                      }}
                    >
                      Registrarse
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
