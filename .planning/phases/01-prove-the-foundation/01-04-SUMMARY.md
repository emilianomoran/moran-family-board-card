---
phase: 01-prove-the-foundation
plan: 04
subsystem: ui
tags: [typescript, lit, css-grid, chrome-devtools, visual-regression]

requires:
  - phase: 01-prove-the-foundation
    provides: Opt-in wall shell, deterministic production-bundle harness, and legacy regression path
provides:
  - Wall-scoped square avatar geometry inside the existing 80px Day person header
  - Dedicated avatar, text, and optional-badge header tracks with bounded overflow
  - Production-bundle browser enforcement for wall and legacy avatar baselines
affects: [02-family-at-a-glance-day, wall-layout, visual-testing, legacy-compatibility]

tech-stack:
  added: []
  patterns:
    - Wall-only CSS geometry overrides rooted beneath the opt-in shell
    - Scenario-specific DOMRect evidence required by the headless runner

key-files:
  created:
    - .planning/phases/01-prove-the-foundation/01-04-SUMMARY.md
  modified:
    - src/wall-shell.ts
    - dev/harness.html
    - dev/harness-check.mjs
    - dist/moran-family-board-card.js

key-decisions:
  - "Keep square-avatar and header-grid geometry entirely beneath .moran-wall-shell; the shared legacy avatar rule remains untouched."
  - "Require scenario-specific geometry markers from measured production-bundle DOMRects before the headless runner can report success."

patterns-established:
  - "Wall person-header grid: fixed avatar track, minmax(0, 1fr) ellipsized identity track, and collapsing optional-badge track."
  - "Geometry evidence: wall and legacy scenarios publish distinct markers that the outer Chrome runner independently requires."

requirements-completed: [FOUND-02]

duration: 3 min
completed: 2026-09-11
---

# Phase 1 Plan 4: Wall Avatar Geometry Gap Closure Summary

**Wall Day avatars now remain true 40px circles inside contained 80px headers, while the same
compiled card preserves the legacy 34px avatar baseline.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-09-11T14:29:26Z
- **Completed:** 2026-09-11T14:32:41Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Replaced the constrained wall header's vertical child stack with explicit avatar, identity, and
  optional-badge grid tracks without changing its 80px outer height.
- Made only wall Day person-header avatars intrinsically square and non-shrinking; the shared
  avatar style and every legacy/view-specific size remain unchanged.
- Extended the compiled-bundle browser harness to fail on distorted or missing avatars, header
  overflow, a missing fixture badge, a sub-48px badge, or absent scenario evidence.
- Rebuilt the HACS distribution bundle with the existing locked Rollup command and no dependency
  changes.

## Task Commits

Each implementation task was committed atomically:

1. **Task 1: Preserve square avatars and fit the 80px wall person header** - `3dcda17` (fix)
2. **Task 2: Enforce wall and legacy avatar geometry in the compiled browser harness** -
   `82cbf42` (test)
3. **Task 3: Record closure evidence and enforce the final privacy gate** - recorded by the commit
   containing this summary.

## Files Created/Modified

- `src/wall-shell.ts` - Wall-rooted square avatar geometry and compact three-track person header.
- `dev/harness.html` - DOMRect assertions for avatar size, header containment, and badge/no-badge
  fixtures.
- `dev/harness-check.mjs` - Required wall and legacy geometry markers in the loopback Chrome run.
- `dist/moran-family-board-card.js` - Rollup-generated HACS bundle containing the wall fix.
- `.planning/phases/01-prove-the-foundation/01-04-SUMMARY.md` - UAT gap-closure evidence.

## Decisions Made

- Preserve the shared `.avatar` rule verbatim and scope the square/non-shrinking invariant to a
  direct Day person-header avatar inside `.moran-wall-shell`.
- Use a three-column grid only for visible wall headers. An absent badge naturally collapses the
  third track, while an off header keeps the inherited 48px lane and centers its sole avatar.
- Treat measured geometry as part of each scenario's success contract, not optional diagnostic
  text after a nominal browser pass.

## Verification Evidence

### Quality and production bundle

- `npm run format:check && npm run lint && npm test && npm run build && npm run test:harness`
  passed in order.
- TypeScript compiled without errors and all 39 Vitest checks passed across the configuration,
  calendar-source, and event-domain suites.
- `npm run build` regenerated `dist/moran-family-board-card.js` through `rollup -c`; the bundle was
  not edited directly.
- `package.json` and `package-lock.json` are unchanged from the plan's starting commit.
- `src/ha-family-board-card.ts` is unchanged, preserving the shared avatar declaration, markup,
  calendar behavior, configuration branch, and legacy interaction path.

### Deterministic Chrome geometry

- **Browser:** installed Google Chrome headless binary through the DevTools Protocol.
- **Viewport:** 1920x1080 CSS pixels at device scale factor 1.
- **Timezone:** `America/Chicago`.
- **Wall marker:** `avatar-geometry: 4x40x40`.
- **Legacy marker:** `avatar-geometry: 4x34x34`.
- All four visible wall person headers measured 80px high and passed both horizontal and vertical
  client/scroll containment assertions.
- The first wall header exercised the optional-badge path; its badge measured 57.90625x48px and
  remained independently operable by pointer, Enter, and Space without toggling the parent.
- The other three wall headers exercised the no-badge path without reserving a visible badge
  surface or distorting their avatars.
- All five wall views retained the existing 48px target and computed-focus checks, and legacy
  retained its existing card root.

### Privacy and live safety

- After this completed summary existed, the required denylist scan passed across both relevant
  source files, both harness files, the generated bundle, and this summary.
- The separate implementation-only assertion found no reference to `/Volumes/config`.
- No live Home Assistant file, dashboard, entity, API, calendar, or credential was read or changed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service or live Home Assistant configuration is required.

## Next Phase Readiness

- The sole diagnosed Phase 1 visual gap is closed and reproducibly enforced in the compiled wall
  and legacy paths.
- Phase 1 still awaits the user's repeat visual UAT before it can be marked verified.
- Phase 2 can build the final family-at-a-glance hierarchy on stable wall person-header geometry.

## Self-Check: PASSED

- Both task commits exist on `feature/moran-foundation`.
- All modified implementation, harness, bundle, and summary files exist.
- The complete quality, geometry, build, manifest, privacy, and live-boundary gates pass.

---
*Phase: 01-prove-the-foundation*
*Completed: 2026-09-11*
