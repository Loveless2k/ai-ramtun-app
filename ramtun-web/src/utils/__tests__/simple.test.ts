/**
 * @jest-environment jsdom
 */

describe('Simple Test Suite', () => {
  it('should pass basic math operations', () => {
    expect(2 + 2).toBe(4)
    expect(5 * 3).toBe(15)
    expect(10 / 2).toBe(5)
  })

  it('should handle string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO')
    expect('world'.length).toBe(5)
    expect('test'.includes('es')).toBe(true)
  })

  it('should work with arrays', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(arr.length).toBe(5)
    expect(arr.includes(3)).toBe(true)
    expect(arr.filter(x => x > 3)).toEqual([4, 5])
  })

  it('should handle async operations', async () => {
    const promise = Promise.resolve('success')
    const result = await promise
    expect(result).toBe('success')
  })
})

describe('Environment Variables', () => {
  it('should have test environment variables set', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co')
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('test-anon-key')
    expect(process.env.OPENAI_API_KEY).toBe('test-openai-key')
  })
})

describe('Jest Configuration', () => {
  it('should have proper test environment', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
  })

  it('should have mocked functions available', () => {
    expect(typeof jest.fn).toBe('function')
    expect(typeof jest.mock).toBe('function')
  })
})
