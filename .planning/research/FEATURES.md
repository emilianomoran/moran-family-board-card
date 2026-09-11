# Feature Research

**Domain:** Calendar-first family wall display
**Researched:** 2026-09-11
**Confidence:** HIGH for v1 calendar features; MEDIUM for post-v1 household operations

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Unified multi-calendar display | The screen must eliminate calendar-hopping | MEDIUM | Home Assistant remains the aggregation layer. |
| Clear person/category identity | A family calendar fails if ownership takes effort to decode | MEDIUM | Preserve visible names/initials; color alone is insufficient. |
| Day, week, month, and agenda navigation | Commercial and community products provide different planning horizons | MEDIUM | Existing fork already has five views; wall mode must make them consistent. |
| Current date/time and today state | A persistent wall screen is an ambient orientation tool | LOW | Header and now line should not compete with events. |
| All-day, multi-day, overlap, and timezone correctness | Real family schedules contain these cases immediately | HIGH | Pure event logic exists and needs regression coverage. |
| Touch-friendly event details and navigation | The target is a shared wall/tablet display | MEDIUM | Minimum 48px targets and no hover-only behavior. |
| Honest read-only/write capability | Calendar integrations expose different mutation features | HIGH | Never show edit/delete controls that cannot succeed. |
| Loading, empty, and failure states | A blank calendar can be dangerously mistaken for a free day | MEDIUM | Distinguish empty from unreachable and stale. |
| Responsive wall and tablet layouts | Wall displays and handheld administration have different density limits | HIGH | Optimize 1920x1080 first, then tablet and portrait agenda. |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Shared-calendar person routing | Supports existing managed calendars without forcing one calendar per person | MEDIUM | Already implemented with prefix/contains/regex rules and multi-person matches. |
| Person lanes plus Everyone filtering | Answers “who is doing what?” more directly than per-calendar legends | MEDIUM | Must preserve joint/shared event semantics. |
| Now/next family scan | Reduces a busy calendar to the next relevant action | MEDIUM | Existing foundation can be elevated into the wall header. |
| Home Assistant context | Weather, household status, and automations are available without a second platform | MEDIUM | Only add context that supports schedule decisions. |
| Local, subscription-free ownership | No additional cloud account or annual feature tier | LOW | Avoid claiming offline behavior that calendar providers cannot deliver. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Calendar, chores, meals, lists, rewards, and photos in v1 | Feels like feature parity with Skylight | Dilutes the primary workflow and multiplies data models before the calendar is validated | Ship a calendar-only milestone and add modules after observation. |
| Direct Calendar Bridge calls from the card | Unlocks full Apple Calendar mutation quickly | Exposes a local unauthenticated boundary and creates browser/network coupling | Add an authenticated Home Assistant-side adapter in v2. |
| A decorative dashboard full of nested cards | Looks impressive in screenshots | Weakens scanability and creates inconsistent interaction patterns | One scheduling canvas with restrained supporting regions. |
| Person identity by color only | Saves space | Excludes color-impaired users and makes shared events ambiguous | Always show name, initials, avatar, or explicit labels. |
| Full rewrite before comparison | Promises a cleaner codebase | Risks losing years of event edge-case behavior | Capture behavior and extract seams incrementally. |

## Feature Dependencies

```text
Base implementation decision
    └──requires──> Competitor and codebase spike

Wall calendar shell
    └──requires──> Normalized calendar model
                       └──requires──> Home Assistant data adapter

Person filters ──requires──> Shared-calendar routing
Responsive layouts ──requires──> Stable view contracts
Visual regression ──requires──> Deterministic generic harness
Safe mutation ──requires──> Capability detection and stable occurrence identity
Calendar Bridge provider ──requires──> Authenticated HA-side adapter (v2)
```

### Dependency Notes

- **Large UI investment requires the base decision:** the newer `family-calendar-card` must be compared before refactoring this fork.
- **Wall views require normalized events:** view components should not each reinterpret raw Home Assistant responses.
- **Visual regression requires deterministic fixtures:** real household data would be unstable and private.
- **Safe mutation requires capability and recurrence awareness:** create, update, and delete cannot be treated as universally available.

## MVP Definition

### Launch With (v1)

