import { showToast } from './toast.js'

const EMOJI_MAP = {
  correct: '🟩',
  present: '🟨',
  absent: '⬜'
}

export function buildEmojiGrid(evaluations) {
  return evaluations
    .map(row => row.map(cell => EMOJI_MAP[cell] || '⬜').join(''))
    .join('\n')
}

export function buildShareText(state) {
  const isWin = state.status === 'won'
  const score = isWin ? `${state.guesses.length}/6` : 'X/6'
  const grid = buildEmojiGrid(state.evaluations)

  return [
    `Wordlus • ${score}`,
    '',
    grid,
    '',
    'Play • Learn • Preserve Hmong',
    'wordlus.vercel.app'
  ].join('\n')
}

export async function handleShare(state) {
  const text = buildShareText(state)
  try {
    await navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!')
    return true
  } catch {
    showToast('Could not copy to clipboard')
    return false
  }
}