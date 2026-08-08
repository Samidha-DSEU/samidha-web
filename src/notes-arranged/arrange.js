#!/usr/bin/env node
/*
 * Notes arranger
 * --------------
 * Team A dumps all the generated notes as flat PDF files inside `src/notes-gen/`,
 * named like this:
 *
 *     class6_socialscience_chapter4.pdf
 *     class<CLASS>_<SUBJECT>_chapter<CHAPTER>.pdf
 *
 * This script reads that folder and moves each PDF into a neat class/subject
 * tree inside `src/notes-arranged/`, so the same file ends up at:
 *
 *     class6/socialscience/chapter4.pdf
 *
 * Anything that doesn't fit the naming pattern is left alone and reported at
 * the end, so nothing gets lost.
 *
 * Run it just like the scraper:
 *     npm run arrange:notes
 */

import { readdir, mkdir, rename, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Where Team A drops the files, and where we arrange them.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(HERE, "..", "notes-gen");
const OUTPUT_DIR = HERE; // src/notes-arranged/

// Pull the class, subject and chapter out of a filename like
// "class6_socialscience_chapter4.pdf". Returns null if it doesn't match.
function readName(fileName) {
  const match = /^class(\d+)_(.+)_chapter(\d+)\.pdf$/i.exec(fileName);
  if (!match) return null;

  const [, classNo, subject, chapterNo] = match;
  return {
    class: `class${classNo}`,
    subject: subject.toLowerCase(),
    chapter: `chapter${chapterNo}.pdf`,
  };
}

async function main() {
  const files = await readdir(SOURCE_DIR);

  const arranged = [];
  const skipped = [];

  for (const fileName of files.sort()) {
    const parts = readName(fileName);

    // Not a note we recognise (e.g. README.txt) -> leave it where it is.
    if (!parts) {
      skipped.push(fileName);
      continue;
    }

    // Build the destination: src/notes-arranged/class6/socialscience/chapter4.pdf
    const folder = path.join(OUTPUT_DIR, parts.class, parts.subject);
    const destination = path.join(folder, parts.chapter);

    await mkdir(folder, { recursive: true });
    await rename(path.join(SOURCE_DIR, fileName), destination);

    arranged.push(`${fileName}  ->  ${parts.class}/${parts.subject}/${parts.chapter}`);
  }

  console.log(`Arranged ${arranged.length} file(s):`);
  arranged.forEach((line) => console.log(`  ${line}`));

  if (skipped.length) {
    console.log(`\nSkipped ${skipped.length} file(s) (name didn't match):`);
    skipped.forEach((name) => console.log(`  ${name}`));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
