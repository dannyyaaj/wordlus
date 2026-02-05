# Wordlus

A daily word game for the Hmong language.

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
- Green (Moob Leeg) and White (Hmob Dawb) dialect support
- Game state persists across sessions
- On screen keyboard with color feedback
- Physical keyboard support
- Mobile first responsive design

## Running Locally

Open `index.html` in your browser, or run a local server:

```bash
npx serve@14.2.5 .
```

Then open http://localhost:3000

## Project Structure

```markdown
src/
├── game/
│   ├── rules.js      # Pure evaluation logic
│   ├── state.js      # State management + persistence
│   └── words.js      # Word loading, validation + definitions
├── ui/
│   ├── grid.js       # Game grid rendering
│   ├── howToPlay.js  # How to play modal with color legend
│   ├── keyboard.js   # On-screen keyboard
│   ├── modal.js      # End game modal with word definitions
│   └── toast.js      # Toast notifications
├── data/
│   ├── green/        # Green (Moob Leeg) dialect
│   │   ├── 4-letter/
│   │   │   ├── answers.json
│   │   │   └── guesses.json
│   │   └── 5-letter/
│   │       ├── answers.json
│   │       └── guesses.json
│   └── white/        # White (Hmoob Dawb) dialect
│       ├── 4-letter/
│       │   ├── answers.json
│       │   └── guesses.json
│       └── 5-letter/
│           ├── answers.json
│           └── guesses.json
└── index.js          # Main entry point
```

## Learning & Philosophy

Wordlus is a learning first project.

This repository is intentionally kept simple, readable, and framework light so that:

- new developers can understand how a word game works
- learners can explore how language focused games are built
- the Hmong language is represented thoughtfully in modern software

### On Language & Correctness

Hmong, like all living languages, has dialects, variations, and evolving usage.
The word lists used in Wordlus are **curated for playability**, not authority.

No single list is considered definitive.
Words are chosen because they are:

- commonly recognized
- appropriate for a guessing game
- reasonably learnable by players

The goal is not to judge correctness, but to encourage use, curiosity, and learning.

### On Simplicity

Wordlus prioritizes:

- clarity over cleverness
- accessibility over complexity
- shipping over perfection

This is a game first, and a teaching tool second.
If something feels fun, fair, and respectful, it is probably the right choice.

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
