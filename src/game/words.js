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
  const res = await fetch(`./src/data/${wordLength}-letter/words.json`)
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
  n = ((n >> 16) ^ n) * 0x45d9f3b
  n = ((n >> 16) ^ n) * 0x45d9f3b
  n = (n >> 16) ^ n
  return Math.abs(n)
}

export function getDailyAnswer(wordLength, gameDate) {
  const [y, m, d] = gameDate.split('-').map(Number)
  const dateSeed = y * 10000 + m * 100 + d
  const modeOffset = wordLength === 5 ? 1000 : 0
  const index = hashSeed(dateSeed + modeOffset) % answers.length
  return answers[index]
}

export function getWordInfo(word) {
  const normalized = word.toLowerCase()
  return wordInfoMap.get(normalized) || { word: normalized, definition: null, partOfSpeech: null }
}
