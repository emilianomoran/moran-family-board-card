# Codebase Concerns

**Analysis Date:** 2026-09-11

## Tech Debt

**Large card component:**
- Issue: `src/ha-family-board-card.ts` contains 3,857 lines spanning API access, state, five renderers, event mutation, drag behavior, dialog markup, and all card styles.
- Impact: unrelated changes share one high-conflict file; extracting or testing a view requires understanding broad mutable state.
- Fix approach: introduce focused domain, data-provider, view-model, and view/style modules incrementally behind the existing custom-element API.

**Duplicated configuration shape:**
- Issue: person configuration is represented in both `src/ha-family-board-card.ts` and `src/editor.ts`.
- Impact: new fields can compile in one surface while being absent or inconsistent in the other.
- Fix approach: move public configuration interfaces to a shared `src/config.ts` module and import them from both card and editor.

**Generated bundle is committed:**
- Issue: every source change also updates a large minified file at `dist/moran-family-board-card.js`.
- Impact: code review noise and merge conflicts can conceal source-level intent.
- Current reason: HACS/release distribution expects the bundle.
- Safe approach: keep it generated only through `npm run build`, verify the source diff first, and never edit it manually.

## Security Considerations

**Browser-visible configuration:**
- Risk: any URL, token, or credential added to Lovelace configuration becomes browser-visible.
- Current mitigation: the card uses only Home Assistant's authenticated `hass` APIs and contains no secrets.
- Recommendation: future Calendar Bridge support must be a narrow server-side adapter; never call Bridge directly from the bundle.

**Public fixtures and documentation:**
- Risk: committed examples could expose household entity IDs, names, locations, or event content.
- Current mitigation: `dev/harness.html` and the concept use generic data.
- Recommendation: keep all public fixtures synthetic and scan planning artifacts before every commit.

## Performance Bottlenecks

**Whole-range event processing:**
- Problem: each refresh parses and segments all fetched events in the selected week/month range.
- Current mitigation: unique calendar fetching, per-instance fetch keys, and configurable refresh intervals.
- Improvement path: measure real calendar volumes before optimizing; if needed, memoize normalization by event occurrence identity and date range.

**Single-component rendering:**
- Problem: Home Assistant state assignment can schedule updates on the entire card even when an unrelated entity changes.
- Cause: the whole interface lives in one Lit component and reads a broad `hass` object.
- Improvement path: split view components and pass stable, minimal view models.

## Fragile Areas

**Recurring-event mutation:**
- Why fragile: Home Assistant calendar capabilities differ by integration, and recurrence identifiers/scopes are provider-specific.
- Common failure: presenting update/delete controls where the entity does not safely support the operation.
- Safe modification: preserve feature-bit gates and add adapter contract tests before extending recurrence behavior.
- Test coverage: current automated tests cover parsing and date splitting, not actual WebSocket mutation responses.

**Date and time logic:**
- Why fragile: all-day exclusivity, week starts, daylight-saving offsets, and events crossing midnight interact across views.
- Safe modification: implement changes in `src/events.ts`, use deterministic dates, and add regression tests before touching renderers.
- Test coverage: good unit coverage for existing segmentation paths; browser/localization boundaries remain manual.

**Editor normalization:**
- Why fragile: Home Assistant form selectors can return empty arrays, strings, booleans, or single-value arrays.
- Safe modification: normalize in `_settingsChanged` and `_personChanged` while preserving unknown configuration keys.
- Test coverage: no automated editor round-trip suite.

## Dependencies at Risk

**Development dependency advisories:**
- Current audit: eight development-only advisories — three moderate, four high, and one critical.
- Production audit: `npm audit --omit=dev` reports zero vulnerabilities.
- Affected development chain includes Vitest/Vite/esbuild plus Terser/serialize-javascript and transitive PostCSS/nanoid packages.
- Impact: local or CI tooling carries avoidable risk even though the shipped browser dependency set is clear.
- Migration plan: upgrade in an isolated phase, review breaking changes, bind development servers to loopback, and rerun all unit/browser/build checks.

**Home Assistant frontend internals:**
- Risk: `ha-*` elements and some `hass` helpers are frontend contracts that can evolve with Home Assistant releases.
- Impact: a Home Assistant update can break editor controls or custom UI interactions without a package change.
- Mitigation: prefer documented APIs, maintain HACS nightly validation, and smoke-test against target HA releases.

## Missing Critical Features

**Calendar-first wall layout:**
- Problem: the current card is a capable dashboard calendar but does not yet implement the opt-in full-screen header, profile filters, or target wall-display composition.
- Current workaround: use existing full-height and kiosk settings.
- Blocks: the intended Skylight-like glanceable calendar experience.
- Complexity: medium; primarily UI architecture, responsive CSS, and interaction-state work.

**Safe advanced write provider:**
- Problem: calendars that advertise create-only support cannot be safely updated or deleted through current Home Assistant APIs.
- Current workaround: keep those events read-only in the card and edit them in their source calendar application.
- Blocks: full in-board editing and recurring-occurrence workflows.
- Complexity: high; requires an authenticated server-side adapter plus recurrence identity/error handling.

## Test Coverage Gaps

**Rendered view interactions:**
- Missing: automated assertions for day/timeline/week/month/agenda switching, person hiding, dialog focus, and keyboard behavior.
- Risk: a UI refactor can regress one view while pure event tests remain green.
- Priority: high for the wall-layout phase.
- Approach: add browser component tests and screenshot checks using generic fixtures.

**Home Assistant boundary:**
- Missing: automated tests for REST event fetching, weather calls, writable-feature gates, and mutation payloads.
- Risk: API-shape regressions appear only on a live dashboard.
- Priority: high before advanced editing.
- Approach: mock the narrow `hass` contract and assert calls/results in component integration tests.

**Visual editor:**
- Missing: configuration round-trip and schema conditional-visibility tests.
- Risk: new options may disappear or unrelated values may be dropped during edits.
- Priority: medium.

## Scaling Limits

- The public card supports up to ten person lanes; smaller displays rely on horizontal scrolling and responsive modes.
- The default calendar request covers a week or visible month grid, not an unbounded history.
- Scaling is constrained by browser rendering density and Home Assistant calendar API response size, not server throughput inside this repository.

---

*Concerns audit: 2026-09-11*
*Update as issues are fixed or new ones discovered*
