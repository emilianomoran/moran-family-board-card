// Synthetic fixtures: changing presentation must not jump to an unrelated date.
export async function runCalendarViewContextChecks(card, hass, nextRender) {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const root = card.shadowRoot;
  const config = card._config;
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading) return;
    }
    throw new Error('View context did not settle.');
  };
  const view = async (label) => {
    [...root.querySelectorAll('.switch button')].find(b => b.textContent.trim() === label).click();
    await settle();
  };
  const nav = async (label) => {
    root.querySelector(`button[aria-label="${label}"]`).click();
    await settle();
  };
  const selected = () => root.querySelector('.tabs [aria-selected="true"]')?.getAttribute('aria-label');
  const month = () => root.querySelector('.weeknav .nav-now')?.textContent.trim();
  const monthDay = async (day) => {
    [...root.querySelectorAll('.mcell:not(.out)')].find(c => c.querySelector('.mdate').textContent.trim() === String(day)).click();
    await settle();
  };
  card.setConfig({ ...config, layout: 'wall', view: 'day', read_only: true, persist_preferences: false, scroll_to_now: false });
  await settle();
  root.querySelector('.header-row .phead').click();
  await settle();
  await view('Week');
  for (let i = 0; i < 3; i++) await nav('Next week');
  await view('Day');
  assert(selected() === 'Wednesday, Mar 11', 'Week-to-Day lost the browsed date.');
  await view('Timeline');
  assert(selected() === 'Wednesday, Mar 11', 'Timeline lost the browsed date.');
  await view('Month');
  assert(month() === 'March 2026', 'Switching to Month jumped away from the browsed date.');
  await nav('Next month');
  await view('Agenda');
  assert(card._dateForDay(card._shownDay()).getTime() === new Date(2026, 3, 11).getTime(), 'Month-to-Agenda lost the browsed month/date.');
  await view('Week');
  await view('Day');
  assert(selected() === 'Saturday, Apr 11', 'Returning to Day lost the month navigation context.');
  assert(card._hiddenP.length === 1 && card._hiddenP[0] === 0, 'Changing views reset person filters.');

  // A clicked month cell must override the implicit view-switch date.
  await view('Month');
  await nav('Previous month');
  await monthDay(31);
  assert(selected() === 'Tuesday, Mar 31', 'Explicit month drilldown was overwritten by the anchor.');
  await view('Month');
  await nav('Next month');
  await nav('Previous month');
  await view('Day');
  assert(selected() === 'Tuesday, Mar 31', 'Month browsing discarded the preferred day.');
  await view('Month');
  await nav('Next month');
  await view('Day');
  assert(selected() === 'Thursday, Apr 30', 'Shorter month did not clamp to its final date.');

  await view('Month');
  root.querySelector('.weeknav .nav-now').click();
  await settle();
  await view('Day');
  assert(selected() === 'Wednesday, Feb 18', 'This month did not reset the day context to today.');

  card.setConfig({ ...config, layout: 'wall', first_day: 'sunday', show_weekends: false, scroll_to_now: false });
  await settle();
  await view('Month');
  await nav('Next month');
  await monthDay(31);
  await view('Month');
  await nav('Next month');
  await nav('Next month');
  await view('Day');
  assert(selected() === 'Friday, May 29', 'Weekday-only context escaped the selected month.');

  // Legacy users retain their independent Month navigation.
  card.setConfig({ ...config, layout: 'legacy', view: 'day', persist_preferences: false });
  await settle();
  await view('Month');
  root.querySelector('.weeknav .nav-now').click();
  await settle();
  await view('Week');
  root.querySelector('.weeknav .nav-now').click();
  await settle();
  for (let i = 0; i < 3; i++) await nav('Next week');
  await view('Month');
  assert(month() === 'February 2026', 'Legacy Month navigation changed.');
  card.setConfig(config);
  await settle();
  return [`calendar view context: ${innerWidth}px date continuity, filters, month boundaries, explicit drilldown, Today, weekdays, legacy`];
}
