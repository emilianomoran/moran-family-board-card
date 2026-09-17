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
| Status tiles | Availability and dated next appointment are separate; deployed in `0.25.1-moran.4`. |
| Daily-use navigation | Today recentering, saved view/person preferences, separated date cells, and neutral view switcher deployed in `0.25.1-moran.4`. |

Installed application checkpoint: `e6c1c5b0372004222ca44165eef9abab1e5fba54`, version
`0.25.1-moran.4`, on `feature/moran-foundation`, deployed 2026-09-16 at 20:44 CDT.
The private pilot uses a dated bundle.
This checkpoint was committed locally, not pushed or published as a GitHub/HACS release
in the recorded deployment work. Laptop preview servers are separate from the installed
HA dashboard and do not update its bundle automatically.

## Verification completed

### Daily-use update, 2026-09-16 at 20:44 CDT

- Candidate checks rerun: all 109 unit tests and all 30 synthetic browser scenarios passed,
  plus TypeScript, source formatting, build, and whitespace checks.
- The served HA asset matches the committed build. Preview config, 74 other resource
  registrations, and all 27 dashboard registrations remain unchanged. Core validation passed;
  the previous asset remains available for rollback. No restart or calendar mutation.
- Authenticated HA review confirmed real calendar rendering and **Free now** alongside
  **Next** with a separate Tomorrow/date-and-time line. Loading did not imply Free now.
- Hide one person → Week → actual page reload restored both choices. Returning to Day
  retained the collapsed lane. Headers, all-day cells, and timed lanes had 0px measured
  misalignment at 746×777, 390×844, and 1920×1080, including horizontal scrolling.
- Native desktop scrolling reached both midnight boundaries; Today recentered the current
  time below the sticky headers. Tomorrow updated the heading and selected date together.
- Phone-width review confirmed reachable view controls, horizontal person access, a fixed
  time axis, readable Status timing, and disabled event-detail fields with no Save/Delete.
  A long dashboard title can leave the final view partially outside the switcher's visible
  area at intermediate widths; it remains scrollable and was successfully activated.
- Page identity, meaningful content, absence of an error overlay, and screenshots checked.
  No Family Board warning/error observed after reload. Existing custom-sidebar, HA routing,
  Better Thermostat, and config-template-card messages are unrelated and remain unresolved.
- Restored Day/Today, all originally visible people, and the browser's normal viewport.
  Physical iPhone/Safari wake/reconnect and real provider propagation are still unverified.

### Earlier reliability and calendar-correctness evidence

These results were recorded earlier on 2026-09-16, not repeated by the daily-use rollout:

- 79 unit tests, TypeScript, source formatting, build, and whitespace checks passed for
  the earlier `0.25.1-moran.3` checkpoint.
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

The accepted presentation below is now installed in wall mode. The historical issue is
retained here to explain the decision; it no longer describes the wall pilot.

The tiles describe actual clock time, not the selected date. Their candidate events come
from the range already loaded for the active view: one displayed week for non-Month views,
or the visible month grid for Month. If that range does not cover now, status is unavailable.

| Display | Previous pilot behavior (`0.25.1-moran.3`); retained in legacy layout |
|---|---|
| Current event | A timed event satisfies `start <= now < end`. If several overlap, choose the latest start, then the earliest end. |
| Next event | No current event takes display precedence, so show the earliest future timed event in the loaded range. No same-day or soon cutoff exists. |
| Free | No current/future timed candidate, the loaded range covers now, and every configured source for that lane is healthy. This is not a complete availability claim. |
| Schedule unavailable | Loading, missing current-time coverage, or incomplete lane sources prevent a free claim and no known event is displayed. A known event can still be shown from a healthy source while another source fails. |

All-day events are excluded. A distant next event prevents the tile from displaying “free,”
even though the person has no current timed appointment. Changing loaded ranges can change
which future events are considered; the lookahead is not independent of the calendar view.

The previous future-event countdown was confirmed to extend outside its clipped line in the actual
pilot: 159px of content inside a 112px text area. The title remained visible while almost
all of the time qualifier disappeared. The `0.25.1-moran.4` wall pilot fixes this with the
separate wrapping timing line described below.

### Current wall presentation, deployed 2026-09-16

- Header: person name and **Free now**, **Busy now**, or **schedule unavailable**.
- A current timed event shows its title and end date/time. The next event has its own
  title and Today/Tomorrow/weekday-date plus time, even when a current event exists.
- Free now means no current timed event plus healthy, current-time-covered lane sources.
  A future appointment no longer prevents Free now. It is not a presence guarantee.
- Loading, missing current-time coverage, and incomplete sources cannot establish Free now.
  Known current/future events can still display from a healthy source during partial failure.
- Timed-only selection, overlap tie-breaking, and view-dependent lookahead remain unchanged.
  No next event in this range is not a promise that the person has no later appointments.
