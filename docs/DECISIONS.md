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

Research boundary: the [official calendar-view guide](https://flexibits.com/fantastical-ios/help/calendar-views)
was consulted for date/navigation context. The fixed-axis and snapping requirements come
from the user's experience; exact current gesture behavior was not independently verified
inside the Fantastical app.

### D08. Show the full 24-hour schedule

**Accepted and configured in the pilot 2026-09-16.** The user could not scroll beyond
10 PM because the preview was configured for 6 AM to 10 PM, not because scrolling failed.
Use `start_hour: 0`, `end_hour: 24`, `trim_hours: false`, and `scroll_to_now: true` in the
pilot so the full day remains reachable while the initial view opens near now.

This was a dashboard configuration change using existing support, not a new bundle or a
change to the package's default hour limits. A stronger Today/recenter action is separate
unfinished work.

### D09. Call the top per-person chips “Status tiles”

**Accepted terminology 2026-09-16.** The user asked how the top tiles decide between “free”
and a future appointment and named them **Status tiles**. Use that term in product
discussion and documentation. Existing internal names such as `show_focus` and `_renderFocus`
remain unchanged unless a compatible code migration is separately needed.

The discussion exposed two issues: a future appointment can appear days before it starts,
and its timing qualifier can be clipped. The current rules and open design questions are
recorded in [STATUS.md](STATUS.md#status-tiles-current-rules-and-known-issue).

**Recommended, not yet accepted for implementation:** separate current availability from
the next event, for example:

> Avery · Free now
>
> Next: Project review · Tomorrow, 9 AM

No same-day or “soon” cutoff has been chosen. All-day semantics, overlapping-current-event
presentation, and a consistent lookahead window also need explicit decisions when this
work is taken up. The user asked for the existing logic; that question did not authorize
changing it.

### D10. Keep this conversation's product record in this repo

**Accepted 2026-09-16.** The user asked that conversations and decisions live in the dedicated
project repository. Record material questions, decisions, alternatives, findings, and
unfinished recommendations here, with links from the READMEs and agent entry point.

Use sanitized summaries rather than publishing raw household conversations. Private HA
configuration, calendar content, screenshots, tokens, and backups remain outside the public
repo. Product facts must not exist only in chat or private deployment notes.

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
| Suggested next steps: Today recentering, remembered preferences, phone checks | Recommendations, not an accepted implementation batch. They remain open in STATUS.md. |
| Meaning of “free” versus future events in Status tiles | Existing logic explained and countdown clipping confirmed. Terminology accepted; redesign remains a proposal. |

## Evidence and date boundaries

- [Foundation discussion, 2026-09-11](../.planning/phases/01-prove-the-foundation/01-DISCUSSION-LOG.md)
  and [accepted avatar/ADR checks](../.planning/phases/01-prove-the-foundation/01-UAT.md).
- Source checkpoint `7006fd2551dbc64064e1d1ef1c6957eec2948fcf` records the read-only,
  reliability, responsive, and locale work accumulated through 2026-09-16.
- Source checkpoint `42495b0f572dc7ddf226bff432f075168f43ffe1` records the alignment fix.
- The 2026-09-16 full-day configuration and Status-tile diagnosis were verified in the
  authenticated HA pilot. Sensitive operational evidence remains in the private workspace.
- The 2026-09-16 conversation established D07 through D10 and the unapproved next-step
  proposals. Consolidation does not imply all earlier conversation happened on this date.
