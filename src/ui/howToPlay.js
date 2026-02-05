export function showHowToPlay() {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'

  const modal = document.createElement('div')
  modal.className = 'modal'
  modal.innerHTML = `
    <h2>How to Play</h2>
    <p>Guess the Hmong word in 6 tries.</p>
    <div class="legend">
      <div class="legend-item">
        <div class="legend-swatch correct">H</div>
        <div class="legend-text">
          <strong>Correct</strong>
          Letter is in the word and in the right spot
        </div>
      </div>
      <div class="legend-item">
        <div class="legend-swatch present">M</div>
        <div class="legend-text">
          <strong>Present</strong>
          Letter is in the word but in the wrong spot
        </div>
      </div>
      <div class="legend-item">
        <div class="legend-swatch absent">O</div>
        <div class="legend-text">
          <strong>Absent</strong>
          Letter is not in the word
        </div>
      </div>
    </div>
    <div class="modal-buttons">
      <button class="modal-btn primary" data-action="close">Got it</button>
    </div>
  `

  modal.querySelector('[data-action="close"]').addEventListener('click', () => {
    overlay.remove()
  })

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove()
    }
  })

  overlay.appendChild(modal)
  document.body.appendChild(overlay)
}
