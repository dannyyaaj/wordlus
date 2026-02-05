export function showEndModal(state, onNewGame) {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'

  const isWin = state.status === 'won'
  const message = isWin
    ? `You got it in ${state.guesses.length}!`
    : `The word was: ${state.answer.toUpperCase()}`

  const modal = document.createElement('div')
  modal.className = 'modal'
  modal.innerHTML = `
    <h2>${isWin ? 'Zoo heev!' : 'Game Over'}</h2>
    <p>${message}</p>
    <div class="modal-buttons">
      <button class="modal-btn primary" data-action="new">New Game</button>
    </div>
  `

  modal.querySelector('[data-action="new"]').addEventListener('click', () => {
    overlay.remove()
    onNewGame()
  })

  overlay.appendChild(modal)
  document.body.appendChild(overlay)
}
