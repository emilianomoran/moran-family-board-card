# Requirements: Moran Family Board Card

**Defined:** 2026-09-11
**Core Value:** At a glance, every family member can reliably understand who is doing what and when.

## User Stories

- As a family member passing the wall display, I can identify today's commitments, ownership, and next action in a few seconds.
- As a parent planning ahead, I can move between day, timeline, week, month, and agenda views without relearning the interface.
- As a household member using a shared calendar, I can filter by person while joint and unmatched events remain understandable.
- As a touchscreen user, I can navigate and inspect events without a mouse, tiny targets, or hover-only controls.
- As the Home Assistant administrator, I can configure and test the card without publishing household data or risking the live dashboard.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: The project records a source-level go/pivot decision comparing this fork with `tienou/family-calendar-card` across target features, shared-calendar routing, API use, tests, maintenance, license, and migration cost.
- [ ] **FOUND-02**: A user can enable the new experience with an explicit wall-layout configuration while an existing configuration without that option renders with unchanged defaults and behavior.
- [ ] **FOUND-03**: The card and visual editor use one shared configuration type/default source for every setting introduced or changed by v1.

### Calendar Data

- [ ] **DATA-01**: The card requests each configured calendar no more than once for the same visible range and refresh cycle, then exposes success or failure per calendar.
- [ ] **DATA-02**: An event from a shared calendar can appear in one person lane, multiple matching person lanes, or an explicit shared/unmatched lane according to configuration.
- [ ] **DATA-03**: All-day, cross-midnight, multi-day, overlapping, and timezone-sensitive events render on the correct local dates and times in every applicable view.

### Calendar Experience

- [ ] **CAL-01**: At 1920x1080 landscape, wall mode fills the available panel with a legible header, navigation, and calendar canvas without nested-card visual clutter.
- [ ] **CAL-02**: Day view displays a shared time axis, visible person identity, timed and all-day events, and a current-time marker when today is visible.
- [ ] **CAL-03**: Timeline, week, month, and agenda views remain available and use the same event identity, filters, navigation language, and visual hierarchy as day view.
- [ ] **CAL-04**: A user can switch between Everyone and individual person filters, and joint/shared events retain explicit ownership in every view.
- [ ] **CAL-05**: The board displays current and next relevant activity per visible person, including time or countdown, without obscuring the calendar.
- [ ] **CAL-06**: Dense overlaps remain readable through bounded columns or an accessible overflow path instead of shrinking events below the minimum legible size.
- [ ] **CAL-07**: The wall header shows current date and time and can show configured Home Assistant weather; missing weather never blocks the calendar.

### Interaction

- [ ] **INT-01**: A user can move backward/forward, return to today, and switch enabled views with consistent touch and keyboard controls.
- [ ] **INT-02**: Selecting an event opens a detail surface that preserves title, person/calendar identity, local time, all-day status, description, and location when provided.
- [ ] **INT-03**: Create, update, and delete controls appear only when the selected calendar and event support that operation; recurring-event scope is explicit before a destructive action.

### Responsive Behavior

- [ ] **RSP-01**: At supported tablet landscape widths, the primary calendar remains usable with reduced secondary density and no clipped primary controls.
- [ ] **RSP-02**: In portrait/mobile conditions, the card provides a readable agenda-first experience with reachable navigation and event details.

### Accessibility

- [ ] **ACC-01**: Every primary wall interaction has at least a 48px touch target and no required hover-only action.
- [ ] **ACC-02**: View switches, person filters, date navigation, events, dialogs, and error recovery are reachable and understandable by keyboard and semantic accessibility APIs.
- [ ] **ACC-03**: Person and event meaning never relies on color alone, and nonessential animation is disabled when reduced motion is requested.

### Reliability and Compatibility

- [ ] **REL-01**: The card visibly distinguishes loading, truly empty, unsupported, and failed calendar states and offers a retry path after recoverable failure.
- [ ] **REL-02**: When some calendars fail after a successful load, available calendars remain visible and any retained data is labeled stale with its last-success time.
- [ ] **REL-03**: The Moran card can coexist with the upstream card, and pre-wall Moran configurations continue to render after the v1 upgrade.

### Quality and Privacy

