'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface CrosswordQuestion {
  id: string
  question: string
  answer: string
  category: string
  difficulty: string
}

interface CrosswordResult {
  subject: string
  topic: string
  level: string
  grade: number
  questions: CrosswordQuestion[]
  metadata: {
    generatedAt: string
    totalQuestions: number
    estimatedTime: string
  }
}

export default function CrosswordGenerator() {
  const [formData, setFormData] = useState({
    topic: '',
    educationLevel: 'basica' as 'basica' | 'media',
    grade: 8,
    difficulty: 'medio' as 'facil' | 'medio' | 'dificil',
    questionCount: 10
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CrosswordResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate-crossword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate crossword')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <SparklesIcon className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Generador de Crucigramas IA
        </h1>
        <p className="text-xl text-gray-600">
          Crea crucigramas educativos personalizados en segundos
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Configuración del Crucigrama
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema Educativo
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="Ej: Revolución Francesa, Sistema Solar, Fracciones..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel Educativo
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="basica">Educación Básica (1° - 8°)</option>
                <option value="media">Educación Media (1° - 4°)</option>
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {formData.educationLevel === 'basica' 
                  ? Array.from({length: 8}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}° Básico</option>
                    ))
                  : Array.from({length: 4}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}° Medio</option>
                    ))
                }
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificultad
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['facil', 'medio', 'dificil'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleInputChange('difficulty', level)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.difficulty === level
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Preguntas: {formData.questionCount}
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={formData.questionCount}
                onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>5</span>
                <span>20</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isGenerating || !formData.topic.trim()}
              icon={isGenerating ? <ClockIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
            >
              {isGenerating ? 'Generando Crucigrama...' : 'Generar Crucigrama'}
            </Button>
          </form>
        </Card>

        {/* Results */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Resultado
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <SparklesIcon className="w-12 h-12 text-indigo-600 animate-pulse mx-auto mb-4" />
              <p className="text-gray-600">Generando crucigrama con IA...</p>
              <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Metadata */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AcademicCapIcon className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="font-semibold text-indigo-900">{result.subject}</span>
                </div>
                <p className="text-indigo-700">
                  <strong>Tema:</strong> {result.topic}
                </p>
                <p className="text-indigo-700">
                  <strong>Nivel:</strong> {result.level}
                </p>
                <p className="text-indigo-700">
                  <strong>Preguntas:</strong> {result.metadata.totalQuestions}
                </p>
                <p className="text-indigo-700">
                  <strong>Tiempo estimado:</strong> {result.metadata.estimatedTime}
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Preguntas Generadas:</h3>
                {result.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        #{index + 1} - {question.category}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-2">{question.question}</p>
                    <p className="text-lg font-bold text-indigo-600">
                      Respuesta: {question.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="primary" size="sm" className="flex-1">
                  Editar Crucigrama
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Descargar PDF
                </Button>
              </div>
            </motion.div>
          )}

          {!result && !isGenerating && !error && (
            <div className="text-center py-12 text-gray-500">
              <SparklesIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Completa el formulario y genera tu primer crucigrama</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
