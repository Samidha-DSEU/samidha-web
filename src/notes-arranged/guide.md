# Notes Arranger Guide

Team A generates study notes and dumps them as flat PDF files into
`src/notes-gen/`. This tool sorts those files into a tidy `class / subject /
chapter` tree inside `src/notes-arranged/` so the app can find them predictably.

## Input (what Team A produces)

All notes land flat in `src/notes-gen/`, named with labels:

```
class<CLASS>_<SUBJECT>_chapter<CHAPTER>.pdf

e.g.  class6_socialscience_chapter4.pdf
      class10_science_chapter5.pdf
```

## Output (what this tool produces)

Each file is **moved** into `src/notes-arranged/` and renamed:

```
class6/socialscience/chapter4.pdf
class10/science/chapter5.pdf
```

## How to run

From the repo root:

```bash
npm run arrange:notes
```

That's it — no dependencies, just Node 18+ built-ins. The script is
`src/notes-arranged/arrange.js`.

## How it works

1. Reads every file in `src/notes-gen/`.
2. Matches each name against `class<N>_<subject>_chapter<M>.pdf`
   (case-insensitive) with a single regex.
3. For a match, creates `class<N>/<subject>/` if needed and moves the file in as
   `chapter<M>.pdf`.
4. Anything that doesn't match (e.g. `README.txt`) is **left untouched** and
   listed under "Skipped" at the end, so nothing is lost.

## Notes / caveats

- Files are **moved**, not copied — after a run, `src/notes-gen/` only holds the
  files that didn't match.
- Subject is taken verbatim (lowercased) from the filename, so keep Team A's
  subject spelling consistent (`socialscience`, not `social_science`) or the
  same subject will split across folders.
- Re-running is safe: already-arranged files are gone from the source, so they
  won't be processed twice.
