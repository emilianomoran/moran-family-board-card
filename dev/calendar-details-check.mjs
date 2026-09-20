/** Read-only details must not silently retain an obsolete appointment snapshot. */
export async function runCalendarDetailsChecks(card, hass, nextRender) {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const root = card.shadowRoot;
  let revision = 1;
  let failing = false;
  let allDay = false;
  let deferred = false;
  const pending = [];
  const event = () => ({
    uid: 'details-fixture',
    summary: `Avery: Revision ${revision}`,
    start: allDay ? { date: '2026-02-18' } : { dateTime: `2026-02-18T${revision === 1 ? '16' : '17'}:00:00-06:00` },
    end: allDay ? { date: '2026-02-20' } : { dateTime: '2026-02-18T18:00:00-06:00' },
    location: `Room ${revision}`,
  });
  const connection = {
    ...hass,
    states: {
      ...hass.states,
      'calendar.fixture_family': {
        ...hass.states['calendar.fixture_family'],
        attributes: { ...hass.states['calendar.fixture_family'].attributes, supported_features: 7 },
      },
    },
    callApi: async (method, path) => {
      assert(method === 'GET', 'Details attempted a calendar write.');
      if (failing) throw new Error('Synthetic outage');
      const payload = path.includes('fixture_family') && revision < 3 ? [event()] : [];
      return deferred ? new Promise(resolve => pending.push(() => resolve(payload))) : payload;
    },
    callWS: async () => { throw new Error('Details attempted a mutation.'); },
  };
  card.hass = connection;
  card.setConfig({ ...card._config, read_only: true, scroll_to_now: false, refresh_interval: 0 });
  await card._refetch();
  await nextRender();
  const opener = root.querySelector('.board .event');
  assert(opener, 'Details fixture event did not render.');
  opener.focus({ preventScroll: true });
  opener.click();
  await nextRender();
  assert(root.querySelector('.dialog input[type="text"]').value === 'Revision 1', 'Baseline details mismatch.');
  const dialog = root.querySelector('.dialog');
  assert(dialog.scrollWidth <= dialog.clientWidth + 1, 'Event details overflow horizontally at this width.');
  const bounds = dialog.getBoundingClientRect();
  assert(bounds.top >= 0 && bounds.bottom <= innerHeight && bounds.left >= 0 && bounds.right <= innerWidth, 'Dialog escapes viewport.');
  for (const button of dialog.querySelectorAll('button')) {
    const rect = button.getBoundingClientRect();
    assert(rect.width >= 48 && rect.height >= 48, 'Dialog action is too small for touch.');
  }
  const close = root.querySelector('.dialog .icon');
  const cancel = root.querySelector('.dialog .ghost');
  assert(root.activeElement === close, 'Read-only dialog did not focus its Close control.');
  assert(root.querySelector('.moran-wall-shell').inert, 'Background calendar remains interactive behind the modal.');
  const tabKey = (shiftKey = false) => {
    const key = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, composed: true, cancelable: true });
    root.activeElement.dispatchEvent(key);
    assert(key.defaultPrevented, 'Tab escaped the dialog boundary.');
  };
  tabKey(true);
  assert(root.activeElement === cancel, 'Shift+Tab did not wrap to the last dialog control.');
  tabKey();
  assert(root.activeElement === close, 'Tab did not wrap back to Close.');
  revision = 2;
  deferred = true;
  const refresh = card._refetch();
  await nextRender();
  assert(root.querySelector('.details-status').textContent.includes('Checking for updates'), 'In-flight details still appear verified.');
  pending.splice(0).forEach(resolve => resolve());
  await refresh;
  deferred = false;
  await nextRender();
  assert(root.querySelector('.dialog input[type="text"]').value === 'Revision 2', 'Open details retained an obsolete appointment after calendar refresh.');
  assert(root.querySelector('.dialog input[type="datetime-local"]').value.endsWith('17:00'), 'Moved appointment retained its old time.');
  assert([...root.querySelectorAll('.dialog input, .dialog textarea')].every(el => el.disabled), 'Read-only details became writable.');
  assert(root.querySelector('.details-status').textContent.includes('updated'), 'Updated details were not announced.');
  assert(root.activeElement === close, 'A poll stole dialog keyboard focus.');
  allDay = true;
  await card._refetch();
  await nextRender();
  assert(root.querySelector('.dialog input[type="checkbox"]').checked, 'Changed all-day flag did not refresh.');
  assert(root.querySelectorAll('.dialog input[type="date"]')[1].value === '2026-02-19', 'All-day details lost exclusive-end normalization.');
  failing = true;
  await card._refetch();
  await nextRender();
  assert(root.querySelector('.details-status').textContent.includes('Could not verify'), 'Source failure did not mark details unverified.');
  assert(!root.querySelector('.dialog .maplink'), 'Unverified location still exposes a navigation link.');
  assert(root.querySelector('.dialog input[type="text"]').value === 'Revision 2', 'Outage discarded inspected details.');
  failing = false;
  revision = 3;
  root.querySelector('.details-status .retry').click();
  await card._pendingFetch?.promise;
  await nextRender();
  assert(root.querySelector('.details-status').textContent.includes('not found'), 'Missing event retained an apparently current dialog.');
  assert(!root.querySelector('.dialog .maplink'), 'Missing event retained an active old location link.');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await nextRender();
  assert(!root.querySelector('.dialog') && !root.querySelector('.moran-wall-shell').inert, 'Close left an inert calendar or open dialog.');
  assert(root.activeElement === root.querySelector('.dayname'), 'Removed opener did not restore focus to date navigation.');

  // Ordinary close returns to a surviving opener without moving the calendar.
  allDay = false;
  revision = 1;
  await card._refetch();
  await nextRender();
  const restoredOpener = root.querySelector('.board .event');
  const board = root.querySelector('.board');
  board.scrollTop = 100;
  const scrollBefore = board.scrollTop;
  restoredOpener.focus({ preventScroll: true });
  restoredOpener.click();
  await nextRender();
  root.querySelector('.dialog .icon').click();
  await nextRender();
  assert(root.activeElement === restoredOpener && board.scrollTop === scrollBefore, 'Ordinary close lost the opener or scroll position.');

  // Background refresh must not overwrite a draft in the upstream editable mode.
  revision = 1;
  card.setConfig({ ...card._config, read_only: false });
  await card._refetch();
  await nextRender();
  root.querySelector('.board .event').click();
  await nextRender();
  const title = root.querySelector('.dialog input[type="text"]');
  assert(!title.disabled, 'Editable draft fixture is not actually writable.');
  title.value = 'My unsaved draft';
  title.dispatchEvent(new Event('input', { bubbles: true }));
  revision = 2;
  await card._refetch();
  await nextRender();
  assert(title.value === 'My unsaved draft', 'A poll replaced an editable draft.');
  card._closeDialog();
  await nextRender();
  return [`calendar details: ${innerWidth}px refreshed/missing/unavailable event, read-only fields, modal focus, editable draft isolation`];
}
