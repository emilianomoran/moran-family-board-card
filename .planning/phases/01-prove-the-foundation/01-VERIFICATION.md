---
phase: 01-prove-the-foundation
verified: 2026-09-11T22:01:29Z
status: passed
score: 13/13 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 9/9
  gaps_closed:
    - "Wall Day person avatars now render as true 40x40 circles inside contained 80px headers, while legacy remains 34x34."
  gaps_remaining: []
  regressions: []
human_verification: []
human_verification_completed:
  - test: "Open the compiled wall and legacy harness scenarios at 1920x1080 and visually re-check the corrected person headers."
    result: pass
    evidence: "Phase 1 UAT Test 2; user confirmed the corrected result is much better and asked to continue."
---

# Phase 1: Prove the Foundation Verification Report

**Phase Goal:** As a Home Assistant administrator, I want an opt-in wall-mode day slice built on a validated implementation base, so that I can evaluate the family calendar experience without changing legacy behavior.
**Verified:** 2026-09-11T22:01:29Z
**Status:** passed
**Re-verification:** Yes — after Plan 01-04 closed the avatar-geometry UAT gap

## User Flow Coverage

User story: “As a Home Assistant administrator, I want an opt-in wall-mode day slice built on a validated implementation base, so that I can evaluate the family calendar experience without changing legacy behavior.”

