/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '../generate-crossword/route'

// Mock Supabase auth helpers to prevent cookie context errors
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
              user_metadata: { role: 'teacher' }
            }
          }
        },
        error: null,
      }),
    },
  })),
}))

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
    getAll: jest.fn(() => []),
  })),
}))

// Mock OpenAI
jest.mock('../../../lib/openai', () => ({
  generateCrossword: jest.fn(),
  generateCrosswordDemo: jest.fn(),
  validateOpenAIConfig: jest.fn(),
}))

import { generateCrossword, generateCrosswordDemo, validateOpenAIConfig } from '../../../lib/openai'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

const mockGenerateCrossword = generateCrossword as jest.MockedFunction<typeof generateCrossword>
const mockGenerateCrosswordDemo = generateCrosswordDemo as jest.MockedFunction<typeof generateCrosswordDemo>
const mockValidateOpenAIConfig = validateOpenAIConfig as jest.MockedFunction<typeof validateOpenAIConfig>
const mockCreateRouteHandlerClient = createRouteHandlerClient as jest.MockedFunction<typeof createRouteHandlerClient>

describe('/api/generate-crossword', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should require authentication', async () => {
      // Mock no session
      mockCreateRouteHandlerClient.mockReturnValue({
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: { session: null },
            error: null,
          }),
        },
      } as any)

      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Test Topic',
          educationLevel: 'basica',
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

      expect(response.status).toBe(401)
      expect(data.error).toContain('Authentication required')
    })

    it('should allow authenticated teacher access', async () => {
      // Mock authenticated teacher session
      mockCreateRouteHandlerClient.mockReturnValue({
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: {
              session: {
                user: {
                  id: 'test-teacher-id',
                  email: 'teacher@example.com',
                  user_metadata: { role: 'teacher' }
                }
              }
            },
            error: null,
          }),
        },
      } as any)

      const mockCrosswordData = {
        title: 'Test Crossword',
        questions: []
      }

      mockValidateOpenAIConfig.mockReturnValue(false)
      mockGenerateCrosswordDemo.mockResolvedValue(mockCrosswordData)

      const request = new NextRequest('http://localhost:3000/api/generate-crossword', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Test Topic',
          educationLevel: 'basica',
          grade: '6',
          difficulty: 'easy',
          questionCount: '10'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  describe('POST method', () => {
    beforeEach(() => {
      // Reset to authenticated teacher for other tests
      mockCreateRouteHandlerClient.mockReturnValue({
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: {
              session: {
                user: {
                  id: 'test-teacher-id',
                  email: 'teacher@example.com',
                  user_metadata: { role: 'teacher' }
                }
              }
            },
            error: null,
          }),
        },
      } as any)
    })

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
