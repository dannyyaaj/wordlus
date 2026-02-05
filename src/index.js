import {
  createInitialState,
  loadState,
  saveState,
  clearState,
  getPreferredWordLength,
  setPreferredWordLength,
  getPreferredDialect,
  setPreferredDialect,
  addLetter,
  removeLetter,
  submitGuess,
  getCurrentRow,
  isGuessComplete
} from './game/state.js'
import { evaluateGuess, isLetter } from './game/rules.js'
import { loadWords, isValidWord, getRandomAnswer } from './game/words.js'
import { createGrid, renderState, updateCurrentRow, revealRow, shakeRow } from './ui/grid.js'
import { createKeyboard, setupPhysicalKeyboard, updateKeyboardColors } from './ui/keyboard.js'
import { showEndModal } from './ui/modal.js'
import { showToast } from './ui/toast.js'

let state = null

const gridEl = document.getElementById('grid')
const keyboardEl = document.getElementById('keyboard')

function updateNavTabs(dialect, wordLength) {
  document.querySelectorAll('.toggle-btn[data-length]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.length) === wordLength)
  })
  document.querySelectorAll('.toggle-btn[data-dialect]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.dialect === dialect)
  })
}

function setupNavTabs() {
  document.querySelectorAll('.toggle-btn[data-length]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newLength = parseInt(btn.dataset.length)
      const currentDialect = state?.dialect || getPreferredDialect()
      if (state && newLength !== state.wordLength) {
        switchGame({ dialect: currentDialect, wordLength: newLength })
      }
    })
  })

  document.querySelectorAll('.toggle-btn[data-dialect]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newDialect = btn.dataset.dialect
      const currentLength = state?.wordLength || getPreferredWordLength() || 4
      if (state && newDialect !== state.dialect) {
        switchGame({ dialect: newDialect, wordLength: currentLength })
      }
    })
  })
}

async function switchGame({ dialect, wordLength }) {
  clearState()
  await startGame({ dialect, wordLength })
}

async function startGame({ dialect, wordLength }) {
  setPreferredDialect(dialect)
  setPreferredWordLength(wordLength)
  await loadWords({ dialect, wordLength })

  const answer = getRandomAnswer()
  state = createInitialState(wordLength, answer, dialect)

  createGrid(gridEl, wordLength)
  createKeyboard(keyboardEl, handleKey)
  updateNavTabs(dialect, wordLength)

  saveState(state)
}

async function restoreGame(savedState) {
  const dialect = savedState.dialect || 'any'
  await loadWords({ dialect, wordLength: savedState.wordLength })

  state = {
    ...savedState,
    dialect,
    currentGuess: ''
  }

  createGrid(gridEl, state.wordLength)
  createKeyboard(keyboardEl, handleKey)
  renderState(gridEl, state)
  updateKeyboardColors(keyboardEl, state.usedLetters)
  updateNavTabs(dialect, state.wordLength)

  if (state.status !== 'playing') {
    setTimeout(() => showEndModal(state, handleNewGame), 500)
  }
}

function handleKey(key) {
  if (!state || state.status !== 'playing') return

  if (key === 'enter') {
    handleSubmit()
  } else if (key === 'backspace') {
    state = removeLetter(state)
    updateCurrentRow(gridEl, state.currentGuess, getCurrentRow(state), state.wordLength)
  } else if (isLetter(key)) {
    state = addLetter(state, key)
    updateCurrentRow(gridEl, state.currentGuess, getCurrentRow(state), state.wordLength)
  }
}

function handleSubmit() {
  if (!isGuessComplete(state)) {
    showToast('Not enough letters')
    shakeRow(gridEl, getCurrentRow(state))
    return
  }

  if (!isValidWord(state.currentGuess)) {
    showToast('Not in word list')
    shakeRow(gridEl, getCurrentRow(state))
    return
  }

  const evaluation = evaluateGuess(state.currentGuess, state.answer)
  const rowIndex = getCurrentRow(state)

  state = submitGuess(state, evaluation)
  saveState(state)

  revealRow(gridEl, rowIndex, state.guesses[rowIndex], evaluation)

  const revealDelay = state.wordLength * 100 + 100

  setTimeout(() => {
    updateKeyboardColors(keyboardEl, state.usedLetters)

    if (state.status === 'won') {
      showToast('Zoo heev!', 2000)
      setTimeout(() => showEndModal(state, handleNewGame), 1000)
    } else if (state.status === 'lost') {
      showToast(state.answer.toUpperCase(), 3000)
      setTimeout(() => showEndModal(state, handleNewGame), 1500)
    }
  }, revealDelay)
}

function handleNewGame() {
  const dialect = state?.dialect || getPreferredDialect()
  const wordLength = state?.wordLength || getPreferredWordLength() || 4
  clearState()
  startGame({ dialect, wordLength })
}

async function init() {
  setupPhysicalKeyboard(handleKey)
  setupNavTabs()

  const savedState = loadState()

  if (savedState && savedState.answer) {
    await restoreGame(savedState)
  } else {
    const preferredLength = getPreferredWordLength() || 4
    const preferredDialect = getPreferredDialect()
    await startGame({ dialect: preferredDialect, wordLength: preferredLength })
  }
}

init()
