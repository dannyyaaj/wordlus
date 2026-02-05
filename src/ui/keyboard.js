const LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
]

export function createKeyboard(container, onKey) {
  container.innerHTML = ''

  LAYOUT.forEach(row => {
    const rowEl = document.createElement('div')
    rowEl.className = 'keyboard-row'

    row.forEach(key => {
      const btn = document.createElement('button')
      btn.className = 'key'
      btn.dataset.key = key

      if (key === 'enter') {
        btn.textContent = 'Enter'
        btn.classList.add('key-wide')
      } else if (key === 'backspace') {
        btn.textContent = 'Del'
        btn.classList.add('key-wide')
      } else {
        btn.textContent = key
      }

      btn.addEventListener('click', () => onKey(key))
      rowEl.appendChild(btn)
    })

    container.appendChild(rowEl)
  })
}

export function setupPhysicalKeyboard(onKey) {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return

    if (e.key === 'Enter') {
      onKey('enter')
    } else if (e.key === 'Backspace') {
      onKey('backspace')
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      onKey(e.key.toLowerCase())
    }
  })
}

export function updateKeyboardColors(container, usedLetters) {
  const keys = container.querySelectorAll('.key')

  keys.forEach(key => {
    const letter = key.dataset.key
    if (letter.length === 1 && usedLetters[letter]) {
      key.dataset.state = usedLetters[letter]
    }
  })
}

export function resetKeyboard(container) {
  const keys = container.querySelectorAll('.key')
  keys.forEach(key => {
    delete key.dataset.state
  })
}
