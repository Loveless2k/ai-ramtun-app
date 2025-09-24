'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import {
  StarIcon,
  LightBulbIcon,
  ClockIcon,
  RocketLaunchIcon,
  SparklesIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

import { PowerUp, getAvailablePowerUps } from '../../../lib/gamification'
import StudentNavigation from '../../../components/StudentNavigation'

export default function PowerUpsPage() {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [myPowerUps, setMyPowerUps] = useState<{[key: string]: number}>({})
  const [playerPoints, setPlayerPoints] = useState(1850)
  const [playerLevel] = useState(6)
  const [isLoading, setIsLoading] = useState(true)
  const [purchaseModal, setPurchaseModal] = useState<{
    show: boolean
    powerUp: PowerUp | null
  }>({ show: false, powerUp: null })

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const availablePowerUps = getAvailablePowerUps()
      setPowerUps(availablePowerUps)
      
      // Simular power-ups que ya tiene el jugador
      setMyPowerUps({
        'hint_boost': 3,
        'time_freeze': 1,
        'score_boost': 2,
        'double_xp': 0,
        'reveal_letter': 1,
        'skip_question': 0
      })
      
      setIsLoading(false)
    }, 1000)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hint': return <LightBulbIcon className="w-6 h-6" />
      case 'time': return <ClockIcon className="w-6 h-6" />
      case 'score': return <RocketLaunchIcon className="w-6 h-6" />
      case 'special': return <SparklesIcon className="w-6 h-6" />
      default: return <StarIcon className="w-6 h-6" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hint': return 'bg-yellow-100 text-yellow-600 border-yellow-200'
      case 'time': return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'score': return 'bg-green-100 text-green-600 border-green-200'
      case 'special': return 'bg-purple-100 text-purple-600 border-purple-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const isUnlocked = (powerUp: PowerUp) => {
    return playerLevel >= powerUp.unlockLevel
  }

  const canAfford = (powerUp: PowerUp) => {
    return playerPoints >= powerUp.cost
  }

  const handlePurchase = (powerUp: PowerUp) => {
    if (!isUnlocked(powerUp) || !canAfford(powerUp)) return
    setPurchaseModal({ show: true, powerUp })
  }

  const confirmPurchase = () => {
    if (!purchaseModal.powerUp) return
    
    const powerUp = purchaseModal.powerUp
    
    // Simular compra
    setPlayerPoints(prev => prev - powerUp.cost)
    setMyPowerUps(prev => ({
      ...prev,
      [powerUp.id]: (prev[powerUp.id] || 0) + 1
    }))
    
    setPurchaseModal({ show: false, powerUp: null })
    
    // Mostrar notificación de éxito (aquí podrías usar un toast)
    alert(`¡${powerUp.name} comprado exitosamente!`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StudentNavigation
        title="Tienda de Power-ups"
        subtitle={`Mejora tu experiencia de juego • ${playerPoints} puntos disponibles`}
        icon={<LightBulbIcon className="w-6 h-6 text-purple-600" />}
        showBackButton={true}
        backUrl="/student/dashboard"
        backLabel="Volver al Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Power-ups */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎒 Mis Power-ups</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="my-powerups-grid">
              {powerUps.map((powerUp) => {
                const count = myPowerUps[powerUp.id] || 0
                return (
                  <div key={powerUp.id} className="my-powerups-item">
                    <div className={`my-powerups-icon ${
                      count > 0 ? getCategoryColor(powerUp.category) : 'bg-gray-100'
                    }`}>
                      <span className="text-2xl">{powerUp.icon}</span>
                    </div>
                    <h3 className={`my-powerups-title text-gray-900`}>
                      {powerUp.name}
                    </h3>
                    <p className={`my-powerups-count ${count > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {count}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Power-ups Store */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🛒 Tienda</h2>
          <div className="powerup-store-grid">
            {powerUps.map((powerUp, index) => {
              const unlocked = isUnlocked(powerUp)
              const affordable = canAfford(powerUp)
              const owned = myPowerUps[powerUp.id] || 0
              
              return (
                <motion.div
                  key={powerUp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`powerup-store-card bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                    unlocked ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="powerup-store-header">
                      <div className={`powerup-store-icon ${
                        unlocked ? getCategoryColor(powerUp.category) : 'bg-gray-100 text-gray-400'
                      }`}>
                        <span className="text-2xl">{powerUp.icon}</span>
                      </div>
                      <div className="powerup-store-badges">
                        {!unlocked && (
                          <LockClosedIcon className="w-5 h-5 text-gray-400" />
                        )}
                        {owned > 0 && (
                          <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                            Tienes {owned}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="powerup-store-content">
                      <h3 className={`powerup-store-title ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                        {powerUp.name}
                      </h3>

                      <p className={`powerup-store-description ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {powerUp.description}
                      </p>

                      <div className="powerup-store-details">
                        {/* Category Badge */}
                        <div>
                          <span className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full border ${getCategoryColor(powerUp.category)}`}>
                            {getCategoryIcon(powerUp.category)}
                            <span className="capitalize">{powerUp.category}</span>
                          </span>
                        </div>

                        {/* Duration - Always reserve space for consistent alignment */}
                        <div className={`powerup-store-duration ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {powerUp.duration ? (
                            <>
                              <ClockIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span>Duración: {powerUp.duration} segundos</span>
                            </>
                          ) : (
                            <span className="invisible">Placeholder</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Action Section */}
                    <div className="powerup-store-footer">
                      {/* Price */}
                      <div className="powerup-store-price">
                        <div className="flex items-center space-x-2">
                          <StarIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <span className={`text-lg font-bold ${
                            unlocked && affordable ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {powerUp.cost}
                          </span>
                        </div>
                        {!unlocked && (
                          <span className="text-xs text-gray-500 text-right">
                            Nivel {powerUp.unlockLevel} requerido
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      {unlocked ? (
                        affordable ? (
                          <button
                            onClick={() => handlePurchase(powerUp)}
                            className="powerup-store-button bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Comprar
                          </button>
                        ) : (
                          <button
                            disabled
                            className="powerup-store-button bg-gray-100 text-gray-500 cursor-not-allowed"
                          >
                            Puntos insuficientes
                          </button>
                        )
                      ) : (
                        <button
                          disabled
                          className="powerup-store-button bg-gray-100 text-gray-500 cursor-not-allowed"
                        >
                          Bloqueado
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Cómo Ganar Puntos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Completa crucigramas</h4>
                <p className="text-sm text-gray-600">Gana puntos basados en tu puntuación y dificultad</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <StarIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Completa desafíos</h4>
                <p className="text-sm text-gray-600">Los desafíos diarios y semanales dan puntos extra</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Desbloquea logros</h4>
                <p className="text-sm text-gray-600">Cada logro desbloqueado otorga puntos bonus</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RocketLaunchIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Mantén tu racha</h4>
                <p className="text-sm text-gray-600">Jugar días consecutivos multiplica tus puntos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {purchaseModal.show && purchaseModal.powerUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md mx-4"
          >
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-4 ${getCategoryColor(purchaseModal.powerUp.category)}`}>
                <span className="text-3xl">{purchaseModal.powerUp.icon}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirmar Compra
              </h3>
              
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que quieres comprar <strong>{purchaseModal.powerUp.name}</strong>?
              </p>
              
              <div className="flex items-center justify-center space-x-2 mb-6">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-bold text-gray-900">{purchaseModal.powerUp.cost} puntos</span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setPurchaseModal({ show: false, powerUp: null })}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Comprar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
