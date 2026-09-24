# Calendar backlog

Status: current queue, consolidated 2026-09-24. Priority below is a recommended order,
not new user authorization. [Decisions](DECISIONS.md) own product choices;
[STATUS](STATUS.md) owns delivery evidence. No GSD phases or mandatory gates.

## Requested future work

| ID | Priority / state | Outcome and completion criteria | Source |
|---|---|---|---|
| CAL-01 | Day, Timeline, Week and browser-local persistence implemented through r19 | Independent scales, anchored scrolling, Reset, native keyboard/touch support and scoped reload persistence with opt-out. Further refinement follows concrete user feedback; Month/Agenda zoom is not assumed. | D19, D27, D29–D31 |
| CAL-02 | Month overflow r20; keyboard tabs r21; restricted Day overflow r22; Agenda date reveal r23; Week date reveal r24; Month Today reveal r25; tall Timeline identity r26; pinned Timeline time label r27; readable long-event titles r28; broader design deferred | Consistent, readable navigation and density across all five views at desktop, phone and portrait sizes. Preserve D32's Month fallback, D33's keyboard navigation, D34's restricted Day list/details, D35–D37's date/Today and manual-scroll context, D38–D40's visible Timeline identity/labels and D18–D21 fixes. Continue with concrete feedback or reproduced usability defects, not an assumed full redesign. | D06, D07, D18, D32–D40 |
| CAL-03 | Hardware-dependent; open | Validate the actual portrait/landscape wall installation. Record resolution, device pixel ratio, browser/kiosk wrapper, distance and touch reach. Confirm full-day access, reload/wake and legibility. Desktop emulation cannot certify physical hardware. | D06 |

### CAL-01 implementation handoff

The request is a **row-density slider**, not browser zoom or a second calendar view.
The first slice is implemented for wall Day using `hour_height`, `_pxPerMin`, fit measurement
and scroll anchors. Header popup, 40–96px/hour (64 = 100%); Reset
restores configured height/fit. Values and placement are initial implementation choices.
The Timeline extension uses `hour_width` (48–240px/hour; 96 = 100%) with independent
state and left-edge clock-time/vertical-lane anchors. Reset restores configured
width. The same popup serves either view, adding no permanent row. See D29.
R18 saves manual overrides under the existing `remember_preferences` option (D30).
Browser-local, per HA user/dashboard/card, not cross-device sync. Reset clears only the
active scale; changed density defaults invalidate only that view. Older view/filter records
migrate; blocked storage and opt-out keep the calendar usable without persistence.
R19 adds Week list density, 75–150%, default 100% (D31). It scales spacing and event type
with 12px text/48px target floors, fixed headings/column widths and date-row scroll anchoring.
Week is saved and reset independently; it does not use hourly height/width settings.

Before choosing values, inspect `src/config.ts`, `_measureFit`, `_rememberDayScroll`,
`_restoreDayScroll` and Day event positioning in `src/ha-family-board-card.ts`.
Reuse existing scroll/context safeguards. Test dense overlaps, short events, all-day rows,
midnight edges, hidden lanes, resize, Today, reduced motion and read-only details.

Remaining choices: refinement from user feedback and the broader CAL-02 presentation work.
There is no approved Month/Agenda zoom design. Preserve preference
migration/invalidation tests when extending scales; never store appointments. Do not add
features during a documentation-only request.

### CAL-02 candidate: sizing in the actual HA host

Observed during the authorized r28 HA update, 2026-09-23; corrected locally in r29 (D41),
with full-suite/live verification in progress under [CALENDAR-RC](CALENDAR-RC.md). At phone width,
the HA host allowed Agenda/card height to follow all event content. The internal Agenda
element had equal client/scroll heights, so its selected-date/Today action could not
scroll today's group into view. This is not established as an r28 regression; r12 was
not compared. Existing bounded-harness D35 tests still pass but miss this host shape.

