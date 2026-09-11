# Roadmap: Moran Family Board Card

## Overview

This roadmap turns the existing fork into a dependable calendar-first family wall display through five vertical phases. It starts by validating the implementation base and proving one opt-in wall slice, then delivers the high-value family day experience, expands it across planning horizons and devices, hardens interaction and failure behavior, and only then prepares a reversible Home Assistant pilot. Meals, lists, chores, deeper logistics, and Calendar Bridge mutation remain outside the v1 critical path.

## Phases

**Phase Numbering:** integer phases are planned milestone work; decimal phases are urgent insertions and must be marked `INSERTED`.

- [ ] **Phase 1: Prove the Foundation** - Decide the right base and produce a tested opt-in wall-calendar skeleton.
- [ ] **Phase 2: Family-at-a-Glance Day** - Make today's people, events, current activity, and next activity immediately understandable.
- [ ] **Phase 3: Planning Horizons and Responsive Layouts** - Carry one interaction language across all views, tablet, and portrait.
- [ ] **Phase 4: Trustworthy Interaction and Resilience** - Make event actions, failures, accessibility, and kiosk recovery safe and explicit.
- [ ] **Phase 5: Verification, Distribution, and Pilot** - Automate cross-viewport confidence, ship a beta artifact, and run a controlled Home Assistant pilot.

## Phase Details

### Phase 1: Prove the Foundation

**Goal:** Confirm the implementation base and render one real wall-mode day slice without changing legacy behavior.
**Mode:** mvp
**Depends on:** Nothing
**Requirements:** FOUND-01, FOUND-02, FOUND-03
**Success Criteria** (what must be TRUE):

1. A written ADR compares this fork and `tienou/family-calendar-card` from source and records a clear continue/pivot decision.
2. A generic harness configuration can enable wall mode and display a full-panel day calendar using the existing Home Assistant-shaped data path.
3. The same build renders an existing configuration with unchanged defaults when wall mode is absent.
4. Card and editor compile against one shared definition for all v1 configuration added in this phase.

**Plans:** 3 plans

Plans:

- [ ] 01-01: Inspect the alternative base, run common scenarios, and record the implementation ADR.
- [ ] 01-02: Extract shared config defaults and the minimum typed calendar boundary needed by wall mode.
- [ ] 01-03: Build the opt-in wall shell and deterministic day-view harness slice with legacy regression checks.

### Phase 2: Family-at-a-Glance Day

**Goal:** Make today's family schedule readable within seconds from across the room.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** DATA-01, DATA-02, DATA-03, CAL-01, CAL-02, CAL-04, CAL-05, CAL-06
**Success Criteria** (what must be TRUE):

1. The wall day view clearly shows each visible person, all-day and timed events, shared ownership, a time axis, and the current-time marker at 1920x1080.
2. Everyone and individual-person filters update the view without refetching or losing joint/shared event identity.
3. Current and next activity can be identified for each visible person in the busy-day fixture without opening event details.
4. Shared routing, local dates/times, multi-day behavior, and dense overlaps remain correct in automated scenarios.
5. Each configured calendar is loaded once per stable range/refresh cycle, while a single-calendar failure is preserved for later error presentation.

**Plans:** 3 plans

Plans:

- [ ] 02-01: Normalize per-calendar results and harden routing, date, overlap, and now/next selectors with deterministic tests.
- [ ] 02-02: Implement the wall day canvas, person headers, shared ownership treatment, now line, and readable density rules.
- [ ] 02-03: Add Everyone/person filters and the now/next focus surface, then validate the busy-day glanceability rubric.

### Phase 3: Planning Horizons and Responsive Layouts

**Goal:** Give the family consistent ways to look ahead across views and supported device sizes.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** CAL-03, CAL-07, INT-01, RSP-01, RSP-02
**Success Criteria** (what must be TRUE):

1. Timeline, week, month, and agenda use the same person filters, event identity, shared-event treatment, and date navigation as day view.
2. A user can switch views, page dates, and return to today by touch or keyboard without losing the selected person filter.
3. The status header presents current date/time and optional configured weather while the calendar remains functional when weather is absent or unavailable.
4. Tablet landscape retains the primary calendar and reachable controls with reduced secondary density rather than clipping.
5. Portrait/mobile defaults or adapts to a readable agenda-first layout with accessible event details.

