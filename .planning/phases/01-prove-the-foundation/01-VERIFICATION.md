---
phase: 01-prove-the-foundation
verified: 2026-09-11T09:07:59Z
status: human_needed
score: 9/9 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Review the eight ADR evidence rows against both pinned source commits."
    expected: "Every comparison and the continue decision are supported by the cited immutable source, license, test, and migration evidence."
    why_human: "Source-quality and decision-sufficiency judgment cannot be established by repository structure checks alone."
  - test: "Open the wall and legacy harness scenarios in Chrome at 1920x1080 America/Chicago and complete the Phase 1 visual checklist and legacy interaction comparison."
    expected: "Wall is one legible calendar-only full-panel canvas with no clipping or private data; legacy retains the pre-wall shell and working view/date interactions."
    why_human: "Visual hierarchy, perceived legibility, unchanged appearance, and interaction feel require human review even though deterministic browser assertions pass."
---

# Phase 1: Prove the Foundation Verification Report

**Phase Goal:** As a Home Assistant administrator, I want an opt-in wall-mode day slice built on a validated implementation base, so that I can evaluate the family calendar experience without changing legacy behavior.
**Verified:** 2026-09-11T09:07:59Z
**Status:** human_needed
**Re-verification:** No — initial verification

## User Flow Coverage

User story: “As a Home Assistant administrator, I want an opt-in wall-mode day slice built on a validated implementation base, so that I can evaluate the family calendar experience without changing legacy behavior.”

