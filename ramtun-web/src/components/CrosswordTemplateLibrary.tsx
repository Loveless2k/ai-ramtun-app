'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  StarIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

interface CrosswordTemplate {
  id: string
  title: string
  subject: string
  grade: string
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  questions: number
  estimatedTime: string
  description: string
  tags: string[]
  rating: number
  uses: number
  isFavorite: boolean
  isOfficial: boolean
  preview: {
    sampleQuestions: string[]
    layout: string
    theme: string
  }
  metadata: {
    createdBy: string
    lastUpdated: string
    curriculum: string[]
    learningObjectives: string[]
  }
}

export default function CrosswordTemplateLibrary() {
  const [templates, setTemplates] = useState<CrosswordTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<CrosswordTemplate[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'uses' | 'recent'>('rating')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Mock template data
  const mockTemplates = useMemo<CrosswordTemplate[]>(() => [
    {
      id: '1',
      title: 'Historia de Chile - Independencia',
      subject: 'Historia',
      grade: '8° Básico',
      difficulty: 'Medio',
      questions: 15,
      estimatedTime: '20-25 min',
      description: 'Template completo sobre la Independencia de Chile, incluyendo personajes, batallas y fechas importantes.',
      tags: ['independencia', 'chile', 'historia', 'siglo-xix'],
      rating: 4.8,
      uses: 234,
      isFavorite: true,
      isOfficial: true,
      preview: {
        sampleQuestions: ['Padre de la Patria chilena', 'Batalla decisiva de 1818', 'Primera Junta de Gobierno'],
        layout: 'Crucigrama clásico 15x15',
        theme: 'Histórico patriótico'
      },
      metadata: {
        createdBy: 'Equipo Ramtun',
        lastUpdated: '2024-01-15',
        curriculum: ['Historia 8° Básico - Unidad 1'],
        learningObjectives: ['Analizar el proceso de independencia', 'Identificar personajes históricos']
      }
    },
    {
      id: '2',
      title: 'Ecosistemas y Biodiversidad',
      subject: 'Ciencias',
      grade: '6° Básico',
      difficulty: 'Fácil',
      questions: 12,
      estimatedTime: '15-20 min',
      description: 'Explora los diferentes ecosistemas, cadenas alimentarias y la importancia de la biodiversidad.',
      tags: ['ecosistemas', 'biodiversidad', 'ciencias-naturales', 'medio-ambiente'],
      rating: 4.9,
      uses: 456,
      isFavorite: false,
      isOfficial: true,
      preview: {
        sampleQuestions: ['Conjunto de seres vivos en un área', 'Animal que se alimenta de plantas', 'Proceso de fotosíntesis'],
        layout: 'Crucigrama temático 12x12',
        theme: 'Naturaleza verde'
      },
      metadata: {
        createdBy: 'Equipo Ramtun',
        lastUpdated: '2024-01-12',
        curriculum: ['Ciencias 6° Básico - Unidad 3'],
        learningObjectives: ['Comprender ecosistemas', 'Identificar relaciones alimentarias']
      }
    },
    {
      id: '3',
      title: 'Fracciones y Decimales',
      subject: 'Matemáticas',
      grade: '5° Básico',
      difficulty: 'Medio',
      questions: 10,
      estimatedTime: '18-22 min',
      description: 'Template para practicar conceptos de fracciones, decimales y sus operaciones básicas.',
      tags: ['fracciones', 'decimales', 'matemáticas', 'números'],
      rating: 4.6,
      uses: 189,
      isFavorite: true,
      isOfficial: false,
      preview: {
        sampleQuestions: ['Parte de un entero', 'Fracción con denominador 10', 'Operación de sumar fracciones'],
        layout: 'Crucigrama numérico 10x10',
        theme: 'Matemático moderno'
      },
      metadata: {
        createdBy: 'Prof. María González',
        lastUpdated: '2024-01-08',
        curriculum: ['Matemáticas 5° Básico - Unidad 2'],
        learningObjectives: ['Operar con fracciones', 'Convertir fracciones a decimales']
      }
    }
  ], [])

  useEffect(() => {
    setTemplates(mockTemplates)
    setFilteredTemplates(mockTemplates)
  }, [mockTemplates])

  useEffect(() => {
    const filtered = templates.filter(template => {
      const matchesSubject = selectedSubject === 'all' || template.subject === selectedSubject
      const matchesGrade = selectedGrade === 'all' || template.grade === selectedGrade
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty
      const matchesSearch = searchQuery === '' || 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesFavorites = !showFavoritesOnly || template.isFavorite

      return matchesSubject && matchesGrade && matchesDifficulty && matchesSearch && matchesFavorites
    })

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'uses':
          return b.uses - a.uses
        case 'recent':
          return new Date(b.metadata.lastUpdated).getTime() - new Date(a.metadata.lastUpdated).getTime()
        default:
          return 0
      }
    })

    setFilteredTemplates(filtered)
  }, [templates, selectedSubject, selectedGrade, selectedDifficulty, searchQuery, sortBy, showFavoritesOnly])

  const handleToggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ))
  }

  const handleUseTemplate = (template: CrosswordTemplate) => {
    alert(`🚀 Usando Template: ${template.title}\n\n✅ Template cargado en el generador\n🎨 Puedes personalizarlo antes de generar\n📝 Preguntas y estructura pre-configuradas\n\n(Redirigiendo al generador...)`)
    
    // Simulate redirect to generator with template
    const params = new URLSearchParams({
      template: template.id,
      topic: template.title,
      subject: template.subject,
      grade: template.grade.replace('°', '').replace(' Básico', '').replace(' Medio', ''),
      difficulty: template.difficulty.toLowerCase()
    })
    
    setTimeout(() => {
      window.location.href = `/generator?${params.toString()}`
    }, 1000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800'
      case 'Medio': return 'bg-yellow-100 text-yellow-800'
      case 'Difícil': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Templates</h2>
          <p className="text-gray-600">Templates pre-diseñados para crear crucigramas rápidamente</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{filteredTemplates.length} templates</span>
          <button
            onClick={() => alert('🚀 Crear Template\n\n📝 Guarda tu crucigrama como template\n🔄 Reutiliza estructura y preguntas\n📤 Comparte con otros profesores\n\n(Funcionalidad en desarrollo)')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Crear Template</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar templates..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todas</option>
              <option value="Historia">Historia</option>
              <option value="Ciencias">Ciencias</option>
              <option value="Matemáticas">Matemáticas</option>
              <option value="Lenguaje">Lenguaje</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todos</option>
              <option value="5° Básico">5° Básico</option>
              <option value="6° Básico">6° Básico</option>
              <option value="7° Básico">7° Básico</option>
              <option value="8° Básico">8° Básico</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todas</option>
              <option value="Fácil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'uses' | 'recent')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="rating">Mejor valorados</option>
              <option value="uses">Más usados</option>
              <option value="recent">Más recientes</option>
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="mt-4 flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Solo favoritos</span>
          </label>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{template.title}</h3>
                  {template.isOfficial && (
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                      Oficial
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{template.subject} • {template.grade}</p>
              </div>
              <button
                onClick={() => handleToggleFavorite(template.id)}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                {template.isFavorite ? (
                  <StarSolid className="w-5 h-5 text-yellow-500" />
                ) : (
                  <StarIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-gray-500 text-xs">+{template.tags.length - 3} más</span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  <span>{template.uses}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{template.estimatedTime}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                {template.difficulty}
              </span>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Vista previa:</p>
              <div className="space-y-1">
                {template.preview.sampleQuestions.slice(0, 2).map((question, index) => (
                  <p key={index} className="text-xs text-gray-600">• {question}</p>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => alert(`📋 Detalles del Template\n\n📚 ${template.title}\n👨‍🏫 Creado por: ${template.metadata.createdBy}\n📅 Actualizado: ${template.metadata.lastUpdated}\n🎯 Objetivos: ${template.metadata.learningObjectives.join(', ')}\n\n(Vista detallada en desarrollo)`)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center space-x-1"
              >
                <EyeIcon className="w-4 h-4" />
                <span>Ver</span>
              </button>
              <button
                onClick={() => handleUseTemplate(template)}
                className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center space-x-1"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Usar</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron templates</h3>
          <p className="text-gray-600 mb-4">Intenta ajustar los filtros o crear un nuevo template</p>
          <button
            onClick={() => {
              setSelectedSubject('all')
              setSelectedGrade('all')
              setSelectedDifficulty('all')
              setSearchQuery('')
              setShowFavoritesOnly(false)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  )
}
