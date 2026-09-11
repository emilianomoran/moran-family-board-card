---
status: testing
phase: 01-prove-the-foundation
source: [01-VERIFICATION.md]
started: 2026-09-11T09:11:15.165Z
updated: 2026-09-11T14:53:30Z
---

## Current Test

number: 2
name: Visually re-check the corrected person headers
expected: |
  All four wall avatars look circular; the first header's name, status, and badge fit cleanly inside the 80px row; the other three headers are undistorted; legacy retains circular 34px avatars and its familiar card shell.
awaiting: user response

## Tests

### 1. Review the eight ADR evidence rows against both pinned source commits

expected: Every comparison and the continue decision are supported by the cited immutable source, license, test, and migration evidence.
result: pass

### 2. Visually re-check the corrected person headers

expected: All four wall avatars look circular; the first header's name, status, and badge fit cleanly inside the 80px row; the other three headers are undistorted; legacy retains circular 34px avatars and its familiar card shell.
result: pending

## Summary

total: 2
passed: 1
issues: 0
pending: 1
skipped: 0
blocked: 0

## Gaps

- truth: "Wall-mode person avatars are fully rounded and visually consistent."
  status: resolved
  reason: "User reported: I don't like how the avatars on the new one is not fully rounded."
  severity: cosmetic
  test: 2
  root_cause: "Wall mode fixes the vertical flex person header at 80px while the shared avatar can shrink. Chrome compresses each nominal 40x40 avatar to 40x19.5px, so its 50% border radius renders an ellipse; legacy headers expand and preserve 34x34 geometry."
  artifacts:
    - path: "src/wall-shell.ts"
      issue: "The wall person header has a fixed 80px height that cannot contain the avatar, labels, gaps, and optional 48px badge."
    - path: "src/ha-family-board-card.ts"
      issue: "The shared avatar style has no shrink protection or intrinsic square constraint."
    - path: "dev/harness-check.mjs"
      issue: "The browser harness does not assert equal rendered avatar width and height."
  missing:
    - "Make wall avatars non-shrinkable and intrinsically square."
    - "Reconcile wall person-header sizing so its visible content fits without overflow."
    - "Add deterministic wall avatar aspect-ratio coverage while preserving legacy geometry."
  resolution: "Plan 01-04 added wall-scoped square avatar geometry, contained header layout, and compiled wall/legacy browser assertions. Automated re-verification passed; visual acceptance remains pending."
  debug_session: .planning/debug/wall-avatar-not-fully-round.md
