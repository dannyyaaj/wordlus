# Contributing to Wordlus

Thank you for your interest in contributing to Wordlus!
This project is community-driven and focused on celebrating, learning, and
preserving the Hmong language.

## Word Submissions

Word list updates are welcome and encouraged.

### Guidelines

Please ensure that submitted words are:

- Correctly spelled
- Appropriate for general audiences
- Valid Hmong words (Green and White dialects combined)
- Exactly 4 or 5 letters long
- Not proper nouns (names, places, brands)
- Not offensive or derogatory

If you are unsure about a word, feel free to include a note or source.

---

### Dialect Policy

At this time, Wordlus uses a **combined Hmong word list** that includes both
Green and White dialect spellings.

There is no dialect separation in gameplay. If a word exists in multiple
dialects with different spellings, all valid spellings may be included.

Dialect-specific filtering or modes may be explored in the future.

---

### How to Submit Words

1. Fork the repository
2. Add or edit words in the appropriate file:

   - `src/data/4-letter/words.json`
   - `src/data/5-letter/words.json`

3. Each file contains a JSON object with a `words` array.
   Each word entry must follow this structure:

   ```json
   {
     "word": "hmoob",
     "isAnswer": true,
     "partOfSpeech": "noun",
     "definition": "Hmong (people)"
   }
   ```

4. Ensure words are:
   - Exactly 4 or 5 letters
   - Unique (no duplicates)
   - Correctly spelled
5. Keep the list alphabetized
6. Open a Pull Request with a short explanation of your changes

Example PR description:

> Added 6 valid Hmong words with definitions and removed 2 invalid entries.
