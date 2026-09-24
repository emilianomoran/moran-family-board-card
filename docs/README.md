# Project documentation

This repository owns the Moran Calendar product record. A fresh agent should not need
the original conversation or the private HA workspace to understand or develop it.
Updated 2026-09-23. Private access/configuration remains outside this repo by design.

## Start here

1. [HANDOFF](../HANDOFF.md): current branch/checkpoint, resume order and important limits.
2. [AGENTS](../AGENTS.md): persistent rules for any contributing agent.
3. [Product brief](PRODUCT.md): scope, accepted requirements and what not to build yet.
4. [Backlog](BACKLOG.md): stable feature IDs, provenance, priorities and acceptance criteria.
5. [Development](DEVELOPMENT.md): run the preview, test and verify a change without HA access.

## Topic owners

| Topic | Canonical reference |
|---|---|
| User decisions, corrections and conversation outcomes | [DECISIONS](DECISIONS.md) |
| Implemented/deployed state and verification evidence | [STATUS](STATUS.md) |
| Code map, runtime flow and invariants | [ARCHITECTURE](ARCHITECTURE.md) |
| Why this fork instead of another card or React | [ADR 0001](adr/0001-implementation-base.md) |
| Skylight, Fantastical and alternative-card findings | [Research](research/README.md) |
| Source parity, routing and provider-latency limits | [Calendar validation](calendar-sync-validation.md) |
| Private HA boundary, safe deployment and rollback | [OPERATIONS](OPERATIONS.md) |
| Supported configuration and generic examples | [English reference](../README.en.md), [German reference](../README.md) |
| Distribution and attribution | [HACS](HACS_STORE.md), [upstream notice](../NOTICE.md) |

## Conversation coverage

- D01–D04: Skylight-inspired scope, dedicated HA fork, read path and architecture choice.
- D05–D08: no GSD gates, responsive presentation, Fantastical navigation and full-day pilot.
- D09–D13: Status tiles, durable records, daily use, view capsule and pilot delivery.
- D14–D18: details, recovery, waived timing test, cross-view continuity and readability.
- D19–D23: future zoom, compact chrome, title/clock, milestone pushes and this handoff.
- D24: full-height Timeline; continue in the existing calendar repository.
- D25–D26: Timeline initial/Today centering and centered text within left-aligned date groups.
- D27–D28: first Day density-slider slice and deterministic DST test-runner timezone.
- D29: independent Timeline zoom, anchored time/rows and contained midnight labels.
- D30: browser-local saved zoom, opt-out, migration, per-view Reset and default invalidation.
- D31: Week list density, fixed headings/target floors, date-row anchoring and independent saved scale.
- D32: reachable Month overflow, expandable date cards, restricted-view fallback and keyboard/touch access.
- D33: manual keyboard view/date navigation, labeled panels, focus/selection separation and existing-browser-access clarification.
- D34: Day overlap fallback without Agenda, current-data person/day list, details return path and modal focus.
- D35: Agenda selected-date reveal, explicit Today/week navigation and manual-scroll preservation.
- D36: Week selected-date reveal, row-top date labels and shared navigation/density anchoring.
- D37: Month Today reveals the current date/column without resetting ordinary browsing.
- D38: Chrome verification and visible, row-bounded Timeline identity for dense overlaps.

These entries preserve decisions and corrections, not raw private transcripts. Their
dates and evidence distinguish user acceptance from an agent's proposed next step.

## Historical material

- [Original fork plan](MORAN_FORK_PLAN.md) and [visual concept](MORAN_DESIGN_SPEC.md)
  preserve earlier exploration. They do not override current calendar-first scope.
- [Research index](research/README.md) links the original evaluation and identifies
  findings that were superseded or remain unverified.
- [Foundation discussion](../.planning/phases/01-prove-the-foundation/01-DISCUSSION-LOG.md)
  and [acceptance record](../.planning/phases/01-prove-the-foundation/01-UAT.md) preserve
  the initial implementation-base and avatar review.
- [`.planning/`](../.planning/README.md) is a historical archive. GSD was retired on 2026-09-15; its phase status,
  reviewer requirements, and execution gates are not current instructions.

## Maintaining the record

After a material product discussion, update the relevant decision entry and current status
in this repo during the same work session. Record the date, user request, decision or
recommendation, rationale, implementation state, and evidence or remaining question.
Questions and suggestions are not implementation approval. Supersede changed decisions
explicitly so their rationale remains traceable.

Capture the substance of conversations, not raw transcripts. Keep examples generic and omit
private appointment content, household entity IDs, credentials, private screenshots, and
deployment backups. The private Home Assistant workspace owns access procedures, exact live
configuration, backup paths, and operational rollback. Summarize deployment outcomes here
without duplicating sensitive operational records.

Keep one root handoff and one current backlog. Link the topic owner instead of copying
large summaries between files. Documentation does not add an approval gate. Record local
commits, verified pushes, HA deployments and published releases as separate states.
