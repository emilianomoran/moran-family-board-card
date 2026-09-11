# Technology Stack

**Analysis Date:** 2026-09-11

## Languages

**Primary:**
- TypeScript 5.x — card rendering, Home Assistant integration, editor, localization, and event-domain logic under `src/`.

**Secondary:**
- JavaScript ES modules — Rollup build configuration in `rollup.config.js`.
- HTML/CSS/JavaScript — standalone browser fixture in `dev/harness.html`.
- YAML — GitHub Actions under `.github/workflows/`.
- Markdown — product, installation, design, and planning documentation.

## Runtime

**Development:**
- Node.js; GitHub Actions uses Node 20 in `.github/workflows/ci.yml` and `.github/workflows/release.yml`.
- npm with committed `package-lock.json`; use `npm ci` for deterministic installs.

**Production:**
- Modern browser inside the Home Assistant frontend.
- Home Assistant 2024.1.0 or newer, declared in `hacs.json`.
- One self-contained ES module emitted to `dist/moran-family-board-card.js`.

## Frameworks

**Core:**
- Lit 3.x — reactive Web Component implementation and scoped styling.
- `custom-card-helpers` 1.9.x — Home Assistant frontend types and helper APIs.

**Testing:**
- Vitest 1.6.x — pure event-domain unit tests in `src/events.test.ts`.

**Build and quality:**
- Rollup 4.x — production bundle.
- TypeScript compiler — strict type checking via `npm run lint`.
- Prettier 3.x — formatting via `npm run format` and `npm run format:check`.
- Terser — production minification.

## Configuration

**Compiler and build:**
- `tsconfig.json` targets ES2021, uses bundler module resolution, enables decorators, and includes only `src/**/*.ts`.
- `rollup.config.js` uses `src/ha-family-board-card.ts` as the entry point and inlines the dynamically loaded editor.
- `.prettierrc.json` specifies 100-column lines, two spaces, double quotes, semicolons, and trailing commas.

**Distribution:**
- `hacs.json` declares the dashboard-card bundle filename and minimum Home Assistant version.
- `.github/workflows/release.yml` builds and attaches the bundle to published GitHub releases.
- The generated `dist/moran-family-board-card.js` is committed and is the HACS release artifact.

## Platform Requirements

**Development:**
- Any platform with Node.js 20-compatible tooling.
- A Chromium browser or Home Assistant test instance for rendered verification.

**Production:**
- Home Assistant dashboard with the module installed through HACS or `/config/www`.
- Browser support for custom elements, shadow DOM, Unicode property escapes, ResizeObserver, and pointer events.

---

*Stack analysis: 2026-09-11*
*Update after major dependency changes*
