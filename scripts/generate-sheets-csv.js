const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '..', 'src', 'data')
const OUTPUT_DIR = path.join(__dirname, '..', 'csv-export')

const WORD_LENGTHS = [4, 5]

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message)
    return { words: [] }
  }
}

function escapeCSV(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function generateCSV(wordLength) {
  const wordsPath = path.join(DATA_DIR, `${wordLength}-letter`, 'words.json')

  console.log(`Processing ${wordLength}-letter words...`)

  const wordsData = readJsonFile(wordsPath)

  const sortedWords = wordsData.words.sort((a, b) =>
    a.word.localeCompare(b.word)
  )

  const header = 'word,partOfSpeech,definition,isAnswer,enabled,notes'
  const rows = sortedWords.map(entry => [
    escapeCSV(entry.word),
    escapeCSV(entry.partOfSpeech || ''),
    escapeCSV(entry.definition || ''),
    entry.isAnswer ? 'TRUE' : 'FALSE',
    entry.isAnswer ? 'TRUE' : 'FALSE',
    ''
  ].join(','))

  const csvContent = [header, ...rows].join('\n')

  const outputFileName = `${wordLength}_letter_words.csv`
  const outputPath = path.join(OUTPUT_DIR, outputFileName)
  fs.writeFileSync(outputPath, csvContent, 'utf8')

  const answerCount = sortedWords.filter(w => w.isAnswer).length
  const guessOnlyCount = sortedWords.filter(w => !w.isAnswer).length
  console.log(`  -> ${outputFileName} (${sortedWords.length} total: ${answerCount} answers, ${guessOnlyCount} guess-only)`)

  return {
    fileName: outputFileName,
    totalWords: sortedWords.length,
    answerCount,
    guessOnlyCount
  }
}

function main() {
  console.log('Generating CSV files for Google Sheets migration...\n')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const results = []

  for (const wordLength of WORD_LENGTHS) {
    const result = generateCSV(wordLength)
    results.push(result)
  }

  console.log('\n--- Summary ---')
  for (const result of results) {
    console.log(`${result.fileName}: ${result.totalWords} total (${result.answerCount} answers, ${result.guessOnlyCount} guess-only)`)
  }
  console.log(`\nCSV files saved to: ${OUTPUT_DIR}`)
}

main()
