# Calendar sync validation

Status: read-only source comparison and routing audit reverified 2026-09-20.
Real edit-to-screen latency and physical iPhone sleep/wake remain unmeasured.

## What the card reads

The deployed pilot uses HA's native CalDAV integration. Calendar Bridge reads the Mac's
EventKit store; it is a comparison source, not a server dependency of this card. These are
two paths to the managed calendars, not Bridge forwarding its local cache into HA.

| Layer | Behavior and evidence |
|---|---|
| Calendar provider → HA range API | In HA 2026.9.2, `CalendarEventView.get` calls the calendar entity's `async_get_events`; CalDAV's range method calls `calendar.search`. It does not return the coordinator's cached next-event property. |
| HA range API → visible card | The pilot requests its active date range every 60 seconds while visible. Wake/focus/reconnect also requests data. A successful request still cannot prove the provider has received an edit from another device. |
| HA entity state/attributes | The CalDAV coordinator updates the current/next entity summary roughly every 15 minutes. This is not the same read path used by our calendar grid or Status tiles. An old entity `last_updated` is not a last-successful-calendar-query timestamp. |

Sources: [HA CalDAV documentation](https://www.home-assistant.io/integrations/caldav/),
[HA 2026.9.2 calendar HTTP view](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/calendar/__init__.py#L732),
[CalDAV range delegation](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/caldav/calendar.py#L197),
and [CalDAV range query versus coordinator update](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/caldav/coordinator.py#L20).
Card implementation: [calendar-source.ts](../src/calendar-source.ts) and `_pollCalendars`,
`_onVisible`, and `_fetchEvents` in [ha-family-board-card.ts](../src/ha-family-board-card.ts).

Do not promise either instant updates or a fixed 15-minute delay. Provider publication,
device synchronization, browser suspension, network time, and the card poll all matter.
The 20-second card read timeout bounds a stalled request, not end-to-end synchronization.

## 2026-09-20 read-only follow-up

At 19:15 CDT, fresh reads on HA 2026.9.3 and the installed `moran.8` build again matched
**166 of 166 occurrences** over September 14–October 25 (October 26 exclusive).
The actual current parser/routing/deduplication retained **175 intended person copies**,
with zero rejected or unrouted records. Both configured CalDAV sources were loaded and
available, both systems used America/Chicago, and the served r8 checksum matched the
deployment record. Read-only mode, the 60-second interval, and hours 0–24 were unchanged.

Counts remain 111 + 55, with 162 identity matches and four unique exact-content matches
for detached-ID differences. Compared title/time/all-day/description/location fields agree.
One calendar's normalized content fingerprint changed since September 17 in both paths,
and the two paths now agree; the other fingerprint is unchanged. This is evidence that
real source content changed and is reflected in both systems, not just repeated fixture
data. Aggregate hashes do not identify the edit, distinguish cancellation from replacement,
or establish its save time, so **edit/cancellation latency remains unmeasured**.

Two snapshots at 19:15 and 19:16 CDT agreed. HA read durations were 1.85–2.99 seconds,
not synchronization latency. The diagnostic
used GET/read operations only; no actual appointments or deployment settings changed.
Private fingerprints and timing stay in the HA workspace. The source-code explanation
above remains pinned to the previously inspected HA 2026.9.2 implementation; this follow-up
verifies live API behavior on 2026.9.3, not a new line-by-line HA source audit.

## 2026-09-17 read-only results (historical)

The audit read both configured calendars for September 14 through October 25 inclusive
(October 26 exclusive), with explicit America/Chicago offsets. Both integrations were
loaded and both entities available. The HA asset still matched the deployed `moran.4` build.

- **166 source occurrences matched**: 111 in one managed calendar, 55 in the other.
- 162 matched by UID plus start/all-day identity. Four detached-ID differences matched
  by unique exact title, start, end, all-day status, description, and location.
- No missing/extra occurrences or differing compared fields. Duplicate ambiguous keys do
  not pass by arbitrary pairing; normalization self-checks exercise that failure mode.
- 35 all-day occurrences and 56 HA recurrence IDs were included. EventKit's local
  23:59:59 all-day end was converted to the next exclusive calendar date. Date arithmetic
  and offset validation are tested separately, including the DST transition.
- The app's actual parsing/routing/deduplication functions, with freshly read pilot config,
  retained **175 person copies for all 166 source occurrences**. Nine shared appointments
  account for the extra copies. Zero rejected copies and zero unrouted occurrences.
- Two comparisons, about two minutes apart, agreed. HA request durations were 1.87–5.20
  seconds; these are request durations, not edit-propagation measurements.
- The equivalent previous six-week audit recorded 144 occurrences. The net count is now
  22 higher and both sources agree, but aggregate counts do not identify individual creates,
  changes, or cancellations and do not establish when those changes propagated.

No appointments, integration settings, dashboards, or deployed files were changed. This was
an API/domain-logic audit, not a new rendered UI test. The application remains `moran.4`.
Private scripts and timestamped comparison results stay in the HA operations workspace;
the public repo contains only sanitized outcomes and this repeatable procedure.

The running Bridge did not expose stable calendar IDs. The audit required one exact title
and iCloud-source match per calendar; it never guessed between calendars with similar names.
Do not infer a particular permission failure from missing optional Bridge metadata alone.

## Measuring a real change without inventing one

This is a procedure, not a scheduled monitor or permission to create a test appointment.

1. Use an ordinary edit the user actually intends to make. Before it, capture the targeted
   source occurrence and HA range privately. Record the calendar identity, recurrence
   identity, range, timezone, and baseline timestamp. Do not use title alone as an ID.
2. Record the user's confirmed save time. Observe provider/Bridge and HA reads without
   changing data. For each read retain request start/end, outcome, and a privacy-safe
   fingerprint. Bound polling to the agreed observation window and current cadence.
3. Record the first changed HA response and first changed rendered card. Report separate
   save-to-HA and HA-to-screen observations; polling gives an interval, not an exact server
   arrival time. If the original save time is unknown, do not manufacture a latency figure.
4. For an intended cancellation, verify removal of the targeted occurrence and retention of
   neighboring recurring occurrences and shared-person copies. A missing occurrence from a
   shifted query range is not cancellation evidence. Do not delete an event merely to test.

If nothing changes during a bounded observation, report that there was no qualifying change;
that is neither proof of a broken sync nor a passed propagation test. A Bridge change feed
without verified metadata access is not reliable evidence that no edits occurred.

## Physical iPhone check

Use the real HA dashboard on the intended phone/browser, not the fixed-date local harness.
Verify initial loading, note the selected view/filters, then background and lock the phone.
After unlocking, check that the actual date/time and calendars recover, prior UI preferences
remain sensible, and incomplete data never displays Free now. Include one ordinary network
change if appropriate. Record device, iOS/browser version, suspend duration, and outcome.

An iOS simulator or a phone-width desktop viewport cannot certify physical sleep/wake.
Failure here should be reproduced and fixed; pending device evidence is not a GSD gate for
unrelated development. No notification, account change, or new public endpoint is needed.
