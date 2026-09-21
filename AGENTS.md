# Current product documentation

Start with [HANDOFF.md](HANDOFF.md), then the [documentation index](docs/README.md).
The [product brief](docs/PRODUCT.md), [backlog](docs/BACKLOG.md),
[development guide](docs/DEVELOPMENT.md), [architecture](docs/ARCHITECTURE.md),
[decisions](docs/DECISIONS.md), [status](docs/STATUS.md),
[research](docs/research/README.md), and [operations boundary](docs/OPERATIONS.md)
own the current product record.

## Fresh-agent rules

- Continue the current `feature/moran-foundation` branch unless the task says otherwise.
  Check branch, remotes and dirty files before editing. Do not start from upstream `main`
  and mistake it for the current Moran product. Preserve unrelated local work.
- Keep one root handoff and one current backlog. Refresh them at material milestones;
  do not scatter a new continuation file into each session or require previous chat access.
- This is a Home Assistant Lit card, not a React rewrite. Calendar Bridge is not a card
  runtime dependency. Meals and lists remain optional later modules.
- The user confirmed HA-app lock/reopen refresh and waived the provider timing test.
  Do not reopen that test as a gate or describe unmeasured latency as proven.
- The old 68/32 operations rail and portrait Agenda preference are historical concepts,
  not approved implementation requirements. Follow the current product brief instead.
- The sample harness freezes its clock. Build `dist/` and reload before evaluating code
  changes. Distinguish sample harness, optional live proxy, and deployed HA evidence.
- For UI changes, verify desktop and narrow card containers, not just viewport width.
  Preserve the user's annotation surface where possible and reset temporary preview changes.
- Documentation-only work does not require a new app version or HA deployment. Missing
  private HA access does not block local implementation or synthetic verification.

- Record material conversation outcomes, decisions, corrections, and open proposals in
  this repo during the same work session. Do not leave product facts only in chat or
  the private Home Assistant workspace.
- Distinguish user decisions from agent recommendations, implemented from planned work,
  and local commits from pushed changes or releases. Use absolute dates and evidence.
- Use **Status tiles** for the top per-person current/next chips. Keep existing config
  names compatible unless a migration is explicitly in scope.
- Keep transcripts, private appointments, household configuration, credentials,
  private screenshots, and deployment backups out of the public repo. Use generic
  examples and sanitized outcomes. Private HA operational records stay in their workspace.
- Update owning docs and add links rather than maintaining conflicting product summaries.
  Retain superseded decisions as marked history. Documentation is not an approval gate.
- `.planning/` and old concept/fork plans are historical. Their GSD phases, reviewer-model
  requirements, and gates do not override the direct workflow or current docs.

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
- **Live safety**: Follow the Home Assistant workspace change protocol for live deployment: targeted backup, a configuration check where applicable, and verification. Independent reviews are optional. Local implementation and read-only validation proceed directly.
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
- Vitest 1.6.x — unit tests in `src/*.test.ts` covering config, sources, events, navigation, preferences, details and localization.
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

- Node.js 20-compatible tooling for build/unit checks; Node 22+ for the compiled-browser harness's native WebSocket. See the development guide.
- A Chromium browser or Home Assistant test instance for rendered verification.
- Home Assistant dashboard with the module installed through HACS or `/config/www`.
- Browser support for custom elements, shadow DOM, Unicode property escapes, ResizeObserver, and pointer events.

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Use kebab-case TypeScript modules: `ha-family-board-card.ts`, `editor-i18n.ts`.
- Collocate unit tests with source using `*.test.ts`.
- Put current product documentation in `docs/`; `.planning/` is a historical archive.
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

- User direction, 2026-09-21: at each next verified milestone, commit and push the
  completed work to the current working branch on the personal origin remote.
  Include updated product docs and the built bundle when source changes. Review the
  outgoing diff for private data and unrelated changes; verify the push succeeded.
  This authorizes ordinary milestone pushes, not force-pushes, merges to main,
  release tags, or GitHub/HACS publication. Report a real failure without claiming success.
- Build `dist/moran-family-board-card.js` after any source change and commit the result.
- Preserve the upstream MIT license and `NOTICE.md` attribution.
- Keep upstream compatibility unless an explicitly documented Moran requirement requires divergence.
- Never commit Home Assistant tokens, Calendar Bridge credentials, private entity IDs, or live event content.

<!-- GSD:conventions-end -->

## Architecture reference

Use [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the current module map, runtime
flow and invariants. Configuration lives in `src/config.ts`; source reads, navigation,
preferences and wall styles have dedicated modules. Do not restore the old monolithic
module map from `.planning/codebase/` or duplicate it here.

<!-- GSD:skills-start source:skills/ -->

## Project Skills

Optional environment skills are listed in [HANDOFF.md](HANDOFF.md). The repository's
[development guide](docs/DEVELOPMENT.md) is the portable fallback. No GSD installation,
particular plugin, reviewer model, or private skill path is a prerequisite for contributing.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## Direct Development Workflow

Emiliano retired the GSD workflow on 2026-09-15. Continue authorized implementation,
debugging, and verification directly. Do not require GSD commands, phase gates, a
particular reviewer model, or repeated confirmation for routine implementation.
Existing `.planning/` files remain historical context, not execution requirements.
<!-- GSD:workflow-end -->
