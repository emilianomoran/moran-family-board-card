# Phase 1: Prove the Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-11
**Phase:** 01-prove-the-foundation
**Areas discussed:** implementation base, wall slice composition, compatibility, refactor depth, harness evidence

The user authorized the full Phase 1 GSD planning run after the project brief, requirements, research, and roadmap had already captured the product decisions. The options below were therefore resolved from those prior explicit decisions rather than re-asked as a checklist.

---

## Implementation Base

| Option | Description | Selected |
|--------|-------------|----------|
| Continue this repo with an evidence gate | Compare current fork and newer Family Calendar Card from source, then continue or pivot through an ADR | ✓ |
| Pivot immediately | Adopt the newer alternative based on advertised features before source comparison | |
| Build a standalone React app | Replace the Home Assistant custom-card approach | |

**User's choice:** Continue the Home Assistant custom-card repository and use Phase 1 to validate the best implementation base.
**Notes:** The user previously chose Home Assistant over standalone React and asked for one dedicated repository. The comparison is a risk-control step, not a reopening of product scope.

---

## Wall Slice Composition

| Option | Description | Selected |
|--------|-------------|----------|
| Calendar-only full canvas | Prove a restrained header and the existing day calendar in wall mode | ✓ |
| Full 68/32 operations layout | Include tasks, shopping, and dinner in Phase 1 | |
| Unstyled technical spike | Prove configuration only without a meaningful wall composition | |

**User's choice:** Calendar first; meals and lists are nice-to-have and should not delay it.
**Notes:** This resolves the conflict between the older design spec's operations rail and the newer v1 scope.

---

## Compatibility Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit `layout: wall` opt-in | Preserve legacy behavior when the key is absent | ✓ |
| Replace the default layout | Move all users to wall mode automatically | |
| Separate custom element | Duplicate the card as a second wall-only element | |

**User's choice:** Extend the existing fork safely rather than create a separate application.
**Notes:** One element and model avoid permanent duplicate behavior while the opt-in protects current configurations.

---

## Refactor Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Incremental seams | Extract shared config and only the calendar/shell boundaries needed by the vertical slice | ✓ |
| Full architecture rewrite | Split all views, API behavior, editor, and styles before rendering wall mode | |
| No extraction | Add wall configuration and CSS directly to the existing 3,800-line component | |

**User's choice:** Proceed with the fork and a phased plan.
**Notes:** Incremental extraction protects existing calendar edge cases and prevents Phase 1 from becoming an internal rewrite with no visible result.

---

## Harness and Evidence

| Option | Description | Selected |
|--------|-------------|----------|
| Deterministic generic fixtures | Extend the harness with a fixed clock and synthetic busy-day scenarios | ✓ |
| Live household data | Build screenshots and tests from the production calendar | |
| Manual inspection only | Skip reusable fixtures until the final verification phase | |

**User's choice:** Keep the project trackable in its public repository and protect live Home Assistant.
**Notes:** Generic fixtures support privacy, stable screenshots, and later Playwright work. Phase 1 does not deploy to `/Volumes/config`.

---

## Claude's Discretion

- Internal module filenames and the smallest practical calendar adapter shape.
- CSS class/token names consistent with the repository conventions.
- Synthetic fixture content that exercises required event shapes without household identifiers.

## Deferred Ideas

- Tasks, lists, meals, Calendar Bridge mutation, logistics, and the live pilot remain in their roadmap phases.
