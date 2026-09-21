# Current status and next work

Last recorded: 2026-09-21. This is the current project status, not a release announcement.
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
| Recovery | Polling, wake/focus, page restoration, reconnect, partial-source failures, and stale-response handling implemented and synthetically tested. Physical iPhone HA-app lock/reopen refresh confirmed by the user 2026-09-21. |
| Basic presentation | Circular avatars, compact header/date bar, collapsible Status tiles, locale-aware 12/24-hour axis, reachable narrow controls, and person-grid scrolling implemented. |
| Lane alignment | Headers, all-day rows, and timed columns share sizing on resize and hide/show; `0.25.1-moran.3` deployed. |
| Full-day range | Pilot uses hours 0–24, no trimming, and initial scroll to now. Config-only change; package defaults remain 6–22. |
| Status tiles | Availability and dated next appointment are separate; deployed in `0.25.1-moran.4`. |
| Daily-use navigation | Today, saved preferences, separated dates, neutral view tabs, one-day paging, and time-preserving person filters deployed through `0.25.1-moran.6`. |

Installed application checkpoint: `4b6530ff7e52d800f8a69ea590ef07b0d026d0f1`, version
`0.25.1-moran.12`, on `feature/moran-foundation`, deployed 2026-09-21 at 10:28 CDT.
The private pilot uses a dated bundle.
This checkpoint was committed locally, not pushed or published as a GitHub/HACS release
in the recorded deployment work. Laptop preview servers are separate from the installed
HA dashboard and do not update its bundle automatically.

Delivery policy added 2026-09-21: starting at the next verified milestone, commit and push
the current working branch, including docs and the built bundle where applicable (D22).
The title/clock checkpoint above remains locally committed; this policy update is not a push.

Milestone disposition, 2026-09-21: the dependable read-only desktop/HA-app calendar
baseline is complete under the accepted scope. Source parity/routing, full-day display,
responsive lanes and reachable controls, discrete dates, filters/preferences, fresh
read-only details, and recovery have implementation/browser evidence; physical HA-app
lock/reopen is user-confirmed. The user waived timing measurement. This is not a claim
of zero future bugs, a finished visual design, tested final wall hardware, or a public release.
The next product milestone is consistent presentation/usability across the five views;
its broader design remains deferred, not silently authorized by closing this baseline.

## Verification completed

### Self-contained project handoff, 2026-09-21

D23 adds a root handoff, portable agent entry points, product brief, stable-ID backlog,
architecture/code map, development/testing instructions, sanitized operations boundary
and consolidated research index. Historical research is retained with explicit archive
labels. Current backlog ownership moved out of this status history into `BACKLOG.md`.

This milestone changes documentation only. The application remains r12, with no new HA
deployment, calendar mutation or release. All 140 relative links across 22 changed/new
Markdown files resolve; referenced source paths and documented test commands were checked.
The outgoing 29-commit history (221 unique changed file blobs) and new docs were scanned
for credential/private-identifier patterns, with no matches. Review found no private
screenshots, live configuration or backup files in the outgoing file set.

Re-ran format, TypeScript, build, all 151 unit tests and all 50 compiled-browser scenarios;
all passed. The rebuild left the committed r12 bundle unchanged. Milestone push is pending
remote confirmation; an unrelated pre-existing debug note remains untracked and excluded.

### Header title and clock — deployed, 2026-09-21

Version `0.25.1-moran.12` implements D21: the wall preview title is “Moran Calendar” with
the current time 12px after it. Configurable title and existing HA 12/24-hour format/minute
tick are reused. The sample preview retains its fixed test time. D20 compact dimensions,
narrow multi-view hidden brand, accessible identity and single-view title remain intact.
No calendar source, legacy behavior or zoom feature changed.

The new clock regression failed against r11. Five compact-header cases now test the title,
semantic timestamp, 12px spacing, minute advancement and 12/24-hour preferences in addition
to prior space/navigation/disclosure checks. At 865×1048 CSS pixels the visible prototype
measured exactly 12px title-to-clock spacing and 48px header height, with no title clipping
or document overflow; keyboard Status disclosure still works. At 391×844 the existing
hidden-brand behavior keeps all five modes reachable in the 48px header, without overflow.
Page identity/content, no error overlay, screenshot and interaction checks passed; no local
warnings/errors. Browser plugin not available; existing Chromium/CDP harness and in-app
Playwright controls used without new dependencies. Format/types/build/whitespace, 151 unit
tests and all 50 browser scenarios passed.

