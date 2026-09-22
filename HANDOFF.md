---
project: moran-family-board-card
date: 2026-09-22
machine: "local macOS development host (hostname omitted)"
source: handoff-mattpocock
---

# Handoff: continue Moran Calendar in this repository

This is the Skylight-inspired calendar project. **It is a Home Assistant TypeScript/Lit
custom card, not a React app and not the Calendar Bridge repository.** Start here even
when the task originated in the separate Home Assistant operations workspace.

## First things to know

- Work on `feature/moran-foundation`. `main` still holds the upstream baseline. Check
  the actual branch and working tree before editing; do not switch or overwrite work blindly.
- Latest development build: `0.25.1-moran.21`, repairing wall view/date keyboard tabs (D33).
  Left/Right wraps focus; Home/End reaches group edges; Enter/Space selects using the existing
  handlers. Tab exits and re-entry targets the selected option. Focus alone causes no fetch,
  preference save or calendar movement; only its track scrolls to reveal it. Groups have
  localized labels and a focusable labeled panel. Legacy remains unchanged. New `tabs` checks
  cover native keyboard/mouse/touch, restricted calendars, locale and narrow/embedded cards.
  Source `60ea31c4f022c18bf4e88bf2b31e3b40e3f75f88` is pushed to personal origin;
  remote HEAD matched and hosted CI/Validate passed. STATUS owns the receipts; later docs-only
  commits retain this build. Do not infer HA deployment.
- Previous development build r20 repaired unreachable Month overflow (D32).
  Wall Month's native `+N more events` disclosure expands one date in place; “Show less”
  collapses it. Full titles/details remain reachable without Day, filters and refresh stay
  authoritative, and details restore focus. Expansion is transient and adds no calendar reads.
  Restricted narrow Month pans a 784px grid instead of shrinking event targets. Normal
  compact Month/date-to-Day remains unchanged; hidden-weekend/no-Day dates are not dead buttons.
  Source `b4467679a5743c33086fae6c53bb00878140cc8b` is pushed to personal origin;
  remote HEAD matched and hosted CI/Validate passed. Receipts are in STATUS; later docs-only
  commits retain this build. No Month/Agenda zoom, provider writes, HA deployment, release or main merge.
- Previous density milestone: r19 added independent Week list density (D31)
  to saved Day/Timeline zoom (D30). Week uses 75–150%, default 100%, scaling spacing/type
  with 12px text and 48px target floors. Pinned headings and person-column widths stay fixed;
  zoom anchors the visible date/fractional row position, not an hour. Week saves/resets independently.
  Timeline's same header popup changes hour width, 48–240px/hour (96 = 100%),
  retaining the clock time after pinned names and vertical row position within scroll limits.
  Day keeps its independent 40–96px height (64 = 100%) and Reset-to-fit behavior (D27).
  Matching browser-local overrides now survive config/remount/reload; opt-out is session-only.
  Existing user/dashboard/card isolation remains. Reset clears only the active saved scale;
  changed density defaults invalidate only that view. V1 view/filters migrate to payload v2,
  but older builds ignore v2 on downgrade. No calendar data/date/scroll positions are stored.
  Timeline Reset restores configured `hour_width`; Today still explicitly recenters.
  Delayed reads/hidden panels preserve pending anchors; newer panning or navigation cancels
  stale restoration. Midnight labels stay within the hour axis. Month/Agenda/legacy are unchanged.
  R18 retains Day/Timeline but drops Week on downgrade; r17 and earlier ignore all v2 preferences.
  The r19 source/CI receipts remain in STATUS as history; r20 retains those density features.
- ENG-05 is repaired in code: `vitest.config.ts` sets Chicago before worker creation.
  `TZ=UTC npm test` now passes all 192; no DST assertion or app runtime timezone was changed.
  Do not restore ineffective in-worker timezone hooks. Hosted CI passed; ENG-05 is closed.
- Installed HA version remains `0.25.1-moran.12`, source
  `4b6530ff7e52d800f8a69ea590ef07b0d026d0f1`, deployed 2026-09-21 at 10:28 CDT.
  The r13–r21 presentation changes target the laptop prototype; they are not deployed to HA.
- The handoff milestone `e3b5b7dd38fcc057f5c096643635cb83de139847` and 29 earlier local
  commits were pushed to personal origin on 2026-09-21; remote HEAD was verified.
  No main merge, release or additional HA deployment occurred. Recheck Git for later work.
- Calendar correctness and daily use are proven to the accepted baseline. Five views,
  person routing, full-day pilot, recovery, filters and read-only details work. Final
  visual design and physical wall hardware are not complete. See [STATUS](docs/STATUS.md).
