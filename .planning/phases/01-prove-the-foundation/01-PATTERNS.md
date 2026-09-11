# Phase 01: Prove the Foundation - Pattern Map

**Mapped:** 2026-09-10
**Files analyzed:** 13 new or modified files
**Analogs found:** 13 / 13 (including role-match analogs for the new ADR and API test)

## Scope Extraction

Phase 1's concrete file set comes from the recommended structure in `01-RESEARCH.md`, the
locked shared-config/editor decisions in `01-CONTEXT.md`, and repository conventions that require
localized editor copy, public option documentation, and a rebuilt distribution artifact.

The fixed clock is a required seam, but the research leaves its filename discretionary. Prefer a
small injectable function/type owned by `src/ha-family-board-card.ts` unless implementation shows a
separate `src/clock.ts` materially improves testing; do not create a clock module only for symmetry.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `docs/adr/0001-implementation-base.md` | documentation / decision record | batch source comparison -> durable decision | `docs/MORAN_FORK_PLAN.md` | role-match |
| `src/config.ts` | config + model + utility | raw config -> normalized runtime / serialized config | config contracts in `src/ha-family-board-card.ts`; pure helpers in `src/events.ts` | partial |
| `src/config.test.ts` | test | deterministic inputs -> normalized/serialized outputs | `src/events.test.ts` | exact role/data-flow |
| `src/calendar-source.ts` | service / adapter | authenticated request-response | `_fetchEvents` in `src/ha-family-board-card.ts` | exact extracted seam |
| `src/calendar-source.test.ts` | test | mocked request-response -> request/payload/error assertions | `src/events.test.ts` | role-match |
| `src/wall-shell.ts` | component / presentation utility | Lit inputs -> template and scoped styles | `render()` and `static styles` in `src/ha-family-board-card.ts` | exact extracted seam |
| `src/ha-family-board-card.ts` | controller + component | config/events/state -> event-driven rendering | existing class in the same file | exact self-pattern |
| `src/editor.ts` | component / editor | form events -> complete `config-changed` payload | existing editor in the same file | exact self-pattern |
| `src/editor-i18n.ts` | utility / config copy | language + key -> localized string | existing dictionaries in the same file | exact self-pattern |
| `src/localize.ts` | utility | HA locale + value -> localized runtime text/time | existing dictionary and `Intl` helpers in the same file | exact self-pattern |
| `dev/harness.html` | development fixture | scenario/config -> mocked HA request-response -> custom element | existing harness in the same file | exact self-pattern |
| `README.en.md` | public configuration documentation | config contract -> user-facing reference | existing configuration example and options table | exact self-pattern |
| `dist/moran-family-board-card.js` | generated distribution artifact | Rollup batch transform | `rollup.config.js`, `package.json`, and CI | exact generation pipeline |

## Pattern Assignments

### `docs/adr/0001-implementation-base.md` (documentation, batch decision)

**Analog:** `docs/MORAN_FORK_PLAN.md`

**Status and boundary pattern** (`docs/MORAN_FORK_PLAN.md:1-7`):

```markdown
# Moran Family Board fork plan

Status: implementation plan for `feature/moran-foundation`; no Home Assistant deployment.

## Objective
```

**Decision-then-verification structure** (`docs/MORAN_FORK_PLAN.md:12-19`,
`docs/MORAN_FORK_PLAN.md:58-66`):

```markdown
## Source-of-truth decisions

- Apple/iCloud managed calendars remain the event source of truth.
- Home Assistant remains the initial display and household-entity layer.
- Household-specific names, entity IDs, addresses, and credentials stay out of this public repository.
- The upstream MIT license and attribution remain intact.

## Verification gates

- `npm run format:check`
- `npm run lint`
- `npm test`
- `npm run build`
```

**Apply:** Preserve the concise status/objective/decision/evidence style, but use the complete pinned
comparison matrix from `01-RESEARCH.md`. The ADR must name both commits, cover all eight D-02
criteria, decide **continue the Moran fork**, document license/provenance, and include the future
revisit trigger. This repository has no exact ADR template; research, not the older fork plan, is the
authority for the outcome.

