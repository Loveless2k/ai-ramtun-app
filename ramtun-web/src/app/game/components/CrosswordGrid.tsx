'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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

interface CrosswordGridProps {
  questions: CrosswordQuestion[]
  onAnswerChange: (questionId: string, answer: string) => void
  onQuestionSelect: (questionId: string) => void
  selectedQuestion: string | null
  userAnswers: Record<string, string>
  correctAnswers: Record<string, boolean>
  isCompleted: boolean
}

interface GridCell {
  letter: string | null
  questionIds: string[]
  number: number | null
  isActive: boolean
  isCorrect: boolean | null
}

export default function CrosswordGrid({
  questions,
  onAnswerChange,
  onQuestionSelect,
  selectedQuestion,
  userAnswers,
  correctAnswers,
  isCompleted
}: CrosswordGridProps) {
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [gridSize, setGridSize] = useState({ rows: 15, cols: 15 })
  const [focusedCell, setFocusedCell] = useState<{ row: number, col: number } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Initialize grid
  useEffect(() => {
    initializeGrid()
  }, [questions])

  // Update grid when answers change
  useEffect(() => {
    updateGridWithAnswers()
  }, [userAnswers, correctAnswers, selectedQuestion])

  const initializeGrid = () => {
    const newGrid: GridCell[][] = Array(gridSize.rows).fill(null).map(() =>
      Array(gridSize.cols).fill(null).map(() => ({
        letter: null,
        questionIds: [],
        number: null,
        isActive: false,
        isCorrect: null
      }))
    )

    // Place questions in grid
    questions.forEach((question) => {
      const { row, col, direction } = question.position
      const answer = question.answer.toUpperCase()

      // Mark starting cell with number
      if (newGrid[row] && newGrid[row][col]) {
        newGrid[row][col].number = question.number
        newGrid[row][col].questionIds.push(question.id)
      }

      // Place letters
      for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'vertical' ? row + i : row
        const currentCol = direction === 'horizontal' ? col + i : col

        if (newGrid[currentRow] && newGrid[currentRow][currentCol]) {
          newGrid[currentRow][currentCol].letter = answer[i]
          newGrid[currentRow][currentCol].isActive = true
          if (!newGrid[currentRow][currentCol].questionIds.includes(question.id)) {
            newGrid[currentRow][currentCol].questionIds.push(question.id)
          }
        }
      }
    })

    setGrid(newGrid)
  }

  const updateGridWithAnswers = () => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => 
        row.map(cell => ({
          ...cell,
          isCorrect: cell.isActive ? null : null
        }))
      )

      // Update correctness based on user answers
      questions.forEach((question) => {
        const userAnswer = userAnswers[question.id] || ''
        const isCorrect = correctAnswers[question.id]
        const { row, col, direction } = question.position

        for (let i = 0; i < question.answer.length; i++) {
          const currentRow = direction === 'vertical' ? row + i : row
          const currentCol = direction === 'horizontal' ? col + i : col

          if (newGrid[currentRow] && newGrid[currentRow][currentCol]) {
            if (isCompleted) {
              newGrid[currentRow][currentCol].isCorrect = isCorrect
            } else if (userAnswer.length > i) {
              const userLetter = userAnswer[i].toUpperCase()
              const correctLetter = question.answer[i].toUpperCase()
              newGrid[currentRow][currentCol].isCorrect = userLetter === correctLetter
            }
          }
        }
      })

      return newGrid
    })
  }

  const handleCellClick = (row: number, col: number) => {
    const cell = grid[row][col]
    if (!cell.isActive) return

    setFocusedCell({ row, col })

    // Find which question this cell belongs to
    if (cell.questionIds.length > 0) {
      // If multiple questions intersect, cycle through them
      const currentIndex = cell.questionIds.indexOf(selectedQuestion || '')
      const nextIndex = (currentIndex + 1) % cell.questionIds.length
      onQuestionSelect(cell.questionIds[nextIndex])
    }
  }

  const getCellClassName = (cell: GridCell, row: number, col: number) => {
    let className = 'w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-bold relative transition-all duration-200 '

    if (!cell.isActive) {
      className += 'bg-gray-900 '
    } else {
      className += 'bg-white cursor-pointer hover:bg-blue-50 '
      
      // Highlight selected question
      if (selectedQuestion && cell.questionIds.includes(selectedQuestion)) {
        className += 'bg-blue-100 border-blue-400 '
      }

      // Show correctness
      if (cell.isCorrect === true) {
        className += 'bg-green-100 border-green-400 text-green-800 '
      } else if (cell.isCorrect === false) {
        className += 'bg-red-100 border-red-400 text-red-800 '
      }

      // Focused cell
      if (focusedCell && focusedCell.row === row && focusedCell.col === col) {
        className += 'ring-2 ring-blue-500 '
      }
    }

    return className
  }

  const getVisibleAnswer = (cell: GridCell) => {
    if (!cell.isActive) return ''
    
    // Show correct letter if completed or if user has entered correct letter
    if (isCompleted || cell.isCorrect === true) {
      return cell.letter
    }
    
    // Show user's input if any
    if (selectedQuestion && cell.questionIds.includes(selectedQuestion)) {
      const question = questions.find(q => q.id === selectedQuestion)
      if (question) {
        const userAnswer = userAnswers[selectedQuestion] || ''
        const { row: qRow, col: qCol, direction } = question.position
        
        let letterIndex = 0
        if (direction === 'horizontal') {
          letterIndex = focusedCell ? focusedCell.col - qCol : 0
        } else {
          letterIndex = focusedCell ? focusedCell.row - qRow : 0
        }
        
        return userAnswer[letterIndex]?.toUpperCase() || ''
      }
    }
    
    return ''
  }

  return (
    <div className="flex justify-center p-4">
      <div 
        ref={gridRef}
        className="inline-block bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200"
        style={{ 
          maxWidth: '100%',
          overflow: 'auto'
        }}
      >
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)` }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClassName(cell, rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                whileHover={cell.isActive ? { scale: 1.05 } : {}}
                whileTap={cell.isActive ? { scale: 0.95 } : {}}
              >
                {/* Cell number */}
                {cell.number && (
                  <span className="absolute top-0 left-0 text-xs text-blue-600 font-bold leading-none p-0.5">
                    {cell.number}
                  </span>
                )}
                
                {/* Cell letter */}
                <span className="text-center">
                  {getVisibleAnswer(cell)}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
