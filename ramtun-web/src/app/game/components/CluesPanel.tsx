'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface CrosswordQuestion {
  id: string
  question: string
  answer: string
  category: string
  difficulty: string
  position: {
    row: number
    col: number
    direction: 'horizontal' | 'vertical'
  }
  number: number
}

interface CluesPanelProps {
  questions: CrosswordQuestion[]
  selectedQuestion: string | null
  onQuestionSelect: (questionId: string) => void
  userAnswers: Record<string, string>
  correctAnswers: Record<string, boolean>
  onAnswerSubmit: (questionId: string, answer: string) => void
  hints: Record<string, string>
  isCompleted: boolean
}

export default function CluesPanel({
  questions,
  selectedQuestion,
  onQuestionSelect,
  userAnswers,
  correctAnswers,
  onAnswerSubmit,
  hints,
  isCompleted
}: CluesPanelProps) {
  const [showAnswers, setShowAnswers] = useState(false)
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  const horizontalQuestions = questions.filter(q => q.position.direction === 'horizontal')
  const verticalQuestions = questions.filter(q => q.position.direction === 'vertical')

  const handleInputChange = (questionId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [questionId]: value }))
  }

  const handleInputSubmit = (questionId: string) => {
    const answer = inputValues[questionId] || ''
    if (answer.trim()) {
      onAnswerSubmit(questionId, answer.trim())
      setInputValues(prev => ({ ...prev, [questionId]: '' }))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, questionId: string) => {
    if (e.key === 'Enter') {
      handleInputSubmit(questionId)
    }
  }

  const getQuestionStatus = (questionId: string) => {
    if (correctAnswers[questionId] === true) return 'correct'
    if (correctAnswers[questionId] === false) return 'incorrect'
    if (userAnswers[questionId]) return 'answered'
    return 'unanswered'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'incorrect':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-100 border-blue-300'
    }
    
    switch (status) {
      case 'correct':
        return 'bg-green-50 border-green-200'
      case 'incorrect':
        return 'bg-red-50 border-red-200'
      case 'answered':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-white border-gray-200 hover:bg-gray-50'
    }
  }

  const ClueSection = ({ 
    title, 
    icon, 
    questions: sectionQuestions 
  }: { 
    title: string
    icon: React.ReactNode
    questions: CrosswordQuestion[] 
  }) => (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        {icon}
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">({sectionQuestions.length})</span>
      </div>
      
      <div className="space-y-2">
        {sectionQuestions.map((question) => {
          const status = getQuestionStatus(question.id)
          const isSelected = selectedQuestion === question.id
          
          return (
            <motion.div
              key={question.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${getStatusColor(status, isSelected)}`}
              onClick={() => onQuestionSelect(question.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-indigo-600">{question.number}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {question.category}
                    </span>
                    {getStatusIcon(status)}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{question.question}</p>
                  
                  {/* Hint */}
                  {hints[question.id] && (
                    <div className="flex items-start space-x-2 mb-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <LightBulbIcon className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-800">{hints[question.id]}</p>
                    </div>
                  )}
                  
                  {/* Answer Input */}
                  {!isCompleted && status !== 'correct' && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inputValues[question.id] || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, question.id)}
                        placeholder={`${question.answer.length} letras`}
                        maxLength={question.answer.length}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                      <button
                        onClick={() => handleInputSubmit(question.id)}
                        disabled={!inputValues[question.id]?.trim()}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        OK
                      </button>
                    </div>
                  )}
                  
                  {/* Show user answer */}
                  {userAnswers[question.id] && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Tu respuesta: </span>
                      <span className={`text-sm font-medium ${
                        status === 'correct' ? 'text-green-600' : 
                        status === 'incorrect' ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        {userAnswers[question.id]}
                      </span>
                    </div>
                  )}
                  
                  {/* Show correct answer if completed or if showing answers */}
                  {(isCompleted || showAnswers) && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Respuesta correcta: </span>
                      <span className="text-sm font-medium text-green-600">
                        {question.answer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Pistas</h2>
        
        {/* Toggle answers visibility */}
        {!isCompleted && (
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showAnswers 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showAnswers ? (
              <>
                <EyeSlashIcon className="w-4 h-4" />
                <span>Ocultar Respuestas</span>
              </>
            ) : (
              <>
                <EyeIcon className="w-4 h-4" />
                <span>Ver Respuestas</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Horizontal Clues */}
      <ClueSection
        title="Horizontales"
        icon={<ArrowRightIcon className="w-5 h-5 text-blue-600" />}
        questions={horizontalQuestions}
      />

      {/* Vertical Clues */}
      <ClueSection
        title="Verticales"
        icon={<ArrowDownIcon className="w-5 h-5 text-green-600" />}
        questions={verticalQuestions}
      />

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Progreso</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Correctas:</span>
            <span className="ml-2 font-medium text-green-600">
              {Object.values(correctAnswers).filter(Boolean).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total:</span>
            <span className="ml-2 font-medium text-gray-900">
              {questions.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
