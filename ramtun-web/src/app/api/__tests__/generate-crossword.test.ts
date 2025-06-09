/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '../generate-crossword/route'

// Mock OpenAI
jest.mock('../../../lib/openai', () => ({
  generateCrossword: jest.fn(),
  generateCrosswordDemo: jest.fn(),
  validateOpenAIConfig: jest.fn(),
}))

const mockGenerateCrossword = require('../../../lib/openai').generateCrossword
const mockGenerateCrosswordDemo = require('../../../lib/openai').generateCrosswordDemo
const mockValidateOpenAIConfig = require('../../../lib/openai').validateOpenAIConfig

describe('/api/generate-crossword', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST method', () => {
    it('should generate crossword with valid request', async () => {
      const mockCrosswordData = {
        title: 'Test Crossword',
        questions: [
          {
            answer: 'TIERRA',
            clue: 'Planeta donde vivimos',
            position: { row: 5, col: 5 },
            direction: 'horizontal',
            number: 1
          }
        ]
      }

      mockValidateOpenAIConfig.mockReturnValue(true)
      mockGenerateCrossword.mockResolvedValue(mockCrosswordData)

      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Sistema Solar',
          educationLevel: 'basica',
          grade: '8',
          difficulty: 'medium',
          questionCount: '10'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.title).toBe('Test Crossword')
      expect(data.questions).toHaveLength(1)
      expect(data.generated_with).toBe('openai')
      expect(mockGenerateCrossword).toHaveBeenCalledWith({
        topic: 'Sistema Solar',
        educationLevel: 'basica',
        grade: 8,
        difficulty: 'medium',
        questionCount: 10
      })
    })

    it('should use demo mode when OpenAI is not configured', async () => {
      const mockDemoData = {
        title: 'Demo Crossword',
        questions: [
          {
            answer: 'DEMO',
            clue: 'Test clue',
            position: { row: 5, col: 5 },
            direction: 'horizontal',
            number: 1
          }
        ]
      }

      mockValidateOpenAIConfig.mockReturnValue(false)
      mockGenerateCrosswordDemo.mockResolvedValue(mockDemoData)

      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Test Topic',
          educationLevel: 'basica',
          grade: '6',
          difficulty: 'easy',
          questionCount: '5'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.title).toBe('Demo Crossword')
      expect(data.generated_with).toBe('demo')
      expect(mockGenerateCrosswordDemo).toHaveBeenCalled()
      expect(mockGenerateCrossword).not.toHaveBeenCalled()
    })

    it('should fallback to demo mode when OpenAI fails', async () => {
      const mockDemoData = {
        title: 'Fallback Demo',
        questions: []
      }

      mockValidateOpenAIConfig.mockReturnValue(true)
      mockGenerateCrossword.mockRejectedValue(new Error('OpenAI API Error'))
      mockGenerateCrosswordDemo.mockResolvedValue(mockDemoData)

      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Test Topic',
          educationLevel: 'basica',
          grade: '7',
          difficulty: 'medium',
          questionCount: '8'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.generated_with).toBe('demo')
      expect(mockGenerateCrosswordDemo).toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('required')
    })

    it('should validate question count range', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Test Topic',
          educationLevel: 'basica',
          grade: '6',
          difficulty: 'easy',
          questionCount: '25' // Too high
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Question count must be between 5-20')
    })

    it('should validate education level', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Test Topic',
          educationLevel: 'invalid',
          grade: '6',
          difficulty: 'easy',
          questionCount: '10'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid education level')
    })

    it('should validate difficulty level', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Test Topic',
          educationLevel: 'basica',
          grade: '6',
          difficulty: 'invalid',
          questionCount: '10'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid difficulty')
    })

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate crossword')
    })
  })
})
