import { Metadata } from 'next'
import CrosswordGenerator from '@/components/CrosswordGenerator'

export const metadata: Metadata = {
  title: 'Generador de Crucigramas IA - Ramtun',
  description: 'Crea crucigramas educativos personalizados con inteligencia artificial para educación básica y media en Chile.',
  keywords: 'generador crucigramas, IA educativa, Chile, educación básica, educación media',
}

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <CrosswordGenerator />
    </div>
  )
}