| Step | Expected | Evidence | Status |
|------|----------|----------|--------|
| Validate the base | The administrator can inspect a source-pinned continue/pivot decision. | `docs/adr/0001-implementation-base.md:1-116` contains both immutable commits, all eight matrix rows, the continue decision, provenance rules, consequences, and revisit criteria. The prior UAT source audit passed. | ✓ VERIFIED |
| Enable wall mode | Exact `layout: wall` selects the wall surface and other values remain legacy. | `src/config.ts:74-84`, `src/config.test.ts:9-59`, and `src/ha-family-board-card.ts:284-293,1173-1196`; normalization and editor serialization tests pass. | ✓ VERIFIED |
| Evaluate the day slice | The production bundle renders a deterministic full-panel Day calendar from Home Assistant-shaped data. | `dev/harness.html:95-254` imports only `dist`, injects the fixed clock, and supplies generic `hass.callApi` data; the fresh browser gate passed at 1920x1080 in America/Chicago, and UAT Test 2 accepted the corrected header appearance. | ✓ VERIFIED |
| Compare legacy | Omitting `layout` retains the pre-wall root, shared renderer, and legacy avatar geometry. | `src/ha-family-board-card.ts:1173-1226`, `dev/harness.html:283-320`, and the fresh compiled-browser result `avatar-geometry: 4x34x34; legacy: existing card root`. Plan 01-04 did not change the shared card source. | ✓ VERIFIED |
| Outcome | The administrator can safely compare wall and legacy without changing live Home Assistant. | The fixture is loopback-only and generic; privacy/live-path scans passed; no live Home Assistant path or API was accessed. | ✓ VERIFIED |

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A written ADR compares the Moran fork and `tienou/family-calendar-card` from pinned source and records an actionable direction. | ✓ VERIFIED | The 116-line ADR cites both full commits, includes the eight required source-evidence rows, chooses the Moran fork, preserves attribution, and defines a five-part revisit gate. Its human source audit already passed in UAT. |
| 2 | Only exact `layout: wall` opts in; missing, default, malformed, case-varied, and unknown values retain legacy selection. | ✓ VERIFIED | `normalizeLayout` is an exact allowlist (`src/config.ts:74-77`); six normalization cases pass in `src/config.test.ts:9-23`; `setConfig` stores the normalized layout. |
| 3 | Choosing Default in the editor removes `layout` without mutating or narrowing the raw configuration. | ✓ VERIFIED | `withLayout` copies and deletes/writes only the discriminator (`src/config.ts:79-84`); tests preserve unknown, person, and calendar metadata (`src/config.test.ts:25-59`); the editor merges from the complete config before serialization (`src/editor.ts:283-296`). |
| 4 | Card and editor compile against one shared v1 configuration contract. | ✓ VERIFIED | Exactly one exported `FamilyBoardConfig` and one `PersonConfig` exist under `src/`; both consumers import `./config`; strict TypeScript passes. |
| 5 | Calendar reads stay on the authenticated Home Assistant boundary, once per unique configured calendar, with controller-owned routing and error behavior. | ✓ VERIFIED | `readCalendarEvents` calls only supplied `hass.callApi` (`src/calendar-source.ts:20-31`); request, payload, and rejection tests pass; `_fetchEvents` deduplicates calendars and fans out once per unique entry (`src/ha-family-board-card.ts:700-765`). |
| 6 | Wall mode renders one calendar-only full-panel Day shell using the existing navigation and calendar renderer, with no deferred operations controls. | ✓ VERIFIED | `renderWallShell` is presentation-only (`src/wall-shell.ts:3-31`), receives the shared view/content fragments, and uses root-scoped wall styles. The compiled harness exercises the Day slice and all five existing view buttons. |
| 7 | The same build preserves the legacy shell, defaults, and interaction path when wall mode is absent. | ✓ VERIFIED | The non-wall branch retains `<ha-card>`, `.top`, shared focus, active renderer, and dialog (`src/ha-family-board-card.ts:1173-1226`); missing-layout tests and compiled legacy root/geometry smoke pass. Plan 01-04 changed no shared card source. |
| 8 | A deterministic generic harness exercises wall and legacy through Home Assistant-shaped data and a fixed clock. | ✓ VERIFIED | `dev/harness.html:95-254` imports the production bundle, fixes 2026-02-18 15:32 America/Chicago, uses Avery/Jordan/Casey/Household plus `fixture_*` IDs, and supplies a mocked authenticated client. |
| 9 | The proof remains public-safe, generated from source, and independent of live Home Assistant. | ✓ VERIFIED | Security is verified with 23/23 threat-register rows closed; privacy and implementation live-path scans pass; a fresh build retained SHA-256 `832c8983802507b43010eeb9535eadb6fa5d9d55342cea61423a30bcf5c35c06`. |
| 10 | Every visible wall Day person avatar renders as a true 40x40 circle with badge and no-badge cases. | ✓ VERIFIED | Wall-only CSS sets equal token dimensions, `aspect-ratio: 1 / 1`, and `flex-shrink: 0` (`src/wall-shell.ts:246-255`). Fresh Chrome DOMRects report `avatar-geometry: 4x40x40`; the fixture includes one badge header and three no-badge headers. |
| 11 | Every visible wall person header remains 80px high and contains avatar, identity text, and the optional 48px badge without overflow. | ✓ VERIFIED | The wall grid defines fixed avatar, ellipsized identity, and collapsing badge tracks (`src/wall-shell.ts:229-290`). Browser assertions reject height or client/scroll overflow (`dev/harness.html:346-359`) and reported four contained 80px headers with a 57.90625x48px badge. |
| 12 | The same production bundle keeps legacy avatars at 34x34 and leaves shared avatar/card behavior untouched by the gap closure. | ✓ VERIFIED | Fresh Chrome reports `avatar-geometry: 4x34x34`; `git diff bcb1a75..HEAD -- src/ha-family-board-card.ts` is empty; the unscoped `.avatar` rule and legacy root remain unchanged. |
| 13 | The deterministic browser gate rejects divergent avatar geometry and cannot pass without scenario-specific evidence. | ✓ VERIFIED | `dev/harness.html:283-310` rejects missing, zero-size, non-square, and off-baseline avatars at a 0.5px tolerance; `dev/harness-check.mjs:111-178` requires distinct wall and legacy markers before reporting success. |

