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

export function getRandomAnswer() {
  const index = Math.floor(Math.random() * answers.length)
  return answers[index]
}

export function getDailyAnswer(wordLength) {
  const today = new Date()
  const dateSeed = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate()
  const modeOffset = wordLength === 5 ? 1000 : 0
  const seed = dateSeed + modeOffset
  const index = seed % answers.length
  return answers[index]
}

export function getWordInfo(word) {
  const normalized = word.toLowerCase()
  return wordInfoMap.get(normalized) || { word: normalized, definition: null, partOfSpeech: null }
}