- The latest header says **Moran Calendar**, then current time with a 12px gap. It is one
  48px row with a 40px view capsule. Status tiles start collapsed. The old Today row is
  gone; month/Today/paging share the left-aligned date strip. Do not restore old screenshots.
- The local harness freezes time at February 18, 2026, 3:32 PM. That is intentional.
  A refreshed laptop bundle does not update the separate HA installation.
- GSD is retired. No phase gates, mandated reviewers or repeated “continue?” prompts.
  Complete authorized work, test, document, commit and push verified milestones.
  Calendar writes, a React pivot, main merges and public releases require separate scope.

## Resume in order

1. Read [AGENTS.md](AGENTS.md), [product brief](docs/PRODUCT.md) and current
   [status](docs/STATUS.md). [Decisions](docs/DECISIONS.md) explain the why.
2. Use [DEVELOPMENT](docs/DEVELOPMENT.md) to start the synthetic preview and run checks.
   No HA access or real appointments are needed for ordinary feature development.
3. Pick work from [BACKLOG](docs/BACKLOG.md) under the current user request. **CAL-01's
   Day, Timeline, Week and saved-zoom slices are implemented.** Next work belongs to CAL-02:
   feedback-driven usability/presentation across views. D32's Month-overflow and D33's keyboard-tab gaps are repaired;
   do not reimplement it or treat the wider restricted grid as final design approval.
   Do not assume Month/Agenda zoom or
   silently turn the calendar milestone into meals/lists. Those modules remain deferred.
4. Preserve [architecture invariants](docs/ARCHITECTURE.md). For live work, follow
   [OPERATIONS](docs/OPERATIONS.md) and the private workspace's current safety rules.
5. Update the owning docs and this handoff before the next milestone push. Verify the
   remote branch, not just a successful local commit. Keep release/deploy/push states separate.

## Evidence and remaining limits

R21 passes 192 UTC-launched unit tests and all 98 compiled-browser scenarios, plus build,
types and formatting. Manual desktop/phone checks confirmed focus versus selection and
contained tab rings; previews are refreshed, saved Day retained and normal viewport restored.
The frontend-testing skill is useful
guidance, not an installation prerequisite: the user's Chrome extension and the in-app
browser are connected. Do not repeat the unnecessary “install a Browser plugin” suggestion.
See STATUS for r21 verification and source/push/hosted-check state.

R20's new `month-overflow` suite reproduced r19's inert overflow, then checks expansion,
collapse, one-date/Today reset, aligned headings, long titles, details/focus, source refresh
and failure, filters, shared/all-day/midnight events, weekend restrictions, locale and legacy.
Real keyboard/mouse/touch checks follow each responsive case. All 192 UTC-launched unit tests
and 91 compiled-browser cases pass; see STATUS for hosted checks and delivery.
Manual desktop/phone checks confirmed expansion → hidden appointment
details → Escape → restored focus/context, and collapse. Screenshots/logs were checked;
temporary viewport and the user's saved Day preference were restored.
Do not infer deployment from a source push.
Actual HA review remains at r12. The user confirmed physical
iPhone HA-app lock/reopen refresh.
They waived the timed provider-edit/cancellation test. Do not reopen that as a gate or
claim measured latency. No real appointment was mutated to test the card.

On the originating checkout, `.planning/debug/wall-menu-clips-narrow.md` was already
untracked. It was left untouched and excluded from this milestone. Its presence does not
mean the old clipping bug is still open; use current tests/status. A fresh clone need not have it.

## Suggested skills

- `build-web-apps:frontend-testing-debugging`: targeted rendered changes and desktop/phone QA.
- `documentation-writer`: maintain the clear separation between setup, reference and rationale.
- `document`: capture durable corrections where the next agent will find them.
- `handoff-mattpocock`: refresh this single current handoff at milestones.

Skills are optional environment capabilities, not repo dependencies. If absent, use the
checked-in commands and procedures. Do not install GSD or block on a missing skill.

## Reference artifacts (do not restate)

- [Documentation index](docs/README.md): topic ownership and complete context map.
- [Backlog](docs/BACKLOG.md): stable IDs, priority, request provenance and completion criteria.
- [Research](docs/research/README.md): Skylight, Fantastical, competing cards and archived evidence.
- [ADR 0001](docs/adr/0001-implementation-base.md): accepted source-pinned fork decision.
- [Calendar validation](docs/calendar-sync-validation.md): HA/Bridge relationship and evidence limits.
- [Configuration reference](README.en.md): public options; generic data only.
- [Personal repository](https://github.com/emilianomoran/moran-family-board-card/tree/feature/moran-foundation): working branch, not a release.
