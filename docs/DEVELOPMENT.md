# Develop and verify the calendar

Status: current how-to, 2026-09-23. Audience: a developer or agent with a fresh clone,
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
   Add `&month-only=1` to inspect Month without a Day destination or saved preferences;
   the baseline fixture (omit `status=1`) has enough appointments on February 18 to expand overflow.
   Add `&day-only=1` instead to disable Agenda and force a one-column overlap cap without
   saved preferences. Casey's **+2** opens the restricted Day list (use the baseline feed,
   without `status=1`); this is a synthetic stress configuration, not a new default.
   Add `&agenda-context=1` to load a crowded synthetic week with no saved preferences.
   Select a Day date, then Week, Agenda or **+12**: the matching date should be revealed.
   In Week, the date label starts at the busy row's top; click the week range for Today.
   This query replaces the sample feed, not any real calendar data.

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

See [STATUS](STATUS.md) for the current verified build and test totals. Counts change as
tests are added; preserve behaviors, not a frozen number. CI currently does
not run the compiled-browser suite. Never substitute a successful build for rendered QA.

For hosted checks, pass `--repo emilianomoran/moran-family-board-card` to `gh run list/view`.
This checkout also has an upstream remote; implicit repository selection can show upstream's
runs instead of this fork. Verify the run's `headSha` matches the milestone commit.

`vitest.config.ts` sets America/Chicago before creating workers, so DST fixtures behave
consistently on UTC CI and local hosts (D28/ENG-05). `TZ=UTC npm test` is a useful regression
check. Do not move timezone mutation back into worker hooks, weaken DST assertions, or
change the app's runtime timezone. Hosted CI evidence belongs in STATUS, not a local-pass assumption.

### Focused browser suites

Use `HARNESS_ONLY=<name> npm run test:harness`; inspect `dev/harness-check.mjs` before
assuming new filter names. Useful current filters:

| Filter | Primary coverage |
|---|---|
| `week-context` | Selected-date entry, Today/week paging, visible row labels, manual browsing/details, density anchors, hidden/delayed/failed reads and cancellation, weekday settings, legacy and native wheel/keyboard/touch scrolling |
| `agenda-context` | Selected-date entry/Day overflow, Today/week paging, manual browsing/details, sparse/empty/failed reads, hidden/delayed/cancelled navigation, legacy and native wheel/keyboard/touch scrolling |
| `day-overflow` | Disabled-Agenda fallback, all appointments/details, two-level modal focus, refresh/removal/retry, Day scroll/date retention, routing/duplicates, midnight, locale, legacy, native keyboard/mouse/touch |
| `tabs` | Manual view/date activation, roving entry/exit, wrap/Home/End, track-only visibility, panel labels/focus, locale, RTL, restricted views/weekdays, legacy, native keyboard/mouse/touch |
| `density` | Wall Day range/anchors, fit/reset, short/overlap details, navigation/legacy isolation; real keyboard, pointer and touch range input |
| `timeline-density` | Timeline hour-width/row anchors, independent view scales, Reset/Today, delayed reads, hidden/obsolete frames, dense/all-day/midnight events and native keyboard/pointer/touch input |
| `week-density` | List spacing/type, date-row anchors, fixed headings, target floors, long/all-day/midnight events, delayed/hidden/obsolete reads, two real reloads, independent Reset and native range input |
| `zoom-preferences` | Actual reloads, independent Day/Timeline scales, per-view Reset, v1 migration, config invalidation, user/card isolation, opt-out and blocked/quota storage |
| `chrome` | Compact rows, clock/spacing, disclosure, left dates, retained navigation |
| `timeline` | Remaining height, growing rows/bars, initial/Today centering, manual scroll retention, slow/hidden loads, reduced motion, dense overlaps, pinned axes, Status/filter resizing, short panels and legacy isolation |
| `responsive` | Reachable view/date controls, neutral capsule, themes/locales, embedded card |
| `presentation` | Week/Month/Agenda readability, filters, counts, drilldown and fallbacks |
| `month-overflow` | Reachable/collapsible Month cards, details/focus, scroll bounds, restricted weekends, refreshed data, owner-copy counts, narrow grid, locale, legacy and native keyboard/mouse/touch input |
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

A separate review tab does not isolate stored preferences when its only difference is a
`?review=` query parameter. Preferences use the pathname, not the query string. Record and
restore the user's view/filters and Day/Timeline/Week zoom around review, especially before
reloading their preview. Reset clears a saved override; setting 100% is not the same as
Reset when configuration/fit differs. The automated persistence suite uses its own identity
and cleans up only its synthetic record.
Server freshness and loaded-tab freshness are separate checks: verify the new version
banner after reload, not only the file served on disk.

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

The user confirmed an installed Chrome extension on 2026-09-22, and its connection plus
the in-app browser were verified. A missing optional `browser` skill name is not evidence
that another extension/plugin is needed. The harness brings each isolated headless target
to the foreground before navigation: background targets can update `activeElement` while
suppressing `:focus` styling and native focus transitions. Activating it before fixture
listeners load avoids an extra wake read.

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

Keep the current build/deployment checkpoint in STATUS and the short root handoff. Other
guides should link there instead of keeping another version badge that can become stale.
When adding a decision, update the documentation index's conversation coverage too.
Rebuilding should reproduce committed `dist`; compare the served preview bundle to that
file before blaming an old screenshot or cached tab on the current source.

Preference payload v2 migrates v1 view/filter choices in place. A source downgrade to r17
or earlier ignores v2 and starts from configured defaults; previous UI choices are not
backward-compatible. Calendar data and HA configuration are unaffected. Do not describe
this browser preference migration as a live HA deployment.
R19 adds an optional Week scale inside v2. R18 still reads Day/Timeline but drops Week
when rewriting the record; it does not understand Week density.
