/**
 * @jest-environment jsdom
 */

import { generatePerfectCrossword, PerfectCrosswordGenerator } from '../perfectCrosswordGenerator'

describe('PerfectCrosswordGenerator', () => {
  let generator: PerfectCrosswordGenerator

  beforeEach(() => {
    generator = new PerfectCrosswordGenerator(15)
  })

  describe('Constructor', () => {
    it('should initialize with correct grid size', () => {
      expect(generator).toBeDefined()
      // Test that generator has the expected properties
      expect(generator.generatePerfectCrossword).toBeDefined()
    })

    it('should handle different grid sizes', () => {
      const smallGenerator = new PerfectCrosswordGenerator(10)
      const largeGenerator = new PerfectCrosswordGenerator(20)

      expect(smallGenerator).toBeDefined()
      expect(largeGenerator).toBeDefined()
    })
  })

  describe('Independencia de Chile Crossword Validation', () => {
    it('should generate mathematically correct crossword for Independencia de Chile', () => {
      const crosswordData = generatePerfectCrossword('independencia-chile')

      expect(crosswordData).toBeDefined()
      expect(crosswordData?.id).toBe('independencia-chile')
      expect(crosswordData?.questions).toBeDefined()

      const questions = crosswordData!.questions

      // Verificar que todas las palabras esperadas están presentes
      const expectedWords = ['OHIGGINS', 'MAIPU', 'SANMARTIN', 'PATRIA', 'ANDES', 'DIECIOCHO']
      const actualWords = questions.map(q => q.answer)

      expectedWords.forEach(word => {
        expect(actualWords).toContain(word)
      })

      // Verificar que todas las palabras tienen posiciones válidas
      questions.forEach(question => {
        expect(question.position).toBeDefined()
        expect(question.position.row).toBeGreaterThanOrEqual(0)
        expect(question.position.col).toBeGreaterThanOrEqual(0)
        expect(['horizontal', 'vertical']).toContain(question.position.direction)
      })

      // Verificar intersecciones matemáticamente correctas
      validateCrosswordIntersections(questions)

      // Verificar que no hay palabras aisladas
      validateWordConnectivity(questions)

      // Verificar que no hay palabras adyacentes falsas
      validateNoAdjacentFalseWords(questions)
    })
  })

  describe('generatePerfectCrossword', () => {
    it('should generate crossword with valid questions', () => {
      const questions = [
        { answer: 'TIERRA', clue: 'Planeta donde vivimos' },
        { answer: 'LUNA', clue: 'Satélite natural de la Tierra' },
        { answer: 'SOL', clue: 'Estrella del sistema solar' },
      ]

      const result = generator.generatePerfectCrossword(questions)
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(questions.length)
      
      // Verify each question has required properties
      result.forEach((question, index) => {
        expect(question).toHaveProperty('answer')
        expect(question).toHaveProperty('clue')
        expect(question).toHaveProperty('position')
        expect(question).toHaveProperty('number')
        expect(question.answer).toBe(questions[index].answer)
        expect(question.clue).toBe(questions[index].clue)
      })
    })

    it('should handle empty questions array', () => {
      const result = generator.generatePerfectCrossword([])
      expect(result).toEqual([])
    })

    it('should handle single question', () => {
      const questions = [
        { answer: 'TIERRA', clue: 'Planeta donde vivimos' }
      ]

      const result = generator.generatePerfectCrossword(questions)
      
      expect(result).toBeDefined()
      expect(result.length).toBe(1)
      expect(result[0].answer).toBe('TIERRA')
      expect(result[0].position).toBeDefined()
      expect(result[0].number).toBeDefined()
    })
  })
})

describe('generatePerfectCrossword function', () => {
  describe('Valid game IDs', () => {
    it('should generate Sistema Solar crossword', () => {
      const result = generatePerfectCrossword('sistema-solar')
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('questions')
      expect(result).toHaveProperty('title')
      expect(result.title).toContain('Sistema Solar')
      expect(Array.isArray(result.questions)).toBe(true)
      expect(result.questions.length).toBeGreaterThan(0)
    })

    it('should generate Independencia Chile crossword', () => {
      const result = generatePerfectCrossword('independencia-chile')
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('questions')
      expect(result).toHaveProperty('title')
      expect(result.title).toContain('Independencia')
      expect(Array.isArray(result.questions)).toBe(true)
    })

    it('should generate Geometría Básica crossword', () => {
      const result = generatePerfectCrossword('geometria-basica')
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('questions')
      expect(result).toHaveProperty('title')
      expect(result.title).toContain('Geometría')
      expect(Array.isArray(result.questions)).toBe(true)
    })

    it('should generate Revolución Francesa crossword', () => {
      const result = generatePerfectCrossword('revolucion-francesa')
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('questions')
      expect(result).toHaveProperty('title')
      expect(result.title).toContain('Revolución')
      expect(Array.isArray(result.questions)).toBe(true)
    })
  })

  describe('Invalid game IDs', () => {
    it('should return null for invalid game ID', () => {
      const result = generatePerfectCrossword('invalid-game')
      expect(result).toBeNull()
    })

    it('should return null for empty string', () => {
      const result = generatePerfectCrossword('')
      expect(result).toBeNull()
    })

    it('should return null for undefined', () => {
      const result = generatePerfectCrossword(undefined as any)
      expect(result).toBeNull()
    })
  })

  describe('Crossword Quality Validation', () => {
    it('should generate crosswords with proper structure', () => {
      const result = generatePerfectCrossword('sistema-solar')
      
      if (result) {
        // Verify all questions have required properties
        result.questions.forEach(question => {
          expect(question).toHaveProperty('answer')
          expect(question).toHaveProperty('clue')
          expect(question).toHaveProperty('position')
          expect(question).toHaveProperty('number')
          expect(question).toHaveProperty('direction')
          
          // Verify answer is uppercase and non-empty
          expect(question.answer).toMatch(/^[A-Z]+$/)
          expect(question.answer.length).toBeGreaterThan(0)
          
          // Verify clue is non-empty
          expect(question.clue.length).toBeGreaterThan(0)
          
          // Verify position has valid coordinates
          expect(question.position).toHaveProperty('row')
          expect(question.position).toHaveProperty('col')
          expect(typeof question.position.row).toBe('number')
          expect(typeof question.position.col).toBe('number')
          
          // Verify direction is valid
          expect(['horizontal', 'vertical']).toContain(question.direction)
        })
      }
    })
  })
})

