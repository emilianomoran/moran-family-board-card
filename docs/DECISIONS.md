# Decisions and discussion record

Status: current product record, consolidated 2026-09-16 from project conversations, existing
ADRs, foundation acceptance records, source checkpoints, and private deployment records.
This is a privacy-safe summary, not a verbatim transcript. Earlier discussion dates are not
invented where the surviving record does not establish them.

For delivery state and next work, see [STATUS.md](STATUS.md). For source-pinned architectural
evidence, see [ADR 0001](adr/0001-implementation-base.md).

## Implementation and scope

### D01. One dedicated Home Assistant card repository

**Accepted by 2026-09-11.** The user asked whether to extend an existing calendar card or
build a custom React site, and asked for a dedicated personal GitHub repository. Continue
this TypeScript/Lit fork of Family Board Card, with Home Assistant supplying authentication,
calendar access, locale, themes, and dashboard hosting.

Calendar Card Pro and Week Planner Card remain references, not additional implementation
projects. The alternative Family Calendar Card was evaluated and not selected as the base;
[ADR 0001](adr/0001-implementation-base.md) preserves the comparison. A separate React app
would duplicate working platform responsibilities and is not the agreed route.

### D02. Calendar correctness comes before presentation and household modules

**Accepted by 2026-09-11; reaffirmed during the live-calendar work.** The user prioritizes
seeing the real calendars correctly and proving daily usefulness before settling the full
visual design. Meals and lists are nice-to-have; chores, logistics, rewards, photos, and
import features remain deferred.

Keep boundaries that allow later modules, but do not build the old 68/32 operations rail as
a prerequisite for a usable calendar. The first wall proof deliberately resembled the
legacy calendar because it validated the foundation, not a finished redesign.

### D03. External calendars own event data

**Accepted by 2026-09-11; retained in the pilot.** Read events through authenticated Home
Assistant APIs, route shared events into one or more person lanes, and use an unmatched
Household lane where configured. Do not create duplicate per-person calendars or a second
calendar database merely to drive the display.

Calendar Bridge remains a possible later provider/mutation adapter. The browser must not
connect to it directly or hold its credentials. The current pilot is read-only; create,
edit, delete, and drag writes are disabled. A future editing workflow needs its own scope
and occurrence/series safety design.

### D04. Preserve compatibility and the existing calendar views

**Accepted by 2026-09-11.** Exact `layout: wall` opts into the new shell; legacy behavior
remains available. Keep Day, Timeline, Week, Month, and Agenda. Extract focused pieces as
features need them instead of undertaking a speculative framework or architecture rewrite.

### D05. Continue directly without GSD gates

**Accepted 2026-09-15.** The user explicitly retired GSD and repeated confirmation gates.
Continue authorized implementation and proportionate verification directly. Tests, privacy,
read-only calendar boundaries, and safe live deployment still apply.

Historical phase documents and reviewer-model requirements do not reinstate that workflow.
The original request for a phased plan remains part of project history, not the current
execution process.

**Reaffirmed through 2026-09-20:** the user reported repeated idle checkpoints even after
setting a goal and again asked to continue. Work toward a dependable read-only daily-use
calendar across desktop/mobile, not isolated tiny tasks. Implement, test, document, and
advance the accepted backlog in the same run; progress messages are not approval gates.
Stop for a real safety/authority boundary, consequential unresolved product choice, or a
completed scoped milestone. Physical-phone evidence can remain pending while software
work advances. This does not authorize background scheduling, event edits, or publication.

## Calendar interaction and presentation

### D06. Address concrete usability defects while deferring the full design

**Accepted through the foundation and calendar preview reviews.** The user does not need to
design the entire product before implementation proceeds. Specific corrections already
raised in conversation remain requirements:

- Avatars must stay circular, including in constrained person headers.
- Narrow layouts must not lose the view controls or access to other people.
- The time axis should use the user's 12-hour format while respecting HA locale settings.
- The Day heading should include the date, such as `Today: Sep 16`.
- Weekday/date controls should feel familiar to iOS users. The current date strip is not
  a claim of exact native iOS fidelity.
- Desktop wheel/trackpad scrolling must work alongside touch/pointer panning.
- Person headers, all-day cells, and timed columns must resize and collapse together.

The user raised a 90-degree portrait wall display as a possible mounting orientation.
Responsive support matters; final hardware, physical density, and a portrait-specific
default view have not been settled. The older concept's automatic Agenda default and
bottom navigation are not final decisions.

### D07. Fantastical is the mobile usability reference

**Accepted 2026-09-16.** The user identified Fantastical as the gold standard for mobile
calendar interaction, specifically a fixed left time reference and date navigation that
snaps to dates instead of stopping at arbitrary positions.

Keep the selected date, date strip, and event content synchronized. Preserve time context
when moving between days. Existing person-lane horizontal scrolling and future horizontal
date paging need distinct, unambiguous gestures; their exact arrangement remains open.
This is an interaction reference, not a requirement to copy branding or every feature.

**Date-strip refinement accepted 2026-09-16:** the user supplied four Fantastical screenshots
and rejected the small, centered iOS-style date cluster. Use a full-width sequence of
distinct, evenly sized date cells with vertical separators, larger weekday/date labels,
and a full-cell selected highlight. Today's circular marker stays distinct from selection
when browsing another day. On narrow panels, preserve usable cell sizes and horizontal
access instead of compressing the labels.

The reference's week-grid header informs the date control, not the data layout below it:
Day view remains person columns. Weather icons, the month/list composition, and a full
Fantastical-style day/week paging model are not part of this scoped correction. Native
scroll snapping on the date strip can stabilize the strip without changing the selected
day just because the user scrolls it; event-page swiping remains future work.

