# Project documentation

This repository owns the Family Board product record: decisions, discussion outcomes,
requirements, known behavior, implementation, and tests. Updated 2026-09-21.

## Start here

- [Decisions and discussion record](DECISIONS.md): what we agreed to, why, alternatives,
  and proposals that have not been accepted.
- [Current status and next work](STATUS.md): what is implemented, what was verified,
  known issues, and what remains open.
- [Implementation-base ADR](adr/0001-implementation-base.md): source-pinned rationale for
  continuing this Home Assistant Lit fork.
- [Configuration reference](../README.en.md): supported options and generic examples.
- [Calendar sync validation](calendar-sync-validation.md): verified read path, source/routing
  audit, and how to measure real edit propagation and physical phone recovery safely.

## Historical material

- [Original fork plan](MORAN_FORK_PLAN.md) and [visual concept](MORAN_DESIGN_SPEC.md)
  preserve earlier exploration. They do not override current calendar-first scope.
- [Research](../.planning/research/SUMMARY.md) records the 2026-09-11 evaluation of
  Skylight, Calendar Card Pro, Week Planner Card, and other calendar cards.
- [Foundation discussion](../.planning/phases/01-prove-the-foundation/01-DISCUSSION-LOG.md)
  and [acceptance record](../.planning/phases/01-prove-the-foundation/01-UAT.md) preserve
  the initial implementation-base and avatar review.
- `.planning/` is a historical archive. GSD was retired on 2026-09-15; its phase status,
  reviewer requirements, and execution gates are not current instructions.

## Recording future conversations

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

Documentation does not add a planning gate or require a separate approval round. Record
local commits separately from pushes and published releases; a local checkpoint is not a
GitHub/HACS release.
