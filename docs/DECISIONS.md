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

## Discussion sequence and disposition

| Discussion | Outcome and current disposition |
|---|---|
| Skylight UI/features, existing HA cards, and a possible custom website | Calendar-first HA fork selected. Original research remains linked from the documentation index. |
| Dedicated repo, phased plan, and implementation-base comparison | Repo created; ADR accepted; foundation reviewed. GSD was later retired. |
| Where ADRs live and what the prototype was being checked against | ADR and foundation acceptance records retained and linked. Current status replaces stale phase progress as the entry point. |
| Similarity to legacy, when to design, and whether meals can be added later | Foundation first, full styling later, calendar core before optional household modules. |
| Avatar geometry, portrait mounting, narrow menus, person scrolling, time format, and date heading | Concrete responsive requirements retained in D06; final hardware and complete mobile presentation remain open. |
| Repeated requests to keep going and remove gates | Direct development adopted in D05. Documentation must not become another approval gate. |
| Proving real calendars before front-end polish | Read-only pilot, source parity, routing, and recovery checks completed; real-device and propagation checks remain open. |
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

## Evidence and date boundaries

- [Foundation discussion, 2026-09-11](../.planning/phases/01-prove-the-foundation/01-DISCUSSION-LOG.md)
  and [accepted avatar/ADR checks](../.planning/phases/01-prove-the-foundation/01-UAT.md).
- Source checkpoint `7006fd2551dbc64064e1d1ef1c6957eec2948fcf` records the read-only,
  reliability, responsive, and locale work accumulated through 2026-09-16.
- Source checkpoint `42495b0f572dc7ddf226bff432f075168f43ffe1` records the alignment fix.
- Source checkpoint `e6c1c5b0372004222ca44165eef9abab1e5fba54` is the deployed
  `0.25.1-moran.4` daily-use build; public documentation records sanitized QA outcomes.
- The 2026-09-16 full-day configuration and Status-tile diagnosis were verified in the
  authenticated HA pilot. Sensitive operational evidence remains in the private workspace.
- The 2026-09-16 conversation established D07 through D10; a later annotation explicitly
  approved D09's availability/dated-next example. Consolidation does not imply all earlier
  conversation happened on this date.
