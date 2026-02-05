# Wordlus

A Wordle-style word game for the Hmong language.

**Play. Learn. Preserve Hmong language.**

## How to Play

1. Choose 4-letter or 5-letter mode
2. Guess the Hmong word in 6 tries
3. Each guess must be a valid Hmong word
4. Color feedback after each guess:
   - 🟩 **Green** - correct letter, correct position
   - 🟨 **Yellow** - correct letter, wrong position
   - ⬛ **Gray** - letter not in word

## Features

- 4-letter and 5-letter word modes
- Game state persists across sessions
- On-screen keyboard with color feedback
- Physical keyboard support
- Mobile-first responsive design
- Respects prefers-reduced-motion

## Running Locally

```bash
npx serve .
```

Then open http://localhost:3000

## Project Structure

```
src/
├── game/
│   ├── rules.js      # Pure evaluation logic
│   ├── state.js      # State management + persistence
│   └── words.js      # Word loading + validation
├── ui/
│   ├── grid.js       # Game grid rendering
│   ├── keyboard.js   # On-screen keyboard
│   ├── modal.js      # Mode selection + end game modals
│   └── toast.js      # Toast notifications
├── data/
│   ├── words-4-answers.json
│   ├── words-4-guesses.json
│   ├── words-5-answers.json
│   └── words-5-guesses.json
└── index.js          # Main entry point
```

## Word Sources

The Hmong word lists were compiled from:

- [1000 Most Common Hmong Words](https://1000mostcommonwords.com/1000-most-common-hmong-words/)
- [Study Hmong A-Z Dictionary](https://studyhmong.com/a-to-z-dictionary/)

## Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5 / CSS3
- localStorage for persistence
- No build tools required

## License

MIT
