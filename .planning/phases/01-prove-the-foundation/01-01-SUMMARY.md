---
phase: 01-prove-the-foundation
plan: 01
subsystem: architecture
tags: [adr, home-assistant, lit, provenance, source-comparison]

requires: []
provides:
  - Source-pinned implementation-base decision selecting the Moran fork
  - Provenance policy for behavioral learning and substantial source reuse
  - Revisit criteria that gate any future implementation-base pivot
affects: [01-02, 01-03, wall-layout, calendar-architecture]

tech-stack:
  added: []
  patterns:
    - Immutable source evidence matrix for implementation-base decisions
    - Explicit stop-work gate when a foundational ADR outcome changes

key-files:
  created:
    - docs/adr/0001-implementation-base.md
  modified: []

key-decisions:
  - "Continue the Moran TypeScript/Lit fork as the implementation base; use tienou/family-calendar-card only as a source-pinned design reference."
  - "Require explicit MIT notice preservation and a documented source commit before accepting substantial copied code."

patterns-established:
  - "Source comparison: evaluate immutable source trees across product, architecture, quality, provenance, and migration criteria rather than visual similarity."
  - "Foundation gate: stop dependent UI work and update project planning records before proceeding if the accepted base decision changes."

requirements-completed: [FOUND-01]

duration: 3 min
completed: 2026-09-11
---

# Phase 1 Plan 1: Implementation Base Decision Summary

**An accepted, source-pinned ADR selects the tested TypeScript/Lit fork and establishes the
provenance and revisit gates for later wall-calendar work.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-09-11T07:25:14Z
- **Completed:** 2026-09-11T07:29:11Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Compared both candidates at immutable full commit hashes across all eight locked criteria.
- Recorded the exact continue decision that unlocks Plans 01-02 and 01-03.
- Preserved the Home-Assistant-only credential boundary and established explicit MIT provenance
  rules for any future source reuse.
- Defined a measurable five-part trigger for reconsidering the implementation base.

## Task Commits

Each task was committed atomically:

1. **Task 1: Publish the pinned implementation-base ADR** - `8bdaa0a` (docs)

**Plan metadata:** recorded by the commit containing this summary.

## Files Created/Modified

- `docs/adr/0001-implementation-base.md` - Accepted source comparison, implementation-base
  decision, provenance policy, consequences, rejected-pivot rationale, and revisit trigger.

## Decisions Made

- Continue the Moran TypeScript/Lit fork because it already provides tested person routing, the
  exact five-view model, strict typechecking, and the safer Home Assistant API boundary at a
  substantially lower migration cost.
- Use the alternative as a source-pinned design reference only. Behavioral learning is allowed;
  substantial copied code requires its exact source commit and applicable MIT notice to be
  documented and preserved.
- Stop Plans 01-02 and 01-03 if a future source recheck reverses this outcome, and update the
  project, requirements, roadmap, and tracking issue before UI work resumes.

## Verification Evidence

- The plan's complete structural command passed, including all eight exact matrix-row labels,
  both full commits, the exact decision line, attribution language, the revisit heading, and
  `git diff --check`.
- Every matrix row includes immutable source links for both candidates and an evidence-backed
  conclusion; the cited source regions were rechecked against both pinned trees.
- Privacy checks found no entity identifiers, private network addresses, live configuration
  paths, secret assignments, or household event data in the ADR.
- The task commit changes only `docs/adr/0001-implementation-base.md`; no dependency, source,
  generated bundle, or Home Assistant configuration changed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Metadata bug] Corrected stale and malformed execution-state prose**

- **Found during:** Plan closeout
- **Issue:** The canonical state commands advanced the plan and requirement correctly, but the
  free-form state document retained its pre-execution status/activity prose, failed to update the
  body progress bar, and appended a metric row outside the existing table.
- **Fix:** Preserved the command-produced counters and decisions while correcting the status,
  activity, phase progress, velocity summary, and metric table placement.
- **Files modified:** `.planning/STATE.md`, `.planning/ROADMAP.md`
- **Verification:** State shows Plan 1 of 3 at 33% phase progress; the roadmap shows 1/3 in
  progress; FOUND-01 is complete.
- **Committed in:** Plan metadata commit containing this summary.

---

**Total deviations:** 1 auto-fixed (1 metadata bug).
**Impact on plan:** Documentation-only correction required for truthful GSD execution state; no
product scope or source implementation changed.

## Issues Encountered

- GSD emitted a deprecation warning for the roadmap's free-form milestone headings. The warning
  does not affect plan progression or the verified ADR.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The accepted outcome is **continue**, so Plan 01-02 may extract the shared configuration and
  typed calendar boundary.
- No high-severity threat or implementation blocker remains from this plan.

## Self-Check: PASSED

- `docs/adr/0001-implementation-base.md` exists.
- Task commit `8bdaa0a` exists and contains only the ADR.
- FOUND-01 evidence and all plan-level verification criteria pass.

---
*Phase: 01-prove-the-foundation*
*Completed: 2026-09-11*
