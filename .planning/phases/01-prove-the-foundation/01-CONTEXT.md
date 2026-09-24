# Phase 1: Prove the Foundation - Context

**Gathered:** 2026-09-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 decides whether the current Moran fork remains the best implementation base, introduces only the minimum shared configuration and calendar seams required for wall mode, and proves an opt-in calendar-only wall day slice in the generic harness. It does not build the complete family-at-a-glance experience, bring every view into wall mode, add household operations, or touch the live Home Assistant configuration.

</domain>

<decisions>
## Implementation Decisions

### Implementation Base Decision

- **D-01:** Continue using this dedicated Moran repository while evaluating `tienou/family-calendar-card`; do not create or fork another tracked project during the spike.
- **D-02:** Compare source, not README claims, using one written matrix: target calendar behavior, shared-calendar-to-person routing, Home Assistant API use, test depth, maintainability, license/provenance, migration cost, and fit with the five-view roadmap.
- **D-03:** The ADR must end in one of two actionable outcomes: continue this fork, or pivot this repository's implementation direction and update PROJECT.md, REQUIREMENTS.md, ROADMAP.md, and GitHub issue #2 before UI implementation proceeds.
- **D-04:** Reusable ideas may be learned from compatible open-source implementations, but code is copied only when license and attribution requirements are explicit and preserved.

### Wall Slice Composition

- **D-05:** Phase 1 wall mode is calendar-only and uses the available panel as one scheduling canvas. The older 68/32 tasks, shopping, and dinner rail is deferred beyond v1.
- **D-06:** The slice includes a restrained status/header region, calendar identity, existing date/view navigation where functional, and the existing day calendar. Controls for deferred sections must not appear as decorative or inert placeholders.
- **D-07:** The visual direction remains the approved white, quiet, high-contrast wall-board language in `docs/MORAN_DESIGN_SPEC.md`, but calendar-first requirements override that document's household-operations rail.
- **D-08:** Phase 1 proves shell composition and integration, not final day-view hierarchy. Person filters, now/next refinement, dense-layout rules, and glanceability validation belong to Phase 2.

### Configuration and Compatibility

- **D-09:** The public opt-in is `layout: wall`. When absent, normalization selects legacy/default behavior without changing existing appearance or interaction.
- **D-10:** Card and editor import the same configuration interfaces, layout union, defaults, and normalization helpers. Unknown legacy keys continue to survive editor round-trips.
- **D-11:** The upstream custom element and the renamed Moran custom element must continue to coexist. No aliases may reclaim the upstream element name.
- **D-12:** Wall-mode additions use documented Home Assistant theme variables with safe fallbacks and introduce no household-specific defaults.

### Refactor Depth

- **D-13:** Use incremental extraction, not a rewrite: first shared configuration/defaults, then a narrow typed calendar data boundary only where the wall slice needs it.
- **D-14:** Preserve the existing pure logic in `src/events.ts`; Phase 1 does not reorganize every renderer or mutation flow.
- **D-15:** New wall-shell markup and styles should live in a focused module if that avoids growing the main component. Existing view extraction is allowed only when necessary to mount the shell safely.
- **D-16:** Generated `dist/moran-family-board-card.js` is rebuilt from source and never hand-edited.

### Harness and Evidence

- **D-17:** Extend the generic harness with deterministic synthetic events and a fixed clock suitable for stable wall screenshots; never use live family entities or event content.
- **D-18:** Phase 1's primary viewport is 1920x1080 landscape. Tablet and portrait coverage remain Phase 3 scope, although the shell must avoid knowingly blocking them.
- **D-19:** Evidence includes the ADR, legacy and wall harness scenarios, unit tests for shared config normalization, typecheck, existing event tests, production build, and a privacy/secret scan.
- **D-20:** No source file under `/Volumes/config` and no live dashboard resource is read for mutation or changed in Phase 1.

### Claude's Discretion

- Exact module filenames and whether the narrow calendar boundary is an interface plus implementation or a single typed adapter module.
- Exact internal CSS class names and token names, provided they follow repository conventions and the design contract.
- The synthetic schedule content, provided it covers timed, all-day, overlapping, shared, multi-person, and unmatched examples without household identifiers.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Scope and Success