**Score:** 13/13 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `docs/adr/0001-implementation-base.md` | Pinned source comparison and decision | ✓ VERIFIED | Exists, substantive, source-linked, and previously human-audited. |
| `src/config.ts` | Shared configuration and layout helpers | ✓ VERIFIED | Exact normalization and immutable serialization are exported and wired to card/editor. |
| `src/config.test.ts` | Compatibility regression coverage | ✓ VERIFIED | Ten passing tests cover opt-in, deletion, non-mutation, and metadata preservation. |
| `src/calendar-source.ts` | Authenticated calendar-read port | ✓ VERIFIED | Narrow `hass.callApi` adapter; no direct provider client, credential, persistence, cache, or retry layer. |
| `src/calendar-source.test.ts` | Request/payload/error contract | ✓ VERIFIED | Two passing tests cover method/path, payload identity, and rejection identity. |
| `src/wall-shell.ts` | Focused wall composition and corrected geometry | ✓ VERIFIED | 411 substantive lines; wall-rooted CSS supplies square avatars and bounded headers. |
| `src/localize.ts` | Dedicated localized wall identity | ✓ VERIFIED | Wall title/Calendar keys coexist with the unchanged legacy board title. |
| `dev/harness.html` | Deterministic wall/legacy fixture and page assertions | ✓ VERIFIED | Exercises the compiled element with fixed generic data and direct DOMRect checks. |
| `dev/harness-check.mjs` | Loopback Chrome enforcement | ✓ VERIFIED | Runs both scenarios at 1920x1080 America/Chicago and requires per-scenario geometry evidence. |
| `README.en.md` | Public opt-in/compatibility guidance | ✓ VERIFIED | Documents `layout: wall` and missing-layout compatibility. |
| `dist/moran-family-board-card.js` | HACS-compatible generated bundle | ✓ VERIFIED | Fresh Rollup output is byte-stable against the tracked artifact. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| ADR | Phase research | Full commit pins and locked matrix criteria | ✓ WIRED | GSD key-link query passed. |
| Card | Shared config | Shared types, view constants, and `normalizeLayout` | ✓ WIRED | Manual source inspection confirms relative import and runtime use. The generic GSD path matcher reports a known false negative for the relative target string. |
| Editor | Shared config | Shared types, normalizer, and `withLayout` | ✓ WIRED | Manual source inspection confirms import and emitted serializer path; generic matcher has the same relative-path limitation. |
| Card | Calendar source | Deduplicated controller fan-out delegates each authenticated GET | ✓ WIRED | GSD key-link query and manual trace pass. |
| Card | Wall shell | Exact wall branch passes shared navigation/focus/content | ✓ WIRED | GSD query and source trace pass. |
| Card | Localization | Dedicated wall identity keys | ✓ WIRED | GSD query and runtime lookup pass. |
| Wall CSS | Existing Day markup | Rooted `.phead > .avatar`, text, and badge grid selectors | ✓ WIRED | GSD Plan 01-04 query passed; selectors match direct markup at `src/ha-family-board-card.ts:1345-1367`. |
| Harness page | Production bundle | Module import, custom-element instantiation, and DOMRect assertions | ✓ WIRED | Both GSD query and fresh Chrome execution pass. |
| Harness runner | Harness page | CDP result plus required geometry markers | ✓ WIRED | Plan 01-04 key-link query and fresh execution pass. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `FamilyBoardCard` wall Day | `_raw` → `_events` → active Day template | Unique configured calendars → `readCalendarEvents(this.hass, …)` → existing parser/router/segmenter | Yes; the harness returns non-empty HA-shaped payloads covering all-day, timed, shared, unmatched, overlap, and current-time cases. | ✓ FLOWING |
| Visual editor layout | `_config.layout` | Complete editor config → `normalizeLayout` → `withLayout` → `config-changed` | Yes; wiring and pure serialization tests prove the discriminator without a duplicate schema. | ✓ FLOWING |
| Wall avatar geometry | Existing `.phead > .avatar` markup | Person config/state → `_avatar()` → shared Day template → wall-rooted style override | Yes; four fixture people render through the production bundle and supply measured DOMRects. | ✓ FLOWING |
| Distribution | Registered custom element | Rollup entry `src/ha-family-board-card.ts` | Yes; the loopback harness imports only `dist`, registers the element, and renders both roots. | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full quality and browser gate | `npm run format:check && npm run lint && npm test && npm run build && npm run test:harness` | Formatting and typecheck passed; 39/39 tests passed; Rollup built; wall and legacy browser checks passed. | ✓ PASS |
| Corrected wall geometry | `npm run test:harness` (same single full-gate run) | `avatar-geometry: 4x40x40`; four 80px headers contained; badge 57.90625x48; all five wall-view target/focus checks passed. | ✓ PASS |
| Legacy regression geometry | `npm run test:harness` (same run) | `avatar-geometry: 4x34x34; legacy: existing card root`. | ✓ PASS |
| Generated-bundle parity | SHA-256 before/after fresh `npm run build` | Both digests `832c8983802507b43010eeb9535eadb6fa5d9d55342cea61423a30bcf5c35c06`; working tree remained clean. | ✓ PASS |
| Gap-closure isolation | `git diff bcb1a75..HEAD -- src/ha-family-board-card.ts package.json package-lock.json` | No shared card or dependency-manifest difference. | ✓ PASS |
| Privacy/live boundary | Explicit denylist and implementation-only live-path scans | No credential, private identifier, or implementation live-path match. | ✓ PASS |

