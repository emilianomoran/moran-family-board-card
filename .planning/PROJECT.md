# Moran Family Board Card

## What This Is

Moran Family Board Card is a Home Assistant-native, calendar-first family wall display. It extends an existing Lit custom card so a household can understand who is doing what and when from one shared screen, while keeping Home Assistant and the existing calendar systems as the data and automation layer.

The initial release focuses on a highly legible, touch-friendly calendar. Meals, lists, chores, and deeper logistics remain possible extensions after the calendar experience proves dependable in daily use.

## Core Value

At a glance, every family member can reliably understand who is doing what and when.

## Requirements

### Validated

- ✓ The card reads multiple Home Assistant `calendar.*` entities and renders day, timeline, week, month, and agenda views — inherited codebase.
- ✓ The card handles all-day, overlapping, cross-midnight, and multi-day events with locale-aware time formatting — inherited codebase.
- ✓ The card supports a visual editor, weather, now/next information, kiosk return behavior, and capability-gated event actions — inherited codebase.
- ✓ Shared calendar events can be routed to one or more configurable person lanes without duplicating source calendars — Moran fork foundation.
- ✓ The renamed package, bundle, and custom element can coexist with the upstream Family Board Card — Moran fork foundation.

### Active

- [ ] Deliver an opt-in wall-calendar mode optimized for a 1920x1080 landscape display.
- [ ] Make people, dates, current activity, next activity, and shared events understandable within seconds.
- [ ] Preserve useful calendar views and make navigation comfortable on a touchscreen and tablet.
- [ ] Keep existing configurations backward compatible while reducing the risk of the current monolithic renderer.
- [ ] Show honest loading, empty, stale, unsupported, and error states.
- [ ] Add automated behavioral and visual coverage for the card, editor, and representative wall layouts.
- [ ] Package and document a reversible Home Assistant pilot without changing live configuration during development.

### Out of Scope

- Meals, shopping lists, chores, rewards, and photo screensavers — worthwhile but explicitly secondary to validating the calendar.
- A standalone React application — it would duplicate Home Assistant authentication, calendar access, theming, device state, and deployment work.
- Direct browser access to Calendar Bridge — its localhost boundary and credentials require a Home Assistant-side adapter before it can be used safely.
- Household-specific names, entity IDs, addresses, or credentials in this public repository — all examples and fixtures stay generic.
- Replacing the external calendar provider — Home Assistant remains an integration and display layer, not the calendar system of record.

## Context

- The project is a personal GitHub fork of `renespeaker/ha-family-board-card`, distributed as its own HACS-compatible dashboard card.
- The fork already includes configurable title-prefix, contains, and regular-expression routing for shared calendars, plus an unmatched/shared lane.
- Skylight Calendar establishes the interaction benchmark: a persistent touch display, unified calendars, person colors and filters, day/week/month views, direct event interaction, weather, and optional household operations.
- Calendar Card Pro and Week Planner Card are useful reference implementations for agenda/column density, customization, responsive behavior, editor design, caching, and failure handling.
- A newer open-source `family-calendar-card` offers a more direct Skylight-style implementation with CRUD and recurrence. Phase 1 must compare it against this fork before major restructuring; a pivot requires a documented decision, not a second untracked codebase.
- Local Calendar Bridge supports richer Apple Calendar mutations and recurring-event identity, but is not safely browser-accessible. It is a v2 provider candidate behind an authenticated Home Assistant boundary.
- The existing main card file is roughly 3,800 lines. New wall-mode work should introduce seams rather than grow the monolith indefinitely.

## Constraints

- **Host platform**: The deliverable remains a Home Assistant custom card built with TypeScript and Lit — this preserves native dashboard, theme, authentication, and entity access.
- **Compatibility**: Existing non-wall configurations and all supported views must continue to work — the wall experience is opt-in until validated.
- **Source of truth**: Calendar events remain owned by the connected external calendars — the card does not invent a second calendar database.
- **Security**: No tokens, private household configuration, or direct Calendar Bridge credentials may enter dashboard config, fixtures, logs, or the repository.
- **Live safety**: No files under `/Volumes/config` change during implementation. A live pilot requires targeted backup, two independent Sonnet plan reviews, a configuration check where applicable, and explicit verification; if Sonnet is unavailable, Emiliano must approve any substitute.
- **Distribution**: The built `dist/moran-family-board-card.js` remains committed and HACS-compatible, and upstream attribution remains intact.
- **Quality**: `npm run format:check`, `npm run lint`, `npm test`, and `npm run build` must pass for every release candidate.
- **Privacy**: Public examples use generic people and entities only.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build inside Home Assistant instead of a standalone React app | Home Assistant already owns authentication, calendars, dashboard hosting, themes, weather, and household entities | ✓ Good |
| Track product planning beside implementation in this dedicated fork | Keeps requirements, decisions, code, and releases in one versioned repository | ✓ Good |
| Make the calendar the v1 product | It carries the clearest daily value; meals and lists can follow without delaying validation | ✓ Good |
| Keep wall mode opt-in | Protects upstream-compatible behavior and permits side-by-side evaluation | — Pending |
| Compare the fork with `tienou/family-calendar-card` before structural investment | The newer project covers several formerly missing capabilities and may provide reusable patterns | — Pending |
| Keep Calendar Bridge behind a future Home Assistant-side adapter | Direct browser access would weaken security and deployment reliability | ✓ Good |

## Evolution

After each phase, move shipped and verified requirements from Active to Validated, record scope changes and decisions, and confirm that the Core Value still drives prioritization. After each milestone, review every exclusion before promoting deferred work.

---
*Last updated: 2026-09-11 after GSD project initialization*
