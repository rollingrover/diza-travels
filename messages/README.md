# DIZA TRAVELS — Translation Files

This folder contains all UI text for the site in 10 languages.

## How translation works here

- **`en.json`** is the source of truth — fully written, reviewed English copy.
- **All other 9 files** (`zu.json`, `zh.json`, `ru.json`, `hi.json`, `pt.json`,
  `es.json`, `nl.json`, `de.json`, `fr.json`) have the **exact same structure**
  as `en.json`, but every value is wrapped like this:

  ```json
  "heroCtaPrimary": "[TRANSLATE: Explore Experiences]"
  ```

  The text inside `[TRANSLATE: ...]` is the English original, included so a
  translator always has full context for every string — no need to
  cross-reference `en.json` while working.

## Sending files to a translator

1. Send the relevant `{locale}.json` file (e.g. `de.json` for German).
2. Ask the translator to replace each `"[TRANSLATE: English text]"` value
   with the translated string, **keeping the JSON keys exactly as they are**
   — only the values (the text in quotes) should change.
3. Once translated, the file should look like:

   ```json
   "heroCtaPrimary": "Erlebnisse entdecken"
   ```

   (no more `[TRANSLATE: ...]` wrapper)

4. Drop the finished file back into this `messages/` folder, overwriting the
   placeholder version. **No code changes are needed** — the site will pick
   it up automatically on next build/deploy.

## Adding a brand-new string later

If you add new UI text to the site in the future:

1. Add the new key to `en.json` first, with the real English copy.
2. Run the regeneration script (`scripts/generate-placeholders.py` — ask your
   developer to re-run it, or copy the key manually into all 9 other files
   wrapped in `[TRANSLATE: ...]`).
3. This keeps all 10 files in **structural parity** — every locale file must
   have the exact same keys as `en.json`, just with different values. If a
   key is missing in any locale file, `next-intl` will throw a build error,
   so parity is enforced automatically.

## Locale codes reference

| Code | Language              |
|------|------------------------|
| `en` | English (default)      |
| `zu` | isiZulu                |
| `zh` | Chinese (Simplified)   |
| `ru` | Russian                |
| `hi` | Hindi                  |
| `pt` | Portuguese             |
| `es` | Spanish                |
| `nl` | Dutch                  |
| `de` | German                 |
| `fr` | French                 |

## Verifying parity after editing

Run this from the project root to confirm all files still match structurally:

```bash
node scripts/verify-locale-parity.js
```
