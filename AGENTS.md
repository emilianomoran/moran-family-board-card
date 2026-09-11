<!-- GSD:project-start source:PROJECT.md -->

## Project

**Moran Family Board Card**

Moran Family Board Card is a Home Assistant-native, calendar-first family wall display. It extends an existing Lit custom card so a household can understand who is doing what and when from one shared screen, while keeping Home Assistant and the existing calendar systems as the data and automation layer.

The initial release focuses on a highly legible, touch-friendly calendar. Meals, lists, chores, and deeper logistics remain possible extensions after the calendar experience proves dependable in daily use.

**Core Value:** At a glance, every family member can reliably understand who is doing what and when.

### Constraints

- **Host platform**: The deliverable remains a Home Assistant custom card built with TypeScript and Lit — this preserves native dashboard, theme, authentication, and entity access.
- **Compatibility**: Existing non-wall configurations and all supported views must continue to work — the wall experience is opt-in until validated.
- **Source of truth**: Calendar events remain owned by the connected external calendars — the card does not invent a second calendar database.
- **Security**: No tokens, private household configuration, or direct Calendar Bridge credentials may enter dashboard config, fixtures, logs, or the repository.
- **Live safety**: No files under `/Volumes/config` change during implementation. A live pilot requires targeted backup, two independent Sonnet plan reviews, a configuration check where applicable, and explicit verification; if Sonnet is unavailable, Emiliano must approve any substitute.
- **Distribution**: The built `dist/moran-family-board-card.js` remains committed and HACS-compatible, and upstream attribution remains intact.
- **Quality**: `npm run format:check`, `npm run lint`, `npm test`, and `npm run build` must pass for every release candidate.
- **Privacy**: Public examples use generic people and entities only.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 5.x — card rendering, Home Assistant integration, editor, localization, and event-domain logic under `src/`.
- JavaScript ES modules — Rollup build configuration in `rollup.config.js`.
- HTML/CSS/JavaScript — standalone browser fixture in `dev/harness.html`.
- YAML — GitHub Actions under `.github/workflows/`.
- Markdown — product, installation, design, and planning documentation.

## Runtime

- Node.js; GitHub Actions uses Node 20 in `.github/workflows/ci.yml` and `.github/workflows/release.yml`.
- npm with committed `package-lock.json`; use `npm ci` for deterministic installs.
- Modern browser inside the Home Assistant frontend.
- Home Assistant 2024.1.0 or newer, declared in `hacs.json`.
- One self-contained ES module emitted to `dist/moran-family-board-card.js`.

## Frameworks

- Lit 3.x — reactive Web Component implementation and scoped styling.
- `custom-card-helpers` 1.9.x — Home Assistant frontend types and helper APIs.
- Vitest 1.6.x — pure event-domain unit tests in `src/events.test.ts`.
- Rollup 4.x — production bundle.
- TypeScript compiler — strict type checking via `npm run lint`.
- Prettier 3.x — formatting via `npm run format` and `npm run format:check`.
- Terser — production minification.

## Configuration

- `tsconfig.json` targets ES2021, uses bundler module resolution, enables decorators, and includes only `src/**/*.ts`.
- `rollup.config.js` uses `src/ha-family-board-card.ts` as the entry point and inlines the dynamically loaded editor.
- `.prettierrc.json` specifies 100-column lines, two spaces, double quotes, semicolons, and trailing commas.
- `hacs.json` declares the dashboard-card bundle filename and minimum Home Assistant version.
- `.github/workflows/release.yml` builds and attaches the bundle to published GitHub releases.
- The generated `dist/moran-family-board-card.js` is committed and is the HACS release artifact.

## Platform Requirements

- Any platform with Node.js 20-compatible tooling.
- A Chromium browser or Home Assistant test instance for rendered verification.
- Home Assistant dashboard with the module installed through HACS or `/config/www`.
- Browser support for custom elements, shadow DOM, Unicode property escapes, ResizeObserver, and pointer events.

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Use kebab-case TypeScript modules: `ha-family-board-card.ts`, `editor-i18n.ts`.
- Collocate unit tests with source using `*.test.ts`.
- Use uppercase durable planning/document filenames inside `.planning/`.
- Use camelCase for exported pure functions such as `routeEventToPeople` and `splitIntoSegments`.
- Prefix private component methods and mutable runtime fields with `_`, such as `_fetchEvents` and `_events`.
- Use action-oriented names for handlers: `_openEvent`, `_onDragMove`, `_togglePerson`.
- Use `_render<Name>` for view/template factories.
- Use PascalCase without an `I` prefix: `FamilyBoardConfig`, `RawEvent`, `DialogState`.
- Prefer interfaces for configuration and event-shaped objects.
- Use string unions for bounded UI states such as view and drag modes.