Deployed 10:28 CDT. Repeated served checksum/API verification and Core validation passed.
Only this preview's resource and card title changed; other dashboard settings, 74 resources
and 27 dashboard registrations are unchanged. Targeted backups and r11 retained for rollback.
Actual HA at 1280×720 showed “Moran Calendar” and the current 10:29 AM time, exactly 12px
apart, in a 48px header with 40px view tabs. At 390×844 the brand remains hidden and accessible
identity retains the new name; keyboard Status expand/collapse works. Neither size overflowed.
Identity/content, no overlay, screenshot review and interactions passed; r12 loaded with no
Family Board warning/error. Existing unrelated HA/custom-card logs remain. Normal viewport
and collapsed Status restored. No calendar writes, restart, push, release or new device claim.

### Compact calendar chrome — deployed, 2026-09-21

Version `0.25.1-moran.11` implements the four annotated corrections in D20: single-row
48px header/40px view capsule, left-aligned proportional dates, collapsed-by-default Status
tiles with a header disclosure, and no separate Day/Timeline heading row. Month/year and
Today/paging move beside the date strip. Calendar data, read-only controls and legacy are
unchanged. The requested future density slider remains unimplemented (D19).

Regression-first: the new compact-chrome test failed against r10's tall header. Five new
cases cover both annotated sizes (812×844 and 865×1048), 390×844, 320×568 and 1920×1080.
They assert compact geometry, hidden/expanded Status content, accessible disclosure state,
scroll/focus retention, left/proportional dates, Today/paging, all-view continuity, disabled
Status config, and legacy isolation. Existing tests now check the deliberately changed
compact target sizes and date-bar selectors without removing navigation/recovery coverage.
Run `HARNESS_ONLY=chrome npm run test:harness` for the focused cases.

Local visible review at the annotated 812×844 CSS size measured 48px header, 40px capsule,
and roughly 129px from shell top to the calendar board. Keyboard Space expands and collapses
Status tiles, retaining focus. The user's existing browser zoom was preserved. Browser
plugin not available; repository Chromium/CDP tests and Codex in-app Playwright controls
provide the rendered checks without new dependencies. Formatting, types, build, whitespace,
151 unit tests and all 50 compiled-card browser scenarios pass.

Deployed at 10:22 CDT to the existing read-only HA preview. Served hash and repeated API
verification, Core validation, unchanged preview configuration/74 other resources/27
dashboard registrations, and retention of r10 for rollback passed. No calendar events,
integrations or dashboard configuration changed; no restart, push or public release.

Actual HA at 1280×720 and 390×844 measured a 48px header, 40px view capsule and 81px date bar;
the old heading is absent, dates are left-aligned with proportional numerals, and collapsed
Status tiles measure 0px. Calendar board height was 519px and 643px respectively, including
its person header. Expanded Status tiles used 92px for the current data, reclaimed on collapse.
Keyboard Space toggles the disclosure and retains focus. Phone next-day → Today and event
details passed; fields remain disabled with Close/Cancel only. No document horizontal overflow.
Page identity, meaningful rendering, screenshot review and no framework overlay passed.
No Family Board warning/error; existing custom-sidebar, HA routing, config-template-card and
Better Thermostat messages remain unrelated. Restored Today/Day, collapsed Status and normal
viewport; the annotated user tab was preserved. No new physical-device verification is claimed.

### Week/Month/Agenda usability deployed, 2026-09-21

Version `0.25.1-moran.10` implements D18: dated, readable Week columns with pinned
headers; compact narrow Month with unique event counts and date-to-Day drilldown;
shared person filters in Month/Agenda; wrapping Agenda titles/location/countdowns.
Restricted Month configurations retain direct event cards when Day cannot expose all dates.
No calendar-source, mutation, storage, or legacy-view behavior was intentionally changed.

Formatting, TypeScript, build, whitespace, all 151 unit tests, and all 45 compiled-card
browser scenarios pass. The five new presentation cases cover 1920×1080, 390×844, 320×568,
844×390 landscape, and a 400px card inside a desktop viewport. They check visible filter
state, long content wrapping, unique shared-event counts, date/appointment drilldown,
English/German labels, source failures, Month-only/weekday-only fallbacks, read-only details,
sticky Week headers, and legacy isolation. Reproduce with
`HARNESS_ONLY=presentation npm run test:harness` or the complete `npm run test:harness`.

