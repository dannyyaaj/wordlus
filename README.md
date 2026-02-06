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
- Dialect-inclusive Hmong word pool
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
│   ├── 4-letter/
│   │   └── words.json
│   └── 5-letter/
│       └── words.json
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

Wordlus uses a single, dialect-inclusive word pool. No strict Green/White separation.
Many families are mixed, speakers switch naturally, and community usage doesn't follow academic lines.

Words are chosen because they are:

- commonly recognized across dialects
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
- [World Loanword Database - White Hmong Vocabulary](https://wold.clld.org/vocabulary/25)
- [101 Languages - Hmong Word List](https://www.101languages.net/hmong/hmong-word-list/)
- [DCE Hmong - Common Words/Phrases](https://dcehmong.weebly.com/common-hmong-wordsphrases.html)
- [Study Hmong - The Hmong Alphabet](https://studyhmong.com/the-hmong-alphabet/)
- [Study Hmong - External Anatomy](https://studyhmong.com/external-anatomy/)

## Word List Management

Word lists are managed in Google Sheets and exported to JSON for the game. This allows for collaborative editing, review workflows, and preserving word history.

### Exporting to CSV

Run the migration script to generate CSV files for Google Sheets:

```bash
node scripts/generate-sheets-csv.js
```

This creates 2 CSV files in `csv-export/`:

- `4_letter_words.csv`
- `5_letter_words.csv`

### Schema

Each word has 5 fields:

| Field | Purpose |
|-------|---------|
| `word` | The game - what players guess |
| `isAnswer` | Fairness - can this be a daily solution? |
| `enabled` | Control - is this word active? |
| `definition` | Learning - helps players understand |
| `partOfSpeech` | Learning - noun, verb, adj, etc. |

### Enabled vs Answer

These are independent flags:

| enabled | isAnswer | Meaning |
|---------|----------|---------|
| TRUE | TRUE | Active daily solution |
| TRUE | FALSE | Valid guess only |
| FALSE | TRUE/FALSE | Ignored entirely |

**Why `enabled` matters:**

- **Reversible decisions** - disable instead of delete, discuss later
- **Soft moderation** - "not using right now" ≠ "this word is wrong"
- **Safe contributions** - disable one bad word without reverting a batch
- **Review workflows** - new words start disabled until approved
- **Preserves knowledge** - disabled words remain searchable and documented

For a language preservation project, this distinction matters. Disabled words keep their history and context intact.

## Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5 / CSS3
- localStorage for persistence
- No build tools required

## Privacy

Wordlus uses anonymous analytics to understand general usage. We do not track individual users, store personal information, or collect typed guesses.

See [PRIVACY.md](PRIVACY.md) for details.

## Versioning Policy

- **Patch (0.1.x)**: word list updates, spelling corrections, analytics, internal changes
- **Minor (0.x.0)**: gameplay changes, new modes, UX flows, rule changes
- **Major (1.0.0)**: stable public release

For word list citations, releases may include build metadata: `0.1.1+words-2026-02-06`

## Disclaimer

This project is inspired by word-guessing games like Wordle, but is not affiliated with or endorsed by The New York Times.

## License

MIT
