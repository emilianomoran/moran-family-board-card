# Calendar architecture and change map

Status: code-backed reference, 2026-09-23. Build/delivery checkpoints live in [STATUS](STATUS.md).
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
| Scoped view/hidden-person/zoom persistence and invalidation | `src/preferences.ts` | `src/preferences.test.ts`; daily-use and zoom-preferences harness |
| Shared Day/Timeline/Week density defaults and bounds | `src/calendar-density.ts` | preference validation plus density browser suites |
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
- Wall Month's `_expandedMonthDate` is a transient absolute local-date timestamp, not a
  cached event list. Render overflow from current filtered `byDay` items. Keep the disclosure
  after the first three cards so Tab reaches revealed appointments; use native button
  activation and prevent the enclosing date from also navigating. Expansion anchors that
  button vertically within scroll bounds and grows only its week row. Month paging/Today/kiosk return,
  view/config/preference-identity changes clear it. No persistence or additional reads.
  Restricted narrow Month shares one 784px width across headings/grid; valid compact Day
  drilldown is unchanged. No-Day/hidden-weekend cells are labeled groups (D32).
- `read_only: true` blocks create/edit/delete/drag paths, including stale handlers.
  The inherited writable code is not permission to enable editing in the pilot.
- Day's `_showDayAgenda` uses `_dayOverflow` only in wall mode without enabled Agenda (D34).
  This stores absolute date/person, never event snapshots. `_renderDayOverflow` derives
  current filtered rows and keys them by occurrence plus duplicate-copy ordinal to preserve
  DOM/focus identity. The list remains mounted but hidden/inert during event details.
  Each modal level owns its restore target; shared Tab/Escape logic selects only the active
  overlay. Removed event/trigger targets fall back to the list Close/selected date.
  Midnight anchors the inspected date; kiosk does not dismiss the list. View/config/disconnect
  clears it. No additional source reads or persisted state; enabled Agenda retains its route,
  and legacy is unchanged.
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
- Wall tabs use transient `_viewTabFocus` / `_dayTabFocus` for a roving entry stop (D33).
  `_onTabKeyDown` moves focus only; native Enter/Space uses the existing click handlers.
  Leaving a group restores the selected entry stop. Only the tab track is scrolled; never
  use broad `scrollIntoView` here. Each active view's existing scroller is the labeled
  `calendar-panel`, not a new flex wrapper. All IDs are scoped to this card's shadow root.
- Only view, hidden indices and optional validated Day/Timeline/Week scales are persisted,
  scoped to user/dashboard/card plus config signature. No events, names, secrets, selected
  dates or scroll offsets in local storage. `remember_preferences` controls all three.
- Preference payload v2 keeps the stable v1 key namespace to discover older records.
  Restore accepts v1/v2, migrates view/filters, allowlists fields and rewrites the accepted
  record. Each zoom value carries a hash of its configured defaults: Day height/fit,
  Timeline width, fixed Week default 100%. Mismatches discard only that scale, durably when storage is writable.
  Reset omits only the active override; it does not store the fitted/effective scale.
  Missing HA user, opt-out or inaccessible storage uses unsaved behavior. No cross-tab or
  cross-device synchronization. R18 ignores/drops optional Week while retaining Day/Timeline;
  r17 and earlier ignore v2 on downgrade (D30/D31).
- Wall Day density uses `_dayHourHeight` as an optional in-memory override. `_setDayDensity`
  remembers the old time/lane anchor before changing scale; Reset resumes fit measurement
  before restoring it. Keep `_maybeScrollToNow` from superseding this anchor. Only wall Day
  reads the override. Config/reload restores only a matching browser preference;
  otherwise it uses configuration/fit. D30 supersedes D27's session-only rule.
- Wall Day uses flex remaining height, not `_applyFullHeight`'s legacy viewport cap.
  Duration-scaled Day blocks have a 16px floor; do not restore the blanket 48px minimum
  that makes compact appointments overlap. Timeline retains its separate 48px lane minimum.
- Wall Timeline uses independent `_timelineZoomWidth`, read through `_timelineHourWidth`.
  The shared `_setDensity`/popup delegates to the active view. `_rememberTimelineScroll`
  captures time after pinned names plus vertical scroll before changing scale; `_restoreTimelineScroll`
  restores after render/load or a measurable ResizeObserver retry. Rapid input retains the
  original anchor. Config/disconnect/view/Today cancel obsolete anchors; a changed date
  invalidates them. Restore records the once-per-entry key so ordinary zoom is not recentered.
  D30 persists the manual scales, never these scroll anchors or provider data.
- Week uses `_weekDensity` percent and the grid-local `--week-scale` runtime value, not
  hourly geometry. The default is visually unchanged. Spacing/type scale, with 12px text
  and 48px target floors; fixed headings and 180px column minima remain. `_rememberWeekScroll`
  captures visible date/fraction and horizontal position; `_restoreWeekScroll` runs after
  render or a measurable ResizeObserver retry. Loading/hidden panels defer; new interaction,
  date/view/config, kiosk return or disconnect invalidates the transient anchor (D31).
  `_requestListDateScroll` also queues Week entry/configuration, explicit paging and Today
  with an absolute `date` and zero row fraction (D36). Navigation additionally waits for
  matching successful data; density retains its existing snapshot behavior. Both preserve
  horizontal position and use the same restore/cancellation path. No ordinary-update or
  automatic week-rollover recentering. Wall date labels align to row tops, keeping their
  existing horizontal pinning; no extra sticky layer or stored scroll state.
- `nowProvider` is the shared display-clock seam. Production uses real time; harness uses
  a fixed date. Header time reuses `formatTime` and the minute tick, not a second timer.
- Wall Agenda uses transient `_agendaScrollDate` for entry/configuration, explicit week
  paging and Today (D35). `_restoreAgendaScroll` waits for matching data and measurable
  layout, then scrolls only `.agenda` to its absolute `data-date` group within browser
  bounds. Missing dates use the next real group or the last earlier one; failed empty
  reads wait for retry. Wheel/pointer/keyboard input cancels pending work. Ordinary updates
  and automatic week-offset bookkeeping must not create a new request. No focus movement,
  extra fetch, timer or persisted state; legacy is untouched.

- Wall Month's explicit `_thisMonth` action sets transient `_monthScrollDate` and requests
  a render even if the month/day values are unchanged (D37). `_restoreMonthScroll` waits
  for current data/layout, then reveals the date label vertically and its cell horizontally
  inside `.monthwrap`, accounting for the pinned weekday heading. Already visible axes
  remain still. Grid input and obsolete date/view/config/kiosk/disconnect cancel it.
  Reuse the existing update/ResizeObserver paths; no new timer or automatic entry/paging
  request. Failed reads wait for retry. Ordinary updates, legacy and preferences are unchanged.

## Extension seams, not prebuilt modules

Density belongs in view geometry plus scroll-anchor handling. Household modules need
their own model/adapter and should not force operations rails back into the calendar.
Future Bridge writes must sit behind authenticated server-side/HA APIs and preserve
series/occurrence identity. Extract components only when a real feature needs the boundary.

## Known limits

The main controller still owns substantial rendering/state code. Status lookahead depends
on the active loaded range; all-day events are excluded from busy selection. Time helpers
use browser Date/Intl with HA language and time-format preferences; do not claim cross-zone
travel semantics beyond tested behavior. Density outside Day/Timeline/Week and final wall
hardware remain open. DST tests set Chicago in the parent Vitest config before workers;
the runtime still uses the user's browser/HA display context (D28).
