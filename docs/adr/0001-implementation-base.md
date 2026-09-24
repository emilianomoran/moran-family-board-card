# ADR 0001: Select the implementation base

- **Status:** Accepted
- **Date:** 2026-09-11
- **Scope:** Phase 1 foundation

Decision: Continue the Moran fork

## Context

The project needs a calendar-first wall experience without replacing Home Assistant as the
authenticated calendar and dashboard layer. Two implementation bases were plausible: this
dedicated TypeScript/Lit repository and `tienou/family-calendar-card`, whose presentation is
closer to a commercial wall calendar.

Visual resemblance is not sufficient evidence for a pivot. The decision must preserve the
shared-calendar-to-person model, the five-view roadmap, backward compatibility, a testable
architecture, and the rule that browser code receives calendar access only through Home
Assistant.

This repository remains the only tracked evaluation workspace. No second fork or parallel
implementation repository will be created for this comparison.

## Evidence Pins

- Moran candidate: commit
  [`1f71865f70345cbf0acfc02ea0f33769fa8f9598`](https://github.com/emilianomoran/moran-family-board-card/tree/1f71865f70345cbf0acfc02ea0f33769fa8f9598)
- Alternative candidate: commit
  [`ee9d8f4df11ea65d175e00dc3835611549ffe9b4`](https://github.com/tienou/family-calendar-card/tree/ee9d8f4df11ea65d175e00dc3835611549ffe9b4)

The matrix below was checked against those immutable trees. Conclusions do not depend on a
mutable default branch or on either project's README.

## Source Evidence Matrix

| Criterion | Moran candidate source evidence | Alternative candidate source evidence | Conclusion |
|---|---|---|---|
| Target calendar behavior | [`src/ha-family-board-card.ts`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/ha-family-board-card.ts#L34-L35) defines day, timeline, week, month, and agenda, and its [`render()` branch](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/ha-family-board-card.ts#L1232-L1264) dispatches all five renderers. | [`src/card.js`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L203-L220) configures Today, Tomorrow, Week, Biweek, and Month; [`_applyViewSettings`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L1187-L1219) maps them to one-, seven-, fourteen-day, and month grids. | The alternative supplies useful wall and touch precedents, but the Moran candidate already implements the roadmap's required calendar horizons and semantics. |
| Shared-calendar-to-person routing | [`src/events.ts`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/events.ts#L12-L18) defines prefix, contains, regular-expression, and unmatched rules; [`routeEventToPeople`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/events.ts#L83-L99) permits multiple matching lanes and an unmatched fallback. | [`src/card.js`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L864-L913) groups and filters configured calendars, while its [`calendar fetch loop`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L3015-L3064) attaches each event to its source calendar. Searches of the pinned `src/` tree found no person-lane, multi-person, or unmatched-routing contract. | The Moran candidate directly supports the core data model; pivoting would require rebuilding it. |
| Home Assistant API use | The [`calendar read path`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/ha-family-board-card.ts#L759-L782) uses the authenticated `hass.callApi`, and [`calendar mutations`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/ha-family-board-card.ts#L2270-L2342) use `hass.callWS`. | Calendar reads also use [`hass.callApi`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L3015-L3064), but optional features accept browser-held provider keys in [`setConfig`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L332-L342) and make direct browser requests to [Gemini and Anthropic](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L3872-L3919). | Keep the Moran candidate's Home-Assistant-only credential boundary and do not port direct-provider-key patterns. |
| Test depth | [`src/events.test.ts`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/events.test.ts) covers routing and calendar math; [`package.json`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/package.json#L14-L20) exposes typecheck, Vitest, formatting, and build scripts; [`ci.yml`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/.github/workflows/ci.yml#L20-L33) runs all four gates. | [`package.json`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/package.json#L13-L16) exposes only watch and build scripts, and [`build.yml`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/.github/workflows/build.yml) builds without a test or typecheck step. No test or spec file exists in the pinned tree. | The Moran candidate provides the safer base for behavior-preserving extraction. |
| Maintainability | The large [`src/ha-family-board-card.ts`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/ha-family-board-card.ts) remains a known risk, but pure event behavior is already separated in [`src/events.ts`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/events.ts), with editor and localization modules also separate. | The alternative concentrates configuration, reads, CRUD, recurrence, provider calls, and rendering in its 5,209-line [`src/card.js`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js), alongside 2,562 lines of [`src/card.styles.js`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.styles.js). | A pivot exchanges one monolith for a larger one; incremental seams in the typed codebase are lower risk. |
| License/provenance | [`LICENSE`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/LICENSE) retains the original and fork copyrights, and [`NOTICE.md`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/NOTICE.md) records upstream attribution. | The alternative's [`LICENSE`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/LICENSE) is MIT and requires its copyright and permission notice to remain with copied substantial portions. | Behavioral learning is compatible with the current provenance chain; substantial source copying requires an explicit additional attribution record. |
| Migration cost | The existing [`FamilyBoardConfig` and `PersonConfig`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/ha-family-board-card.ts#L37-L97), editor, TypeScript build, tests, bundle name, and custom-element identity remain in place; the foundation needs only an optional layout key and focused seams. | The alternative is a JavaScript/Parcel/Luxon project per [`package.json`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/package.json), and its [`editor calendar model`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/editor.js#L107-L154) configures calendars rather than routed person lanes. | Pivoting requires porting the core person model, five-view behavior, editor, tests, TypeScript contracts, build, and distribution identity, with substantial regression risk. |
| Five-view roadmap fit | [`ALL_VIEWS`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/ha-family-board-card.ts#L34-L35) is exactly day, timeline, week, month, and agenda, and [`render()`](https://github.com/emilianomoran/moran-family-board-card/blob/1f71865f70345cbf0acfc02ea0f33769fa8f9598/src/ha-family-board-card.ts#L1255-L1264) reaches each dedicated renderer. | [`getStubConfig`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L203-L220) and [`_applyViewSettings`](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js#L1187-L1219) expose Today, Tomorrow, Week, Biweek, and Month; pinned source searches found no timeline or standalone agenda renderer. | The Moran candidate fits the required view contract without translating or dropping views. |

## Decision and current workflow

Continue development in this repository. Treat `tienou/family-calendar-card` as a source-pinned
design reference for wall composition, touch navigation, calendar filtering, and responsive
density—not as the implementation base.

The implementation-base decision remains accepted. On 2026-09-15, the user retired GSD;
the original phase-plan and issue-update gates no longer control execution. A future
architectural pivot still needs an explicit decision and migration rationale in the
[current product record](../DECISIONS.md), not a second untracked implementation.

## Provenance and Reuse Policy

Learning a behavior means observing an interaction or outcome and implementing it against this
project's own contracts. That does not require copying the alternative's expressions, structure,
or source text.

Before any substantial copied code is accepted, the change must:

1. Document the exact source repository, full source commit, and copied file or function.
2. Confirm license compatibility during review.
3. Preserve the applicable MIT copyright and permission notice in the distributed work and add
   explicit attribution to this repository's `LICENSE` or `NOTICE.md` as appropriate.
4. Keep the existing upstream attribution and commit provenance intact.

No source from the alternative was copied to make this decision.

## Consequences

### Positive

- Existing tested person routing and calendar math remain authoritative.
- The exact five-view roadmap can evolve instead of being recreated.
- Home Assistant continues to own authentication and calendar-provider access.
- Phase 1 can make focused, reversible extractions while legacy rendering remains available.
- One repository contains the decision, implementation, tests, distribution artifact, and
  provenance record.

### Costs and constraints

- The current main component still needs incremental decomposition.
- The alternative's polished wall patterns must be translated into this project's interaction
  and configuration contracts.
- Compatibility tests are mandatory because the selected base has existing users and behavior.
- This decision does not authorize household operations, direct provider integrations, a full
  rewrite, or a live Home Assistant deployment.

## Rejected Pivot Rationale

The alternative was rejected as the implementation base because it does not contain tested
shared-calendar-to-person routing, does not expose the required timeline and agenda views, has no
automated behavior suite or typecheck gate, permits optional browser-held provider keys, and would
require a broad editor/build/configuration migration. Its closer visual resemblance does not offset
those product, security, and migration costs.

## Revisit Trigger

Reconsider the implementation base only when another candidate demonstrates all of the following
at a pinned source commit:

- tested routing from one shared calendar event to one person lane, multiple matching person
  lanes, or an explicit shared/unmatched lane;
- dedicated day, timeline, week, month, and agenda views that share stable event identity;
- a typed architecture with automated tests for its calendar behavior and configuration;
- an HA-only credential boundary, with no provider secret stored in dashboard configuration or
  sent directly by browser code; and
- a documented migration whose cost and regression risk are lower than continuing the focused
  extraction in this repository.

Until every condition is met, the accepted decision remains in force.