Browser plugin not available; the existing Chromium/CDP harness and Codex in-app Playwright
controls were used without installing dependencies. Local visible review at an effective
391×844 CSS viewport exercised Month hide/restore → date → Day, Week two-axis scrolling
with pinned date/person headers, and Agenda → read-only details. Page identity, meaningful
content, no framework overlay, screenshots, and clean warning/error logs passed. The user's
annotated prototype tab was left alone once its unsaved comment was discovered; checks used
a temporary review tab. This is desktop browser QA, not a new physical-device claim.

Deployed at 10:04 CDT to the existing read-only HA preview. Repeated served checksum
verification, Core validation, unchanged preview configuration/74 other resources/27
dashboard registrations, and retention of r9 for rollback passed. No source appointments,
integrations, or dashboard configuration changed; no restart, push, or public release.

Actual HA at 1280×720 showed seven 180px Week columns, all seven complete date labels,
45 owner event cards, and desktop Month's direct cards. At 390×844, Month's scroll/client
widths both measured 390px; each date measured about 54.6px wide and person filters 48px
high. Hiding one owner of a shared event preserved its unique count while another owner
remained visible. Month date → Day retained the hidden lane; Agenda retained the filter;
restoring it and opening an appointment showed disabled fields, only Close/Cancel, and a
358px dialog without horizontal overflow. Agenda itself also had no horizontal overflow.
Page identity, meaningful rendering, no error overlay, screenshot review, and interactions
passed. No Family Board warning/error after reload; existing custom-sidebar, HA routing,
config-template-card, and Better Thermostat messages remain unrelated. Restored Today/Day,
all original people, and normal viewport. No new physical-device verification is claimed.

### Cross-view date continuity deployed, 2026-09-21

The regression reproduced a wall Month jump back to the current month after browsing
future dates. The r9 update shares date context across all five views, retains person
filters, gives explicit month-cell selection priority, and clamps shorter/weekday-only
months without escaping the displayed month. Legacy behavior stays unchanged. See D17.

Formatting, TypeScript, build, whitespace, 151 unit tests, and all 40 browser scenarios pass.
The two new compiled-card cases cover 1920px and 390px, preferred-day retention, shorter
months, weekday-only/Sunday-first configuration, Today, filters, and legacy behavior.
Visible local review followed Week forward three weeks → March → next month → Day April 11;
page identity, meaningful content, no error overlay, screenshot, and no warning/error passed.
Browser plugin not available; existing repository Chromium/CDP tests and Codex in-app
Playwright controls were used. Run `HARNESS_ONLY=views npm run test:harness` for the focused
regression. The local screenshot used the browser's existing zoom (520×1125 effective CSS
viewport); the automated phone regression and actual HA review use their measured sizes.

Installed in the same private HA preview at 01:15 CDT. Repeated served checksum verification,
unchanged dashboard/74 other resources/27 dashboard registrations, retained r8 asset, and
Core validation passed. No appointment, integration, or dashboard configuration changed;
no restart, push, or GitHub/HACS release.

Actual HA at 1280×720: Week advanced into October → Month showed October → next month → Day
showed November 5 and loaded three timed blocks. At 390×844, hide a person → Month November
→ previous month → Agenda October 5–11 → Timeline/Day October 5 kept that person's collapsed
48px lane while the other lanes stayed 240px. No document horizontal overflow. Page identity,
meaningful content, no error overlay, screenshots, and interaction proof passed. No Family
Board warning/error appeared after reload; existing HA routing, custom-sidebar,
config-template-card, and Better Thermostat messages remain unrelated. Today/Day, original
filters, and normal viewport restored. This is browser QA, not new physical-iPhone evidence.

### Physical iPhone HA-app recovery, user-confirmed 2026-09-21

In response to the requested phone lock/reopen check, the user confirmed using the
Home Assistant app and that the calendar refreshes. Record this as a passed physical-device
HA-app refresh check without a manual reload, based on the user's report, not agent-operated
device testing. It closes the pending HA-app lock/reopen check. Exact device/iOS/app versions
and elapsed lock duration were not supplied; do not invent them. Safari, prolonged suspension,
and network-handoff behavior are not established by this report. The intended phone surface
is the HA app; a separate Safari check is not a new prerequisite for that use case.

Timed observation of an ordinary provider edit/cancellation was still pending when this
report arrived; the user subsequently waived it as a completion requirement on 2026-09-21.
No code, live config, or calendar event changed in response to the phone report.

