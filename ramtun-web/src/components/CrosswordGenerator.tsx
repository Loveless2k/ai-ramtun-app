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
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
            Configuración del Crucigrama
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tema Educativo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="Ej: Revolución Francesa, Sistema Solar, Fracciones..."
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500 transition-colors ${
                  formData.topic.trim()
                    ? 'border-gray-300'
                    : 'border-gray-300 focus:border-amber-400 focus:ring-amber-200'
                }`}
                required
              />
              {formData.topic.trim() && (
                <p className="text-green-600 text-xs mt-1 font-medium">
                  ✓ Tema válido - Listo para generar
                </p>
              )}
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nivel Educativo
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              >
                <option value="basica">Educación Básica (1° - 8°)</option>
                <option value="media">Educación Media (1° - 4°)</option>
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Curso
              </label>
              <select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Dificultad
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['facil', 'medio', 'dificil'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleInputChange('difficulty', level)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                      formData.difficulty === level
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cantidad de Preguntas: <span className="text-indigo-600 font-bold">{formData.questionCount}</span>
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={formData.questionCount}
                onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((formData.questionCount - 5) / 15) * 100}%, #e5e7eb ${((formData.questionCount - 5) / 15) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-700 font-medium mt-2">
                <span>5</span>
                <span>20</span>
              </div>
            </div>

            {/* Helper Banner */}
            {!formData.topic.trim() && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm font-medium mb-3">
                  💡 Ingresa un tema educativo para generar tu crucigrama
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleInputChange('topic', 'Revolución Francesa')}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs font-medium transition-colors"
                  >
                    Revolución Francesa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('topic', 'Sistema Solar')}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs font-medium transition-colors"
                  >
                    Sistema Solar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('topic', 'Fracciones')}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs font-medium transition-colors"
                  >
                    Fracciones
                  </button>
                </div>
              </div>
            )}

            {/* Success Indicator */}
            {formData.topic.trim() && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm font-medium">
                  ✅ Configuración completa - Listo para generar crucigrama
                </p>
              </div>
            )}

            {/* Submit Button - ALWAYS VISIBLE */}
            <button
              type="submit"
              disabled={isGenerating || !formData.topic.trim()}
              className={`w-full h-14 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-4 ${
                !formData.topic.trim()
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                  : 'hover:scale-105 shadow-lg hover:shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              style={{
                color: '#ffffff !important',
                backgroundColor: !formData.topic.trim() ? '#9CA3AF' : '#4F46E5',
                padding: '16px 48px',
                minHeight: '56px'
              }}
            >
              {isGenerating ? (
                <ClockIcon className="w-6 h-6 animate-spin text-white" />
              ) : (
                <SparklesIcon className="w-6 h-6 text-white" />
              )}
              <span style={{
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '18px',
                letterSpacing: '0.5px'
              }}>
                {isGenerating
                  ? 'Generando Crucigrama...'
                  : !formData.topic.trim()
                    ? 'Ingresa un Tema para Continuar'
                    : '🚀 Generar Crucigrama con IA'
                }
              </span>
            </button>
          </form>
        </Card>

        {/* Results */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
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
                  <div key={question.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                        #{index + 1} - {question.category}
                      </span>
                      <span
                        className="text-sm font-bold px-4 py-2 rounded-full border-2"
                        style={{
                          backgroundColor: '#EEF2FF',
                          borderColor: '#4F46E5',
                          color: '#4F46E5'
                        }}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-4 text-base leading-relaxed">{question.question}</p>
                    <div
                      className="text-lg font-bold px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: '#F0F9FF',
                        borderLeft: '4px solid #0EA5E9',
                        color: '#0369A1'
                      }}
                    >
                      Respuesta: {question.answer}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  className="flex-1 h-12 px-6 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                  style={{
                    backgroundColor: '#4F46E5',
                    color: '#ffffff',
                    border: '2px solid #4F46E5'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    Editar Crucigrama
                  </span>
                </button>
                <button
                  className="flex-1 h-12 px-6 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#4F46E5',
                    border: '2px solid #4F46E5'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span style={{ color: '#4F46E5', fontWeight: '600' }}>
                    Descargar PDF
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {!result && !isGenerating && !error && (
            <div className="text-center py-12">
              <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-700 font-medium text-lg">Completa el formulario y genera tu primer crucigrama</p>
              <p className="text-gray-500 text-sm mt-2">La IA creará preguntas personalizadas para tu nivel educativo</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
