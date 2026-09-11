import { css, html, type TemplateResult } from "lit";

export interface WallShellOptions {
  title: string;
  calendarIdentity: string;
  viewNavigation: unknown;
  focus: unknown;
  content: TemplateResult;
}

/** Compose the calendar renderer inside the opt-in, presentation-only wall surface. */
export function renderWallShell({
  title,
  calendarIdentity,
  viewNavigation,
  focus,
  content,
}: WallShellOptions): TemplateResult {
  return html`
    <section class="moran-wall-shell" aria-label=${calendarIdentity}>
      <header class="moran-wall-header">
        <div class="moran-wall-brand">
          <div class="moran-wall-title">${title}</div>
          <div class="moran-wall-calendar-identity">${calendarIdentity}</div>
        </div>
        ${viewNavigation}
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
    box-sizing: border-box;
    display: flex;
    flex: 0 0 72px;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    height: 72px;
    padding: 0 24px;
    border-bottom: 1px solid var(--moran-wall-divider);
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .moran-wall-brand {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 16px;
  }

  .moran-wall-shell .moran-wall-title {
    overflow: hidden;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .moran-wall-shell .moran-wall-calendar-identity {
    color: var(--moran-wall-muted);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
  }

  .moran-wall-shell .switch,
  .moran-wall-shell > .tabs {
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

  .moran-wall-shell .switch button.on,
  .moran-wall-shell .tabs button.on {
    background: var(--moran-wall-accent);
    color: #ffffff;
    font-weight: 700;
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

  .moran-wall-shell > .tabs {
    display: flex;
    flex: 0 0 56px;
    width: 100%;
    min-height: 56px;
    margin: 0;
    padding: 4px 24px;
    border-bottom: 1px solid var(--moran-wall-divider);
    border-radius: 0;
  }

  .moran-wall-shell > .tabs button {
    flex: 1 1 0;
  }

  .moran-wall-shell .focus {
    flex: 0 0 auto;
    background: var(--moran-wall-canvas);
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

  .moran-wall-shell .header-row {
    top: 0;
    min-width: calc(72px + 4 * 240px);
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
    min-width: 240px;
    height: 80px;
    padding: 8px 16px;
    gap: 4px;
  }

  .moran-wall-shell .pname {
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
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
    min-width: calc(72px + 4 * 240px);
    min-height: 48px;
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .allday-cell {
    min-width: 240px;
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

  .moran-wall-shell .body {
    min-width: calc(72px + 4 * 240px);
  }

  .moran-wall-shell .col {
    min-width: 240px;
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
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
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
