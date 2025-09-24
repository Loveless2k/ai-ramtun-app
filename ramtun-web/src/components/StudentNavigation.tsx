'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  HomeIcon,
  PlayIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../lib/auth'

interface StudentNavigationProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  showBackButton?: boolean
  backUrl?: string
  backLabel?: string
}

export default function StudentNavigation({
  title,
  subtitle,
  icon,
  showBackButton = false,
  backUrl = '/student/dashboard',
  backLabel = 'Volver al Dashboard'
}: StudentNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const navigationItems = [
    {
      name: 'Jugar',
      href: '/student',
      icon: PlayIcon,
      shortName: 'Jugar'
    },
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: HomeIcon,
      shortName: 'Dashboard'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/student/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={() => router.push(backUrl)}
                className="mr-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={backLabel}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">{subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">¡Bienvenido!</p>
            <p className="text-lg font-semibold text-indigo-600">
              {user?.user_metadata?.full_name || user?.user_metadata?.first_name || 'Estudiante Demo'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`${
                    active
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 flex-shrink-0 transition-colors`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden">{item.shortName}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
