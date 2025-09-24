// Sistema de Gamificación Completo para Ramtun
export interface GameStats {
  score: number
  timeElapsed: number
  hintsUsed: number
  totalQuestions: number
  correctAnswers: number
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  subject: string
  isFirstTime: boolean
  streakDay: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  category: 'games' | 'score' | 'streak' | 'time' | 'subject' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  requirements?: {
    type: string
    value: number
    subject?: string
  }
}

export interface PowerUp {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  effect: string
  duration?: number
  unlockLevel: number
  category: 'hint' | 'time' | 'score' | 'special'
}

export interface DailyChallenge {
  id: string
  title: string
  description: string
  icon: string
  target: number
  progress: number
  reward: {
    points: number
    powerUps?: string[]
    achievements?: string[]
  }
  expiresAt: string
  type: 'games' | 'score' | 'time' | 'streak' | 'subject'
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface PlayerLevel {
  level: number
  currentXP: number
  requiredXP: number
  title: string
  perks: string[]
  unlocks: string[]
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  points: number
  level: number
  streak: number
  gamesPlayed: number
  averageScore: number
  rank: number
  change: number // +1, -1, 0
  badges: string[]
}

// Cálculo de puntos base
export function calculateBasePoints(stats: GameStats): number {
  const { score, timeElapsed, hintsUsed, difficulty, isFirstTime } = stats

  let points = score // Base: puntuación del juego (0-100)

  // Bonus por dificultad
  const difficultyMultiplier = {
    'Fácil': 1.0,
    'Medio': 1.5,
    'Difícil': 2.0
  }
  points *= difficultyMultiplier[difficulty]

  // Bonus por tiempo (máximo 50 puntos extra)
  const timeBonus = Math.max(0, 50 - Math.floor(timeElapsed / 30))
  points += timeBonus

  // Bonus por no usar pistas (máximo 30 puntos extra)
  const hintBonus = Math.max(0, 30 - (hintsUsed * 10))
  points += hintBonus

  // Bonus por primera vez (50% extra)
  if (isFirstTime) {
    points *= 1.5
  }

  return Math.round(points)
}

// Cálculo de nivel basado en XP
export function calculateLevel(totalXP: number): PlayerLevel {
  const levels = [
    { level: 1, requiredXP: 0, title: "Novato", perks: ["Acceso básico"], unlocks: [] },
    { level: 2, requiredXP: 100, title: "Aprendiz", perks: ["Pista extra"], unlocks: ["hint_boost"] },
    { level: 3, requiredXP: 250, title: "Estudiante", perks: ["Bonus de tiempo"], unlocks: ["time_freeze"] },
    { level: 4, requiredXP: 450, title: "Explorador", perks: ["Acceso a desafíos"], unlocks: ["daily_challenges"] },
    { level: 5, requiredXP: 700, title: "Conocedor", perks: ["Doble XP los fines de semana"], unlocks: ["weekend_boost"] },
    { level: 6, requiredXP: 1000, title: "Experto", perks: ["Power-ups avanzados"], unlocks: ["advanced_powerups"] },
    { level: 7, requiredXP: 1350, title: "Maestro", perks: ["Leaderboard global"], unlocks: ["global_leaderboard"] },
    { level: 8, requiredXP: 1750, title: "Sabio", perks: ["Creación de desafíos"], unlocks: ["custom_challenges"] },
    { level: 9, requiredXP: 2200, title: "Genio", perks: ["Acceso beta"], unlocks: ["beta_features"] },
    { level: 10, requiredXP: 2700, title: "Leyenda", perks: ["Título especial"], unlocks: ["legendary_badge"] }
  ]

  let currentLevel = levels[0]
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].requiredXP) {
      currentLevel = levels[i]
      break
    }
  }

  const nextLevel = levels.find(l => l.level === currentLevel.level + 1)
  const requiredXP = nextLevel ? nextLevel.requiredXP : currentLevel.requiredXP

  return {
    ...currentLevel,
    currentXP: totalXP,
    requiredXP
  }
}

// Minimal shape of player data used for achievement checks
export interface PlayerDataSummary {
  totalGames?: number
  currentStreak?: number
  subjectStats?: Record<string, { gamesPlayed?: number }>
  level?: number
}


