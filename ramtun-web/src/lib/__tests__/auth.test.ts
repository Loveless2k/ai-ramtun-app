/**
 * @jest-environment jsdom
 */

import { isCrosswordPublic } from '../auth'

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      signInWithOAuth: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
    },
  })),
}))

jest.mock('../supabase', () => ({
  createClientComponentClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      signInWithOAuth: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
    },
  })),
  createServerComponentClient: jest.fn(),
}))

describe('Auth Utilities', () => {
  describe('isCrosswordPublic', () => {
    it('should return true for public crossword (Sistema Solar)', () => {
      expect(isCrosswordPublic('sistema-solar')).toBe(true)
    })

    it('should return false for private crosswords', () => {
      expect(isCrosswordPublic('independencia-chile')).toBe(false)
      expect(isCrosswordPublic('geometria-basica')).toBe(false)
      expect(isCrosswordPublic('revolucion-francesa')).toBe(false)
      expect(isCrosswordPublic('999')).toBe(false)
    })

    it('should return false for invalid IDs', () => {
      expect(isCrosswordPublic('')).toBe(false)
      expect(isCrosswordPublic('invalid')).toBe(false)
      expect(isCrosswordPublic('0')).toBe(false)
    })
  })
})

describe('Auth Configuration', () => {
  it('should have environment variables configured for testing', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined()
  })
})
