# Home Assistant boundary and deployment handoff

Status: sanitized operations reference, 2026-09-21. Local development is self-contained;
live household access deliberately is not. No credentials or private backups belong here.

## Sources of truth

- This repo owns product decisions, backlog, implementation, tests and sanitized evidence.
- The originating machine's separate `~/workspaces/home-assistant` workspace owns live
  procedures. Start with its `AGENTS.md`, `docs/operating-manual.md`, `docs/entity-reference.md`,
  applicable `.claude/rules/`, then canonical `docs/family-board/README.md`.
- That workspace is documentation, not the HA runtime. The live `/config` share contains
  HA config/code. Never put agent instructions, research or project plans on that share.
- A different machine may lack that workspace. Continue synthetic repo work; obtain the
  authorized operations context before deploying. Do not reconstruct credentials from history.

## Pilot contract

The recorded pilot is admin-only and read-only. It uses two native CalDAV sources routed
to person lanes plus unmatched Household, a 60-second visible refresh, hours 0–24, no hour
trimming, initial scroll to now and a full-height wall card. These are pilot settings,
not changes to all package defaults. Real person/calendar IDs stay in the private workspace.

The deployed source/version and test evidence live in [STATUS](STATUS.md). The private
canonical doc owns exact host, resource ID, URL, checksum, dashboard result and rollback.
Re-read live state before treating any old record as current.

## Small, reversible deployment

1. Confirm scope and no competing writer to the same dashboard/resource. Test and commit
   the candidate locally. Do not infer calendar-write authority from permission to deploy UI.
2. Read the actual resource and preview dashboard through HA APIs. Back up the resource,
   served bundle and dashboard **result object**, not the WebSocket response envelope.
3. Compare live state to the expected baseline immediately before writing. A dashboard
   save replaces its config; preserve all unrelated fields and stop on unexplained drift.
4. Copy the built bundle to a new dated/versioned `www` filename using a temporary file,
   checksum and atomic rename. Keep the previous file for rollback.
5. Update only the intended module resource via WebSocket. Save the dashboard via its
   `url_path` only when the requested change actually needs config. Never edit `.storage`.
6. Re-read resource/config and served hash; verify other registrations stayed unchanged.
   Follow the private manual's Core validation requirement. Existing static resources do
   not normally require an HA restart; do not restart just to refresh a browser bundle.
7. Reload the actual HA client and verify its version banner, desktop/phone UI and affected
   interactions. Record unrelated HA errors separately; do not claim a globally clean console.
8. Update private deployment/rollback evidence and public sanitized STATUS. A committed or
   pushed bundle is not proof of live deployment. Other clients may still require reload.

No audio/notifications, test appointments, integration changes, new public endpoint or
host changes are needed for a calendar presentation update. Honor all private workspace
safety rules if a broader task is explicitly authorized.

## Calendar Bridge and sync evidence

[Calendar sync validation](calendar-sync-validation.md) owns the sanitized findings and
repeatable read-only audit. Bridge reads the Mac's EventKit store; HA reads its own native
CalDAV range API. Bridge is not feeding this grid. Entity-state `last_updated` is not the
last successful range-read timestamp. Do not promise instant updates or a fixed 15-minute delay.

Physical HA-app lock/reopen is accepted by user report. Exact edit/cancellation latency was
waived and remains unknown. Do not create/delete a real event merely to test synchronization.

## Publication

Milestone pushes go to the personal working branch. [HACS_STORE](HACS_STORE.md) describes a
separate release/install procedure, not authority to run it. Keep upstream license/NOTICE,
distinct custom element/bundle names and legacy compatibility. No default-store submission,
main merge, tag or release is implied by ordinary development or deployment.
