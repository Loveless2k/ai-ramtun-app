'use client'

import { useState, createContext, useContext, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import AuthSync from '../../components/AuthSync'
import RoleProtection from '../../components/RoleProtection'

// Navigation item type
interface NavigationItem {
  name: string
  tab: string
  icon: React.ComponentType<{ className?: string }>
  isRoute?: boolean
  href?: string
}

// Context for dashboard tab state
const DashboardContext = createContext<{
  activeTab: string
  setActiveTab: (tab: string) => void
  navigateToTab: (tab: string) => void
} | null>(null)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardLayout')
  }
  return context
}

const navigation: NavigationItem[] = [
  { name: 'Inicio', tab: 'overview', icon: HomeIcon },
  { name: 'Generador', tab: 'generator', icon: SparklesIcon },
  { name: 'Biblioteca', tab: 'library', icon: BookOpenIcon },
  { name: 'Analytics', tab: 'analytics', icon: ChartBarIcon },
  { name: 'Perfil', tab: 'profile', icon: UserIcon, isRoute: true, href: '/dashboard/perfil' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const pathname = usePathname()
  const router = useRouter()

  // Function to navigate to a specific tab
  const navigateToTab = (tab: string) => {
    const targetItem = navigation.find(item => item.tab === tab)
    if (targetItem?.isRoute && targetItem.href) {
      router.push(targetItem.href)
    } else {
      // For non-route tabs, navigate to main dashboard and set the tab
      if (pathname !== '/dashboard') {
        router.push('/dashboard')
      }
      setActiveTab(tab)
    }
  }

  // Sync activeTab with current route
  useEffect(() => {
    if (pathname === '/dashboard/perfil') {
      setActiveTab('profile')
    } else if (pathname === '/dashboard') {
      // Only reset to overview if we're on the main dashboard page
      // This prevents overriding when user manually sets a tab
      if (activeTab === 'profile') {
        setActiveTab('overview')
      }
    }
  }, [pathname, activeTab])

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, navigateToTab }}>
      <AuthSync />
      <RoleProtection allowedRoles={['teacher']}>
        <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Ramtun</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = activeTab === item.tab

              if (item.isRoute && item.href) {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigateToTab(item.tab)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                )
              }

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigateToTab(item.tab)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Ramtun</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = activeTab === item.tab

              if (item.isRoute && item.href) {
                return (
                  <button
                    key={item.name}
                    onClick={() => navigateToTab(item.tab)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                )
              }

              return (
                <button
                  key={item.name}
                  onClick={() => navigateToTab(item.tab)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              )
            })}
          </nav>
          
          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Profesor Demo
                </p>
                <p className="text-xs text-gray-500 truncate">
                  demo@ramtun.cl
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4 flex-1">
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Dashboard Profesor
                </h1>
                <p className="text-sm text-gray-600">Gestiona tus crucigramas y analiza el progreso de tus estudiantes</p>
              </div>
              {/* Mobile title */}
              <div className="sm:hidden">
                <h1 className="text-xl font-bold text-gray-900">
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Indicador de estado */}
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">En línea</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      </div>
      </RoleProtection>
    </DashboardContext.Provider>
  )
}