**Plans:** 3 plans

Plans:

- [ ] 03-01: Bring timeline and week views into the wall shell with shared navigation, filtering, and view-model contracts.
- [ ] 03-02: Bring month and agenda into the same contract and preserve cross-view date/event continuity.
- [ ] 03-03: Implement the status/weather header and responsive wall, tablet, and portrait layout rules.

### Phase 4: Trustworthy Interaction and Resilience

**Goal:** Make the shared calendar safe and understandable when users act on events or integrations misbehave.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** INT-02, INT-03, ACC-01, ACC-02, ACC-03, REL-01, REL-02, REL-03
**Success Criteria** (what must be TRUE):

1. Event details expose all available calendar information and show only the create/update/delete actions supported by the target entity and event.
2. Any recurring-event destructive action states its occurrence/series scope before execution; uncertain cases remain read-only.
3. Loading, empty, unsupported, partial, stale, and total failure scenarios are visibly distinct, retain available data, and offer recovery where possible.
4. All primary interactions meet the 48px touch target, keyboard, semantic labeling, non-color identity, and reduced-motion requirements.
5. Legacy Moran configurations and the separately named upstream card continue to load, and kiosk inactivity can restore the configured start state.

**Plans:** 3 plans

Plans:

- [ ] 04-01: Consolidate event details and capability/recurrence rules for safe create, update, and delete flows.
- [ ] 04-02: Add explicit loading, empty, partial, stale, unsupported, error, and retry behavior to the data boundary and wall shell.
- [ ] 04-03: Complete touch, keyboard, semantic, reduced-motion, non-color, kiosk-return, and compatibility validation.

### Phase 5: Verification, Distribution, and Pilot

**Goal:** Produce a reviewable beta and validate it through a controlled, reversible Home Assistant pilot.
**Mode:** mvp
**Depends on:** Phase 4
**Requirements:** QA-01, QA-02, QA-03, DIST-01, DIST-02
**Success Criteria** (what must be TRUE):

1. Unit and browser suites cover the required event, editor, interaction, capability, failure, and responsive scenarios with deterministic time and generic data.
2. Reviewed screenshots at 1920x1080 wall, tablet landscape, and portrait agenda show no critical clipping, unreadable density, or inaccessible controls.
3. CI, HACS validation, source-to-`dist` build verification, and privacy/secret checks pass for a versioned beta artifact.
4. Public documentation explains configuration, upgrade, cache handling, limitations, and rollback without household-specific values.
5. The live pilot occurs only after current state is re-read, a targeted backup is taken, two independent Sonnet plan reviews pass, and verification/rollback steps are ready; if Sonnet is unavailable, Emiliano explicitly approves the substitute before deployment.
6. Household observation confirms the board makes today's ownership and next activity understandable; failures and requested changes are recorded before v1 is declared complete.

**Plans:** 3 plans

Plans:

- [ ] 05-01: Add component/browser automation and a reviewed wall-tablet-portrait visual scenario matrix.
- [ ] 05-02: Harden CI, build a versioned HACS beta, scan artifacts for private data, and complete user/upgrade/rollback documentation.
- [ ] 05-03: Obtain the required plan reviews and approval, deploy to a test-only Home Assistant dashboard, observe use, verify, and decide release readiness.

## Deferred Beyond v1

- Calendar Bridge provider and occurrence-safe advanced Apple Calendar mutations.
- Driver, pickup, departure, attendee, assignment, and conflict logistics.
- Home Assistant to-do lists, shopping, meals, chores, rewards, photos, and AI-assisted import.

These items must enter a new milestone or an approved roadmap insertion; they are not implicit work inside the five v1 phases.

## Progress

**Execution Order:** 1 → 2 → 3 → 4 → 5. A pivot in Phase 1 requires updating PROJECT.md, REQUIREMENTS.md, and this roadmap before Phase 2.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Prove the Foundation | 0/3 | Not started | - |
| 2. Family-at-a-Glance Day | 0/3 | Not started | - |
| 3. Planning Horizons and Responsive Layouts | 0/3 | Not started | - |
| 4. Trustworthy Interaction and Resilience | 0/3 | Not started | - |
| 5. Verification, Distribution, and Pilot | 0/3 | Not started | - |

---
*Roadmap created: 2026-09-11*
*Last updated: 2026-09-11 after initial GSD planning*