// Verificar logros desbloqueados
export function checkAchievements(stats: GameStats, playerData: PlayerDataSummary): Achievement[] {
  const newAchievements: Achievement[] = []

  // Definir todos los logros disponibles
  const allAchievements: Achievement[] = [
    // Logros básicos
    {
      id: 'first_game',
      title: 'Primer Paso',
      description: 'Completa tu primer crucigrama',
      icon: '🎯',
      category: 'games',
      rarity: 'common',
      points: 50,
      unlocked: false,
      requirements: { type: 'games_played', value: 1 }
    },
    {
      id: 'perfect_score',
      title: 'Perfección',
      description: 'Obtén 100% en un crucigrama',
      icon: '⭐',
      category: 'score',
      rarity: 'epic',
      points: 200,
      unlocked: false,
      requirements: { type: 'perfect_score', value: 100 }
    },
    {
      id: 'speed_demon',
      title: 'Demonio de la Velocidad',
      description: 'Completa un crucigrama en menos de 5 minutos',
      icon: '⚡',
      category: 'time',
      rarity: 'rare',
      points: 150,
      unlocked: false,
      requirements: { type: 'time_under', value: 300 }
    },
    {
      id: 'no_hints',
      title: 'Mente Brillante',
      description: 'Completa un crucigrama sin usar pistas',
      icon: '🧠',
      category: 'games',
      rarity: 'rare',
      points: 100,
      unlocked: false,
      requirements: { type: 'no_hints', value: 0 }
    },
    {
      id: 'streak_5',
      title: 'Racha de Fuego',
      description: 'Juega 5 días consecutivos',
      icon: '🔥',
      category: 'streak',
      rarity: 'rare',
      points: 250,
      unlocked: false,
      requirements: { type: 'streak_days', value: 5 }
    },
    {
      id: 'science_master',
      title: 'Maestro de las Ciencias',
      description: 'Completa 10 crucigramas de Ciencias',
      icon: '🔬',
      category: 'subject',
      rarity: 'rare',
      points: 200,
      unlocked: false,
      requirements: { type: 'subject_games', value: 10, subject: 'Ciencias' }
    },
    {
      id: 'history_buff',
      title: 'Amante de la Historia',
      description: 'Completa 10 crucigramas de Historia',
      icon: '📚',
      category: 'subject',
      rarity: 'rare',
      points: 200,
      unlocked: false,
      requirements: { type: 'subject_games', value: 10, subject: 'Historia' }
    },
    {
      id: 'math_wizard',
      title: 'Mago de las Matemáticas',
      description: 'Completa 10 crucigramas de Matemáticas',
      icon: '🔢',
      category: 'subject',
      rarity: 'rare',
      points: 200,
      unlocked: false,
      requirements: { type: 'subject_games', value: 10, subject: 'Matemáticas' }
    },
    {
      id: 'marathon_player',
      title: 'Maratonista',
      description: 'Juega por más de 60 minutos en un día',
      icon: '🏃',
      category: 'time',
      rarity: 'epic',
      points: 300,
      unlocked: false,
      requirements: { type: 'daily_time', value: 3600 }
    },
    {
      id: 'social_butterfly',
      title: 'Mariposa Social',
      description: 'Comparte 5 crucigramas',
      icon: '🦋',
      category: 'special',
      rarity: 'rare',
      points: 150,
      unlocked: false,
      requirements: { type: 'shares', value: 5 }
    },
    {
      id: 'level_10',
      title: 'Leyenda Viviente',
      description: 'Alcanza el nivel 10',
      icon: '👑',
      category: 'special',
      rarity: 'legendary',
      points: 1000,
      unlocked: false,
      requirements: { type: 'level', value: 10 }
    }
  ]

  // Verificar cada logro
  allAchievements.forEach(achievement => {
    if (achievement.unlocked || !achievement.requirements) return

    const req = achievement.requirements
    let shouldUnlock = false

    switch (req.type) {
      case 'perfect_score':
        shouldUnlock = stats.score >= req.value
        break
      case 'time_under':
        shouldUnlock = stats.timeElapsed <= req.value
        break
      case 'no_hints':
        shouldUnlock = stats.hintsUsed === req.value
        break
      case 'games_played':
        shouldUnlock = (playerData.totalGames || 0) >= req.value
        break
      case 'streak_days':
        shouldUnlock = (playerData.currentStreak || 0) >= req.value
        break
      case 'subject_games':
        const subjectGames = playerData.subjectStats?.[req.subject!]?.gamesPlayed || 0
        shouldUnlock = subjectGames >= req.value
        break
      case 'level':
        shouldUnlock = (playerData.level || 1) >= req.value
        break
    }

    if (shouldUnlock) {
      newAchievements.push({
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      })
    }
  })

  return newAchievements
}

