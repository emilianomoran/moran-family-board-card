---
phase: 01-prove-the-foundation
fixed_at: 2026-09-11T08:28:15Z
review_path: .planning/phases/01-prove-the-foundation/01-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 01: Code Review Fix Report

**Fixed at:** 2026-09-11T08:28:15Z
**Source review:** `.planning/phases/01-prove-the-foundation/01-REVIEW.md`
**Iteration:** 1

**Summary:**

- Findings in scope: 4
- Fixed: 4
- Skipped: 0

## Fixed Issues

### CR-01: Wall mode does not apply the required touch and focus treatment to every button-like target

**Files modified:** `src/wall-shell.ts`, `src/ha-family-board-card.ts`, `dev/harness.html`, `dev/harness-check.mjs`, `package.json`, `dist/moran-family-board-card.js`
**Commit:** cc27832
**Applied fix:** Added one wall-scoped 48×48 interaction rule and accent focus treatment for native and ARIA button/tab targets, made month event chips keyboard-operable, and added a deterministic Chrome assertion that checks every focusable target in Day, Timeline, Week, Month, and Agenda for size, focus visibility, and native or explicit keyboard activation.

### WR-01: The wall current-date action does not use the contracted label or accessible name

**Files modified:** `src/ha-family-board-card.ts`, `src/localize.ts`, `dev/harness.html`, `dist/moran-family-board-card.js`
**Commit:** fc241d4
**Applied fix:** Added localized `show_today` copy and made the wall Day navigation render visible `Today` with accessible name `Show today`, while legacy, Timeline, Week, and Agenda retain the week-range action.

### WR-02: The synthetic harness detects a timezone mismatch but still renders non-deterministic output

**Files modified:** `dev/harness.html`
**Commit:** 6b0e68c
**Applied fix:** Made timezone mismatch fail closed before the card is rendered and required the checked-in harness runner to prove both wall and legacy scenarios at 1920×1080 in `America/Chicago`.

### WR-03: `100vh` sizes the card to the browser viewport rather than the available Home Assistant panel

**Files modified:** `src/wall-shell.ts`, `dev/harness.html`, `dev/harness-check.mjs`, `dist/moran-family-board-card.js`
**Commit:** 2c00449
**Applied fix:** Replaced viewport sizing with a 100%-height container contract and zero-min-height flex chain, then added a 64px synthetic host-chrome fixture and browser assertion that rejects outer-page or parent-panel overflow.

## Verification

- `npm run format:check`: passed
- `npm run lint`: passed
- `npm test`: 39 tests passed
- `npm run build`: passed; committed distribution bundle remains source-generated
- `npm run test:harness`: passed for wall Day, Timeline, Week, Month, Agenda, and legacy at 1920×1080 in `America/Chicago`
- Explicit privacy and live-path scans across the changed source, harness, package, and bundle files: passed
- `git diff --check`: passed

---

_Fixed: 2026-09-11T08:28:15Z_
_Fixer: Codex (gsd-code-fixer)_
_Iteration: 1_
