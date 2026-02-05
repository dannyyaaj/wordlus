export function evaluateGuess(guess, answer) {
  const guessArr = guess.toLowerCase().split('')
  const answerArr = answer.toLowerCase().split('')
  const result = new Array(guess.length).fill('absent')
  const letterCount = {}

  answerArr.forEach(letter => {
    letterCount[letter] = (letterCount[letter] || 0) + 1
  })

  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = 'correct'
      letterCount[guessArr[i]]--
    }
  }

  for (let i = 0; i < guessArr.length; i++) {
    if (result[i] === 'correct') continue
    if (letterCount[guessArr[i]] > 0) {
      result[i] = 'present'
      letterCount[guessArr[i]]--
    }
  }

  return result
}

export function isValidLength(guess, wordLength) {
  return guess.length === wordLength
}

export function isWin(evaluation) {
  return evaluation.every(r => r === 'correct')
}

export function isLetter(char) {
  return /^[a-zA-Z]$/.test(char)
}
