# Scrapers Guide

This folder holds the data scrapers that extract study/support material from
external education portals and normalize it into JSON our app can consume.

Scrapers are **Node.js / dev-only** tools. They run at author/build time to
regenerate each `output.json` (which the production app ships); their
dependencies are `devDependencies` and never deploy to the server. Node 18+ is
required (uses the built-in global `fetch`).

## Adding a new scraper

1. Create a subfolder named after the source (lowercase, e.g. `ncert/`).
2. Add `scraper.js` following the conventions above (local-default + URL arg,
   same top-level output wrapper).
3. Add a `scrape:<source>` script to the root `package.json`.
4. Generate `output.json` and verify the record count.
5. Document it here as a new numbered section: source URL, page structure,
   parsing logic, output schema, and any caveats.

## Dependencies

Managed from the **root** `package.json` (dev-only). Install once:

```bash
npm install
```

Shared across scrapers:

- `cheerio` — jQuery-like HTML parsing.
- `fetch` — built into Node 18+, no package needed.

---

## 1. KVS — Knowledge Hub (`kvs/`)

Scrapes the Kendriya Vidyalaya Sangathan "Knowledge Hub" support-material listing.

- **Source:** https://kvsangathan.nic.in/en/knowledge-hub/
- **Script:** `kvs/scraper.js`
- **Output:** `kvs/output.json`

### How to run

From the repo root:

```bash
npm run scrape:kvs                            # scrape the bundled local HTML (default)
node src/scrapper/kvs/scraper.js --url        # scrape the live KVS page
node src/scrapper/kvs/scraper.js <url|path>   # scrape any URL or local HTML file
```

### Output record schema

```json
{
  "sl_no": 1,
  "title": "Geography English",      // raw title, exactly as on the page
  "subject": "Geography",            // book/subject, class + language stripped
  "classes": ["11", "12"],           // explicit from title, else column default
  "class_group": "XI/XII",           // General | IX/X | XI/XII
  "language": "English",             // English | Hindi | Sanskrit | null
  "resource_type": "pdf",            // pdf | youtube | google_drive | flipbook | web
  "url": "https://...pdf"
}
```

---