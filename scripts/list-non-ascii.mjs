import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const SOURCE_ROOT = join(process.cwd(), 'src');
const threshold = 880; // capture emoji and special symbols, skip regular accented letters

const collectFiles = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const resolved = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(resolved));
    } else if (extname(entry.name) === '.astro') {
      files.push(resolved);
    }
  }
  return files;
};

const chars = new Map();

for (const file of collectFiles(SOURCE_ROOT)) {
  const content = readFileSync(file, 'utf8');
  for (const char of content) {
    const code = char.codePointAt(0);
    if (code !== undefined && code > threshold) {
      if (/[\p{Letter}\p{Number}]/u.test(char)) continue;
      if (!chars.has(char)) {
        chars.set(char, new Set());
      }
      chars.get(char)?.add(file);
    }
  }
}

if (!chars.size) {
  console.log('No high-codepoint characters detected.');
} else {
  for (const [char, files] of chars) {
    console.log(`${char} (U+${char.codePointAt(0)?.toString(16).toUpperCase()})`);
    for (const file of files) {
      console.log(`  - ${file}`);
    }
  }
}