| Step | Expected | Evidence | Status |
|------|----------|----------|--------|
| Validate the base | The administrator can inspect an accepted, source-pinned continue/pivot decision. | `docs/adr/0001-implementation-base.md:1-116` contains both full commits, eight required criteria, `Decision: Continue the Moran fork`, provenance rules, consequences, and a revisit trigger. | ✓ CODE-COVERED; human source review pending |
| Open wall mode | Exact `layout: wall` selects the wall surface through the production bundle. | `src/config.ts:74-77`, `src/ha-family-board-card.ts:284-293,1173-1196`, and `dev/harness.html:95-104,201-254`. | ✓ CODE-COVERED |
| See the day slice | The board shows the fixed generic schedule in a calendar-only full-panel Day canvas. | Current compiled screenshot at `/tmp/moran-family-board-phase-01-verifier/wall-current.png`; `npm run test:harness` passed at 1920x1080 America/Chicago. | ✓ CODE-COVERED; human visual review pending |
| Compare legacy | Omitting `layout` reaches the pre-wall `ha-card` composition using the same controller and active renderer. | `src/config.test.ts:9-23`, `src/ha-family-board-card.ts:1173-1226`, current legacy screenshot at `/tmp/moran-family-board-phase-01-verifier/legacy-current.png`, and the legacy browser smoke check. | ✓ CODE-COVERED; human comparison pending |
| Outcome | The implementation permits a safe wall-versus-legacy evaluation without a live Home Assistant change. | Generic mocked `hass.callApi`, fixed clock, loopback-only harness, privacy scan, and no implementation reference to `/Volumes/config`. | ✓ CODE-COVERED |

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A written ADR compares this fork and `tienou/family-calendar-card` from source and records an actionable decision. | ✓ VERIFIED | The 116-line ADR cites both full immutable commits, supplies all eight required matrix rows, selects the Moran fork, preserves attribution, and defines a five-part revisit gate. The structural artifact and key-link checks passed. |
| 2 | Only exact `layout: wall` opts in; missing, default, malformed, or unknown values retain legacy selection. | ✓ VERIFIED | `normalizeLayout` is an exact allowlist at `src/config.ts:74-77`; five legacy cases plus exact Wall are green in `src/config.test.ts:9-23`; `setConfig` stores the normalized branch at `src/ha-family-board-card.ts:284-293`. |
| 3 | Choosing Default in the editor removes `layout` without mutating or narrowing the raw configuration. | ✓ VERIFIED | `withLayout` copies and deletes/writes only the discriminator (`src/config.ts:79-85`); tests prove non-mutation and preservation of unknown/person/calendar references (`src/config.test.ts:25-60`); the editor merges from the complete raw config before serialization (`src/editor.ts:279-296`). |
| 4 | Card and editor compile against one shared v1 configuration contract. | ✓ VERIFIED | Exactly one exported `FamilyBoardConfig` and `PersonConfig` exist under `src/`; both card and editor import `./config`; strict TypeScript passes. |
| 5 | Calendar reads remain on the authenticated Home Assistant boundary with one request per unique configured calendar and unchanged controller ownership. | ✓ VERIFIED | `readCalendarEvents` calls only supplied `hass.callApi` with encoded ISO bounds (`src/calendar-source.ts:20-31`); its payload/rejection tests pass; `_fetchEvents` deduplicates the configured set and delegates once per entry while retaining routing, parsing, deduplication, and total-error semantics (`src/ha-family-board-card.ts:700-765`). |
| 6 | Wall mode renders one calendar-only full-panel Day shell with existing navigation/content and no deferred household-operation controls. | ✓ VERIFIED | `renderWallShell` is presentation-only (`src/wall-shell.ts:3-31`), the card passes the shared view switcher and active renderer (`src/ha-family-board-card.ts:1173-1226`), wall CSS is root-scoped and contains the panel/overflow/touch/focus contracts (`src/wall-shell.ts:33-360`), and the current 1920x1080 render shows only calendar content. |
| 7 | The same build preserves the legacy shell, defaults, and interaction wiring when wall mode is absent. | ✓ VERIFIED | The non-wall branch retains `<ha-card>`, `.top`, focus, the shared active renderer, and dialog (`src/ha-family-board-card.ts:1187-1196`); diff against `1f71865` shows the renderer/switcher were extracted without handler changes; legacy normalization tests and browser root smoke pass. Final appearance/feel remains in human UAT. |
| 8 | A deterministic generic harness exercises the production bundle through Home Assistant-shaped data for wall and legacy scenarios. | ✓ VERIFIED | `dev/harness.html` imports only `dist`, fixes 2026-02-18 15:32 America/Chicago, creates generic fixture entities/events, injects the clock, and supplies `hass.callApi`; `npm run test:harness` passed wall Day/Timeline/Week/Month/Agenda and legacy at 1920x1080. |
| 9 | The proof remains public-safe, generated from source, and independent of live Home Assistant. | ✓ VERIFIED | Security status is verified with 17/17 threats closed; explicit credential/private-name/live-path and PNG string scans passed; the Rollup rebuild produced the same SHA-256 `424851b98e440aa2e3e99a3f81ea2ef20eeeaac78e031372a9b3193bd7487dda`; no live HA path was accessed or mutated during verification. |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `docs/adr/0001-implementation-base.md` | Pinned source comparison and decision | ✓ VERIFIED | Exists, substantive, and linked to the phase research contract. |
| `src/config.ts` | Shared public configuration and layout helpers | ✓ VERIFIED | Exports the complete shared contract plus exact normalization and immutable serialization. |
| `src/config.test.ts` | Compatibility regression coverage | ✓ VERIFIED | Ten passing tests cover exact opt-in, deletion, non-mutation, and metadata preservation. |
| `src/calendar-source.ts` | Authenticated calendar-read port | ✓ VERIFIED | Contains one narrow `hass.callApi` path and no direct fetch, token, retry, cache, server, or database. |
| `src/calendar-source.test.ts` | Request/payload/error contract | ✓ VERIFIED | Two passing tests assert exact method/path, identity pass-through, and rejection identity. |
| `src/wall-shell.ts` | Focused wall presentation boundary | ✓ VERIFIED | 361 substantive lines; imported and rendered only by the card's wall branch. |
| `src/localize.ts` | Dedicated localized wall identity | ✓ VERIFIED | Wall-only `Family Board`/`Calendar` keys exist while legacy `board_title` remains unchanged. |
| `dev/harness.html` | Deterministic wall/legacy fixture | ✓ VERIFIED | Current production-bundle scenarios render generic fixed data through mocked HA APIs. |
| `README.en.md` | Public opt-in/compatibility guidance | ✓ VERIFIED | Documents `layout: wall` and that omission preserves existing behavior. |
| `dist/moran-family-board-card.js` | HACS-compatible generated bundle | ✓ VERIFIED | Rebuild is byte-stable and clean against Git. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| ADR | Phase research | Full commit pins and locked matrix criteria | ✓ WIRED | GSD key-link query passed. |
| Card | Shared config | Imports types/constants/normalizer | ✓ WIRED | Manual inspection confirms `from "./config"` and runtime `normalizeLayout`; the generic GSD target-path matcher reported a false negative because the import is relative. |
| Editor | Shared config | Imports types/normalizer/serializer | ✓ WIRED | Manual inspection confirms shared imports and `withLayout` use in `_settingsChanged`; the same generic matcher limitation applies. |
| Card | Calendar source | Per-calendar fan-out calls `readCalendarEvents` | ✓ WIRED | GSD key-link query and source trace pass. |
| Card | Wall shell | Wall branch passes shared navigation/focus/content | ✓ WIRED | GSD key-link query and render trace pass. |
| Card | Localization | Dedicated wall identity keys | ✓ WIRED | GSD key-link query and runtime lookup pass. |
| Harness | Distribution bundle | Module import and custom-element instantiation | ✓ WIRED | GSD key-link query and browser run pass. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `FamilyBoardCard` wall Day | `_raw` → `_events` → active Day template | Unique configured calendars → `readCalendarEvents(this.hass, …)` → existing routing/parser/segmenter | Yes; deterministic harness returns non-empty HA-shaped payloads and current screenshots contain all-day, timed, shared, unmatched, overlap, and current-time examples. | ✓ FLOWING |
| Visual editor layout | `_config.layout` | Complete raw editor config → `normalizeLayout` → `withLayout` → bubbling `config-changed` | Yes; source wiring and pure serialization tests prove the emitted discriminator behavior without a duplicate schema. | ✓ FLOWING |
| Distribution | Custom-element module | Rollup entry `src/ha-family-board-card.ts` | Yes; harness imports `dist`, registers the Moran element, and renders both roots. | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full quality gate | `npm run format:check && npm run lint && npm test && npm run test:harness && npm run build` | Formatting and strict typecheck passed; 39/39 tests passed; wall checks covered all five views; legacy root smoke passed; Rollup completed. | ✓ PASS |
| Generated-bundle parity | SHA-256 before/after the verifier's Rollup build | Both digests were `424851b98e440aa2e3e99a3f81ea2ef20eeeaac78e031372a9b3193bd7487dda`; `dist` remains clean. | ✓ PASS |
| Exact shared declarations | Count exported `FamilyBoardConfig` and `PersonConfig` declarations | One of each; both consumers import the same module. | ✓ PASS |
| Current rendered evidence | Fresh headless Chrome captures at 1920x1080 with `TZ=America/Chicago` | Wall and legacy PNGs are 1920x1080 and contain the expected generic data. | ✓ PASS |
| Privacy/live boundary | Explicit Phase 1 source/evidence and PNG scans | No credential/private identifier or implementation `/Volumes/config` match. | ✓ PASS |

