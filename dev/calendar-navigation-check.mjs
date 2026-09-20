/** Synthetic data only: date-page navigation must not steal the time/person viewport. */
export async function runCalendarNavigationChecks(card, hass, nextRender) {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const root = card.shadowRoot;
  const config = card._config;
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading && !card._dayScrollAnchor && card._dayScrollFrame === undefined) return;
    }
    throw new Error("Date navigation did not settle.");
  };
  const board = () => root.querySelector('.board');
  const shown = () => root.querySelector('.tabs [aria-selected="true"]')?.getAttribute('aria-label');
  const minute = () => {
    const grid = board();
    const sticky = [...grid.querySelectorAll('.header-row, .allday-row')]
      .reduce((sum, row) => sum + row.offsetHeight, 0);
    return card._dayWindow(card._shownDay()).startMin +
      (grid.getBoundingClientRect().top + sticky - grid.querySelector('.body').getBoundingClientRect().top) / card._pxPerMin;
  };
  const nav = async (label) => {
    root.querySelector(`button[aria-label="${label}"]`).click();
    await settle();
  };
  const selectDate = async (label) => {
    root.querySelector(`.tabs button[aria-label="${label}"]`).click();
    await settle();
  };
  await settle();
  // Don't let the initial smooth Today animation race deliberate manual test scrolling.
  await new Promise((resolve) => setTimeout(resolve, 650));
  board().scrollTo({ top: 620, left: 180, behavior: 'instant' });
  await nextRender();
  const beforeMinute = minute();
  const beforeLeft = board().scrollLeft;
  await selectDate('Wednesday, Feb 18');
  assert(!card._dayScrollAnchor, 'Selecting the already active date retained pending work.');
  assert(board().querySelector('.allday-row'), 'Fixture needs an all-day row.');
  await nav('Next day');
  assert(shown() === 'Thursday, Feb 19', 'Arrow skipped more than one date.');
  assert(root.querySelector('.dayname').textContent.includes('Tomorrow: Feb 19'), 'Heading and selection diverged.');
  assert(!board().querySelector('.allday-row') && !board().querySelector('.event'), 'Previous date content leaked.');
  assert(Math.abs(minute() - beforeMinute) < 2, 'Removing all-day row changed visible time.');
  assert(Math.abs(board().scrollLeft - beforeLeft) < 1, 'Day navigation changed visible people.');
  await nav('Previous day');
  assert(Math.abs(minute() - beforeMinute) < 2, 'Returning to today automatically recentered instead of preserving time.');
  await selectDate('Sunday, Feb 22');
  await nav('Next day');
  assert(shown() === 'Monday, Feb 23' && card._weekOffset === 1, 'Week boundary failed.');
  assert(Math.abs(minute() - beforeMinute) < 2, 'Week-boundary load changed visible time.');
  await nav('Previous day');
  assert(shown() === 'Sunday, Feb 22', 'Reverse week boundary failed.');
  const heading = root.querySelector('.dayname');
  heading.focus();
  heading.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
  await settle();
  assert(shown() === 'Saturday, Feb 21' && root.activeElement === heading, 'Keyboard navigation lost date/focus.');
  heading.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true, bubbles: true }));
  await settle();
  assert(shown() === 'Saturday, Feb 21', 'Modified browser keyboard shortcut was intercepted.');
  root.querySelector('button[aria-label="Previous day"]').click();
  await card.updateComplete; // Queue another date after render but before its scroll frame.
  root.querySelector('button[aria-label="Previous day"]').click();
  await settle();
  assert(shown() === 'Thursday, Feb 19' && Math.abs(minute() - beforeMinute) < 2, 'Rapid pre-frame paging retained stale scroll work.');

  // Week start and weekday-only settings affect boundaries, not step direction.
  card.setConfig({ ...config, first_day: 'sunday', show_weekends: false, scroll_to_now: false });
  await settle();
  await selectDate('Friday, Feb 20');
  await nav('Next day');
  assert(shown() === 'Monday, Feb 23', 'Weekday-only navigation did not skip weekend.');
  await nav('Previous day');
  assert(shown() === 'Friday, Feb 20', 'Weekday-only backward navigation failed.');

  // Delayed and out-of-order ranges retain the latest date and original time anchor.
  card.setConfig({ ...config, scroll_to_now: false });
  await settle();
  await selectDate('Sunday, Feb 22');
  board().scrollTo({ top: 650, behavior: 'instant' });
  await nextRender();
  const pendingMinute = minute();
  const pending = [];
  card.hass = { ...hass, callApi: (...args) => new Promise((resolve) => pending.push(() => hass.callApi(...args).then(resolve))) };
  root.querySelector('button[aria-label="Next day"]').click();
  await nextRender();
  assert(card._loading && pending.length === 2, 'Boundary did not start both reads.');
  root.querySelector('button[aria-label="Next day"]').click();
  await nextRender();
  assert(card._dayScrollAnchor, 'Rapid paging lost the pending scroll anchor.');
  pending.splice(0).forEach((resolve) => resolve());
  await settle();
  assert(shown() === 'Tuesday, Feb 24' && Math.abs(minute() - pendingMinute) < 2, 'Slow load lost latest date/time.');

  // Today cancels pending date restoration, even if its earlier response arrives later.
  for (let i = 0; i < 6; i++) { root.querySelector('button[aria-label="Next day"]').click(); await nextRender(); }
  assert(card._loading, 'Cancellation fixture failed to enter a new range.');
  root.querySelector('button[aria-label="Show today"]').click();
  await nextRender();
  pending.splice(0).reverse().forEach((resolve) => resolve());
  await settle();
  assert(shown() === 'Wednesday, Feb 18' && !card._dayScrollAnchor, 'Stale date restoration overrode Today.');

  card.hass = hass;
  card.setConfig({ ...config, scroll_to_now: false, trim_hours: true, hour_height: 120 });
  await settle();
  board().scrollTo({ top: 400, behavior: 'instant' });
  await nextRender();
  const trimmedMinute = minute();
  await nav('Next day');
  assert(Math.abs(minute() - trimmedMinute) < 2, 'Changing trimmed start hour changed visible clock time.');
  await nav('Previous day');
  assert(Math.abs(minute() - trimmedMinute) < 2, 'Restoring trimmed start hour changed visible clock time.');
  await card._refetch();
  await settle();
  assert(Math.abs(minute() - trimmedMinute) < 2, 'Refresh after navigation stole scroll.');

  // View changes and reconfiguration must invalidate queued navigation work.
  root.querySelector('button[aria-label="Next day"]').click();
  [...root.querySelectorAll('.switch button')].find((b) => b.textContent.trim() === 'Week').click();
  await settle();
  assert(!card._dayScrollAnchor && root.querySelector('.weekwrap'), 'View change retained stale day work.');
  assert(root.querySelector('button[aria-label="Next week"]'), 'Week view lost week-sized navigation.');
  card.setConfig({ ...config, layout: 'legacy' });
  await settle();
  assert(root.querySelector('button[aria-label="Next week"]'), 'Legacy Day navigation changed.');
  card.setConfig(config);
  await settle();
  return [`calendar date navigation: ${innerWidth}px date boundaries, keyboard, scroll context, slow reads, cancellation, legacy`];
}
