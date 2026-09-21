# Develop and verify the calendar

Status: current how-to, 2026-09-21. Audience: a developer or agent with a fresh clone,
no chat history and no Home Assistant credentials. Read [AGENTS](../AGENTS.md) first.

## Start the synthetic prototype

1. Use the personal repository and current working branch:

   ```bash
   git clone https://github.com/emilianomoran/moran-family-board-card.git
   cd moran-family-board-card
   git switch feature/moran-foundation
   git status --short
   npm ci
   npm run build
   ```

2. From the repository root, serve it on loopback only. With Python 3 installed:

   ```bash
   python3 -m http.server 4173 --bind 127.0.0.1
   ```

   Keep the process running while reviewing. If 4173 is occupied, inspect the listener
   and reuse the existing repo server or choose another port. Do not kill an unknown process.

3. Open [the wall fixture](http://127.0.0.1:4173/dev/harness.html?scenario=wall&daily=1&status=1&long-title=1).
   For comparison, use `?scenario=legacy`; add `&theme=dark` to inspect dark styling.
   The normal wall preview uses the Moran Calendar title; test cases retain generic stress titles.

4. After source edits, rebuild and reload. The fixture imports **dist**, not live TypeScript.
   `npm run watch` rebuilds continuously but does not run a web server or reload the browser.

The fixture clock is intentionally fixed at `2026-02-18T15:32:00-06:00`; people/events are
synthetic. This proves UI behavior, not live sync. The `daily=1` fixture enables full-day,
read-only daily-use settings. `status=1` makes the Status disclosure available; it still
starts collapsed. No token or private config is needed.

## Runtime requirements and checks

CI uses Node 20 for types/unit/build. Use **Node 22+ for the browser harness**, which uses
native `WebSocket`, plus an installed Chromium/Chrome. The last local verification used
Node 25.6.1 on macOS; do not treat that as a hard pin. `CHROME_BIN` overrides auto-detection.

```bash
npm run format:check
npm run lint
npm test
npm run build
npm run test:harness
git diff --check
```

`lint` is TypeScript checking. `format:check` currently covers `src/**/*.ts`; it is not a
Markdown checker. The compiled-browser runner starts its own temporary loopback server
and headless Chrome, so it does not require the interactive server on 4173. No Playwright
dependency is currently installed; do not add one just to run the existing suite.

Known local baseline at r14: **151 unit tests, 58 browser scenarios**. Count changes are
expected as tests are added; preserve behaviors, not a frozen number. CI currently does
not run the compiled-browser suite. Never substitute a successful build for rendered QA.

Known CI issue, diagnosed 2026-09-21 (ENG-05): two DST fixture tests assume Chicago while
CI launches Vitest in UTC. Their `beforeAll` environment assignment is too late for worker
timezone initialization. For the existing local baseline, launch with
`TZ=America/Chicago npm test`. `TZ=UTC npm test` still reproduces the two failures; do not
claim CI is green based on the Chicago run. Repair the runner before a release candidate;
do not weaken the DST assertions or change the app's runtime timezone.

### Focused browser suites

Use `HARNESS_ONLY=<name> npm run test:harness`; inspect `dev/harness-check.mjs` before
assuming new filter names. Useful current filters:

| Filter | Primary coverage |
|---|---|
| `chrome` | Compact rows, clock/spacing, disclosure, left dates, retained navigation |
| `timeline` | Remaining height, growing rows/bars, initial/Today centering, manual scroll retention, slow/hidden loads, reduced motion, dense overlaps, pinned axes, Status/filter resizing, short panels and legacy isolation |
| `responsive` | Reachable view/date controls, neutral capsule, themes/locales, embedded card |
| `presentation` | Week/Month/Agenda readability, filters, counts, drilldown and fallbacks |
| `views` | Date continuity across all views and month boundaries |
| `navigation` | Discrete day movement, preserved scroll, keyboard, slow-read races |
| `daily` | Today, real reload, persisted view/filters, storage/config failures |
| `status` | Current availability, dated next, clipping and unavailable sources |
| `details` | Refreshed/missing/unverifiable read-only details and modal focus |
| `alignment` | Resize/visibility states, shared person/all-day/timed column geometry |
| `pan` | Native touch/pointer scrolling and separate heading date gestures |
| `recovery` | Poll/wake/hidden/reconnect, stale reads and remount |

Run the full suite before a milestone because shared date/scroll changes affect many views.

## Rendered acceptance

Define the flow under test before editing. Reproduce the issue against the prior bundle
when practical, then test the same flow after the change. Use a synthetic review tab if
the user's tab contains unsaved annotations. Do not erase annotations to simplify QA.

- Confirm URL/title, meaningful content, no framework overlay and relevant console errors.
- Check a screenshot plus real interactions, not only DOM text or numerical assertions.
- Cover desktop, phone and the reported viewport; for responsive work include a narrow card
  inside a large viewport. CSS container width, not only window width, controls layout.
- Measure actual `innerWidth` and element bounds. Existing browser zoom can make screenshot
  pixels differ from CSS pixels. Preserve the user's zoom and reset temporary viewports.
- Exercise keyboard and pointer/touch where affected; inspect focus and scroll after changes.
- Test legacy and disabled/restricted configurations. Respect reduced motion.
- A desktop phone-width check is not physical iPhone/wall-device evidence.

If supported browser tools exist, use them. Otherwise run the checked-in runner. No specific
agent plugin is required. Shadow-root host locators can time out in the in-app browser;
role locators and read-only open-shadow DOM inspection have worked. Never use DOM evaluation
to bypass normal user interactions in a manual QA claim.

## Three different preview surfaces

| Surface | Data / host | What it proves |
|---|---|---|
| `127.0.0.1:4173/dev/harness.html` | Fixed synthetic data, laptop server | Deterministic presentation and interactions |
| `npm run preview:live` (default port 4174) | Optional loopback read-only proxy to HA, private runtime environment | Live reads outside the installed dashboard, not HA deployment |
| Installed HA dashboard | Authenticated HA runtime and dated deployed bundle | Actual dashboard behavior; does not depend on the laptop server |

The optional proxy requires `HA_PREVIEW_URL`, `HA_PREVIEW_TOKEN`, `HA_PREVIEW_CALENDARS`,
`HA_PREVIEW_PEOPLE`; `HA_PREVIEW_PORT` is optional. Read its code before using it. Keep these
values only in private runtime memory, never shell history, URLs, logs, files or commits.
It serves private appointment data without a separate local login: keep it loopback-only,
do not tunnel/share it, and stop it after authorized diagnostics. It is not a production backend.

## Milestone delivery

Update source, tests, generated bundle and owning product docs together. Review `git diff`
and outgoing commits for private data; stage exact paths, not unrelated work. Fetch the
personal `origin`, confirm the current branch, and push the verified milestone. Check remote
HEAD equals the intended commit. Do not force-push, merge main, tag or publish a release.

The branch may include earlier verified local commits not yet on origin. Review that entire
outgoing range, not just the last diff. A push is separate from HA deployment and a release.
Use [OPERATIONS](OPERATIONS.md) before any live change; report the exact delivery state.