---

### `src/config.ts` (config/model/utility, transform)

**Analogs:** public contracts in `src/ha-family-board-card.ts`; pure guards in `src/events.ts`

**Imports and public-contract pattern** (`src/ha-family-board-card.ts:1-8`,
`src/ha-family-board-card.ts:34-55`):

```typescript
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "custom-card-helpers";

type ViewName = "day" | "week" | "month" | "agenda" | "timeline";
const ALL_VIEWS: ViewName[] = ["day", "timeline", "week", "month", "agenda"];

export interface PersonConfig {
  name?: string;
  person?: string;
  calendar?: string | string[];
}

export interface FamilyBoardConfig extends LovelaceCardConfig {
  persons: PersonConfig[];
  title?: string;
  view?: ViewName;
  views?: ViewName[];
}
```

**Pure normalization and guard-clause pattern** (`src/events.ts:21-27`,
`src/events.ts:43-49`):

```typescript
const values = (input?: string[]): string[] =>
  Array.isArray(input) ? input.map((value) => String(value).trim()).filter(Boolean) : [];

const calendars = (input?: string | string[]): string[] => {
  if (Array.isArray(input)) return input.filter(Boolean);
  return input ? [input] : [];
};

export function hasEventRouteRules(config: EventRouteConfig): boolean {
  return (
    values(config.match_title_prefixes).length > 0 ||
    values(config.match_title_contains).length > 0 ||
    values(config.match_title_regex).length > 0
  );
}
```

**Apply:** Move `ViewName`, `ALL_VIEWS`, `PersonConfig`, and `FamilyBoardConfig` into one named-export
module. Add `FamilyBoardLayout = "default" | "wall"`, an internal default, exact allowlist
normalization, and an immutable layout serializer. Keep raw dashboard objects intact: missing or
unknown `layout` returns `default`, only exact `wall` returns `wall`, and selecting Default deletes
the key from a copied object. Do not fill every optional property into the stored config.

**Validation:** Preserve the synchronous required-`persons` guard at the card boundary; pure helpers
must accept `unknown` where they validate user-provided values and never mutate their argument.

---

### `src/config.test.ts` (test, transform)

**Analog:** `src/events.test.ts`

**Imports and deterministic fixture pattern** (`src/events.test.ts:1-20`):

```typescript
import { describe, it, expect } from "vitest";
import { parseRawEvent, splitIntoSegments, DAY_MS } from "./events";

// A Monday at local midnight for deterministic week math.
const monday = (() => {
  const d = new Date(2024, 0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
})();
```

**Behavior-first assertions** (`src/events.test.ts:104-120`):

```typescript
describe("event routing", () => {
  it("supports contains and regex rules without allowing invalid regex to break routing", () => {
    expect(eventMatchesRoute("District Holiday", { match_title_contains: ["holiday"] })).toBe(true);
    expect(eventMatchesRoute("Anything", { match_title_regex: ["["] })).toBe(false);
  });
});
```

**Apply:** Use direct named imports, small literal configs, and exact equality assertions. Cover
missing, `undefined`, `default`, unknown, and exact `wall`; prove the serializer deletes Default,
writes exact Wall, does not mutate input, and preserves an arbitrary unknown legacy key plus nested
`persons`/`calendars` references. Test the helper used by the editor, not editor DOM internals.

---

### `src/calendar-source.ts` (service/adapter, authenticated request-response)

**Analog:** current `_fetchEvents` request in `src/ha-family-board-card.ts`

**Authenticated request pattern** (`src/ha-family-board-card.ts:755-773`):

```typescript
private async _fetchEvents(): Promise<void> {
  const { start, end } = this._fetchRange();
  const startIso = start.toISOString();
  const endIso = end.toISOString();

  const events = await this.hass.callApi<any[]>(
    "GET",
    `calendars/${calendar}?start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`,
  );
}
```

**Controller-owned fan-out/error pattern** (`src/ha-family-board-card.ts:763-805`):

