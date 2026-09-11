---
phase: 01
slug: prove-the-foundation
status: verified
threats_open: 0
asvs_level: 1
created: 2026-09-11
---

# Phase 01 — Security

> ASVS Level 1 verification of the threat registers authored in the three Phase 1 plans.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| External source → public ADR | Third-party implementation evidence must be pinned and attributable. | Public source metadata and architectural findings |
| Lovelace config → card/editor | User-controlled configuration must not opt into wall mode accidentally or lose unknown keys. | Dashboard configuration |
| Card → Home Assistant API | Calendar reads must remain inside the authenticated Home Assistant client. | Entity IDs, ISO ranges, calendar payloads |
| Home Assistant data → Lit templates | Event and person text is untrusted browser-visible content. | Calendar titles, names, metadata |
| Harness/evidence → public repository | Test fixtures and screenshots must not expose the household or credentials. | Synthetic events, screenshots, logs |
| Reviewed source → dist | The public HACS bundle must match reviewed TypeScript source. | Compiled JavaScript |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation and Evidence | Status |
|-----------|----------|-----------|-------------|-------------------------|--------|
| T-01-01 | Spoofing / Tampering | Candidate source evidence | mitigate | The ADR cites immutable full commits and source paths for both candidates across all eight decision criteria. | closed |
| T-01-02 | Information Disclosure | Public ADR | mitigate | The ADR contains repository/architecture evidence only and passed the credential/private-identifier scan. | closed |
| T-01-03 | Repudiation | Decision outcome | mitigate | The versioned ADR records date, accepted decision, consequences, provenance policy, and revisit trigger. | closed |
| T-01-SC (01-01) | Tampering | Package supply chain | accept | The ADR plan installed nothing and changed no manifest or lockfile. | closed |
| T-01-04 | Tampering | Layout discriminator | mitigate | Only exact wall opts in; missing, default, malformed, and unknown values remain legacy in tested normalization. | closed |
| T-01-05 | Tampering / Information Disclosure | Editor round-trip | mitigate | Immutable serialization deletes only the Default layout key and preserves unknown and nested values in tests. | closed |
| T-01-06 | Spoofing / Information Disclosure | Calendar adapter | mitigate | The adapter accepts only the supplied authenticated hass.callApi; no direct network, token, or provider credential path exists. | closed |
| T-01-07 | Denial of Service | Calendar fan-out | mitigate | Existing stable fetch-key and unique-calendar behavior remain; no retry or extra-read path was introduced. | closed |
| T-01-08 | Tampering | Generated bundle | mitigate | Rollup is the only build path; a temporary rebuild matched tracked dist byte-for-byte. | closed |
| T-01-SC (01-02) | Tampering | Package supply chain | accept | Shared-config/calendar work changed no dependency or lockfile. | closed |
| T-01-09 | Tampering / Elevation | Wall-shell rendering | mitigate | The shell uses normal Lit interpolation and contains no unsafeHTML, innerHTML, executable URL, or direct-fetch path. | closed |
| T-01-10 | Tampering | Layout/CSS isolation | mitigate | Exact normalization gates the branch; all wall styles are rooted beneath .moran-wall-shell; the harness rejects wall markup in legacy mode. | closed |
| T-01-11 | Information Disclosure | Examples, evidence, screenshots, bundle | mitigate | Generic fixtures, explicit changed/evidence scans, separate live-path scans, PNG metadata/string checks, and visual inspection all passed without live HA access. | closed |
| T-01-12 | Denial of Service | Full-panel overflow | mitigate | The outer shell contains overflow while the schedule owns scrolling; bounded lanes and 1920×1080 browser evidence show no whole-card clipping. | closed |
| T-01-13 | Tampering | Fixed-time seam | mitigate | The non-persisted provider defaults to system time, returns cloned dates, and is absent from public dashboard configuration. | closed |
| T-01-14 | Tampering | Distribution artifact | mitigate | Formatting, typecheck, 39 unit tests, all-view browser harness, build, and exact bundle-digest checks passed. | closed |
| T-01-SC (01-03) | Tampering | Package supply chain | accept | Dependencies and lockfile remain unchanged; the only manifest delta is the reviewed test:harness script invoking a repository-local Node file. | closed |

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01 | T-01-SC (01-01) | Documentation-only work introduced no package or dependency exposure. | Phase threat model | 2026-09-11 |
| AR-02 | T-01-SC (01-02) | The implementation reused the locked dependency graph and unchanged lockfile. | Phase threat model | 2026-09-11 |
| AR-03 | T-01-SC (01-03) | A local harness script was added without changing dependencies; build and lockfile integrity were verified. | Phase threat model | 2026-09-11 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-09-11 | 17 | 17 | 0 | GSD security auditor |

## Verification Evidence

- npm run format:check passed.
- npm run lint passed.
- npm test passed: 39/39 tests.
- npm run test:harness passed for wall Day, Timeline, Week, Month, Agenda, and legacy at 1920×1080 in America/Chicago.
- A temporary Rollup rebuild matched the tracked distribution bundle.
- Credential, private-identifier, live-path, screenshot metadata, and screenshot string scans passed.
- No execution summary reported an unregistered threat flag.

---

## Sign-Off

- [x] All threats have a disposition.
- [x] Accepted risks are documented.
- [x] threats_open: 0 is confirmed.
- [x] status: verified is set in frontmatter.

**Approval:** verified 2026-09-11.
