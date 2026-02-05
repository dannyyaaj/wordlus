const STORAGE_KEY = 'wordlus-state'
const MAX_GUESSES = 6

export function createInitialState(wordLength, answer, dialect = 'any') {
  return {
    wordLength,
    dialect,
    answer,
    guesses: [],
    evaluations: [],
    currentGuess: '',
    status: 'playing',
    usedLetters: {}
  }
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load state:', e)
  }
  return null
}

export function saveState(state) {
  try {
    const toSave = {
      wordLength: state.wordLength,
      dialect: state.dialect,
      answer: state.answer,
      guesses: state.guesses,
      evaluations: state.evaluations,
      status: state.status,
      usedLetters: state.usedLetters
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getPreferredWordLength() {
  try {
    return parseInt(localStorage.getItem('wordlus-wordLength')) || null
  } catch {
    return null
  }
}

export function setPreferredWordLength(length) {
  localStorage.setItem('wordlus-wordLength', length.toString())
}

export function getPreferredDialect() {
  try {
    return localStorage.getItem('wordlus-dialect') || 'any'
  } catch {
    return 'any'
  }
}

export function setPreferredDialect(dialect) {
  localStorage.setItem('wordlus-dialect', dialect)
}

export function addLetter(state, letter) {
  if (state.status !== 'playing') return state
  if (state.currentGuess.length >= state.wordLength) return state
  return { ...state, currentGuess: state.currentGuess + letter.toLowerCase() }
}

export function removeLetter(state) {
  if (state.status !== 'playing') return state
  return { ...state, currentGuess: state.currentGuess.slice(0, -1) }
}

export function submitGuess(state, evaluation) {
  const newGuesses = [...state.guesses, state.currentGuess]
  const newEvaluations = [...state.evaluations, evaluation]
  const newUsedLetters = { ...state.usedLetters }

  state.currentGuess.split('').forEach((letter, i) => {
    const result = evaluation[i]
    const current = newUsedLetters[letter]
    if (result === 'correct' || (result === 'present' && current !== 'correct')) {
      newUsedLetters[letter] = result
    } else if (!current) {
      newUsedLetters[letter] = result
    }
  })

  const isWin = evaluation.every(r => r === 'correct')
  const isLoss = !isWin && newGuesses.length >= MAX_GUESSES

  return {
    ...state,
    guesses: newGuesses,
    evaluations: newEvaluations,
    currentGuess: '',
    usedLetters: newUsedLetters,
    status: isWin ? 'won' : isLoss ? 'lost' : 'playing'
  }
}

export function getCurrentRow(state) {
  return state.guesses.length
}

export function isGuessComplete(state) {
  return state.currentGuess.length === state.wordLength
}

export { MAX_GUESSES }