```typescript
const configuredCalendars = [
  ...new Set(this._config.persons.flatMap((person) => this._calsOf(person))),
].filter((calendar) => this.hass.states[calendar]);

await Promise.all(
  configuredCalendars.map(async (calendar) => {
    try {
      const events = await this.hass.callApi<any[]>(/* existing path */);
      // controller continues parsing and routing
    } catch (err) {
      anyError = true;
    }
  }),
);
```

**Apply:** Extract only the single-calendar GET and minimum HA event payload type. Accept the
Home Assistant client, entity ID, and `{ start, end }`; encode both ISO query values exactly as the
current implementation does. Let request errors reject unchanged so the controller retains its
existing per-calendar catch, fan-out, routing, `anyError`, and total-error behavior. Do not add
caching, retry, stale-result modeling, provider credentials, or a second event model.

---

### `src/calendar-source.test.ts` (test, mocked request-response)

**Analog:** `src/events.test.ts` for Vitest structure; `dev/harness.html` for the minimal HA client
shape.

**Minimal HA boundary shape** (`dev/harness.html:99-108`):

```javascript
const hass = {
  states,
  locale: { language: "en-US", time_format: "12" },
  config: { unit_system: { temperature: "°F" } },
  callApi: async (_method, path) => {
    const calendar = Object.keys(calendarEvents).find((entityId) => path.includes(entityId));
    return calendar ? calendarEvents[calendar] : [];
  },
  callWS: async () => ({}),
};
```

**Apply:** Use a typed `vi.fn()`/minimal cast rather than constructing a full HA object. Assert one
GET, the exact calendar entity path, percent-encoded start/end ISO values, payload pass-through, and
unchanged rejection. Do not test routing or parsing here; those remain in `events.test.ts`.

---

### `src/wall-shell.ts` (presentation component/utility, Lit transform)

**Analog:** existing top-level composition and style tokens in `src/ha-family-board-card.ts`

**Template composition pattern** (`src/ha-family-board-card.ts:1232-1267`):

```typescript
protected render() {
  if (!this._config || !this.hass) return nothing;
  const title = this._config.title ?? this._t("board_title");
  return html`
    <ha-card>
      <div class="top">
        <div class="title">${title}</div>
        ${this._enabledViews.length > 1 ? html`<div class="switch" role="tablist">...</div>` : nothing}
      </div>
      ${this._view === "day" ? this._renderDay() : /* existing alternatives */ nothing}
    </ha-card>
    ${this._dialog ? this._renderDialog() : nothing}
  `;
}
```

**Theme-token/scoped-style pattern** (`src/ha-family-board-card.ts:2516-2546`):

```typescript
static styles = css`
  :host {
    font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
    --fb-accent: var(--primary-color);
    --fb-now-color: var(--error-color, #ff5252);
  }
  ha-card {
    overflow: hidden;
    color: var(--primary-text-color);
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--divider-color);
  }
`;
```

**Interaction/accessibility pattern** (`src/ha-family-board-card.ts:1315-1345`,
`src/ha-family-board-card.ts:3669-3676`):

```typescript
<button class="nav" aria-label=${this._t("prev_week")} @click=${this._prevWeek}>‹</button>
<div class="tabs" role="tablist">
  <button role="tab" aria-selected=${d === this._day} @click=${() => (this._day = d)}>
    ${short[d]}
  </button>
</div>

button:focus-visible,
.event:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 1px;
}
```

**Apply:** Export a focused Lit template/style helper that receives already-built identity,
navigation, and day content; it must not own event loading, routing, or date state. Give the wall
branch a unique root class/attribute and root every new selector/token beneath it. Follow the
`01-UI-SPEC.md` 72px header, 56px toolbar, 48px targets, 72px axis, 80px person header, four-size
type scale, and schedule-only overflow contract. Use normal Lit interpolation; add no `unsafeHTML`,
`innerHTML`, external URL execution, operations rail, or inert controls. Preserve reduced-motion
handling (`src/ha-family-board-card.ts:3215-3224`).

