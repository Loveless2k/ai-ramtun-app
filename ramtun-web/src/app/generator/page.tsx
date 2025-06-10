import { Metadata } from 'next'
import CrosswordGenerator from '@/components/CrosswordGenerator'
import ProtectedRoute from '@/components/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Generador de Crucigramas IA - Ramtun',
  description: 'Herramienta profesional para profesores: Crea crucigramas educativos personalizados con inteligencia artificial para educación básica y media en Chile.',
  keywords: 'generador crucigramas, IA educativa, Chile, educación básica, educación media, profesores',
}

export default function GeneratorPage() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="min-h-screen bg-gray-50 py-12">
        {/* 🔒 PHASE 1: Teacher-Only Access Notice */}
        <div className="max-w-4xl mx-auto px-6 mb-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-indigo-800 text-sm font-medium">
                <strong>Acceso Profesional:</strong> Esta herramienta está reservada para profesores para garantizar la calidad educativa y alineación curricular.
              </p>
            </div>
          </div>
        </div>
        <CrosswordGenerator />
      </div>
    </ProtectedRoute>
  )
}
