# Project Research Summary

> Historical snapshot from 2026-09-11. Start with the [current reference](../../docs/research/README.md).
> Phase gates, missing-feature lists and dependency counts below are not current instructions.

**Project:** Moran Family Board Card
**Domain:** Home Assistant calendar-first family wall display
**Researched:** 2026-09-11
**Confidence:** HIGH

## Executive Summary

The best current direction remains a Home Assistant-native custom card, not a standalone React application. Home Assistant already supplies the authenticated calendar boundary, locale, themes, weather and household context, while the fork already contains unusually deep calendar behavior: five views, person lanes, time and overlap layout, kiosk behavior, event interaction, and the new shared-calendar person-routing layer.

The important adjustment is to validate the implementation base before investing in a large redesign. A newer open-source `family-calendar-card` now implements several Skylight-like behaviors that were previously gaps. Phase 1 should compare it with this fork using the same wall scenarios and record a go/pivot decision. The dedicated Moran repository remains the project home either way; the roadmap changes only if the evidence favors migration.

The v1 product should be ruthlessly calendar-first: opt-in wall shell, fast family comprehension, consistent views, touch and responsive behavior, trustworthy failure/capability states, and repeatable visual verification. Meals, lists, chores, logistics and Calendar Bridge mutation should follow only after the core calendar proves useful on the real wall display.

## Key Findings

### Recommended Stack

Keep TypeScript, Lit, Home Assistant frontend APIs, Rollup, Vitest, and the HACS single-module distribution. Add a browser test runner such as Playwright only when wall mode has stable scenario fixtures and visual contracts.

**Core technologies:**

- **TypeScript + Lit:** preserve the working custom-element model and avoid a framework rewrite.
- **Home Assistant calendar APIs:** keep authentication and calendar-provider variation inside Home Assistant.
- **Pure event model:** centralize time, routing, layout and capabilities outside view templates.
- **Playwright in Phase 5:** verify real interactions and visual behavior at target viewports.

### Expected Features

**Must have:**

- Unified calendars with visible person/shared ownership.
- Wall-optimized day experience plus consistent timeline, week, month and agenda views.
- Now/next hierarchy, person filters, correct all-day/multi-day/overlap behavior.
- Touch, responsive, keyboard, reduced-motion and non-color identity support.
- Honest loading, empty, partial, stale, error and mutation-capability states.

**Should have after validation:**

- Small household status context and stable logistics annotations.
- Smarter event subscriptions/caching if measurements justify them.
- Calendar Bridge adapter for richer Apple Calendar mutation.

**Defer:**

- Meals, tasks, shopping, chores, rewards, photos and AI import.

### Architecture Approach

Use an incremental ports-and-adapters shape: a thin custom-element controller, a Home Assistant calendar adapter, a pure normalized event model, shared interaction rules, and focused view/components behind an opt-in wall shell. Extract seams only as vertical features need them; do not pause for a speculative full rewrite.

**Major components:**

1. **Calendar adapter** — authenticated reads/mutations, capabilities, partial failures and future provider boundary.
2. **Application model** — event normalization, person routing, filtering, spans, overlaps and now/next.
3. **Wall shell and views** — status/navigation plus day, timeline, week, month and agenda presentations.
4. **Editor and harness** — safe configuration plus generic deterministic scenarios.

### Critical Pitfalls

1. **Wrong base after the ecosystem changed** — resolve with a bounded Phase 1 comparison and ADR.
2. **Growing the 3,800-line component** — extract shared config, adapter and model seams during vertical work.
3. **Failure displayed as an empty schedule** — make load states explicit and preserve visible last-success context where safe.
4. **Unsafe recurring-event mutation** — gate by capability and explicit occurrence/series policy.
5. **A polished but unusable screenshot** — test density, distance, touch, keyboard and multiple viewports with scenario fixtures.

## Implications for Roadmap

### Phase 1: Prove the Foundation

**Rationale:** Confirms the correct base and creates one end-to-end wall slice before structural investment.

**Delivers:** ADR, shared config/data seams, generic scenario harness, and opt-in wall day skeleton.

**Avoids:** Wrong-base work and a big-bang rewrite.

### Phase 2: Family-at-a-Glance Day

