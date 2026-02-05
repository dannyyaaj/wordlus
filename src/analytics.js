// Minimal analytics - anonymous usage insights only
// No personal data, no tracking individuals, no ads

function track(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params)
  }
}

export function trackGameStarted(dialect, wordLength) {
  track('game_started', {
    dialect,
    word_length: wordLength
  })
}

export function trackGameCompleted(won, guessCount, dialect, wordLength) {
  track('game_completed', {
    result: won ? 'win' : 'loss',
    guesses: guessCount,
    dialect,
    word_length: wordLength
  })
}

export function trackModeSelected(dialect, wordLength) {
  track('mode_selected', {
    dialect,
    word_length: wordLength
  })
}
