# Moran Family Board fork plan

Status: implementation plan for `feature/moran-foundation`; no Home Assistant deployment.

## Objective

Turn the upstream Family Board Card into a Moran-owned, upstream-friendly Home Assistant card that can classify events from shared managed calendars into person lanes without recreating per-person calendars.

The longer-term product direction is the wall-board concept in
[`docs/concepts/moran-family-board-target-v1.png`](./concepts/moran-family-board-target-v1.png). The first implementation slice establishes the safe foundation for that UI rather than coupling household rules directly to rendering code.

## Source-of-truth decisions

- Apple/iCloud managed calendars remain the event source of truth.
- Home Assistant remains the initial display and household-entity layer.
- Calendar Bridge remains the eventual mutation path for update/delete and recurring-event safety.
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

## Verification gates

- `npm run format:check`
- `npm run lint`
- `npm test`
- `npm run build`
- Browser verification of every enabled view and editor configuration.
- Direct comparison of the rendered wall board with the target concept.
- No live files under `/Volumes/config` are changed until the Home Assistant change protocol, backup, and required independent reviews are complete.

## Known baseline risk

The untouched upstream dependency tree currently reports eight npm audit advisories, including one critical advisory. Dependency remediation is a separate reviewed change; no force-upgrade will be mixed into the feature foundation.