---

### `src/ha-family-board-card.ts` (controller/component, event-driven + request-response)

**Analog:** existing class in this file

**Import organization** (`src/ha-family-board-card.ts:1-29`): external runtime imports, external
type imports, then named relative imports. Continue that order when importing shared config,
calendar source, and wall shell; use `import type` for contracts only.

**Compatibility boundary** (`src/ha-family-board-card.ts:340-350`):

```typescript
public setConfig(config: FamilyBoardConfig): void {
  if (!config.persons || !Array.isArray(config.persons)) {
    throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");
  }
  this._config = config;
  const enabled = this._enabledViews;
  const wanted = config.view ?? "day";
  this._view = enabled.includes(wanted) ? wanted : enabled[0];
}
```

**Apply:** Import the shared config types/helpers; remove the local duplicate contract; keep the raw
config assignment and every legacy side effect intact. Normalize layout for branch selection only.
At `render()`, build/reuse the existing active-view template once and wrap it in the new shell only
when normalized layout is exactly `wall`; the absent/unknown branch must preserve the current
`ha-card`, `.top`, focus bar, view switcher, dialog, and renderer flow. Replace only wall-reachable
current-time reads with an injectable clock/default system clock; do not alter kiosk/mutation
timestamps unnecessarily. Delegate the single-calendar GET to `calendar-source.ts` while preserving
deduplication, fan-out, parsing, filtering, routing, loading, and error semantics.

**Registration constraint** (`src/ha-family-board-card.ts:3838-3851`): retain the defensive Moran
element registration and existing `window.customCards` metadata. Never register an upstream alias.

---

### `src/editor.ts` (editor component, event-driven config round-trip)

**Analog:** existing editor

**Current duplicate-import seam** (`src/editor.ts:1-21`):

```typescript
import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import { autoDetectPersons } from "./ha-family-board-card";
import type { FamilyBoardConfig } from "./ha-family-board-card";

interface PersonConfig {
  name?: string;
  person?: string;
  calendar?: string | string[];
}
```

**Schema pattern** (`src/editor.ts:113-162`): build selector objects in `_schema()` and append them to
the existing Layout group. The new control should use shared layout option values, not a second
string union.

**Immutable complete-event pattern** (`src/editor.ts:272-286`):

```typescript
private _emit(config: FamilyBoardConfig): void {
  this.dispatchEvent(new CustomEvent("config-changed", { detail: { config } }));
}

private _settingsChanged(ev: CustomEvent): void {
  ev.stopPropagation();
  const next = { ...ev.detail.value };
  this._emit({
    ...this._config,
    ...next,
    persons: this._persons,
    ...(this._config.calendars ? { calendars: this._config.calendars } : {}),
  });
}
```

**Apply:** Import `FamilyBoardConfig`, `PersonConfig`, layout values, and serialization helper from
`./config`; delete the local person interface. Add a `Layout` select with `Default` and `Wall` to the
existing Layout group. Feed Default through the shared helper so it removes `layout`; feed Wall so
it writes exactly `layout: wall`. Start from `{ ...this._config }` so unknown keys, people, and
calendar metadata survive. Emit the same bubbling complete `config-changed` event.

---

### `src/editor-i18n.ts` (utility, localized key lookup)

**Analog:** existing flat EN/DE dictionaries

**Key convention and fallback** (`src/editor-i18n.ts:6-11`,
`src/editor-i18n.ts:273-278`):

```typescript
type Dict = Record<string, string>;

/** Field labels (`l_<option>`), helper texts (`h_<option>`) and UI strings. */
const EN: Dict = {
  l_title: "Card title",
};

const TABLE: Record<string, Dict> = { en: EN, de: DE };

export function et(lang: string, key: string): string {
  return TABLE[lang]?.[key] ?? EN[key] ?? key;
}
```

**Apply:** Add `l_layout`, `h_layout`, and option keys for Default/Wall in EN and DE, following the
existing `l_`, `h_`, and `o_` sections. English text must match `01-UI-SPEC.md` exactly; provide a
faithful concise German translation so fallback behavior is not the normal German path.

