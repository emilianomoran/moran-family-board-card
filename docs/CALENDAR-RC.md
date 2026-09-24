# Read-only calendar usability release candidate

Status: completed and deployed to the existing HA pilot, 2026-09-24, build
`0.25.1-moran.29`. User requested continued work through a major release
milestone without routine pauses. This is the next product checkpoint, not permission
to publish a GitHub/HACS release, merge main, enable editing or redesign the product.

## Completion target

Bring the accumulated calendar usability work through an integration-tested candidate
in the existing HA pilot, with a repeatable regression suite and portable handoff:

- [x] Reproduce and fix the actual HA content-sized-host Agenda/Today failure.
- [x] Verify all five views in content-sized and explicitly bounded hosts, including
  phone/desktop/embedded/short/hidden/resize states. Preserve manual browsing, filters,
  read-only details, current-time navigation, zoom and legacy compatibility.
- [x] Pass types, format, units, build and the complete compiled-browser suite (192 units,
  140 compiled-browser scenarios).
- [x] Review native interactions and screenshots in connected Chrome at desktop/phone sizes.
- [x] Commit/push the tested source and bundle; verify exact-SHA hosted checks.
- [x] Safely update only the existing HA preview resource, retain rollback and verify
  actual HA Agenda/Today plus the other views. No source-calendar writes or Core restart.
- [x] Refresh STATUS, decisions, backlog and handoff with evidence and remaining limits.

The existing zoom, overflow, keyboard navigation, pinned Timeline identity/time/title and
date-context work is included, not reimplemented. Reopen defects when evidence contradicts
the harness. Product acceptance does not mean every future usability preference is settled.

## Included in this candidate

- Native HA calendar reads, person routing and an unmatched Household lane. Source calendars
  remain authoritative; this is not a second calendar database or a Calendar Bridge client.
- Day, Timeline, Week, Month and Agenda with shared date/filter context, explicit Today,
  full 24-hour pilot coverage and read-only event details. Dense-event overflow is reachable.
- A compact header/date strip and collapsed-by-default Status tiles. Current availability
  is separate from the dated next appointment; future events do not mean someone is busy now.
- Independent Day/Timeline/Week density sliders with Reset, anchored scrolling and scoped
  browser-local persistence. Month/Agenda zoom is not part of this candidate.
- Pinned person/time context, narrow/embedded layouts, keyboard tabs and 12/24-hour formatting.
  R29 adds the real HA content-sized-host contract and small-phone Month target correction.
- Refresh/reconnect/wake safeguards, partial-source handling and current-data details, with
  no calendar mutation in the pilot. HA-app lock/reopen is accepted by prior user report.

[STATUS](STATUS.md) owns exact tests, source/CI and deployment receipts;
[BACKLOG](BACKLOG.md) distinguishes implemented behavior from future proposals.

## Boundaries after this checkpoint

Known follow-up CAL-06: when a calendar entity changes availability, Agenda's snapshot
invalidation can reset browsing position. Data recovers and explicit Today restores its
date; ordinary same-availability refresh/details retain position. This candidate is not
a claim of flawless failure/recovery context. See STATUS for the actual-HA evidence.

Final wall hardware, physical Safari/network-handoff testing, public-distribution dependency
and installation audits, editing, household modules and full visual design remain separate.
The previously waived provider-timing test stays waived. No claim of measured sync latency.
Public release operations remain REL-01; use the backlog for their prerequisites.
