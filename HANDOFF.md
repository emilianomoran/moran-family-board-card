---
project: moran-family-board-card
date: 2026-09-21
time: "10:52 CDT"
machine: "local macOS development host (hostname omitted)"
source: handoff-mattpocock
---

# Handoff: continue Moran Calendar in this repository

This is the Skylight-inspired calendar project. **It is a Home Assistant TypeScript/Lit
custom card, not a React app and not the Calendar Bridge repository.** Start here even
when the task originated in the separate Home Assistant operations workspace.

## First things to know

- Work on `feature/moran-foundation`. `main` still holds the upstream baseline. Check
  the actual branch and working tree before editing; do not switch or overwrite work blindly.
- Latest development build: `0.25.1-moran.13`, fixing Timeline's unused lower panel.
  Timeline rows/bars now fill the available height with safe overlap minima and scrolling.
  See D24 and STATUS for verification/delivery. The density slider is still not implemented.
- Installed HA version remains `0.25.1-moran.12`, source
  `4b6530ff7e52d800f8a69ea590ef07b0d026d0f1`, deployed 2026-09-21 at 10:28 CDT.
  The Timeline fix targets the laptop prototype; it has not been deployed to HA.
- The handoff milestone `e3b5b7dd38fcc057f5c096643635cb83de139847` and 29 earlier local
  commits were pushed to personal origin on 2026-09-21; remote HEAD was verified.
  No main merge, release or additional HA deployment occurred. Recheck Git for later work.
- Calendar correctness and daily use are proven to the accepted baseline. Five views,
  person routing, full-day pilot, recovery, filters and read-only details work. Final
  visual design and physical wall hardware are not complete. See [STATUS](docs/STATUS.md).
- The latest header says **Moran Calendar**, then current time with a 12px gap. It is one
  48px row with a 40px view capsule. Status tiles start collapsed. The old Today row is
  gone; month/Today/paging share the left-aligned date strip. Do not restore old screenshots.
- The local harness freezes time at February 18, 2026, 3:32 PM. That is intentional.
  A refreshed laptop bundle does not update the separate HA installation.
- GSD is retired. No phase gates, mandated reviewers or repeated “continue?” prompts.
  Complete authorized work, test, document, commit and push verified milestones.
  Calendar writes, a React pivot, main merges and public releases require separate scope.

## Resume in order

1. Read [AGENTS.md](AGENTS.md), [product brief](docs/PRODUCT.md) and current
   [status](docs/STATUS.md). [Decisions](docs/DECISIONS.md) explain the why.
2. Use [DEVELOPMENT](docs/DEVELOPMENT.md) to start the synthetic preview and run checks.
   No HA access or real appointments are needed for ordinary feature development.
3. Pick work from [BACKLOG](docs/BACKLOG.md) under the current user request. The strongest
   named future feature is **CAL-01: density zoom slider**. It is requested for later,
   not implemented, and the Timeline sizing correction does not start it.
4. Preserve [architecture invariants](docs/ARCHITECTURE.md). For live work, follow
   [OPERATIONS](docs/OPERATIONS.md) and the private workspace's current safety rules.
5. Update the owning docs and this handoff before the next milestone push. Verify the
   remote branch, not just a successful local commit. Keep release/deploy/push states separate.

## Evidence and remaining limits

The r13 checks passed: 151 unit tests and 56 compiled-browser scenarios, plus local
desktop/phone-width review. Actual HA review remains at r12. The user confirmed physical
iPhone HA-app lock/reopen refresh.
They waived the timed provider-edit/cancellation test. Do not reopen that as a gate or
claim measured latency. No real appointment was mutated to test the card.

On the originating checkout, `.planning/debug/wall-menu-clips-narrow.md` was already
untracked. It was left untouched and excluded from this milestone. Its presence does not
mean the old clipping bug is still open; use current tests/status. A fresh clone need not have it.

## Suggested skills

- `build-web-apps:frontend-testing-debugging`: targeted rendered changes and desktop/phone QA.
- `documentation-writer`: maintain the clear separation between setup, reference and rationale.
- `document`: capture durable corrections where the next agent will find them.
- `handoff-mattpocock`: refresh this single current handoff at milestones.

Skills are optional environment capabilities, not repo dependencies. If absent, use the
checked-in commands and procedures. Do not install GSD or block on a missing skill.

## Reference artifacts (do not restate)

- [Documentation index](docs/README.md): topic ownership and complete context map.
- [Backlog](docs/BACKLOG.md): stable IDs, priority, request provenance and completion criteria.
- [Research](docs/research/README.md): Skylight, Fantastical, competing cards and archived evidence.
- [ADR 0001](docs/adr/0001-implementation-base.md): accepted source-pinned fork decision.
- [Calendar validation](docs/calendar-sync-validation.md): HA/Bridge relationship and evidence limits.
- [Configuration reference](README.en.md): public options; generic data only.
- [Personal repository](https://github.com/emilianomoran/moran-family-board-card/tree/feature/moran-foundation): working branch, not a release.
