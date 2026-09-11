---
phase: 01-prove-the-foundation
reviewed: 2026-09-11T08:11:34Z
depth: standard
files_reviewed: 13
files_reviewed_list:
  - README.en.md
  - dev/harness.html
  - dist/moran-family-board-card.js
  - docs/adr/0001-implementation-base.md
  - src/calendar-source.test.ts
  - src/calendar-source.ts
  - src/config.test.ts
  - src/config.ts
  - src/editor-i18n.ts
  - src/editor.ts
  - src/ha-family-board-card.ts
  - src/localize.ts
  - src/wall-shell.ts
findings:
  critical: 1
  warning: 3
  info: 0
  total: 4
status: issues_found
---

# Phase 01 Code Review

## Narrative Findings (AI Reviewer)

The Phase 01 architecture is appropriately incremental: exact `layout: wall` opt-in is shared by
the card and editor, the legacy `ha-card` branch remains separate, calendar reads still use the
authenticated Home Assistant client, and the wall module is presentation-only. Unknown config
keys survive the normal editor merge, the clock seam covers the calendar display calculations used
by the harness, and no live household data or credentials appear in the reviewed fixtures.

`npm run format:check`, `npm run lint`, and all 39 Vitest tests pass. A clean Rollup build written to
a temporary path has the same SHA-256 digest as `dist/moran-family-board-card.js`, so the committed
bundle is consistent with source. The remaining issues are in the wall interaction contract,
current-date copy, embedding height, and harness timezone reproducibility.

## Critical Issues

### 1. Wall mode does not apply the required touch and focus treatment to every button-like target

**Files:** `src/wall-shell.ts:275`, `src/wall-shell.ts:326`,
`src/ha-family-board-card.ts:1377`, `src/ha-family-board-card.ts:1431`

The Phase 01 interaction contract requires every wall-mode button or button-like target to be at
least 48x48 px and to receive the 2 px accent focus outline. The generic acceptance fixture itself
renders an all-day event as a focusable `role="button"`, but the wall rule gives `.adchip` a
`min-height` of only 32 px. The focus selector is also an allow-list containing only buttons,
`.phead`, `.event`, `.wchip`, and `.adchip`. Other existing focusable button-like elements that can
be mounted in the wall shell, including `.band`, `.pbadge`, `.tlperson`, `.tlbar`, `.wphead`,
`.wday`, `.agenda-row`, and `.mcell`, receive no visible focus replacement; month `.mchip` event
actions are not keyboard-focusable at all. This means the implementation and the summary's touch
and focus PASS do not cover the full contracted interaction surface.

**Required fix:** Define one wall-scoped interaction treatment for every interactive element that
can be rendered under `.moran-wall-shell`, including a 48 px hit target and the contracted focus
outline. Prefer native buttons where practical; otherwise keep the existing Enter/Space handlers
and explicitly include every `[role="button"]`/tab target. Add a browser assertion that traverses
all focusable targets in both Day and each reachable configured view and checks target size,
keyboard activation, and computed focus visibility.

## Warnings

### 1. The wall current-date action does not use the contracted label or accessible name

**File:** `src/ha-family-board-card.ts:1273`

`_weekNav()` renders the middle action with the current week range and no explicit accessible name,
even though activating it resets both the week and selected day to today. In the wall Day toolbar
this is the dedicated current-date action, for which the UI contract specifies visible `Today` and
accessible `Show today`. The separate `Today` text at the left is not actionable and therefore does
not satisfy that CTA contract.

**Suggested fix:** Let the wall Day shell request a wall-specific `_weekNav()` variant that renders
localized `Today` with `aria-label="Show today"`, while retaining the week-range button unchanged
for the legacy and Week presentations. Keep localized date context visible elsewhere in the Day
toolbar.

### 2. The synthetic harness detects a timezone mismatch but still renders non-deterministic output

**File:** `dev/harness.html:73`

The fixed instant and event offsets are stable, but the card uses local `Date` getters and local
`Intl` formatting. When the browser is not in `America/Chicago`, the harness only overlays a warning
and continues rendering a different selected day, clock time, and potentially event placement.
Consequently the public harness is not independently reproducible in the fixed test timezone; the
successful evidence run depended on an external DevTools timezone override that is not part of the
checked-in harness workflow.

**Suggested fix:** Check in a deterministic browser-test launcher/configuration that sets the
timezone and 1920x1080 viewport, or make timezone mismatch fail closed instead of producing usable-
looking evidence. Exercise both `scenario=legacy` and `scenario=wall` through that runner.

### 3. `100vh` sizes the card to the browser viewport rather than the available Home Assistant panel

**File:** `src/wall-shell.ts:59`

The wall root is unconditionally `height: 100vh`. When Home Assistant chrome or another containing
panel consumes vertical space, the available card area is shorter than the viewport; the wall root
then extends past its parent despite the contract saying it fills the available panel and keeps
overflow inside the schedule. The standalone harness cannot expose this integration case because
its parent starts at the viewport origin and is itself `min-height: 100vh`.

**Suggested fix:** Size the wall shell from its containing panel (`height: 100%` with a verified
height chain, or a host-provided available-height/custom-property strategy) and retain the schedule
as the sole scrolling flex child. Add a fixture with nonzero chrome above the card so outer-page
overflow is caught without accessing live Home Assistant.
