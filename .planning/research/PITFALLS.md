# Pitfalls Research

> Historical snapshot from 2026-09-11. Start with the [current reference](../../docs/research/README.md).
> Phase gates, missing-feature lists and dependency counts below are not current instructions.

**Domain:** Calendar-first Home Assistant wall display
**Researched:** 2026-09-11
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Building Before Confirming the Best Base

**What goes wrong:**
The fork undergoes a large refactor while a newer compatible card already solves enough of the target problem to make that work redundant.

**Why it happens:**
The competitive landscape changed after the original fork choice, and implementation momentum hides the opportunity cost.

**How to avoid:**
Run a bounded Phase 1 comparison using the same generic scenarios. Record an ADR covering features, shared-calendar routing, code health, license, migration cost, and total effort.

**Warning signs:**
Planned work duplicates working behavior in `tienou/family-calendar-card` without a documented reason.

**Phase to address:**
Phase 1.

---

### Pitfall 2: Growing the 3,800-Line Main Component

**What goes wrong:**
Wall-shell conditions, five views, API calls, dialogs, and CSS become impossible to change safely.

**Why it happens:**
Adding one more render branch feels faster than extracting a tested boundary.

**How to avoid:**
Share config types, isolate calendar access, and extract only components needed by each vertical phase. Preserve behavior with unit and harness checks.

**Warning signs:**
Duplicated config interfaces, API calls inside render functions, or changes requiring edits across distant regions of the same file.

**Phase to address:**
Phases 1-4, beginning with minimal seams in Phase 1.

---

### Pitfall 3: Treating a Failed Calendar as Empty

**What goes wrong:**
The screen shows no events when the provider is unavailable, leading the family to assume the schedule is clear.

**Why it happens:**
Success with an empty array and request failure collapse into the same view state.

**How to avoid:**
Model loading, success, partial, stale, and failure states explicitly. Preserve the last successful data where safe and show its timestamp.

**Warning signs:**
Catch blocks assign `[]`, errors appear only in the browser console, or one failed calendar blanks all others.

**Phase to address:**
Phase 4.

---

### Pitfall 4: Unsafe or Misleading Event Mutation

**What goes wrong:**
Edit/delete controls fail, modify an entire recurring series unexpectedly, or appear for read-only calendars.

**Why it happens:**
Home Assistant calendar integrations expose different feature sets and recurrence semantics.

**How to avoid:**
Gate controls using runtime capabilities, distinguish occurrences from series, require explicit confirmation for destructive scope, and keep uncertain events read-only.

**Warning signs:**
A generic `canEdit` boolean, missing occurrence identifiers, or tests that cover only Local Calendar.

**Phase to address:**
Phase 4; richer Bridge mutation stays v2.

---

### Pitfall 5: Designing a Screenshot Instead of a Wall Tool

**What goes wrong:**
The board looks polished at one viewport but fails at a distance, under dense schedules, on touch, or in error states.

**Why it happens:**
Static mockups omit real text lengths, overlaps, all-day rows, focus states, and latency.

**How to avoid:**
Use scenario fixtures, measurable glance tests, minimum touch targets, keyboard paths, reduced motion, and screenshot coverage at wall/tablet/portrait sizes.

**Warning signs:**
Tiny event text, color-only meaning, hover actions, clipped titles, or a single golden-path screenshot.

