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
| **Framework** | Vitest 1.6.1 for unit behavior, TypeScript 5.9.3 for contract integration, and deterministic headless/manual Chrome harnesses for wall-layout evidence |
| **Config file** | `package.json` scripts and `tsconfig.json`; Vitest uses its repository defaults |
| **Quick run command** | `npm test -- src/config.test.ts` |
| **Full suite command** | `npm run format:check && npm run lint && npm test && npm run build && npm run test:harness` |
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
| 01-01-01 | 01 | 1 | FOUND-01 | T-01-01, T-01-02, T-01-03 | Decision, both full hashes, all eight evidence rows, provenance, and revisit trigger are asserted separately; source quality receives human review | documentation/structural | Separate `rg -q` assertions from Plan 01-01 Task 1, then `git diff --check` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 2 | FOUND-02, FOUND-03 | T-01-04, T-01-05 | RED tests define exact Wall opt-in, Default deletion, immutability, and unknown-key preservation | unit/TDD RED | `! npm test -- src/config.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 2 | FOUND-02, FOUND-03 | T-01-04, T-01-05 | One config contract powers card/editor; exact Wall and lossless Default serialization remain registry-safe | unit/typecheck/structural | `npm test -- src/config.test.ts && npm run lint` plus the two single-export and two import assertions from Plan 01-02 Task 2 | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 2 | FOUND-03 | T-01-06, T-01-07, T-01-08 | Calendar access remains one encoded authenticated HA request per unique calendar and `dist` is generated from source | unit/typecheck/build | `npm test -- src/calendar-source.test.ts src/config.test.ts src/events.test.ts && npm run format:check && npm run lint && npm run build && git diff --check` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 3 | FOUND-02, FOUND-03 | T-01-09, T-01-10, T-01-12, T-01-13, T-01-14 | Exact layout branching, localized wall identity, scoped CSS, safe interpolation, fixed display clock, and generated bundle are verified | full suite/static/build | Full suite plus the `renderWallShell`, `normalizeLayout`, `nowProvider`, localization-key, and unsafe-HTML assertions from Plan 01-03 Task 1 | ❌ W0 | ⬜ pending |
| 01-03-02 | 03 | 3 | FOUND-02, FOUND-03 | T-01-11, T-01-14 | Generic paired fixtures, cleaned source examples, explicit changed/evidence-set credential/private-identifier scan, targeted implementation live-path assertion, and screenshot evidence scan protect the public artifact | full suite/structural/privacy/manual | Full suite plus the harness/README assertions, exact screenshot checks, the executable privacy gate below, screenshot `strings` scan, and `git diff --check` from Plan 01-03 Task 2 | Existing harness and evidence need modification | ⬜ pending |
| 01-04-01 | 04 | 4 | FOUND-02 | T-01-15, T-01-16 | Wall-rooted square/non-shrinking avatar geometry and explicit person-header tracks close the UAT issue without changing the shared avatar rule or legacy render path | static/typecheck/regression | Plan 01-04 Task 1 command: full source gates, scoped-selector assertions, unchanged `src/ha-family-board-card.ts`, and `git diff --check` | Existing wall shell | ⬜ pending |
| 01-04-02 | 04 | 4 | FOUND-02 | T-01-17, T-01-19, T-01-SC | Compiled-browser DOMRect checks enforce 4x40x40 wall and 4x34x34 legacy Day avatars, contained wall headers/badge, and generated-bundle integrity without dependency changes | browser/build/regression | `npm run format:check && npm run lint && npm test && npm run build && npm run test:harness` plus geometry-marker and unchanged-manifest assertions | Existing harness needs geometry assertions | ⬜ pending |
| 01-04-03 | 04 | 4 | FOUND-02 | T-01-18 | Completed execution evidence is included in a concrete credential/private-household denylist scan, with the live-path assertion separately scoped to implementation artifacts | documentation/privacy | The executable Plan 01-04 privacy gate below after `01-04-SUMMARY.md` exists | ❌ W0 | ⬜ pending |

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

- [ ] `docs/adr/0001-implementation-base.md` — created by 01-01-01; pinned source comparison, decision, provenance, and revisit trigger for FOUND-01.
- [ ] `src/config.test.ts` — created by 01-02-01 and made green by 01-02-02; missing, unknown, default, and wall normalization; editor Default deletion; unknown-key preservation for FOUND-02/FOUND-03.
- [ ] `src/calendar-source.test.ts` — created and made green by 01-02-03; authenticated Home Assistant read-boundary request, encoded range, payload, and error behavior for FOUND-03.
- [ ] `dev/harness.html` — updated by 01-03-02; selectable legacy/wall scenarios with fixed synthetic data and injected time for FOUND-02.

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

After the completed `01-03-SUMMARY.md` exists, run this deterministic privacy gate. The credential/private-identifier scan covers only the explicit Phase 1 changed/evidence set; the `/Volumes/config` assertion is intentionally limited to Phase 1 implementation/source/test/harness files and the generated bundle so governance documentation can state that boundary without failing the gate:

```bash
privacy_files=(docs/adr/0001-implementation-base.md src/config.ts src/config.test.ts src/calendar-source.ts src/calendar-source.test.ts src/ha-family-board-card.ts src/editor.ts src/editor-i18n.ts src/localize.ts src/wall-shell.ts src/events.ts src/events.test.ts dev/harness.html README.en.md dist/moran-family-board-card.js .planning/phases/01-prove-the-foundation/01-01-SUMMARY.md .planning/phases/01-prove-the-foundation/01-02-SUMMARY.md .planning/phases/01-prove-the-foundation/01-03-SUMMARY.md) && implementation_files=(src/config.ts src/config.test.ts src/calendar-source.ts src/calendar-source.test.ts src/ha-family-board-card.ts src/editor.ts src/editor-i18n.ts src/localize.ts src/wall-shell.ts src/events.ts src/events.test.ts dev/harness.html dist/moran-family-board-card.js) && private_pattern='\b([M]atthew|[O]liver|[E]li|[J]uliet|[A]lex|[J]amie|[R]iley)\b|calendar\.(family|activities|anna|ben_work|ben_private|work)|person\.(alex|jamie|riley)|(?:HOME_ASSISTANT_TOKEN|SUPERVISOR_TOKEN)\s*[:=]\s*(?:\x22|\x27)?[^\s\x22\x27]{8,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|Bearer\s+[A-Za-z0-9._~-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----' && test -f .planning/phases/01-prove-the-foundation/01-03-SUMMARY.md && ! rg -n --hidden --pcre2 "$private_pattern" "${privacy_files[@]}" && ! rg -n --fixed-strings '/Volumes/config' "${implementation_files[@]}" && ! (strings /tmp/moran-family-board-phase-01/wall-1920x1080.png /tmp/moran-family-board-phase-01/legacy-1920x1080.png | rg -n --pcre2 "$private_pattern")
```

After the completed `01-04-SUMMARY.md` exists, run this gap-closure privacy gate. It concretely covers both relevant source files, both harness files, the generated distribution bundle, and the completed summary as required by D-19 and T-01-18. The live-path assertion remains separate and excludes the summary because that governance evidence intentionally names the protected path:

```bash
test -f .planning/phases/01-prove-the-foundation/01-04-SUMMARY.md && privacy_files=(src/ha-family-board-card.ts src/wall-shell.ts dev/harness.html dev/harness-check.mjs dist/moran-family-board-card.js .planning/phases/01-prove-the-foundation/01-04-SUMMARY.md) && implementation_files=(src/ha-family-board-card.ts src/wall-shell.ts dev/harness.html dev/harness-check.mjs dist/moran-family-board-card.js) && private_pattern='\b([M]atthew|[O]liver|[E]li|[J]uliet|[A]lex|[J]amie|[R]iley)\b|calendar\.(family|activities|anna|ben_work|ben_private|work)|person\.(alex|jamie|riley)|(?:HOME_ASSISTANT_TOKEN|SUPERVISOR_TOKEN)\s*[:=]\s*(?:\x22|\x27)?[^\s\x22\x27]{8,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|Bearer\s+[A-Za-z0-9._~-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----' && ! rg -n --hidden --pcre2 "$private_pattern" "${privacy_files[@]}" && ! rg -n --fixed-strings '/Volumes/config' "${implementation_files[@]}"
```

---

## Final Phase Gate

- [ ] ADR covers every locked comparison criterion and reaches the explicit continue/pivot decision.
- [ ] Focused configuration and calendar-boundary tests pass.
- [ ] `npm run format:check && npm run lint && npm test && npm run build` passes.
- [ ] Tracked `dist/moran-family-board-card.js` is rebuilt from source and not hand-edited.
- [ ] Legacy and wall harness scenarios pass the 1920×1080 checklist with deterministic generic data.
- [ ] Privacy/secret scan covers the explicit Phase 1 changed/evidence file set including the completed summary; the separate live-path assertion covers only Phase 1 implementation/source/test/harness files and the generated bundle.
- [ ] Gap closure keeps avatar geometry under `.moran-wall-shell`, leaves the shared `.avatar` rule unchanged, and passes the compiled 40x40 wall / 34x34 legacy Day geometry gate.
- [ ] The completed `01-04-SUMMARY.md` and both relevant source files, both harness files, and generated bundle pass the explicit negative `rg --pcre2` credential/private-identifier scan.
- [ ] No file under `/Volumes/config` and no live Home Assistant dashboard resource was modified.

---

## Validation Readiness

- [x] Every Phase 1 requirement has at least one planned verification path.
- [x] Automated checks sample the shared config and Home Assistant data seams before shell integration.
- [x] Manual visual evidence is explicitly bounded and reproducible without live data.
- [x] Feedback latency is below 30 seconds for automated checks.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** planning-approved 2026-09-10; execution evidence pending.