---

### `src/localize.ts` (utility, runtime localization transform)

**Analog:** existing runtime dictionaries and `Intl` helpers

**Runtime copy/locale pattern** (`src/localize.ts:8-23`, `src/localize.ts:112-121`):

```typescript
const EN: Dict = {
  board_title: "Family board",
  day: "Day",
  prev_week: "Previous week",
  next_week: "Next week",
  today: "Today",
};

export function localize(hass: any, key: string): string {
  const lang = langOf(hass);
  return TABLE[lang]?.[key] ?? EN[key] ?? key;
}
```

**Apply:** Reuse existing keys wherever possible. Add only a missing wall-shell identity or state key
that is actually rendered. Dates/times continue through the current HA-locale-aware `Intl` helpers;
do not hard-code the fixed harness timezone into production formatting. If Phase 1 leaves inherited
state fragments untouched, do not churn their existing copy merely to pre-implement Phase 4.

---

### `dev/harness.html` (fixture, scenario-driven request-response)

**Analog:** existing browser-only harness

**Production-bundle/custom-element path** (`dev/harness.html:44-47`,
`dev/harness.html:110-161`):

```html
<main id="app"></main>
<script type="module">
  import "/dist/moran-family-board-card.js";

  const card = document.createElement("moran-family-board-card");
  card.setConfig({
    type: "custom:moran-family-board-card",
    title: "Family Board",
    view: "day",
    persons: [/* synthetic lanes */],
  });
  card.hass = hass;
  document.querySelector("#app").append(card);
</script>
```

**HA request mock pattern** (`dev/harness.html:99-108`): preserve the small `states`, `locale`,
`config`, `callApi`, and `callWS` contract and send data through the same card/API path as Home
Assistant.

**Replace this nondeterministic pattern** (`dev/harness.html:49-54`):

```javascript
const dateAt = (dayOffset, hour, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};
```

**Apply:** Parse `scenario=legacy|wall`, use one fixed Wednesday 2026-02-18 15:32 clock and one
equivalent generic event set, and add only `layout: "wall"` for wall. Use Avery, Jordan, Casey, and
Household with `calendar.fixture_*`/`person.fixture_*` IDs. Include timed, all-day, overlap,
multi-person shared, unmatched, and current-spanning events. Set a deterministic locale/time format;
document the browser timezone used for manual evidence. Never read live HA or `/Volumes/config`.

---

### `README.en.md` (documentation, public config reference)

**Analog:** current configuration example/options table

**Option-documentation pattern** (`README.en.md:139-155`):

```markdown
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | – | Custom card title (default: localized “Family board”) |
| `view` | string | `day` | Start view: `day`, `timeline`, `week`, `month` or `agenda` |
```

**Apply:** Add one `layout` row: string, default legacy/absent, and `wall` as the opt-in calendar-only
full-panel shell. Add a short generic YAML example if needed. State explicitly that omitting the key
keeps existing behavior and that Phase 1 wall proof starts in Day; do not advertise deferred
operations, finished cross-view wall styling, or live deployment.

---

### `dist/moran-family-board-card.js` (generated artifact, batch transform)

**Analog:** locked Rollup pipeline

**Generation contract** (`rollup.config.js:5-18`):

```javascript
export default {
  input: "src/ha-family-board-card.ts",
  output: {
    file: "dist/moran-family-board-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json" }), terser()],
};
```

**Quality-gate pattern** (`package.json:15-22`, `.github/workflows/ci.yml:20-33`): source is
typechecked, formatted, tested, and built with the existing npm scripts and Node 20 CI baseline.

**Apply:** Never patch `dist` directly. Run `npm run build` after reviewed source changes, then
commit the generated bundle with the source. Verify no unexpected external chunk is emitted and the
Moran element name/metadata remain present.

## Shared Patterns

### Imports and module boundaries

**Sources:** `src/ha-family-board-card.ts:1-29`, `src/editor.ts:1-7`