**Phase to address:**
Phases 2-5.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Add all wall CSS to the main source file | Fast first mock | Makes view and responsive changes harder to isolate | Only for a throwaway spike that is removed before Phase 1 completion. |
| Duplicate card/editor config types | Avoids moving imports | Configuration drift and silent editor breakage | Never after Phase 1. |
| Use real family events as fixtures | Realistic screenshots | Privacy exposure and nondeterministic tests | Never in the public repo. |
| Mix dependency upgrades with UI work | One combined PR | Obscures regressions and complicates rollback | Never for high-risk dependency jumps. |
| Commit only rebuilt `dist` without source-level verification | Quick HACS test | Bundle can mask missing tests or unreviewable changes | Never. |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Home Assistant calendars | Assume every entity supports create/update/delete | Read `supported_features` and handle each operation separately. |
| Calendar event ranges | Treat inclusive/exclusive boundaries and all-day dates like timed instants | Preserve RFC-style dates and centralize range normalization. |
| Calendar subscriptions | Assume a mutation automatically pushes new data | Verify integration listener behavior and refresh visibly when necessary. |
| Weather | Auto-select an arbitrary entity silently | Allow explicit configuration and make absence harmless. |
| HACS/browser cache | Reuse resource names or omit version/reload guidance | Keep the fork's bundle identity distinct and document cache refresh. |
| Calendar Bridge | Reach `localhost:8080` from wall-browser JavaScript | Use a future authenticated HA-side adapter with no client secret. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Refetch on every Lit update | Calendar API chatter and visible jitter | Fetch by stable range/config key and deduplicate requests | Frequent minute ticks, filter changes, or multiple cards. |
| Render hidden views | Slow updates and large DOM | Render only the active view while preserving state in the controller | Month grid plus dense day/timeline data. |
| Recompute routing/layout repeatedly | Touch lag and high CPU | Pure memoizable selectors keyed by events/config/range | Busy calendars with many shared-person matches. |
| Unlimited overlap columns | Unreadable slivers | Keep overflow grouping and accessible drill-in | More than three simultaneous events per lane. |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Put HA or Bridge credentials in Lovelace configuration | Credential disclosure to browser users and exports | Use the authenticated Home Assistant connection and server-side secrets. |
| Log raw event objects by default | Locations, names, and descriptions leak into support logs | Structured redacted diagnostics only when explicitly enabled. |
| Publish household fixtures/screenshots | Private schedule disclosure | Generic synthetic fixtures and reviewable screenshot artifacts. |
| Hide destructive scope in a generic delete action | Accidental series deletion | State the occurrence/series scope and confirm before destructive calls. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Color-only lanes | People cannot reliably identify ownership | Pair color with names, initials, or avatars. |
| Equal visual weight for everything | Important current/next events disappear in noise | Establish hierarchy: now, next, today, then future detail. |
| Too many controls on the ambient screen | Calendar becomes an admin console | Keep primary navigation visible and move configuration to the editor. |
| Auto-fit that makes text too small | Whole day technically fits but cannot be read at a distance | Enforce minimum type and switch density/scroll strategy. |
| Empty, loading, and error look alike | Users lose trust in the schedule | Give each state explicit copy, iconography, and recovery action. |

## “Looks Done But Isn’t” Checklist

- [ ] **Wall layout:** Verify dense, empty, loading, partial failure, long-title, all-day, and overlapping scenarios at 1920x1080.
- [ ] **Touch:** Verify every primary target is at least 48px and no action requires hover.
- [ ] **Accessibility:** Verify keyboard focus, names beyond color, semantic controls, and reduced motion.
- [ ] **Mutation:** Verify create/update/delete per supported calendar type and recurring-event scope.
- [ ] **Responsiveness:** Verify tablet and portrait agenda, not only desktop shrink-to-fit.
- [ ] **Distribution:** Verify fresh HACS install/update, resource identity, cache guidance, and rollback.
- [ ] **Privacy:** Scan examples, test artifacts, and screenshots for household-specific data and tokens.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong base chosen | MEDIUM | Stop after the Phase 1 spike, record the decision, migrate only fork-specific routing/tests, and rewrite the roadmap before more UI work. |
| Monolith worsened | HIGH | Freeze features, capture behavior, extract config/adapter/model seams, then resume vertical delivery. |
| Unsafe mutation found | MEDIUM | Disable the affected action by capability/provider, preserve read-only details, and add an integration-specific regression test. |
| Live pilot regresses | LOW | Remove/disable the test card resource/dashboard using the documented targeted backup and rollback steps. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Wrong base | Phase 1 | ADR compares the same scenarios and records a go/pivot decision. |
| Monolithic renderer | Phases 1-4 | Shared config/adapter/model boundaries exist and new work lands outside the root monolith where appropriate. |
| Failed looks empty | Phase 4 | Harness tests distinguish empty, partial, stale, and failed data. |
| Unsafe mutation | Phase 4 | Capability and recurrence matrices pass automated and manual checks. |
| Screenshot-only UI | Phases 2-5 | Scenario matrix passes browser, accessibility, and viewport checks. |

## Sources

- [Home Assistant Calendar integration](https://www.home-assistant.io/integrations/calendar/).
- [Home Assistant Calendar entity developer documentation](https://developers.home-assistant.io/docs/core/entity/calendar/).
- [Calendar Card Pro](https://github.com/alexpfau/calendar-card-pro) release notes and documented failure/performance fixes.
- [Family Calendar Card](https://github.com/tienou/family-calendar-card) event-management and wall-display documentation.
- Repository codebase map and current npm audit results.

---
*Pitfalls research for: Moran Family Board Card*
*Researched: 2026-09-11*
