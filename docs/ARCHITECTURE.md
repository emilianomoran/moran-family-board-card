# Calendar architecture and change map

Status: code-backed reference, 2026-09-21. Build/delivery checkpoints live in [STATUS](STATUS.md).
See [ADR 0001](adr/0001-implementation-base.md)
for the accepted implementation choice. This is the current map, not the older `.planning` proposal.

## Runtime and data ownership

```text
External calendar providers
  -> Home Assistant calendar integration and authenticated range API
     -> calendar-source.ts: one read per unique calendar, explicit outcomes
        -> events.ts: parse, route to people, dedupe owner copies, split, lay out
           -> FamilyBoardCard: active date/view, filters, health, details, recovery
              -> wall-shell.ts + active Day / Timeline / Week / Month / Agenda

Mac EventKit -> Calendar Bridge -> independent read-only comparison during audits
                                 (not the card's runtime data path)
```

HA supplies `hass`; the card holds no provider credential or second event database.
The build emits one ES module and registers `moran-family-board-card` plus its editor.
Default rendering remains legacy; only exact `layout: wall` selects the wall shell.

## Where to make changes

| Concern | Owner | Tests / proof |
|---|---|---|
| Config types, view list, layout normalization | `src/config.ts`; editor consumes the same contract | `src/config.test.ts` |
| Unique calendar reads, 20-second bounded wait, partial/missing/error outcomes | `src/calendar-source.ts` | `src/calendar-source.test.ts`; integrity/recovery harness |
| Shared-person routing, display title cleanup, occurrence identity, all-day and overlap math | `src/events.ts` | `src/events.test.ts`, `src/event-details.test.ts` |
| Day stepping, weekday restrictions, month clamping, swipe threshold | `src/calendar-navigation.ts` | `src/calendar-navigation.test.ts`; navigation/view-context harness |
| Scoped view/hidden-person persistence and invalidation | `src/preferences.ts` | `src/preferences.test.ts`; daily-use harness |
| Locale labels and time/date formatting | `src/localize.ts`, `src/editor-i18n.ts` | `src/localize.test.ts`; locale browser cases |
| Wall header, clock, Status disclosure placement, responsive/view CSS | `src/wall-shell.ts` | chrome, presentation and view-switcher harness |
| Controller, data generations, selection, dialogs, view templates, scroll anchors | `src/ha-family-board-card.ts` | all compiled-card scenarios |
| Visual editor and form normalization | `src/editor.ts` | typecheck; editor round-trip suite remains a backlog item |
| Generic deterministic UI fixtures | `dev/harness.html`, `dev/*-check.mjs` | `npm run test:harness` |
| Distribution | `rollup.config.js`, `dist/moran-family-board-card.js`, `hacs.json` | build; separate release/install checks |

## Invariants

- Fetch a shared calendar once; route an occurrence to multiple owners when it matches.
  Do not dedupe away legitimate owner copies. Narrow Month counts unique occurrences,
  respecting visible owners. Keep raw source titles separate from cleaned display titles.
- All-day ends are exclusive dates. Timed events can span midnight and DST. Use the shared
  event/date helpers instead of adding fixed 24-hour milliseconds to local calendar days.
- An empty successful source is not a failed source. Never translate incomplete data into
  “Free now.” The card reports source state and does not log raw appointment/error payloads.
- Requests use a generation/key to avoid obsolete responses replacing current navigation.
  Every read path defers while hidden. Wake/refocus/reconnect requests fresh data.
- An inspected event is identified by calendar/occurrence, not title alone. Ambiguous,
  moved or missing data gets an honest warning; absence is not proof of cancellation.
- `read_only: true` blocks create/edit/delete/drag paths, including stale handlers.
  The inherited writable code is not permission to enable editing in the pilot.
- Dates/filters survive view changes. Day time/lane anchors survive navigation, person
  toggles and Status expansion. Today intentionally recenters; background ticks do not.
- Wall Timeline uses a remaining-height flex scroll container. Rows and bars grow into
  spare height, but overlapping lanes retain 48px event targets. Legacy keeps its original
  fixed lane size. Do not reintroduce a viewport-height cap inside a full-height wall shell.
- `_maybeScrollToNow` handles Day and wall Timeline after loading and layout. Timeline
  measures the pinned names and shares `_timelineHourWidth` with its renderer. Respect
  the once-per-entry key, explicit Today override, hidden-panel retry and stale-frame guards.
- The shared wall date strip keeps weekday and number centered within a 40px group at
  the cell's 12px left inset. Do not center that group across the whole cell (D26).
- Only view and hidden indices are persisted, scoped to user/dashboard/card plus config
  signature. No events, names, secrets, selected dates or scroll offsets in local storage.
- `nowProvider` is the shared display-clock seam. Production uses real time; harness uses
  a fixed date. Header time reuses `formatTime` and the minute tick, not a second timer.

## Extension seams, not prebuilt modules

Density belongs in view geometry plus scroll-anchor handling. Household modules need
their own model/adapter and should not force operations rails back into the calendar.
Future Bridge writes must sit behind authenticated server-side/HA APIs and preserve
series/occurrence identity. Extract components only when a real feature needs the boundary.

## Known limits

The main controller still owns substantial rendering/state code. Status lookahead depends
on the active loaded range; all-day events are excluded from busy selection. Time helpers
use browser Date/Intl with HA language and time-format preferences; do not claim cross-zone
travel semantics beyond tested behavior. Final density and wall hardware remain open.
