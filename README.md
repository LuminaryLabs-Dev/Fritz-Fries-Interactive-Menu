# Fritz Fries Interactive Menu

Source lives in `source/`. The repository root is reserved for the generated GitHub Pages export plus repository metadata.

## Development

```bash
cd source
npm install
npm test
npm run build
npm run validate:static
```

The static export is written to `source/out/`.

## Publish to repository root

```bash
cd source
npm run publish:root
```

The publisher only removes paths recorded in the previous generated-output manifest and refuses to touch protected repository paths such as `source/`, `.git/`, `.github/`, `README.md`, and `.gitignore`.

Generated root files such as `index.html`, `404.html`, `_next/`, and `.nojekyll` must never be edited manually.

GitHub Pages base path: `/Fritz-Fries-Interactive-Menu`.


## Live Pages

Published URL:

`https://luminarylabs-dev.github.io/Fritz-Fries-Interactive-Menu/`

GitHub Pages serves the generated repository-root export. Editable source remains under `source/`.

## Rollback

If a generated publication is bad:

1. Revert the source change that produced it, or check out the last known-good source revision.
2. Let the `Build and deploy Next.js` workflow rebuild and validate `source/out/`.
3. The guarded publisher replaces only paths listed in `.pages-generated.json`.
4. Confirm the Pages deployment workflow succeeds before treating the rollback as complete.

Do not manually patch generated root HTML or `_next/` assets.