- Long titles truncate; timing gets a separate wrapping line and stays visible. Full title
  text remains in the DOM and hover title. Wall tiles scroll horizontally when needed.
- HA 12/24-hour preferences and English/German strings are supported. Date comparisons use
  calendar days (including DST and year boundaries), not rounded countdown durations.
- Legacy layout retains the existing current-or-next presentation.

The sample-data review URL is
`http://127.0.0.1:4173/dev/harness.html?scenario=wall&status=1`. Its fixed sample date is
intentional. This URL is the sample-data prototype; the same behavior is now in the HA pilot.

Verification: TypeScript, formatting, build, 84 unit tests, and the complete 23-scenario
browser suite passed. Four new synthetic
Status-tile browser cases cover wall widths 1920/746/390 and legacy 390: current and future
events, empty/all-day-only schedules, long titles, hide/show, 12/24-hour display, loading,
partial-source recovery, exact appointment start/end boundaries, and navigating away
from/returning to now. In-app review verified
nonblank rendering, no error overlay, clean warning/error logs, hide/show, and horizontal
tile scrolling at 390×844. This was the initial local verification; the deployment checks
above supersede its local-only delivery state. Physical iPhone/Safari remains unverified.

Reproduce with `npm run format:check`, `npm run lint`, `npm test`, `npm run build`, and
`npm run test:harness`; use `HARNESS_ONLY=status npm run test:harness` for the focused cases.
The standalone Browser plugin/skill was not available; existing repository browser tests
and Codex in-app browser controls supplied the automated and visible evidence.

Implementation references: `selectTimedActivity` in [events.ts](../src/events.ts),
`_focusFor`, `_focusComplete`, and `_renderFocus` in
[ha-family-board-card.ts](../src/ha-family-board-card.ts), and `formatStatusDateTime` in
[localize.ts](../src/localize.ts).

## Implementation history

The following local checkpoints were subsequently deployed together in `0.25.1-moran.4`.

### Date-strip correction verified locally, 2026-09-16

The supplied Fantastical screenshots now inform full-width, equal-size date cells with
vertical dividers, 24px date numbers, uppercase weekday labels, and an 80px-high strip.
The selected cell has a tinted background and underline; today keeps its circular marker
when another date is selected. Narrow panels retain a 64px minimum cell width and native
horizontal cell snapping. Scrolling the strip does not select a date.

Reference comparison: separated full-width dates replace the compressed centered cluster;
today and selection are distinct; the person-lane grid, theme colors, and current scope
remain intentional differences from Fantastical. No weather icons, private screenshot
contents, or new seven-day event grid were introduced.