- [ ] **QA-01**: Unit tests cover date normalization, routing, filtering, now/next, overlap, capability, and error-state selectors using deterministic time.
- [ ] **QA-02**: Automated browser checks exercise the editor and representative wall, tablet, and portrait scenarios, with reviewed screenshots for visual regressions.
- [ ] **QA-03**: Source, fixtures, documentation, logs, and generated test artifacts pass a scan for credentials and household-specific names, entity IDs, addresses, and schedule data.

### Distribution and Pilot

- [ ] **DIST-01**: A versioned HACS-compatible release artifact installs as `moran-family-board-card`, passes repository CI/validation, and includes configuration, upgrade, cache, and rollback guidance.
- [ ] **DIST-02**: A reversible test-dashboard pilot is documented and verified only after the required live-state recheck, targeted backup, two independent Sonnet plan reviews, and post-deployment checks; any review substitution requires Emiliano's explicit approval.

## Acceptance Criteria

- A generic “busy weekday” fixture lets a reviewer identify every visible person's current and next activity without opening an event.
- The same fixture renders without critical clipping at 1920x1080 wall, tablet landscape, and portrait agenda viewports.
- Empty, partial failure, total failure, stale, read-only, and writable fixtures are visibly distinct and covered by automated checks.
- Existing configuration examples still render without adding `layout: wall`.
- No real household identifier or credential exists in committed source, documentation, fixtures, screenshots, or logs.
- All repository checks pass and the generated distribution artifact matches its source before a release candidate is eligible for the Home Assistant pilot.

## v2 Requirements

### Calendar Bridge and Logistics

- **BRIDGE-01**: The card can use advanced Apple Calendar mutation through an authenticated Home Assistant-side Calendar Bridge adapter without a browser-held Bridge credential.
- **BRIDGE-02**: Update and delete operations preserve stable `(seriesId, occurrenceDate)` identity and clearly distinguish one occurrence from the series or future occurrences.
- **LOG-01**: Events can display driver, pickup, departure, attendee, assignment, and conflict annotations keyed to stable event-occurrence identity.

### Household Operations

- **TODO-01**: A user can view and complete configured Home Assistant `todo.*` items in a secondary module.
- **LIST-01**: A user can view and update a configured shopping list without reducing the calendar's primary scan area.
- **MEAL-01**: A user can see the current/next meal from an explicit entity or calendar source.

### Advanced Input

- **IMPORT-01**: A user can preview and confirm events parsed from documents, images, or natural language before any calendar write.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Standalone React application | Duplicates Home Assistant authentication, hosting, calendar, theme, and state integration without improving the v1 calendar workflow. |
| Separate event database | Creates a second source of truth and synchronization failures. |
| Direct browser-to-Calendar-Bridge networking | Violates the intended local/security boundary and complicates wall-device deployment. |
| Meals, lists, chores, rewards, and photos in v1 | Nice-to-have functionality would delay validation of the calendar's core value. |
| Calendar-provider migration | The project presents and safely interacts with existing calendars; it does not replace them. |
| Household-specific defaults in public code | The repository must be reusable and safe to publish. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 2 | Pending |
| CAL-01 | Phase 2 | Pending |
| CAL-02 | Phase 2 | Pending |
| CAL-03 | Phase 3 | Pending |
| CAL-04 | Phase 2 | Pending |
| CAL-05 | Phase 2 | Pending |
| CAL-06 | Phase 2 | Pending |
| CAL-07 | Phase 3 | Pending |
| INT-01 | Phase 3 | Pending |
| INT-02 | Phase 4 | Pending |
| INT-03 | Phase 4 | Pending |
| RSP-01 | Phase 3 | Pending |
| RSP-02 | Phase 3 | Pending |
| ACC-01 | Phase 4 | Pending |
| ACC-02 | Phase 4 | Pending |
| ACC-03 | Phase 4 | Pending |
| REL-01 | Phase 4 | Pending |
| REL-02 | Phase 4 | Pending |
| REL-03 | Phase 4 | Pending |
| QA-01 | Phase 5 | Pending |
| QA-02 | Phase 5 | Pending |
| QA-03 | Phase 5 | Pending |
| DIST-01 | Phase 5 | Pending |
| DIST-02 | Phase 5 | Pending |

**Coverage:**

- v1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-11*
*Last updated: 2026-09-11 after initial GSD definition*
