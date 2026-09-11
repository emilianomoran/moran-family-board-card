# Testing Patterns

**Analysis Date:** 2026-09-11

## Test Framework

**Runner and assertions:**
- Vitest 1.6.x with its built-in `describe`, `it`, and `expect` APIs.
- No separate Vitest config; defaults apply through the `vitest run` package script.
- Current matchers include `toBe`, `toEqual`, `toHaveLength`, `toMatchObject`, and boolean assertions.

**Commands:**

```bash
npm test                         # Run all unit tests once
npm run test:watch              # Watch unit tests
npm run lint                    # TypeScript no-emit check
npm run format:check            # Verify source formatting
npm run build                   # Generate the release bundle
```

## Test File Organization

- Tests are collocated with source under `src/`.
- The current suite is `src/events.test.ts`, covering `src/events.ts`.
- Use `<module>.test.ts` for new domain modules.
- No separate fixtures directory, integration suite, or end-to-end test directory exists.

```text
src/
├── events.ts
└── events.test.ts
```

## Test Structure

- Group related behavior in top-level `describe` blocks such as `event routing` or `splitIntoSegments`.
- Name each `it` block as an observable behavior.
- Build small inline factories for repetitive typed data, such as the `seg` helper.
- Use deterministic local dates constructed inside the test instead of relying on the current clock.
- Assert behavior at the public function boundary rather than implementation details.

```typescript
describe("event routing", () => {
  it("uses the unmatched lane only when no normal lane claims an event", () => {
    const people = [
      { calendar: "calendar.family", match_title_prefixes: ["Person A:"] },
      { calendar: "calendar.family", unmatched: true },
    ];

    expect(routeEventToPeople("Household dinner", "calendar.family", people)).toEqual([1]);
  });
});
```

## Mocking

- Current unit tests do not mock modules or network calls because `src/events.ts` is DOM-free and pure.
- Continue testing pure calendar behavior without mocks.
- For component integration tests, mock only the Home Assistant boundary: `hass.states`, `callApi`, `callWS`, locale, and config.
- Never use a live Home Assistant token in automated tests.

## Fixtures

- Small test inputs belong inline in the test file.
- Shared visual fixtures belong in `dev/` and must use generic people, calendars, event titles, and locations.
- `dev/harness.html` is the current rendered smoke fixture and supplies a mocked `hass` object.
- Time-sensitive fixtures should set explicit dates or derive all values from one controlled reference date.

## Coverage

- No numeric coverage threshold is configured.
- CI requires the test command to pass but does not collect a coverage artifact.
- Current automated coverage is concentrated in event parsing, segmentation, overlap, drag math, and shared-calendar routing.
- UI rendering, editor behavior, Home Assistant API payloads, and keyboard interactions do not have automated coverage.

## Test Types

**Unit:**
- Implemented with Vitest for pure calendar-domain behavior.
- Runs in Node without a DOM.

**Component integration:**
- Not currently automated.
- The intended boundary is a constructed custom element plus a mocked Home Assistant object.

**Visual smoke:**
- `dev/harness.html` can be served locally and inspected in a real browser at target dimensions.
- Compare rendered output with `docs/concepts/moran-family-board-target-v1.png` and the current design spec.

**Live Home Assistant validation:**
- Not part of repository automation.
- Must happen on a dedicated test dashboard after repository checks, backup, and the Home Assistant workspace review protocol.

## Required Verification for Changes

1. Add or update unit tests for pure logic.
2. Run `npm run format:check`.
3. Run `npm run lint`.
4. Run `npm test`.
5. Run `npm run build` and confirm the committed bundle changes intentionally.
6. Run `git diff --check`.
7. For UI changes, render generic fixtures at 1920×1080 and a smaller tablet width.
8. For editor changes, verify configuration round-trips without dropping unrelated settings.

---

*Testing analysis: 2026-09-11*
*Update when test patterns change*
