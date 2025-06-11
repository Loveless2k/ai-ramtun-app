// Client-side API functions for static deployment
import { generateCrosswordDemo } from './openai'
import type { CrosswordRequest } from '../types/crossword'

// Client-side crossword generation for static deployment
export async function generateCrosswordClient(request: CrosswordRequest) {
  try {
    // In static deployment, always use demo mode
    console.log('🎭 Static deployment: Using demo mode for crossword generation')
    
    const result = await generateCrosswordDemo(request)
    
    return {
      ...result,
      generated_with: 'demo',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error in client-side crossword generation:', error)
    throw new Error('Failed to generate crossword')
  }
}

// Test OpenAI configuration (always returns demo mode in static deployment)
export function validateOpenAIConfigClient() {
  return {
    isConfigured: false,
    message: 'Static deployment - using demo mode'
  }
}
