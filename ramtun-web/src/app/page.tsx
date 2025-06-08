'use client'

import { motion } from 'framer-motion'
import { PuzzlePieceIcon, SparklesIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ramtun-primary via-ramtun-secondary to-ramtun-accent">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
                Ramtun
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light">
                Transforma la educación con crucigramas inteligentes
              </p>
            </motion.div>

            {/* Value Proposition */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                Plataforma educativa que utiliza IA para generar crucigramas personalizados, 
                diseñada para profesores que buscan captar la atención de sus estudiantes 
                en aulas de educación básica y media.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl border-2 border-white"
              >
                Comenzar como Profesor
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 backdrop-blur-sm">
                Ver Demo
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-white/20"
        >
          <PuzzlePieceIcon className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 text-white/20"
        >
          <SparklesIcon className="w-12 h-12" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-20 text-white/20"
        >
          <AcademicCapIcon className="w-20 h-20" />
        </motion.div>
      </div>

      {/* Features Preview */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-700">
              Todo lo que necesitas para revolucionar tus clases
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <SparklesIcon className="w-12 h-12 text-indigo-600" />,
                title: "IA Generativa",
                description: "Crea crucigramas personalizados en segundos usando inteligencia artificial especializada en educación chilena."
              },
              {
                icon: <PuzzlePieceIcon className="w-12 h-12 text-pink-600" />,
                title: "Editor Visual",
                description: "Interfaz intuitiva de drag & drop para personalizar y ajustar crucigramas según tus necesidades."
              },
              {
                icon: <AcademicCapIcon className="w-12 h-12 text-emerald-600" />,
                title: "Gamificación",
                description: "Experiencia de juego inmersiva que mantiene a los estudiantes comprometidos y motivados."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg">
              🚀 <strong>En Desarrollo</strong> - MVP en construcción con tecnología de vanguardia
            </p>
            <p className="text-gray-300 mt-2">
              Next.js 15 • Supabase • OpenAI GPT-4 • Tailwind CSS
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
