---
phase: 01-prove-the-foundation
fixed_at: 2026-09-11T08:44:28Z
review_path: .planning/phases/01-prove-the-foundation/01-REVIEW.md
iteration: 2
findings_in_scope: 1
fixed: 1
skipped: 0
status: all_fixed
---

# Phase 01: Code Review Fix Report

**Fixed at:** 2026-09-11T08:44:28Z
**Source review:** `.planning/phases/01-prove-the-foundation/01-REVIEW.md`
**Iteration:** 2

**Summary:**

- Findings in scope: 1
- Fixed: 1
- Skipped: 0

## Fixed Issues

### WR-01: Keyboard activation of a person badge also toggles its parent person lane

**Files modified:** `src/ha-family-board-card.ts`, `dev/harness.html`, `dist/moran-family-board-card.js`
**Commit:** cb8dc47
**Applied fix:** Stopped Enter and Space propagation from nested person badges before opening
Home Assistant entity details. Added a generic wall-only sensor badge and deterministic browser
assertions proving that Enter, Space, and click activate badge details without toggling the parent
lane, while the same parent-header inputs toggle the lane without opening badge details.

## Verification

- `npm run format:check`: passed
- `npx prettier --check dev/harness.html`: passed
- `npm run lint`: passed
- `npm test`: 39 tests passed
- `npm run build`: passed; `dist/moran-family-board-card.js` rebuilt from source
- `npm run test:harness`: passed for wall Day, Timeline, Week, Month, Agenda, and legacy at
  1920×1080 in `America/Chicago`; wall Day included independent badge/header activation checks
- Explicit credential, live Home Assistant path, and household-name scans across the changed source,
  harness, and distribution bundle: passed
- `git diff --check`: passed

---

_Fixed: 2026-09-11T08:44:28Z_
_Fixer: Codex (gsd-code-fixer)_
_Iteration: 2_
