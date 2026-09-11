---
status: diagnosed
trigger: "I don't like how the avatars on the new one is not fully rounded."
created: 2026-09-11T08:26:55-05:00
updated: 2026-09-11T08:39:33-05:00
---

## Current Focus

hypothesis: Confirmed — wall-only fixed header height causes the shared flex avatar to shrink vertically but not horizontally, so its 50% border radius produces an ellipse.
test: Completed differential comparison of wall and legacy computed geometry.
expecting: Satisfied: wall measured 40x19.5; legacy measured 34x34.
next_action: Return this root-cause-only diagnosis to the UAT orchestrator; do not change implementation files.

## Symptoms

expected: Wall-mode person avatars are fully rounded and visually consistent. The wall remains one legible calendar-only full-panel canvas with no clipping or private data; legacy retains the pre-wall shell and working view/date interactions.
actual: User reports that the avatars in the new wall mode are not fully rounded.
errors: No runtime error reported; cosmetic UAT issue.
reproduction: Open Test 2 in `.planning/phases/01-prove-the-foundation/01-UAT.md` and inspect `dev/harness.html?scenario=wall` at 1920x1080.
started: Discovered during Phase 01 UAT on 2026-09-11.

## Eliminated

- hypothesis: The shared avatar CSS lacks circular rounding.
  evidence: Both scenarios compute `border-radius: 50%`; legacy renders a true 34x34 circle.
  timestamp: 2026-09-11T08:39:33-05:00
- hypothesis: The fixture initials or a missing `entity_picture` make the avatar appear non-circular.
  evidence: The rendered `.avatar.initials` box itself measures 40x19.5 in wall mode and 34x34 in legacy; content does not determine the bounding-box aspect ratio.
  timestamp: 2026-09-11T08:39:33-05:00
- hypothesis: The optional Avery sensor badge alone deforms its avatar.
  evidence: All four wall avatars, including the three headers without badges, measure the same 40x19.5.
  timestamp: 2026-09-11T08:39:33-05:00

## Evidence

- timestamp: 2026-09-11T08:26:55-05:00
  checked: `.planning/debug/knowledge-base.md`
  found: No debug knowledge base exists, so there is no prior matching resolution to test first.
  implication: Investigate this presentation issue directly from rendered output and source.

- timestamp: 2026-09-11T08:29:06-05:00
  checked: Phase 01 UAT and state
  found: UAT Test 2 is complete with one cosmetic issue, and the only formal gap is fully rounded, visually consistent wall-mode person avatars.
  implication: Scope is the wall presentation path; legacy behavior and all live Home Assistant surfaces must remain untouched.

- timestamp: 2026-09-11T08:29:06-05:00
  checked: Project-local skill directories
  found: No `.claude/skills/` or `.agents/skills/` project skills were present.
  implication: No additional project-skill rules apply to this investigation.

- timestamp: 2026-09-11T08:32:41-05:00
  checked: `src/ha-family-board-card.ts` avatar renderer and shared styles
  found: `_avatar()` renders a `.avatar` div; shared CSS declares equal variable width/height and `border-radius: 50%`, but does not set `flex-shrink: 0`, `min-height`, or `aspect-ratio`.
  implication: The declared geometry is circular only if the flex container does not shrink the block axis.

- timestamp: 2026-09-11T08:32:41-05:00
  checked: `src/wall-shell.ts` wall cascade and Day person template
  found: Wall mode sets `.phead` to a fixed 80px height with 8px vertical padding and column flex layout; it raises avatar size to 40px, while visible name/status text and optional 48px minimum badge also share the same constrained column.
  implication: Available content height (64px) is less than the nominal child stack, so flex shrink is a direct candidate for turning a nominal 40x40 circle into a shorter ellipse.

- timestamp: 2026-09-11T08:32:41-05:00
  checked: `dev/harness.html` and `dev/harness-check.mjs`
  found: The wall fixture gives the first person a focusable badge, and the deterministic checker validates interaction size/focus but never asserts that avatar width equals height or checks computed shape.
  implication: Existing automated evidence can pass even when wall avatar geometry is visibly non-circular.

- timestamp: 2026-09-11T08:36:10-05:00
  checked: Computed DOM geometry in `dev/harness.html?scenario=wall`
  found: All four visible avatars measure exactly 40px wide by 19.5px high; computed `border-radius` is 50%, `flex-shrink` is 1, and `min-height` is auto. Each `.phead` is fixed at 80px with 8px vertical padding and a 4px gap. The optional badge independently measures 48px high.
  implication: The non-round appearance is objectively reproduced. The browser is shrinking only the avatar's block dimension, so 50% rounds a 40x19.5 ellipse rather than a square.

- timestamp: 2026-09-11T08:39:33-05:00
  checked: Differential computed geometry in `dev/harness.html?scenario=legacy`
  found: Every legacy avatar measures 34px by 34px with the same 50% radius and `flex-shrink: 1`; its `.phead` expands to about 89.33px rather than being fixed at 80px.
  implication: The wall-only header constraint is the causal difference. The shared avatar declaration works when its container can size to content.

- timestamp: 2026-09-11T08:39:33-05:00
  checked: Common bug pattern map and competing presentation hypotheses
  found: This is a CSS flexbox boundary/constraint issue, not a null, timing, state, module, data-shape, or environment failure.
  implication: A targeted wall-layout geometry correction and a rendered aspect-ratio assertion are appropriate; data and interaction logic do not need changes.

## Resolution

root_cause: `src/wall-shell.ts` fixes `.moran-wall-shell .phead` at 80px high while the shared `.phead` remains a vertical flex container. Its `.avatar` child has equal declared width and height but retains the default `flex-shrink: 1` and no square-preserving minimum/aspect ratio. With wall mode's 40px avatar plus name, status, gaps, padding, and optional 48px touch badge competing for the fixed header height, Chrome resolves each avatar to 40px wide by 19.5px high. `border-radius: 50%` rounds that rectangle into an ellipse. Legacy does not set the fixed 80px height, so the same child stays 34x34.
fix: Suggested direction only: make avatar geometry non-shrinkable and intrinsically square (for example, an explicit square flex basis/aspect ratio), then reconcile the wall person-header height/content arrangement so the name, status, and optional 48px badge fit without overflow. Keep this wall-scoped or otherwise prove legacy remains unchanged. Add a deterministic browser assertion that every visible wall avatar has equal rendered width and height, plus a legacy comparison.
verification: Root cause reproduced and isolated with computed DOM measurements in the synthetic wall and legacy harnesses. No fix was applied because this session is diagnose-only.
files_changed: []