**Rationale:** The day view, people, now and next provide the highest daily value and validate the core promise.

**Delivers:** Legible lanes, Everyone/person filters, shared events, dense-overlap behavior, now line, and now/next hierarchy.

**Avoids:** Decorative parity work before the core workflow succeeds.

### Phase 3: Planning Horizons and Responsive Layouts

**Rationale:** Once the core visual language works, extend it consistently across planning ranges and devices.

**Delivers:** Timeline, week, month and agenda in the wall shell, plus tablet and portrait behavior.

**Avoids:** Five divergent view implementations and desktop-only design.

### Phase 4: Trustworthy Interaction and Resilience

**Rationale:** A family will rely on the board only when failures and write limitations are visible and safe.

**Delivers:** Details/mutation capability rules, recurrence safeguards, loading/empty/partial/stale/error states, keyboard and reduced-motion behavior, and kiosk recovery.

**Avoids:** Silent missing events and destructive surprises.

### Phase 5: Verification, Distribution, and Pilot

**Rationale:** Visual and integration behavior must be repeatable before the card touches the live household dashboard.

**Delivers:** Component/browser/screenshot matrix, HACS beta artifact, public configuration docs, privacy scan, and a reviewed reversible Home Assistant pilot.

**Avoids:** “Works on my machine,” cache/resource conflicts, privacy leaks, and unsafe live edits.

### Phase Ordering Rationale

- The base decision precedes architectural investment.
- The day/person workflow validates the Core Value before broad view coverage.
- Stable view contracts precede browser screenshot baselines.
- Capability and failure modeling precede a real household pilot.
- Nice-to-have household modules do not enter the v1 critical path.

### Research Flags

Phases needing deeper research during planning:

- **Phase 1:** inspect `tienou/family-calendar-card` license, code health, test depth, API use, and shared-calendar fit.
- **Phase 4:** verify current Home Assistant create/update/delete and recurring-event behavior for each intended calendar integration.
- **Phase 5:** inspect the current live dashboard and HACS resource state read-only, then obtain the required independent reviews before any deployment.

Phases with established patterns:

- **Phase 2:** existing fork already contains day layout, routing, overlap and now/next logic.
- **Phase 3:** existing views and responsive CSS provide a behavioral baseline.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official Home Assistant docs and the passing repository toolchain. |
| Features | HIGH | Skylight official material and multiple active card implementations converge on the calendar expectations. |
| Architecture | HIGH | The recommended boundaries follow existing pure event logic and Home Assistant's custom-card contract. |
| Pitfalls | HIGH | Several are directly visible in the current codebase or documented in competing cards' fixes. |

**Overall confidence:** HIGH

### Gaps to Address

- **Base comparison:** the newer Family Calendar Card needs a source-level spike, not README-only judgment.
- **Actual display hardware:** target browser, pixel ratio, orientation, and kiosk wrapper must be recorded before final density decisions.
- **Live provider capability matrix:** read current entity feature flags and test only after the Home Assistant change protocol is approved.
- **Glanceability:** define a short household observation rubric for the pilot instead of relying only on developer preference.

## Sources

### Primary (HIGH confidence)

- [Skylight Calendar 2](https://myskylight.com/products/the-skylight-calendar-2-classic-sage-with-plus-plan/) — official capabilities and product model.
- [Home Assistant custom-card documentation](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/) — supported frontend extension model.
- [Home Assistant Calendar integration](https://www.home-assistant.io/integrations/calendar/) — intended data and action surface.
- [Home Assistant Calendar entity documentation](https://developers.home-assistant.io/docs/core/entity/calendar/) — capabilities, recurrence and subscriptions.

### Secondary (MEDIUM confidence)

- [Calendar Card Pro](https://github.com/alexpfau/calendar-card-pro) — active Home Assistant calendar UX/performance reference.
- [Week Planner Card](https://github.com/FamousWolf/week-planner-card) — responsive grid reference.
- [Family Calendar Card](https://github.com/tienou/family-calendar-card) — direct Skylight-style comparison candidate.
- Repository source, tests, design spec, and codebase map.

---
*Research completed: 2026-09-11*
*Ready for roadmap: yes*
