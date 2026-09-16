# Moran Family Board fork plan

Status: historical foundation plan. A read-only HA pilot is now installed; this plan's
milestones are not the current execution order. Updated 2026-09-16.
Use [DECISIONS.md](DECISIONS.md) for scope and [STATUS.md](STATUS.md) for delivery state.
Meals/lists and a Bridge mutation adapter remain deferred, not prerequisites.

## Objective

Turn the upstream Family Board Card into a Moran-owned, upstream-friendly Home Assistant card that can classify events from shared managed calendars into person lanes without recreating per-person calendars.

The longer-term product direction is the wall-board concept in
[`docs/concepts/moran-family-board-target-v1.png`](./concepts/moran-family-board-target-v1.png). The first implementation slice establishes the safe foundation for that UI rather than coupling household rules directly to rendering code.

## Source-of-truth decisions

- Apple/iCloud managed calendars remain the event source of truth.
- Home Assistant remains the initial display and household-entity layer.
- Calendar Bridge was proposed as a later mutation path for update/delete and recurring-event
  safety. The active pilot remains read-only; no mutation adapter has been selected for implementation.
- Person ownership is derived from configurable event-title rules. The fork must not require new per-person calendars.
- Household-specific names, entity IDs, addresses, and credentials stay out of this public repository.
- The upstream MIT license and attribution remain intact.

## Milestone 1: fork foundation

1. Rename the distributed package, bundle, custom element, editor element, and documentation links to `moran-family-board-card` so it can coexist with upstream during evaluation.
2. Add pure, unit-tested event classification helpers:
   - case-insensitive title-prefix matching;
   - optional title-contains and regular-expression matching;
   - optional removal of the matched person prefix from the displayed title;
   - an unmatched/shared lane for events not claimed by another configured lane;
   - support for leading semantic markers such as emoji without hard-coding Moran names.
3. Fetch each configured calendar once and route each event to one or more matching lanes. Preserve legacy calendar-per-person behavior when no matching rules are configured.
4. Expose the matching fields in the Home Assistant visual editor.
5. Document configuration and backward compatibility.
6. Preserve upstream tests and add coverage for routing, joint-person matches, unmatched events, invalid regular expressions, and title cleanup.

## Milestone 2: wall-board shell

- Add the optional 68/32 calendar-and-operations layout from the target concept.
- Add a top household status bar and accessible profile filters.
- Read tasks and shopping from configurable Home Assistant `todo.*` entities.
- Read dinner from an explicit entity or calendar source.
- Keep Calendar, Tasks, Lists, Meals, and Home navigation functional and configurable.
- Add a development harness and visual regression screenshots at 1920x1080 plus a tablet viewport.

## Milestone 3: Calendar Bridge provider

- Define a provider interface instead of embedding Bridge calls in the renderer.
- Keep the browser talking only to Home Assistant or an authenticated server-side adapter.
- Preserve Calendar Bridge's `(seriesId, occurrenceDate)` identity model and `X-Caller` audit identity.
- Fall back to Home Assistant's calendar read path when the adapter is unavailable.
- Never store a Bridge credential or long-lived Home Assistant token in dashboard configuration.

## Milestone 4: logistics

- Add driver, pickup, departure, attendee, and assignment-state annotations.
- Key annotations to stable event-occurrence identity rather than title and start time.
- Add visible unassigned and conflict states without relying on color alone.

## Technical checks

- `npm run format:check`
- `npm run lint`
- `npm test`
- `npm run build`
- Browser verification of every enabled view and editor configuration.
- Compare rendered behavior with current accepted requirements; the older full operations
  concept is not the calendar pilot's acceptance target.
- Live changes follow the Home Assistant safety protocol, with targeted backups and
  verification. The user retired GSD and mandatory independent-review gates on 2026-09-15.

## Known baseline risk

The initial upstream audit reported eight advisories, including one critical advisory.
This historical count was not revalidated by the documentation update. Check the current
dependency tree before treating it as current evidence; do not mix force-upgrades into
unrelated feature work.
