# Moran Family Board target design

Status: target specification derived from the approved family-board direction and the generated concept at [`docs/concepts/moran-family-board-target-v1.png`](./concepts/moran-family-board-target-v1.png).

## Primary surface

- Native viewport: 1920x1080 landscape wall display.
- Background: true white.
- Layout: slim status header, narrow navigation rail, then a 68/32 calendar and household-operations split.
- Calendar anatomy: shared time axis, person columns, current-time line, readable event blocks, and Day/Timeline/Week/Month/Agenda controls.
- Operations rail: Today, Shopping, and Dinner as open sections rather than a nested dashboard-card grid.

## Allowed primary-screen copy

- Family Board
- Calendar
- Tasks
- Lists
- Meals
- Home
- Everyone
- Day
- Timeline
- Week
- Month
- Agenda
- Today
- Shopping
- Dinner
- Add task
- Add item

Dates, times, people, weather, events, task counts, and meal content are data-driven rather than hard-coded copy.

## Design tokens

- Canvas: `#ffffff`
- Subtle surface: `#f6f8fb`
- Divider: `#dfe5ec`
- Primary text: `#111827`
- Secondary text: `#526071`
- Primary accent: `#1296ed`
- Current-time/conflict accent: `#e84235`
- Corner radii: 10px controls, 12px content blocks, 16px large sections.
- Touch target: minimum 48px.
- Motion: 140-180ms state transitions; disabled under `prefers-reduced-motion`.

Person and event colors are configurable. Names or initials must remain visible whenever a color is used.

## Typography

- Use the active Home Assistant theme/system sans stack.
- Board title: 28-32px, 700.
- Status date/time: 18-28px, with time carrying the stronger emphasis.
- Section headings: 20-24px, 700.
- Person names: 16-18px, 650-700.
- Event titles: 15-18px, 650.
- Event metadata: 13-15px, 500.
- Navigation labels and controls: 15-17px, 600.

## Component inventory

- Status header
- Profile filter group
- Navigation rail
- Calendar view switcher
- Person header with avatar/initials and optional state
- Time axis and current-time marker
- Event block with time, semantic icon, and optional logistics chips
- Task progress header and checkbox row
- Shopping-list row
- Dinner summary
- Add-event, add-task, and add-item actions
- Event editor dialog

## Container model

The calendar is a single continuous scheduling canvas. The operations rail contains three lightly separated sections. Avoid generic bento tiles, decorative metrics, gradients, glass effects, and multiple levels of nested cards.

## Responsive behavior

- At 1280-1919px: preserve the split but reduce navigation and event metadata density.
- Below 1100px: operations rail becomes a switchable drawer and the calendar takes full width.
- On portrait/mobile: use Agenda as the default and bottom navigation instead of the left rail.

## Core interaction path

1. The display returns to Today and Day view after configured kiosk inactivity.
2. A profile filter hides unrelated lanes without removing identifying text.
3. Selecting an event opens details and available edit actions.
4. Checking a task updates the configured Home Assistant to-do list and refreshes progress.
5. Add actions open explicit create flows; no visible control is decorative or inert.
