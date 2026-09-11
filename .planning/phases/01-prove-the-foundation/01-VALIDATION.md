---
phase: 01
slug: prove-the-foundation
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-09-10
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 1.6.1 for unit behavior, TypeScript 5.9.3 for contract integration, and a manual Chrome harness for wall-layout evidence |
| **Config file** | `package.json` scripts and `tsconfig.json`; Vitest uses its repository defaults |
| **Quick run command** | `npm test -- src/config.test.ts` |
| **Full suite command** | `npm run format:check && npm run lint && npm test && npm run build` |
| **Estimated runtime** | ~15 seconds automated, plus ~5 minutes for the two manual harness scenarios |

---

## Sampling Rate

- **After every task commit:** Run the focused test named by that task plus `npm run lint`.
- **After every plan wave:** Run `npm run format:check && npm run lint && npm test`.
- **Before `/gsd-verify-work`:** The full suite, privacy scan, generated-bundle check, and legacy/wall harness evidence must be green.
- **Max feedback latency:** 30 seconds for automated checks.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FOUND-01 | T-01 / T-02 | Decision cites pinned sources and preserves license/provenance and HA-only credentials | documentation/structural | `rg -n "target calendar behavior\|shared-calendar\|Home Assistant API\|test\|maintain\|license\|migration\|five-view\|Decision" docs/adr/0001-implementation-base.md` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUND-02, FOUND-03 | T-03 | Only exact `wall` opts in; defaults and unknown keys remain safe and round-trippable | unit/typecheck | `npm test -- src/config.test.ts && npm run lint` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | FOUND-03 | T-04 | Calendar reads remain behind the authenticated Home Assistant client with no browser credential path | unit/typecheck | `npm test -- src/calendar-source.test.ts && npm run lint` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | FOUND-02 | T-03 / T-05 | Wall CSS and markup are scoped; absent/unknown layout preserves the legacy shell | unit/build | `npm test -- src/config.test.ts && npm run build` | ❌ W0 | ⬜ pending |
| 01-03-02 | 03 | 2 | FOUND-02 | T-01 | Fixed synthetic data contains no household identifiers, tokens, or live entity IDs | structural/privacy | `git diff --check && ! rg -n "/Volumes/config|HOME_ASSISTANT_TOKEN|calendar\.(?!fixture_)" dev src docs/adr --pcre2` | Existing harness needs modification | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Manual Harness Contract

Serve the repository on loopback and inspect the production bundle at 1920×1080 in Chrome:

1. `dev/harness.html?scenario=legacy` uses configuration without `layout` and preserves the existing shell and interactions.
2. `dev/harness.html?scenario=wall` adds only `layout: wall` and renders the approved calendar-only wall shell.
3. Both scenarios use the same fixed clock, timezone, generic Home Assistant-shaped data, and equivalent timed, all-day, overlapping, shared, multi-person, and unmatched events.
4. Record screenshot paths and the browser/timezone used in the Phase 1 execution summary; automated screenshot comparison remains Phase 5 scope.

---

## Wave 0 Requirements

- [ ] `src/config.test.ts` — missing, unknown, default, and wall normalization; editor Default deletion; unknown-key preservation for FOUND-02/FOUND-03.
- [ ] `src/calendar-source.test.ts` — authenticated Home Assistant read-boundary request, encoded range, payload, and error behavior for FOUND-03.
- [ ] `dev/harness.html` — selectable legacy/wall scenarios with fixed synthetic data and injected time for FOUND-02.
- [ ] `docs/adr/0001-implementation-base.md` — pinned source comparison, decision, provenance, and revisit trigger for FOUND-01.

No test-framework installation is required. Browser automation and screenshot diffing remain Phase 5 work.

---

## Security Verification

Phase 1 is evaluated at ASVS Level 1 and blocks high-severity findings. Each implementation plan must identify its applicable threats and prove that:

- no credential, live household event, private entity ID, or `/Volumes/config` content enters source, fixtures, docs, logs, screenshots, or `dist`;
- event text uses Lit interpolation without `unsafeHTML`, `innerHTML`, or executable URL handling;
- only exact `layout: wall` selects the opt-in branch;
- calendar access continues through the supplied authenticated `hass` client, with no direct third-party credential or endpoint;
- copied source, if any, receives explicit license and attribution review; and
- `dist/moran-family-board-card.js` is generated only by `npm run build` and matches the reviewed source.

---

## Final Phase Gate

- [ ] ADR covers every locked comparison criterion and reaches the explicit continue/pivot decision.
- [ ] Focused configuration and calendar-boundary tests pass.
- [ ] `npm run format:check && npm run lint && npm test && npm run build` passes.
- [ ] Tracked `dist/moran-family-board-card.js` is rebuilt from source and not hand-edited.
- [ ] Legacy and wall harness scenarios pass the 1920×1080 checklist with deterministic generic data.
- [ ] Privacy/secret scan covers staged source, docs, harness assets, and the generated bundle.
- [ ] No file under `/Volumes/config` and no live Home Assistant dashboard resource was modified.

---

## Validation Readiness

- [x] Every Phase 1 requirement has at least one planned verification path.
- [x] Automated checks sample the shared config and Home Assistant data seams before shell integration.
- [x] Manual visual evidence is explicitly bounded and reproducible without live data.
- [x] Feedback latency is below 30 seconds for automated checks.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** planning-approved 2026-09-10; execution evidence pending.
