# Phase 1: Prove the Foundation - Research

**Researched:** 2026-09-10
**Domain:** Brownfield Home Assistant Lit custom-card foundation, compatibility, and wall-shell proof
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Implementation Base Decision

- **D-01:** Continue using this dedicated Moran repository while evaluating `tienou/family-calendar-card`; do not create or fork another tracked project during the spike.
- **D-02:** Compare source, not README claims, using one written matrix: target calendar behavior, shared-calendar-to-person routing, Home Assistant API use, test depth, maintainability, license/provenance, migration cost, and fit with the five-view roadmap.
- **D-03:** The ADR must end in one of two actionable outcomes: continue this fork, or pivot this repository's implementation direction and update PROJECT.md, REQUIREMENTS.md, ROADMAP.md, and GitHub issue #2 before UI implementation proceeds.
- **D-04:** Reusable ideas may be learned from compatible open-source implementations, but code is copied only when license and attribution requirements are explicit and preserved.

#### Wall Slice Composition

- **D-05:** Phase 1 wall mode is calendar-only and uses the available panel as one scheduling canvas. The older 68/32 tasks, shopping, and dinner rail is deferred beyond v1.
- **D-06:** The slice includes a restrained status/header region, calendar identity, existing date/view navigation where functional, and the existing day calendar. Controls for deferred sections must not appear as decorative or inert placeholders.
- **D-07:** The visual direction remains the approved white, quiet, high-contrast wall-board language in `docs/MORAN_DESIGN_SPEC.md`, but calendar-first requirements override that document's household-operations rail.
- **D-08:** Phase 1 proves shell composition and integration, not final day-view hierarchy. Person filters, now/next refinement, dense-layout rules, and glanceability validation belong to Phase 2.

#### Configuration and Compatibility

- **D-09:** The public opt-in is `layout: wall`. When absent, normalization selects legacy/default behavior without changing existing appearance or interaction.
- **D-10:** Card and editor import the same configuration interfaces, layout union, defaults, and normalization helpers. Unknown legacy keys continue to survive editor round-trips.
- **D-11:** The upstream custom element and the renamed Moran custom element must continue to coexist. No aliases may reclaim the upstream element name.
- **D-12:** Wall-mode additions use documented Home Assistant theme variables with safe fallbacks and introduce no household-specific defaults.

#### Refactor Depth

- **D-13:** Use incremental extraction, not a rewrite: first shared configuration/defaults, then a narrow typed calendar data boundary only where the wall slice needs it.
- **D-14:** Preserve the existing pure logic in `src/events.ts`; Phase 1 does not reorganize every renderer or mutation flow.
- **D-15:** New wall-shell markup and styles should live in a focused module if that avoids growing the main component. Existing view extraction is allowed only when necessary to mount the shell safely.
- **D-16:** Generated `dist/moran-family-board-card.js` is rebuilt from source and never hand-edited.

#### Harness and Evidence

- **D-17:** Extend the generic harness with deterministic synthetic events and a fixed clock suitable for stable wall screenshots; never use live family entities or event content.
- **D-18:** Phase 1's primary viewport is 1920x1080 landscape. Tablet and portrait coverage remain Phase 3 scope, although the shell must avoid knowingly blocking them.
- **D-19:** Evidence includes the ADR, legacy and wall harness scenarios, unit tests for shared config normalization, typecheck, existing event tests, production build, and a privacy/secret scan.
- **D-20:** No source file under `/Volumes/config` and no live dashboard resource is read for mutation or changed in Phase 1.

### Claude's Discretion

- Exact module filenames and whether the narrow calendar boundary is an interface plus implementation or a single typed adapter module.
- Exact internal CSS class names and token names, provided they follow repository conventions and the design contract.
- The synthetic schedule content, provided it covers timed, all-day, overlapping, shared, multi-person, and unmatched examples without household identifiers.

### Deferred Ideas (OUT OF SCOPE)

- Everyone/person filters, final now/next hierarchy, dense-day handling, and glanceability testing — Phase 2.
- Timeline, week, month, agenda wall treatment, weather header completion, tablet, and portrait — Phase 3.
- Full event-detail/mutation hardening, recurrence scope, failure/stale states, and comprehensive accessibility — Phase 4.
- Browser screenshot automation, HACS beta, and live Home Assistant pilot — Phase 5.
- Calendar Bridge provider, logistics, tasks, shopping, meals, chores, rewards, photos, and AI import — post-v1.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Record a source-level go/pivot decision comparing this fork with `tienou/family-calendar-card` across features, routing, API use, tests, maintenance, license, and migration cost. | The comparison matrix below is pinned to Moran commit `1f71865` and alternative commit `ee9d8f4` and recommends continuing the Moran fork. |
| FOUND-02 | Enable the new experience explicitly while configurations without the option retain unchanged defaults and behavior. | Use an allowlisted `layout: wall` discriminator, a normalized internal default, separate render branches, and paired legacy/wall harness fixtures. |
| FOUND-03 | Make card and editor use one shared configuration type/default source for every v1 setting introduced or changed. | Extract a shared config module imported by both surfaces; centralize layout normalization and editor serialization there, with deterministic unit tests. |

