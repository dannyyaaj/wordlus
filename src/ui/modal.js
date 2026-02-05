import { getTimeUntilNextWord } from '../game/state.js'

export function showEndModal(state, wordInfo, onNewGame) {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'

  const isWin = state.status === 'won'
  const subtitle = isWin
    ? `You got it in ${state.guesses.length}!`
    : 'The word was:'

  const { hours, minutes } = getTimeUntilNextWord()
  const canPlayAgain = typeof onNewGame === 'function'

  const definitionHtml = wordInfo.definition
    ? `<div class="result-definition">${wordInfo.partOfSpeech ? `${wordInfo.partOfSpeech} — ` : ''}${wordInfo.definition}</div>`
    : ''

  const modal = document.createElement('div')
  modal.className = 'modal'
  modal.innerHTML = `
    <h2>${isWin ? 'Zoo heev!' : 'Game Over'}</h2>
    <p>${subtitle}</p>
    <div class="result-word">${state.answer.toUpperCase()}</div>
    ${definitionHtml}
    ${!canPlayAgain ? `<p class="modal-countdown">Next word in ${hours}h ${minutes}m</p>` : ''}
    <div class="modal-buttons">
      <button class="modal-btn primary" data-action="close">${canPlayAgain ? 'Play Again' : 'Close'}</button>
    </div>
  `

  modal.querySelector('[data-action="close"]').addEventListener('click', () => {
    overlay.remove()
    if (canPlayAgain) {
      onNewGame()
    }
  })

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove()
    }
  })

  overlay.appendChild(modal)
  document.body.appendChild(overlay)
}
