---
phase: 01-prove-the-foundation
plan: 03
subsystem: ui
tags: [typescript, lit, home-assistant, wall-display, visual-verification]

requires:
  - phase: 01-prove-the-foundation
    provides: Exact wall-layout normalization, lossless shared config, and authenticated calendar-read boundary
provides:
  - Opt-in calendar-only wall shell reusing the existing view, event, and interaction pipeline
  - Injectable display clock for deterministic calendar rendering without a dashboard key
  - Generic fixed-time production-bundle harness for equivalent wall and legacy scenarios
  - Reproducible 1920x1080 Chrome evidence for both presentation paths
affects: [02-family-at-a-glance-day, wall-layout, visual-testing, public-examples]

tech-stack:
  added: []
  patterns:
    - Presentation-only wall composition around the existing Lit renderer
    - Injectable non-persisted display clock with a system-clock default
    - Query-selected deterministic browser scenarios against the compiled bundle

key-files:
  created:
    - src/wall-shell.ts
  modified:
    - src/ha-family-board-card.ts
    - src/localize.ts
    - dev/harness.html
    - README.en.md
    - dist/moran-family-board-card.js

key-decisions:
  - "The wall shell remains presentation-only and receives existing navigation, focus, and active-view fragments rather than duplicating controller or calendar logic."
  - "Only the schedule board scrolls in wall mode; the 72px product header and two 56px calendar toolbars remain fixed within one continuous white canvas."
  - "Browser evidence uses the fixed instant 2026-02-18 15:32 America/Chicago with generic fixture identities and no live Home Assistant access."

patterns-established:
  - "Wall isolation: every new token and selector is rooted beneath .moran-wall-shell, while absent or unknown layout values keep the legacy ha-card root."
  - "Deterministic display time: runtime calendar reads call a cloning _now() helper backed by a non-dashboard nowProvider seam."

requirements-completed: [FOUND-02, FOUND-03]

duration: 15 min
completed: 2026-09-11
---

# Phase 1 Plan 3: Opt-in Wall Calendar Proof Summary

**One compiled Lit card now renders either a calendar-only full-panel wall surface or the unchanged
legacy shell, proven with fixed generic data at 1920x1080.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-09-11T07:46:37Z
- **Completed:** 2026-09-11T08:02:02Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Added an exact opt-in wall branch with a restrained 72px Family Board/Calendar header, existing
  functional view navigation, existing Day controls, and the inherited event grid on one white
  canvas without a nested `ha-card`.
- Preserved the legacy branch and its defaults while sharing the same active renderer, calendar
  adapter, routing model, date state, dialog, and interactions across both shells.
- Added a non-persisted display-clock seam and a fixed generic harness covering all-day, timed,
  overlapping, shared, unmatched, and current-time-spanning events across four lanes.
- Rebuilt the HACS bundle and documented the public `layout: wall` option without adding a
  dependency, framework, datastore, credential, or test-only Lovelace key.

## Task Commits

Each task was committed atomically:

1. **Task 1: Compose the opt-in full-panel wall Day shell** - `e3b2703` (feat)
2. **Task 2: Prove wall and legacy paths in the deterministic production-bundle harness** -
   `7d3d58c` (test)

**Plan metadata:** recorded by the commit containing this summary.

## Files Created/Modified

- `src/wall-shell.ts` - Presentation-only Lit shell and fully rooted wall tokens/styles.
- `src/ha-family-board-card.ts` - Exact wall branch, shared render helpers, and cloned display clock.
- `src/localize.ts` - Dedicated wall title and Calendar identity plus injectable countdown time.
- `src/events.ts` - Generic public routing example.
- `src/events.test.ts` - Behavior-equivalent routing coverage with generic fixture identities.
- `src/editor-i18n.ts` - Generic prefix-stripping examples in both editor locales.
- `dev/harness.html` - Fixed wall/legacy scenarios using compiled code and mocked HA-shaped reads.
- `README.en.md` - Generic examples and opt-in wall compatibility guidance.
- `dist/moran-family-board-card.js` - Rollup-generated distribution bundle matching source.

## Decisions Made

- Keep the new module a presentation boundary only. Configuration, authenticated reads, event
  routing, date state, mutations, dialogs, and active-view selection stay in their existing owners.
- Make display time injectable on the card instance rather than serializable in Lovelace, so
  deterministic evidence cannot introduce a production dashboard setting.
- Treat exact `layout: wall` as the only wall selector and render no wall root or wall token value in
  the legacy scenario.

## Verification Evidence

### Automated gate

- `npm run format:check && npm run lint && npm test && npm run build` passed after the final source
  changes; all 39 tests passed across configuration, calendar-source, and event-domain suites.
- `git diff --check` passed, `package.json` and `package-lock.json` remained unchanged, and Rollup
  regenerated `dist/moran-family-board-card.js` from source.
- Source checks found the required wall exports, exact layout normalization, display-clock seam,
  localized `Family Board` and `Calendar` values, and no `unsafeHTML` or `innerHTML` in the wall
  module.

### Deterministic Chrome run