// Generar desafíos diarios
export function generateDailyChallenges(): DailyChallenge[] {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const challenges: DailyChallenge[] = [
    {
      id: 'daily_games',
      title: 'Jugador Activo',
      description: 'Completa 3 crucigramas hoy',
      icon: '🎮',
      target: 3,
      progress: 0,
      reward: { points: 100, powerUps: ['hint_boost'] },
      expiresAt: tomorrow.toISOString(),
      type: 'games',
      difficulty: 'easy'
    },
    {
      id: 'daily_score',
      title: 'Puntuación Alta',
      description: 'Obtén más de 85% en 2 crucigramas',
      icon: '🎯',
      target: 2,
      progress: 0,
      reward: { points: 150, powerUps: ['score_boost'] },
      expiresAt: tomorrow.toISOString(),
      type: 'score',
      difficulty: 'medium'
    },
    {
      id: 'daily_speed',
      title: 'Velocista',
      description: 'Completa un crucigrama en menos de 8 minutos',
      icon: '⚡',
      target: 1,
      progress: 0,
      reward: { points: 200, powerUps: ['time_freeze'] },
      expiresAt: tomorrow.toISOString(),
      type: 'time',
      difficulty: 'hard'
    }
  ]

  return challenges
}

// Power-ups disponibles
export function getAvailablePowerUps(): PowerUp[] {
  return [
    {
      id: 'hint_boost',
      name: 'Pista Extra',
      description: 'Obtén una pista adicional para el próximo juego',
      icon: '💡',
      cost: 50,
      effect: 'extra_hint',
      unlockLevel: 2,
      category: 'hint'
    },
    {
      id: 'time_freeze',
      name: 'Congelar Tiempo',
      description: 'Pausa el cronómetro por 30 segundos',
      icon: '❄️',
      cost: 100,
      effect: 'freeze_timer',
      duration: 30,
      unlockLevel: 3,
      category: 'time'
    },
    {
      id: 'score_boost',
      name: 'Impulso de Puntuación',
      description: 'Multiplica tu puntuación final por 1.5x',
      icon: '🚀',
      cost: 150,
      effect: 'score_multiplier',
      unlockLevel: 4,
      category: 'score'
    },
    {
      id: 'double_xp',
      name: 'Doble Experiencia',
      description: 'Duplica los puntos XP del próximo juego',
      icon: '⭐',
      cost: 200,
      effect: 'double_experience',
      unlockLevel: 5,
      category: 'special'
    },
    {
      id: 'reveal_letter',
      name: 'Revelar Letra',
      description: 'Revela una letra aleatoria en el crucigrama',
      icon: '🔍',
      cost: 75,
      effect: 'reveal_random_letter',
      unlockLevel: 3,
      category: 'hint'
    },
    {
      id: 'skip_question',
      name: 'Saltar Pregunta',
      description: 'Marca una pregunta como correcta automáticamente',
      icon: '⏭️',
      cost: 250,
      effect: 'auto_complete_question',
      unlockLevel: 6,
      category: 'special'
    }
  ]
}

// Calcular posición en leaderboard
export function calculateLeaderboardPosition(
  playerPoints: number,
  allPlayers: LeaderboardEntry[]
): number {
  const sortedPlayers = allPlayers.sort((a, b) => b.points - a.points)
  return sortedPlayers.findIndex(p => p.points <= playerPoints) + 1
}

// Generar recompensas por nivel
export function getLevelRewards(level: number): {
  points: number
  powerUps: string[]
  achievements: string[]
} {
  const baseReward = level * 100
  const powerUps: string[] = []
  const achievements: string[] = []

  // Recompensas especiales por nivel
  if (level === 2) powerUps.push('hint_boost')
  if (level === 3) powerUps.push('time_freeze')
  if (level === 5) powerUps.push('double_xp')
  if (level === 10) achievements.push('level_10')

  return {
    points: baseReward,
    powerUps,
    achievements
  }
}
