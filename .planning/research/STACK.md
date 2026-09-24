# Stack Research

> Historical snapshot from 2026-09-11. Start with the [current reference](../../docs/research/README.md).
> Phase gates, missing-feature lists and dependency counts below are not current instructions.

**Domain:** Home Assistant family wall-calendar custom card
**Researched:** 2026-09-11
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| TypeScript | `^5.3` initially | Typed card, editor, models, and adapters | Already established in the fork; strict compilation catches config and event-shape errors before deployment. |
| Lit | `^3.1` | Web-component rendering and reactive state | Fits Home Assistant custom-card conventions and the existing source; changing frameworks adds risk without user value. |
| Home Assistant frontend APIs | Current supported HA release | Calendar data, services, themes, locale, weather, and entity capabilities | Keeps credentials in Home Assistant and lets the board behave as a native dashboard surface. |
| Rollup | `^4.9` | Produce a self-contained ES module for HACS | Matches the repository's working distribution model. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `custom-card-helpers` | `^1.9` | Shared Home Assistant frontend types and helpers | Continue for current card/editor integration; reassess only when upgrading the dependency baseline. |
| Vitest | Current compatible major after audit remediation | Pure logic and component-level tests | Keep existing event tests and add DOM-level tests once components are extracted. |
| Playwright | Add during verification phase | Browser interaction and screenshot testing | Use for wall, tablet, and portrait fixtures after wall mode has a stable visual contract. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Prettier | Deterministic TypeScript formatting | Existing CI checks `src/**/*.ts`; expand only when planning files need automated formatting. |
| TypeScript `tsc --noEmit` | Static validation | Existing `npm run lint` command. |
| GitHub Actions | Typecheck, tests, build, HACS validation, and visual artifacts | Pin or intentionally review action upgrades. |
| Generic browser harness | Fast rendering outside a live household | Must never contain real family data or credentials. |

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Extend this Lit custom card | Standalone React app | Only if Home Assistant dashboard constraints make the primary calendar workflow impossible after a measured prototype. |
| Current fork as the working base | `tienou/family-calendar-card` | Pivot only if Phase 1 proves it satisfies shared-calendar person routing, compatibility, maintainability, and the target views at lower total cost. |
| Internal component extraction | Full rewrite | Use a rewrite only after behavior is captured by tests and incremental seams cannot support the wall shell. |
| Home Assistant calendar APIs | Direct Calendar Bridge browser calls | Never for the browser; use Bridge only through a future authenticated server-side/Home Assistant adapter. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| A second application database | Creates split-brain event ownership and reconciliation work | External calendars through Home Assistant. |
| Long-lived access tokens in Lovelace YAML | Dashboard config is browser-visible and easily copied | Authenticated Home Assistant APIs and server-side adapters. |
| Card-mod as the primary layout system | Fragile selectors make upgrades unpredictable | Owned component CSS and documented custom properties. |
| A new global state framework | The card is a bounded surface; extra state machinery adds bundle and conceptual cost | Lit reactive state plus pure derived selectors. |

## Stack Patterns by Variant

**If rendering inside a Lovelace dashboard:**
- Use a custom element and Lit.
- Read state and locale through the Home Assistant context.
- Treat wall mode as configuration, not a separate application.

**If advanced Calendar Bridge mutation enters scope:**
- Add a Home Assistant-side adapter with an authenticated API boundary.
- Keep event identity and recurrence decisions outside render components.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Lit 3 | ES2021 custom-element bundle | Already builds in the repository. |
| TypeScript 5.3+ | Rollup TypeScript plugin 11 | Existing CI passes; upgrade as a separate dependency task. |
| Home Assistant calendar mutation | Per-entity `supported_features` | Create/update/delete support varies by integration and must be capability-gated at runtime. |
| Home Assistant calendar subscriptions | Current calendar entity WebSocket API | Prototype before replacing polling; mutation listeners depend on integration behavior. |

## Sources

- [Home Assistant custom-card documentation](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/) — custom elements, configuration, data context, and visual editor contracts.
- [Home Assistant Calendar integration](https://www.home-assistant.io/integrations/calendar/) — calendar entities, viewing, actions, and intended role.
- [Home Assistant Calendar entity developer documentation](https://developers.home-assistant.io/docs/core/entity/calendar/) — feature flags, recurrence, range semantics, and event subscriptions.
- Repository `package.json`, Rollup, TypeScript, tests, and CI configuration — verified current stack.

---
*Stack research for: Moran Family Board Card*
*Researched: 2026-09-11*
