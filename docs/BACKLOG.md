# Calendar backlog

Status: current queue, consolidated 2026-09-21. Priority below is a recommended order,
not new user authorization. [Decisions](DECISIONS.md) own product choices;
[STATUS](STATUS.md) owns delivery evidence. No GSD phases or mandatory gates.

## Requested future work

| ID | Priority / state | Outcome and completion criteria | Source |
|---|---|---|---|
| CAL-01 | Next feature candidate; requested for later, not started | A slider changes calendar row density. Zoom out shows more time/events; zoom in improves detail. Keep navigation readable, preserve visible date/time and lane position, avoid hiding short/overlapping appointments, support keyboard/touch, and test the selected range. | D19 |
| CAL-02 | Next usability milestone; broad design deferred | Consistent, readable navigation and density across all five views at desktop, phone and portrait sizes. Keep D18–D21 fixes; implement concrete feedback without demanding a complete redesign first. | D06, D07, D18 |
| CAL-03 | Hardware-dependent; open | Validate the actual portrait/landscape wall installation. Record resolution, device pixel ratio, browser/kiosk wrapper, distance and touch reach. Confirm full-day access, reload/wake and legibility. Desktop emulation cannot certify physical hardware. | D06 |

### CAL-01 implementation handoff

The request is a **row-density slider**, not browser zoom or a second calendar view.
Suggested first slice: Day view, where `hour_height`, `_pxPerMin`, fit measurement and
scroll anchors already exist. This is a recommendation; view coverage is not settled.

Before choosing values, inspect `src/config.ts`, `_measureFit`, `_rememberDayScroll`,
`_restoreDayScroll` and Day event positioning in `src/ha-family-board-card.ts`.
Reuse existing scroll/context safeguards. Test dense overlaps, short events, all-day rows,
midnight edges, hidden lanes, resize, Today, reduced motion and read-only details.

Open choices: slider range/default, reset behavior, interaction with `fit_height`, coverage
of Timeline/Week, placement and per-device persistence. If saving density, extend the existing
preference schema with migration/invalidation tests; never store appointments. Do not add
this work during a documentation-only request.

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

- Physical iPhone HA-app lock/reopen refresh: user-confirmed pass on 2026-09-21.
- Provider edit/cancellation timing: waived on 2026-09-21. Unknown latency is not a blocker.
- Safari/network handoff/final wall hardware: not claimed, but not new gates for the accepted baseline.

## Update rule

Keep IDs stable. Add the decision/request source, state, observable acceptance criteria
and evidence link when promoting an item. Mark superseded work rather than deleting its
rationale. “Proposed,” “requested,” “implemented,” “deployed” and “published” are different.
