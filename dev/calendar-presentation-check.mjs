// Generic fixtures only. Presentation changes must keep dates, filters and details usable.
export async function runCalendarPresentationChecks(card, hass, nextRender) {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const root = card.shadowRoot;
  const original = card._config;
  const longTitle = 'Planning workshop with an unusually long appointment title for the community project';
  const longLocation = 'Community learning center, second floor, room with a very long location name';
  const payload = [
    ...Array.from({length: 7}, (_, i) => ({
      uid: `presentation-${i}`, summary: `Avery + Jordan: ${i === 2 ? longTitle : 'Community workshop'}`,
      location: longLocation,
      start: {dateTime: `2026-02-${16 + i}T16:00:00-06:00`},
      end: {dateTime: `2026-02-${16 + i}T17:00:00-06:00`},
    })),
    {uid: 'presentation-all-day', summary: 'Community Day', start: {date: '2026-02-18'}, end: {date:'2026-02-19'}},
  ];
  let failing = false;
  card.hass = {...hass, callApi: async (method, path) => {
    assert(method === 'GET', 'Presentation attempted a calendar write.');
    if (failing) throw new Error('Synthetic unavailable calendar');
    return path.includes('fixture_family') ? payload : [];
  }, callWS: async () => { throw new Error('Presentation attempted a mutation.'); }};
  const settle = async () => {
    for (let i=0;i<180;i++) { await nextRender(); if (!card._loading) return; }
    throw new Error('Presentation did not settle.');
  };
  const view = async (name) => {
    [...root.querySelectorAll('.switch button')].find(b => b.textContent.trim()===name).click();
    await settle();
  };
  const close = async () => { root.querySelector('.dialog .icon').click(); await nextRender(); };
  const checkDetails = async (opener) => {
    opener.click(); await nextRender();
    assert(root.querySelector('.dialog'), 'Appointment did not open.');
    assert([...root.querySelectorAll('.dialog input, .dialog textarea')].every(i=>i.disabled), 'Details became writable.');
    await close();
  };
  card.setConfig({...original, layout:'wall', view:'agenda', read_only:true, persist_preferences:false,
    refresh_interval:0, full_height:true, show_focus:true, scroll_to_now:false});
  await settle();
  const filterButtons = () => [...root.querySelectorAll('.wall-person-filters button')];
  assert(filterButtons().length === original.persons.length, 'Agenda has no controls for person filters.');
  const assertFilters = () => {
    const bar=root.querySelector('.wall-person-filters');
    assert(bar.scrollWidth >= bar.clientWidth, 'Person filter container is invalid.');
    assert(filterButtons().every(b=>b.getBoundingClientRect().height >= 48), 'Person filter targets are too small.');
    assert(filterButtons().every(b=>b.getAttribute('aria-pressed')==='true'), 'Visible person state is not announced.');
    bar.scrollLeft=bar.scrollWidth; return bar;
  };
  assertFilters();
  const longRow = [...root.querySelectorAll('.agenda-row')].find(r=>r.textContent.includes(longTitle));
  for (const selector of ['.agenda-title','.agenda-meta']) {
    const el=longRow.querySelector(selector);
    assert(el.scrollWidth <= el.clientWidth + 1, `${selector} still clips long content.`);
    assert(getComputedStyle(el).whiteSpace !== 'nowrap', `${selector} still truncates instead of wrapping.`);
  }
  assert(parseFloat(getComputedStyle(longRow.querySelector('.agenda-title')).fontSize) >= 16, 'Agenda title is too small.');
  assert(root.querySelector('.agenda').scrollWidth <= root.querySelector('.agenda').clientWidth+1, 'Agenda overflows horizontally.');
  await checkDetails(longRow);
  filterButtons()[0].click(); await nextRender();
  assert(filterButtons()[0].getAttribute('aria-pressed')==='false', 'Hidden filter not announced.');
  assert(![...root.querySelectorAll('.agenda-meta')].some(e=>e.textContent.startsWith('Avery')), 'Hidden person remains in Agenda.');
  await view('Month');
  assert(filterButtons()[0].getAttribute('aria-pressed')==='false', 'Month lost the filter.');
  filterButtons()[0].click(); await nextRender(); assertFilters();
  const cell = [...root.querySelectorAll('.mcell:not(.out)')].find(c=>c.querySelector('.mdate').textContent.trim()==='18');
  assert(cell.getAttribute('aria-label').includes('February 18, 2026'), 'Month date lacks a complete accessible label.');
  assert(cell.getAttribute('aria-label').includes('2 events'), 'Month counts duplicated owner copies as separate events.');
  const summary=cell.querySelector('.wall-month-summary');
  const shellWidth=root.querySelector('.moran-wall-shell').clientWidth;
  if (shellWidth<=600) {
    assert(getComputedStyle(summary).display!=='none', 'Phone Month has no compact summary.');
    assert(getComputedStyle(cell.querySelector('.mchips')).display==='none', 'Tiny Month chips remain interactive on phone.');
    assert(cell.getBoundingClientRect().width >= 44 && cell.getBoundingClientRect().height >= 64,
      `Month date targets are too small: ${cell.getBoundingClientRect().width}x${cell.getBoundingClientRect().height}, panel ${root.querySelector('.monthwrap').clientWidth}px, shell ${shellWidth}px.`);
    assert(root.querySelector('.monthwrap').scrollWidth<=root.querySelector('.monthwrap').clientWidth+1, 'Phone Month requires horizontal scrolling.');
  } else {
    assert(getComputedStyle(summary).display==='none', 'Desktop Month unexpectedly uses phone summaries.');
    await checkDetails(cell.querySelector('.mchip'));
  }
  cell.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
  await settle();
  assert(root.querySelector('.tabs [aria-selected="true"]').getAttribute('aria-label')==='Wednesday, Feb 18', 'Month keyboard drilldown changed date.');

  await view('Week');
  const day = [...root.querySelectorAll('.wday')].find(d=>d.textContent.includes('18'));
  assert(day && day.getAttribute('aria-label').includes('Feb 18'), 'Week omits the date or accessible day label.');
  const wrap=root.querySelector('.weekwrap');
  const header=root.querySelector('.wphead');
  assert(header.getBoundingClientRect().width>=180, 'Week columns still squeeze appointment titles.');
  const chip=[...root.querySelectorAll('.wchip')].find(c=>c.textContent.includes(longTitle));
  assert(parseFloat(getComputedStyle(chip.querySelector('small')).fontSize)>=13, 'Week times are too small.');
  assert(getComputedStyle(chip.querySelector('span')).whiteSpace!=='nowrap', 'Week titles remain single-line clipped.');
  const beforeX=day.getBoundingClientRect().left;
  wrap.scrollLeft=wrap.scrollWidth; wrap.scrollTop=wrap.scrollHeight; await nextRender();
  assert(Math.abs(day.getBoundingClientRect().left-beforeX)<=1, 'Week date column scrolls out of sight.');
  assert(Math.abs(header.getBoundingClientRect().top-wrap.getBoundingClientRect().top)<=1, 'Week people do not stay pinned.');
  wrap.scrollLeft=0; wrap.scrollTop=0; await nextRender();
  await checkDetails(chip);
  day.click(); await settle();
  assert(root.querySelector('.tabs [aria-selected="true"]').getAttribute('aria-label')==='Wednesday, Feb 18', 'Week drilldown selected the wrong date.');

  await view('Month');
  card.hass={...card.hass,locale:{language:'de-DE',time_format:'24'}}; await nextRender();
  assert(root.querySelector('.wall-person-filters').getAttribute('aria-label')==='Sichtbare Personen', 'Person-filter localization is missing.');
  assert([...root.querySelectorAll('.mcell')].some(c=>c.getAttribute('aria-label').includes('2 Termine')), 'Month counts are not localized.');
  failing=true; await card._refetch(); await nextRender();
  assert(root.querySelector('.calendar-status.banner'), 'Month hides a source failure.');
  assert(filterButtons().length===original.persons.length, 'Recovery state removes filters.');
  failing=false;
  for (const restrictions of [{views:['month']}, {show_weekends:false}]) {
    card.setConfig({...original,layout:'wall',view:'month',read_only:true,persist_preferences:false,...restrictions});
    await settle();
    assert(!root.querySelector('.compact-month'), 'Month hides event chips without a valid Day drilldown.');
    const chip=root.querySelector('.mchip');
    assert(getComputedStyle(chip.parentElement).display!=='none', 'Restricted-view Month has no accessible appointments.');
    await checkDetails(chip);
  }
  card.hass=hass;
  card.setConfig({...original,layout:'legacy',view:'month',persist_preferences:false}); await settle();
  assert(!root.querySelector('.wall-person-filters,.wall-month-summary'), 'Wall presentation leaked into legacy.');
  card.setConfig(original); await settle();
  return [`calendar presentation: ${innerWidth}px readable Week/Agenda, compact Month, filters, locale, details, sticky dates, legacy`];
}
