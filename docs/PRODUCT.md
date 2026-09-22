# Moran Calendar product brief

Status: current requirements summary, 2026-09-22. This describes the product contract,
not a new design approval or a list of unfinished features. Delivery is in [STATUS](STATUS.md);
future work is in [BACKLOG](BACKLOG.md); rationale is in [DECISIONS](DECISIONS.md).

## Purpose and boundaries

A shared family calendar that answers who is doing what and when, on a wall display and
in the HA phone app. Skylight supplies the product reference; Fantastical supplies the
mobile interaction reference. Neither brand is copied or required at runtime.

Use the existing HA-native Lit fork. HA supplies authentication, calendar access, locale,
themes and hosting. External calendars own appointments. Do not create a second calendar
database or require separate calendars per person. Calendar Bridge is currently an
independent comparison path, not this card's server or feed.

The active pilot is read-only. Meals and lists are nice-to-have; chores, logistics,
rewards, photos, imports and editing are later scope. The historical 68/32 operations
rail is not an acceptance target. There is no standalone React implementation to continue.

## Accepted calendar contract

| Area | Required behavior | Decision |
|---|---|---|
| Ownership | Route shared events into every matching person lane; keep an unmatched lane where configured. Joint copies are intentional. | D03 |
| Views | Day, Timeline, Week, Month, Agenda. View changes preserve browsing date and person filters. | D04, D17 |
| Navigation | Fixed time reference, distinct dates, discrete Day paging, Today recentering and context retention. Grid panning scrolls people/time, not dates. | D07, D11 |
| Daily range | Pilot midnight to midnight, no trimming, initial scroll near now. Package defaults are not changed. | D08 |
| Status tiles | Separate current availability from dated next appointment. Failed/incomplete data never establishes Free now. | D09 |
| Identity | Circular avatars, names/initials, no color-only ownership. HA time-format preference. | D06 |
| Responsive behavior | Reachable controls and lanes on desktop, touch, narrow and embedded cards. Person headers, all-day row and grid remain aligned after resize/filtering. | D06, D07 |
| Details | Read-only fields, exact occurrence refresh, honest missing/stale warnings, contained keyboard focus and restored scroll. | D14 |
| Recovery | Fresh visible/wake/reconnect reads, bounded requests and rejection of obsolete results. Hidden-page requests cannot undermine wake recovery. | D15 |
| Compatibility | Only exact `layout: wall` opts into the new shell. Preserve default/legacy behavior. | D04 |

## Current visual contract

This replaces the early screenshot/concept, not the entire product design:

- One 48px header; neutral iOS-like view capsule capped at 40px with 34px pills.
- Configured preview title “Moran Calendar”, current time 12px after it. At or below the
  700px container breakpoint, multi-view cards hide title/time to retain controls;
  accessible identity remains. Single-view cards retain the brand.
- A people/disclosure button expands Status tiles. Start collapsed, retain expansion
  through view changes, reset on new card/config. No persistent disclosure preference.
- No separate Today heading row in wall Day/Timeline. Month/year and small Today/arrows
  sit beside date cells. Weekday and number share a centered 40px group, placed 12px
  from each cell's left edge, with natural numeral spacing (D26). Today and the
  selected date have different visual treatments. Date-strip scrolling does not select a day.
- Day keeps person columns. Narrow Month provides counts and date-to-Day drilldown;
  restricted configurations keep appointments reachable. Week has pinned date/person
  headers; Agenda wraps long content. Month and Agenda share person filters.
- Timeline fills the remaining wall panel with growing person rows and event bars.
  Overlapping lanes keep 48px event targets; short panels scroll instead of clipping.
  Names remain pinned horizontally and the hour axis remains pinned vertically (D24).
  Today's Timeline opens near now; Today recenters it. Ordinary refreshes and resizing
  preserve manual time browsing, and other dates do not jump to today's clock (D25).
- Wall Day and Timeline share a header zoom disclosure, not another fixed row. Each keeps
  independent, session-only density: Day hour height, Timeline hour width. Both anchor
  the visible time/people within scroll limits; Reset restores the active view's configuration.
  Manual Day zoom overrides fit until Reset. Short Day events retain title strips and details rather than stretching
  over neighboring events; Agenda offers larger targets. Initial choices are in D27.
  Timeline keeps its row heights/overlap targets and pins both midnight labels inside the
  time area. Compact zoom uses two-hour labels over an hourly grid (D29).

See D18–D21, D27 and D29 for exact scope. Older blanket 48px target rules do not override the
compact header controls or duration-scaled Day title strips. Other targets retain their tested sizes.

## Status tiles are not presence or unlimited availability

Tiles describe real now, not the selected day. They use timed events in the loaded week
or visible month grid. All-day events do not make someone busy. “Free now” requires healthy
lane sources, coverage of now and no current timed event. A next appointment can be days
away and must show its date. Independent lookahead and richer busy policies remain open.
The detailed rules and overlap tie-breaker are in [STATUS](STATUS.md#status-tiles-current-rules-and-known-issue).

## Acceptance boundaries

The read-only daily-use baseline is complete under the agreed scope. Real source parity,
synthetic recovery and UI tests are distinct kinds of evidence. Physical HA-app wake refresh
is user-confirmed; exact provider edit latency was waived, not measured. Final portrait
hardware, distance legibility, complete visual design and publication remain separate work.

The next agent should improve a bounded calendar feature without requiring the user to
design every screen first. A backlog idea does not authorize unrelated integrations or writes.
