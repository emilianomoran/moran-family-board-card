# Research and reference map

Status: consolidated 2026-09-21 from repository research dated 2026-09-11, the accepted ADR,
user-supplied reference reviews and later implementation findings. **This is not a new
live audit of competitor products.** Features, hardware, prices and subscription tiers may
have changed. Recheck official sources before making new claims or purchase recommendations.

## What the research established

The product goal is Skylight-like family comprehension, not feature-for-feature cloning.
The accepted route is the existing HA-native Family Board fork. It already had the useful
person/time model and five views; routing shared calendars avoids forcing provider changes.
HA handles authentication, sources and hosting. A React app would duplicate those duties.
The source-level alternative comparison is settled by [ADR 0001](../adr/0001-implementation-base.md).

## Skylight UI/feature findings and disposition

These are the findings retained from the original official-material review. They are not
claims that every interaction was tested on physical Skylight hardware.

| Pattern / feature | Why it matters here | Project disposition |
|---|---|---|
| Persistent shared calendar display | A household should understand the day at a glance | Core objective; final wall hardware remains unselected/unverified |
| Multiple calendar sources and family colors/profiles | Reduce calendar-hopping; make ownership clear | HA aggregation plus person lanes, names/avatars/colors and shared routing |
| Day/week/month planning horizons | Different tasks need different time scales | Retain inherited Day/Timeline/Week/Month/Agenda rather than reduce to parity |
| Touch navigation and event details | Usable without a keyboard or hovering | Read-only details, reachable controls and discrete dates; desktop inputs also work |
| Current date/time and ambient context | Orient someone walking past the screen | Today/now indication and compact header clock; avoid excessive fixed rows |
| Weather context | Can help schedule decisions | Existing configurable HA weather, not event-address forecasting; no new weather scope |
| Event management | A useful later workflow but recurrence is consequential | Active pilot stays read-only; richer editing is deferred |
| Meals, lists, chores/tasks and related household features | Nice-to-have value beyond the calendar | Separate future modules, not an operations rail required for v1 |
| Photos/rewards/import/AI ideas | Broader commercial-product inspiration | Research-only; no adopted scope or verified current tier/pricing claim |

Original source: [Skylight Calendar 2 product page](https://myskylight.com/products/the-skylight-calendar-2-classic-sage-with-plus-plan/).
The source may redirect or change; the repository's dated research is the provenance record.
No Skylight account, firmware, device interaction log or exhaustive pixel audit is stored here.

## Alternatives considered

| Option | Useful reference | Decision / evidence |
|---|---|---|
| [Family Board Card](https://github.com/renespeaker/ha-family-board-card) | Person columns, shared time axis, five existing views and event math | Selected fork base; preserve MIT attribution in NOTICE/LICENSE |
| [Calendar Card Pro](https://github.com/alexpfau/calendar-card-pro) | Agenda/columns, readable calendar summaries, documented reliability/performance patterns | Reference, not another active implementation project |
| [Week Planner Card](https://github.com/FamousWolf/week-planner-card) | Multi-day responsive planning grids | Reference, not the base or a required runtime dependency |
| [Family Calendar Card](https://github.com/tienou/family-calendar-card) | Closer Skylight-like wall composition, filtering and touch patterns | Evaluated at pinned source; migration would recreate required routing/views/contracts. ADR says continue this fork |
| Custom React site | Freedom outside HA dashboard constraints | Not selected. Revisit only with explicit scope and evidence that HA constraints outweigh migration/regression costs |

Do not treat current READMEs as proof that any alternative still has exactly the 2026-09-11
feature set. The ADR's pinned source comparison has stronger provenance than broad marketing claims.

## Fantastical and iOS interaction references

The user called Fantastical the mobile usability gold standard. Accepted patterns:

- Fixed time reference while scrolling a dense calendar; dates snap instead of arbitrary stops.
- Distinct full-width day cells, separators, larger weekday/date labels and a full-cell selected
  state. Today's circular marker remains distinct from a different selected date.
- A separate neutral rounded segmented control for Day/Timeline/Week/Month/Agenda. Do not
  confuse those view tabs with the date cells, or restore the rejected tiny centered date cluster.
- Preserve time context while moving dates. Current implementation uses month-label
  swipe/keyboard plus compact day arrows; the grid scrolls people/time. It is not a native carousel.

Evidence: user-supplied Fantastical screenshots reviewed on 2026-09-16, and the
[official calendar-view guide](https://flexibits.com/fantastical-ios/help/calendar-views).
The images contain private appointments and are intentionally not committed. D07/D12 retain
their relevant visual findings. Exact native gesture physics was not independently audited.
D20/D21 supersede early spacing/heading choices with compact chrome and the current title/clock.

## Original in-repo research archive

These files remain available for depth and provenance. Their phase order, checkboxes,
mandatory reviewer language, old missing-feature lists and version counts are historical.

- [Research summary](../../.planning/research/SUMMARY.md)
- [Feature landscape and comparison](../../.planning/research/FEATURES.md)
- [Stack/alternatives](../../.planning/research/STACK.md)
- [Architecture proposal](../../.planning/research/ARCHITECTURE.md)
- [Pitfalls and risk patterns](../../.planning/research/PITFALLS.md)
- [Source-level foundation investigation](../../.planning/phases/01-prove-the-foundation/01-RESEARCH.md)
- [Accepted source-pinned ADR](../adr/0001-implementation-base.md)
- [Historical visual concept](../MORAN_DESIGN_SPEC.md) and [initial fork plan](../MORAN_FORK_PLAN.md)

Current source/test/operations findings are in [ARCHITECTURE](../ARCHITECTURE.md),
[STATUS](../STATUS.md) and [calendar validation](../calendar-sync-validation.md), not the
old `.planning/codebase` inventory. Config extraction, browser coverage and wall mode were
implemented after that inventory. Its old advisory counts require a fresh audit.

## Follow-up research, only when the feature needs it

For density, use CAL-01's measured row/scroll tests, not competitor screenshots alone.
For editing, verify each actual provider's mutation/recurrence capability and authenticated
adapter design. For hardware, record the actual screen/browser/kiosk setup. For dependencies,
re-audit the current lockfile. None requires repeating the settled implementation-base debate.

When adding findings: record date, exact source/commit, what was observed, what is inferred,
confidence limits and the affected decision/backlog ID. Keep private source material outside
the repo and transfer only the useful sanitized behavior description.
