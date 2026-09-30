import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PROTECTED_ROOT_NAMES = new Set([
  '.git',
  '.github',
  '.gitignore',
  'README.md',
  'source',
  '.pages-generated.json'
]);

export function assertSafeGeneratedName(name) {
  if (!name || name === '.' || name === '..' || name.includes('/') || name.includes('\\')) {
    throw new Error(`Unsafe generated root path: ${name}`);
  }
  if (PROTECTED_ROOT_NAMES.has(name)) {
    throw new Error(`Refusing to modify protected root path: ${name}`);
  }
}

export function publishStatic({ sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..') } = {}) {
  const repoRoot = path.resolve(sourceRoot, '..');
  const outDir = path.join(sourceRoot, 'out');
  const manifestPath = path.join(repoRoot, '.pages-generated.json');

  if (!fs.existsSync(path.join(outDir, 'index.html'))) {
    throw new Error('Refusing to publish: source/out/index.html does not exist.');
  }

  let previous = [];
  if (fs.existsSync(manifestPath)) {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    previous = Array.isArray(parsed.generated) ? parsed.generated : [];
  }

  for (const name of previous) {
    assertSafeGeneratedName(name);
    fs.rmSync(path.join(repoRoot, name), { recursive: true, force: true });
  }

  const generated = [];
  for (const entry of fs.readdirSync(outDir, { withFileTypes: true })) {
    assertSafeGeneratedName(entry.name);
    fs.cpSync(path.join(outDir, entry.name), path.join(repoRoot, entry.name), {
      recursive: true,
      force: true
    });
    generated.push(entry.name);
  }

  fs.writeFileSync(path.join(repoRoot, '.nojekyll'), '');
  if (!generated.includes('.nojekyll')) generated.push('.nojekyll');
  generated.sort();
  fs.writeFileSync(manifestPath, JSON.stringify({ generated }, null, 2) + '\n');
  return { repoRoot, generated };
}

const invokedAsScript = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedAsScript) {
  const result = publishStatic();
  console.log(JSON.stringify(result, null, 2));
}
