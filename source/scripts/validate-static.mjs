import fs from 'node:fs';
import path from 'node:path';

const sourceRoot = process.cwd();
const outDir = path.join(sourceRoot, 'out');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/Fritz-Fries-Interactive-Menu';

function fail(message) {
  throw new Error(message);
}

if (!fs.existsSync(path.join(outDir, 'index.html'))) fail('Static export is missing out/index.html.');

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(outDir);

const localUrl = /(?:href|src)=["']([^"'#?]+)(?:[#?][^"']*)?["']/g;
const bad = [];
const missing = [];

for (const file of htmlFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(localUrl)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|blob:)/.test(value)) continue;
    if (!value.startsWith('/')) continue;
    if (!value.startsWith(basePath + '/') && value !== basePath) {
      bad.push({ file: path.relative(outDir, file), value });
      continue;
    }
    const stripped = value.slice(basePath.length).replace(/^\//, '');
    if (!stripped) continue;
    const target = path.join(outDir, stripped);
    if (!fs.existsSync(target)) missing.push({ file: path.relative(outDir, file), value });
  }
}

if (bad.length) fail('Root-absolute URLs escaped the GitHub Pages base path:\n' + JSON.stringify(bad, null, 2));
if (missing.length) fail('Generated HTML references missing local assets:\n' + JSON.stringify(missing, null, 2));

console.log(JSON.stringify({
  ok: true,
  basePath,
  htmlFiles: htmlFiles.length,
  badRootAbsoluteUrls: 0,
  missingAssets: 0
}, null, 2));
