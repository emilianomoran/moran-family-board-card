# External Integrations

**Analysis Date:** 2026-09-11

## Home Assistant Frontend

**Runtime contract:**
- Home Assistant instantiates `moran-family-board-card` from `src/ha-family-board-card.ts` and supplies a live `hass` object.
- The card reads entity state from `hass.states`, locale from `hass.locale`, unit preferences from `hass.config`, and dashboard theme variables through CSS custom properties.
- The visual editor is registered as `moran-family-board-card-editor` in `src/editor.ts`.

**Entity domains:**
- `calendar.*` — event sources, writable-feature detection, create/update/delete operations.
- `person.*` — display names, avatars, and presence labels.
- `weather.*` — optional daily forecast chips.
- Arbitrary entity IDs — optional per-person badges and more-info dialogs.

## Home Assistant APIs

**REST:**
- `hass.callApi("GET", "calendars/{entity_id}?start=...&end=...")` fetches events in `src/ha-family-board-card.ts`.
- Authentication is inherited from the active Home Assistant frontend session; this project stores no access token.

**WebSocket:**
- `weather/get_forecasts` is called through Home Assistant's `call_service` WebSocket command.
- `calendar/event/create`, `calendar/event/update`, and `calendar/event/delete` perform supported mutations.
- Entity details use the standard `hass-more-info` frontend event rather than a custom API.

**Capability negotiation:**
- Calendar supported-feature bits are read before enabling create, update, delete, drag, or resize controls.
- Unsupported operations stay read-only; the UI must not assume every calendar is fully writable.

## HACS and GitHub

**HACS:**
- `hacs.json` identifies the repository as a dashboard plugin and names `moran-family-board-card.js`.
- `.github/workflows/validate.yml` runs `hacs/action@main` on pushes, pull requests, nightly schedule, and manual dispatch.

**GitHub Actions:**
- `.github/workflows/ci.yml` runs install, typecheck, formatting, unit tests, and build.
- `.github/workflows/release.yml` attaches the built module to a published release.
- Dependabot configuration lives at `.github/dependabot.yml`.

## Calendar Bridge

**Current integration:**
- Not integrated. The card communicates only with Home Assistant.
- Calendar Bridge is documented as planned follow-up work in `docs/MORAN_FORK_PLAN.md`.

**Security boundary:**
- No Calendar Bridge URL, credential, or Home Assistant token belongs in Lovelace configuration or the public browser bundle.
- A future provider must use an authenticated server-side Home Assistant adapter and preserve occurrence identity and audit metadata.

## Data Storage

**Persistent application database:**
- None.

**Browser state:**
- View, date offsets, dialog state, temporary person visibility, fetched events, weather, and timers live in the Lit component instance.
- User configuration is persisted by Home Assistant's dashboard system, outside this repository.

**Caching:**
- In-memory fetch keys suppress duplicate calendar and weather requests inside one component instance.
- There is no service worker, localStorage cache, or offline persistence.

## Authentication and Secrets

- Home Assistant owns authentication and authorization.
- No environment variables are required to build or test this package.
- No `.env` files are present or expected.
- Household entity IDs and credentials must remain in private Home Assistant configuration, not this public repository.

## Monitoring and Logging

- Browser console receives one version banner from `src/ha-family-board-card.ts`.
- Fetch failures render an in-card error state; there is no external error tracking.
- CI status and HACS validation are the repository-level observability mechanisms.

---

*Integration audit: 2026-09-11*
*Update when adding or removing external services*
