function track(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params)
  }
}

export function trackGameStarted(wordLength) {
  track('game_started', {
    word_length: wordLength
  })
}

export function trackGameCompleted(won, guessCount, wordLength) {
  track('game_completed', {
    result: won ? 'win' : 'loss',
    guesses: guessCount,
    word_length: wordLength
  })
}

export function trackModeSelected(wordLength) {
  track(`mode_selected_${wordLength}_letter`)
}

export function trackOnboardingShown() {
  track('onboarding_shown')
}

export function trackHelpOpened() {
  track('help_opened')
}
