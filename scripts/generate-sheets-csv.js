/**
 * Generate CSV files for Google Sheets migration
 *
 * Converts JSON word lists into CSV format suitable for Google Sheets import.
 * Run from project root: node scripts/generate-sheets-csv.js
 */

const fs = require('fs')
const path = require('path')

// ============================================
// Configuration - adjust paths if needed
// ============================================
const DATA_DIR = path.join(__dirname, '..', 'src', 'data')
const OUTPUT_DIR = path.join(__dirname, '..', 'csv-export')

const DIALECTS = ['white', 'green']
const WORD_LENGTHS = [4, 5]

// ============================================
// Helper functions
// ============================================

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
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function generateCSV(dialect, wordLength) {
  const wordsPath = path.join(DATA_DIR, dialect, `${wordLength}-letter`, 'words.json')

  console.log(`Processing ${dialect} ${wordLength}-letter words...`)

  const wordsData = readJsonFile(wordsPath)

  // Sort alphabetically
  const sortedWords = wordsData.words.sort((a, b) =>
    a.word.localeCompare(b.word)
  )

  // Generate CSV content
  const header = 'word,partOfSpeech,definition,isAnswer,enabled,notes'
  const rows = sortedWords.map(entry => [
    escapeCSV(entry.word),
    escapeCSV(entry.partOfSpeech || ''),
    escapeCSV(entry.definition || ''),
    entry.isAnswer ? 'TRUE' : 'FALSE',
    entry.isAnswer ? 'TRUE' : 'FALSE',  // enabled = isAnswer by default
    ''  // notes always empty
  ].join(','))

  const csvContent = [header, ...rows].join('\n')

  // Write to file
  const outputFileName = `${dialect}_${wordLength}_words.csv`
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

// ============================================
// Main execution
// ============================================

function main() {
  console.log('Generating CSV files for Google Sheets migration...\n')

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const results = []

  for (const dialect of DIALECTS) {
    for (const wordLength of WORD_LENGTHS) {
      const result = generateCSV(dialect, wordLength)
      results.push(result)
    }
  }

  console.log('\n--- Summary ---')
  for (const result of results) {
    console.log(`${result.fileName}: ${result.totalWords} total (${result.answerCount} answers, ${result.guessOnlyCount} guess-only)`)
  }
  console.log(`\nCSV files saved to: ${OUTPUT_DIR}`)
}

main()
