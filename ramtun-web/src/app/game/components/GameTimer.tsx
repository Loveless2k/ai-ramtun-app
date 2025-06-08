'use client'

import { useEffect, useRef } from 'react'

interface GameTimerProps {
  isPaused: boolean
  isCompleted: boolean
  onTimeUpdate: (time: number) => void
  timerId?: string // ID del elemento DOM para actualizar directamente
}

export default function GameTimer({ isPaused, isCompleted, onTimeUpdate, timerId }: GameTimerProps) {
  const timeElapsedRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isPaused && !isCompleted) {
      timerRef.current = setInterval(() => {
        timeElapsedRef.current += 1

        // Actualizar DOM directamente sin re-render
        if (timerId) {
          const timerElement = document.getElementById(timerId)
          if (timerElement) {
            const minutes = Math.floor(timeElapsedRef.current / 60)
            const seconds = timeElapsedRef.current % 60
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          }
        }

        // Solo notificar al padre cuando sea absolutamente necesario (pausa/completado)
        // NO notificar durante el juego normal para evitar re-renders
      }, 1000)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    } else {
      // Cuando se pausa o completa, notificar el tiempo actual
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      onTimeUpdate(timeElapsedRef.current)
    }
  }, [isPaused, isCompleted, onTimeUpdate, timerId])

  // Reset timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Este componente no renderiza nada
  return null
}
