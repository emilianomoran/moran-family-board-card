import { css, html, type TemplateResult } from "lit";

export interface WallShellOptions {
  title: string;
  calendarIdentity: string;
  clockLabel: string;
  clockDateTime: string;
  viewNavigation: unknown;
  densityControl: unknown;
  statusToggle: unknown;
  focus: unknown;
  content: TemplateResult;
}

/** Compose the calendar renderer inside the opt-in, presentation-only wall surface. */
export function renderWallShell({
  title,
  calendarIdentity,
  clockLabel,
  clockDateTime,
  viewNavigation,
  densityControl,
  statusToggle,
  focus,
  content,
}: WallShellOptions): TemplateResult {
  return html`
    <section class="moran-wall-shell" aria-label=${`${title} · ${calendarIdentity}`}>
      <header class="moran-wall-header">
        <div class="moran-wall-brand">
          <div class="moran-wall-title" title=${title}>${title}</div>
          <time class="moran-wall-clock" datetime=${clockDateTime}>${clockLabel}</time>
        </div>
        ${viewNavigation} ${densityControl} ${statusToggle}
      </header>
      ${focus} ${content}
    </section>
  `;
}

/** Wall-only tokens and overrides. Every selector is rooted beneath the opt-in shell. */
export const wallShellStyles = css`
  .moran-wall-shell {
    --moran-wall-canvas: var(--card-background-color, #ffffff);
    --moran-wall-surface: var(--secondary-background-color, #f6f8fb);
    --moran-wall-divider: var(--divider-color, #dfe5ec);
    --moran-wall-text: var(--primary-text-color, #111827);
    --moran-wall-muted: var(--secondary-text-color, #526071);
    --moran-wall-accent: var(--primary-color, #1296ed);
    --moran-wall-now: var(--error-color, #e84235);
    --fb-accent: var(--moran-wall-accent);
    --fb-now-color: var(--moran-wall-now);
    --fb-axis-width: 72px;
    --fb-col-min: 240px;
    --fb-avatar-size: 40px;
    --fb-radius: 12px;
    --fb-radius-sm: 12px;
    --fb-title-size: 28px;
    --fb-name-size: 16px;
    --fb-event-size: 16px;
    --fb-time-size: 14px;
    --fb-chip-size: 14px;
    box-sizing: border-box;
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
    color: var(--moran-wall-text);
    background: var(--moran-wall-canvas);
    font-family: var(
      --ha-font-family-body,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif
    );
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }

  .moran-wall-shell .moran-wall-header {
    position: relative;
    z-index: 10;
    box-sizing: border-box;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    height: 48px;
    min-height: 48px;
    padding: 3px 12px;
    border-bottom: 1px solid var(--moran-wall-divider);
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .moran-wall-brand {
    display: flex;
    flex: 1 1 0;
    min-width: 0;
    max-width: 100%;
    align-items: baseline;
    gap: 12px;
  }

  .moran-wall-shell .moran-wall-title {
    overflow: hidden;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .moran-wall-shell .moran-wall-clock {
    flex: 0 0 auto;
    color: var(--moran-wall-muted);
    font-size: 16px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.25;
    white-space: nowrap;
  }

  .moran-wall-shell .wall-datebar > .tabs {
    box-sizing: border-box;
    gap: 4px;
    border-radius: 10px;
    background: var(--moran-wall-surface);
  }

  .moran-wall-shell .switch button,
  .moran-wall-shell .tabs button,
  .moran-wall-shell .nav,
  .moran-wall-shell .nav-now {
    box-sizing: border-box;
    min-width: 48px;
    min-height: 48px;
    border-radius: 10px;
    color: var(--moran-wall-muted);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
    transition:
      background 160ms ease-out,
      color 160ms ease-out,
      box-shadow 160ms ease-out,
      transform 160ms ease-out;
  }

  .moran-wall-shell .tabs button.on {
    background: var(--moran-wall-accent);
    color: #ffffff;
    font-weight: 700;
  }

  /* View modes share a neutral capsule; the separate date strip keeps its day cells. */
  .moran-wall-shell .switch {
    box-sizing: border-box;
    display: inline-flex;
    flex: 0 0 auto;
    flex-wrap: nowrap;
    gap: 0;
    min-width: 0;
    max-width: 100%;
    padding: 2px;
    height: 40px;
    border: 1px solid color-mix(in srgb, var(--moran-wall-text) 12%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--moran-wall-canvas) 90%, var(--moran-wall-text));
    box-shadow: inset 0 1px 0 #ffffff14;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .moran-wall-shell .switch button {
    position: relative;
    flex: 1 0 auto;
    padding: 2px 12px;
    min-height: 34px;
    height: 34px;
    max-height: 34px;
    border-radius: 999px;
    background: transparent;
    color: var(--moran-wall-muted);
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }

  .moran-wall-shell .switch button.on {
    background: color-mix(in srgb, var(--moran-wall-canvas) 84%, #ffffff);
    color: var(--moran-wall-text);
    font-weight: 600;
    box-shadow:
      0 1px 3px color-mix(in srgb, var(--moran-wall-text) 16%, transparent),
      inset 0 0 0 1px #ffffff14;
  }

  .moran-wall-shell .switch button:hover:not(.on) {
    background: color-mix(in srgb, var(--moran-wall-text) 6%, transparent);
    color: var(--moran-wall-text);
  }

  .moran-wall-shell .switch button:not(.on) + button:not(.on)::before {
    position: absolute;
    inset-block: 25%;
    inset-inline-start: 0;
    border-inline-start: 1px solid color-mix(in srgb, var(--moran-wall-text) 16%, transparent);
    content: "";
    pointer-events: none;
  }

  .moran-wall-shell .dayhead,
  .moran-wall-shell .weekhead {
    box-sizing: border-box;
    flex: 0 0 56px;
    min-height: 56px;
    padding: 4px 24px;
    border-bottom: 1px solid var(--moran-wall-divider);
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .dayname {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
  }

  /* Date context/navigation shares the date strip, never a separate fixed row. */
  .moran-wall-shell .wall-datebar {
    display: flex;
    flex: 0 0 80px;
    min-height: 80px;
    overflow: hidden;
    border-bottom: 1px solid var(--moran-wall-divider);
  }

  .moran-wall-shell .wall-date-tools {
    display: flex;
    flex: 0 0 112px;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    border-inline-end: 1px solid var(--moran-wall-divider);
  }

  .moran-wall-shell .wall-date-tools .dayname {
    justify-content: center;
    width: 100%;
    min-height: 28px;
    font-size: 13px;
    touch-action: pan-y pinch-zoom;
    user-select: none;
    border-radius: 6px;
    cursor: ew-resize;
  }

  .moran-wall-shell .wall-date-tools .weeknav {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr) 28px;
    gap: 0;
    padding-inline: 2px;
  }

  .moran-wall-shell .wall-date-tools .weeknav button {
    min-width: 0;
    min-height: 36px;
    height: 36px;
    padding: 0;
    font-size: 12px;
    background: transparent;
  }

  .moran-wall-shell .wall-date-tools .weeknav .nav {
    font-size: 20px;
  }

  .moran-wall-shell .wall-datebar > .tabs {
    display: flex;
    flex: 1 1 0;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    min-width: 0;
    min-height: 80px;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid var(--moran-wall-divider);
    border-radius: 0;
    background: var(--moran-wall-canvas);
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    /* A non-overlay OS scrollbar must not consume the date cells' touch height. */
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .moran-wall-shell .wall-datebar > .tabs::-webkit-scrollbar {
    display: none;
  }

  .moran-wall-shell .wall-datebar > .tabs button {
    display: flex;
    flex: 1 0 64px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    min-width: 64px;
    height: 100%;
    padding: 6px 12px;
    border-inline-end: 1px solid var(--moran-wall-divider);
    border-radius: 0;
    scroll-snap-align: start;
    text-align: start;
    font-variant-numeric: proportional-nums;
    letter-spacing: normal;
  }

  .moran-wall-shell .wall-datebar > .tabs button:last-child {
    border-inline-end: 0;
  }

  .moran-wall-shell .wall-datebar > .tabs button.on {
    background: color-mix(in srgb, var(--moran-wall-accent) 12%, var(--moran-wall-canvas));
    color: var(--moran-wall-text);
    box-shadow: inset 0 -3px 0 var(--moran-wall-accent);
  }

  .moran-wall-shell .wall-datebar > .tabs button.today:not(.on) {
    box-shadow: none;
  }

  .moran-wall-shell .wall-day-weekday {
    /* Share the number's footprint without centering the group in its cell. */
    width: 40px;
    text-align: center;
    color: var(--moran-wall-muted);
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;
  }

  .moran-wall-shell .wall-day-number {
    display: grid;
    width: 40px;
    height: 40px;
    place-items: center;
    border-radius: 50%;
    color: var(--moran-wall-text);
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: proportional-nums;
    letter-spacing: normal;
  }

  .moran-wall-shell .wall-datebar > .tabs button.today .wall-day-number {
    background: var(--moran-wall-accent);
    color: #ffffff;
  }

  .moran-wall-shell .wall-datebar > .tabs button.on .wall-day-weekday,
  .moran-wall-shell .wall-datebar > .tabs button.today .wall-day-weekday {
    color: var(--moran-wall-accent);
  }

  .moran-wall-shell .focus {
    flex: 0 0 auto;
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .wall-status-panel {
    flex: 0 0 auto;
    max-height: 35%;
    overflow: auto;
  }

  .moran-wall-shell .wall-status-panel[hidden] {
    display: none;
  }

  .moran-wall-shell .moran-wall-header .wall-status-toggle,
  .moran-wall-shell .moran-wall-header .wall-density-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 40px;
    min-width: 40px;
    min-height: 40px;
    width: 40px;
    height: 40px;
    padding: 0;
    color: var(--moran-wall-muted);
    background: var(--moran-wall-surface);
    border: 1px solid var(--moran-wall-divider);
    border-radius: 50%;
    cursor: pointer;
  }

  .moran-wall-shell .wall-status-toggle[aria-expanded="true"],
  .moran-wall-shell .wall-density-toggle[aria-expanded="true"] {
    color: var(--moran-wall-accent);
    background: color-mix(in srgb, var(--moran-wall-accent) 12%, var(--moran-wall-canvas));
  }

  .moran-wall-shell .wall-status-toggle svg,
  .moran-wall-shell .wall-density-toggle svg {
    width: 22px;
    height: 22px;
  }

  .moran-wall-shell .wall-density-panel {
    position: absolute;
    top: calc(100% + 6px);
    inset-inline-end: 8px;
    box-sizing: border-box;
    width: 296px;
    max-width: calc(100% - 16px);
    padding: 12px 16px;
    border: 1px solid var(--moran-wall-divider);
    border-radius: 16px;
    background: var(--moran-wall-canvas);
    box-shadow: 0 6px 24px color-mix(in srgb, var(--moran-wall-text) 16%, transparent);
  }

  .moran-wall-shell .wall-density-panel[hidden] {
    display: none;
  }

  .moran-wall-shell .wall-density-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .moran-wall-shell .wall-density-heading label {
    flex: 1;
  }

  .moran-wall-shell .wall-density-heading output {
    font-variant-numeric: tabular-nums;
    color: var(--moran-wall-muted);
  }

  .moran-wall-shell .wall-density-heading button {
    min-height: 36px;
    padding: 4px 8px;
    color: var(--moran-wall-accent);
    background: var(--moran-wall-surface);
    border-radius: 8px;
    font-size: 13px;
  }

  .moran-wall-shell .wall-density-heading button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .moran-wall-shell .wall-density-panel input {
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    margin: 4px 0 0;
    padding: 0;
    accent-color: var(--moran-wall-accent);
    cursor: pointer;
  }

  .moran-wall-shell .wall-density-panel input:focus-visible {
    outline: 2px solid var(--moran-wall-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .moran-wall-shell .wall-density-hints {
    display: flex;
    justify-content: space-between;
    color: var(--moran-wall-muted);
    font-size: 12px;
  }

  .moran-wall-shell .fname,
  .moran-wall-shell .fnow,
  .moran-wall-shell .fnext,
  .moran-wall-shell .ffree,
  .moran-wall-shell .fnow small,
  .moran-wall-shell .fnext small {
    font-size: 14px;
    line-height: 1.5;
  }

  .moran-wall-shell .fname,
  .moran-wall-shell .fnow,
  .moran-wall-shell .fnext {
    font-weight: 700;
  }

  .moran-wall-shell .ffree,
  .moran-wall-shell .fnow small,
  .moran-wall-shell .fnext small {
    font-weight: 400;
  }

  .moran-wall-shell .fbody {
    flex: 1;
  }

  .moran-wall-shell .fchip {
    min-width: 220px;
    align-items: flex-start;
  }

  .moran-wall-shell .fheading {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 5px;
  }

  .moran-wall-shell .fname,
  .moran-wall-shell .ffree {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .fseparator {
    color: var(--secondary-text-color);
  }

  .moran-wall-shell .fnow,
  .moran-wall-shell .fnext {
    display: block;
    overflow: visible;
    white-space: normal;
  }

  .moran-wall-shell .fsummary {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .moran-wall-shell .fdot {
    display: inline-block;
    margin-right: 4px;
  }

  .moran-wall-shell .fnow small,
  .moran-wall-shell .fnext small {
    display: block;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell > .board {
    flex: 1 1 auto;
    width: 100%;
    min-height: 0;
    max-height: none;
    margin-top: 0;
    overflow: auto;
    background: var(--moran-wall-canvas);
    scrollbar-width: thin;
  }

  .moran-wall-shell > .board.wall-pan-board {
    cursor: grab;
    user-select: none;
  }

  .moran-wall-shell > .board.wall-pan-board.panning {
    cursor: grabbing;
  }

  /* Every row must size against the same full grid, not the viewport or a
     fixed four-person fixture. Otherwise sticky headers diverge on resize. */
  .moran-wall-shell .board > :is(.header-row, .allday-row, .body) {
    box-sizing: border-box;
    width: 100%;
    min-width: calc(
      var(--fb-axis-width) + var(--fb-wall-visible-lanes) * var(--fb-col-min) +
        var(--fb-wall-hidden-lanes) * 48px
    );
  }

  .moran-wall-shell .header-row {
    top: 0;
    height: 80px;
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .axis-spacer,
  .moran-wall-shell .axis {
    width: 72px;
    flex-basis: 72px;
  }

  .moran-wall-shell .phead {
    box-sizing: border-box;
    height: 80px;
    padding: 8px 16px;
  }

  .moran-wall-shell .phead:not(.off) {
    display: grid;
    grid-template-columns: var(--fb-avatar-size) minmax(0, 1fr) auto;
    grid-template-rows: repeat(2, minmax(0, auto));
    align-content: center;
    align-items: center;
    column-gap: 8px;
    row-gap: 0;
  }

  .moran-wall-shell .phead > .avatar {
    width: var(--fb-avatar-size);
    height: var(--fb-avatar-size);
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
  }

  .moran-wall-shell .phead:not(.off) > .avatar {
    grid-column: 1;
    grid-row: 1 / -1;
  }

  .moran-wall-shell .phead:not(.off) > .pname,
  .moran-wall-shell .phead:not(.off) > .pstatus {
    grid-column: 2;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .moran-wall-shell .phead:not(.off) > .pname {
    grid-row: 1;
    align-self: end;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
  }

  .moran-wall-shell .phead:not(.off) > .pstatus {
    grid-row: 2;
    align-self: start;
  }

  .moran-wall-shell .phead:not(.off) > .pbadges {
    grid-column: 3;
    grid-row: 1 / -1;
    flex-wrap: nowrap;
    margin-top: 0;
  }

  .moran-wall-shell .phead.off {
    justify-content: center;
    padding-inline: 0;
  }

  .moran-wall-shell .pstatus,
  .moran-wall-shell .pbadge,
  .moran-wall-shell .allday-label,
  .moran-wall-shell .hour,
  .moran-wall-shell .etime,
  .moran-wall-shell .nowline span,
  .moran-wall-shell .empty {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }

  .moran-wall-shell .hour {
    right: 16px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .moran-wall-shell .allday-row {
    position: sticky;
    top: 80px;
    z-index: 4;
    min-height: 48px;
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .allday-cell {
    padding: 8px;
    gap: 4px;
  }

  .moran-wall-shell .adchip {
    min-height: 32px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.5;
  }

  /* More specific than generic touch-target sizing: all three kinds of cells
     share both expanded and collapsed widths, regardless of role attributes. */
  .moran-wall-shell .board :is(.phead, .allday-cell, .col):not(.off) {
    flex: 1 1 0;
    min-width: var(--fb-col-min);
  }

  .moran-wall-shell .board :is(.phead, .allday-cell, .col).off {
    flex: 0 0 48px;
    min-width: 48px;
  }

  .moran-wall-shell .event {
    gap: 8px;
    border-radius: 12px;
    padding: 8px;
    transition:
      box-shadow 160ms ease-out,
      transform 160ms ease-out;
  }

  .moran-wall-shell .etitle {
    flex: 0 0 auto;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
  }

  /* Brief appointments must prioritize the title over the optional time line. */
  .moran-wall-shell .board .event {
    /* Do not stretch a 30-minute appointment across an hour at compact density.
       Very short events retain a 16px title strip and keyboard/Agenda access. */
    min-height: 16px;
  }

  .moran-wall-shell .event.wall-short {
    gap: 2px;
    padding: 2px 8px;
  }

  .moran-wall-shell .event.wall-short .etitle {
    flex: 0 0 auto;
    font-size: 14px;
    line-height: 1.25;
  }

  .moran-wall-shell .event.wall-short .etime {
    flex: 0 0 auto;
    font-size: 12px;
    line-height: 1.2;
  }

  .moran-wall-shell .event.slim {
    gap: 4px;
    padding: 0 5px;
  }

  .moran-wall-shell .event.slim .etitle {
    flex: 0 0 auto;
    font-size: 13px;
    line-height: 1;
  }

  .moran-wall-shell .board .event.overflow {
    padding-block: 0;
  }

  .moran-wall-shell .board .event.overflow .etitle {
    font-size: 13px;
    line-height: 1;
  }

  .moran-wall-shell .nowline {
    left: 72px;
    border-color: var(--moran-wall-now);
  }

  .moran-wall-shell .nowline span {
    left: -64px;
    color: #ffffff;
    background: var(--moran-wall-now);
    font-weight: 700;
  }

  .moran-wall-shell .banner {
    flex: 0 0 auto;
    margin: 8px 24px;
    font-size: 14px;
    font-weight: 400;
  }

  .moran-wall-shell :is(button, [role="button"], [role="tab"], [tabindex="0"]) {
    box-sizing: border-box;
    min-width: 48px;
    min-height: 48px;
  }

  /* Each view uses the remaining panel height and owns its own scrolling. */
  .moran-wall-shell > :is(.tlwrap, .weekwrap, .monthwrap, .agenda) {
    box-sizing: border-box;
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    width: 100%;
    overflow: auto;
    scrollbar-width: thin;
  }

  .moran-wall-shell > .tlwrap {
    position: relative;
    margin-top: 0;
  }

  .moran-wall-shell .tlgrid {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .moran-wall-shell .tlhead {
    flex: 0 0 auto;
  }

  .moran-wall-shell .tlhour {
    white-space: nowrap;
  }

  /* Midnight labels must stay inside the time area, not behind pinned names or
     wrapped beyond the end of a fully zoomed-out day. Interior labels stay centered. */
  .moran-wall-shell .tlhour:first-child {
    transform: none;
  }

  .moran-wall-shell .tlhour:last-child {
    transform: translateX(-100%);
  }

  /* Grow the rows into unused space, but never shrink overlapping event lanes.
     Short panels scroll vertically; the time axis and person names stay sticky. */
  .moran-wall-shell .tlrow {
    flex: 1 0 auto;
  }

  .moran-wall-shell .tlnow span {
    white-space: nowrap;
  }

  .moran-wall-shell .weekgrid {
    width: 100%;
  }

  .moran-wall-shell .weekwrap {
    /* Zoom restores its date-row anchor explicitly, without browser scroll anchoring. */
    overflow-anchor: none;
  }

  .moran-wall-shell .wphead {
    min-width: 0;
    padding: 12px 8px;
    font-size: 14px;
  }

  .moran-wall-shell .wphead > span {
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .wday {
    flex-direction: column;
    justify-content: center;
    padding: 8px 4px;
    font-size: 12px;
  }

  .moran-wall-shell .wall-week-date {
    font-size: 22px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .moran-wall-shell .wcell {
    min-width: 0;
    min-height: calc(88px * var(--week-scale, 1));
    padding: calc(6px * var(--week-scale, 1));
    gap: calc(6px * var(--week-scale, 1));
  }

  .moran-wall-shell .wchip {
    flex-direction: column;
    align-items: stretch;
    gap: calc(4px * var(--week-scale, 1));
    padding: calc(8px * var(--week-scale, 1));
  }

  .moran-wall-shell .wchip > span {
    white-space: normal;
    overflow-wrap: anywhere;
    font-size: clamp(12px, calc(14px * var(--week-scale, 1)), 21px);
    line-height: 1.4;
  }

  .moran-wall-shell .wchip small {
    margin: 0;
    font-size: clamp(12px, calc(13px * var(--week-scale, 1)), 19.5px);
  }

  .moran-wall-shell .wall-person-filters {
    display: flex;
    flex: 0 0 auto;
    gap: 8px;
    padding: 8px 12px;
    overflow-x: auto;
    border-bottom: 1px solid var(--moran-wall-divider);
    scrollbar-width: thin;
  }

  .moran-wall-shell .wall-person-filters button {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 8px;
    padding: 6px 12px 6px 8px;
    border: 1px solid var(--moran-wall-divider);
    border-radius: 999px;
    background: var(--moran-wall-surface);
    color: var(--moran-wall-text);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .moran-wall-shell .wall-person-filters .avatar {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
  }

  .moran-wall-shell .wall-person-filters button.off {
    background: transparent;
    color: var(--moran-wall-muted);
    border-style: dashed;
  }

  .moran-wall-shell .wall-person-filters button.off > span {
    text-decoration: line-through;
  }

  .moran-wall-shell .wall-person-filters button.off .avatar {
    opacity: 0.4;
    filter: grayscale(1);
  }

  .moran-wall-shell .agenda {
    padding: 0 12px 12px;
  }

  .moran-wall-shell .agenda-date {
    padding: 12px 4px 8px;
    font-size: 16px;
  }

  .moran-wall-shell .agenda-row {
    display: grid;
    grid-template-columns: 86px 4px minmax(0, 1fr);
    align-items: start;
    gap: 4px 10px;
    padding: 12px 4px;
  }

  .moran-wall-shell .agenda-time {
    grid-column: 1;
    grid-row: 1 / 3;
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .agenda-bar {
    grid-column: 2;
    grid-row: 1 / 3;
  }

  .moran-wall-shell .agenda-main {
    grid-column: 3;
  }

  .moran-wall-shell .agenda-title,
  .moran-wall-shell .agenda-meta {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .agenda-title {
    font-size: 16px;
    line-height: 1.4;
  }

  .moran-wall-shell .agenda-meta,
  .moran-wall-shell .agenda-cd {
    font-size: 13px;
    line-height: 1.5;
  }

  .moran-wall-shell .agenda-cd {
    grid-column: 3;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .monthgrid,
  .moran-wall-shell .monthhead {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .moran-wall-shell .mhcell {
    font-size: 13px;
  }

  .moran-wall-shell .mdate {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .moran-wall-shell .mchip {
    padding: 6px;
    font-size: 13px;
  }

  .moran-wall-shell .wall-month-summary {
    display: none;
  }

  @container (max-width: 600px) {
    .moran-wall-shell .monthwrap.compact-month {
      padding: 0 4px 8px;
    }

    .moran-wall-shell .compact-month .monthgrid {
      grid-auto-rows: minmax(88px, auto);
    }

    .moran-wall-shell .compact-month .monthgrid .mcell {
      min-width: 0;
      min-height: 88px;
      padding: 4px 1px;
    }

    .moran-wall-shell .compact-month .mdate {
      margin-inline: auto;
    }

    .moran-wall-shell .compact-month .mchips {
      display: none;
    }

    .moran-wall-shell .compact-month .wall-month-summary {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      margin-top: 3px;
    }

    .moran-wall-shell .wall-month-dots {
      display: flex;
      gap: 3px;
      height: 5px;
    }

    .moran-wall-shell .wall-month-dots i {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }

    .moran-wall-shell .wall-month-count {
      color: var(--moran-wall-muted);
      font-size: 11px;
      line-height: 1.2;
      text-align: center;
      overflow-wrap: anywhere;
    }
  }

  @container (max-width: 700px) {
    .moran-wall-shell .moran-wall-header {
      padding-inline: 8px;
    }

    .moran-wall-shell .moran-wall-brand {
      display: none;
    }

    .moran-wall-shell .moran-wall-header:not(:has(.switch)) .moran-wall-brand {
      display: flex;
    }

    .moran-wall-shell .switch {
      display: flex;
      flex: 1 1 auto;
    }

    .moran-wall-shell .switch button {
      padding-inline: 6px;
      font-size: 13px;
    }
  }

  .moran-wall-shell button:focus,
  .moran-wall-shell [role="button"]:focus,
  .moran-wall-shell [role="tab"]:focus,
  .moran-wall-shell [tabindex="0"]:focus,
  .moran-wall-shell button:focus-visible,
  .moran-wall-shell [role="button"]:focus-visible,
  .moran-wall-shell [role="tab"]:focus-visible,
  .moran-wall-shell [tabindex="0"]:focus-visible,
  .moran-wall-shell button:focus-within,
  .moran-wall-shell [role="button"]:focus-within,
  .moran-wall-shell [role="tab"]:focus-within,
  .moran-wall-shell [tabindex="0"]:focus-within {
    outline-color: var(--moran-wall-accent, #1296ed) !important;
    outline-style: solid !important;
    outline-width: 2px !important;
    outline-offset: 2px !important;
  }

  .moran-wall-shell .switch > button:focus,
  .moran-wall-shell .switch > button:focus-visible,
  .moran-wall-shell .switch > button:focus-within,
  .moran-wall-shell .wall-datebar > .tabs > button:focus,
  .moran-wall-shell .wall-datebar > .tabs > button:focus-visible,
  .moran-wall-shell .wall-datebar > .tabs > button:focus-within {
    outline-offset: -3px !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .moran-wall-shell .switch button,
    .moran-wall-shell .tabs button,
    .moran-wall-shell .nav,
    .moran-wall-shell .nav-now,
    .moran-wall-shell .event {
      animation: none !important;
      transition: none !important;
    }
  }
`;
