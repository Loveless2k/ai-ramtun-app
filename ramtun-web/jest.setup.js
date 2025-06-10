// Jest setup file
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
  useParams() {
    return {}
  },
}))

// Enhanced Framer Motion mock to handle all props properly
jest.mock('framer-motion', () => {
  const React = require('react')

  const createMotionComponent = (tag) => {
    return React.forwardRef((props, ref) => {
      // Filter out motion-specific props to prevent React warnings
      const {
        initial,
        animate,
        exit,
        transition,
        variants,
        whileHover,
        whileTap,
        whileFocus,
        whileInView,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        layout,
        layoutId,
        onAnimationStart,
        onAnimationComplete,
        onUpdate,
        onDrag,
        onDragStart,
        onDragEnd,
        onHoverStart,
        onHoverEnd,
        onTap,
        onTapStart,
        onTapCancel,
        onFocus,
        onBlur,
        onViewportEnter,
        onViewportLeave,
        ...filteredProps
      } = props

      return React.createElement(tag, { ...filteredProps, ref })
    })
  }

  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      span: createMotionComponent('span'),
      h1: createMotionComponent('h1'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      p: createMotionComponent('p'),
      form: createMotionComponent('form'),
      img: createMotionComponent('img'),
      section: createMotionComponent('section'),
      article: createMotionComponent('article'),
      nav: createMotionComponent('nav'),
      header: createMotionComponent('header'),
      footer: createMotionComponent('footer'),
      main: createMotionComponent('main'),
      aside: createMotionComponent('aside'),
      input: createMotionComponent('input'),
      textarea: createMotionComponent('textarea'),
      select: createMotionComponent('select'),
      option: createMotionComponent('option'),
      label: createMotionComponent('label'),
      ul: createMotionComponent('ul'),
      ol: createMotionComponent('ol'),
      li: createMotionComponent('li'),
      table: createMotionComponent('table'),
      thead: createMotionComponent('thead'),
      tbody: createMotionComponent('tbody'),
      tr: createMotionComponent('tr'),
      td: createMotionComponent('td'),
      th: createMotionComponent('th'),
    },
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useMotionValue: () => ({
      get: jest.fn(),
      set: jest.fn(),
      on: jest.fn(),
      destroy: jest.fn(),
    }),
    useTransform: () => ({
      get: jest.fn(),
      set: jest.fn(),
      on: jest.fn(),
      destroy: jest.fn(),
    }),
  }
})

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.OPENAI_API_KEY = 'test-openai-key'

// Mock Next.js headers for server components
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
    getAll: jest.fn(() => []),
  }),
}))

// Enhanced Supabase mock with proper context handling
jest.mock('@/lib/supabase', () => ({
  createClientComponentClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  }),
  createServerComponentClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
    },
  }),
  createRouteHandlerClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
    },
  }),
}))

// Mock Supabase auth helpers to prevent cookie context errors
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: () => ({
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
  }),
  createServerComponentClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
    },
  }),
  createClientComponentClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
    },
  }),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia (only in jsdom environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Suppress console warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('React does not recognize') ||
       args[0].includes('whileHover') ||
       args[0].includes('whileTap') ||
       args[0].includes('animate') ||
       args[0].includes('initial') ||
       args[0].includes('transition'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
