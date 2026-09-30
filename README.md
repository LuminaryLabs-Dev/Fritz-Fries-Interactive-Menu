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
