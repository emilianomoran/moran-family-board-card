---
phase: 01-prove-the-foundation
reviewed: 2026-09-11T08:39:29Z
depth: standard
files_reviewed: 14
files_reviewed_list:
  - README.en.md
  - dev/harness.html
  - dev/harness-check.mjs
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
  critical: 0
  warning: 1
  info: 0
  total: 1
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-09-11T08:39:29Z
**Depth:** standard
**Files Reviewed:** 14
**Status:** issues_found

## Narrative Findings (AI reviewer)

The four findings from the first review are materially resolved. Wall mode now applies its 48px
target and 2px focus treatment to native and ARIA button/tab targets, month event chips are
keyboard-focusable, the wall Day action is visibly labeled `Today` with the accessible name
`Show today`, timezone mismatch stops the fixture before card creation, and the wall shell is sized
against a constrained host panel instead of `100vh`. The checked-in browser test passed Day,
Timeline, Week, Month, and Agenda interaction-target checks plus the legacy-shell check at
1920x1080 in `America/Chicago` with 64px of synthetic host chrome.

`npm run format:check`, `npm run lint`, all 39 Vitest tests, `npm run test:harness`, and
`npm run build` pass. The rebuilt distribution bundle has the same SHA-256 digest as the committed
artifact (`0d2544dd3df058dbdfac2bc8ec3c51d12c78f43e15d87716a55ece7400c529e4`), and
`git diff --check` is clean. No credential, live Home Assistant path, or private household fixture
was found in the reviewed implementation set.

The requested `dev/harness-runner.mjs` path does not exist in the repository; the committed Phase 1
runner is `dev/harness-check.mjs`, which was reviewed as the fourteenth file. One keyboard behavior
defect remains in an interaction target that the original review explicitly called out.

## Warnings

### WR-01: Keyboard activation of a person badge also toggles its parent person lane

**File:** `/Users/emiliano/GitHub-Personal/moran-family-board-card/src/ha-family-board-card.ts:1115-1119`

**Issue:** A `.pbadge` is nested inside the focusable `.phead`. Its click handler stops propagation,
but its Enter/Space handler only calls `preventDefault()` before `_moreInfo(id)`. The same keydown
therefore bubbles to the `.phead` handler at lines 1351-1355, which also handles Enter/Space and
calls `_togglePerson(i)`. A keyboard user opening badge details unexpectedly collapses or expands
the person's lane as a second action. The deterministic fixture currently has no badge, and its
generic keyboard assertion checks only `defaultPrevented`, so this regression is not detected.

**Fix:** Stop propagation in the badge keyboard handler, matching its click behavior, and include
one generic badge entity in the wall fixture with assertions that Enter and Space invoke
`_moreInfo` without invoking `_togglePerson`.

```ts
if (k.key === "Enter" || k.key === " ") {
  k.preventDefault();
  k.stopPropagation();
  this._moreInfo(id);
}
```

---

_Reviewed: 2026-09-11T08:39:29Z_
_Reviewer: Codex (gsd-code-reviewer)_
_Depth: standard_
