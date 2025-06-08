// Perfect Crossword Generator - Algoritmo que genera crucigramas perfectos
export interface CrosswordQuestion {
  id: string
  question: string
  answer: string
  category: string
  difficulty: string
  position: {
    row: number
    col: number
    direction: 'horizontal' | 'vertical'
  }
  number: number
}

export interface CrosswordData {
  id: string
  title: string
  subject: string
  difficulty: string
  estimatedTime: string
  questions: CrosswordQuestion[]
}

interface PlacedWord {
  word: string
  row: number
  col: number
  direction: 'horizontal' | 'vertical'
  questionId: string
  questionData: Omit<CrosswordQuestion, 'position' | 'number'>
}

interface Intersection {
  word1: PlacedWord
  word2: PlacedWord
  word1LetterIndex: number
  word2LetterIndex: number
  row: number
  col: number
  letter: string
}

export class PerfectCrosswordGenerator {
  private grid: string[][]
  private gridSize: number
  private placedWords: PlacedWord[]
  private intersections: Intersection[]

  constructor(gridSize: number = 15) {
    this.gridSize = gridSize
    this.grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''))
    this.placedWords = []
    this.intersections = []
  }

  // Generar crucigrama perfecto
  generatePerfectCrossword(questions: Omit<CrosswordQuestion, 'position' | 'number'>[]): CrosswordQuestion[] {
    console.log('🎯 Iniciando generación de crucigrama perfecto...')
    
    // Limpiar estado
    this.reset()
    
    // Ordenar palabras por longitud (más largas primero para mejor colocación)
    const sortedQuestions = [...questions].sort((a, b) => b.answer.length - a.answer.length)
    
    // Colocar primera palabra en el centro
    const firstQuestion = sortedQuestions[0]
    this.placeFirstWord(firstQuestion)
    
    // Colocar las demás palabras usando intersecciones válidas
    for (let i = 1; i < sortedQuestions.length; i++) {
      const question = sortedQuestions[i]
      const placed = this.placePerfectWord(question)
      
      if (!placed) {
        console.warn(`⚠️ No se pudo colocar la palabra: ${question.answer}`)
        // Intentar con algoritmo de respaldo
        this.placeWordWithBackup(question)
      }
    }
    
    // Verificar que todas las palabras estén conectadas
    if (!this.areAllWordsConnected()) {
      console.warn('⚠️ Algunas palabras quedaron aisladas, reintentando...')
      return this.retryWithDifferentStrategy(questions)
    }
    
    // Convertir a formato final
    const result = this.convertToFinalFormat()
    console.log('✅ Crucigrama perfecto generado exitosamente')
    
    return result
  }

  private reset() {
    this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''))
    this.placedWords = []
    this.intersections = []
  }

  private placeFirstWord(question: Omit<CrosswordQuestion, 'position' | 'number'>) {
    const word = question.answer.toUpperCase()
    const centerRow = Math.floor(this.gridSize / 2)
    const centerCol = Math.floor((this.gridSize - word.length) / 2)
    
    this.placeWordOnGrid(word, centerRow, centerCol, 'horizontal', question)
    console.log(`📍 Palabra central colocada: ${word} en (${centerRow}, ${centerCol})`)
  }

  private placePerfectWord(question: Omit<CrosswordQuestion, 'position' | 'number'>): boolean {
    const word = question.answer.toUpperCase()
    const possiblePlacements = this.findAllValidPlacements(word, question)
    
    // Ordenar por calidad de colocación (más intersecciones = mejor)
    possiblePlacements.sort((a, b) => b.intersectionCount - a.intersectionCount)
    
    for (const placement of possiblePlacements) {
      if (this.canPlaceWordSafely(word, placement.row, placement.col, placement.direction)) {
        this.placeWordOnGrid(word, placement.row, placement.col, placement.direction, question)
        console.log(`✅ Palabra colocada: ${word} en (${placement.row}, ${placement.col}) ${placement.direction}`)
        return true
      }
    }
    
    return false
  }

  private findAllValidPlacements(word: string, question: Omit<CrosswordQuestion, 'position' | 'number'>) {
    const placements: Array<{
      row: number
      col: number
      direction: 'horizontal' | 'vertical'
      intersectionCount: number
    }> = []

    // Buscar intersecciones con palabras ya colocadas
    for (const placedWord of this.placedWords) {
      const intersections = this.findLetterIntersections(word, placedWord.word)
      
      for (const intersection of intersections) {
        // Calcular posición para intersección
        const newDirection = placedWord.direction === 'horizontal' ? 'vertical' : 'horizontal'
        
        let newRow: number, newCol: number
        
        if (newDirection === 'horizontal') {
          newRow = placedWord.direction === 'vertical' 
            ? placedWord.row + intersection.placedWordIndex 
            : placedWord.row
          newCol = placedWord.direction === 'horizontal' 
            ? placedWord.col + intersection.placedWordIndex - intersection.newWordIndex
            : placedWord.col - intersection.newWordIndex
        } else {
          newRow = placedWord.direction === 'vertical' 
            ? placedWord.row + intersection.placedWordIndex - intersection.newWordIndex
            : placedWord.row - intersection.newWordIndex
          newCol = placedWord.direction === 'horizontal' 
            ? placedWord.col + intersection.placedWordIndex
            : placedWord.col
        }
        
        // Verificar que esté dentro del grid
        if (this.isWithinBounds(newRow, newCol, word.length, newDirection)) {
          placements.push({
            row: newRow,
            col: newCol,
            direction: newDirection,
            intersectionCount: 1
          })
        }
      }
    }
    
    return placements
  }

  private findLetterIntersections(word1: string, word2: string) {
    const intersections = []
    
    for (let i = 0; i < word1.length; i++) {
      for (let j = 0; j < word2.length; j++) {
        if (word1[i] === word2[j]) {
          intersections.push({
            newWordIndex: i,
            placedWordIndex: j,
            letter: word1[i]
          })
        }
      }
    }
    
    return intersections
  }

  private canPlaceWordSafely(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    // Verificar límites
    if (!this.isWithinBounds(row, col, word.length, direction)) {
      return false
    }
    
    // Verificar que no forme palabras adyacentes inválidas
    if (!this.checkNoAdjacentWords(word, row, col, direction)) {
      return false
    }
    
    // Verificar intersecciones válidas
    if (!this.checkValidIntersections(word, row, col, direction)) {
      return false
    }
    
    return true
  }

  private checkNoAdjacentWords(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    // Verificar que no haya letras antes del inicio
    if (direction === 'horizontal') {
      if (col > 0 && this.grid[row][col - 1] !== '') return false
      if (col + word.length < this.gridSize && this.grid[row][col + word.length] !== '') return false
    } else {
      if (row > 0 && this.grid[row - 1][col] !== '') return false
      if (row + word.length < this.gridSize && this.grid[row + word.length][col] !== '') return false
    }
    
    // Verificar que no se formen palabras perpendiculares inválidas
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col
      
      // Si esta posición ya tiene una letra, debe coincidir
      if (this.grid[currentRow][currentCol] !== '' && this.grid[currentRow][currentCol] !== word[i]) {
        return false
      }
      
      // Si es una nueva posición, verificar que no forme palabras perpendiculares
      if (this.grid[currentRow][currentCol] === '') {
        if (direction === 'horizontal') {
          // Verificar arriba y abajo
          if ((currentRow > 0 && this.grid[currentRow - 1][currentCol] !== '') ||
              (currentRow < this.gridSize - 1 && this.grid[currentRow + 1][currentCol] !== '')) {
            return false
          }
        } else {
          // Verificar izquierda y derecha
          if ((currentCol > 0 && this.grid[currentRow][currentCol - 1] !== '') ||
              (currentCol < this.gridSize - 1 && this.grid[currentRow][currentCol + 1] !== '')) {
            return false
          }
        }
      }
    }
    
    return true
  }

  private checkValidIntersections(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    let hasIntersection = false
    
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col
      
      if (this.grid[currentRow][currentCol] !== '') {
        if (this.grid[currentRow][currentCol] === word[i]) {
          hasIntersection = true
        } else {
          return false // Intersección inválida
        }
      }
    }
    
    // Debe tener al menos una intersección (excepto la primera palabra)
    return this.placedWords.length === 0 || hasIntersection
  }

  private isWithinBounds(row: number, col: number, wordLength: number, direction: 'horizontal' | 'vertical'): boolean {
    if (row < 0 || col < 0) return false
    
    if (direction === 'horizontal') {
      return col + wordLength <= this.gridSize && row < this.gridSize
    } else {
      return row + wordLength <= this.gridSize && col < this.gridSize
    }
  }

  private placeWordOnGrid(word: string, row: number, col: number, direction: 'horizontal' | 'vertical', question: Omit<CrosswordQuestion, 'position' | 'number'>) {
    // Colocar letras en el grid
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col
      this.grid[currentRow][currentCol] = word[i]
    }
    
    // Registrar palabra colocada
    this.placedWords.push({
      word,
      row,
      col,
      direction,
      questionId: question.id,
      questionData: question
    })
  }

  private placeWordWithBackup(question: Omit<CrosswordQuestion, 'position' | 'number'>) {
    // Algoritmo de respaldo: buscar cualquier posición válida
    const word = question.answer.toUpperCase()
    
    for (let row = 0; row < this.gridSize - word.length; row++) {
      for (let col = 0; col < this.gridSize - word.length; col++) {
        for (const direction of ['horizontal', 'vertical'] as const) {
          if (this.canPlaceWordSafely(word, row, col, direction)) {
            this.placeWordOnGrid(word, row, col, direction, question)
            console.log(`🔄 Palabra colocada con respaldo: ${word}`)
            return true
          }
        }
      }
    }
    
    return false
  }

  private areAllWordsConnected(): boolean {
    if (this.placedWords.length <= 1) return true
    
    // Usar BFS para verificar conectividad
    const visited = new Set<string>()
    const queue = [this.placedWords[0]]
    visited.add(this.placedWords[0].questionId)
    
    while (queue.length > 0) {
      const currentWord = queue.shift()!
      
      // Buscar palabras que intersectan con la actual
      for (const otherWord of this.placedWords) {
        if (!visited.has(otherWord.questionId) && this.wordsIntersect(currentWord, otherWord)) {
          visited.add(otherWord.questionId)
          queue.push(otherWord)
        }
      }
    }
    
    return visited.size === this.placedWords.length
  }

  private wordsIntersect(word1: PlacedWord, word2: PlacedWord): boolean {
    // Verificar si dos palabras se intersectan
    for (let i = 0; i < word1.word.length; i++) {
      const row1 = word1.direction === 'vertical' ? word1.row + i : word1.row
      const col1 = word1.direction === 'horizontal' ? word1.col + i : word1.col
      
      for (let j = 0; j < word2.word.length; j++) {
        const row2 = word2.direction === 'vertical' ? word2.row + j : word2.row
        const col2 = word2.direction === 'horizontal' ? word2.col + j : word2.col
        
        if (row1 === row2 && col1 === col2) {
          return true
        }
      }
    }
    
    return false
  }

  private retryWithDifferentStrategy(questions: Omit<CrosswordQuestion, 'position' | 'number'>[]): CrosswordQuestion[] {
    console.log('🔄 Reintentando con estrategia diferente...')
    
    // Reiniciar y probar con orden diferente
    this.reset()
    
    // Ordenar por frecuencia de letras comunes
    const sortedByConnectivity = this.sortByConnectivity(questions)
    
    // Intentar nuevamente
    return this.generatePerfectCrossword(sortedByConnectivity)
  }

  private sortByConnectivity(questions: Omit<CrosswordQuestion, 'position' | 'number'>[]): Omit<CrosswordQuestion, 'position' | 'number'>[] {
    // Calcular conectividad basada en letras comunes
    return questions.sort((a, b) => {
      const connectivityA = this.calculateConnectivity(a.answer, questions)
      const connectivityB = this.calculateConnectivity(b.answer, questions)
      return connectivityB - connectivityA
    })
  }

  private calculateConnectivity(word: string, allWords: Omit<CrosswordQuestion, 'position' | 'number'>[]): number {
    let connectivity = 0
    
    for (const otherQuestion of allWords) {
      if (otherQuestion.answer !== word) {
        connectivity += this.countCommonLetters(word, otherQuestion.answer)
      }
    }
    
    return connectivity
  }

  private countCommonLetters(word1: string, word2: string): number {
    let count = 0
    
    for (const letter1 of word1) {
      if (word2.includes(letter1)) {
        count++
      }
    }
    
    return count
  }

  private convertToFinalFormat(): CrosswordQuestion[] {
    return this.placedWords.map((placedWord, index) => ({
      ...placedWord.questionData,
      position: {
        row: placedWord.row,
        col: placedWord.col,
        direction: placedWord.direction
      },
      number: index + 1
    }))
  }

  // Método para debug
  printGrid(): void {
    console.log('📋 Grid del crucigrama:')
    for (let row = 0; row < this.gridSize; row++) {
      let rowStr = ''
      for (let col = 0; col < this.gridSize; col++) {
        rowStr += (this.grid[row][col] || '.') + ' '
      }
      console.log(rowStr)
    }
  }
}