</phase_requirements>

## Summary

The source comparison supports an actionable **continue-this-fork** decision. The Moran code already implements the roadmap's exact day/timeline/week/month/agenda vocabulary, person lanes, shared-calendar title routing, typed builds, 27 deterministic event tests, and a generic Home Assistant-shaped harness. The alternative has valuable wall/touch precedents—header composition, calendar filter controls, `fillHeight`, swipe navigation, and responsive month behavior—but its core model is calendar/day-column oriented and would require rebuilding the Moran person's-lane and five-view contract. [VERIFIED: Moran repository `1f71865`; `tienou/family-calendar-card@ee9d8f4`]

A pivot would also exchange one monolith for a larger one: the Moran card is 3,857 TypeScript lines, whereas the alternative card is 5,209 JavaScript lines plus 2,562 lines of styles. The alternative repository exposes only build/watch scripts and contains no test/spec files; the Moran repository has strict TypeScript, Vitest, CI typecheck/test/build gates, and 27 passing tests. [VERIFIED: repository source trees and `npm test` on 2026-09-10]

Phase 1 should therefore keep the current stack, extract only a shared configuration contract and a narrow calendar-read seam, then place the inherited day view inside an isolated opt-in wall shell. The deterministic harness should exercise the same compiled custom element and Home Assistant-shaped `hass` path as production, with an injected clock seam and two scenarios: missing `layout` for legacy and `layout: wall` for the proof slice. [VERIFIED: phase context, UI contract, and current source]

**Primary recommendation:** Write the ADR as “continue Moran fork,” cite both pinned commits, record the alternative's reusable UI lessons without copying source, and proceed with `config -> typed calendar read -> existing event model -> opt-in wall shell`.

## Source-Level Base Comparison

| Criterion | Moran fork at `1f71865` | `tienou/family-calendar-card` at `ee9d8f4` | Decision |
|-----------|--------------------------|-----------------------------------------------|----------|
| Target calendar behavior | Day with people columns/time axis/current-time line, plus timeline, week, month, agenda, now/next, overlap layout, and kiosk controls. [VERIFIED: `src/ha-family-board-card.ts`, `README.en.md`] | Today, Tomorrow, Week, Biweek, and Month day-column grids; polished wall header, filters, touch/swipe, `fillHeight`, mobile month day panel. [VERIFIED: alternative `src/card.js`, `src/card.styles.js`, `README.md`] | Moran matches the roadmap's view semantics; borrow visual/interaction lessons only. |
| Shared calendar -> person routing | Prefix, contains, and regex rules; multi-person matches; explicit unmatched lane; 6 routing tests. [VERIFIED: `src/events.ts`, `src/events.test.ts`] | Calendars are the ownership/filter unit; source search found no person-lane or unmatched routing contract. `stripTitlePrefixes` changes display text but does not route one shared event to person lanes. [VERIFIED: alternative source search] | Moran wins decisively for the core household data model. |
| Home Assistant API use | Calendar reads through authenticated `hass.callApi`; mutations through `hass.callWS`; no external browser credential is part of the card config. [VERIFIED: `src/ha-family-board-card.ts`] | Core calendar reads/mutations also use `hass`, but optional handwriting and Places features store provider API keys in Lovelace config and call Google/Anthropic directly from the browser. [VERIFIED: alternative `src/card.js:338-371,3878-3916,4060-4080`; `README.md:317`] | Keep Moran's HA-only credential boundary; do not port direct-key patterns. |
| Tests and quality gates | Strict TypeScript; `npm run lint`; Vitest; 27 tests passed; CI runs typecheck, formatting, tests, and build. No browser suite yet. [VERIFIED: `tsconfig.json`, `package.json`, `.github/workflows/ci.yml`, local run] | JavaScript source; package scripts are build/watch; no test/spec files or test CI step. Build and HACS workflows exist. [VERIFIED: alternative `package.json`, tree, workflows] | Moran is safer for incremental refactoring. |
| Maintainability | 3,857-line main component is a known risk; pure event logic and editor/localization modules already provide extraction seams. [VERIFIED: line counts and codebase map] | 5,209-line card plus 2,562-line styles; configuration defaults, CRUD, AI, recurrence, data reads, and rendering remain concentrated in the card. [VERIFIED: alternative line counts/source] | Pivot does not solve the monolith; extract incrementally in Moran. |
| License/provenance | MIT with upstream and Moran copyrights plus `NOTICE.md`; history preserves upstream provenance. [VERIFIED: `LICENSE`, `NOTICE.md`, git history] | MIT, copyright 2026 tienou. Reuse is legally possible only with its copyright/license notice retained for copied substantial portions. [VERIFIED: alternative `LICENSE`] | Learning is low-cost; copying requires explicit attribution review. |
| Migration cost | No schema or element migration; add one optional key and internal seams. [VERIFIED: current config/source] | Requires translating `persons` + routing into `calendars`, replacing view names/behavior, changing TypeScript/Rollup/Vitest to JavaScript/Parcel/no tests or porting the alternative back to the current stack, and reconciling editor/localization/distribution contracts. [VERIFIED: both source trees] | High migration cost with feature regression risk. |
| Five-view roadmap fit | Exact `day`, `timeline`, `week`, `month`, `agenda` union and render paths exist. [VERIFIED: `src/ha-family-board-card.ts`] | `Today`, `Tomorrow`, `Week`, `Biweek`, `Month`; no timeline or standalone agenda renderer found. [VERIFIED: alternative source and README] | Moran is the correct base. |
| Project activity | Dedicated repo created for this work; upstream base was pushed through August 2026. [VERIFIED: GitHub repository metadata on 2026-09-10] | Active March-July 2026 with v2.2.2 published July 21; not archived. [VERIFIED: GitHub repository/release metadata on 2026-09-10] | Alternative is a live reference, not an abandoned project; recheck at future architecture gates. |

