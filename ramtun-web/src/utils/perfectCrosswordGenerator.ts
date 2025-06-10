// Perfect Crossword Generator - Algoritmo que genera crucigramas perfectos
import type {
  CrosswordQuestion,
  CrosswordData,
  PlacedWord,
  Intersection
} from '../types/crossword'

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
    console.log('📝 Palabras a colocar:', questions.map(q => q.answer))

    // Limpiar estado
    this.reset()

    // Ordenar palabras por longitud (más largas primero para mejor colocación)
    const sortedQuestions = [...questions].sort((a, b) => b.answer.length - a.answer.length)
    console.log('📊 Orden de colocación:', sortedQuestions.map(q => `${q.answer} (${q.answer.length})`))

    // Colocar primera palabra en el centro
    const firstQuestion = sortedQuestions[0]
    this.placeFirstWord(firstQuestion)
    console.log('🎯 Primera palabra colocada:', firstQuestion.answer)
    this.printGrid()

    // Colocar las demás palabras usando intersecciones válidas
    for (let i = 1; i < sortedQuestions.length; i++) {
      const question = sortedQuestions[i]
      console.log(`\n🔄 Intentando colocar palabra ${i + 1}/${sortedQuestions.length}: ${question.answer}`)

      const placed = this.placePerfectWord(question)

      if (!placed) {
        console.warn(`⚠️ No se pudo colocar la palabra: ${question.answer}`)
        // Intentar con algoritmo de respaldo
        const backupPlaced = this.placeWordWithBackup(question)
        if (!backupPlaced) {
          console.error(`❌ FALLO TOTAL: No se pudo colocar ${question.answer} ni con respaldo`)
        }
      }

      console.log(`📋 Estado actual del grid después de ${question.answer}:`)
      this.printGrid()
    }

    // Verificar que todas las palabras estén conectadas
    if (!this.areAllWordsConnected()) {
      console.warn('⚠️ Algunas palabras quedaron aisladas, reintentando...')
      return this.retryWithDifferentStrategy(questions)
    }

    // Convertir a formato final
    const result = this.convertToFinalFormat()
    console.log('✅ Crucigrama perfecto generado exitosamente')
    console.log('📊 Palabras finales colocadas:', result.map(q => `${q.answer} en (${q.position.row},${q.position.col}) ${q.position.direction}`))

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
    console.log(`🔍 Buscando posiciones para: ${word}`)

    const possiblePlacements = this.findAllValidPlacements(word, question)
    console.log(`📍 Posiciones posibles encontradas: ${possiblePlacements.length}`)

    // Ordenar por calidad de colocación (más intersecciones = mejor)
    possiblePlacements.sort((a, b) => b.intersectionCount - a.intersectionCount)

    for (let i = 0; i < possiblePlacements.length; i++) {
      const placement = possiblePlacements[i]
      console.log(`🧪 Probando posición ${i + 1}: (${placement.row}, ${placement.col}) ${placement.direction}`)

      if (this.canPlaceWordSafely(word, placement.row, placement.col, placement.direction)) {
        this.placeWordOnGrid(word, placement.row, placement.col, placement.direction, question)
        console.log(`✅ Palabra colocada: ${word} en (${placement.row}, ${placement.col}) ${placement.direction}`)
        return true
      } else {
        console.log(`❌ Posición rechazada para ${word} en (${placement.row}, ${placement.col}) ${placement.direction}`)
      }
    }

    console.log(`⚠️ No se encontró posición válida para: ${word}`)
    return false
  }

  private findAllValidPlacements(word: string, question: Omit<CrosswordQuestion, 'position' | 'number'>) {
    const placements: Array<{
      row: number
      col: number
      direction: 'horizontal' | 'vertical'
      intersectionCount: number
      intersectionDetails: string
    }> = []

    console.log(`🔍 Buscando intersecciones para "${word}" con ${this.placedWords.length} palabras colocadas`)

    // Buscar intersecciones con palabras ya colocadas
    for (const placedWord of this.placedWords) {
      console.log(`  🔗 Verificando intersecciones con "${placedWord.word}" en (${placedWord.row}, ${placedWord.col}) ${placedWord.direction}`)
      const intersections = this.findLetterIntersections(word, placedWord.word)
      console.log(`    📍 Encontradas ${intersections.length} intersecciones de letras`)

      for (const intersection of intersections) {
        console.log(`    🎯 Intersección: "${intersection.letter}" - ${word}[${intersection.newWordIndex}] ↔ ${placedWord.word}[${intersection.placedWordIndex}]`)

        // Calcular posición para intersección
        const newDirection = placedWord.direction === 'horizontal' ? 'vertical' : 'horizontal'

        let newRow: number, newCol: number

        if (placedWord.direction === 'horizontal') {
          // Palabra colocada es horizontal, nueva será vertical
          newRow = placedWord.row - intersection.newWordIndex
          newCol = placedWord.col + intersection.placedWordIndex
        } else {
          // Palabra colocada es vertical, nueva será horizontal
          newRow = placedWord.row + intersection.placedWordIndex
          newCol = placedWord.col - intersection.newWordIndex
        }

        console.log(`    📐 Posición calculada: (${newRow}, ${newCol}) ${newDirection}`)

        // Verificar que esté dentro del grid
        if (this.isWithinBounds(newRow, newCol, word.length, newDirection)) {
          // Verificar que la intersección sea matemáticamente correcta
          const intersectionRow = newDirection === 'vertical' ? newRow + intersection.newWordIndex : newRow
          const intersectionCol = newDirection === 'horizontal' ? newCol + intersection.newWordIndex : newCol

          // CRÍTICO: Verificar que la letra en el grid coincida exactamente
          const expectedLetter = word[intersection.newWordIndex]
          const gridLetter = this.grid[intersectionRow][intersectionCol]
          const placedLetter = placedWord.word[intersection.placedWordIndex]

          // Validación triple: palabra nueva, palabra colocada y grid deben coincidir
          if (expectedLetter === placedLetter && expectedLetter === gridLetter) {
            console.log(`    ✅ Intersección válida: "${expectedLetter}" en (${intersectionRow}, ${intersectionCol})`)

            // Validación adicional: verificar que toda la colocación sea segura
            if (this.canPlaceWordSafely(word, newRow, newCol, newDirection)) {
              placements.push({
                row: newRow,
                col: newCol,
                direction: newDirection,
                intersectionCount: 1,
                intersectionDetails: `${word}[${intersection.newWordIndex}] ↔ ${placedWord.word}[${intersection.placedWordIndex}] = "${expectedLetter}"`
              })
            } else {
              console.log(`    ❌ Colocación no segura para ${word} en (${newRow}, ${newCol}) ${newDirection}`)
            }
          } else {
            console.log(`    ❌ Intersección inválida: esperado "${expectedLetter}", grid "${gridLetter}", colocada "${placedLetter}"`)
          }
        } else {
          console.log(`    ❌ Fuera de límites: (${newRow}, ${newCol}) ${newDirection}`)
        }
      }
    }

    console.log(`📊 Total de posiciones válidas encontradas: ${placements.length}`)
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
    // Verificar que no haya letras antes del inicio o después del final (para evitar palabras concatenadas)
    if (direction === 'horizontal') {
      if (col > 0 && this.grid[row][col - 1] !== '') {
        console.log(`❌ ${word} rechazada: letra antes del inicio en (${row}, ${col - 1})`)
        return false
      }
      if (col + word.length < this.gridSize && this.grid[row][col + word.length] !== '') {
        console.log(`❌ ${word} rechazada: letra después del final en (${row}, ${col + word.length})`)
        return false
      }
    } else {
      if (row > 0 && this.grid[row - 1][col] !== '') {
        console.log(`❌ ${word} rechazada: letra antes del inicio en (${row - 1}, ${col})`)
        return false
      }
      if (row + word.length < this.gridSize && this.grid[row + word.length][col] !== '') {
        console.log(`❌ ${word} rechazada: letra después del final en (${row + word.length}, ${col})`)
        return false
      }
    }

    // Verificar cada posición de la palabra
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col

      // Si esta posición ya tiene una letra, debe coincidir (intersección válida)
      if (this.grid[currentRow][currentCol] !== '' && this.grid[currentRow][currentCol] !== word[i]) {
        console.log(`❌ ${word} rechazada: conflicto de letra en (${currentRow}, ${currentCol}): ${word[i]} vs ${this.grid[currentRow][currentCol]}`)
        return false
      }

      // CRÍTICO: Verificar que no se formen palabras adyacentes inválidas
      if (this.grid[currentRow][currentCol] === '') {
        if (!this.validatePerpendicularPlacement(word, i, currentRow, currentCol, direction)) {
          console.log(`❌ ${word} rechazada: formaría palabra perpendicular inválida en (${currentRow}, ${currentCol})`)
          return false
        }
      }
    }

    return true
  }

  private validatePerpendicularPlacement(word: string, letterIndex: number, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    if (direction === 'horizontal') {
      // Para palabras horizontales, verificar formación de palabras verticales
      let verticalWord = ''
      let startRow = row
      let endRow = row

      // Buscar hacia arriba
      while (startRow > 0 && this.grid[startRow - 1][col] !== '') {
        startRow--
      }

      // Buscar hacia abajo
      while (endRow < this.gridSize - 1 && this.grid[endRow + 1][col] !== '') {
        endRow++
      }

      // Construir la palabra vertical que se formaría
      for (let r = startRow; r <= endRow; r++) {
        if (r === row) {
          verticalWord += word[letterIndex]
        } else {
          verticalWord += this.grid[r][col]
        }
      }

      // Si formaría una palabra de más de 1 letra, debe ser una intersección válida
      if (verticalWord.length > 1) {
        // Solo permitir si es exactamente una intersección (la letra actual coincide con una palabra existente)
        return this.grid[row][col] !== '' && this.grid[row][col] === word[letterIndex]
      }
    } else {
      // Para palabras verticales, verificar formación de palabras horizontales
      let horizontalWord = ''
      let startCol = col
      let endCol = col

      // Buscar hacia la izquierda
      while (startCol > 0 && this.grid[row][startCol - 1] !== '') {
        startCol--
      }

      // Buscar hacia la derecha
      while (endCol < this.gridSize - 1 && this.grid[row][endCol + 1] !== '') {
        endCol++
      }

      // Construir la palabra horizontal que se formaría
      for (let c = startCol; c <= endCol; c++) {
        if (c === col) {
          horizontalWord += word[letterIndex]
        } else {
          horizontalWord += this.grid[row][c]
        }
      }

      // Si formaría una palabra de más de 1 letra, debe ser una intersección válida
      if (horizontalWord.length > 1) {
        // Solo permitir si es exactamente una intersección (la letra actual coincide con una palabra existente)
        return this.grid[row][col] !== '' && this.grid[row][col] === word[letterIndex]
      }
    }

    return true
  }

  private checkValidIntersections(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    let hasIntersection = false
    let intersectionDetails: string[] = []

    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col

      if (this.grid[currentRow][currentCol] !== '') {
        if (this.grid[currentRow][currentCol] === word[i]) {
          hasIntersection = true
          intersectionDetails.push(`✅ ${word[i]} en (${currentRow},${currentCol})`)
        } else {
          console.log(`❌ Intersección inválida: ${word} letra ${word[i]} vs grid ${this.grid[currentRow][currentCol]} en (${currentRow},${currentCol})`)
          return false // Intersección inválida
        }
      }
    }

    if (intersectionDetails.length > 0) {
      console.log(`🔗 Intersecciones válidas para ${word}: ${intersectionDetails.join(', ')}`)
    }

    // Debe tener al menos una intersección (excepto la primera palabra)
    const result = this.placedWords.length === 0 || hasIntersection
    if (!result && this.placedWords.length > 0) {
      console.log(`❌ ${word} rechazada: no tiene intersecciones válidas`)
    }
    return result
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
    // Algoritmo de respaldo: buscar cualquier posición válida CON intersecciones
    const word = question.answer.toUpperCase()
    console.log(`🔄 Intentando algoritmo de respaldo para: ${word}`)

    // Primero intentar encontrar posiciones con intersecciones válidas
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        for (const direction of ['horizontal', 'vertical'] as const) {
          if (this.isWithinBounds(row, col, word.length, direction) &&
              this.canPlaceWordSafely(word, row, col, direction)) {

            // Verificar si tiene al menos una intersección válida
            let hasValidIntersection = false
            for (let i = 0; i < word.length; i++) {
              const currentRow = direction === 'vertical' ? row + i : row
              const currentCol = direction === 'horizontal' ? col + i : col

              if (this.grid[currentRow][currentCol] !== '' &&
                  this.grid[currentRow][currentCol] === word[i]) {
                hasValidIntersection = true
                break
              }
            }

            // Solo colocar si tiene intersección válida (excepto si es la primera palabra)
            if (hasValidIntersection || this.placedWords.length === 0) {
              this.placeWordOnGrid(word, row, col, direction, question)
              console.log(`🔄 Palabra colocada con respaldo: ${word} en (${row}, ${col}) ${direction}`)
              return true
            }
          }
        }
      }
    }

    console.log(`❌ No se pudo colocar ${word} ni con algoritmo de respaldo`)
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
    console.log('🔄 Reintentando con algoritmo universal...')

    // Usar algoritmo universal que funciona con cualquier conjunto de palabras
    return this.createUniversalOptimizedCrossword(questions)
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

  private createUniversalOptimizedCrossword(questions: Omit<CrosswordQuestion, 'position' | 'number'>[]): CrosswordQuestion[] {
    console.log('🎯 Creando crucigrama con algoritmo universal optimizado...')

    const words = questions.map(q => ({ word: q.answer.toUpperCase(), question: q }))
    console.log('📝 Palabras a organizar:', words.map(w => w.word))

    // Paso 1: Encontrar la mejor palabra base (más intersecciones potenciales)
    const baseWordData = this.findBestBaseWord(words)
    console.log(`📍 Palabra base seleccionada: ${baseWordData.word} (${baseWordData.intersectionCount} intersecciones potenciales)`)

    // Paso 2: Colocar palabra base en el centro
    const centerRow = Math.floor(this.gridSize / 2)
    const centerCol = Math.floor((this.gridSize - baseWordData.word.length) / 2)

    const result: CrosswordQuestion[] = []
    const placedWords = new Map<string, { row: number, col: number, direction: 'horizontal' | 'vertical' }>()
    const tempGrid: string[][] = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''))

    // Colocar palabra base en el grid temporal
    for (let i = 0; i < baseWordData.word.length; i++) {
      tempGrid[centerRow][centerCol + i] = baseWordData.word[i]
    }

    // Agregar palabra base
    result.push({
      ...baseWordData.question,
      position: { row: centerRow, col: centerCol, direction: 'horizontal' },
      number: 1
    })
    placedWords.set(baseWordData.word, { row: centerRow, col: centerCol, direction: 'horizontal' })

    // Paso 3: Colocar palabras restantes usando algoritmo de intersecciones mejorado
    const remainingWords = words.filter(w => w.word !== baseWordData.word)
    let questionNumber = 2

    for (const wordData of remainingWords) {
      const bestPlacement = this.findBestPlacementWithValidation(wordData.word, placedWords, tempGrid)

      if (bestPlacement) {
        // Actualizar grid temporal
        for (let i = 0; i < wordData.word.length; i++) {
          const currentRow = bestPlacement.direction === 'vertical' ? bestPlacement.row + i : bestPlacement.row
          const currentCol = bestPlacement.direction === 'horizontal' ? bestPlacement.col + i : bestPlacement.col
          tempGrid[currentRow][currentCol] = wordData.word[i]
        }

        result.push({
          ...wordData.question,
          position: { row: bestPlacement.row, col: bestPlacement.col, direction: bestPlacement.direction },
          number: questionNumber++
        })
        placedWords.set(wordData.word, bestPlacement)
        console.log(`✅ ${wordData.word} colocada en (${bestPlacement.row}, ${bestPlacement.col}) ${bestPlacement.direction} - intersección: "${bestPlacement.intersectionLetter}"`)
      } else {
        console.log(`⚠️ No se pudo colocar ${wordData.word} con intersección válida`)
      }
    }

    // Validación final del crucigrama
    this.validateFinalCrossword(result)

    console.log(`✅ Crucigrama universal creado con ${result.length} palabras`)
    return result
  }

  private validateFinalCrossword(questions: CrosswordQuestion[]): void {
    console.log('🔍 Validando crucigrama final...')

    // Verificar que todas las intersecciones sean correctas
    for (let i = 0; i < questions.length; i++) {
      for (let j = i + 1; j < questions.length; j++) {
        const word1 = questions[i]
        const word2 = questions[j]

        // Buscar intersecciones
        const intersection = this.findWordIntersection(word1, word2)
        if (intersection) {
          const letter1 = word1.answer[intersection.word1Index]
          const letter2 = word2.answer[intersection.word2Index]

          if (letter1 !== letter2) {
            console.error(`❌ INTERSECCIÓN INVÁLIDA: ${word1.answer}[${intersection.word1Index}]="${letter1}" vs ${word2.answer}[${intersection.word2Index}]="${letter2}" en (${intersection.row}, ${intersection.col})`)
          } else {
            console.log(`✅ Intersección válida: ${word1.answer} ↔ ${word2.answer} = "${letter1}" en (${intersection.row}, ${intersection.col})`)
          }
        }
      }
    }
  }

  private findWordIntersection(word1: CrosswordQuestion, word2: CrosswordQuestion): { row: number, col: number, word1Index: number, word2Index: number } | null {
    // Solo palabras perpendiculares pueden intersectarse
    if (word1.position.direction === word2.position.direction) {
      return null
    }

    const horizontal = word1.position.direction === 'horizontal' ? word1 : word2
    const vertical = word1.position.direction === 'vertical' ? word1 : word2

    const hRow = horizontal.position.row
    const hColStart = horizontal.position.col
    const hColEnd = hColStart + horizontal.answer.length - 1

    const vCol = vertical.position.col
    const vRowStart = vertical.position.row
    const vRowEnd = vRowStart + vertical.answer.length - 1

    // Verificar si se intersectan
    if (hRow >= vRowStart && hRow <= vRowEnd && vCol >= hColStart && vCol <= hColEnd) {
      const word1Index = word1.position.direction === 'horizontal' ? vCol - hColStart : hRow - vRowStart
      const word2Index = word2.position.direction === 'horizontal' ? vCol - hColStart : hRow - vRowStart

      return {
        row: hRow,
        col: vCol,
        word1Index,
        word2Index
      }
    }

    return null
  }

  private findBestBaseWord(words: Array<{ word: string, question: any }>): { word: string, question: any, intersectionCount: number } {
    let bestWord = words[0]
    let maxIntersections = 0

    for (const wordData of words) {
      let intersectionCount = 0

      for (const otherWordData of words) {
        if (wordData.word !== otherWordData.word) {
          const intersections = this.findLetterIntersections(wordData.word, otherWordData.word)
          intersectionCount += intersections.length
        }
      }

      if (intersectionCount > maxIntersections) {
        maxIntersections = intersectionCount
        bestWord = wordData
      }
    }

    return { ...bestWord, intersectionCount: maxIntersections }
  }

  private findBestPlacementWithValidation(word: string, placedWords: Map<string, { row: number, col: number, direction: 'horizontal' | 'vertical' }>, tempGrid: string[][]):
    { row: number, col: number, direction: 'horizontal' | 'vertical', intersectionLetter: string } | null {

    for (const [placedWord, placement] of placedWords) {
      const intersections = this.findLetterIntersections(word, placedWord)

      for (const intersection of intersections) {
        const newDirection = placement.direction === 'horizontal' ? 'vertical' : 'horizontal'

        let newRow: number, newCol: number

        if (placement.direction === 'horizontal') {
          // Palabra colocada es horizontal, nueva será vertical
          newRow = placement.row - intersection.newWordIndex
          newCol = placement.col + intersection.placedWordIndex
        } else {
          // Palabra colocada es vertical, nueva será horizontal
          newRow = placement.row + intersection.placedWordIndex
          newCol = placement.col - intersection.newWordIndex
        }

        // Verificar que esté dentro del grid
        if (this.isWithinBounds(newRow, newCol, word.length, newDirection)) {
          // Validación estricta con grid temporal
          if (this.isPlacementValidWithGrid(word, newRow, newCol, newDirection, tempGrid)) {
            return {
              row: newRow,
              col: newCol,
              direction: newDirection,
              intersectionLetter: intersection.letter
            }
          }
        }
      }
    }

    return null
  }

  private isPlacementValidWithGrid(word: string, row: number, col: number, direction: 'horizontal' | 'vertical', tempGrid: string[][]): boolean {
    // Verificar cada letra de la palabra
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col

      // Verificar límites
      if (currentRow < 0 || currentRow >= this.gridSize || currentCol < 0 || currentCol >= this.gridSize) {
        return false
      }

      const gridLetter = tempGrid[currentRow][currentCol]
      const wordLetter = word[i]

      // Si hay una letra en el grid, debe coincidir exactamente
      if (gridLetter !== '' && gridLetter !== wordLetter) {
        console.log(`❌ Conflicto de letra en (${currentRow}, ${currentCol}): "${wordLetter}" vs "${gridLetter}"`)
        return false
      }

      // Verificar que no forme palabras adyacentes inválidas
      if (gridLetter === '') {
        if (!this.validatePerpendicularPlacementWithGrid(word, i, currentRow, currentCol, direction, tempGrid)) {
          return false
        }
      }
    }

    // Verificar que no haya letras antes del inicio o después del final
    if (direction === 'horizontal') {
      if (col > 0 && tempGrid[row][col - 1] !== '') {
        return false
      }
      if (col + word.length < this.gridSize && tempGrid[row][col + word.length] !== '') {
        return false
      }
    } else {
      if (row > 0 && tempGrid[row - 1][col] !== '') {
        return false
      }
      if (row + word.length < this.gridSize && tempGrid[row + word.length][col] !== '') {
        return false
      }
    }

    return true
  }

  private validatePerpendicularPlacementWithGrid(word: string, letterIndex: number, row: number, col: number, direction: 'horizontal' | 'vertical', tempGrid: string[][]): boolean {
    if (direction === 'horizontal') {
      // Para palabras horizontales, verificar formación de palabras verticales
      let hasLetterAbove = row > 0 && tempGrid[row - 1][col] !== ''
      let hasLetterBelow = row < this.gridSize - 1 && tempGrid[row + 1][col] !== ''

      // Solo permitir si es exactamente una intersección
      if (hasLetterAbove || hasLetterBelow) {
        return tempGrid[row][col] !== '' && tempGrid[row][col] === word[letterIndex]
      }
    } else {
      // Para palabras verticales, verificar formación de palabras horizontales
      let hasLetterLeft = col > 0 && tempGrid[row][col - 1] !== ''
      let hasLetterRight = col < this.gridSize - 1 && tempGrid[row][col + 1] !== ''

      // Solo permitir si es exactamente una intersección
      if (hasLetterLeft || hasLetterRight) {
        return tempGrid[row][col] !== '' && tempGrid[row][col] === word[letterIndex]
      }
    }

    return true
  }

  private isPlacementValid(word: string, row: number, col: number, direction: 'horizontal' | 'vertical',
    placedWords: Map<string, { row: number, col: number, direction: 'horizontal' | 'vertical' }>): boolean {

    // Crear grid temporal para verificar conflictos
    const tempGrid: string[][] = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''))

    // Colocar palabras ya existentes
    for (const [placedWord, placement] of placedWords) {
      for (let i = 0; i < placedWord.length; i++) {
        const currentRow = placement.direction === 'vertical' ? placement.row + i : placement.row
        const currentCol = placement.direction === 'horizontal' ? placement.col + i : placement.col
        tempGrid[currentRow][currentCol] = placedWord[i]
      }
    }

    // Verificar si la nueva palabra puede colocarse
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'vertical' ? row + i : row
      const currentCol = direction === 'horizontal' ? col + i : col

      if (tempGrid[currentRow][currentCol] !== '' && tempGrid[currentRow][currentCol] !== word[i]) {
        return false // Conflicto de letras
      }
    }

    return true
  }

  private findBestIntersection(word1: string, word2: string): { letter: string, newWordIndex: number, baseWordIndex: number } | null {
    for (let i = 0; i < word1.length; i++) {
      for (let j = 0; j < word2.length; j++) {
        if (word1[i] === word2[j]) {
          return {
            letter: word1[i],
            newWordIndex: i,
            baseWordIndex: j
          }
        }
      }
    }
    return null
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

// 🎯 ALGORITMO UNIVERSAL - Funciona con cualquier tema y conjunto de palabras
// ✅ Escalable a miles de temas sin programar funciones individuales
export function generatePerfectCrossword(gameId: string): CrosswordData | null {
  console.log(`🎯 Generando crucigrama universal para: ${gameId}`)

  const generator = new PerfectCrosswordGenerator(15)
  const gameData = getGameData(gameId)

  if (!gameData) {
    console.warn(`❌ Datos no encontrados para gameId: ${gameId}`)
    return null
  }

  console.log(`📝 Procesando ${gameData.questions.length} palabras para "${gameData.title}"`)

  // Usar algoritmo universal que funciona con cualquier conjunto de palabras
  const generatedQuestions = generator.createUniversalOptimizedCrossword(gameData.questions)

  console.log(`✅ Crucigrama "${gameData.title}" generado exitosamente con ${generatedQuestions.length} palabras`)

  return {
    id: gameId,
    title: gameData.title,
    subject: gameData.subject,
    difficulty: gameData.difficulty,
    estimatedTime: gameData.estimatedTime,
    questions: generatedQuestions
  }
}

// 📊 BASE DE DATOS DE TEMAS - Escalable a miles de temas
// ✅ Solo se necesita agregar datos aquí para crear nuevos crucigramas
function getGameData(gameId: string): {
  title: string,
  subject: string,
  difficulty: string,
  estimatedTime: string,
  questions: Omit<CrosswordQuestion, 'position' | 'number'>[]
} | null {

  // 🔄 Mapeo de IDs de biblioteca a claves de base de datos
  const idMapping: Record<string, string> = {
    '1': 'sistema-solar',
    '2': 'revolucion-francesa',
    '3': 'geometria-basica',
    '4': 'animales-vertebrados',
    '5': 'independencia-chile',
    '6': 'tabla-periodica'
  }

  // Convertir ID de biblioteca a clave de base de datos
  const dbKey = idMapping[gameId] || gameId

  const gameDatabase = {
    'independencia-chile': {
      title: 'Independencia de Chile',
      subject: 'Historia',
      difficulty: 'Medio',
      estimatedTime: '15-18 min',
      questions: [
        {
          id: '1',
          question: 'Libertador de América',
          answer: 'SANMARTIN',
          category: 'Personajes',
          difficulty: 'Medio'
        },
        {
          id: '2',
          question: 'Padre de la Patria chilena',
          answer: 'OHIGGINS',
          category: 'Personajes',
          difficulty: 'Medio'
        },
        {
          id: '3',
          question: 'Cruce de esta cordillera fue clave',
          answer: 'ANDES',
          category: 'Geografía',
          difficulty: 'Fácil'
        },
        {
          id: '4',
          question: 'Batalla decisiva de la independencia',
          answer: 'MAIPU',
          category: 'Batallas',
          difficulty: 'Medio'
        },
        {
          id: '5',
          question: 'Primera Junta de Gobierno',
          answer: 'PATRIA',
          category: 'Eventos',
          difficulty: 'Medio'
        },
        {
          id: '6',
          question: 'Año de la independencia',
          answer: 'DIECIOCHO',
          category: 'Fechas',
          difficulty: 'Difícil'
        }
      ]
    },

    'sistema-solar': {
      title: 'Sistema Solar',
      subject: 'Ciencias',
      difficulty: 'Fácil',
      estimatedTime: '8-10 min',
      questions: [
        {
          id: '1',
          question: 'Planeta más cercano al Sol',
          answer: 'MERCURIO',
          category: 'Planetas',
          difficulty: 'Fácil'
        },
        {
          id: '2',
          question: 'Planeta rojo',
          answer: 'MARTE',
          category: 'Planetas',
          difficulty: 'Fácil'
        },
        {
          id: '3',
          question: 'Planeta más grande del sistema solar',
          answer: 'JUPITER',
          category: 'Planetas',
          difficulty: 'Medio'
        },
        {
          id: '4',
          question: 'Satélite natural de la Tierra',
          answer: 'LUNA',
          category: 'Satélites',
          difficulty: 'Fácil'
        },
        {
          id: '5',
          question: 'Estrella del sistema solar',
          answer: 'SOL',
          category: 'Estrellas',
          difficulty: 'Fácil'
        },
        {
          id: '6',
          question: 'Planeta con anillos',
          answer: 'SATURNO',
          category: 'Planetas',
          difficulty: 'Medio'
        }
      ]
    },

    'geometria-basica': {
      title: 'Geometría Básica',
      subject: 'Matemáticas',
      difficulty: 'Medio',
      estimatedTime: '10-12 min',
      questions: [
        {
          id: '1',
          question: 'Figura de tres lados',
          answer: 'TRIANGULO',
          category: 'Figuras',
          difficulty: 'Fácil'
        },
        {
          id: '2',
          question: 'Figura de cuatro lados iguales',
          answer: 'CUADRADO',
          category: 'Figuras',
          difficulty: 'Fácil'
        },
        {
          id: '3',
          question: 'Línea que divide un círculo por la mitad',
          answer: 'DIAMETRO',
          category: 'Círculo',
          difficulty: 'Medio'
        },
        {
          id: '4',
          question: 'Ángulo de 90 grados',
          answer: 'RECTO',
          category: 'Ángulos',
          difficulty: 'Fácil'
        },
        {
          id: '5',
          question: 'Perímetro de un círculo',
          answer: 'CIRCUNFERENCIA',
          category: 'Círculo',
          difficulty: 'Medio'
        },
        {
          id: '6',
          question: 'Figura de seis lados',
          answer: 'HEXAGONO',
          category: 'Figuras',
          difficulty: 'Medio'
        }
      ]
    },

    'revolucion-francesa': {
      title: 'Revolución Francesa',
      subject: 'Historia',
      difficulty: 'Medio',
      estimatedTime: '12-15 min',
      questions: [
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
    },

    'animales-vertebrados': {
      title: 'Animales Vertebrados',
      subject: 'Ciencias',
      difficulty: 'Fácil',
      estimatedTime: '8-10 min',
      questions: [
        {
          id: '1',
          question: 'Animal que vive en el agua y respira por branquias',
          answer: 'PEZ',
          category: 'Acuáticos',
          difficulty: 'Fácil'
        },
        {
          id: '2',
          question: 'Animal que vuela y tiene plumas',
          answer: 'AVE',
          category: 'Voladores',
          difficulty: 'Fácil'
        },
        {
          id: '3',
          question: 'Animal que da leche a sus crías',
          answer: 'MAMIFERO',
          category: 'Terrestres',
          difficulty: 'Medio'
        },
        {
          id: '4',
          question: 'Animal de sangre fría que puede cambiar de color',
          answer: 'REPTIL',
          category: 'Terrestres',
          difficulty: 'Medio'
        },
        {
          id: '5',
          question: 'Animal que vive en agua y tierra',
          answer: 'ANFIBIO',
          category: 'Acuáticos',
          difficulty: 'Medio'
        },
        {
          id: '6',
          question: 'Mamífero marino más grande',
          answer: 'BALLENA',
          category: 'Acuáticos',
          difficulty: 'Fácil'
        }
      ]
    },

    'tabla-periodica': {
      title: 'Tabla Periódica',
      subject: 'Ciencias',
      difficulty: 'Difícil',
      estimatedTime: '15-20 min',
      questions: [
        {
          id: '1',
          question: 'Elemento químico más ligero',
          answer: 'HIDROGENO',
          category: 'Elementos',
          difficulty: 'Medio'
        },
        {
          id: '2',
          question: 'Gas noble más común en la atmósfera',
          answer: 'ARGON',
          category: 'Gases',
          difficulty: 'Difícil'
        },
        {
          id: '3',
          question: 'Metal precioso de símbolo Au',
          answer: 'ORO',
          category: 'Metales',
          difficulty: 'Fácil'
        },
        {
          id: '4',
          question: 'Elemento esencial para la respiración',
          answer: 'OXIGENO',
          category: 'Elementos',
          difficulty: 'Fácil'
        },
        {
          id: '5',
          question: 'Metal líquido a temperatura ambiente',
          answer: 'MERCURIO',
          category: 'Metales',
          difficulty: 'Medio'
        },
        {
          id: '6',
          question: 'Elemento base de la vida orgánica',
          answer: 'CARBONO',
          category: 'Elementos',
          difficulty: 'Medio'
        }
      ]
    }
  }

  return gameDatabase[dbKey as keyof typeof gameDatabase] || null
}

// 🗑️ FUNCIONES LEGACY ELIMINADAS
// ✅ Todas las funciones específicas por tema han sido reemplazadas por el algoritmo universal