## Code Style

- Run Prettier using `.prettierrc.json`.
- Use two spaces, double quotes, semicolons, trailing commas, and a 100-character print width.
- Run `npm run format:check` before commit; use `npm run format` to fix source formatting.
- `npm run lint` means `tsc --noEmit`; there is no separate ESLint layer.
- Maintain strict TypeScript compatibility with the settings in `tsconfig.json`.
- Avoid broadening `any` usage. Existing `any` appears mainly at Home Assistant API boundaries.

## Import Organization

- Put external dependencies first, followed by relative project modules.
- Use named imports and exports.
- Use `import type` when an import exists only for TypeScript.
- Do not add path aliases without a repository-wide build and editor decision.
- Preserve direct module imports; no barrel files exist.

## Component Patterns

- Components extend `LitElement` and declare Home Assistant-provided properties with `@property`.
- Internal reactive fields use `@state`; non-rendering caches/timers stay plain private fields.
- Render with Lit `html` templates and return `nothing` for intentionally absent fragments.
- Keep styles in the component's static `css` block and prefer Home Assistant theme variables with fallbacks.
- Register custom elements defensively when the card may be loaded twice.
- The visual editor emits a bubbling `config-changed` event with a complete updated config.

## Error Handling

- Throw synchronously from `setConfig` for invalid required configuration.
- Catch network/mutation errors at their UI boundary and set an explicit error state.
- Degrade optional features, such as weather, without breaking the calendar.
- Invalid user-supplied regular expressions must return a non-match rather than throw.
- Do not log event titles, entity state payloads, credentials, or other household data.

## Comments and Documentation

- Explain non-obvious business behavior and browser/Home Assistant constraints, not obvious syntax.
- Use short TSDoc-style comments for exported domain helpers and public contracts.
- Document configuration additions in `README.en.md` and editor help text.
- Keep household names and examples generic in committed public documentation and fixtures.

## Function Design

- Prefer pure functions for calendar math, routing, and normalization so they can be unit tested.
- Use guard clauses for invalid or unsupported inputs.
- Keep configuration normalization close to `setConfig` or editor change handlers.
- Pass dates as `Date` objects inside domain logic and ISO strings only at API boundaries.
- Treat all-day end dates as exclusive.

## Module Design

- Prefer named exports; the bundle exports `FamilyBoardCard` and `autoDetectPersons`.
- Keep DOM-free logic outside the card component.
- New provider integrations require an interface boundary instead of direct fetch calls inside renderers.
- Avoid circular imports: the editor may import card types/helpers, but the card only dynamically imports the editor.

## UI Conventions

- Preserve text labels or initials wherever color carries person identity.
- Keep interactive touch targets usable on wall tablets.
- Support keyboard activation and visible focus for every clickable non-native element.
- Use localized date/time formatting and respect Home Assistant 12/24-hour preference.
- Respect `prefers-reduced-motion` for decorative transitions or animation.

## Git and Distribution

- Build `dist/moran-family-board-card.js` after any source change and commit the result.
- Preserve the upstream MIT license and `NOTICE.md` attribution.
- Keep upstream compatibility unless an explicitly documented Moran requirement requires divergence.
- Never commit Home Assistant tokens, Calendar Bridge credentials, private entity IDs, or live event content.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## Pattern Overview

- A single distributed ES module registers both the card and its editor.
- Home Assistant supplies state, authentication, locale, API access, and theme tokens.
- Calendar computations are partially isolated from DOM code for deterministic unit testing.
- All rendered views and most orchestration currently live in one card class.
- The card has no database or server process of its own.

## Layers