### Hidden-page recovery update, 2026-09-20

The rendered r7 regression exposed a hidden clock tick starting a calendar read despite
the paused poll. Wake could reuse that background request. The r8 update moves the
hidden-page guard to the shared read entry point, covering clock, HA-update, and forced-read
triggers. Desktop/phone recovery checks now assert no new reads while hidden, a fresh wake
snapshot, and rejection of late pre-sleep data. See D15. All 140 unit tests and 38 browser
scenarios pass, as do formatting, TypeScript, build, and whitespace checks. Visible local
review confirmed date navigation, meaningful content, no error overlay, and no browser
warnings/errors. Browser plugin not available; repository Chromium tests and Codex in-app
controls were used. Deployed at 19:12 CDT; repeated served checksum verification, unchanged
dashboard/74 other resources/27 dashboard registrations, and Core validation passed.
The prior r7 asset is retained; no calendar mutation, restart, push, or release occurred.

Actual HA reload identifies r8. Desktop 1280×720 date navigation loaded five next-day
timed blocks, preserved visible clock time, and retained 0px lane misalignment. At 390×844,
event details are read-only, contain no Save/Delete, and fit without horizontal overflow
(358px client/scroll width). Page identity, meaningful content, no error overlay, and
screenshots passed. No Family Board warning/error observed; existing custom-sidebar, HA
routing, config-template-card, and Better Thermostat messages remain unrelated. Restored
Today/Day and normal viewport. The hidden lifecycle remains synthetic evidence; physical
iPhone recovery and ordinary provider edit/cancellation timing remain unverified.

### Event-details reliability update, 2026-09-20

Continuing the full daily-use goal exposed another software gap rather than just a
physical-device dependency: an open read-only event remained stale after the grid refreshed.
The new rendered regression failed against r6 with an obsolete appointment snapshot.
The r7 update refreshes exact occurrence details, labels unverifiable/missing snapshots,
and preserves editable drafts. It also contains modal keyboard focus, restores the opener
without scrolling, and fixes overflowing date fields/small action targets. See D14.

Identity tests cover recurring neighbors, moved non-recurring events, shared owner copies,
different calendars, conflicting identities, and missing IDs. Four new rendered scenarios
exercise 1920×1080, 390×844, 320×568, and 844×390; synthetic source changes do not touch real
appointments. The final r7 candidate passed 140 unit tests, all 38 browser scenarios,
TypeScript, formatting, build, and whitespace checks. Visible local review confirmed native
Tab/Shift+Tab containment, initial Close focus, readable stacked date fields, Escape, and
no browser warnings/errors. Promoted to the same HA preview at 18:59 CDT; source/bundle
hash and unchanged dashboard, 74 other resources, and 27 dashboard registrations verified.
Core validation passed; prior r6 asset retained. No calendar mutation or restart.

Actual HA checks at 1280×720 and 390×844 confirmed read-only inputs and no Save/Delete,
enabled initial Close focus, native Tab/Shift+Tab containment, inert calendar background,
and no horizontal dialog overflow (420px and 358px respectively). Close and Cancel targets
are at least 48px. Landscape 844×390 kept the dialog inside the viewport with internal
vertical scrolling. A normal HA poll was observed with details open: the checking message
appeared and cleared on success, keeping the dialog open/read-only and focus on Close.
Today and normal viewport restored. The physical phone and real edit-propagation checks remain outstanding;
neither synthetic changed-event tests nor a phone-width in-app screenshot replaces them.

### Date navigation update, 2026-09-20

`0.25.1-moran.5` was deployed to the existing read-only preview.
Wall Day arrows and date-heading swipes/keyboard move one visible day at a time. The grid
retains person scrolling and the fixed time axis. Date changes preserve visible clock
time and lane position across all-day rows, trimmed hours, and week-boundary reads.
Today/view/config changes cancel pending restoration; returning via a day arrow does
not implicitly recenter on now. A destination's shorter range can clamp the viewport.

Long titles now move the intact view capsule to a second row instead of clipping the
final tab at intermediate widths. Native date-strip scrollbars no longer shrink date
cells below their touch height when the OS uses non-overlay scrollbars. Legacy styles
and week-sized navigation outside wall Day remain unchanged.

