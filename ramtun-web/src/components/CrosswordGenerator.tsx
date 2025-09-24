'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  SparklesIcon,
  AcademicCapIcon,
  ClockIcon,
  ShareIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Card } from './ui/Card'
import { useAuth } from '../lib/auth'
import type { CrosswordResponse as CrosswordResult } from '../types/crossword'

export default function CrosswordGenerator() {
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    topic: '',
    educationLevel: 'basica' as 'basica' | 'media',
    grade: 8,
    difficulty: 'medio' as 'facil' | 'medio' | 'dificil',
    questionCount: 10
  })

  // 🚀 PHASE 2: Teacher-specific features
  const [teacherOptions, setTeacherOptions] = useState({
    saveToLibrary: true,
    shareWithStudents: false,
    assignToClass: false,
    selectedClass: '',
    dueDate: '',
    instructions: '',
    allowHints: true,
    timeLimit: 0, // 0 = no limit
    maxAttempts: 0 // 0 = unlimited
  })

  const [, setSavedCrosswords] = useState<string[]>([])
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CrosswordResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedWith, setGeneratedWith] = useState<'openai' | 'demo' | null>(null)
  const [isFromQuickGenerator, setIsFromQuickGenerator] = useState(false)

  const handleAutoGenerate = useCallback(async () => {
    if (!formData.topic.trim()) return

    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      // Prepare headers with authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // Add authentication header if user is available
      if (user) {
        console.log('🔍 Frontend: User object:', user)
        console.log('🔍 Frontend: User role:', user.role)
        console.log('🔍 Frontend: User metadata role:', user.user_metadata?.role)

        const authData = {
          id: user.id,
          role: user.user_metadata?.role || user.role, // Try both locations
          email: user.email
        }

        console.log('🔍 Frontend: Sending auth data:', authData)
        headers['x-ramtun-auth'] = JSON.stringify(authData)
      } else {
        console.log('❌ Frontend: No user available for auth')
      }

      const response = await fetch('/api/generate-crossword', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate crossword')
      }

      const data = await response.json()
      setResult(data)
      setGeneratedWith(data.generated_with || 'demo')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
      setIsFromQuickGenerator(false)
    }
  }, [formData, user])

  // Autocompletar desde parámetros URL o localStorage
  useEffect(() => {
    // Primero verificar parámetros URL
    const topic = searchParams.get('topic')
    const source = searchParams.get('source')
    const level = searchParams.get('level')
    const grade = searchParams.get('grade')
    const difficulty = searchParams.get('difficulty')

    // Si no hay parámetros URL, verificar localStorage
    let paramsToUse = null
    if (topic) {
      paramsToUse = { topic, source, level, grade, difficulty }
    } else {
      const storedParams = localStorage.getItem('quickGeneratorParams')
      if (storedParams) {
        const urlParams = new URLSearchParams(storedParams)
        paramsToUse = {
          topic: urlParams.get('topic'),
          source: urlParams.get('source'),
          level: urlParams.get('level'),
          grade: urlParams.get('grade'),
          difficulty: urlParams.get('difficulty')
        }
        // Limpiar localStorage después de usar
        localStorage.removeItem('quickGeneratorParams')
      }
    }

    if (paramsToUse?.topic) {
      setFormData(prev => ({
        ...prev,
        topic: paramsToUse.topic || '',
        educationLevel: (paramsToUse.level === 'media' ? 'media' : 'basica') as 'basica' | 'media',
        grade: paramsToUse.grade ? parseInt(paramsToUse.grade) : prev.grade,
        difficulty: (paramsToUse.difficulty === 'facil' || paramsToUse.difficulty === 'dificil' ? paramsToUse.difficulty : 'medio') as 'facil' | 'medio' | 'dificil'
      }))

      // Marcar si viene del generador rápido
      if (paramsToUse.source === 'quick-generator' || paramsToUse.source === 'ai-suggestion') {
        setIsFromQuickGenerator(true)
        // Auto-generar después de un breve delay para mostrar el autocompletado
        setTimeout(() => {
          handleAutoGenerate()
        }, 1500)
      }
    }
  }, [searchParams, handleAutoGenerate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      // Prepare headers with authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // Add authentication header if user is available
      if (user) {
        console.log('🔍 Frontend: User object:', user)
        console.log('🔍 Frontend: User role:', user.role)
        console.log('🔍 Frontend: User metadata role:', user.user_metadata?.role)

        const authData = {
          id: user.id,
          role: user.user_metadata?.role || user.role, // Try both locations
          email: user.email
        }

        console.log('🔍 Frontend: Sending auth data:', authData)
        headers['x-ramtun-auth'] = JSON.stringify(authData)
      } else {
        console.log('❌ Frontend: No user available for auth')
      }

      const response = await fetch('/api/generate-crossword', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate crossword')
      }

      const data = await response.json()
      setResult(data)
      setGeneratedWith(data.generated_with || 'demo')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
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

        {/* Quick Generator Indicator */}
        {isFromQuickGenerator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4 max-w-md mx-auto"
          >
            <div className="flex items-center justify-center space-x-2">
              <SparklesIcon className="w-5 h-5 text-indigo-600" />
              <p className="text-indigo-800 font-medium">
                ¡Generando automáticamente desde Dashboard!
              </p>
            </div>
            <p className="text-indigo-600 text-sm mt-1 text-center">
              Tema autocompletado: &quot;{formData.topic}&quot;
            </p>
          </motion.div>
        )}
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
                    ? searchParams.get('topic') ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300'
                    : 'border-gray-300 focus:border-amber-400 focus:ring-amber-200'
                }`}
                required
              />
              {formData.topic.trim() && (
                <p className={`text-xs mt-1 font-medium ${
                  formData.topic.trim().length < 3
                    ? 'text-red-600'
                    : searchParams.get('topic') ? 'text-indigo-600' : 'text-green-600'
                }`}>
                  {formData.topic.trim().length < 3
                    ? '⚠️ El tema debe tener al menos 3 caracteres'
                    : searchParams.get('topic')
                      ? '🚀 Autocompletado desde Dashboard - Listo para generar'
                      : '✓ Tema válido - Listo para generar'
                  }
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
                    className={`px-4 py-3 rounded-lg border-2 transition-all font-medium flex items-center justify-center min-h-[48px] ${
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
                <div className="flex gap-2 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={() => handleInputChange('topic', 'Revolución Francesa')}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs font-medium transition-colors flex items-center justify-center"
                  >
                    Revolución Francesa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('topic', 'Sistema Solar')}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs font-medium transition-colors flex items-center justify-center"
                  >
                    Sistema Solar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('topic', 'Fracciones')}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs font-medium transition-colors flex items-center justify-center"
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
              disabled={isGenerating || !formData.topic.trim() || formData.topic.trim().length < 3}
              className={`w-full rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                !formData.topic.trim() || formData.topic.trim().length < 3
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                  : 'hover:scale-105 shadow-lg hover:shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              style={{
                color: '#ffffff !important',
                backgroundColor: (!formData.topic.trim() || formData.topic.trim().length < 3) ? '#9CA3AF' : '#4F46E5',
                padding: '20px 48px',
                minHeight: '64px'
              }}
            >
              {isGenerating ? (
                <ClockIcon className="w-6 h-6 animate-spin text-white" />
              ) : (!formData.topic.trim() || formData.topic.trim().length < 3) ? (
                <SparklesIcon className="w-6 h-6 text-white" />
              ) : (
                <span style={{ fontSize: '24px' }}>🚀</span>
              )}
              <span style={{
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '18px',
                letterSpacing: '0.5px',
                lineHeight: '1.2'
              }}>
                {isGenerating
                  ? 'Generando Crucigrama...'
                  : !formData.topic.trim()
                    ? 'Ingresa un Tema para Continuar'
                    : formData.topic.trim().length < 3
                      ? 'Tema debe tener al menos 3 caracteres'
                      : 'Generar Crucigrama con IA'
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
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <AcademicCapIcon className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="font-semibold text-indigo-900">{result.subject}</span>
                  </div>
                  {generatedWith && (
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                      generatedWith === 'openai'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-orange-100 text-orange-800 border-orange-200'
                    }`}>
                      {generatedWith === 'openai' ? '🤖 IA OpenAI' : '🎭 DEMO'}
                    </span>
                  )}
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
                {generatedWith === 'demo' && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 mt-0.5">🎭</span>
                      <div>
                        <p className="font-semibold">Modo Demo Activo</p>
                        <p className="text-xs mt-1 text-orange-700">
                          Estás viendo contenido de demostración. Para generar crucigramas con IA real,
                          configura tu API key de OpenAI en el archivo .env.local
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                  onClick={() => {
                    alert('🚧 Editor Visual en Desarrollo\n\nEsta funcionalidad estará disponible en la próxima versión:\n\n✨ Editor drag & drop\n🎨 Personalización visual\n📐 Ajuste de layout\n\n¡Mantente atento a las actualizaciones!')
                  }}
                  className="flex-1 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
                  style={{
                    backgroundColor: '#4F46E5',
                    color: '#ffffff',
                    border: '2px solid #4F46E5',
                    padding: '16px 24px',
                    minHeight: '56px'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span style={{
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '1.3'
                  }}>
                    Editar Crucigrama
                  </span>
                </button>
                <button
                  onClick={() => {
                    // Funcionalidad básica de descarga como texto
                    const content = result.questions.map((q, i) =>
                      `${i + 1}. ${q.question}\nRespuesta: ${q.answer}\nCategoría: ${q.category}\nDificultad: ${q.difficulty}\n`
                    ).join('\n');

                    const blob = new Blob([`CRUCIGRAMA GENERADO - ${result.subject}\n\nTema: ${formData.topic}\nNivel: ${formData.educationLevel}\nCurso: ${formData.grade}\nDificultad: ${formData.difficulty}\nCantidad: ${result.questions.length} preguntas\n\n${content}`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `crucigrama-${formData.topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#4F46E5',
                    border: '2px solid #4F46E5',
                    padding: '16px 24px',
                    minHeight: '56px'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span style={{
                    color: '#4F46E5',
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '1.3'
                  }}>
                    Descargar TXT
                  </span>
                </button>
              </div>

              {/* 🚀 PHASE 2: Teacher-Specific Features */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Opciones para Profesores
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Save and Share Options */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-indigo-800">Guardar y Compartir</h4>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={teacherOptions.saveToLibrary}
                        onChange={(e) => setTeacherOptions(prev => ({ ...prev, saveToLibrary: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Guardar en mi biblioteca</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={teacherOptions.shareWithStudents}
                        onChange={(e) => setTeacherOptions(prev => ({ ...prev, shareWithStudents: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Compartir con estudiantes</span>
                    </label>

                    <button
                      onClick={() => {
                        if (teacherOptions.saveToLibrary) {
                          setSavedCrosswords(prev => [...prev, result.topic])
                          setShowSaveSuccess(true)
                          setTimeout(() => setShowSaveSuccess(false), 3000)
                        }
                        alert('🚀 Funcionalidad de Compartir\n\n✅ Crucigrama guardado en biblioteca\n📤 Enlace de compartir generado\n👥 Notificación enviada a estudiantes\n\n(Simulación - Funcionalidad completa en desarrollo)')
                      }}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <ShareIcon className="w-4 h-4" />
                      <span>Guardar y Compartir</span>
                    </button>
                  </div>

                  {/* Assignment Options */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-indigo-800">Opciones de Asignación</h4>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Límite de tiempo (minutos)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={teacherOptions.timeLimit}
                        onChange={(e) => setTeacherOptions(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="0 = Sin límite"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Intentos máximos
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={teacherOptions.maxAttempts}
                        onChange={(e) => setTeacherOptions(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="0 = Ilimitados"
                      />
                    </div>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={teacherOptions.allowHints}
                        onChange={(e) => setTeacherOptions(prev => ({ ...prev, allowHints: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Permitir pistas</span>
                    </label>
                  </div>
                </div>

                {/* Success Message */}
                {showSaveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 text-sm font-medium">
                      ¡Crucigrama guardado exitosamente en tu biblioteca!
                    </span>
                  </motion.div>
                )}
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