- `.planning/PROJECT.md` — core value, calendar-first scope, constraints, and base-comparison decision.
- `.planning/REQUIREMENTS.md` — Phase 1 requirements FOUND-01 through FOUND-03 and milestone acceptance criteria.
- `.planning/ROADMAP.md` — Phase 1 boundary, success criteria, plan sequence, and GitHub tracking link.
- `.planning/research/SUMMARY.md` — evidence behind the implementation-base gate and phase ordering.

### Visual Direction

- `docs/MORAN_DESIGN_SPEC.md` — wall viewport, visual tokens, typography, touch target, and calendar anatomy; its 68/32 operations rail is superseded for v1 by the calendar-first project scope.
- `docs/concepts/moran-family-board-target-v1.png` — visual reference for hierarchy and restraint, not a literal Phase 1 feature checklist.

### Existing Fork Contract

- `docs/MORAN_FORK_PLAN.md` — existing routing, compatibility, security, and provider-boundary decisions.
- `README.en.md` — current supported views, public configuration, editor, kiosk, event behavior, and mutation claims.
- `.planning/codebase/CONVENTIONS.md` — code, component, accessibility, and distribution conventions.
- `.planning/codebase/STRUCTURE.md` — current locations and rules for adding config, UI, tests, and provider code.
- `.planning/codebase/CONCERNS.md` — main-component size, duplicated config, API, mutation, and test risks.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/events.ts`: Pure routing, normalization, date segmentation, drag-time, and overlap helpers remain the behavior foundation.
- `src/events.test.ts`: Existing deterministic unit-test patterns cover difficult calendar math and shared routing.
- `src/ha-family-board-card.ts`: Existing day renderer, navigation, focus bar, Home Assistant reads, custom-element registration, and theme-variable patterns can be composed into the first wall slice.
- `src/editor.ts`: Existing profile presets and `config-changed` behavior provide the visual-editor integration point.
- `dev/harness.html`: Existing mocked Home Assistant surface is the starting point for legacy and wall scenarios.

### Established Patterns

- Lit reactive state and scoped CSS inside a custom element.
- Pure DOM-free calendar logic is separated when behavior is complex or time-sensitive.
- Calendar writes are capability-gated and optional weather failures do not take down the calendar.
- Rollup emits one committed HACS bundle; source is authoritative.

### Integration Points

- `FamilyBoardConfig` and `PersonConfig` currently originate in `src/ha-family-board-card.ts` and overlap types in `src/editor.ts`; Phase 1 extracts their shared source.
- `FamilyBoardCard.setConfig` is the compatibility boundary where `layout: wall` defaults and validation enter.
- `FamilyBoardCard.render` and `_renderDay` are the minimum shell/view composition seam.
- `_fetchEvents` is the existing Home Assistant calendar boundary; extraction must preserve its one-fetch-per-calendar behavior and not widen Phase 1 into full resilience work.
- `FamilyBoardCard.getConfigElement` and editor settings are the public visual-configuration seam.

</code_context>

<specifics>
## Specific Ideas

- The desired reference is the calm, readable family orientation of Skylight Calendar rather than a pixel-for-pixel commercial clone.
- The wall display should feel like one calendar product, not a Lovelace grid made of unrelated cards.
- The Phase 1 ADR should use a compact decision table and scenario evidence so the base choice can be revisited without repeating research.
- The generic wall harness should be usable later by Playwright and visual regression work without being rebuilt.

</specifics>

<deferred>
## Deferred Ideas

- Everyone/person filters, final now/next hierarchy, dense-day handling, and glanceability testing — Phase 2.
- Timeline, week, month, agenda wall treatment, weather header completion, tablet, and portrait — Phase 3.
- Full event-detail/mutation hardening, recurrence scope, failure/stale states, and comprehensive accessibility — Phase 4.
- Browser screenshot automation, HACS beta, and live Home Assistant pilot — Phase 5.
- Calendar Bridge provider, logistics, tasks, shopping, meals, chores, rewards, photos, and AI import — post-v1.

</deferred>

---
*Phase: 01-prove-the-foundation*
*Context gathered: 2026-09-11*
