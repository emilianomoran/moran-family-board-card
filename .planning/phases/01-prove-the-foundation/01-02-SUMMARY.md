---
phase: 01-prove-the-foundation
plan: 02
subsystem: architecture
tags: [typescript, lit, home-assistant, configuration, vitest]

requires:
  - phase: 01-prove-the-foundation
    provides: Accepted Moran TypeScript/Lit implementation-base decision and provenance policy
provides:
  - Shared card/editor configuration contract with exact wall-layout opt-in
  - Immutable, lossless layout serialization for the visual editor
  - Typed authenticated Home Assistant calendar-read boundary
affects: [01-03, wall-layout, calendar-data, visual-editor]

tech-stack:
  added: []
  patterns:
    - Preserve raw Lovelace config while deriving normalized runtime values
    - Keep authenticated Home Assistant reads behind narrow typed adapters

key-files:
  created:
    - src/config.ts
    - src/config.test.ts
    - src/calendar-source.ts
    - src/calendar-source.test.ts
  modified:
    - src/ha-family-board-card.ts
    - src/editor.ts
    - src/editor-i18n.ts
    - dist/moran-family-board-card.js

key-decisions:
  - "Only exact layout: wall opts into wall mode; Default is represented by an absent layout key."
  - "The calendar adapter owns only the authenticated GET; the controller retains fan-out, routing, parsing, deduplication, loading, and error semantics."

patterns-established:
  - "Raw plus normalized config: retain the complete dashboard object and normalize only at consumption boundaries."
  - "Narrow HA adapter: accept the supplied Home Assistant client and pass payloads and rejections through unchanged."

requirements-completed: [FOUND-02, FOUND-03]

duration: 8 min
completed: 2026-09-11
---

# Phase 1 Plan 2: Shared Configuration and Calendar Boundary Summary

**One shared lossless configuration contract now controls exact wall opt-in, while a typed
Home Assistant adapter isolates calendar reads without changing controller behavior.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-09-11T07:34:20Z
- **Completed:** 2026-09-11T07:42:22Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Consolidated the complete card and editor configuration shapes, view constants, layout
  normalization, and immutable serialization in one shared module.
- Added a localized Layout selector whose Default choice removes the key and whose Wall choice
  writes exact `layout: wall` without losing unknown keys or nested person/calendar metadata.
- Extracted the existing authenticated calendar GET into a typed pass-through adapter while
  preserving the controller's unique-calendar fan-out and all event-domain behavior.
- Rebuilt the checked-in distribution bundle from the reviewed TypeScript source.

## Task Commits

Each task was committed atomically; TDD work records the contract before its implementation:

1. **Task 1: Lock the configuration compatibility contract with failing tests** - `1f2d79d`
   (test)
2. **Task 2: Extract shared config and wire the lossless editor Layout option** - `770e4ba`
   (feat)
3. **Task 3 RED: Define the authenticated calendar-read boundary** - `b6a7dc6` (test)
4. **Task 3 GREEN: Extract and prove the authenticated calendar read seam** - `81958ec`
   (feat)

**Plan metadata:** recorded by the commit containing this summary.

## Files Created/Modified

- `src/config.ts` - Complete shared public configuration contract, exact layout normalizer, and
  immutable layout serializer.
- `src/config.test.ts` - Exact opt-in, Default deletion, non-mutation, and lossless round-trip
  coverage.
- `src/calendar-source.ts` - Typed single-calendar Home Assistant GET boundary.
- `src/calendar-source.test.ts` - Exact method/path encoding, payload identity, and rejection
  identity coverage.
- `src/ha-family-board-card.ts` - Shared config imports, normalized layout state, and delegated
  calendar reads.
- `src/editor.ts` - Shared config imports and lossless Layout selector serialization.
- `src/editor-i18n.ts` - English contract copy and concise German Layout translations.
- `dist/moran-family-board-card.js` - Rollup-generated distribution bundle matching source.

## Decisions Made

- Preserve the raw Lovelace configuration object and derive normalized layout state separately;
  this prevents optional defaults or future keys from being written back accidentally.
- Represent Default by omitting `layout`, so all existing configurations remain on the legacy
  path and only exact `wall` opts in.
- Keep the adapter deliberately narrower than a repository or service layer: it constructs one
  authenticated request and otherwise preserves the payload and rejection unchanged.

## Verification Evidence

- `npm run format:check && npm run lint && npm test && npm run build && git diff --check` passed.
- The full suite passed 39 tests across config compatibility, calendar-source behavior, and the
  unchanged event-domain suite.
- Focused tests proved one authenticated GET with percent-encoded ISO bounds, payload identity,
  original rejection identity, exact wall opt-in, immutable Default deletion, and unknown-key
  preservation.
- `src/events.ts`, `package.json`, `package-lock.json`, and `dev/harness.html` are unchanged from
  the pre-plan commit; no dependency or event-domain rewrite was introduced.
- Source checks confirmed only the Moran card/editor custom-element registrations remain and the
  adapter contains no direct fetch, credential, server, database, retry, or stale-data model.
- A clean rebuild left the committed distribution bundle unchanged.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Both RED failures were the expected missing-module failures before implementation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 01-03 can use the normalized wall discriminator and authenticated calendar port to compose
  the opt-in full-panel day slice.
- Existing configurations, registrations, event-domain behavior, and the Home Assistant-only
  authentication boundary remain intact.

## Self-Check: PASSED

- All four task commits exist on `feature/moran-foundation`.
- All four created source/test files and the regenerated distribution bundle exist.
- FOUND-02 and FOUND-03 verification evidence passes without live Home Assistant access.

---
*Phase: 01-prove-the-foundation*
*Completed: 2026-09-11*
