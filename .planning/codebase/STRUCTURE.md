# Codebase Structure

**Analysis Date:** 2026-09-11

## Directory Layout

```text
moran-family-board-card/
├── .github/                  # CI, HACS validation, release, Dependabot
├── .planning/                # GSD project and codebase context
│   └── codebase/             # Brownfield architecture map
├── dev/                      # Browser development fixtures
├── dist/                     # Committed generated HACS bundle
├── docs/                     # Product, design, installation, and visual assets
├── src/                      # TypeScript source and collocated unit tests
├── hacs.json                 # HACS plugin metadata
├── package.json              # npm manifest and scripts
├── rollup.config.js          # Production bundler configuration
└── tsconfig.json             # TypeScript compiler configuration
```

## Directory Purposes

**`src/`:**
- Contains all handwritten runtime TypeScript.
- `src/ha-family-board-card.ts` is the main card, renderers, controller, dialogs, and CSS.
- `src/config.ts` is the shared card/editor contract and lossless layout serializer.
- `src/calendar-source.ts` is the narrow authenticated Home Assistant calendar-read adapter.
- `src/events.ts` contains DOM-free event logic.
- `src/*.test.ts` contains collocated config, calendar-source, and event-domain unit suites.
- `src/editor.ts` and `src/editor-i18n.ts` implement graphical configuration.
- `src/localize.ts` implements card localization and date/time formatting.

**`dev/`:**
- Contains generic, non-household browser fixtures.
- `dev/harness.html` supplies a mocked Home Assistant object for quick visual verification.
- Keep fixtures deterministic and free of private entity IDs or event text.

**`dist/`:**
- Contains the generated, minified `dist/moran-family-board-card.js` release artifact.
- Source of truth remains `src/`; regenerate with `npm run build` after source changes.
- The bundle is committed because HACS releases distribute this exact file.

**`docs/`:**
- User/developer documentation and design assets.
- `docs/MORAN_DESIGN_SPEC.md` defines the target visual contract.
- `docs/MORAN_FORK_PLAN.md` captures the earlier implementation direction.
- `docs/concepts/` stores generic target concepts.
- `docs/HACS_STORE.md` documents custom-repository distribution.

**`.github/`:**
- `workflows/ci.yml` runs the code-quality pipeline.
- `workflows/validate.yml` validates HACS compatibility.
- `workflows/release.yml` builds and attaches release assets.
- `dependabot.yml` tracks dependency updates.

**`.planning/`:**
- GSD-owned project memory, requirements, roadmap, phase plans, and verification evidence.
- Codebase maps live under `.planning/codebase/` and must reference real repository paths.

## Key File Locations

**Entry points:**
- `src/ha-family-board-card.ts` — source entry and custom-element registration.
- `dist/moran-family-board-card.js` — browser/HACS entry.
- `dev/harness.html` — local visual-development entry.

**Configuration:**
- `package.json` — scripts, versions, and dependencies.
- `package-lock.json` — exact npm dependency graph.
- `tsconfig.json` — strict ES2021 compiler settings.
- `rollup.config.js` — single-bundle build.
- `.prettierrc.json` — formatting policy.
- `hacs.json` — HACS metadata.

**Core logic:**
- `src/config.ts` — shared configuration types, view values, and layout helpers.
- `src/calendar-source.ts` — single-calendar authenticated read boundary.
- `src/events.ts` — routing, parsing, segmentation, overlap, drag calculations.
- `src/ha-family-board-card.ts` — runtime controller, views, interactions, mutations, styles.
- `src/localize.ts` — localizable card copy and time/date formatting.

**Testing:**
- `src/config.test.ts` — layout compatibility and lossless serialization tests.
- `src/calendar-source.test.ts` — authenticated request-boundary tests.
- `src/events.test.ts` — collocated event-domain tests.
- `.github/workflows/ci.yml` — enforced repository checks.
- `dev/harness.html` — manual browser smoke fixture.

## Naming Conventions

**Files:**
- Use kebab-case for source and documentation filenames.
- Use `*.test.ts` beside the module under test.
- Use uppercase names for durable project documents such as `README`, `NOTICE`, and GSD artifacts.

**Symbols:**
- Use PascalCase for classes, interfaces, and type aliases.
- Use camelCase for exported pure functions.
- Prefix private card/editor methods and runtime fields with `_`.
- Use uppercase snake case for true module constants such as `DAY_MS`.

## Where to Add New Code

**Pure calendar behavior:**
- Add implementation to `src/events.ts` or a new focused module under `src/`.
- Add collocated tests as `src/<module>.test.ts`.
- Keep Home Assistant and DOM objects out of domain modules.

**Card UI:**
- Existing behavior is in `src/ha-family-board-card.ts`.
- New substantial surfaces should move toward focused modules instead of increasing the main file indefinitely.
- Add user-facing strings to `src/localize.ts`.

**Configuration/editor:**
- Update the single public config contract and helpers in `src/config.ts`.
- Import shared types and serializers into both the card and editor; do not redeclare them.
- Add English/German editor copy to `src/editor-i18n.ts`.
- Update `README.en.md` and, when practical, `README.md`.

**External providers:**
- Create a focused adapter module under `src/` with an explicit interface.
- Keep credentials and private endpoints outside the frontend bundle and dashboard configuration.

## Special Directories

**`dist/`:**
- Generated by Rollup, committed, and released.
- Never edit the minified bundle manually.

**`.planning/`:**
- Authored and updated through GSD workflows.
- Committed so requirements, decisions, and verification remain attached to the code.

---

*Structure analysis: 2026-09-11*
*Update when directory structure changes*