### Probe Execution

No phase-declared or conventional probe scripts exist; probe execution is not applicable.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FOUND-01 | 01-01 | Source-level go/pivot decision | ✓ SATISFIED | Accepted ADR with immutable two-repository evidence matrix and explicit continue decision. |
| FOUND-02 | 01-02, 01-03 | Exact opt-in wall layout with unchanged missing-layout behavior | ✓ SATISFIED | Normalizer/serializer tests, isolated render branches, compiled wall/legacy harness, and current screenshots. |
| FOUND-03 | 01-02, 01-03 | One shared configuration source for card and editor | ✓ SATISFIED | Single exported contract consumed by both surfaces; strict TypeScript and unit tests pass. |

No Phase 1 requirement is orphaned: FOUND-01, FOUND-02, and FOUND-03 are all claimed by plans and mapped in `REQUIREMENTS.md`.

### Anti-Patterns and Evidence Limitations

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `dev/harness.html` | 225 | The wall scenario alone adds the synthetic battery badge, so the two fixture configs are not literally identical except for `layout`. | ⚠️ Warning | Calendar/event data and the controller path remain equivalent, but this weakens the harness as a strict one-variable visual A/B. Align the badge input before using pixel comparisons as compatibility proof. |
| `dev/harness.html` | 283-290 | The automated legacy branch returns after checking only the absence of the wall root and presence of `ha-card`. | ⚠️ Warning | Source diff supports unchanged handler wiring, but `npm run test:harness` does not itself prove the summary's legacy view/date interaction claim. Human legacy UAT remains required. |
| `/tmp/moran-family-board-phase-01/wall-1920x1080.png` | n/a | The originally documented PNG predates review fix `cb8dc47`; a fresh verifier capture shows the added badge and a different digest. | ℹ️ Info | Current evidence was regenerated at `/tmp/moran-family-board-phase-01-verifier/wall-current.png`; update the canonical evidence path if screenshots are reused later. |