The frontend testing pass found the date focus ring needed an inset override for all
existing focus states; it is now contained at the strip edges. Tests cover full-width
distribution, dividers, label size, snap offsets, date/heading synchronization, week
navigation, Today, Sunday-first ordering, and weekday-only configuration. The full suite
passed: 84 unit tests, 26 browser scenarios, TypeScript, formatting, build, and whitespace.
Date-specific widths are 1920, 800, 749, 400, 390, and 320, plus a 400px embedded panel.
Visible in-app checks covered the reported desktop layout and an effective 391×844 CSS
viewport (the browser's existing zoom was preserved), selecting Sunday and returning to
Today. Page identity, meaningful content, absence of an error overlay, screenshots, and
warning/error logs passed. Run `HARNESS_ONLY=responsive npm run test:harness` for these
focused checks. Subsequent HA checks are recorded above; physical-device checks remain open.

### Daily-use navigation and preferences verified locally, 2026-09-16

Today in wall Day view now recenters even when already on today, automatic scrolling is
off, or the now-line decoration is hidden. Auto-centering waits for loaded data so trimmed
hours and sticky rows are measured correctly. Queued centering cannot affect another date,
and navigating away during a slow load cancels a pending Today request. Reduced motion is
respected; ticks and normal data refreshes preserve intentional scroll position.

The selected view and hidden people survive a real page reload. Preferences are scoped to
HA user, dashboard path, and card in local browser storage; a changed lane definition/order
or view configuration invalidates positional filters. Missing users, disabled persistence,
legacy defaults, malformed data, blocked storage, and kiosk auto-return are covered.
Only version/view/hidden indices are stored; no events, names, credentials, selected dates,
or scroll offsets. This is convenience state, not a security boundary. See D11.

Verification: 109 unit tests (including 25 preference tests) and the full 30-scenario
browser suite pass, plus TypeScript, build, formatting, and whitespace checks. The four
new daily-use cases cover desktop 1920×1080 and phone-width 390×1080, each with normal and
reduced motion. They perform an actual page reload, remount both HA initialization orders,
switch HA users, change card IDs/person ordering/enabled views/defaults, simulate storage
failures, and exercise delayed reads and cancelled scrolling. Reproduce with
`HARNESS_ONLY=daily npm run test:harness` and `npm test`.

Visible in-app checks confirmed hide a person → choose Week → reload restores both,
including after resizing; returning to Day retains the hidden header. Scrolling to midnight
then tapping Today moved the current-time line below the sticky person header. Page identity,
meaningful rendering, no error overlay, screenshot evidence, and warning/error logs passed.
The full-day sample-data review link is
`http://127.0.0.1:4173/dev/harness.html?scenario=wall&daily=1&status=1`.
The existing browser zoom was preserved during phone-sized review. No real calendar events
were changed. This local checkpoint was subsequently deployed; physical Safari verification
and GitHub/HACS publication remain pending.

### View-switcher capsule verified locally, 2026-09-16

The top Day / Timeline / Week / Month / Agenda control now follows the supplied reference:
a rounded neutral track, inset selected pill, and separators only between unselected
segments. It no longer uses a filled blue selected button. Changes are scoped to wall
styles in `src/wall-shell.ts`; the full-width date cells and legacy presentation remain
unchanged. Keyboard focus remains visible and inset; touch targets remain at least 48px.

Reference comparison: capsule shape, neutral selection, and subtle separators match the
requested pattern. HA theme colors, our existing five view names, and larger wall touch
targets are intentional adaptations. This does not add Quarter/Year or reproduce native
platform materials. The supplied private screenshot is not stored in the repo.

Flow under test: local wall preview → choose a view by click or keyboard → the selected
pill and corresponding calendar panel update together, including at phone widths.
`dev/view-switcher-check.mjs` extends all seven responsive scenarios with all five views,
light/dark colors, pill geometry, non-wrapping labels, separators, focus containment,
German-label reachability, two-view configuration, and single-view switcher omission.
Widths are 1920/800/749/400/390/320 plus a 400px card inside a desktop viewport.

Verification: all 109 unit tests and all 30 browser scenarios pass, along with TypeScript,
formatting, build, and whitespace checks. Visible in-app checks covered desktop and an
effective 391×844 CSS viewport, Day → Week → Day clicks, Agenda activation with Enter,
and Day activation with Space. Page identity, meaningful content, no error overlay, clean
warning/error logs, and light/dark screenshot review passed. The standalone Browser
plugin/skill is absent; existing repository browser tests and Codex in-app controls were
used without installing browser dependencies.

Reproduce with `HARNESS_ONLY=responsive npm run test:harness`; append `&theme=dark` to the
sample-data harness URL to inspect dark styling. The local server serves the rebuilt bundle
after a refresh. The same code is now installed in the HA pilot, not pushed or published;
physical iPhone/Safari verification remains open.

## Next work and open decisions

| Item | State | Acceptance or unresolved question |
|---|---|---|
| Today recenters on current time | Deployed and HA-verified 2026-09-16 | Current date/time restored below sticky headers; loading/queued-navigation races covered. |
| Remember hidden people and selected view | Deployed and HA-verified 2026-09-16 | Real reload persistence, safe identity/config invalidation, and graceful storage failure covered. |
| Status tiles separate availability and next event | Deployed and HA-verified 2026-09-16 | Date/time stays visible; existing candidate selection boundaries and legacy behavior retained. See D09. |
| Fantastical-style separated date cells | Deployed and HA-verified 2026-09-16 | Full-width cells, distinct today/selection states, narrow horizontal access and strip snapping; person lanes unchanged. |
| iOS-like view-switcher capsule | Deployed and HA-verified 2026-09-16 | Neutral inset pill, subtle separators, all five views, light/dark and narrow-width checks. Date cells unchanged; see D12. |
| Fantastical-inspired event-page date snapping | Accepted direction; interaction design and implementation pending | Strip snapping is implemented, not date-page swiping. Keep the time axis fixed, date/content synchronized, and time context stable; resolve person scrolling versus date paging. |
| Physical iPhone/Safari sleep and wake | Verification pending | Confirm recovery after backgrounding, lock/unlock, and reconnect on the real device. Phone-sized desktop tests are not this evidence. |
| Actual provider propagation | Verification pending | Confirm ordinary source changes and cancellations reach HA and the card. Synthetic changes and snapshot parity do not measure real propagation. No live appointment mutation is authorized merely for testing. |
| Portrait wall display | Requirement raised; final hardware/layout open | Record actual resolution, browser, orientation, and kiosk wrapper before calling the physical setup verified. |
| Full visual design | Deferred until calendar behavior is dependable | Refine consistent navigation, density, and all five views; the old operations-rail concept is not the current acceptance target. |
| Meals, lists, chores, logistics, Bridge editing | Deferred | Keep extension boundaries; do not expand current calendar work into these modules without an explicit scope decision. |

This list tracks work; it does not introduce GSD phases or approval gates. Once the user
authorizes a scoped change, implement and verify it directly, then update this page and the
relevant decision entry.