- **Browser:** Google Chrome 152.0.7977.84
- **Viewport:** 1920x1080 CSS pixels, device scale factor 1
- **Timezone:** `America/Chicago`; the development mismatch warning remained hidden
- **Fixed instant:** Wednesday, 2026-02-18 at 15:32 CST
- **Wall URL:** `http://127.0.0.1:4173/dev/harness.html?scenario=wall`
- **Legacy URL:** `http://127.0.0.1:4173/dev/harness.html?scenario=legacy`
- **Wall screenshot:** `/tmp/moran-family-board-phase-01/wall-1920x1080.png`
- **Legacy screenshot:** `/tmp/moran-family-board-phase-01/legacy-1920x1080.png`

Chrome DevTools measurements confirmed the wall root was exactly 1920x1080, the product header was
72px, both calendar toolbar rows were 56px, all four person headers were 80px, and every wall button
was at least 48x48px. The schedule board used `overflow: auto`, had 896px of visible height and
1045px of scroll content, and owned the only required vertical overflow. Its scroll width equaled
its 1920px client width, so there was no horizontal clipping. The wall shell used hidden outer
overflow, a white canvas, and no header shadow or nested `ha-card`.

Existing interactions were also exercised in both scenarios: Day switched to Week and back, next
week changed `Feb 16 – Feb 22` to `Feb 23 – Mar 1`, and previous week restored the original range.
The wall and person-header controls exposed visible 2px focus outlines. Wall normalized to `wall`
and rendered one wall root with zero `ha-card` roots; Legacy omitted the raw layout key, normalized
to `default`, rendered one `ha-card` with zero wall roots, and exposed no wall token value.

### UI-spec visual acceptance checklist

- **PASS — full-panel canvas:** Wall fills the exact viewport with one continuous white calendar.
- **PASS — calendar-only scope:** No operations rail, tasks, lists, meals, shopping, dinner,
  weather, deferred module, or inert placeholder appears.
- **PASS — required identity and content:** Family Board, Calendar, active Day, Today, week controls,
  weekday tabs, four named lanes, time axis, all events, and the red 3:32 PM marker are visible.
- **PASS — overflow and elevation:** The schedule owns vertical scrolling; the outer shell is flat
  and does not resemble a nested raised card.
- **PASS — touch and focus:** All wall buttons meet the 48px target and buttons/person headers show
  visible keyboard focus without requiring hover.
- **PASS — non-color identity:** Person names, initials/status text, event titles, event times, and
  lane placement remain readable independently of color.
- **PASS — legacy compatibility:** Legacy omits `layout`, retains its pre-wall card appearance, and
  passes the same view/date interaction checks.
- **PASS — style isolation:** No wall root or resolved wall token appears in Legacy.
- **PASS — deterministic privacy:** Both final images were visually inspected and contain only
  Avery, Jordan, Casey, Household, generic places/event copy, and fixture-backed data.

Both PNGs were re-read after the final compiled run and confirmed as 1920x1080. Their filenames and
embedded strings passed the prescribed private-name, entity-ID, credential, and key-pattern scan.
The completed Phase 1 explicit source/evidence privacy gate also passed, including all three
execution summaries; the separate implementation scan found no live Home Assistant configuration
path. No live Home Assistant file, dashboard, entity, calendar, API, or credential was accessed or
changed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added focus visibility for interactive person headers**
- **Found during:** Task 2 (Chrome style and interaction verification)
- **Issue:** Person headers already supported keyboard activation but were missing from the new
  wall-scoped focus selector.
- **Fix:** Included `.phead:focus-visible` in the wall focus treatment.
- **Files modified:** `src/wall-shell.ts`, `dist/moran-family-board-card.js`
- **Verification:** Chrome computed a visible solid 2px outline for the focused first person header.
- **Committed in:** `7d3d58c` (part of Task 2)

---

**Total deviations:** 1 auto-fixed bug
**Impact on plan:** The correction closes the required keyboard-focus state without expanding
scope or changing legacy styling.

## Issues Encountered

- Chrome's extension-backed visible-tab debugger was unavailable while the Mac UI was locked.
  Verification continued through the installed Chrome binary and its DevTools Protocol on
  loopback, which supplied exact viewport emulation, rendered screenshots, computed layout/style
  evidence, and interaction execution without touching a live dashboard.

## User Setup Required

None - no external service or live Home Assistant configuration is required.

## Next Phase Readiness

- Phase 2 can refine the proven wall Day canvas, shared ownership, now/next interpretation, and
  filtering without changing the selected Lit/Home Assistant architecture.
- The deterministic generic production-bundle harness is ready to grow into browser automation.
- Legacy defaults and interactions remain isolated from wall-only markup and tokens.

## Self-Check: PASSED

- Both task commits exist on `feature/moran-foundation`.
- All implementation files, the rebuilt bundle, completed summary, and both uncommitted `/tmp`
  screenshots exist.
- FOUND-02 and FOUND-03 gates pass with exact 1920x1080 wall/legacy evidence and without live Home
  Assistant access.

---
*Phase: 01-prove-the-foundation*
*Completed: 2026-09-11*
