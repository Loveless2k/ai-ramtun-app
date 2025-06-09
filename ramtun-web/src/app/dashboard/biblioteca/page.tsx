'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { PuzzlePieceIcon } from '@heroicons/react/24/solid'

// Mock data - En producción vendría de la API
const mockCrosswords = [
  {
    id: 1,
    title: 'Revolución Francesa',
    subject: 'Historia',
    grade: '8° Básico',
    difficulty: 'Medio',
    questions: 15,
    completions: 23,
    createdAt: '2024-01-15',
    status: 'Activo',
    thumbnail: '🏛️'
  },
  {
    id: 2,
    title: 'Sistema Solar',
    subject: 'Ciencias',
    grade: '6° Básico', 
    difficulty: 'Fácil',
    questions: 12,
    completions: 18,
    createdAt: '2024-01-14',
    status: 'Activo',
    thumbnail: '🌌'
  },
  {
    id: 3,
    title: 'Fracciones Básicas',
    subject: 'Matemáticas',
    grade: '5° Básico',
    difficulty: 'Fácil',
    questions: 10,
    completions: 31,
    createdAt: '2024-01-12',
    status: 'Completado',
    thumbnail: '🔢'
  },
  {
    id: 4,
    title: 'Animales Vertebrados',
    subject: 'Ciencias',
    grade: '4° Básico',
    difficulty: 'Fácil',
    questions: 8,
    completions: 15,
    createdAt: '2024-01-10',
    status: 'Borrador',
    thumbnail: '🦴'
  },
  {
    id: 5,
    title: 'Independencia de Chile',
    subject: 'Historia',
    grade: '7° Básico',
    difficulty: 'Medio',
    questions: 18,
    completions: 42,
    createdAt: '2024-01-08',
    status: 'Activo',
    thumbnail: '🇨🇱'
  },
  {
    id: 6,
    title: 'Geometría Básica',
    subject: 'Matemáticas',
    grade: '6° Básico',
    difficulty: 'Medio',
    questions: 14,
    completions: 27,
    createdAt: '2024-01-05',
    status: 'Activo',
    thumbnail: '📐'
  }
]

const subjects = ['Todos', 'Historia', 'Ciencias', 'Matemáticas', 'Lenguaje']
const difficulties = ['Todas', 'Fácil', 'Medio', 'Difícil']
const statuses = ['Todos', 'Activo', 'Borrador', 'Completado']

export default function BibliotecaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('Todos')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas')
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCrosswords = mockCrosswords.filter(crossword => {
    const matchesSearch = crossword.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crossword.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === 'Todos' || crossword.subject === selectedSubject
    const matchesDifficulty = selectedDifficulty === 'Todas' || crossword.difficulty === selectedDifficulty
    const matchesStatus = selectedStatus === 'Todos' || crossword.status === selectedStatus

    return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-100 text-green-800'
      case 'Borrador':
        return 'bg-yellow-100 text-yellow-800'
      case 'Completado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-100 text-green-800'
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800'
      case 'Difícil':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Biblioteca</h1>
          <p className="text-gray-600">Gestiona todos tus crucigramas creados</p>
        </div>
        <Link
          href="/generator"
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo Crucigrama
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar crucigramas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {filteredCrosswords.length} de {mockCrosswords.length} crucigramas
          </p>
          
          {/* View mode toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Crosswords Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrosswords.map((crossword) => (
            <div key={crossword.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{crossword.thumbnail}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{crossword.title}</h3>
                      <p className="text-sm text-gray-600">{crossword.subject} • {crossword.grade}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(crossword.status)}`}>
                    {crossword.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{crossword.questions}</p>
                    <p className="text-xs text-gray-600">Preguntas</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{crossword.completions}</p>
                    <p className="text-xs text-gray-600">Completadas</p>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(crossword.difficulty)}`}>
                    {crossword.difficulty}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                  <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crucigrama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dificultad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCrosswords.map((crossword) => (
                  <tr key={crossword.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{crossword.thumbnail}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{crossword.title}</div>
                          <div className="text-sm text-gray-500">{crossword.questions} preguntas</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{crossword.subject}</div>
                      <div className="text-sm text-gray-500">{crossword.grade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(crossword.difficulty)}`}>
                        {crossword.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(crossword.status)}`}>
                        {crossword.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {crossword.completions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(crossword.createdAt).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <ShareIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredCrosswords.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <PuzzlePieceIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron crucigramas</h3>
          <p className="text-gray-600 mb-6">Intenta ajustar los filtros o crear un nuevo crucigrama</p>
          <Link
            href="/generator"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Primer Crucigrama
          </Link>
        </div>
      )}
    </div>
  )
}
