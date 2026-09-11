# Architecture Research

**Domain:** Home Assistant family wall-calendar custom card
**Researched:** 2026-09-11
**Confidence:** HIGH for Home Assistant integration; MEDIUM for final component cuts until Phase 1

## Standard Architecture

### System Overview

```text
┌──────────────────────────────────────────────────────────────┐
│ Home Assistant dashboard host                                │
│ theme · locale · auth · entity state · WebSocket connection  │
├──────────────────────────────────────────────────────────────┤
│ Moran Family Board custom element                            │
│  ┌─────────────┐ ┌───────────────┐ ┌─────────────────────┐  │
│  │ Wall shell  │ │ View router   │ │ Editor/config       │  │
│  └──────┬──────┘ └──────┬────────┘ └──────────┬──────────┘  │
│         │               │                     │             │
│  ┌──────▼───────────────▼─────────────────────▼──────────┐  │
│  │ Calendar application model                            │  │
│  │ normalized events · people · filters · capabilities   │  │
│  └──────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────▼─────────────────────────────┐  │
│  │ Home Assistant calendar adapter                        │  │
│  │ fetch/subscribe · create/update/delete · errors        │  │
│  └──────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────┘
                              │ authenticated HA boundary
               ┌──────────────▼──────────────┐
               │ calendar.* / weather.*      │
               │ external provider remains  │
               │ source of truth             │
               └─────────────────────────────┘

Future only:
card → authenticated Home Assistant adapter → Calendar Bridge → Apple Calendar
```

### Component Responsibilities

| Component | Responsibility | Recommended Implementation |
|-----------|----------------|----------------------------|
| Card controller | Own configuration, selected view/date/filter, and orchestration | Thin Lit custom element. |
| Calendar adapter | Read and mutate calendar data through Home Assistant; report capabilities and failures | Typed service with no rendering. |
| Event model | Normalize raw events, route people, split spans, compute overlaps and derived now/next data | Pure TypeScript functions and immutable values. |
| Wall shell | Header, primary navigation, layout regions, and responsive density | Lit component with shared tokens. |
| View components | Render day, timeline, week, month, and agenda from the same model | One component or focused render module per view. |
| Interaction controller | Details/create/edit/delete flows and capability rules | Shared dialog/action layer, not duplicated per view. |
| Editor | Produce valid configuration and migrate legacy defaults | Existing custom editor, sharing config types/defaults with the card. |
| Test harness | Deterministic Home Assistant fixtures and viewport scenarios | Generic data only; usable by local browser and Playwright. |

## Recommended Project Structure

```text
src/
├── card/
│   ├── moran-family-board-card.ts
│   └── card-state.ts
├── components/
│   ├── wall-shell.ts
│   ├── status-header.ts
│   ├── profile-filter.ts
│   └── event-dialog.ts
├── views/
│   ├── day-view.ts
│   ├── timeline-view.ts
│   ├── week-view.ts
│   ├── month-view.ts
│   └── agenda-view.ts
├── calendar/
│   ├── adapter.ts
│   ├── ha-calendar-adapter.ts
│   ├── model.ts
│   ├── normalize.ts
│   ├── routing.ts
│   └── layout.ts
├── config/
│   ├── types.ts
│   ├── defaults.ts
│   └── migrations.ts
├── editor/
├── localize.ts
└── index.ts
```

This is a target shape, not a required big-bang move. Phase plans should extract only the seams needed for the next user-visible behavior.

### Structure Rationale

- **`calendar/`:** makes provider behavior and error semantics testable without DOM rendering.
- **`views/`:** prevents the current main file from accumulating five independent render systems.
- **`components/`:** provides a stable wall shell shared by views.
- **`config/`:** eliminates duplicated `PersonConfig` and default logic between the card and editor.
- **`card/`:** keeps the custom-element lifecycle and state transitions visible in one place.

## Architectural Patterns

### Pattern 1: Ports and Adapters for Calendar Data

**What:** Views consume a normalized model through a narrow interface; Home Assistant API details stay in an adapter.

**When to use:** Immediately for new work, because Calendar Bridge may become a second server-side provider later.

**Trade-offs:** Adds a small amount of indirection now, but avoids coupling recurrence, supported features, and error behavior to each view.

```typescript
interface CalendarAdapter {
  load(range: DateRange, calendars: string[]): Promise<CalendarLoadResult>;
  capabilities(entityId: string): CalendarCapabilities;
}
```