- [ ] Opt-in wall-calendar shell at 1920x1080 — validates the primary physical experience.
- [ ] Person lanes, Everyone/person filters, now line, and now/next — delivers immediate comprehension.
- [ ] Day, timeline, week, month, and agenda views with consistent navigation — preserves the strongest inherited value.
- [ ] Touch, tablet, portrait agenda, and accessibility behavior — supports the actual shared-device setting.
- [ ] Honest capability, loading, stale, empty, and error states — makes the calendar trustworthy.
- [ ] Automated logic, interaction, and screenshot checks — protects a high-density visual product.
- [ ] Reversible HACS beta and Home Assistant pilot runbook — enables validation without unsafe live edits.

### Add After Validation (v1.x)

- [ ] Small household status strip — add only if it improves calendar decisions without reducing event space.
- [ ] Logistics annotations such as driver, pickup, and unassigned status — add after stable event-occurrence identity is defined.
- [ ] Performance improvements using event subscriptions and smarter caching — promote when measurements show stale data or redundant fetches.

### Future Consideration (v2+)

- [ ] Calendar Bridge provider — richer update/delete and recurring-event handling through a safe adapter.
- [ ] Tasks and shopping — Home Assistant `todo.*` modules after calendar validation.
- [ ] Meals and recipes — separate bounded module, not calendar-core logic.
- [ ] Import/AI parsing — high privacy and correctness burden; validate only after conventional entry is dependable.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Wall calendar shell | HIGH | MEDIUM | P1 |
| Shared routing and person filters | HIGH | MEDIUM | P1 |
| Current activity and navigation | HIGH | MEDIUM | P1 |
| Error/stale/capability states | HIGH | MEDIUM | P1 |
| Responsive and accessible interaction | HIGH | HIGH | P1 |
| Visual and browser automation | HIGH | MEDIUM | P1 |
| Calendar Bridge mutation | MEDIUM | HIGH | P2 |
| Logistics annotations | MEDIUM | HIGH | P2 |
| Tasks, lists, and meals | MEDIUM | HIGH | P3 |

## Competitor Feature Analysis

| Feature | Skylight Calendar 2 | Community cards | Our Approach |
|---------|---------------------|-----------------|--------------|
| Persistent family display | Dedicated 15-inch touch hardware and software | Usually a Lovelace card on user-selected hardware | Home Assistant panel/dashboard with an opt-in wall mode. |
| Unified calendars | Syncs major calendar providers | Home Assistant `calendar.*` entities | Use Home Assistant aggregation and existing shared-calendar routing. |
| Person/category filtering | Color-coded family profiles | Calendar legends or one calendar per person are common | Explicit person lanes plus Everyone/person filters, names, and colors. |
| Views | Day, week, and month | Calendar Card Pro emphasizes list/columns; Week Planner emphasizes multi-day grid; Family Calendar Card offers Today through Month | Preserve day, timeline, week, month, and agenda with one wall navigation contract. |
| Event management | Add/remove on device | Support varies; newer Family Calendar Card advertises CRUD and recurrence | Runtime capability gating in v1; Calendar Bridge adapter only later. |
| Weather | Event/location and screen context | Calendar Card Pro and Family Calendar Card integrate weather | Use configurable Home Assistant weather with restrained placement. |
| Tasks/lists/meals | Integrated; some features require Plus | Available through separate HA entities/cards | Explicitly deferred until calendar success is proven. |
| Shared-calendar routing | Profile-oriented commercial model | Often assumes calendar-per-person or per-calendar filters | Route one shared calendar to one or more people using configurable title rules. |

## Sources

- [Skylight Calendar 2 product page](https://myskylight.com/products/the-skylight-calendar-2-classic-sage-with-plus-plan/) — official views, interaction, calendars, weather, colors, lists, tasks, and meal features.
- [Calendar Card Pro](https://github.com/alexpfau/calendar-card-pro) — multi-calendar agenda/columns, caching, editor, failure handling, weather, and responsive patterns.
- [Week Planner Card](https://github.com/FamousWolf/week-planner-card) — responsive multi-day and month planning patterns.
- [Family Calendar Card](https://github.com/tienou/family-calendar-card) — current Skylight-inspired Home Assistant prior art, CRUD, recurrence, responsive views, and kiosk guidance.
- Repository README, design specification, source, and tests — inherited and fork-specific capabilities.

---
*Feature research for: Moran Family Board Card*
*Researched: 2026-09-11*
