# Architecture

**Analysis Date:** 2026-09-11

## Pattern Overview

**Overall:** A Home Assistant-native Lit Web Component with a pure event-domain module and an independent configuration editor.

**Key characteristics:**
- A single distributed ES module registers both the card and its editor.
- Home Assistant supplies state, authentication, locale, API access, and theme tokens.
- Calendar computations are partially isolated from DOM code for deterministic unit testing.
- All rendered views and most orchestration currently live in one card class.
- The card has no database or server process of its own.

## Layers

**Home Assistant adapter and card shell:**
- Location: `src/ha-family-board-card.ts`.
- Purpose: configuration validation, lifecycle, API calls, capability detection, state management, interactions, view rendering, dialogs, and styles.
- Depends on: Lit, `custom-card-helpers`, `src/events.ts`, and `src/localize.ts`.
- Used by: Home Assistant dashboards and `dev/harness.html`.

**Event domain:**
- Location: `src/events.ts`.
- Purpose: shared-calendar routing, title normalization, raw event parsing, day segmentation, drag-time calculation, and overlap layout.
- Depends on: JavaScript date and collection primitives only.
- Used by: the card renderer and `src/events.test.ts`.

**Localization:**
- Locations: `src/localize.ts` and `src/editor-i18n.ts`.
- Purpose: English/German labels plus locale-aware time, weekday, countdown, and week-range formatting.
- Depends on: browser `Intl` and Home Assistant locale preferences.
- Used by: the card and editor.

**Visual editor:**
- Location: `src/editor.ts`.
- Purpose: graphical configuration, auto-detection, presets, person/calendar metadata, and `config-changed` events.
- Depends on: Lit, Home Assistant form elements, editor translations, and exported card types/helpers.
- Used by: Home Assistant's Lovelace card editor.

**Build and distribution:**
- Locations: `rollup.config.js`, `hacs.json`, `.github/workflows/`, and `dist/`.
- Purpose: typecheck, test, bundle, validate, and release one HACS-compatible module.

## Data Flow

**Calendar read and render:**

1. Home Assistant creates the custom element and calls `setConfig`.
2. Home Assistant assigns the current `hass` object.
3. The card computes a view date range and unique configured calendar set.
4. `_fetchEvents` requests each available calendar once through `hass.callApi`.
5. `routeEventToPeople` maps each source event to zero, one, or multiple lanes.
6. `parseRawEvent` and segmentation helpers create view-ready events.
7. The selected day, timeline, week, month, or agenda renderer produces Lit templates.
8. Home Assistant state updates and timers cause reactive re-rendering or refetching.

**Calendar mutation:**

1. A user opens or creates an event through the card dialog or day-grid interaction.
2. The card checks the calendar's advertised feature bits.
3. Input is validated and converted to Home Assistant's calendar event payload.
4. The card sends the appropriate WebSocket calendar command.
5. On success, the fetch key is cleared and the visible range is reloaded.
6. On failure, the dialog remains open with an inline error.

**Editor update:**

1. The editor receives the current Lovelace configuration and `hass` object.
2. Home Assistant form controls emit a changed value.
3. The editor normalizes empty arrays, booleans, single-calendar arrays, and metadata.
4. The editor dispatches `config-changed`; Home Assistant persists the updated card config.

## State Management

- Persistent settings live in Home Assistant Lovelace configuration.
- Reactive runtime state uses Lit `@state` properties in `FamilyBoardCard` and `FamilyBoardCardEditor`.
- Raw events, fetch keys, timer handles, and drag geometry use private instance fields.
- No global application state exists beyond custom-element registration and `window.customCards` metadata.

## Key Abstractions

**`FamilyBoardConfig`:**
- The public configuration contract for views, layout, filtering, display, calendars, and people.
- Defined in `src/ha-family-board-card.ts` and consumed by the card/editor.

**`PersonConfig` / `EventRouteConfig`:**
- Represent a visual lane and its calendar/routing rules.
- Defined in `src/ha-family-board-card.ts` and `src/events.ts`.

**`RawEvent`, `BoardEvent`, `LaidOutEvent`:**
- Successive representations for source occurrences, per-day display segments, and overlap geometry.
- Defined in `src/events.ts`.

**View renderers:**
- `_renderDay`, `_renderTimeline`, `_renderWeek`, `_renderMonth`, and `_renderAgenda` are private methods on the card class.
- They share normalized event state but own view-specific grouping and markup.

## Entry Points

- `src/ha-family-board-card.ts` — Rollup entry, card registration, card-picker metadata, and lazy editor import.
- `src/editor.ts` — editor registration, bundled through the dynamic import.
- `dev/harness.html` — browser-only development fixture with a small mocked `hass` contract.
- `dist/moran-family-board-card.js` — generated production entry loaded by Home Assistant/HACS.

## Error Handling

- `setConfig` throws for invalid card configuration so Home Assistant can display an error card.
- Calendar reads catch per-calendar failures; a total failure produces a card-level load error.
- Mutations catch failures and present inline dialog errors.
- Invalid user regex patterns return a non-match rather than breaking the board.
- Optional weather failures clear forecast state without taking down calendar rendering.

## Cross-Cutting Concerns

**Accessibility:**
- Interactive events, person headers, navigation controls, and dialogs use focus/keyboard handlers and labels within `src/ha-family-board-card.ts`.

**Localization:**
- Never hard-code user-facing card strings when an existing key belongs in `src/localize.ts` or `src/editor-i18n.ts`.

**Theming:**
- Use Home Assistant CSS variables with safe fallbacks; keep person identity visible in text rather than color alone.

**Security:**
- Treat the browser bundle as public. Use only the authenticated `hass` object for Home Assistant operations, and never embed external credentials.

---

*Architecture analysis: 2026-09-11*
*Update when major patterns change*
