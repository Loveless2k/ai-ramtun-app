import { NextResponse } from 'next/server'
import { validateOpenAIConfig, testOpenAIConnection } from '@/lib/openai'

export async function GET() {
  try {
    const isConfigured = validateOpenAIConfig()
    
    if (!isConfigured) {
      return NextResponse.json({
        status: 'not_configured',
        message: 'OpenAI API key not found in environment variables',
        configured: false,
        connection: false
      })
    }

    // Test connection
    const connectionTest = await testOpenAIConnection()
    
    return NextResponse.json({
      status: connectionTest.success ? 'ready' : 'error',
      message: connectionTest.success 
        ? 'OpenAI API is configured and working correctly'
        : `OpenAI API error: ${connectionTest.error}`,
      configured: true,
      connection: connectionTest.success,
      error: connectionTest.error || null
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test OpenAI configuration',
      configured: false,
      connection: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
