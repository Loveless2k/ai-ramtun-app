'use client'

import { motion } from 'framer-motion'
import {
  PuzzlePieceIcon,
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CogIcon,
  LightBulbIcon,
  CheckIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'

export default function Home() {
  // Estado de autenticación
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isClient, setIsClient] = useState(false)

  // Prevenir hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Helper para obtener información del dashboard según el rol
  const getDashboardInfo = (userRole?: string) => {
    if (userRole === 'teacher') {
      return {
        text: 'Ir a Dashboard Profesor',
        url: '/dashboard'
      }
    } else if (userRole === 'student') {
      return {
        text: 'Ir a Dashboard Estudiante',
        url: '/student/dashboard'
      }
    } else {
      return {
        text: 'Ir a Dashboard',
        url: '/dashboard'
      }
    }
  }

  // Estado para el formulario de contacto
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    institution: '',
    role: '',
    gradeLevel: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setContactForm({
        name: '',
        email: '',
        institution: '',
        role: '',
        gradeLevel: '',
        message: ''
      })

      // Reset status después de 3 segundos
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }, 2000)
  }

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
              {!isClient || isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white">Cargando...</span>
                </div>
              ) : isAuthenticated && user ? (
                // Usuario autenticado - mostrar botón contextual al dashboard
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => {
                      const dashboardInfo = getDashboardInfo(user.user_metadata?.role)
                      window.location.href = dashboardInfo.url
                    }}
                    className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl border-2 border-white flex items-center space-x-2"
                  >
                    <span>{getDashboardInfo(user.user_metadata?.role).text}</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/play'}
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 backdrop-blur-sm"
                  >
                    Explorar Juegos
                  </button>
                </div>
              ) : (
                // Usuario no autenticado - mostrar botones de login/registro
                <>
                  <button
                    onClick={() => window.location.href = '/auth/login'}
                    className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl border-2 border-white"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => window.location.href = '/auth/register'}
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 backdrop-blur-sm"
                  >
                    Crear Cuenta
                  </button>
                </>
              )}
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

      {/* Video Demo Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ve Ramtun en Acción
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Descubre cómo nuestros estudiantes disfrutan aprendiendo con crucigramas interactivos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
              <video
                className="w-full h-auto"
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src="/hero_section_ramtun.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Video Caption */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-6"
            >
              <p className="text-gray-600 italic">
                🎮 Estudiante disfrutando de un crucigrama de Sistema Solar
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
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
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ramtun combina inteligencia artificial, gamificación y pedagogía para crear
              la experiencia educativa más atractiva para tus estudiantes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <SparklesIcon className="w-12 h-12 text-indigo-600" />,
                title: "IA Generativa OpenAI GPT-4",
                description: "Crea crucigramas personalizados en segundos usando inteligencia artificial especializada en el currículum chileno."
              },
              {
                icon: <AcademicCapIcon className="w-12 h-12 text-emerald-600" />,
                title: "Currículum Chileno",
                description: "Contenido alineado con educación básica (1°-8°) y media (1°-4°) según estándares del MINEDUC."
              },
              {
                icon: <ChartBarIcon className="w-12 h-12 text-blue-600" />,
                title: "Dashboard Profesor",
                description: "Panel completo para gestionar crucigramas, analizar progreso estudiantil y generar reportes."
              },
              {
                icon: <PuzzlePieceIcon className="w-12 h-12 text-pink-600" />,
                title: "Interfaz de Juego",
                description: "Experiencia gamificada e inmersiva que mantiene a los estudiantes comprometidos y motivados."
              },
              {
                icon: <CogIcon className="w-12 h-12 text-purple-600" />,
                title: "Editor Visual",
                description: "Herramientas intuitivas para personalizar y ajustar crucigramas según tus necesidades específicas."
              },
              {
                icon: <UserGroupIcon className="w-12 h-12 text-orange-600" />,
                title: "Gestión de Roles",
                description: "Sistema robusto de autenticación con roles diferenciados para profesores y estudiantes."
              },
              {
                icon: <ChartBarIcon className="w-12 h-12 text-green-600" />,
                title: "Analytics Avanzados",
                description: "Métricas detalladas de engagement, tiempo de juego y progreso de aprendizaje por estudiante."
              },
              {
                icon: <ShieldCheckIcon className="w-12 h-12 text-red-600" />,
                title: "Seguridad Educativa",
                description: "Plataforma segura y confiable, diseñada específicamente para entornos educacionales."
              },
              {
                icon: <LightBulbIcon className="w-12 h-12 text-yellow-600" />,
                title: "Algoritmo Perfecto",
                description: "Generación matemáticamente correcta de crucigramas sin palabras aisladas ni intersecciones falsas."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col h-full"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center flex-grow">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Features CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-16"
          >
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              ¿Listo para transformar tus clases con tecnología de vanguardia?
            </p>
            <button
              onClick={() => window.location.href = '/auth/register'}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-xl inline-flex items-center justify-center"
            >
              Comenzar Gratis
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes Diseñados para la Educación Chilena
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Desde profesores individuales hasta instituciones completas,
              tenemos el plan perfecto para transformar tu experiencia educativa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan Freemium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 flex flex-col h-full"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Freemium</h3>
                <p className="text-gray-600 mb-4">Perfecto para comenzar</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">Gratis</div>
                <p className="text-sm text-gray-500">Para siempre</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "Hasta 3 crucigramas por mes",
                  "Acceso a biblioteca básica",
                  "Interfaz de juego completa",
                  "Soporte por email",
                  "Modo demo ilimitado"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.location.href = '/auth/register'}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
              >
                Comenzar Gratis
              </button>
            </motion.div>

            {/* Plan Profesor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-indigo-50 rounded-2xl p-8 border-2 border-indigo-500 relative hover:border-indigo-600 transition-all duration-300 transform hover:scale-105 flex flex-col h-full"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Más Popular
                </span>
              </div>

              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Profesor Pro</h3>
                <p className="text-gray-600 mb-4">Para educadores dedicados</p>
                <div className="text-4xl font-bold text-indigo-600 mb-2">$15.990</div>
                <p className="text-sm text-gray-500">CLP por mes</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "Crucigramas ilimitados",
                  "IA OpenAI GPT-4 completa",
                  "Analytics avanzados",
                  "Editor visual completo",
                  "Hasta 100 estudiantes",
                  "Soporte prioritario",
                  "Exportar a PDF/Word"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.location.href = '#contact'}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
              >
                Comenzar Prueba Gratis
              </button>
            </motion.div>

            {/* Plan Institucional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 flex flex-col h-full"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Institucional</h3>
                <p className="text-gray-600 mb-4">Para colegios y liceos</p>
                <div className="text-4xl font-bold text-purple-600 mb-2">Cotizar</div>
                <p className="text-sm text-gray-500">Precio personalizado</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "Profesores ilimitados",
                  "Estudiantes ilimitados",
                  "Dashboard administrativo",
                  "Reportes institucionales",
                  "Integración con LMS",
                  "Capacitación incluida",
                  "Soporte 24/7",
                  "Implementación guiada"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.location.href = '#contact'}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
              >
                Solicitar Cotización
              </button>
            </motion.div>
          </div>

          {/* Pricing Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Necesitas un plan personalizado?
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Trabajamos con instituciones educativas para crear soluciones a medida.
                Contáctanos para discutir tus necesidades específicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.location.href = '#contact'}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center min-w-[160px]"
                >
                  Contactar Ventas
                </button>
                <button
                  onClick={() => window.location.href = '/play'}
                  className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center min-w-[160px]"
                >
                  Ver Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Conecta con Ramtun
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              ¿Listo para revolucionar la educación en tu institución?
              Contáctanos para una demo personalizada o resolver tus dudas
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Solicita una Demo Personalizada
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Institucional *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-colors"
                      placeholder="profesor@colegio.cl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institución Educativa *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.institution}
                    onChange={(e) => setContactForm({...contactForm, institution: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                    placeholder="Nombre del colegio o liceo"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tu Rol *
                    </label>
                    <select
                      required
                      value={contactForm.role}
                      onChange={(e) => setContactForm({...contactForm, role: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-colors"
                    >
                      <option value="">Selecciona tu rol</option>
                      <option value="profesor">Profesor/a</option>
                      <option value="coordinador">Coordinador/a Académico</option>
                      <option value="director">Director/a</option>
                      <option value="jefe_utp">Jefe UTP</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel Educativo
                    </label>
                    <select
                      value={contactForm.gradeLevel}
                      onChange={(e) => setContactForm({...contactForm, gradeLevel: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-colors"
                    >
                      <option value="">Selecciona nivel</option>
                      <option value="basica_1_4">Básica 1° - 4°</option>
                      <option value="basica_5_8">Básica 5° - 8°</option>
                      <option value="media_1_4">Media 1° - 4°</option>
                      <option value="mixto">Mixto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                    placeholder="Cuéntanos sobre tus necesidades específicas, número de estudiantes, materias de interés, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : submitStatus === 'success'
                        ? 'bg-green-600 text-white'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </div>
                  ) : submitStatus === 'success' ? (
                    <div className="flex items-center justify-center">
                      <CheckIcon className="w-5 h-5 mr-2" />
                      ¡Mensaje Enviado!
                    </div>
                  ) : (
                    'Solicitar Demo Gratuita'
                  )}
                </button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-600 text-sm"
                  >
                    ¡Gracias! Nos pondremos en contacto contigo en las próximas 24 horas.
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Información de Contacto
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">contacto@ramtun.cl</p>
                      <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <PhoneIcon className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Teléfono</h4>
                      <p className="text-gray-600">+56 9 XXXX XXXX</p>
                      <p className="text-sm text-gray-500">Lunes a Viernes 9:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPinIcon className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Ubicación</h4>
                      <p className="text-gray-600">Santiago, Chile</p>
                      <p className="text-sm text-gray-500">Servicio a nivel nacional</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
                <h4 className="font-bold text-indigo-900 mb-3 flex items-center">
                  <StarIcon className="w-5 h-5 mr-2" />
                  ¿Por qué elegir Ramtun?
                </h4>
                <ul className="space-y-2 text-sm text-indigo-800">
                  <li>• Especializado en educación chilena</li>
                  <li>• Tecnología de vanguardia (IA + Gamificación)</li>
                  <li>• Soporte técnico especializado</li>
                  <li>• Implementación rápida y sencilla</li>
                  <li>• Resultados medibles en engagement</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-bold text-green-900 mb-3 flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                  Para Instituciones
                </h4>
                <p className="text-sm text-green-800 mb-3">
                  Ofrecemos planes especiales para colegios y liceos con:
                </p>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Descuentos por volumen</li>
                  <li>• Capacitación incluida</li>
                  <li>• Soporte prioritario</li>
                  <li>• Reportes administrativos</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
