let answers = []
let wordInfoMap = new Map()
let validWords = new Set()

function normalizeWordEntry(entry) {
  if (typeof entry === 'string') {
    return { word: entry.toLowerCase(), definition: null, partOfSpeech: null }
  }
  return {
    word: entry.word.toLowerCase(),
    definition: entry.definition || null,
    partOfSpeech: entry.partOfSpeech || null
  }
}

export async function loadWords({ dialect = 'any', wordLength }) {
  const dialects = dialect === 'any' ? ['white', 'green'] : [dialect]

  const answerSets = []
  const guessSets = []

  await Promise.all(
    dialects.map(async (d) => {
      const [answersRes, guessesRes] = await Promise.all([
        fetch(`./src/data/${d}/${wordLength}-letter/answers.json`),
        fetch(`./src/data/${d}/${wordLength}-letter/guesses.json`)
      ])
      if (!answersRes.ok || !guessesRes.ok) {
        console.error(`Failed to load word lists for ${d}/${wordLength}-letter`)
        return
      }
      const answersData = await answersRes.json()
      const guessesData = await guessesRes.json()

      answersData.words.forEach(entry => {
        const info = normalizeWordEntry(entry)
        answerSets.push(info.word)
        if (info.definition) {
          wordInfoMap.set(info.word, info)
        }
      })

      guessesData.words.forEach(entry => {
        const info = normalizeWordEntry(entry)
        guessSets.push(info.word)
      })
    })
  )

  answers = [...new Set(answerSets)]
  validWords = new Set([...answers, ...guessSets])

  return { answers, validWords }
}

export function isValidWord(word) {
  return validWords.has(word.toLowerCase())
}

export function getRandomAnswer() {
  const index = Math.floor(Math.random() * answers.length)
  return answers[index]
}

export function getDailyAnswer(wordLength, dialect) {
  const today = new Date()
  const dateSeed = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate()
  const modeOffset = (wordLength === 5 ? 1000 : 0) + (dialect === 'green' ? 500 : dialect === 'any' ? 250 : 0)
  const seed = dateSeed + modeOffset
  const index = seed % answers.length
  return answers[index]
}

export function getWordInfo(word) {
  const normalized = word.toLowerCase()
  return wordInfoMap.get(normalized) || { word: normalized, definition: null, partOfSpeech: null }
}
