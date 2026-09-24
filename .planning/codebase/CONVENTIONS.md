# Coding Conventions

**Analysis Date:** 2026-09-11

## Naming Patterns

**Files:**
- Use kebab-case TypeScript modules: `ha-family-board-card.ts`, `editor-i18n.ts`.
- Collocate unit tests with source using `*.test.ts`.
- Use uppercase durable planning/document filenames inside `.planning/`.

**Functions and methods:**
- Use camelCase for exported pure functions such as `routeEventToPeople` and `splitIntoSegments`.
- Prefix private component methods and mutable runtime fields with `_`, such as `_fetchEvents` and `_events`.
- Use action-oriented names for handlers: `_openEvent`, `_onDragMove`, `_togglePerson`.
- Use `_render<Name>` for view/template factories.

**Types:**
- Use PascalCase without an `I` prefix: `FamilyBoardConfig`, `RawEvent`, `DialogState`.
- Prefer interfaces for configuration and event-shaped objects.
- Use string unions for bounded UI states such as view and drag modes.

## Code Style

**Formatting:**
- Run Prettier using `.prettierrc.json`.
- Use two spaces, double quotes, semicolons, trailing commas, and a 100-character print width.
- Run `npm run format:check` before commit; use `npm run format` to fix source formatting.

**Type checking:**
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

---

*Convention analysis: 2026-09-11*
*Update when patterns change*
