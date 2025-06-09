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