Research boundary: the [official calendar-view guide](https://flexibits.com/fantastical-ios/help/calendar-views)
was consulted for date/navigation context. The supplied screenshots now provide visual
evidence of day separation, today's marker, and selected-day treatment. Their private
event contents and original images are not copied into this repo. Exact current gesture
behavior was not independently verified inside the Fantastical app.

**Implementation choice under the accepted direction, 2026-09-20:** wall Day's arrows
advance one visible date (skipping weekends when configured). Horizontal swipes/drags on
the date heading page exactly one day on release; arrow keys on the focused heading offer
the same operation. The grid retains native two-axis person/time scrolling. Short,
vertical, cancelled, and secondary-pointer gestures do not page dates. This is discrete
day navigation, not a physics-driven animated carousel or a claim of native Fantastical
gesture parity. The separate date strip continues to scroll without selecting dates.

Carry the visible clock time and horizontal lane position across date changes, including
all-day-row and trimmed-hour changes; clamp to the available destination range. Explicit
Today still recenters. Slow reads, rapid paging, and Today/view/config changes must not
allow old scroll work to overwrite the user's latest intent. Week/Timeline and legacy
Day keep week-sized arrows. This resolves the competing gesture surfaces without a
new calendar grid or framework rewrite. Delivery and QA are recorded in STATUS.md.

**Live follow-up, 2026-09-20:** person hide/show must also preserve visible clock time.
Actual preview testing found that resizing a focused sticky person header could jump to
midnight even with keyboard activation. Reuse the same clock anchor for that layout
change, retain focus, and clamp only when the resulting scroll range is shorter. This is
a correction within the daily-use milestone, not a new filter design or calendar policy.

### D08. Show the full 24-hour schedule

**Accepted and configured in the pilot 2026-09-16.** The user could not scroll beyond
10 PM because the preview was configured for 6 AM to 10 PM, not because scrolling failed.
Use `start_hour: 0`, `end_hour: 24`, `trim_hours: false`, and `scroll_to_now: true` in the
pilot so the full day remains reachable while the initial view opens near now.

This was a dashboard configuration change using existing support, not a new bundle or a
change to the package's default hour limits. The stronger Today/recenter action was later
completed under D11 and deployed with D13.

### D09. Call the top per-person chips “Status tiles”

**Accepted terminology 2026-09-16.** The user asked how the top tiles decide between “free”
and a future appointment and named them **Status tiles**. Use that term in product
discussion and documentation. Existing internal names such as `show_focus` and `_renderFocus`
remain unchanged unless a compatible code migration is separately needed.

The discussion exposed two issues: a future appointment can appear days before it starts,
and its timing qualifier can be clipped. The current rules and open design questions are
recorded in [STATUS.md](STATUS.md#status-tiles-current-rules-and-known-issue).

**Accepted for implementation 2026-09-16:** the user approved separating current
availability from the next event, for example:

> Avery · Free now
>
> Next: Project review · Tomorrow, 9 AM

The wall tiles will show “Free now” when there is no current timed event and all lane
sources are healthy, or “Busy now” with the current appointment. A separate Next line
will retain the appointment title and a readable Today/Tomorrow/date plus time, including
while another appointment is in progress. Unavailable/loading data must never imply free.
The date/time gets its own wrapping line so long titles cannot push it out of view.

Implementation choices for this scoped pass: retain the existing loaded-range lookahead,
timed-event-only selection, and overlap tie-breaker. No new soon cutoff or all-day busy
policy is introduced. “Free now” describes the loaded timed schedule, not physical presence
or guaranteed availability. Legacy layout retains its existing current-or-next behavior.
An independent lookahead and richer all-day/overlap policies remain open follow-ups.

### D10. Keep this conversation's product record in this repo

**Accepted 2026-09-16.** The user asked that conversations and decisions live in the dedicated
project repository. Record material questions, decisions, alternatives, findings, and
unfinished recommendations here, with links from the READMEs and agent entry point.

Use sanitized summaries rather than publishing raw household conversations. Private HA
configuration, calendar content, screenshots, tokens, and backups remain outside the public
repo. Product facts must not exist only in chat or private deployment notes.

### D11. Finish daily-use navigation and browser-local preferences

**Continuation scope, 2026-09-16.** Finish and directly verify the earlier local Today and
preference work. Today in wall Day view returns to the real current date and brings the
current time below the sticky headers, even if that date was already selected or automatic
scrolling is disabled. Clock ticks and ordinary data refreshes must not continually take
over the user's scroll position. Respect reduced motion and cancel obsolete queued scrolls.

Remember only selected view and hidden lane indices in browser-local storage, scoped to
the HA user, dashboard path, and card identity. Different otherwise-identical cards can
set `preferences_key`. Defaults remain on for wall and off for legacy. Reset saved choices
when lane definitions/order or configured views/defaults change; invalid or unavailable
storage must fall back safely. Kiosk auto-return is transient and must not overwrite saved
choices. Do not persist events, credentials, selected dates, or scroll offsets. This is a
convenience feature, not a security or authorization boundary.

The implementation plan is local regression tests, fixes, a rebuilt prototype, and a repo
checkpoint. Live deployment, GitHub publication, and physical-device verification are
separate delivery states, not implied by a local passing build.

**Locally verified 2026-09-16:** real page reload, config/user/card changes, malformed and
blocked storage, normal/reduced-motion centering, slow loads, and stale queued-scroll
cancellation pass. The visible prototype confirms hide → Week → reload retains the
choices and scrolling to midnight → Today restores the current-time line below headers.
See STATUS.md for test counts and delivery boundaries.

### D12. Use an iOS-like segmented control for calendar views

**Accepted 2026-09-16.** The user supplied a desktop Fantastical reference and asked for
the top view tabs to match its rounded segmented control. Use one neutral capsule, an
inset selected pill, and subtle separators between unselected segments instead of the
bright-blue selected button. Keep Day, Timeline, Week, Month, and Agenda; the reference's
Quarter and Year options are not new feature requests.

This applies only to the wall view switcher. D07's distinct full-width date cells below
remain unchanged. Adapt neutral colors to the HA theme, retain visible keyboard focus and
48px touch targets, and keep controls reachable at narrow widths. The implementation plan
is a wall-scoped styling change, responsive/interaction checks, and a rebuilt local preview.
The reference image and its private calendar contents must not enter the repository.

**Locally verified 2026-09-16:** the view control now uses the neutral capsule in both
light and dark themes. All five English tabs fit on one row down to 320px; longer localized
labels remain horizontally reachable. Date cells and legacy styling are unchanged. See
STATUS.md for interaction evidence; D13 records the subsequent live pilot rollout.

### D13. Promote accepted daily-use work into the existing read-only pilot

**Continuation scope, 2026-09-16.** After the user asked to continue calendar work while
deferring an image-annotation preview, the next step was to install the tested Status tiles,
Today recentering, local preferences, date cells, and view capsule in the existing HA pilot.
This does not authorize calendar editing, another app/framework, a public release, or
the deferred image preview.

**Deployed and verified 2026-09-16:** `0.25.1-moran.4` is installed from a local committed
build. Only the existing preview resource URL changed; dashboard configuration, other
registrations, and the read-only restriction are unchanged. The old asset is retained for
rollback. Real HA browser checks cover loaded calendars, Status timing, reload preferences,
Today, 24-hour scrolling, responsive lane alignment, and read-only event details.

Remaining evidence is specific: real iPhone/Safari sleep/wake and provider-change propagation,
not more prototype styling as a prerequisite. No actual appointments were mutated as a test.
The source and documentation are committed locally; no GitHub push or release was performed.

**Read-only continuation, 2026-09-17:** the next pass checked the data path before additional
presentation work. Both managed calendars use native HA CalDAV; range reads are distinct
from the background current/next entity-state update. The fresh audit matched 166 source
occurrences and retained 175 intended person copies. No app, provider, or HA configuration
change was needed. Snapshot parity, request duration, edit-to-screen latency, and physical
phone recovery are different claims; [the validation record](calendar-sync-validation.md)
keeps their evidence and remaining checks separate. No new calendar database or direct
browser-to-Bridge adapter is justified by these findings.

**Read-only follow-up, 2026-09-20:** two fresh snapshots on HA 2026.9.3 and r8 again retain
all 166 source occurrences and 175 intended person copies. One calendar's compared content
has changed since September 17 in both paths, and the two paths agree now. This adds real
changed-content evidence, but not a known save timestamp or cancellation-specific proof.
The next milestone remains dependable daily use; physical-phone recovery and targeted
edit/cancellation timing are pending. No new design or household-module scope was added.

### D14. Open details must not silently become stale

**Implementation correction under the daily-use goal, 2026-09-20.** A synthetic source
change updated the grid while the open read-only dialog still showed its old time/title.
The r7 update reconciles inspected details after refresh using calendar and occurrence
identity. Recurring neighbors must not replace a missing occurrence; ambiguous or ID-less
changed records are not matched by guesswork. Shared owner copies remain the same source.

Show when details are being checked, updated, unverifiable, or missing from the refreshed
range. Missing does not prove cancellation: the event may have moved or its routing may
have changed. Retain the last inspected values with that warning; suppress an unverified
old map link and offer Retry. Do not silently dismiss the dialog or overwrite editable
upstream drafts. Calendar writes remain out of scope.

The modal focuses an enabled control, contains Tab/Shift+Tab, makes the underlying card
inert, and restores focus without changing the calendar scroll. Date fields must fit at
phone widths; action targets are at least 48px. This is reliability/accessibility work,
not the deferred full presentation redesign. Delivery evidence is in STATUS.md.

Deployed 2026-09-20 at 18:59 CDT as source `e7868ccd585bc07dad5279c551e953d669f79a8f`.
140 unit tests, 38 browser scenarios, and actual HA details/keyboard/normal-poll checks
passed. This does not certify physical iPhone recovery or real provider-change latency.

### D15. Hidden-page reads must not undermine wake recovery

**Implementation correction under the daily-use goal, 2026-09-20.** The poll callback
already skipped hidden pages, but a throttled minute tick or HA state update could still
start a read after the hide handler invalidated the pre-sleep request. Wake could then
coalesce with that background read rather than request a fresh snapshot.

The shared calendar-read entry point now defers every trigger while the document is hidden.
On visibility restoration, the existing fresh-read path runs; older suspended responses
remain generation-rejected. This changes no refresh interval, calendar data, or UI design.
The compiled-card regression failed against r7 on the hidden clock tick and passes after
the fix at desktop and phone widths. Full candidate/deployment evidence belongs in STATUS.md;
synthetic lifecycle tests still do not certify physical iPhone recovery.

Deployed 2026-09-20 at 19:12 CDT as `0.25.1-moran.8`, source
`01c6c2db315fe059713f29e154d9e0c30882a9f0`. All 140 unit tests, 38 browser scenarios,
and live HA desktop/phone-width smoke checks pass. No source appointments changed.

**User verification, 2026-09-21:** in response to the physical lock/reopen check, the user
reported using the HA app and confirmed that it refreshes. Accept the physical HA-app
recovery check as passed; do not require a Safari test for the chosen app or mislabel the
report as agent-operated testing. Provider timing was still open at that point; D16 records
the subsequent waiver.

### D16. Continue without a timed provider-change test

**Explicit user direction, 2026-09-21.** After confirming HA-app lock/reopen refresh,
the user said the remaining edit/cancellation timing test is not needed and asked to
continue. Remove that test as a completion requirement. Do not mislabel it as passed or
reintroduce it as an approval gate. Existing source-parity/changed-content evidence stands;
exact latency remains unknown. Continue practical calendar usability under the read-only
scope. This does not authorize calendar mutations, publication, or household modules.

### D17. View changes keep the browsing date

**Implementation correction under continued calendar work, 2026-09-21.** Wall views used
independent week/month offsets: browse to a future week, select Month, and the calendar
jumps back to the current month. Changing presentation should not discard navigation.

Entering Month follows the selected date. Leaving Month carries the preferred day into
the displayed month, clamped to its final date when necessary. Weekday-only configurations
stay within that month; weekend anchors use the preceding weekday unless that crosses the
month's start. Browsing months without leaving Month retains the original preferred day.
An explicitly clicked month cell takes precedence. This month resets context to today.
Person filters remain intact; legacy independent Month navigation is unchanged. No new
date persistence, calendar writes, visual redesign, or provider behavior is introduced.

The regression failed against r8; r9 passes 151 unit tests and 40 compiled-card browser
scenarios. Deployed 2026-09-21 at 01:15 CDT; actual HA desktop/phone-width navigation and
filter checks passed. Delivery evidence is recorded in STATUS.md.

### D18. Readable Week/Month/Agenda without a full redesign

**Implementation under continued calendar work, 2026-09-21.** After closing the read-only
baseline, the user asked what else to do and to continue. The agent selected a bounded
usability pass: identify a date/person on a narrow screen, filter people, and open the
correct appointment. This is not approval for editing, new modules, or a complete redesign.

- Week shows date numbers and full accessible date labels. Person columns have a 180px
  minimum; appointment titles wrap above readable times. Date and person headers remain
  pinned during two-axis scrolling.
- Narrow Month uses seven date columns, event-color markers, and unique occurrence counts.
  Shared owner copies count once; counts respect visible-person filters. Tapping a date
  opens Day. If Day is disabled or hides weekends, retain event chips so every appointment
  remains reachable. Desktop Month retains its direct event cards.
- Month and Agenda expose the existing shared person filters as scrollable native buttons,
  with pressed state and a non-color-only hidden treatment. No new preference store.
- Agenda wraps title/location and puts countdown below event text. Each view uses the
  remaining panel height and owns its scrolling. Legacy presentation is unchanged.

The compiled regression reproduced the missing Agenda filters against r9. Version r10
adds desktop, phone, small-phone, landscape, and embedded-panel checks for these behaviors,
including English/German labels, source failure, read-only details, and restricted-view
fallbacks. Delivery and final verification are recorded in STATUS.md.

Deployed to the same read-only HA preview on 2026-09-21 at 10:04 CDT from local source
`9fdda195173ed8b9f44d0072a7a0cd194f90db1c`; 151 unit tests, 45 browser scenarios, and actual
HA desktop/phone-width interaction and visual checks pass. No push or public release.

### D19. Calendar density zoom slider

**User-requested future feature, 2026-09-21; not implemented.** Add a zoom slider to
change calendar row density. Zooming out reduces row height so more events/time fit on
screen; zooming in provides more space to read event details. The user said "at some
point," so this records future scope, not an instruction to implement or deploy it now.

Implementation recommendation: change the calendar's internal layout density rather than
browser/page zoom. Keep menus, navigation, Status tiles, and controls at their normal size.
Preserve the visible date/time anchor during adjustment and keep event targets usable at
the compact end. Existing Day `hour_height`/`fit_height` settings are a possible starting
point, not an existing interactive zoom control. View coverage, slider range/default,
reset behavior, and whether to remember density per device remain design choices.

### D20. Reclaim fixed calendar space

**Explicit browser feedback, 2026-09-21.** The header/Status/Today/date stack consumed too
much vertical space. The user requested a single-row header, tabs no taller than 40px with
less padding, left-aligned dates with closer/natural number spacing, expandable/collapsible
Status tiles, and removal of the separate Today/navigation row.

Implementation choices under that direction:

- The header is 48px including padding/border; the capsule is 40px and its pills are 34px.
  Long titles truncate. Below 700px the decorative title is omitted, with full board identity
  retained in the accessible section label. The view capsule can scroll, and newly selected
  views are brought into its viewport. Single-view cards still show their title.
- A labeled 40px people/disclosure button toggles Status tiles using `aria-expanded` and
  `aria-controls`. Tiles start collapsed; expansion is retained across view changes, not
  persisted across remount/reconfiguration. Disabled `show_focus` leaves no toggle or panel.
  Day's time/people scroll anchor is preserved during disclosure; source errors remain visible
  outside the collapsed panel. Availability/event selection logic is unchanged.
- The separate wall Day/Timeline heading row is removed. An 80px date bar combines
  month/year, compact Today/paging controls and the date cells. The month label retains
  Day keyboard/swipe navigation; compact arrows retain Day steps or Timeline week steps.
  Date cells keep their selected/today distinction and snapping, align content left, and use
  proportional numerals with normal letter spacing. Narrow date strips remain scrollable.
- Legacy is unchanged. This deliberately supersedes the older wrapping-header, always-open
  Status row, visible Today heading, centered dates and blanket 48px-control presentation
  recorded in D06/D07/D12. Other wall targets retain their existing sizes. D19 zoom is still
  a separate future feature, not implemented by this change.

The r10 regression failed on excessive header height. Version `0.25.1-moran.11` was deployed
2026-09-21 at 10:22 CDT after 151 unit tests and 50 browser scenarios passed. STATUS.md records
actual HA desktop/phone-width verification; screenshots and household data stay out of this repository.

### D21. Calendar title and current time

**Explicit browser feedback, 2026-09-21.** Replace the preview title with “Moran Calendar”,
add about 12px spacing and show the time. Implementation interprets that spacing as the
horizontal gap between title and clock, preserving D20's 48px header/40px tabs.

The wall header renders the configured title plus a semantic time element using the same
display clock and locale-aware 12/24-hour formatter as the calendar. Its existing minute
tick updates the time; no extra timer, polling, source or preference is added. Narrow
multi-view cards keep D20's hidden brand to preserve controls; single-view cards retain it.
Title remains configurable: change the sample wall preview and installed pilot's card title,
not other users' defaults, the dashboard/sidebar label or the package name. Legacy unchanged.
The sample harness intentionally shows its fixed fixture time; live HA uses current time.

The missing-clock regression failed against r11. Version `0.25.1-moran.12` was deployed
2026-09-21 at 10:28 CDT; STATUS.md records tests and actual HA desktop/phone-width checks.
The future zoom slider remains separate and unimplemented (D19).

### D22. Commit and push verified milestones

**Explicit user direction, 2026-09-21.** Starting with the next completed milestone,
commit and push verified work to the current working branch on the personal origin remote.
Include product decisions/status and the generated bundle when applicable. Review the
outgoing changes for private data and unrelated work, then verify the remote branch updated.
No additional routine approval gate. This does not authorize force-pushes, merges to main,
release tags or GitHub/HACS publication. Preserve truthful local-versus-pushed records;
this policy does not retroactively mark prior local checkpoints as pushed.

### D23. Self-contained calendar repository and handoff

**Explicit user request, 2026-09-21.** Give the calendar its own complete context handoff,
knowledge, backlog, research and agent instructions so another agent can continue from
this repository without access to the original chat. The root `HANDOFF.md` is the resume
point; `AGENTS.md` owns persistent rules and `docs/README.md` maps topic ownership.

The repo records sanitized conversation outcomes, not raw transcripts or private calendar
content. Credentials, exact household configuration, reference screenshots and deployment
backups stay outside it. Research is consolidated with dates and source links; historical
GSD files remain as marked evidence, not instructions. One current backlog separates
requested features, proposals, deferred ideas, completed work and waived tests.

This is a documentation milestone, not authorization to start the zoom feature, rewrite
the application, deploy a new bundle or publish a release. Follow D22 for the verified
milestone commit/push and keep the installed application checkpoint unchanged.

### D24. Timeline fills the remaining wall panel

**Explicit annotated feedback, 2026-09-21.** Timeline used only a short content-sized
container and left the lower screen unused. Apply the wall shell's remaining-height
scroll container contract to Timeline too. Person rows and event bars expand with the
available space; dense overlaps keep 48px targets and scroll vertically rather than
compressing into one another. Names remain pinned during horizontal time scrolling.

Status expansion/collapse and container resizing must redistribute space without losing
horizontal position. Keep date navigation, read-only details and legacy Timeline sizing.
This is a bounded layout correction, not the future density slider. The supplied screenshot
shows older chrome; preserve the current compact header and title instead of restoring it.
The user also reconfirmed that work belongs in the existing dedicated calendar repo, not
a new repo or the HA operations workspace. No new repository is needed.

### D25. Timeline opens near the current time

**Requested 2026-09-21.** The user reported having to pan manually to now each time
Timeline opens. Extend the existing Day auto-scroll behavior to wall Timeline: after
today's data and layout are ready, place now roughly one-third into the time area beyond
the pinned names, clamped to the scrollable range. The wall Today action also recenters
Timeline, including when automatic scrolling or the decorative now line is disabled.

Automatic centering is once per view entry/configuration, not continuous tracking.
Clock ticks, refreshes, person filters, Status disclosure and resizing must not take over
manual browsing. Other dates do not auto-center to today's clock. Cancel obsolete queued
work after a date/view/config change; defer hidden-panel and slow/trimmed-load geometry.
Respect reduced motion and configured hour width. Legacy Timeline stays unchanged.
This is the local prototype correction, not an HA deployment or the future density slider.

### D26. Center weekday and number within a left-aligned date group

**Requested 2026-09-21.** Center each short weekday label over its date number, but
keep their shared group at the left of the cell. Both use a 40px footprint with centered
text; the group retains the existing 12px left inset. Do not center the group across the
whole cell, change natural numeral spacing, or alter today/selection treatments. This
refines D20 for the shared wall Day/Timeline date strip; legacy tabs are unchanged.

### D27. Start density zoom with wall Day

**Implementation choice, 2026-09-21, under the user's request to continue the next phase.**
Deliver CAL-01's first slice in Day instead of inventing density semantics for all five
views at once. A 40px magnifying-glass button in the existing header opens a compact
slider; it adds no permanent row. The supported scale is 40–96 pixels/hour in 1px steps,
shown as 63–150% relative to the package's 64px/hour default. This is row density, not
browser zoom. The user requested the feature; these initial values/placement are agent
implementation choices, not separately approved final visual design.

Capture the time just below pinned rows and the horizontal lane offset before each
change; restore after layout, clamped at the scrollable range's ends. Do not recenter to
now on ordinary zoom input. Today still explicitly recenters. Reuse the existing Day
anchor for rapid inputs, filters and navigation. Wall Day fills its bounded flex container;
legacy viewport-height calculations must not cap it during reflow.

Manual zoom temporarily overrides `fit_height`. Reset restores configured `hour_height`
and fit behavior. Keep the override across dates, refresh, resizing and view switches in
the current card; new config/card/page reload resets it. No local-storage schema change,
calendar write or HA config mutation. Other views and legacy have no slider in this slice.

Short Day blocks follow their calculated duration down to the existing 16px title strip,
rather than a blanket 48px target that visually extends them over neighboring appointments.
Prioritize titles and omit the optional time line when it cannot fit. Keyboard details and
overflow-to-Agenda remain available; zoom in or use Agenda for larger short-event targets.
Timeline's 48px overlap targets are unchanged. Native range keyboard/touch input, Escape
with focus return, outside-pointer/focus dismissal and reduced motion are tested.
At this r16 checkpoint, per-device persistence and Timeline/Week density remain backlog
choices. Timeline is subsequently implemented in D29 and persistence in D30; Week remains open.

### D28. Set the DST fixture timezone before test workers start

**Engineering repair, 2026-09-21.** ENG-05's failures came from starting Vitest workers
in UTC and then trying to mutate their timezone in `beforeAll`. `vitest.config.ts` now
sets America/Chicago in the parent before worker creation. Remove the ineffective hooks,
retain every DST assertion, and verify with `TZ=UTC npm test` plus the hosted CI run.
This affects tests only: no app timezone change, dependency update or fixture weakening.

### D29. Extend the density control to wall Timeline

**Implementation choice under “Continue”, 2026-09-22.** Continue CAL-01 without a new GSD
gate. Reuse the header zoom disclosure for Timeline's horizontal hour scale: 48–240px/hour,
with the existing default 96px as 100%. These bounds reuse supported `hour_width` geometry;
they are an agent implementation choice, not a separately approved final design.

Keep the time immediately after the pinned names anchored while scaling, plus the vertical
person-row position. Clamp at scrollable ends, including when the entire day fits. Coalesced
slider input uses the original anchor; delayed reads/hidden panels defer restoration, and
new dates/views/configs must not receive obsolete scroll frames. Today intentionally
recenters; ordinary refresh/filter/resize must not substitute centering for manual browsing.

Day and Timeline remember independent overrides only within the mounted card. Timeline Reset
restores configured `hour_width`; Day Reset retains its height/fit semantics. No saved preference
schema or HA configuration changes. Week and other views remain outside this zoom slice.
Timeline row heights/overlap lanes still retain their 48px target floor. Below 64px/hour,
labels use two-hour intervals while grid lines stay hourly. Midnight labels stay inside the
time axis instead of clipping behind names or wrapping at its end.
This is local prototype/source work, not an HA deployment or a public release.

D30 subsequently replaces only the session-only persistence rule above.

### D30. Remember independent zoom in the existing browser preferences

**Implementation choice under “Continue”, 2026-09-22.** Complete CAL-01's saved-zoom slice
without adding another setting or toolbar row. Reuse `remember_preferences`: on by default
in wall mode, off in legacy. These persistence semantics are an agent implementation choice,
not a separately approved visual redesign. No HA deployment or calendar write is implied.

Save manual Day height and Timeline width independently, using their existing validated
integer ranges. Keep the existing HA-user/dashboard-path/card identity and config isolation.
Reload/remount restores matching overrides; missing identity, opt-out or blocked storage
keeps the UI usable without saving. Opt-out does not erase an existing saved record.
Reset removes only the active view's override and resumes its configured geometry/fit.
Do not save computed fit, dates, scroll offsets, events, raw names or credentials.

Payload v2 retains the v1 key namespace. Accept and migrate v1 view/person choices, ignore
unknown fields/versions and invalid scales. Each view's scale is accompanied by a fingerprint
of its configured density defaults: height/fit for Day, width for Timeline. Changed defaults
retire only the affected override while preserving view/filters and the other scale.
Rewrite accepted records on restore so invalidation remains effective if defaults later revert.
This is browser-profile-local, not cross-device or live cross-tab sync. Older builds ignore
v2 on downgrade and fall back to configured UI defaults; calendar data remains untouched.

Verify actual reloads, independent Reset, migration, configuration/user isolation, initial
centering at a restored scale, inaccessible/full storage and desktop/phone/embedded sizes.
Keep D27/D29's anchoring, Today and native range-input behavior unchanged.

### D31. Give Week its own list-density scale

**Implementation choice under “Continue”, 2026-09-22, following the suggested Week slice.**
Week is a day-by-person list, not an hourly grid. Reuse the existing zoom popup with a
75–150% integer scale, 100% matching the previous layout. Left means “More events”; right
means “More detail”. These bounds and typography are initial implementation choices,
not a separately approved final design. No new fixed row or configuration option.

Scale the minimum day-row space, cell/card padding and gaps, and event title/time type.
Keep full wrapping titles, a 12px text floor and 48px appointment target floor. Keep person
column minimum widths (180px), dates, avatars and pinned headings unchanged. This can fit
more list content vertically; it does not promise a dense seven-day week will fit one screen.

Capture the first visible date below the pinned headings, the fractional position within
that date row and horizontal scroll before zoom; restore after layout within scroll bounds.
Coalesced input uses the original geometry. Delayed reads/hidden panels defer restoration;
new browsing, dates, views, configs, kiosk return and disconnect discard obsolete anchors.
No date/scroll position is persisted and zoom does not change event routing or details.

Store Week independently alongside Day/Timeline in optional payload-v2 `zoom.week`, using
the existing `remember_preferences` opt-out and identity. Its baseline fingerprint uses
the fixed 100% default, independent of hourly configuration. Reset clears only Week and
returns to 100%. R18 ignores/drops the unknown Week field on downgrade but still reads
Day/Timeline; r17 and earlier ignore payload v2 entirely. Month, Agenda and legacy get no
new slider. Calendar writes, HA deployment and public release remain outside this slice.

### D32. Make Month overflow reachable without Day

**Bounded CAL-02 repair under “Continue”, 2026-09-22.** A rendered/code review found that
Month capped appointment cards at three and rendered `+N` as inert text. D18's fallback
kept those three cards when Day was disabled or weekends hidden, but did not actually
make the remaining appointments reachable. This corrects that gap; it is not a new
calendar source, Month zoom design or approval of final presentation.

In wall Month, `+N more events` is a native disclosure. It reveals the remaining cards
inside the same date, with full wrapping titles and the existing read-only details.
The disclosure stays after the first three cards and becomes “Show less”; keyboard focus
and the disclosure's vertical position are retained within scroll bounds. Only one date
is expanded at a time; only its week row grows. The overflow number counts rendered
person-owned cards, while the date's accessible total still counts unique occurrences.
Shared owner copies remain intentional. Filters and refreshed data drive the list directly.

Expansion is transient: month paging/Today, kiosk return, leaving Month, config and preference identity
changes clear it. It is not persisted and does not cause extra calendar reads. Source
warnings and refreshed read-only details retain their existing behavior.

The standard narrow Month counts/date-to-Day behavior stays unchanged. When that route
is unavailable, a narrow card instead scrolls a 784px seven-column grid (112px per date),
with aligned weekday headings and 48px event/disclosure heights. This minimum is an initial
implementation choice, not final design approval. Dates without a valid Day destination
are labeled groups rather than dead buttons; hidden weekends no longer jump to a weekday.
Legacy behavior remains unchanged. No new fixed toolbar, dependency, HA write or release.

### D33. Make calendar tabs usable from the keyboard

**Bounded CAL-02 correction under “Continue”, 2026-09-22.** In the r20 preview, Right Arrow
on the Month view tab left focus unchanged, and all five view buttons were separate Tab
stops. The date strip had the same gap. This is a navigation/accessibility repair, not a
new visual design or calendar policy.

Wall view/date groups use one entry stop. Left/Right moves focus and wraps within the
visible group; Home/End reaches its edges. Enter/Space selects using existing click paths.
Focus alone does not select, save a preference, fetch calendars or change the time scroll.
Tab exits the group; re-entry targets the selected option. Off-screen focus scrolls only
its own track. Modified shortcuts and vertical arrows keep their browser behavior; RTL
tracks reverse left/right focus order. Day heading arrows retain their separate date-paging
behavior. The date strip does not page beyond its current week on wrap.

The choice of manual activation follows the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
(checked 2026-09-22): switching calendar views may require a source read. Groups have
localized accessible names and reference a labeled, focusable calendar panel. Focus remains
transient; legacy controls, saved view/filter/zoom data and provider reads are otherwise unchanged.
Native keyboard/mouse/touch and responsive checks are required; this is not a screen-reader
or physical-device certification.

**Tooling clarification, 2026-09-22:** the user already had the Chrome extension installed.
Both it and the in-app browser were connected. The earlier optional “Browser plugin”
recommendation was unnecessary; a missing specifically named skill was not missing browser
access. Continue with available browser controls, without another install prerequisite.

### D34. Reachable Day overflow when Agenda is disabled

**2026-09-22 — implemented under the user's continued CAL-02 work, not a redesign.**
The r21 Day overlap chip called the guarded Agenda navigation handler; with Agenda omitted
from `views`, it silently did nothing. A new compiled-browser regression reproduced this
before implementation.

Wall Day now falls back to a modal day list for that person when Agenda is disabled.
The list includes all of that person's appointments on the selected date, not only the
hidden cluster, so all-day context and other appointments remain reachable. It reuses
the existing Agenda rows and event details, without enabling an excluded view, altering
`max_columns`, adding a toolbar, saving state or making an extra calendar read.
When Agenda is enabled, its existing route is unchanged. Legacy is unchanged.

The list derives from current filtered events and shows loading/failure/retry state.
Person, absolute date, localized times and full wrapping titles remain visible. Modal
rows retain at least 48px targets. Opening details hides/inerts the list but preserves its
DOM and scroll; closing details returns focus to the same appointment, or the list's
Close button if that occurrence disappeared. Closing the list restores its trigger, or
the selected date if refresh removed the trigger. Scroll is retained within current bounds.
Escape closes one level at a time; Tab stays inside the active modal. Backdrop/Close work.

The selected date remains anchored through midnight while the list is open, and kiosk
return does not dismiss it. Config/view changes or disconnection clear the transient list.
Provider writes remain blocked by the existing read-only contract. No HA deployment,
new polling, preference schema change, dependency upgrade, release or main merge.
Verification and delivery receipts belong to STATUS.

### D35. Agenda reveals the selected date

**Bounded CAL-02 correction under continued work, 2026-09-22.** A new regression against
r22 and the rendered preview both reproduced Day Wednesday → Agenda opening on Monday.
The selected date was retained internally but not revealed in the list. This is a navigation
repair, not approval of a broader Agenda redesign or density control.

Wall Agenda now reveals the selected date on entry/configuration, Day's enabled-Agenda
overflow route, explicit week paging and Today. Paging keeps the selected weekday. Date
navigation is independent of the hourly `scroll_to_now` option. An empty selected date
uses the next available group in that week, otherwise the last earlier group, retaining
its truthful heading; a wholly empty healthy result stays empty. Position clamps to the
available scroll range. Filters and event ordering remain authoritative.

The one-shot date waits for current-range data and measurable layout. Failed empty reads
retain it for retry; subsequent wheel, pointer or keyboard input cancels it so a late load
cannot override the user's interaction. Ordinary refresh, resize, clock updates and details
do not request another jump. Leaving the view, changing the date or disconnecting invalidates
obsolete work. Only the Agenda container scrolls; no focus movement, saved date/scroll state,
extra provider reads, timer, setting or toolbar is introduced. Legacy is unchanged.

R23 implements this behavior. `agenda-context` checks cover six responsive/reduced-motion
configurations, delayed/failed/hidden loads, sparse/empty weeks, Day overflow, week navigation,
Today, details/manual context and native mouse-wheel, keyboard and touch scrolling.
STATUS owns delivery/verification evidence. No HA deployment or release is implied.

### D36. Week reveals the selected date without resetting manual browsing

**Bounded CAL-02 correction under “Continue”, 2026-09-23.** R23 retained Friday internally
when switching Day → Week but displayed Monday at scroll zero. A new regression and manual
review reproduced it. This is a navigation repair, not approval of a Week redesign.

Wall Week now reveals the selected date on entry/configuration, explicit week paging and
Today, within scroll bounds. Paging preserves the selected weekday. Navigation preserves
the horizontal person-column position and scrolls only the Week container; focus stays put.
Date labels start at the top of their rows so a busy day's label is visible on entry even
on a short phone. The date column remains horizontally pinned, not newly vertically sticky.

Reuse Week's existing transient density anchor with an optional absolute navigation date.
Navigation waits for current-range data and measurable layout; a failed read waits for retry.
Subsequent wheel, pointer or keyboard input cancels pending movement. Leaving the view,
obsolete dates and disconnect clear it. Ordinary refresh, resize, clock updates, details
and automatic week-offset bookkeeping do not create navigation requests. Density continues
to retain its fractional row position rather than snapping back to the selected date.

R24 implements this behavior. The six `week-context` cases cover responsive/reduced-motion
layouts, delayed/failed/hidden data, cancellation, paging/Today, density interaction, empty
weeks, weekday settings, remount, legacy and native keyboard/wheel/touch scrolling.
No additional reads, saved date/scroll state, settings, timer, toolbar or legacy change.
Agenda retains D35. STATUS owns verification and delivery; no HA deployment or release implied.

### D37. Month's Today action reveals the current date

**Bounded CAL-02 correction under “Continue”, 2026-09-23.** R24's month-name button reset
the month/date internally but left the current date outside the visible scroll area.
The regression failed on a short landscape screen; manual review also reproduced today
below the viewport. This repairs the existing Today action, not Month entry/paging design.

In wall Month, clicking the month name now reveals today's date below the pinned weekday
heading and brings its column into view. Only the Month container scrolls, within its
bounds. Already visible dates stay in place; a tall day's appointments need not all fit.
The existing overflow collapse and selected-date reset are retained. The button's accessible
name includes the displayed month plus localized Today, with a Today tooltip; no new row.

A transient `_monthScrollDate` waits for current-range data and measurable layout. Failed
reads wait for retry; healthy empty months still reveal the date. Grid wheel/pointer/keyboard
input cancels pending movement. Month paging, view/config changes, disconnect, midnight
and kiosk return discard obsolete work. Refresh, resize, filters and details do not create
a new request. No additional fetch, timer, stored date/scroll state or legacy change.

R25 implements this behavior. `month-today` covers six responsive/reduced-motion cases,
compact/restricted grids, both scroll axes, overflow, details/focus, ordinary updates,
delayed/hidden/failed data, cancellation, locale, legacy and native Enter/mouse/touch activation.
STATUS owns verification/delivery. No new Month zoom, redesign, HA deployment or release.

### D38. Keep Timeline identity visible inside tall person rows

**Bounded CAL-02 correction under “Check it in chrome and continue”, 2026-09-23.**
The connected Chrome extension worked without another installation. Synthetic desktop and
phone review confirmed Month Today/overflow/details, compact Month → Day → Agenda and
selected-date Week behavior. Short landscape review then reproduced Timeline appointments
with no visible person name: twelve overlapping appointments made the row 657px tall,
centering its name at y≈464 below a 390px screen.

R26 groups each Timeline avatar/name/presence label in `.tlidentity`. In wall mode it starts
at the row's top and sticks below the existing hour axis while that person's row scrolls.
The group remains bounded by that row; it cannot label the next person's appointments.
The outer `.tlperson` retains horizontal pinning, filter interaction and keyboard focus.
Legacy uses `display: contents` to preserve its previous layout. No new fixed section,
toolbar, height reservation, scroll handler, calendar read, preference or configuration.

The existing `timeline` suite now checks identity at row entry and during vertical/horizontal
browsing, row-boundary containment, hide/restore and legacy isolation. Its new assertion
failed against r25 before the correction. STATUS owns complete QA and delivery evidence.
This is not a broader Timeline redesign, HA deployment or release.

### D39. Keep Timeline's current-time label on its pinned axis

**Bounded CAL-02 correction under “Continue”, 2026-09-23.** Chrome review of r26
reproduced the red current-time line remaining visible while its label scrolled above
the screen. A 195px vertical scroll moved the label from y=131 to y=−64 while the
hour axis stayed at y=129–156. Vertical scrolling changes people, not time, so the
label belongs to that existing pinned axis.

R27 renders the wall-only label inside `.tlhours`, keeping the same formatting and
clock offset as the line. It stays centered where space permits and shifts inside
the time area's start/end boundaries when needed. Horizontal browsing still moves
it with the actual clock position; it is not an edge-pinned “now” indicator. The line
and label paint behind the pinned names/corner, and neither intercepts pointer input.
No additional header height, toolbar, scroll listener, clock timer, provider read,
preference or configuration was added. Legacy retains its line-owned label.

The focused `timeline-marker` suite covers vertical/horizontal movement, clock ticks,
12/24-hour labels, both zoom extremes, full/custom time-range edges, hidden-line/other-date
states and legacy across six responsive/reduced-motion cases. The original regression
failed r26 before the fix. Marker checks have their own suite to keep the existing Timeline
suite within its timeout; no assertions or timeouts were weakened. STATUS owns QA/delivery.
No HA deployment, release or broader Timeline redesign is implied.

### D40. Keep long Timeline event titles readable while panning

**Bounded CAL-02 correction under “Continue”, 2026-09-23.** Chrome review of r27
showed an all-day event as a blank colored bar after horizontal scrolling. At 390×844,
the bar crossed the visible time area but its title was at x=−780 to −657. The same
left-anchored text affected long timed and overnight events. The new regression failed
r27 with the all-day title at x=−372 to −249 on desktop.

R28 keeps the existing title sticky horizontally, just after the pinned names, within
its own event bar. Width is bounded by the bar and card; long titles use ellipsis and
retain full read-only details. As the event's trailing edge leaves, the title leaves
with it instead of floating over empty time. Optional time is placed below the title;
both lines follow panning independently and fit the existing 48px minimum lane. This
avoids the partly obscured inline time caught during desktop screenshot review.
The existing time-visibility guard is retained. Event times, duration geometry, lanes,
continuation markers and details targets remain unchanged. No extra fixed section,
wrapper, state, timer, listener, fetch, preference or configuration is introduced.

This is wall-only CSS: `overflow: clip` preserves rounded bar clipping without making
the bar a scroll container, so the title can follow the existing Timeline scroller.
Legacy keeps its original static text/hidden overflow. The six `timeline-labels` cases
cover all-day/long/overnight/short events, zoom, resize, trailing edges, source refresh,
person filtering, details/focus and legacy. STATUS owns full QA and delivery evidence.
No broader Timeline redesign, live HA deployment or release is implied.

## D41 — Bound the full-height wall in the real HA host

**Implemented for the read-only usability candidate, 2026-09-24.** The user requested
continued work through a major release milestone without routine pauses. The concrete
checkpoint is [CALENDAR-RC](CALENDAR-RC.md): integration-tested five-view daily use,
not a new public-release, main-merge or event-write authorization.

Actual HA r28 rendered Agenda thousands of pixels tall because its inline card and panel
ancestors were content-sized. Its inner scroller had equal client/scroll heights; Today
could not reveal the selected group. The prior fixed-height harness concealed the issue.
A new content-sized-host regression reproduces it against r28.

When wall `full_height` is enabled, size the whole shell to the remaining viewport,
retaining its existing percentage max-height for smaller bounded hosts. Do not put
another cap inside individual views. Day/Timeline/Week/Month/Agenda keep their existing
flex scrolling, filters, details and date/zoom policies. Without full-height, retain
host-provided sizing. The default remains false; legacy's Day sizing is unchanged.

Use the existing ResizeObserver for the rendered shell as well as the outer card:
an inline HA host alone cannot report hidden/reveal box changes. Clean up replaced
targets and disconnected cards. A paired viewport-resize listener covers height-only
changes; no new calendar reads, polling, saved preferences, controls or fixed rows.
The expanded regression also reproduced a pending Agenda date jump lost on reveal
before the shell observation correction. Delivery and actual-HA proof belong in STATUS.

The complete regression run also caught a 320px Month edge case: the now-bounded
scroller's visible scrollbar left date cells only 43px wide. At card widths up to
360px, remove compact Month's side padding so seven date targets retain the existing
44px minimum without horizontal scrolling. Keep the scrollbar and test threshold;
connected Chrome measured 44.14px targets at 320px after the correction.

## Discussion sequence and disposition

| Discussion | Outcome and current disposition |
|---|---|
| Continue through a major release milestone, 2026-09-24 | Work toward the read-only calendar usability candidate without routine gates: real-HA sizing repair, five-view regression/native review, tested push, targeted pilot update and durable handoff. D41 records the correction; public publication/editing remain separate. |
| Update HA, 2026-09-23 | Deployed tested/pushed r28 to the existing read-only pilot with targeted backups and a resource-only update. Configuration, other registrations and calendar data unchanged; no Core upgrade/restart or public release. Live Chrome review found an Agenda content-sized-host/Today-scroll gap, recorded under CAL-02 for the next bounded fix, not silently marked passed. STATUS owns deployment evidence. |
| Continue after r27, 2026-09-23 | Chrome reproduced unlabeled long/all-day Timeline bars during time browsing. D40 keeps existing titles visible within their event boundaries; no new fixed section, event semantics or live deployment. |
| Continue after r26, 2026-09-23 | Chrome reproduced the current-time label disappearing while scrolling people. D39 moves the label into the existing pinned hour axis, preserves horizontal clock position and protects pinned names; no extra fixed section or live deployment. |
| Check in Chrome and continue, 2026-09-23 | Used the connected Chrome extension, verified existing navigation, then reproduced and repaired an off-screen name in tall Timeline rows (D38). Continue in the existing repo; no extra plugin, live-calendar write or deployment. |
| Continue after r24, 2026-09-23 | Reproduced Month's Today action leaving the current date off-screen. D37 repairs explicit two-axis reveal with delayed-input safeguards; ordinary entry/paging and the overall Month layout are unchanged. |
| Continue after r23, 2026-09-23 | Reproduced Week opening on Monday despite selecting Friday. D36 reveals the selected date and keeps the date label visible on entry, preserving manual scrolling and zoom. No broader redesign or live deployment. |
| Continue after r22, 2026-09-22 | Reproduced Agenda opening at week start despite the selected Day date. D35 repairs date reveal and explicit Today/week navigation while preserving manual scrolling. No Agenda redesign, zoom, deployment or release. |
| Continue after r21, 2026-09-22 | CAL-02 review reproduced a dead Day overlap chip when Agenda was disabled. D34 adds a current-data person/day list and details return path, with responsive/native-input tests and a milestone push; no live deployment. |
| Chrome extension clarification and continue after r20, 2026-09-22 | Existing browser access verified; no additional plugin needed. D33 repairs keyboard navigation of view/date tabs under CAL-02, with no redesign or live deployment. |
| Continue after r19, 2026-09-22 | CAL-02 review exposed unreachable Month overflow in restricted configurations. D32 adds in-place expansion, keyboard/touch access, readable narrow fallback and truthful date targets; verify/document/push without live deployment. |
| Continue after the r18 push, 2026-09-22 | Extend the suggested Week-density slice with independent saved list scale, fixed headings/target floors and date-row anchoring (D31); verify, document and push. No live deployment or release implied. |
| Continue after the r17 push, 2026-09-22 | Implement scoped saved Day/Timeline zoom with the existing opt-out, migration and Reset semantics (D30), then verify/document/push. No HA deployment, release or Week zoom implied. |
| Continue, 2026-09-22 | Extend CAL-01 to Timeline with independent horizontal density and anchored scrolling (D29); verify, document and push on the existing branch. No live deployment or release implied. |
| Continue the next phase, 2026-09-21 | Implement the requested zoom feature's wall Day slice (D27) and repair the diagnosed test-runner issue (D28). Keep all decisions in this repo; verify and push the milestone without GSD gates. No HA deployment or release implied. |
| Skylight UI/features, existing HA cards, and a possible custom website | Calendar-first HA fork selected. Original research remains linked from the documentation index. |
| Dedicated repo, phased plan, and implementation-base comparison | Repo created; ADR accepted; foundation reviewed. GSD was later retired. |
| Where ADRs live and what the prototype was being checked against | ADR and foundation acceptance records retained and linked. Current status replaces stale phase progress as the entry point. |
| Similarity to legacy, when to design, and whether meals can be added later | Foundation first, full styling later, calendar core before optional household modules. |
| Avatar geometry, portrait mounting, narrow menus, person scrolling, time format, and date heading | Concrete responsive requirements retained in D06; final hardware and complete mobile presentation remain open. |
| Repeated requests to keep going and remove gates | Direct development adopted in D05. Documentation must not become another approval gate. |
| Proving real calendars before front-end polish | Read-only pilot, source parity, routing, and software recovery checks completed; HA-app lock/reopen confirmed by the user 2026-09-21. Provider timing test subsequently waived; exact latency remains unmeasured. |
| Desktop scrolling in actual HA versus a laptop preview | User confirmed scrolling worked with enough space. Inspect the actual deployed HA surface when it is the reported target. |
| Misalignment after person toggles and ordinary resize | Reproduced, fixed, regression-tested, and deployed in `0.25.1-moran.3`. |
| Scrolling stopped at 10 PM | Full-day configuration accepted and deployed; D08 records the distinction from package defaults. |
| Suggested next steps: Today recentering, remembered preferences, phone checks | Today and browser-local preferences deployed and HA-verified on 2026-09-16; physical-device checks remain open. |
| Meaning of “free” versus future events in Status tiles | Existing logic explained and countdown clipping confirmed. Terminology and separate availability/dated-next presentation accepted on 2026-09-16. |
| Restart the development server for prototype review | Local sample-data harness restarted at port 4173 on 2026-09-16; this does not update HA or claim live-calendar verification. |
| Fantastical screenshot review of the date strip | Separate full-width date cells replace the compressed centered date cluster; D07 records the accepted presentation and its scope. |
| Separate screenshot review of the top view switcher | Neutral capsule with an inset selected pill requested; D12 keeps this separate from the full-width date cells. |
| Continue calendar work; defer an image-annotation preview | Accepted local improvements promoted to the existing read-only HA pilot under D13; no image preview or public release created. |
| Later request to view the reference screenshot for annotations | Opened in an isolated temporary loopback page; original image unchanged and no private image copied into this repo. |
| Continue and clarify the next milestone, 2026-09-20 | Dependable read-only desktop/mobile daily use; finish visible controls and discrete date navigation while retaining data integrity/recovery. Full redesign and household modules remain deferred. |
| Continue without the remaining test, 2026-09-21 | Timed provider-change test explicitly waived, not passed. Continue concrete usability corrections; D16/D17 record the scope and date-continuity fix. |
| What else; continue, 2026-09-21 | Bounded Week/Month/Agenda usability pass chosen under continued read-only calendar work; D18 records the behavior and compatibility limits. No new acceptance gate. |
| Future zoom slider, 2026-09-21 | User requested adjustable row density to zoom out and show more events. Recorded for later implementation; D19 separates the requested feature from suggested interaction details. |
| Too many fixed rows, 2026-09-21 | Four annotated corrections accepted: single compact header, left/naturally spaced dates, collapsible Status tiles, and removal of the separate Today row. D20 records preserved navigation and superseded presentation choices. |
| Title and time, 2026-09-21 | “Moran Calendar” with a current-time label 12px after the title; compact dimensions, locale preference and narrow behavior retained. See D21. |
| Commit and push at milestones, 2026-09-21 | Starting at the next verified milestone, commit and push the current working branch without another routine gate; releases and main-branch merges remain separate. See D22. |
| Self-contained repo context, 2026-09-21 | Root handoff, portable agent instructions, product brief, prioritized backlog, code map, setup/testing, sanitized operations and research index added. No prior chat or private HA access required for local feature work. See D23. |
| Timeline uses only a small container, 2026-09-21 | Full remaining height and expanding rows requested; overlap minima, scrolling, Status disclosure, read-only details and legacy compatibility preserved. See D24. Continue in the existing calendar repo. |
| Timeline starts before the current time, 2026-09-21 | Initial/entry scroll and explicit Today recentering extended to wall Timeline; manual browsing preserved. See D25. |
| Weekday/number alignment, 2026-09-21 | Center text over a shared axis while keeping the date group at the cell's left inset. See D26. |
| Freshness check before commit/push, 2026-09-21 | Reconciled stale README/guide references, verified source/build/served bytes, refreshed local tabs still on older code, and retained the separate r12 HA deployment and unresolved ENG-05 CI issue. No new app feature or deployment. |
| GitHub failure emails, 2026-09-21 | Read-only diagnosis found two UTC-sensitive DST fixture assertions, not typecheck errors. Test timezone must be established before Vitest workers start; engineering follow-up ENG-05. No CI repair was included in that diagnostic request. |

## Evidence and date boundaries

- [Foundation discussion, 2026-09-11](../.planning/phases/01-prove-the-foundation/01-DISCUSSION-LOG.md)
  and [accepted avatar/ADR checks](../.planning/phases/01-prove-the-foundation/01-UAT.md).
- Source checkpoint `7006fd2551dbc64064e1d1ef1c6957eec2948fcf` records the read-only,
  reliability, responsive, and locale work accumulated through 2026-09-16.
- Source checkpoint `42495b0f572dc7ddf226bff432f075168f43ffe1` records the alignment fix.
- Source checkpoint `e6c1c5b0372004222ca44165eef9abab1e5fba54` was the
  `0.25.1-moran.4` daily-use build installed on 2026-09-16.
- Source checkpoint `c3d8bfd9a629f8ece1cd03aa17c97f542e15b0bd` supplied one-day navigation
  in `moran.5` on 2026-09-20; `3fb839c48cef80954de43a9d46aa347093ce5cf0` superseded it
  the same day with the `moran.6` filter-scroll correction. Both were committed locally
  and deployed to the same read-only preview, not pushed or published as releases.
- The 2026-09-16 full-day configuration and Status-tile diagnosis were verified in the
  authenticated HA pilot. Sensitive operational evidence remains in the private workspace.
- The 2026-09-16 conversation established D07 through D10; a later annotation explicitly
  approved D09's availability/dated-next example. Consolidation does not imply all earlier
  conversation happened on this date.
