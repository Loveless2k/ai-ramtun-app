'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  MapPinIcon,
  CameraIcon,
  CheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { useDashboard } from '../layout'

// Mock data - En producción vendría de la API
const mockProfile = {
  name: 'María Elena González',
  email: 'maria.gonzalez@colegio.cl',
  phone: '+56 9 8765 4321',
  avatar: null,
  school: 'Colegio San Patricio',
  position: 'Profesora de Historia',
  subjects: ['Historia', 'Educación Cívica'],
  grades: ['7° Básico', '8° Básico', '1° Medio'],
  location: 'Santiago, Chile',
  joinDate: '2024-01-15',
  bio: 'Profesora apasionada por hacer la historia más accesible y entretenida para mis estudiantes.',
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    studentProgress: true,
    newFeatures: true
  },
  privacy: {
    profileVisibility: 'school',
    shareProgress: true,
    allowMessages: true
  }
}

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockProfile)
  const [isSaving, setIsSaving] = useState(false)
  const { navigateToTab } = useDashboard()

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: UserIcon },
    { id: 'preferences', name: 'Preferencias', icon: CogIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'privacy', name: 'Privacidad', icon: ShieldCheckIcon }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
      // Aquí iría la llamada a la API
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (category: string, field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="mb-6">
        <button
          onClick={() => navigateToTab('overview')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Volver al Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                {formData.avatar ? (
                  <Image src={formData.avatar} alt="Avatar" width={96} height={96} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-indigo-600" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700">
                  <CameraIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
              <p className="text-gray-600">{formData.position}</p>
              <p className="text-gray-500">{formData.school}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {formData.location}
                </span>
                <span className="flex items-center">
                  <AcademicCapIcon className="w-4 h-4 mr-1" />
                  Desde {new Date(formData.joinDate).toLocaleDateString('es-CL')}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div>
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Establecimiento
                  </label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Cuéntanos un poco sobre ti..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materias que Enseñas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cursos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.grades.map((grade, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias de Notificaciones</h3>
                <div className="space-y-4">
                  {Object.entries(formData.preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {key === 'emailNotifications' && 'Notificaciones por Email'}
                          {key === 'pushNotifications' && 'Notificaciones Push'}
                          {key === 'weeklyReports' && 'Reportes Semanales'}
                          {key === 'studentProgress' && 'Progreso de Estudiantes'}
                          {key === 'newFeatures' && 'Nuevas Funcionalidades'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Recibe notificaciones importantes por email'}
                          {key === 'pushNotifications' && 'Notificaciones en tiempo real en tu dispositivo'}
                          {key === 'weeklyReports' && 'Resumen semanal de actividad de tus estudiantes'}
                          {key === 'studentProgress' && 'Alertas cuando los estudiantes completan crucigramas'}
                          {key === 'newFeatures' && 'Información sobre nuevas funcionalidades de Ramtun'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => handlePreferenceChange('preferences', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Privacidad</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibilidad del Perfil
                    </label>
                    <select
                      value={formData.privacy.profileVisibility}
                      onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    >
                      <option value="public">Público</option>
                      <option value="school">Solo mi escuela</option>
                      <option value="private">Privado</option>
                    </select>
                  </div>

                  {Object.entries(formData.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {key === 'shareProgress' && 'Compartir Progreso'}
                          {key === 'allowMessages' && 'Permitir Mensajes'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {key === 'shareProgress' && 'Permite que otros profesores vean tu progreso'}
                          {key === 'allowMessages' && 'Permite que otros usuarios te envíen mensajes'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => handlePreferenceChange('privacy', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
