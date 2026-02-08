const STORAGE_KEY_PREFIX = 'wordlus-state-v4'
const MAX_GUESSES = 6
const GAME_TIMEZONE = 'America/New_York'

function getStorageKey(wordLength) {
  return `${STORAGE_KEY_PREFIX}-${wordLength}`
}

export function getGameDate() {
  return new Date().toLocaleDateString('en-CA', { timeZone: GAME_TIMEZONE })
}

export function createInitialState(wordLength, answer) {
  return {
    wordLength,
    answer,
    guesses: [],
    evaluations: [],
    currentGuess: '',
    status: 'playing',
    usedLetters: {},
    gameDate: getGameDate()
  }
}

export function loadState(wordLength) {
  try {
    const key = getStorageKey(wordLength)
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
    const key = getStorageKey(state.wordLength)
    const toSave = {
      wordLength: state.wordLength,
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

export function clearState(wordLength) {
  const key = getStorageKey(wordLength)
  localStorage.removeItem(key)
}

export function isTodaysGame(savedState) {
  if (!savedState || !savedState.gameDate) return false
  return savedState.gameDate === getGameDate()
}

export function getTimeUntilNextWord() {
  const now = new Date()
  const todayET = now.toLocaleDateString('en-CA', { timeZone: GAME_TIMEZONE })
  const [y, m, d] = todayET.split('-').map(Number)
  const tom = new Date(y, m - 1, d + 1)
  const tomorrowStr = `${tom.getFullYear()}-${String(tom.getMonth() + 1).padStart(2, '0')}-${String(tom.getDate()).padStart(2, '0')}`

  let nextReset = new Date(`${tomorrowStr}T00:00:00-05:00`)
  const checkHour = +new Intl.DateTimeFormat('en-US', {
    timeZone: GAME_TIMEZONE, hour: 'numeric', hour12: false
  }).format(nextReset)

  if (checkHour !== 0 && checkHour !== 24) {
    nextReset = new Date(`${tomorrowStr}T00:00:00-04:00`)
  }

  const diff = nextReset - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const localTime = nextReset.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  return { hours, minutes, localTime }
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
