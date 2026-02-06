import { getTimeUntilNextWord } from '../game/state.js'

export function showEndModal(state, wordInfo, onNewGame) {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'

  const isWin = state.status === 'won'
  const guessLabel = state.guesses.length === 1 ? 'guess' : 'guesses'

  const { localTime } = getTimeUntilNextWord()
  const canPlayAgain = typeof onNewGame === 'function'

  const definitionHtml = wordInfo.definition
    ? `<div class="result-definition">${(wordInfo.partOfSpeech) ? `<span class="part-of-speech">${wordInfo.partOfSpeech}</span> · ` : ''}${wordInfo.definition}</div>`
    : ''

  const nextWordHtml = !canPlayAgain
    ? `<div class="modal-next-word">
        <p class="next-word-local">Next word at ${localTime} (local)</p>
        <p class="next-word-utc">Resets globally at 12:00 AM UTC</p>
      </div>`
    : ''

  const modal = document.createElement('div')
  modal.className = 'modal'
  modal.innerHTML = `
    ${isWin ? `<p class="result-subtitle">Solved in ${state.guesses.length} ${guessLabel}</p>` : '<p class="todays-word-label">Today\'s word</p>'}
    <div class="result-word ${isWin ? 'result-word--win' : ''}">${state.answer.toUpperCase()}</div>
    ${definitionHtml}
    ${nextWordHtml}
    <div class="modal-buttons">
      <button class="modal-btn primary" data-action="close">${canPlayAgain ? 'Play Again' : 'Done'}</button>
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
