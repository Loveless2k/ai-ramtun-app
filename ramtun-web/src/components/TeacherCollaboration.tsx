'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShareIcon,
  HeartIcon,
  StarIcon,
  DocumentDuplicateIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

interface SharedCrossword {
  id: string
  title: string
  subject: string
  grade: string
  difficulty: string
  questions: number
  author: string
  authorSchool: string
  sharedAt: string
  likes: number
  downloads: number
  rating: number
  reviews: number
  isLiked: boolean
  tags: string[]
  description: string
  preview: string[]
}

interface CollaborationRequest {
  id: string
  from: string
  fromSchool: string
  crosswordTitle: string
  message: string
  requestedAt: string
  status: 'pending' | 'accepted' | 'declined'
}

export default function TeacherCollaboration() {
  const [activeView, setActiveView] = useState<'shared' | 'requests' | 'my-shared'>('shared')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for shared crosswords
  const mockSharedCrosswords: SharedCrossword[] = [
    {
      id: '1',
      title: 'Revolución Industrial',
      subject: 'Historia',
      grade: '8° Básico',
      difficulty: 'Medio',
      questions: 16,
      author: 'Prof. Ana García',
      authorSchool: 'Colegio San Patricio',
      sharedAt: '2024-01-15',
      likes: 24,
      downloads: 89,
      rating: 4.8,
      reviews: 12,
      isLiked: false,
      tags: ['historia', 'revolución', 'industria'],
      description: 'Crucigrama completo sobre la Revolución Industrial, incluyendo inventos, personajes y consecuencias sociales.',
      preview: ['Máquina de vapor', 'James Watt', 'Fábrica textil']
    },
    {
      id: '2',
      title: 'Ecosistemas Chilenos',
      subject: 'Ciencias',
      grade: '6° Básico',
      difficulty: 'Fácil',
      questions: 12,
      author: 'Prof. Carlos Mendoza',
      authorSchool: 'Escuela Básica Los Andes',
      sharedAt: '2024-01-12',
      likes: 31,
      downloads: 156,
      rating: 4.9,
      reviews: 18,
      isLiked: true,
      tags: ['ecosistemas', 'chile', 'biodiversidad'],
      description: 'Explora los diferentes ecosistemas de Chile, desde el desierto hasta los bosques templados.',
      preview: ['Desierto de Atacama', 'Bosque Valdiviano', 'Estepa Patagónica']
    }
  ]

  // Mock collaboration requests
  const mockRequests: CollaborationRequest[] = [
    {
      id: '1',
      from: 'Prof. María López',
      fromSchool: 'Liceo Técnico Industrial',
      crosswordTitle: 'Fracciones Avanzadas',
      message: '¡Hola! Me encantó tu crucigrama de matemáticas. ¿Podrías compartir el de fracciones avanzadas? Mis estudiantes de 7° lo necesitan.',
      requestedAt: '2024-01-20',
      status: 'pending'
    },
    {
      id: '2',
      from: 'Prof. Diego Silva',
      fromSchool: 'Colegio Bicentenario',
      crosswordTitle: 'Guerra del Pacífico',
      message: 'Excelente trabajo en historia. ¿Sería posible acceder a tu crucigrama sobre la Guerra del Pacífico?',
      requestedAt: '2024-01-18',
      status: 'pending'
    }
  ]

  const filteredCrosswords = mockSharedCrosswords.filter(crossword => {
    const matchesSubject = selectedSubject === 'all' || crossword.subject === selectedSubject
    const matchesGrade = selectedGrade === 'all' || crossword.grade === selectedGrade
    const matchesSearch = searchQuery === '' || 
      crossword.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crossword.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSubject && matchesGrade && matchesSearch
  })

  const handleLike = (crosswordId: string) => {
    // Implementation for liking/unliking crosswords
    console.log('Toggling like for crossword:', crosswordId)
  }

  const handleDownload = (crosswordId: string) => {
    // Implementation for downloading crosswords
    console.log('Downloading crossword:', crosswordId)
    alert('🚀 Descarga Iniciada\n\n📥 Crucigrama descargado a tu biblioteca\n✅ Listo para usar con tus estudiantes\n🎨 Puedes editarlo y personalizarlo\n\n(Funcionalidad simulada)')
  }

  const handleRequest = (crosswordId: string) => {
    // Implementation for requesting access
    console.log('Requesting access to crossword:', crosswordId)
    alert('📨 Solicitud Enviada\n\n✅ Tu solicitud ha sido enviada al profesor\n📧 Recibirás una notificación cuando responda\n💬 Puedes agregar un mensaje personalizado\n\n(Funcionalidad simulada)')
  }

  const handleRequestResponse = (requestId: string, response: 'accept' | 'decline') => {
    console.log('Responding to request:', requestId, response)
    alert(`${response === 'accept' ? '✅ Solicitud Aceptada' : '❌ Solicitud Rechazada'}\n\n📧 El profesor será notificado de tu respuesta\n${response === 'accept' ? '📤 Crucigrama compartido exitosamente' : '💬 Puedes enviar un mensaje explicativo'}\n\n(Funcionalidad simulada)`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Colaboración entre Profesores</h2>
          <p className="text-gray-600">Comparte y descubre crucigramas creados por otros educadores</p>
        </div>
        <button
          onClick={() => alert('🚀 Compartir Crucigrama\n\n📤 Selecciona crucigramas para compartir\n🌐 Hazlos públicos para otros profesores\n💬 Agrega descripción y etiquetas\n\n(Funcionalidad en desarrollo)')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Compartir Crucigrama</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'shared', name: 'Crucigramas Compartidos', count: mockSharedCrosswords.length },
          { id: 'requests', name: 'Solicitudes', count: mockRequests.filter(r => r.status === 'pending').length },
          { id: 'my-shared', name: 'Mis Compartidos', count: 3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as 'shared' | 'requests' | 'my-shared')}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
              activeView === tab.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.name}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeView === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Shared Crosswords View */}
      {activeView === 'shared' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título o etiquetas..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Todas</option>
                <option value="Historia">Historia</option>
                <option value="Ciencias">Ciencias</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Lenguaje">Lenguaje</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Todos</option>
                <option value="5° Básico">5° Básico</option>
                <option value="6° Básico">6° Básico</option>
                <option value="7° Básico">7° Básico</option>
                <option value="8° Básico">8° Básico</option>
              </select>
            </div>
          </div>

          {/* Crosswords Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCrosswords.map((crossword) => (
              <motion.div
                key={crossword.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{crossword.title}</h3>
                    <p className="text-gray-600 text-sm">{crossword.subject} • {crossword.grade}</p>
                    <p className="text-gray-500 text-xs mt-1">Por {crossword.author} - {crossword.authorSchool}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{crossword.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{crossword.description}</p>

                {/* Preview */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Vista previa:</p>
                  <div className="flex flex-wrap gap-1">
                    {crossword.preview.map((item, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <HeartIcon className="w-4 h-4" />
                      <span>{crossword.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <DocumentDuplicateIcon className="w-4 h-4" />
                      <span>{crossword.downloads}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      <span>{crossword.reviews}</span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{crossword.questions} preguntas</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLike(crossword.id)}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-1 ${
                      crossword.isLiked
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {crossword.isLiked ? <HeartSolid className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                    <span>Me gusta</span>
                  </button>
                  <button
                    onClick={() => handleDownload(crossword.id)}
                    className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                    <span>Usar</span>
                  </button>
                  <button
                    onClick={() => handleRequest(crossword.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <ShareIcon className="w-4 h-4" />
                    <span>Solicitar</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Requests View */}
      {activeView === 'requests' && (
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{request.from}</h3>
                    <span className="text-sm text-gray-500">• {request.fromSchool}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Solicita acceso a: <strong>{request.crosswordTitle}</strong>
                  </p>
                  <p className="text-gray-700 mb-4">{request.message}</p>
                  <p className="text-xs text-gray-500">
                    Solicitado el {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleRequestResponse(request.id, 'accept')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center space-x-1"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Aceptar</span>
                  </button>
                  <button
                    onClick={() => handleRequestResponse(request.id, 'decline')}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center space-x-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>Rechazar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {mockRequests.length === 0 && (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes pendientes</h3>
              <p className="text-gray-600">Las solicitudes de otros profesores aparecerán aquí</p>
            </div>
          )}
        </div>
      )}

      {/* My Shared View */}
      {activeView === 'my-shared' && (
        <div className="text-center py-12">
          <ShareIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Mis Crucigramas Compartidos</h3>
          <p className="text-gray-600 mb-4">Gestiona los crucigramas que has compartido con otros profesores</p>
          <button
            onClick={() => alert('🚀 Gestión de Compartidos\n\n📊 Ver estadísticas de uso\n👥 Gestionar permisos\n📝 Editar descripciones\n🔒 Revocar accesos\n\n(Funcionalidad en desarrollo)')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Ver Mis Compartidos
          </button>
        </div>
      )}
    </div>
  )
}
