import test from 'node:test';
import assert from 'node:assert/strict';
import { assertSafeGeneratedName, PROTECTED_ROOT_NAMES } from '../../scripts/publish-to-root.mjs';

test('publisher rejects every protected repository root name', () => {
  for (const name of PROTECTED_ROOT_NAMES) {
    assert.throws(() => assertSafeGeneratedName(name), /protected root path/);
  }
});

test('publisher rejects traversal and nested paths', () => {
  for (const name of ['..', '../README.md', 'source/out', 'a\\b']) {
    assert.throws(() => assertSafeGeneratedName(name), /Unsafe generated root path|protected root path/);
  }
});

test('publisher allows generated top-level site paths', () => {
  for (const name of ['index.html', '404.html', '_next', 'images']) {
    assert.doesNotThrow(() => assertSafeGeneratedName(name));
  }
});