Add a synthetic content-sized HA-like parent, then constrain the intended wall scroll
region without breaking legacy or bounded cards. Verify entry/Today/date reveal, manual
browsing, resize, source refresh, details/focus and short/empty weeks at desktop/phone
sizes; finish with actual HA review. Check other views for the same host condition
before claiming their behavior. No new fixed toolbar, zoom mode or calendar writes.
See [deployment evidence](STATUS.md#ha-r28-deployment-2026-09-23).

## Proposals and engineering follow-ups

These are agent recommendations or unresolved questions, not already approved features.

| ID | Priority / state | Outcome and completion criteria |
|---|---|---|
| CAL-04 | Medium; product policy open | Decide whether Status tiles need a view-independent lookahead, a “soon” threshold, all-day busy behavior or overlap explanation. Keep current availability truthful while deciding. No new polling without a measured reason. |
| CAL-05 | Medium; future interaction exploration | Evaluate an animated or scroll-driven date pager only if it improves usability. Preserve separate people/time panning, discrete selection and time context. Current one-day heading gestures already work. No claim of exact Fantastical gesture parity. |
| ENG-01 | Before public release; re-audit required | Re-run dependency audit, separate runtime and development exposure, then upgrade in an isolated tested change. Old September 11 advisory counts are historical, not current facts. Never use force-upgrades as an incidental UI step. |
| ENG-02 | Medium; coverage gap | Add visual-editor configuration round-trip tests before significant editor work. Preserve unknown fields and shared config normalization; inspect current coverage first. |
| ENG-03 | Medium; measured work only | Reduce controller coupling or redundant processing when a feature/performance measurement warrants it. Extract focused seams, not a React rewrite or a speculative new state framework. |
| ENG-04 | Before public release; proposed | Decide whether to run the existing compiled-browser suite in CI. CI currently covers format/types/unit/build; the harness is a local Chromium/CDP runner requiring a compatible Node runtime and Chrome. |
| ENG-05 | Closed in r16; hosted CI passed | Set America/Chicago in Vitest configuration before workers start; remove ineffective in-worker hooks. All DST assertions retained. `TZ=UTC npm test` and hosted CI pass. This changes test infrastructure, not runtime timezone. See D28 and STATUS. |
| ENG-06 | Maintenance; before release | Review the non-failing Actions runtime deprecation and upcoming Ubuntu runner migration notices observed in r16 CI. Check current official guidance and validate workflow/action upgrades separately; no incidental dependency or runner changes in UI work. |
| REL-01 | Separate authorization required | Public GitHub/HACS release, clean installation/update and cache/rollback checks. Milestone pushes are authorized; tags, releases and merges to main are not. |

## Deferred product extensions

| ID | State | Boundary for future work |
|---|---|---|
| EXT-01 Meals/recipes | Nice-to-have; no implementation scope | Separate meal model/data source and bounded UI. Do not disguise meals as provider events just to reuse the grid. Source and write behavior still need a decision. |
| EXT-02 Lists/tasks/chores | Nice-to-have; no implementation scope | HA `todo.*` is a candidate, not a selected complete design. Keep these modules out of calendar correctness and the default screen until scoped. |
| EXT-03 Logistics | Deferred | Driver/pickup/assignment metadata must attach to stable source occurrence identity, not title or rendered owner copy. Decide ownership/storage first. |
| EXT-04 Calendar/Bridge editing | Deferred, high consequence | Authenticated server-side/HA adapter only; per-provider capability, occurrence/series scope, retries, conflict handling and read-only fallback must be designed. No browser credentials or direct Bridge requests. |
| EXT-05 Photos/rewards/import/AI | Research-only ideas | New privacy, subscription and correctness decisions; not implied by Skylight inspiration. |

## Closed baseline: preserve, do not re-plan

Routing/source parity, five views, circular avatars, full-day pilot, narrow access, lane
alignment, Today, saved filters/view, discrete date navigation, cross-view date context,
Status timing, fresh read-only details, hidden-page recovery, compact chrome and header clock
are implemented. [STATUS](STATUS.md) contains the tests and deployment checkpoints.

Timeline's remaining-height correction (D24) is implemented and verified in r13;
see STATUS for verification and delivery. CAL-01's wall Day slider follows in r16 and
Timeline density in r17, saved zoom in r18, and Week list density in r19. These reached
the existing HA pilot together with r28 on 2026-09-23; use STATUS for verification limits.
Wall Timeline's initial/Today centering (D25) is implemented in r14; manual browsing
is retained. See STATUS for local verification and separate HA/CI delivery boundaries.
Date-label centering within the left-aligned group (D26) is implemented in r15.

- Physical iPhone HA-app lock/reopen refresh: user-confirmed pass on 2026-09-21.
- Provider edit/cancellation timing: waived on 2026-09-21. Unknown latency is not a blocker.
- Safari/network handoff/final wall hardware: not claimed, but not new gates for the accepted baseline.

## Update rule

Keep IDs stable. Add the decision/request source, state, observable acceptance criteria
and evidence link when promoting an item. Mark superseded work rather than deleting its
rationale. “Proposed,” “requested,” “implemented,” “deployed” and “published” are different.