// Funciones de validación para verificar la calidad del algoritmo perfecto
function validateCrosswordIntersections(questions: any[]) {
  // Crear un grid para verificar intersecciones
  const gridSize = 15
  const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''))

  // Colocar todas las palabras en el grid
  questions.forEach(question => {
    const { answer, position } = question
    const { row, col, direction } = position

    for (let i = 0; i < answer.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col

      if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== answer[i]) {
        throw new Error(`Intersección inválida en (${currentRow}, ${currentCol}): ${answer[i]} vs ${grid[currentRow][currentCol]}`)
      }

      grid[currentRow][currentCol] = answer[i]
    }
  })

  // Verificar que todas las intersecciones son matemáticamente correctas
  questions.forEach(question1 => {
    questions.forEach(question2 => {
      if (question1.id !== question2.id) {
        const intersections = findWordIntersections(question1, question2)
        intersections.forEach(intersection => {
          const letter1 = question1.answer[intersection.pos1]
          const letter2 = question2.answer[intersection.pos2]
          expect(letter1).toBe(letter2)
        })
      }
    })
  })
}

function validateWordConnectivity(questions: any[]) {
  if (questions.length <= 1) return

  // Verificar que todas las palabras están conectadas usando BFS
  const visited = new Set<string>()
  const queue = [questions[0]]
  visited.add(questions[0].id)

  while (queue.length > 0) {
    const currentWord = queue.shift()!

    questions.forEach(otherWord => {
      if (!visited.has(otherWord.id) && wordsIntersect(currentWord, otherWord)) {
        visited.add(otherWord.id)
        queue.push(otherWord)
      }
    })
  }

  expect(visited.size).toBe(questions.length)
}

function validateNoAdjacentFalseWords(questions: any[]) {
  const gridSize = 15
  const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''))

  // Colocar todas las palabras en el grid
  questions.forEach(question => {
    const { answer, position } = question
    const { row, col, direction } = position

    for (let i = 0; i < answer.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col
      grid[currentRow][currentCol] = answer[i]
    }
  })

  // Verificar que no hay palabras adyacentes falsas
  questions.forEach(question => {
    const { answer, position } = question
    const { row, col, direction } = position

    // Verificar antes del inicio
    if (direction === 'horizontal') {
      if (col > 0) {
        expect(grid[row][col - 1]).toBe('')
      }
      if (col + answer.length < gridSize) {
        expect(grid[row][col + answer.length]).toBe('')
      }
    } else {
      if (row > 0) {
        expect(grid[row - 1][col]).toBe('')
      }
      if (row + answer.length < gridSize) {
        expect(grid[row + answer.length][col]).toBe('')
      }
    }
  })
}

function findWordIntersections(word1: any, word2: any) {
  const intersections = []

  if (word1.position.direction === word2.position.direction) {
    return intersections // Palabras paralelas no se intersectan
  }

  const horizontal = word1.position.direction === 'horizontal' ? word1 : word2
  const vertical = word1.position.direction === 'vertical' ? word1 : word2

  // Verificar si se intersectan
  const hRow = horizontal.position.row
  const hColStart = horizontal.position.col
  const hColEnd = hColStart + horizontal.answer.length - 1

  const vCol = vertical.position.col
  const vRowStart = vertical.position.row
  const vRowEnd = vRowStart + vertical.answer.length - 1

  if (hRow >= vRowStart && hRow <= vRowEnd && vCol >= hColStart && vCol <= hColEnd) {
    const pos1 = word1.position.direction === 'horizontal' ? vCol - hColStart : hRow - vRowStart
    const pos2 = word2.position.direction === 'horizontal' ? vCol - hColStart : hRow - vRowStart

    intersections.push({ pos1, pos2 })
  }

  return intersections
}

function wordsIntersect(word1: any, word2: any): boolean {
  return findWordIntersections(word1, word2).length > 0
}