### Probe Execution

No phase-declared or conventional probe scripts exist; probe execution is not applicable.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FOUND-01 | 01-01 | Source-level implementation-base decision | ✓ SATISFIED | Source-pinned accepted ADR; prior human audit passed. |
| FOUND-02 | 01-02, 01-03, 01-04 | Exact opt-in wall layout with unchanged missing-layout behavior | ✓ SATISFIED | Normalizer tests, isolated render branches, compiled wall/legacy harness, corrected wall geometry, and legacy 34px regression evidence. |
| FOUND-03 | 01-02, 01-03 | One shared configuration source for card and editor | ✓ SATISFIED | Single exported contract consumed by both surfaces; strict TypeScript and serialization tests pass. |

No Phase 1 requirement is orphaned. FOUND-01, FOUND-02, and FOUND-03 are all claimed by plans and mapped in `REQUIREMENTS.md`.

### Anti-Patterns and Evidence Limitations

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `dev/harness.html` | 225 | The optional badge exists only in the wall fixture. | ℹ️ Info | This is deliberate Plan 01-04 coverage for the constrained header, but means the paired fixture is no longer a literal one-variable pixel comparison. Calendar/event/controller data remain equivalent. |
| `dev/harness.html` | 313-320 | Legacy automation checks avatar geometry and root presence, then returns. | ⚠️ Warning | The automated legacy branch does not replay view/date interactions. Compatibility is supported by unchanged shared source, existing interaction wiring, the prior UAT (which surfaced only the avatar defect), and the final human visual comparison. |
| `src/editor.ts`, `src/ha-family-board-card.ts`, `src/events.ts` | various | `placeholder`, `return null`, and `return []` grep matches | ℹ️ Info | Manual inspection shows legitimate input placeholders, validation/domain guard returns, and hidden-person empty selectors—not implementation stubs. |

No `TBD`, `FIXME`, `XXX`, unresolved implementation placeholder, hollow renderer, direct provider credential path, or blocker anti-pattern appears in the Phase 1 implementation.

### Disconfirmation Pass

- **Partially automated requirement:** legacy interaction compatibility is not replayed by the legacy harness; the strongest regression evidence is unchanged shared source plus root/geometry execution.
- **Potentially misleading test:** a scenario marker alone would be weak evidence, but the page emits it only after enumerating four direct avatars and passing non-zero, square, and exact-size DOMRect checks; the outer runner independently requires the matching marker.
- **Uncovered error path:** the adapter rejection is unit-tested, but the controller's total-load-error presentation has no new Phase 1 browser fixture. Rich failure-state coverage is explicitly assigned to Phase 4 and is not a Phase 1 gap.

### Deferred Items

Portrait/tablet responsiveness, final day hierarchy, filters, now/next, dense-day behavior, other-view wall treatment, weather, comprehensive accessibility/error states, meals/lists, and live deployment remain explicitly assigned to Phases 2-5 or post-v1. They are not Phase 1 gaps.

### Human Verification Completed

#### 1. Corrected wall and legacy person-header appearance

**Test:** At 1920x1080 in Chrome, open `dev/harness.html?scenario=wall` and `?scenario=legacy`. Look only at the four person headers.

**Expected:** All four wall avatars look fully circular. Avery's avatar, name/status, and 48px badge fit cleanly within the 80px row; Jordan, Casey, and Household remain undistorted without badges. Legacy still shows circular 34px avatars and the familiar card shell.

**Result:** PASS — the user accepted the corrected appearance in Phase 1 UAT Test 2.

The previously passed ADR audit is not requested again.

### Gaps Summary

No implementation or acceptance gap remains. Plan 01-04 closes the diagnosed avatar issue with wall-scoped CSS and compiled-browser regression evidence; UAT Test 2 accepted the corrected result, and no prior must-have regressed.

---

_Verified: 2026-09-11T22:01:29Z_
_Verifier: Codex (gsd-verifier)_
