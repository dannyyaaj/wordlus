import {
  createInitialState,
  loadState,
  saveState,
  getPreferredWordLength,
  setPreferredWordLength,
  addLetter,
  removeLetter,
  submitGuess,
  getCurrentRow,
  isGuessComplete,
  isTodaysGame
} from './game/state.js'
import { evaluateGuess, isLetter } from './game/rules.js'
import { loadWords, isValidWord, getDailyAnswer, getWordInfo } from './game/words.js'
import { createGrid, renderState, updateCurrentRow, revealRow, shakeRow } from './ui/grid.js'
import { createKeyboard, setupPhysicalKeyboard, updateKeyboardColors } from './ui/keyboard.js'
import { showEndModal } from './ui/modal.js'
import { showToast } from './ui/toast.js'
import { showHowToPlay } from './ui/howToPlay.js'
import { trackGameStarted, trackGameCompleted, trackModeSelected, trackOnboardingShown, trackHelpOpened } from './analytics.js'

let state = null

const gridEl = document.getElementById('grid')
const keyboardEl = document.getElementById('keyboard')
const themeToggleEl = document.getElementById('theme-toggle')
const helpBtnEl = document.getElementById('help-btn')

function getPreferredTheme() {
  const saved = localStorage.getItem('wordlus-theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  themeToggleEl.textContent = theme === 'light' ? '🌙' : '☀️'
  localStorage.setItem('wordlus-theme', theme)
}

function setupThemeToggle() {
  const currentTheme = getPreferredTheme()
  setTheme(currentTheme)

  themeToggleEl.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme')
    setTheme(current === 'light' ? 'dark' : 'light')
  })
}

function hasBeenOnboarded() {
  return localStorage.getItem('wordlus-onboarded') === 'true'
}

function markOnboarded() {
  localStorage.setItem('wordlus-onboarded', 'true')
}

function setupHelpButton() {
  helpBtnEl.addEventListener('click', () => {
    showHowToPlay()
    markOnboarded()
    helpBtnEl.classList.remove('pulse')
    trackHelpOpened()
  })
}

function updateNavTabs(wordLength) {
  document.querySelectorAll('.toggle-btn[data-length]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.length) === wordLength)
  })
}

function setupNavTabs() {
  document.querySelectorAll('.toggle-btn[data-length]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newLength = parseInt(btn.dataset.length)
      if (state && newLength !== state.wordLength) {
        switchGame(newLength)
      }
    })
  })
}

async function switchGame(wordLength) {
  setPreferredWordLength(wordLength)
  trackModeSelected(wordLength)

  const savedState = loadState(wordLength)

  if (savedState && isTodaysGame(savedState)) {
    await restoreGame(savedState, { showModal: false })
  } else {
    await startGame({ wordLength })
  }
}

async function startGame({ wordLength }) {
  setPreferredWordLength(wordLength)
  await loadWords({ wordLength })

  const answer = getDailyAnswer(wordLength)
  state = createInitialState(wordLength, answer)

  createGrid(gridEl, wordLength)
  createKeyboard(keyboardEl, handleKey)
  updateNavTabs(wordLength)
  trackGameStarted(wordLength)
  saveState(state)
}

async function restoreGame(savedState, { showModal = true } = {}) {
  const wordLength = savedState.wordLength
  await loadWords({ wordLength })

  const answer = getDailyAnswer(wordLength)

  state = {
    ...savedState,
    answer,
    currentGuess: ''
  }

  createGrid(gridEl, wordLength)
  createKeyboard(keyboardEl, handleKey)
  renderState(gridEl, state)
  updateKeyboardColors(keyboardEl, state.usedLetters)
  updateNavTabs(wordLength)

  if (showModal && state.status !== 'playing') {
    setTimeout(() => showEndModal(state, getWordInfo(state.answer), null), 500)
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
      trackGameCompleted(true, state.guesses.length, state.wordLength)
      setTimeout(() => showEndModal(state, getWordInfo(state.answer), null), 1000)
    } else if (state.status === 'lost') {
      trackGameCompleted(false, state.guesses.length, state.wordLength)
      setTimeout(() => showEndModal(state, getWordInfo(state.answer), null), 1000)
    }
  }, revealDelay)
}

async function init() {
  setupThemeToggle()
  setupHelpButton()
  setupPhysicalKeyboard(handleKey)
  setupNavTabs()

  const preferredLength = getPreferredWordLength() || 4
  const savedState = loadState(preferredLength)

  if (savedState && isTodaysGame(savedState)) {
    await restoreGame(savedState)
  } else {
    await startGame({ wordLength: preferredLength })
  }

  if (!hasBeenOnboarded()) {
    helpBtnEl.classList.add('pulse')
    showHowToPlay()
    markOnboarded()
    trackOnboardingShown()
  }
}

init()
