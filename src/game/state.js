const STORAGE_KEY_PREFIX = 'wordlus-state'
const MAX_GUESSES = 6

function getStorageKey(wordLength, dialect) {
  return `${STORAGE_KEY_PREFIX}-${wordLength}-${dialect}`
}

function getTodayString() {
  const today = new Date()
  return `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`
}

export function createInitialState(wordLength, answer, dialect = 'white') {
  return {
    wordLength,
    dialect,
    answer,
    guesses: [],
    evaluations: [],
    currentGuess: '',
    status: 'playing',
    usedLetters: {},
    gameDate: getTodayString()
  }
}

export function loadState(wordLength, dialect) {
  try {
    const key = getStorageKey(wordLength, dialect)
    const saved = localStorage.getItem(key)
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
    const key = getStorageKey(state.wordLength, state.dialect)
    const toSave = {
      wordLength: state.wordLength,
      dialect: state.dialect,
      guesses: state.guesses,
      evaluations: state.evaluations,
      status: state.status,
      usedLetters: state.usedLetters,
      gameDate: state.gameDate
    }
    localStorage.setItem(key, JSON.stringify(toSave))
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

export function clearState(wordLength, dialect) {
  const key = getStorageKey(wordLength, dialect)
  localStorage.removeItem(key)
}

export function isTodaysGame(savedState) {
  if (!savedState || !savedState.gameDate) return false
  return savedState.gameDate === getTodayString()
}

export function getTimeUntilNextWord() {
  const now = new Date()
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ))
  const diff = tomorrow - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { hours, minutes }
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
    return localStorage.getItem('wordlus-dialect') || 'white'
  } catch {
    return 'white'
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
