# Current status and next work

Last recorded: 2026-09-16. This is the current project status, not a release announcement.
See [DECISIONS.md](DECISIONS.md) for scope and discussion history.

## What is working

The calendar-first, read-only wall preview is installed in a private Home Assistant
dashboard. It uses the existing authenticated HA calendar integration, not a React app,
a direct browser connection to Calendar Bridge, or a second event database.

| Area | Recorded delivery state |
|---|---|
| Implementation base | TypeScript/Lit fork retained; ADR accepted; wall mode opt-in. |
| Calendar views | Day, Timeline, Week, Month, and Agenda available. Final styling across all views is not complete. |
| Calendar correctness | Shared-person routing, unmatched lane, intended duplicate owner copies, all-day exclusive ends, midnight segmentation, and DST tests covered. |
| Read-only pilot | Details and navigation available; create/edit/delete/drag writes blocked, including stale handlers. |
| Recovery | Polling, wake/focus, page restoration, reconnect, partial-source failures, and stale-response handling implemented and synthetically tested. |
| Basic presentation | Circular avatars, dated Day heading, locale-aware 12/24-hour axis, reachable narrow controls, and person-grid scrolling implemented. |
| Lane alignment | Headers, all-day rows, and timed columns share sizing on resize and hide/show; `0.25.1-moran.3` deployed. |
| Full-day range | Pilot uses hours 0–24, no trimming, and initial scroll to now. Config-only change; package defaults remain 6–22. |
| Status tiles | Existing current/next behavior remains; accepted terminology and diagnosed limitations are documented below. |

Current application checkpoint: `42495b0f572dc7ddf226bff432f075168f43ffe1`, version
`0.25.1-moran.3`, on `feature/moran-foundation`. The private pilot uses a dated bundle.
This checkpoint was committed locally, not pushed or published as a GitHub/HACS release
in the recorded deployment work. Laptop preview servers are separate from the installed
HA dashboard and do not update its bundle automatically.

## Verification completed

These are recorded results from 2026-09-16, not tests rerun by this documentation change:

- 79 unit tests, TypeScript, source formatting, build, and whitespace checks passed for
  the current app checkpoint.
- 19 synthetic browser scenarios passed, including legacy compatibility, narrow/desktop
  layouts, panning, calendar integrity, recovery, and lane alignment.
- Alignment tests cover 1/4/7 people and 29 visibility/resize states per viewport.
  Actual HA checks at desktop and phone widths found 0px row misalignment after toggles,
  resizing, and two-axis scrolling.
- A six-week read-only audit compared 144 source occurrences between Calendar Bridge and
  HA. All matched after normalizing all-day end conventions and matching four differing
  occurrence IDs by unique exact content. Routing retained 153 intended person copies.
  This proves snapshot parity, not provider-to-HA propagation latency.
- Native scrolling reached both ends of the 24-hour grid at 746×777, 390×844, and
  1920×1080. Another date retained its full range and aligned all-day row.
- HA config/asset checks and Core validation passed. No real appointment was created,
  edited, or deleted for these tests. No Family Board browser errors were observed;
  unrelated HA/custom-card errors were recorded separately, not described as a clean
  console for the entire HA installation.

## Status tiles: current rules and known issue

The tiles describe actual clock time, not the selected date. Their candidate events come
from the range already loaded for the active view: one displayed week for non-Month views,
or the visible month grid for Month. If that range does not cover now, status is unavailable.

| Display | Current selection rule |
|---|---|
| Current event | A timed event satisfies `start <= now < end`. If several overlap, choose the latest start, then the earliest end. |
| Next event | No current event takes display precedence, so show the earliest future timed event in the loaded range. No same-day or soon cutoff exists. |
| Free | No current/future timed candidate, the loaded range covers now, and every configured source for that lane is healthy. This is not a complete availability claim. |
| Schedule unavailable | Loading, missing current-time coverage, or incomplete lane sources prevent a free claim and no known event is displayed. A known event can still be shown from a healthy source while another source fails. |

All-day events are excluded. A distant next event prevents the tile from displaying “free,”
even though the person has no current timed appointment. Changing loaded ranges can change
which future events are considered; the lookahead is not independent of the calendar view.

The future-event countdown was confirmed to extend outside its clipped line in the actual
pilot: 159px of content inside a 112px text area. The title remained visible while almost
all of the time qualifier disappeared. The cause was diagnosed; no fix or redesign has
been applied.

Implementation references: `selectTimedActivity` in [events.ts](../src/events.ts),
`_focusFor`, `_focusComplete`, and `_renderFocus` in
[ha-family-board-card.ts](../src/ha-family-board-card.ts), and `formatCountdown` in
[localize.ts](../src/localize.ts).

## Next work and open decisions

| Item | State | Acceptance or unresolved question |
|---|---|---|
| Today recenters on current time | Recommended; not implemented or accepted as a new work batch | Explicit Today action should return to the current date and bring now into view, including on a previously visited day. Initial auto-scroll alone does not do this consistently. |
| Remember hidden people and selected view | Recommended; not implemented or accepted as a new work batch | Survive refresh; decide scope per card/device/browser and behavior when configured people change. Do not retain private event payloads for this. |
| Status tiles separate availability and next event | Recommended; terminology accepted, redesign not yet approved | Keep the date/time qualifier visible. Decide lookahead, all-day treatment, and overlap wording before claiming accurate availability. |
| Fantastical-inspired date snapping | Accepted direction; interaction design and implementation pending | Keep the time axis fixed, date/content synchronized, and time context stable. Resolve person scrolling versus date paging without ambiguous gestures. |
| Physical iPhone/Safari sleep and wake | Verification pending | Confirm recovery after backgrounding, lock/unlock, and reconnect on the real device. Phone-sized desktop tests are not this evidence. |
| Actual provider propagation | Verification pending | Confirm ordinary source changes and cancellations reach HA and the card. Synthetic changes and snapshot parity do not measure real propagation. No live appointment mutation is authorized merely for testing. |
| Portrait wall display | Requirement raised; final hardware/layout open | Record actual resolution, browser, orientation, and kiosk wrapper before calling the physical setup verified. |
| Full visual design | Deferred until calendar behavior is dependable | Refine consistent navigation, density, and all five views; the old operations-rail concept is not the current acceptance target. |
| Meals, lists, chores, logistics, Bridge editing | Deferred | Keep extension boundaries; do not expand current calendar work into these modules without an explicit scope decision. |

This list tracks work; it does not introduce GSD phases or approval gates. Once the user
authorizes a scoped change, implement and verify it directly, then update this page and the
relevant decision entry.