// Función para generar crucigrama de Revolución Francesa usando el algoritmo perfecto
export function generatePerfectRevolutionCrossword(): CrosswordData {
  const generator = new PerfectCrosswordGenerator(15)
  
  const questions = [
    {
      id: '1',
      question: 'Rey de Francia ejecutado durante la revolución',
      answer: 'LUIS',
      category: 'Personajes',
      difficulty: 'Medio'
    },
    {
      id: '2',
      question: 'Fortaleza tomada el 14 de julio de 1789',
      answer: 'BASTILLA',
      category: 'Eventos',
      difficulty: 'Medio'
    },
    {
      id: '3',
      question: 'Líder del período del Terror',
      answer: 'ROBESPIERRE',
      category: 'Personajes',
      difficulty: 'Difícil'
    },
    {
      id: '4',
      question: 'Clase social privilegiada antes de la revolución',
      answer: 'NOBLEZA',
      category: 'Sociedad',
      difficulty: 'Fácil'
    },
    {
      id: '5',
      question: 'Documento que declaraba los derechos fundamentales',
      answer: 'DECLARACION',
      category: 'Documentos',
      difficulty: 'Medio'
    }
  ]

  const generatedQuestions = generator.generatePerfectCrossword(questions)
  
  // Debug
  generator.printGrid()
  
  return {
    id: 'revolucion-francesa',
    title: 'Revolución Francesa',
    subject: 'Historia',
    difficulty: 'Medio',
    estimatedTime: '12-15 min',
    questions: generatedQuestions
  }
}
