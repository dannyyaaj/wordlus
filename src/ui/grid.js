import { MAX_GUESSES } from '../game/state.js'

export function createGrid(container, wordLength) {
  container.innerHTML = ''
  container.style.setProperty('--word-length', wordLength)

  for (let row = 0; row < MAX_GUESSES; row++) {
    const rowEl = document.createElement('div')
    rowEl.className = 'grid-row'
    rowEl.dataset.row = row

    for (let col = 0; col < wordLength; col++) {
      const cell = document.createElement('div')
      cell.className = 'grid-cell'
      cell.dataset.col = col
      rowEl.appendChild(cell)
    }

    container.appendChild(rowEl)
  }
}

export function renderState(container, state) {
  const rows = container.querySelectorAll('.grid-row')

  state.guesses.forEach((guess, rowIndex) => {
    const row = rows[rowIndex]
    const cells = row.querySelectorAll('.grid-cell')
    const evaluation = state.evaluations[rowIndex]

    guess.split('').forEach((letter, i) => {
      cells[i].textContent = letter
      cells[i].dataset.state = evaluation[i]
    })
  })

  const currentRow = state.guesses.length
  if (currentRow < MAX_GUESSES && state.status === 'playing') {
    const row = rows[currentRow]
    const cells = row.querySelectorAll('.grid-cell')

    cells.forEach((cell, i) => {
      cell.textContent = state.currentGuess[i] || ''
      cell.dataset.state = ''
    })
  }
}

export function updateCurrentRow(container, currentGuess, rowIndex, wordLength) {
  const row = container.querySelector(`.grid-row[data-row="${rowIndex}"]`)
  if (!row) return

  const cells = row.querySelectorAll('.grid-cell')
  for (let i = 0; i < wordLength; i++) {
    cells[i].textContent = currentGuess[i] || ''
  }
}

export function revealRow(container, rowIndex, guess, evaluation) {
  const row = container.querySelector(`.grid-row[data-row="${rowIndex}"]`)
  if (!row) return

  const cells = row.querySelectorAll('.grid-cell')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  guess.split('').forEach((letter, i) => {
    const cell = cells[i]
    const delay = prefersReducedMotion ? 0 : i * 100

    setTimeout(() => {
      cell.textContent = letter
      cell.dataset.state = evaluation[i]
    }, delay)
  })
}

export function shakeRow(container, rowIndex) {
  const row = container.querySelector(`.grid-row[data-row="${rowIndex}"]`)
  if (!row) return

  row.classList.add('shake')
  setTimeout(() => row.classList.remove('shake'), 500)
}