- External runtime imports first, external type-only imports next, relative named imports last.
- No path aliases or barrel files.
- Editor may import shared config and `autoDetectPersons`; card keeps its dynamic editor import.
- DOM-free config and calendar adapter behavior belongs outside render methods.

### Authentication and data ownership

**Source:** `src/ha-family-board-card.ts:755-805`

- All calendar access goes through the supplied authenticated `hass.callApi` client.
- No token parameter, browser credential field, direct third-party endpoint, persistence layer, or
  Calendar Bridge call belongs in Phase 1.
- The adapter returns the HA payload; existing `events.ts` remains responsible for parsing/routing.

### Validation and compatibility

**Sources:** `src/ha-family-board-card.ts:340-380`, `src/editor.ts:272-286`, `src/events.ts:21-27`

- Validate required configuration synchronously in `setConfig`.
- Normalize optional user values with pure guard clauses.
- Preserve raw/unknown properties through immutable object spread.
- Only the exact allowlisted `wall` value changes the render branch; all other values use legacy.

### Error handling

**Sources:** `src/events.ts:72-79`, `src/ha-family-board-card.ts:767-824`

- Invalid optional user input degrades safely (for example malformed regex returns non-match).
- Request exceptions are caught at the controller/UI boundary, not swallowed inside the transport.
- Preserve the existing semantics: some calendar results may render; total failure sets `_loadError`.
- Do not log titles, payloads, entity states, credentials, or fixture contents.

### Lit rendering and accessibility

**Sources:** `src/ha-family-board-card.ts:1232-1267`, `src/ha-family-board-card.ts:1315-1345`,
`src/ha-family-board-card.ts:3159-3224`, `src/ha-family-board-card.ts:3669-3676`

- Compose `html` templates; use `nothing` for absent fragments.
- Keep role/tab state, explicit labels, keyboard activation, focus outline, and reduced-motion rules.
- Interpolate event/user text normally. Do not introduce `unsafeHTML` or `innerHTML`.
- Keep person/event identity visible in text, not color alone.

### Testing and deterministic time

**Sources:** `src/events.test.ts`, `dev/harness.html`

- Collocate Vitest files with source and name them `*.test.ts`.
- Prefer pure exported helpers and small deterministic fixtures.
- Production clock defaults to the system clock; the harness injects the fixed time through a narrow
  non-dashboard seam.
- Do not mock the global `Date` in the browser harness or expose a public `test_now` config key.

### Generated distribution

**Sources:** `rollup.config.js`, `package.json`, `.github/workflows/ci.yml`

- Source is authoritative; `dist/moran-family-board-card.js` is generated and committed.
- Every source implementation plan ends with format check, typecheck, focused/full tests as
  appropriate, and build.
- Preserve the existing single self-contained HACS module and MIT/NOTICE attribution.

## Novel Aspects Without an Exact Existing Pattern

No target is completely without an analogue, but three details require the planner to follow
`01-RESEARCH.md` rather than infer behavior from current code:

| Detail | Closest Existing Pattern | Required Source of Truth |
|--------|--------------------------|--------------------------|
| Formal pinned implementation-base ADR | `docs/MORAN_FORK_PLAN.md` | research comparison matrix plus D-01 through D-04 |
| Mocked `hass.callApi` unit test | `src/events.test.ts` + harness mock | Validation Architecture request/payload/error contract |
| Injectable wall-reachable clock | deterministic dates in `events.test.ts` | Research Pattern 4 and deterministic harness contract |

## Metadata

**Analog search scope:** `src/`, `dev/`, `docs/`, `README.en.md`, build config, and CI
**Files scanned:** 18 tracked implementation/documentation files; 5 strongest analog sources read in
depth plus build/docs support files
**Primary analogs:** `src/ha-family-board-card.ts`, `src/editor.ts`, `src/events.ts`,
`src/events.test.ts`, `dev/harness.html`
**Pattern extraction date:** 2026-09-10
**Live Home Assistant access:** none; `/Volumes/config` was neither read nor written
