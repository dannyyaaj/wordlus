let answers = []
let wordInfoMap = new Map()
let validWords = new Set()

function normalizeWordEntry(entry) {
  return {
    word: entry.word.toLowerCase(),
    definition: entry.definition || null,
    partOfSpeech: entry.partOfSpeech || null,
    isAnswer: entry.isAnswer ?? true
  }
}

export async function loadWords({ wordLength }) {
  const res = await fetch(`./src/data/${wordLength}-letter/words.json?v=0.4.0`)
  if (!res.ok) {
    console.error(`Failed to load word list for ${wordLength}-letter`)
    return { answers: [], validWords: new Set() }
  }

  const data = await res.json()
  const answerSets = []
  const allWords = []

  data.words.forEach(entry => {
    const info = normalizeWordEntry(entry)
    allWords.push(info.word)
    if (info.isAnswer) {
      answerSets.push(info.word)
    }
    if (info.definition) {
      wordInfoMap.set(info.word, info)
    }
  })

  answers = [...new Set(answerSets)]
  validWords = new Set(allWords)

  return { answers, validWords }
}

export function isValidWord(word) {
  return validWords.has(word.toLowerCase())
}

function hashSeed(n) {
  n = n | 0
  n = Math.imul(n ^ (n >>> 16), 0x85ebca6b)
  n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35)
  n = n ^ (n >>> 16)
  return Math.abs(n)
}

function dateToSeed(gameDate, modeOffset) {
  const [y, m, d] = gameDate.split('-').map(Number)
  return y * 10000 + m * 100 + d + modeOffset
}

function getPrevDate(gameDate) {
  const [y, m, d] = gameDate.split('-').map(Number)
  const prev = new Date(y, m - 1, d - 1)
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}`
}

export function getDailyAnswer(wordLength, gameDate) {
  const modeOffset = wordLength === 5 ? 1000 : 0
  const index = hashSeed(dateToSeed(gameDate, modeOffset)) % answers.length

  const prevDate = getPrevDate(gameDate)
  const prevIndex = hashSeed(dateToSeed(prevDate, modeOffset)) % answers.length

  if (index === prevIndex) {
    return answers[(index + 1) % answers.length]
  }

  return answers[index]
}

export function getWordInfo(word) {
  const normalized = word.toLowerCase()
  return wordInfoMap.get(normalized) || { word: normalized, definition: null, partOfSpeech: null }
}
