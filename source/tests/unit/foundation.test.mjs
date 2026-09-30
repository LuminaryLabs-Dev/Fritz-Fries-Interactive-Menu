import test from 'node:test';
import assert from 'node:assert/strict';
import config from '../../next.config.mjs';

test('exports a static site with directory routes', () => {
  assert.equal(config.output, 'export');
  assert.equal(config.trailingSlash, true);
  assert.equal(config.poweredByHeader, false);
});
