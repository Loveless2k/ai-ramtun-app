import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Client-side Supabase client
export const createClientComponentClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client (only use in server components)
export const createServerComponentClient = async () => {
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Admin client (for server-side operations)
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceRoleKey)
}

// Database types (will be generated from Supabase)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'teacher' | 'student' | 'admin'
          school_id: string | null
          first_name: string | null
          last_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'teacher' | 'student' | 'admin'
          school_id?: string | null
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'teacher' | 'student' | 'admin'
          school_id?: string | null
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          type: 'public' | 'private'
          region: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'public' | 'private'
          region: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'public' | 'private'
          region?: string
          created_at?: string
        }
      }
      crosswords: {
        Row: {
          id: string
          title: string
          topic: string
          level: string
          difficulty: 'easy' | 'medium' | 'hard'
          questions: any // JSON
          teacher_id: string
          school_id: string
          embedding: number[] | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          topic: string
          level: string
          difficulty: 'easy' | 'medium' | 'hard'
          questions: any
          teacher_id: string
          school_id: string
          embedding?: number[] | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          topic?: string
          level?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          questions?: any
          teacher_id?: string
          school_id?: string
          embedding?: number[] | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
