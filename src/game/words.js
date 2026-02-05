let answers = []
let validWords = new Set()

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
      const answersData = await answersRes.json()
      const guessesData = await guessesRes.json()
      answerSets.push(...answersData.words.map(w => w.toLowerCase()))
      guessSets.push(...guessesData.words.map(w => w.toLowerCase()))
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

export function getDailyAnswer() {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const index = seed % answers.length
  return answers[index]
}