### Pattern 2: Pure Derivation, Thin Rendering

**What:** Routing, time slicing, overlap layout, filters, and now/next selection remain pure functions.

**When to use:** For any behavior that can be described as input events plus configuration producing view data.

**Trade-offs:** Requires explicit models but makes timezones, dense overlaps, and shared-person rules independently testable.

### Pattern 3: Opt-In Presentation Variant

**What:** `layout: wall` selects a presentation shell without creating a separate product or duplicating the calendar model.

**When to use:** During v1 so existing card configurations remain unchanged.

**Trade-offs:** Shared logic must avoid layout-specific condition sprawl; use component boundaries and tokens rather than one giant conditional template.

## Data Flow

### Calendar Read Flow

```text
HA calendar response or subscription
    ↓
adapter result (success / partial / failure)
    ↓
normalize dates and capabilities
    ↓
route events to configured people/shared lane
    ↓
derive visible date range, filters, overlaps, and now/next
    ↓
selected view renders the same normalized model
```

### Interaction Flow

```text
touch/click/keyboard action
    ↓
shared interaction controller
    ↓
capability and recurrence policy check
    ↓
Home Assistant calendar command
    ↓
refresh/subscription update or visible failure
```

### State Management

- Persisted configuration belongs in Lovelace config.
- Ephemeral state includes selected view/date, profile filters, open dialog, and transient request state.
- Derived state should be recomputed from normalized events and config, not copied into multiple mutable arrays.
- Browser persistence is acceptable only for non-sensitive display preference such as the last selected view.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| One wall display, a handful of calendars | One bundled custom element and in-memory normalized model are appropriate. |
| Several household dashboards | Cache/deduplicate identical range requests and isolate per-card filters from shared data. |
| Many calendars or long month ranges | Measure normalization/layout cost, memoize by range/config, and consider HA event subscriptions. |

### Scaling Priorities

1. **First bottleneck:** redundant calendar requests across views or repeated reactive updates; fix with request deduplication and stable derived selectors.
2. **Second bottleneck:** DOM volume in dense month/day views; fix with density limits, overflow affordances, and rendering only the active view.

## Anti-Patterns

### Renderer-Owned Integration Logic

**What people do:** call Home Assistant APIs, infer calendar features, and render error UI inside each view.

**Why it's wrong:** behavior diverges, failures become ambiguous, and a future provider becomes a rewrite.

**Do this instead:** normalize all provider results and capabilities before rendering.

### Permanent Dual UI Trees

**What people do:** copy the existing card into a separate wall component and let both evolve.

**Why it's wrong:** every event bug, accessibility fix, and new option must be implemented twice.

**Do this instead:** share model and view components; vary only shell and density tokens where practical.

### Optimistic Mutation Without Recurrence Semantics

**What people do:** expose edit/delete whenever any write feature appears available.

**Why it's wrong:** series and occurrences can be modified incorrectly, and integrations differ.

**Do this instead:** use explicit capability and recurrence policies, then display a clear read-only state when uncertain.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Home Assistant calendar entities | Authenticated frontend connection/REST or WebSocket mechanisms exposed by `hass` | Primary v1 source; support varies per integration. |
| Home Assistant weather entities | Configurable entity and forecast call | Decorative only if it does not displace calendar information. |
| HACS | Versioned JavaScript release artifact and metadata | Keep distribution name distinct from upstream. |
| Calendar Bridge | Future HA-side adapter | Never call directly from public dashboard JavaScript. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Card controller ↔ adapter | Typed async result | Includes partial failures and capabilities. |
| Adapter ↔ event model | Raw-to-normalized conversion | Timezone and all-day semantics are centralized. |
| Event model ↔ views | Immutable view model | Views do not mutate source events. |
| Editor ↔ card | Shared config schema/defaults | Prevent duplicated interfaces and migration drift. |
| Harness ↔ card | Mock Home Assistant contract | Fixtures stay deterministic and generic. |

## Sources

- [Home Assistant custom-card documentation](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/).
- [Home Assistant Calendar entity developer documentation](https://developers.home-assistant.io/docs/core/entity/calendar/).
- [Calendar Card Pro architecture and feature documentation](https://github.com/alexpfau/calendar-card-pro).
- [Family Calendar Card](https://github.com/tienou/family-calendar-card).
- `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/CONCERNS.md`.

---
*Architecture research for: Moran Family Board Card*
*Researched: 2026-09-11*