No `TBD`, `FIXME`, `XXX`, unresolved implementation placeholder, hollow renderer, direct provider credential path, or blocker anti-pattern was found in the Phase 1 implementation.

### Disconfirmation Pass

- **Partially automated requirement:** legacy appearance and interaction compatibility has strong source/root evidence, but its current browser automation is only a root smoke check.
- **Test that overstates coverage:** `npm run test:harness` reports a passing legacy scenario without exercising the view/date controls that the execution summary says were tested.
- **Uncovered error path:** the adapter rejection is unit-tested, but the controller's `anyError && raws.length === 0` presentation path has no new Phase 1 test; richer failure-state coverage is explicitly scheduled for Phase 4 and is not a Phase 1 gap.

### Human Verification Required

#### 1. Pinned ADR source audit

**Test:** Review all eight Source Evidence Matrix rows against both pinned commits and confirm the cited files actually support each comparison, the provenance conclusion, and the continue decision.
**Expected:** The Moran fork remains the lower-risk base for the five-view, person-lane, HA-authenticated roadmap, and the attribution/revisit rules follow from the evidence.
**Why human:** The local structural checks can establish completeness and immutable references, but not the sufficiency of each external-source interpretation.

#### 2. 1920x1080 wall and legacy UAT

**Test:** In Chrome with America/Chicago timezone, open `dev/harness.html?scenario=wall` and `?scenario=legacy` at 1920x1080. Check every item in `01-UI-SPEC.md` → Visual Acceptance Checklist, then switch views and use previous/today/next controls in the legacy shell.
**Expected:** Wall fills the available panel with one quiet, legible calendar-only surface; required identity, lanes, events, and current-time marker remain readable without clipping or private data. Legacy retains its familiar card composition and working interactions with no wall token or root leakage.
**Why human:** Perceived hierarchy, legibility, unchanged appearance, and interaction feel cannot be conclusively determined by DOM geometry and computed-style assertions.

### Gaps Summary

No implementation blocker was found. The phase goal and all nine merged roadmap/plan truths are supported by current code and deterministic evidence. Final acceptance remains `human_needed` because the plans explicitly defer source-quality judgment and the visual/legacy experience to human review. The two harness warnings should be addressed or explicitly accepted before this fixture becomes a visual-regression baseline.

---

_Verified: 2026-09-11T09:07:59Z_
_Verifier: Codex (gsd-verifier)_
