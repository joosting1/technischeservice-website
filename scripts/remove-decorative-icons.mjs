import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const SOURCE_ROOT = join(process.cwd(), 'src');
const replacements = [
  { find: '✅ ', replace: '' },
  { find: '✅', replace: '' },
  { find: '✓ ', replace: '' },
  { find: '✓', replace: '' },
  { find: '❌ ', replace: '' },
  { find: '❌', replace: '' },
  { find: '📞 ', replace: '' },
  { find: '📞', replace: '' },
  { find: '📱 ', replace: '' },
  { find: '📱', replace: '' },
  { find: '✉️ ', replace: '' },
  { find: '✉️', replace: '' },
  { find: '✉ ', replace: '' },
  { find: '✉', replace: '' },
  { find: '🛒 ', replace: '' },
  { find: '🛒', replace: '' },
  { find: '🎯 ', replace: '' },
  { find: '🎯', replace: '' },
  { find: '🧮 ', replace: '' },
  { find: '🧮', replace: '' },
  { find: '🛡️ ', replace: '' },
  { find: '🛡️', replace: '' },
  { find: '🛡 ', replace: '' },
  { find: '🛡', replace: '' },
  { find: '⭐ ', replace: '' },
  { find: '⭐', replace: '' },
  { find: '❄️ ', replace: '' },
  { find: '❄️', replace: '' },
  { find: '❄ ', replace: '' },
  { find: '❄', replace: '' },
  { find: '💧 ', replace: '' },
  { find: '💧', replace: '' },
  { find: '💎 ', replace: '' },
  { find: '💎', replace: '' },
  { find: '🔧 ', replace: '' },
  { find: '🔧', replace: '' },
  { find: '💰 ', replace: '' },
  { find: '💰', replace: '' },
  { find: '📍 ', replace: '' },
  { find: '📍', replace: '' },
  { find: '🏢 ', replace: '' },
  { find: '🏢', replace: '' },
  { find: '➡ ', replace: '' },
  { find: '➡', replace: '' },
  { find: '⚡ ', replace: '' },
  { find: '⚡', replace: '' },
  { find: '✨ ', replace: '' },
  { find: '✨', replace: '' },
  { find: '🔄 ', replace: '' },
  { find: '🔄', replace: '' },
  { find: '🇪🇺 ', replace: '' },
  { find: '🇪🇺', replace: '' },
  { find: '📏 ', replace: '' },
  { find: '📏', replace: '' },
  { find: '🧂 ', replace: '' },
  { find: '🧂', replace: '' },
  { find: '📋 ', replace: '' },
  { find: '📋', replace: '' },
  { find: '⏰ ', replace: '' },
  { find: '⏰', replace: '' },
  { find: '🔬 ', replace: '' },
  { find: '🔬', replace: '' },
  { find: '🧠 ', replace: '' },
  { find: '🧠', replace: '' },
  { find: '🛠️ ', replace: '' },
  { find: '🛠️', replace: '' },
  { find: '🛠 ', replace: '' },
  { find: '🛠', replace: '' },
  { find: '🧰 ', replace: '' },
  { find: '🧰', replace: '' },
  { find: '🧾 ', replace: '' },
  { find: '🧾', replace: '' },
  { find: '🚚 ', replace: '' },
  { find: '🚚', replace: '' },
  { find: '🚀 ', replace: '' },
  { find: '🚀', replace: '' },
  { find: '📦 ', replace: '' },
  { find: '📦', replace: '' },
  { find: '🔌 ', replace: '' },
  { find: '🔌', replace: '' },
  { find: '📣 ', replace: '' },
  { find: '📣', replace: '' },
  { find: '📌 ', replace: '' },
  { find: '📌', replace: '' },
  { find: '🗓️ ', replace: '' },
  { find: '🗓️', replace: '' },
  { find: '🗓 ', replace: '' },
  { find: '🗓', replace: '' },
  { find: '📝 ', replace: '' },
  { find: '📝', replace: '' },
  { find: '⚠ ', replace: '' },
  { find: '⚠', replace: '' },
  { find: '📸 ', replace: '' },
  { find: '📸', replace: '' },
  { find: '📄 ', replace: '' },
  { find: '📄', replace: '' },
  { find: '⏳ ', replace: '' },
  { find: '⏳', replace: '' },
  { find: '↳ ', replace: '' },
  { find: '↳', replace: '' },
  { find: '📅 ', replace: '' },
  { find: '📅', replace: '' },
  { find: '👤 ', replace: '' },
  { find: '👤', replace: '' },
  { find: '⏱ ', replace: '' },
  { find: '⏱', replace: '' },
  { find: '← ', replace: '' },
  { find: '←', replace: '' },
  { find: '→ ', replace: '' },
  { find: '→', replace: '' },
  { find: '🚨 ', replace: '' },
  { find: '🚨', replace: '' },
  { find: '🍪 ', replace: '' },
  { find: '🍪', replace: '' },
  { find: '🤝 ', replace: '' },
  { find: '🤝', replace: '' },
  { find: '🔍 ', replace: '' },
  { find: '🔍', replace: '' },
  { find: '📐 ', replace: '' },
  { find: '📐', replace: '' },
  { find: '💡 ', replace: '' },
  { find: '💡', replace: '' },
  { find: '🔩 ', replace: '' },
  { find: '🔩', replace: '' },
  { find: '🎨 ', replace: '' },
  { find: '🎨', replace: '' },
  { find: '⚙ ', replace: '' },
  { find: '⚙', replace: '' },
  { find: '� ', replace: '' },
  { find: '�', replace: '' },
  { find: '🌡 ', replace: '' },
  { find: '🌡', replace: '' },
  { find: '🏠 ', replace: '' },
  { find: '🏠', replace: '' },
  { find: '👥 ', replace: '' },
  { find: '👥', replace: '' },
  { find: '💻 ', replace: '' },
  { find: '💻', replace: '' },
  { find: '🌪 ', replace: '' },
  { find: '🌪', replace: '' },
  { find: '📈 ', replace: '' },
  { find: '📈', replace: '' },
  { find: '🏆 ', replace: '' },
  { find: '🏆', replace: '' },
  { find: '™ ', replace: '' },
  { find: '™', replace: '' },
  { find: '🌿 ', replace: '' },
  { find: '🌿', replace: '' },
  { find: '🔒 ', replace: '' },
  { find: '🔒', replace: '' },
  { find: '🏦 ', replace: '' },
  { find: '🏦', replace: '' },
  { find: '💳 ', replace: '' },
  { find: '💳', replace: '' },
  { find: '🔇 ', replace: '' },
  { find: '🔇', replace: '' },
  { find: '↺ ', replace: '' },
  { find: '↺', replace: '' },
  { find: '💨 ', replace: '' },
  { find: '💨', replace: '' },
  { find: '🧪 ', replace: '' },
  { find: '🧪', replace: '' },
  { find: '📊 ', replace: '' },
  { find: '📊', replace: '' },
  { find: '🌍 ', replace: '' },
  { find: '🌍', replace: '' },
  { find: '📜 ', replace: '' },
  { find: '📜', replace: '' },
  { find: '🎓 ', replace: '' },
  { find: '🎓', replace: '' },
  { find: '🏭 ', replace: '' },
  { find: '🏭', replace: '' },
  { find: '🔥 ', replace: '' },
  { find: '🔥', replace: '' },
  { find: '🧼 ', replace: '' },
  { find: '🧼', replace: '' },
  { find: '☕ ', replace: '' },
  { find: '☕', replace: '' },
  { find: '‹ ', replace: '' },
  { find: '‹', replace: '' },
  { find: '› ', replace: '' },
  { find: '›', replace: '' },
  { find: '🚰 ', replace: '' },
  { find: '🚰', replace: '' },
  { find: '🧊 ', replace: '' },
  { find: '🧊', replace: '' },
  { find: '📧 ', replace: '' },
  { find: '📧', replace: '' },
  { find: '✋ ', replace: '' },
  { find: '✋', replace: '' },
  { find: '🌱 ', replace: '' },
  { find: '🌱', replace: '' },
  { find: '👨 ', replace: '' },
  { find: '👨', replace: '' },
  { find: '🍳 ', replace: '' },
  { find: '🍳', replace: '' },
  { find: '🚿 ', replace: '' },
  { find: '🚿', replace: '' },
  { find: '🇧 ', replace: '' },
  { find: '🇧', replace: '' },
  { find: '🇪 ', replace: '' },
  { find: '🇪', replace: '' }
];

const additionalChars = new Set(['\uFE0F', '\u200D'].map((value) => JSON.parse(`"${value}"`)));

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

const cleanContent = (content) => {
  let updated = content;
  for (const { find, replace } of replacements) {
    updated = updated.split(find).join(replace);
  }
  for (const char of additionalChars) {
    updated = updated.split(char).join('');
  }
  updated = updated.replace(/<div([^>]*class="[^"]*text-[^"]*"[^>]*)>\s*<\/div>/g, (match, attrs) => {
    if (/\bid\s*=/.test(attrs)) return match;
    return '';
  });
  updated = updated.replace(/<span([^>]*class="[^"]*text-[^"]*"[^>]*)>\s*<\/span>/g, (match, attrs) => {
    if (/\bid\s*=/.test(attrs)) return match;
    return '';
  });
  return updated;
};

const files = collectFiles(SOURCE_ROOT);
let touched = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  const cleaned = cleanContent(original);
  if (cleaned !== original) {
    writeFileSync(file, cleaned, 'utf8');
    touched += 1;
    console.log(`Cleaned: ${file}`);
  }
}

console.log(`Processed ${files.length} files. Cleaned ${touched} files.`);