- Location: `src/ha-family-board-card.ts`.
- Purpose: configuration validation, lifecycle, API calls, capability detection, state management, interactions, view rendering, dialogs, and styles.
- Depends on: Lit, `custom-card-helpers`, `src/events.ts`, and `src/localize.ts`.
- Used by: Home Assistant dashboards and `dev/harness.html`.
- Location: `src/events.ts`.
- Purpose: shared-calendar routing, title normalization, raw event parsing, day segmentation, drag-time calculation, and overlap layout.
- Depends on: JavaScript date and collection primitives only.
- Used by: the card renderer and `src/events.test.ts`.
- Locations: `src/localize.ts` and `src/editor-i18n.ts`.
- Purpose: English/German labels plus locale-aware time, weekday, countdown, and week-range formatting.
- Depends on: browser `Intl` and Home Assistant locale preferences.
- Used by: the card and editor.
- Location: `src/editor.ts`.
- Purpose: graphical configuration, auto-detection, presets, person/calendar metadata, and `config-changed` events.
- Depends on: Lit, Home Assistant form elements, editor translations, and exported card types/helpers.
- Used by: Home Assistant's Lovelace card editor.
- Locations: `rollup.config.js`, `hacs.json`, `.github/workflows/`, and `dist/`.
- Purpose: typecheck, test, bundle, validate, and release one HACS-compatible module.

## Data Flow

## State Management

- Persistent settings live in Home Assistant Lovelace configuration.
- Reactive runtime state uses Lit `@state` properties in `FamilyBoardCard` and `FamilyBoardCardEditor`.
- Raw events, fetch keys, timer handles, and drag geometry use private instance fields.
- No global application state exists beyond custom-element registration and `window.customCards` metadata.

## Key Abstractions

- The public configuration contract for views, layout, filtering, display, calendars, and people.
- Defined in `src/ha-family-board-card.ts` and consumed by the card/editor.
- Represent a visual lane and its calendar/routing rules.
- Defined in `src/ha-family-board-card.ts` and `src/events.ts`.
- Successive representations for source occurrences, per-day display segments, and overlap geometry.
- Defined in `src/events.ts`.
- `_renderDay`, `_renderTimeline`, `_renderWeek`, `_renderMonth`, and `_renderAgenda` are private methods on the card class.
- They share normalized event state but own view-specific grouping and markup.

## Entry Points

- `src/ha-family-board-card.ts` — Rollup entry, card registration, card-picker metadata, and lazy editor import.
- `src/editor.ts` — editor registration, bundled through the dynamic import.
- `dev/harness.html` — browser-only development fixture with a small mocked `hass` contract.
- `dist/moran-family-board-card.js` — generated production entry loaded by Home Assistant/HACS.

## Error Handling

- `setConfig` throws for invalid card configuration so Home Assistant can display an error card.
- Calendar reads catch per-calendar failures; a total failure produces a card-level load error.
- Mutations catch failures and present inline dialog errors.
- Invalid user regex patterns return a non-match rather than breaking the board.
- Optional weather failures clear forecast state without taking down calendar rendering.

## Cross-Cutting Concerns

- Interactive events, person headers, navigation controls, and dialogs use focus/keyboard handlers and labels within `src/ha-family-board-card.ts`.
- Never hard-code user-facing card strings when an existing key belongs in `src/localize.ts` or `src/editor-i18n.ts`.
- Use Home Assistant CSS variables with safe fallbacks; keep person identity visible in text rather than color alone.
- Treat the browser bundle as public. Use only the authenticated `hass` object for Home Assistant operations, and never embed external credentials.

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

## Codex GSD Bridge

The global GSD skills are installed under `~/.claude/skills/gsd-*` with their shared runtime in
`~/.claude/gsd-core/`. They are not currently installed as Codex-native slash commands. In a Codex
session, read the matching `SKILL.md` and execute its referenced workflow and `gsd-tools.cjs`
commands directly.

For this project, use this sequence:

1. `gsd-discuss-phase` to resolve implementation choices and create phase context.
2. `gsd-ui-phase` for phases with a user-interface contract, especially Phases 1-4.
3. `gsd-plan-phase` to turn the approved phase context into executable plan files.
4. `gsd-execute-phase`, `gsd-verify-work`, and `gsd-code-review` for implementation and evidence.
5. `gsd-complete-milestone` only after every v1 requirement is verified.

The initial codebase map and project roadmap already exist under `.planning/`. Start at Phase 1;
do not rerun `gsd-new-project` unless the planning state is intentionally being rebuilt.
