'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PuzzlePieceIcon,
  PlayIcon,
  StarIcon,
  ClockIcon,
  AcademicCapIcon,
  UserGroupIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

// Mock data - En producción vendría de la API
const mockAvailableGames = [
  {
    id: 'revolucion-francesa',
    title: 'Revolución Francesa',
    subject: 'Historia',
    grade: '8° Básico',
    difficulty: 'Medio',
    questions: 15,
    estimatedTime: '12-15 min',
    thumbnail: '🏛️',
    description: 'Descubre los eventos y personajes clave de la Revolución Francesa',
    completions: 234,
    averageScore: 87,
    isNew: false
  },
  {
    id: 'sistema-solar',
    title: 'Sistema Solar',
    subject: 'Ciencias',
    grade: '6° Básico',
    difficulty: 'Fácil',
    questions: 12,
    estimatedTime: '8-10 min',
    thumbnail: '🌌',
    description: 'Explora planetas, estrellas y otros cuerpos celestes',
    completions: 456,
    averageScore: 92,
    isNew: true
  },
  {
    id: 'fracciones-basicas',
    title: 'Fracciones Básicas',
    subject: 'Matemáticas',
    grade: '5° Básico',
    difficulty: 'Fácil',
    questions: 10,
    estimatedTime: '6-8 min',
    thumbnail: '🔢',
    description: 'Aprende conceptos fundamentales de fracciones',
    completions: 189,
    averageScore: 85,
    isNew: false
  },
  {
    id: 'animales-vertebrados',
    title: 'Animales Vertebrados',
    subject: 'Ciencias',
    grade: '4° Básico',
    difficulty: 'Fácil',
    questions: 8,
    estimatedTime: '5-7 min',
    thumbnail: '🦴',
    description: 'Conoce las características de los animales vertebrados',
    completions: 312,
    averageScore: 90,
    isNew: false
  },
  {
    id: 'independencia-chile',
    title: 'Independencia de Chile',
    subject: 'Historia',
    grade: '7° Básico',
    difficulty: 'Medio',
    questions: 18,
    estimatedTime: '15-18 min',
    thumbnail: '🇨🇱',
    description: 'Revive los momentos históricos de la independencia chilena',
    completions: 167,
    averageScore: 83,
    isNew: true
  },
  {
    id: 'geometria-basica',
    title: 'Geometría Básica',
    subject: 'Matemáticas',
    grade: '6° Básico',
    difficulty: 'Medio',
    questions: 14,
    estimatedTime: '10-12 min',
    thumbnail: '📐',
    description: 'Domina formas, ángulos y medidas geométricas',
    completions: 278,
    averageScore: 88,
    isNew: false
  }
]

const subjects = ['Todos', 'Historia', 'Ciencias', 'Matemáticas']
const difficulties = ['Todas', 'Fácil', 'Medio', 'Difícil']

export default function GamePage() {
  const [selectedSubject, setSelectedSubject] = useState('Todos')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas')

  const filteredGames = mockAvailableGames.filter(game => {
    const matchesSubject = selectedSubject === 'Todos' || game.subject === selectedSubject
    const matchesDifficulty = selectedDifficulty === 'Todas' || game.difficulty === selectedDifficulty
    return matchesSubject && matchesDifficulty
  })

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <PuzzlePieceIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ramtun Games</h1>
                <p className="text-gray-600">Aprende jugando con crucigramas educativos</p>
              </div>
            </div>
            
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrophyIcon className="w-4 h-4" />
            <span>¡Desafía tu conocimiento!</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Crucigramas Educativos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Selecciona un crucigrama y pon a prueba tus conocimientos mientras te diviertes aprendiendo
          </p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredGames.length} crucigrama{filteredGames.length !== 1 ? 's' : ''} disponible{filteredGames.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="relative p-6 pb-4">
                {game.isNew && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NUEVO
                    </span>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{game.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{game.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <span>{game.subject}</span>
                      <span>•</span>
                      <span>{game.grade}</span>
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="px-6 pb-4">
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-gray-900 font-semibold">
                      <PuzzlePieceIcon className="w-4 h-4" />
                      <span>{game.questions}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Preguntas</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-gray-900 font-semibold">
                      <ClockIcon className="w-4 h-4" />
                      <span>{game.estimatedTime}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Duración</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{game.completions} jugadores</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span>{game.averageScore}% promedio</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6">
                <Link
                  href={`/game/${game.id}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors group-hover:scale-105 transform duration-200"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Jugar Ahora
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <PuzzlePieceIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay crucigramas disponibles</h3>
            <p className="text-gray-600">Intenta ajustar los filtros para encontrar más opciones</p>
          </div>
        )}
      </div>
    </div>
  )
}