Local checks: 130 unit tests and 34 browser scenarios pass, including four new date
navigation cases (1920/390px, normal/reduced motion), extended native touch/mouse tests,
all seven responsive configurations, saved preferences, alignment, read-only protections,
and synthetic recovery. Reproduce with `HARNESS_ONLY=navigation npm run test:harness`,
`HARNESS_ONLY=pan npm run test:harness`, or the full `npm run test:harness`.
The served bundle and unchanged dashboard/other registrations were verified; Core check
passed. Live desktop/phone-width checks preserved clock time exactly across a week boundary
and removal of an all-day row, with 0px lane misalignment and a fixed time axis. Event
details stayed disabled. No provider events changed and no release was published.

Those live checks found a separate filter-scroll problem: collapsing/restoring a focused
sticky person header could jump near midnight, using either mouse or keyboard. The
`0.25.1-moran.6` follow-up extends clock-time anchoring to that layout change. Native
Chromium filter tests now cover full-height, full-day boards with Status tiles; navigation
tests also simulate the browser's post-layout scroll adjustment and verify keyboard focus.
The final candidate passed 130 unit tests, all 34 browser scenarios, TypeScript, formatting,
build, and whitespace checks, then was deployed at 18:47 CDT. Served checksum, unchanged
dashboard/other registrations, retained prior asset, and Core validation passed again.

Authenticated HA verification at 390×844 and 1280×720: native person click and keyboard
restore both preserved visible clock time with a measured 0-minute change; focus stayed
on the restored header and lane misalignment remained 0px. Crossing into the next week
also preserved time exactly. Today recentered, and all original people/normal viewport
were restored. Page identity, meaningful content, screenshots, and no error overlay passed.
No Family Board warning/error was observed after reload; existing HA routing/custom-sidebar
errors and unrelated custom-card warnings remain outside this change. Browser plugin not
available; repository Chromium tests and Codex in-app browser controls were used.

The next milestone remains a dependable read-only daily-use calendar, not a completed
visual redesign. Physical iPhone sleep/wake and ordinary provider edit/cancellation timing
are separate pending evidence; no actual appointment is changed to obtain it.

The software navigation pass is complete. The next acceptance objective is real-use
reliability: an ordinary event change/cancellation reaches HA and this card with measured
timing, and the real phone recovers after background/lock/reconnect without stale events
or a misleading Free now state. Those checks require the real device/ordinary source
activity; desktop emulation and snapshot parity do not establish them. Larger presentation
work and optional household modules remain deferred, not silently included in this milestone.

### Source and routing follow-up, 2026-09-20

Fresh read-only checks on HA 2026.9.3 and the installed r8 asset matched all **166 source
occurrences**, retaining **175 intended person copies** with zero rejected/unrouted records.
The six-week range and source counts match the September 17 audit. One calendar's normalized
content fingerprint changed since then in both Bridge and HA; the two systems now agree.
Two snapshots at 19:15 and 19:16 CDT agreed. That is real changed-content evidence, but
without a targeted before/after occurrence and
save timestamp it cannot establish edit/cancellation latency. No actual events or settings
were changed by this diagnostic. See [Calendar sync validation](calendar-sync-validation.md).

### Source and routing audit, 2026-09-17

Fresh six-week reads matched **166 of 166 source occurrences** between Calendar Bridge
and HA, with no missing/extra events or compared-field differences. The actual app routing
functions retained **175 intended person copies**, with zero rejected or unrouted events.
All-day end normalization and four differing detached occurrence IDs are accounted for.
Two snapshots agreed; the installed `moran.4` asset hash is unchanged.

The card's 60-second range reads use CalDAV provider queries, not HA's 15-minute next-event
entity-state cache. Request durations of 1.87–5.20 seconds are not edit-propagation latency.
No appointments, HA configuration, or application code were changed. Existing unit/browser
results below are historical, not rerun UI evidence for this API-only pass.

See [Calendar sync validation](calendar-sync-validation.md) for source-pinned behavior,
matching rules, limitations, and the real-edit/physical-phone verification procedures.

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

The [current backlog](BACKLOG.md) owns pending features, proposals and completion criteria.
CAL-01 (the requested future density zoom slider) is the clearest named feature candidate;
CAL-02 covers broader presentation work. Neither starts as part of this handoff task.

Preserve the accepted read-only baseline. The user confirmed physical HA-app lock/reopen
refresh on 2026-09-21 and explicitly waived timed provider-edit/cancellation testing.
Provider latency remains unmeasured, not a blocker. Final wall hardware and broader
physical-device coverage remain open; see CAL-03. Do not reopen completed fixes from
historical plans or treat optional household modules as approved calendar scope.
