import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Process all images under public/assets (excluding existing responsive subfolders)
const WORK_DIR = path.join(projectRoot, 'public', 'assets');
const OUT_SUBDIR = 'responsive';
const WIDTHS = [480, 768, 1024, 1440];
const FORMATS = [
  { ext: 'avif', options: (s) => s.avif({ quality: 55 }) },
  { ext: 'webp', options: (s) => s.webp({ quality: 75 }) },
  { ext: 'jpg', options: (s) => s.jpeg({ quality: 78, mozjpeg: true }) },
];

const VALID_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP']);

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === OUT_SUBDIR) continue; // skip output dir
      yield* walk(full);
    } else {
      const ext = path.extname(entry.name);
      if (VALID_EXT.has(ext)) yield full;
    }
  }
}

async function isUpToDate(input, output) {
  try {
    const [inStat, outStat] = await Promise.all([fs.stat(input), fs.stat(output)]);
    return outStat.mtimeMs >= inStat.mtimeMs;
  } catch {
    return false;
  }
}

async function processImage(file) {
  // Skip paths that are extremely long (Windows path limit ~260) to avoid errors
  if (file.length > 240) {
    console.warn(`[gen-responsive] Skipping long path (${file.length}) ${file}`);
    return [];
  }
  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  const outDir = path.join(dir, OUT_SUBDIR);
  await ensureDir(outDir);

  const pipeline = sharp(file, { failOn: 'none' }).rotate();
  const results = [];

  for (const width of WIDTHS) {
    for (const fmt of FORMATS) {
      const outPath = path.join(outDir, `${base}-${width}w.${fmt.ext}`);
      if (await isUpToDate(file, outPath)) {
        results.push(outPath);
        continue;
      }
      const resized = pipeline.clone().resize({ width, withoutEnlargement: true });
      await fmt.options(resized).toFile(outPath);
      results.push(outPath);
    }
  }

  return results;
}

async function main() {
  try {
    const exists = await fs.stat(WORK_DIR).then(() => true).catch(() => false);
    if (!exists) {
      console.log(`[gen-responsive] Skipping: assets directory not found ${WORK_DIR}`);
      return;
    }

    let count = 0;
    for await (const file of walk(WORK_DIR)) {
      try {
        await processImage(file);
        count++;
      } catch (err) {
        console.warn(`[gen-responsive] Failed ${file}:`, err?.message || err);
      }
    }
    console.log(`[gen-responsive] Done. Processed ${count} source image(s).`);
  } catch (e) {
    console.error('[gen-responsive] Fatal error:', e);
    process.exitCode = 1;
  }
}

await main();