### ADR Direction

Record **Continue the Moran fork** as the decision. The alternative is strongest where this project is currently weakest—full-height visual composition, responsive month density, touch navigation, and per-calendar filtering—but those are portable design ideas. Its strongest case does not overcome the loss of tested shared-calendar-to-person routing, exact five-view behavior, and the safer TypeScript/CI foundation. [VERIFIED: source comparison above]

The ADR should also record a revisit trigger: reconsider only if a future alternative demonstrates tested person-lane routing, the required five views, a typed/tested architecture, and an HA-only credential boundary with lower migration cost than continuing. [RECOMMENDATION: derived from locked decision criteria]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Layout discrimination and default compatibility | Browser / Client | Home Assistant dashboard config | The card receives Lovelace configuration in `setConfig`; no server is needed. [CITED: https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/] |
| Visual-editor layout round-trip | Browser / Client | Home Assistant dashboard config | The editor dispatches the complete config in `config-changed`; absent `layout` must remain absent for Default. [CITED: https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/] |
| Calendar reads | Browser / Client adapter | Home Assistant API | The browser uses the authenticated `hass` object; HA owns provider authentication and event retrieval. [VERIFIED: current source] |
| Event routing/normalization | Browser / Client domain module | — | Existing DOM-free `src/events.ts` owns routing, date segmentation, and overlap logic. [VERIFIED: current source] |
| Wall shell and inherited day view | Browser / Client presentation | Home Assistant theme | Lit renders one custom element with scoped styles and HA CSS variables. [CITED: https://lit.dev/docs/components/rendering/] |
| Deterministic evidence | Browser / Client development harness | Compiled static bundle | The harness supplies synthetic `hass`, config, calendar responses, and the test clock to the production custom element. [VERIFIED: current `dev/harness.html`; phase contract] |
| Persistence, authentication, server logic | Home Assistant / external calendars | — | Phase 1 adds none; the custom card has no database or server. [VERIFIED: project architecture and constraints] |

## Standard Stack

Use the existing locked dependency graph; Phase 1 requires no new package. Exact installed versions below were read from `package-lock.json` and `npm ls --depth=0`. [VERIFIED: npm lock/install state on 2026-09-10]

### Core

| Library | Version | Purpose | Why Standard Here |
|---------|---------|---------|-------------------|
| TypeScript | 5.9.3 | Shared config contracts and strict browser code | Existing compiler, strict config, and CI gate. [VERIFIED: package lock and `tsconfig.json`] |
| Lit | 3.3.3 | Custom element, templates, reactive state, scoped styles | Existing runtime; composition and private reactive state are supported official patterns. [CITED: https://lit.dev/docs/components/properties/] |
| `custom-card-helpers` | 1.9.0 | Home Assistant frontend types/contracts | Existing dependency and import boundary. [VERIFIED: package lock and source imports] |

### Supporting

| Library/tool | Version | Purpose | When to Use |
|--------------|---------|---------|-------------|
| Vitest | 1.6.1 | Deterministic unit tests | Config normalization, editor serialization helpers, clock-dependent selectors, and typed calendar boundary. [VERIFIED: package lock/current suite] |
| Rollup | 4.62.2 | HACS-compatible single ES module | Rebuild committed `dist/moran-family-board-card.js` after source changes. [VERIFIED: package lock and `rollup.config.js`] |
| Prettier | 3.8.4 | Source formatting | Run before every implementation commit. [VERIFIED: package lock and scripts] |
| Browser harness | repository file | Manual 1920x1080 wall/legacy proof | Phase 1 visual evidence only; browser automation remains Phase 5. [VERIFIED: `dev/harness.html`; UI contract] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Current TypeScript/Lit/Rollup/Vitest stack | Alternative JavaScript/Lit/Parcel/Luxon stack | Gains existing alternative UI implementation but loses typecheck/tests and requires a broad migration. [VERIFIED: both manifests/source trees] |
| Focused opt-in shell | Full renderer rewrite | Could reduce legacy constraints, but violates the compatibility and incremental-extraction decisions. [VERIFIED: phase context] |
| Existing manual harness in Phase 1 | Add Playwright now | Adds reliable screenshots but expands dependencies and pulls Phase 5 automation into the foundation slice. [VERIFIED: roadmap/UI contract] |

**Installation:** none. Run `npm ci` only when reproducing the existing lockfile environment. [VERIFIED: repository workflow]

## Package Legitimacy Audit

Not applicable: Phase 1 should not install a new package. The existing lockfile packages are already project dependencies; `npm audit --omit=dev --audit-level=high` reported zero production vulnerabilities on 2026-09-10. Development dependency remediation is a separate reviewed change and must not be mixed into this phase. [VERIFIED: local npm audit and `.planning/codebase/CONCERNS.md`]

## Architecture Patterns

### System Architecture Diagram

```text
Lovelace YAML / visual editor
            |
            v
shared config contract + normalization ----------------------+
            |                                                 |
            v                                                 v
FamilyBoardCard controller <---- generic harness (hass + fixed clock)
            |
            +--> typed HA calendar reader --> hass.callApi --> Home Assistant
            |                                  |
            |                                  v
            +<-------------------------- calendar payloads
            |
            v
existing events.ts (parse -> route -> segment -> overlap)
            |
            +--> layout absent/default --> unchanged legacy render path
            |
            +--> layout wall -----------> focused wall shell
                                             |
                                             v
                                      inherited day renderer
```

### Recommended Project Structure

```text
src/
├── config.ts                         # shared public types, defaults, normalization/serialization
├── config.test.ts                    # absent/default/wall and editor round-trip behavior
├── calendar-source.ts                # narrow typed hass calendar read boundary
├── calendar-source.test.ts           # request shape and payload/error boundary tests
├── wall-shell.ts                     # focused wall-only template/style contract
├── ha-family-board-card.ts           # controller, legacy branch, existing renderers
├── editor.ts                         # imports shared config helpers
└── events.ts                         # unchanged pure calendar domain foundation
dev/
└── harness.html                      # selectable legacy and wall scenarios, synthetic data, fixed clock
docs/
└── adr/
    └── 0001-implementation-base.md   # pinned comparison and continue/pivot decision
```

Exact filenames remain discretionary, but these responsibilities should not be merged back into the main card. [RECOMMENDATION: phase context plus codebase concerns]

### Pattern 1: Raw Public Config + Normalized Runtime View

Keep the user's original object intact for editor round-trips. Put default selection behind pure helpers; do not write `layout: default` into a legacy config. An unknown or missing layout must select the legacy branch, while only exact `wall` selects the wall branch. [VERIFIED: D-09/D-10; Home Assistant editor contract]

This protects both compatibility dimensions: runtime behavior and serialized dashboard configuration. Unit-test object equality for unknown keys as well as rendered branch selection. [RECOMMENDATION: derived from FOUND-02/FOUND-03]

### Pattern 2: Branch at the Shell, Reuse the Data and Day Renderer

The `layout` decision belongs near the top-level `render()` composition. Both branches share configuration, event loading, routing, view state, and day rendering; wall-only markup and CSS stay scoped under the wall shell. Do not fork `_fetchEvents`, `src/events.ts`, or duplicate the day algorithm. [VERIFIED: current render/data flow and D-13 through D-15]

### Pattern 3: Narrow Typed Home Assistant Port

Move the direct `hass.callApi("GET", "calendars/...")` operation behind one function or interface that accepts an entity ID and ISO range and returns the minimum API payload shape. Keep routing and parsing in their current domain modules. Phase 1 should preserve the existing one-request-per-unique-calendar behavior and current total-error semantics; per-calendar result modeling is Phase 2/4 work. [VERIFIED: current `_fetchEvents`; phase boundary]

### Pattern 4: Inject Time, Not Test Data, into Production Logic

Introduce one clock seam used by calendar-relative calculations and countdown/current-time behavior. Production defaults to the system clock; the harness injects Wednesday, February 18, 2026 at 3:32 PM. Avoid globally replacing `Date`, using live current dates in fixtures, or adding a dashboard config key for test time. [RECOMMENDATION: D-17 and current `Date` call inventory]

### Pattern 5: One Harness, Two Explicit Scenarios

Select `legacy` and `wall` through a development-only query parameter or equivalent harness control. Both scenarios should feed equivalent generic events through the compiled bundle and `hass.callApi` mock. Only the wall scenario adds `layout: wall`; this makes the visual comparison meaningful. [RECOMMENDATION: D-17/D-19 and UI harness contract]

### Anti-Patterns to Avoid

- **Normalize by mutating the input object:** it can silently serialize new defaults and break editor round-trips. Use pure copies/helpers. [CITED: https://lit.dev/docs/components/properties/]
- **Duplicate a second wall calendar renderer:** it creates immediate drift across routing, date, overlap, and interaction behavior. Compose the inherited day renderer. [VERIFIED: current architecture]
- **Put wall selectors on unscoped legacy classes:** shared class names can leak sizing/token changes into existing cards. Root all new CSS under the wall branch. [VERIFIED: FOUND-02 and UI contract]
- **Add `layout` independently to card and editor:** the existing duplicated person shape already shows how contracts drift. Both import one module. [VERIFIED: `src/ha-family-board-card.ts`, `src/editor.ts`]
- **Copy the alternative wholesale:** it replaces the project's core data/view model and imports direct-browser credential patterns. Study behavior, not source, unless an attribution review identifies an isolated compatible portion. [VERIFIED: source comparison]
- **Use `new Date()` in the harness:** the current harness does this, so its data and screenshot move every day. Inject the fixed clock and fixed event instants. [VERIFIED: `dev/harness.html:49-55`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Calendar persistence/authentication | A React server, database, or browser token store | Existing authenticated Home Assistant `hass` API | HA already owns provider access and dashboard authentication. [VERIFIED: project constraints] |
| Calendar date/routing/overlap logic | New wall-only algorithms | Existing `src/events.ts` | The behavior is already pure and covered by 27 tests. [VERIFIED: current suite] |
| UI framework/components | React/shadcn or a second custom-card framework | Existing Lit and Home Assistant elements | A parallel framework adds bundle/interaction complexity without Phase 1 value. [VERIFIED: project/UI constraints] |
| Browser screenshot automation | New Phase 1 test runner | Existing manual harness evidence | Automated screenshots are explicitly Phase 5. [VERIFIED: roadmap/UI contract] |
| Third-party AI/location access | Dashboard-held keys and direct browser fetch | Defer; future authenticated HA-side adapter where needed | The browser bundle and dashboard config are public to dashboard clients. [VERIFIED: security constraints and alternative source] |
| Config defaults in render branches | Repeated `??` expressions for new v1 keys | Shared pure defaults/normalization helpers | Repetition recreates the current card/editor drift. [VERIFIED: FOUND-03 and current source] |

**Key insight:** Phase 1 is a seam-and-proof phase. Its success comes from reusing known calendar behavior through a new composition boundary, not from adding another calendar implementation.

## Runtime State Inventory

This phase includes a configuration refactor, so runtime state was considered even though no rename or live migration is authorized.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | Home Assistant stores real card configuration in Lovelace dashboard state outside this repository; it was not inspected because `/Volumes/config` and live dashboards are out of scope. [VERIFIED: project boundary] | No data migration. Preserve missing `layout`, unknown keys, existing values, and complete editor round-trips by contract and generic tests. |
| Live service config | A HACS/dashboard resource may load the current bundle, but live state was intentionally not queried or changed. [VERIFIED: D-20] | No Phase 1 action. Pilot/resource/cache work remains Phase 5. |
| OS-registered state | None. The only registration is browser custom-element registration in the compiled module; no launchd/systemd/OS service is part of this repository. [VERIFIED: repository source/tree] | Preserve `moran-family-board-card` and editor element names; add no upstream alias. |
| Secrets/env vars | No secret or `.env` file is tracked; no live secret was read. [VERIFIED: `git ls-files` inspection] | Keep fixtures/config/docs generic; never add browser credentials. |
| Build artifacts / installed packages | `dist/moran-family-board-card.js` is tracked and generated from source; `node_modules` is ignored. [VERIFIED: git tree and `.gitignore`] | Rebuild `dist` after source changes, verify it, never edit it manually. No package reinstall/migration beyond normal `npm ci`. |

## Common Pitfalls

### Pitfall 1: “Default” Becomes a Serialized Breaking Change

**What goes wrong:** The editor writes `layout: default`, or `setConfig` replaces the raw object with a defaults-filled object. Existing dashboard YAML changes even when the user did not opt in.  
**Why it happens:** Runtime normalization and persistence serialization are treated as one operation.  
**How to avoid:** Keep raw config plus pure normalized accessors; the editor's Default option deletes `layout`.  
**Warning signs:** Opening/saving the editor adds keys, or unknown keys disappear. [VERIFIED: Home Assistant editor contract; D-09/D-10]

### Pitfall 2: Wall CSS Changes Legacy Rendering

**What goes wrong:** Shared `ha-card`, `.top`, `.day`, or sizing rules change every existing config.  
**Why it happens:** The same root DOM/class contract serves both layouts without a scoped discriminator.  
**How to avoid:** Preserve the current legacy template and scope all new selectors/tokens beneath a wall-only root/attribute.  
**Warning signs:** The legacy harness diff changes after removing `layout: wall`. [VERIFIED: current render classes and FOUND-02]

### Pitfall 3: The Clock Is Only Half Injected

**What goes wrong:** Events are fixed but “today,” week bounds, focus, current line, progress, or countdown still use `Date.now()`/`new Date()`, producing unstable evidence.  
**Why it happens:** Current-time reads are spread across the card and `localize.ts`.  
**How to avoid:** Inventory every current-time call, route them through the seam where behavior is in scope, and add a fixed-clock unit/harness assertion.  
**Warning signs:** The screenshot date changes or the current-time line disappears on another day. [VERIFIED: source-wide Date inventory]

### Pitfall 4: “Typed Boundary” Expands into Phase 2 Reliability

**What goes wrong:** Phase 1 grows per-calendar caching, stale data, retries, capability matrices, and new error UI.  
**Why it happens:** The current direct call and error aggregation are imperfect.  
**How to avoid:** Extract the current read operation and payload type only; record richer result modeling for later phases.  
**Warning signs:** The plan changes loading/error semantics or adds new states beyond inherited fragments. [VERIFIED: phase/UI boundaries]

### Pitfall 5: ADR Based on Screenshots Instead of the Core Model

**What goes wrong:** The visually closer alternative wins even though it cannot represent shared events as people lanes or meet the five-view roadmap.  
**Why it happens:** UI polish is easier to compare than architecture and migration cost.  
**How to avoid:** Keep the locked weighted criteria and pinned source references in the ADR.  
**Warning signs:** The decision omits routing, tests, API credentials, or migration tasks. [VERIFIED: comparison findings]

### Pitfall 6: Sensitive Data Enters “Temporary” Evidence

**What goes wrong:** A real name, entity ID, event title, address, or token appears in a fixture, screenshot, log, or ADR.  
**Why it happens:** A live dashboard is used as a convenient data source.  
**How to avoid:** Use only Avery, Jordan, Casey, Household and generic `calendar.fixture_*` entities; scan staged changes and generated artifacts.  
**Warning signs:** `/Volumes/config`, `.env`, actual screenshots, or non-fixture entities appear in the diff. [VERIFIED: UI contract and project privacy constraint]

## Code Examples

These are project-specific planning patterns, not code copied from the alternative.

### Shared layout normalization and serialization

```typescript
export type FamilyBoardLayout = "default" | "wall";

export const DEFAULT_LAYOUT: FamilyBoardLayout = "default";

export function normalizeLayout(value: unknown): FamilyBoardLayout {
  return value === "wall" ? "wall" : DEFAULT_LAYOUT;
}

export function withLayout(
  config: FamilyBoardConfig,
  layout: FamilyBoardLayout,
): FamilyBoardConfig {
  const next = { ...config };
  if (layout === "wall") next.layout = "wall";
  else delete next.layout;
  return next;
}
```

This separates runtime defaulting from persistence and preserves unknown keys through object spread. [RECOMMENDATION: FOUND-02/FOUND-03]

### Narrow calendar read boundary

```typescript
export interface CalendarRange {
  start: Date;
  end: Date;
}

export interface CalendarSource {
  read(entityId: string, range: CalendarRange): Promise<CalendarEventPayload[]>;
}
```

The Home Assistant implementation should construct the existing encoded `calendars/{entity}?start=...&end=...` path; routing stays in `events.ts`. [VERIFIED: current `_fetchEvents`; RECOMMENDATION: D-13/D-14]

### Wall/legacy composition branch

```typescript
const content = this._renderActiveView();
return this._layout === "wall"
  ? renderWallShell({ title, navigation, content })
  : this._renderLegacyCard({ title, content });
```

The actual extraction may use callbacks or `TemplateResult` values, but the branch should occur at composition rather than in data fetching or event logic. [RECOMMENDATION: current render path and D-15]

## State of the Art

| Older/current pressure | Recommended Phase 1 approach | Impact |
|------------------------|------------------------------|--------|
| Config types/defaults embedded in the main renderer and partially duplicated in the editor | Shared config module with pure normalization/serialization | Satisfies FOUND-03 and makes opt-in compatibility directly testable. [VERIFIED: current source] |
| One generic harness whose dates follow the machine clock | Explicit legacy/wall scenarios with a fixed clock | Produces stable proof data without live HA. [VERIFIED: current harness and D-17] |
| Wall behavior approximated with `full_height`, `fit_height`, and a tablet preset | Explicit `layout: wall` shell that composes existing behavior | Creates a clear product boundary while keeping legacy defaults intact. [VERIFIED: current config and D-09] |
| README-level competitor evaluation | Pinned source matrix and ADR with revisit criteria | Prevents a visual-only or stale base decision. [VERIFIED: FOUND-01] |
| Direct provider keys in browser config for optional features | HA-authenticated boundary only | Aligns the public bundle with the project's credential constraint. [VERIFIED: project constraints and alternative source] |

## Assumptions Log

All factual claims in this research were verified against repository source, current GitHub metadata, local tool output, or cited official documentation. The recommended clock API and exact module names are design recommendations under Claude's discretion, not assumed external facts.

## Open Questions (RESOLVED)

1. **How should the fixed test timezone be enforced before Playwright exists?**
   - What we know: the UI contract requires a fixed clock/timezone; current formatting uses browser `Date`/`Intl`, and screenshot automation is deferred. [VERIFIED: UI contract and source]
   - **RESOLVED:** Plan 01-03 Task 2 fixes the event instants and injected clock, documents `America/Chicago` as the Phase 1 evidence timezone, and requires a visible development-only warning when the browser timezone differs. Cross-timezone browser contexts remain Phase 5 scope.

2. **How much of the existing current-time call surface should Phase 1 route through the clock?**
   - What we know: wall day rendering, week bounds, current-time marker, focus/progress/countdown, and kiosk code read time in multiple places. [VERIFIED: source inventory]
   - **RESOLVED:** Plan 01-03 Task 1 adds a non-dashboard `nowProvider` and routes all display-calendar current-time reads reached by the wall Day scenario through it. Duration parsing, unrelated mutation timestamps, and kiosk timestamps outside the proof path remain unchanged.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | lint, tests, build | yes | 25.6.1 local; Node 20 in CI | CI is the compatibility baseline. [VERIFIED: local command/workflows] |
| npm | deterministic install/scripts | yes | 11.9.0 | Use repository `package-lock.json`. [VERIFIED: local command] |
| Git | source/ADR provenance | yes | 2.50.1 | GitHub web URLs for external review. [VERIFIED: local command] |
| GitHub CLI/network | external repository metadata | yes | 2.98.0 | Pinned public URLs/temporary clone. [VERIFIED: local command] |
| Chromium browser | manual harness proof | yes | Google Chrome application installed | Safari is also installed, but Chrome should be the primary proof browser. [VERIFIED: application inventory] |
| Python HTTP server | serve local harness | yes | Python 3.9.6 | Any loopback-only static server. [VERIFIED: local command] |
| Live Home Assistant | none in Phase 1 | intentionally unused | — | Generic mocked `hass` harness. [VERIFIED: D-20] |

**Missing dependencies with no fallback:** none.

**Missing dependencies with fallback:** no packaged browser-test runner exists; manual Chrome harness verification is the approved Phase 1 fallback, with automation deferred to Phase 5. [VERIFIED: package tree and roadmap]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 1.6.1 for DOM-free behavior; TypeScript 5.9.3 for shared-contract integration; manual Chrome harness for Phase 1 visuals |
| Config file | No dedicated Vitest config; scripts in `package.json`, TypeScript in `tsconfig.json` |
| Quick run command | `npm test -- src/config.test.ts` |
| Full suite command | `npm run format:check && npm run lint && npm test && npm run build` |

The existing suite passed 27/27 tests, formatting, and typecheck during research. The build was not rerun because this research task was restricted to planning output and the committed distribution artifact must only change with implementation. [VERIFIED: local commands on 2026-09-10]

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| FOUND-01 | ADR contains both pinned bases, every locked criterion, a continue/pivot outcome, provenance, and revisit trigger | documentation/structural + human source review | `rg -n "target calendar behavior|shared-calendar|Home Assistant API|test|maintain|license|migration|five-view|Decision" docs/adr/0001-implementation-base.md` | No — Wave 0 |
| FOUND-02 | Only exact `layout: wall` selects wall; absent/unknown values select legacy; editor Default removes the key; unknown keys survive | unit + typecheck | `npm test -- src/config.test.ts` | No — Wave 0 |
| FOUND-02 | Compiled wall and legacy scenarios use equivalent HA-shaped data and render distinct shell roots at 1920x1080 | manual browser smoke backed by deterministic fixture | Serve the repo on loopback, open `dev/harness.html?scenario=wall` and `?scenario=legacy`, record the checklist and screenshot path | Existing harness requires modification |
| FOUND-03 | Card and editor import the shared config contract/default helpers; no duplicate `PersonConfig` remains | unit + typecheck + structural | `npm test -- src/config.test.ts && npm run lint && rg -n "from \"./config\"" src/ha-family-board-card.ts src/editor.ts` | No — Wave 0 |
| FOUND-03 | Narrow calendar reader preserves request URL encoding and passes payloads/errors to the existing controller contract | unit | `npm test -- src/calendar-source.test.ts` | No — Wave 0 |

### Sampling Rate

- **Per task commit:** run the focused new test file plus `npm run lint`.
- **Per wave merge:** run `npm run format:check && npm run lint && npm test`.
- **Phase gate:** run the full suite including `npm run build`, confirm `dist/moran-family-board-card.js` is regenerated from source, run the privacy scan, and complete both 1920x1080 harness scenarios before `/gsd-verify-work`.

### Wave 0 Gaps

- [ ] `src/config.test.ts` — covers missing/unknown/wall normalization, editor Default deletion, and unknown-key preservation for FOUND-02/FOUND-03.
- [ ] `src/calendar-source.test.ts` — covers the narrow Home Assistant read boundary and encoded stable range for FOUND-03.
- [ ] `dev/harness.html` scenario/fixed-clock support — covers the manual compiled legacy/wall proof for FOUND-02.
- [ ] `docs/adr/0001-implementation-base.md` — provides the pinned decision evidence for FOUND-01.

No test-framework installation is required. Browser automation and screenshot diffing remain Phase 5. [VERIFIED: existing stack and roadmap]

## Security Domain

Security enforcement is enabled at ASVS Level 1 and blocks high-severity findings. Phase 1 adds a public browser UI/config surface, no server, no authentication mechanism, and no calendar mutation behavior. [VERIFIED: `.planning/config.json` and phase boundary]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No new control | Delegate authentication to Home Assistant's supplied `hass` connection; add no token input. [VERIFIED: project architecture] |
| V3 Session Management | No new control | Home Assistant owns the browser session; the card stores no credentials/session tokens. [VERIFIED: project architecture] |
| V4 Access Control | Indirect | Read only through configured HA entities and the authenticated `hass` client; do not add external endpoints. [VERIFIED: phase boundary] |
| V5 Validation, Sanitization and Encoding | Yes | Allowlist `layout`, type the minimum calendar payload, rely on Lit text interpolation, and avoid `unsafeHTML`/URL construction in the wall shell. [CITED: https://lit.dev/docs/components/rendering/] |
| V6 Stored Cryptography | No | Do not implement cryptography or store secrets; no new secret-bearing feature is in scope. [VERIFIED: project constraints] |
| V14 Configuration | Yes | Preserve known-safe defaults, keep wall mode explicit, and scan repository/artifacts for credentials and household identifiers. [VERIFIED: FOUND-02 and D-19] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Credentials or household schedule copied into public fixture/config/log | Information Disclosure | Synthetic fixture only; no live HA reads; scan staged source, docs, harness, and generated bundle. [VERIFIED: project constraints] |
| User-controlled text rendered as HTML | Tampering / Elevation | Use normal Lit interpolation; do not add `unsafeHTML`, `innerHTML`, or executable URLs in the shell. [CITED: https://lit.dev/docs/components/rendering/] |
| Unknown `layout` activates an unintended code path | Tampering | Exact allowlist: only `wall`; everything else remains legacy. [RECOMMENDATION: FOUND-02] |
| Wall implementation bypasses authenticated HA boundary | Information Disclosure / Spoofing | Calendar reader accepts the existing `hass` object only; no direct third-party fetch or credential config. [VERIFIED: project constraints] |
| Copied MIT source loses attribution | Legal/provenance risk | Prefer behavioral reimplementation; if code is copied, preserve the alternative copyright/license notice and document the source commit. [VERIFIED: both licenses and D-04] |
| Generated bundle diverges from reviewed source | Tampering / Supply chain | Generate only through `npm run build`; review source first; commit source and matching `dist`; CI rebuilds. [VERIFIED: repository workflow] |

No high-severity architectural finding blocks the recommended approach. Porting the alternative's dashboard-held Gemini, Claude, or Google Places keys would violate the project security constraint and is explicitly blocked. [VERIFIED: alternative source and project constraints]

## Project Constraints (from AGENTS.md)

- Use TypeScript/Lit and preserve native Home Assistant dashboard, theme, authentication, and entity access. [VERIFIED: `AGENTS.md`]
- Keep wall mode opt-in and existing non-wall configurations/views working. [VERIFIED: `AGENTS.md`]
- Keep calendars external and add no second database. [VERIFIED: `AGENTS.md`]
- Never expose tokens, private household configuration, or Calendar Bridge credentials. [VERIFIED: `AGENTS.md`]
- Do not change `/Volumes/config`; live deployment has separate review/backup gates. [VERIFIED: `AGENTS.md`]
- Rebuild and commit `dist/moran-family-board-card.js` after source changes; preserve MIT attribution. [VERIFIED: `AGENTS.md`]
- A release candidate must pass formatting, typecheck, tests, and build. [VERIFIED: `AGENTS.md`]

## Sources

### Primary (HIGH confidence)

- Moran repository at commit `1f71865f70345cbf0acfc02ea0f33769fa8f9598` — source, tests, harness, workflows, license, attribution, and planning contract.
- [`tienou/family-calendar-card` at `ee9d8f4`](https://github.com/tienou/family-calendar-card/tree/ee9d8f4df11ea65d175e00dc3835611549ffe9b4) — source-level comparison target, inspected from a read-only temporary clone.
- [Alternative card source](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/src/card.js) — configuration, API reads/writes, views, rendering, and optional direct-provider calls.
- [Alternative package manifest](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/package.json) — stack and scripts.
- [Alternative MIT license](https://github.com/tienou/family-calendar-card/blob/ee9d8f4df11ea65d175e00dc3835611549ffe9b4/LICENSE) — reuse/provenance terms.
- Local command evidence on 2026-09-10 — 27/27 Vitest tests, Prettier check, strict typecheck, dependency versions, production npm audit, and environment inventory.

### Secondary (MEDIUM confidence)

- [Home Assistant custom-card documentation](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/) — `setConfig`, `getConfigElement`, `getStubConfig`, card-picker metadata, and `config-changed` behavior.
- [Home Assistant Calendar entity documentation](https://developers.home-assistant.io/docs/core/entity/calendar/) — calendar entity and supported-feature ownership.
- [Lit reactive properties](https://lit.dev/docs/components/properties/) — public input, private state, and immutable update patterns.
- [Lit rendering](https://lit.dev/docs/components/rendering/) — deterministic template composition and escaping-safe rendering patterns.
- [Alternative v2.2.2 release](https://github.com/tienou/family-calendar-card/releases/tag/v2.2.2) — inspected release currency.

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — exact versions and commands were read from the working lockfile/install and repository workflows.
- Base decision: HIGH — both implementations were inspected at pinned source commits against every locked criterion.
- Architecture: HIGH — recommendations follow current source seams, locked constraints, and official Lit/Home Assistant contracts.
- Validation: HIGH for unit/type/build checks; MEDIUM for visual proof because automated browser screenshots are intentionally deferred.
- Security: HIGH — browser credential risks and repository/privacy boundaries are directly visible in source and project constraints.

**Research date:** 2026-09-10  
**Valid until:** 2026-10-10 for stack/source guidance; recheck the alternative default branch before any later pivot decision.
