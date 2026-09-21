/** Generic fixture: reclaimed space must not remove date or status navigation. */
export async function runCalendarChromeChecks(card, hass, nextRender) {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const root = card.shadowRoot;
  const original = card._config;
  const originalNow = card.nowProvider;
  const settle = async () => {
    for (let i=0;i<180;i++) { await nextRender(); if (!card._loading && !card._dayScrollAnchor) { await nextRender(); if (!card._loading && !card._dayScrollAnchor) return; } }
    throw new Error('Compact calendar did not settle.');
  };
  card.setConfig({...original,layout:'wall',view:'day',title:'Moran Calendar',show_focus:true,
    start_hour:0,end_hour:24,trim_hours:false,scroll_to_now:false,remember_preferences:false});
  await settle();
  const header=root.querySelector('.moran-wall-header');
  const title=root.querySelector('.moran-wall-title');
  const clock=root.querySelector('.moran-wall-clock');
  assert(title.textContent.trim()==='Moran Calendar' && clock, 'Calendar title or header clock is missing.');
  const clockText=()=>root.querySelector('.moran-wall-clock').textContent.trim().replace(/\s+/g,' ');
  assert(clockText()==='3:32 PM', 'Header clock does not honor the current 12-hour display time.');
  assert(clock.getAttribute('datetime')===originalNow().toISOString(), 'Header clock lacks its machine-readable instant.');
  assert(getComputedStyle(root.querySelector('.moran-wall-brand')).gap==='12px', 'Title and clock lack the requested 12px spacing.');
  if (innerWidth>700) {
    assert(Math.abs(clock.getBoundingClientRect().left-title.getBoundingClientRect().right-12)<1, 'Visible title-to-time spacing differs from 12px.');
    assert(title.scrollWidth<=title.clientWidth+1, 'Moran Calendar title is clipped at the reference width.');
  }
  card.nowProvider=()=>new Date(originalNow().getTime()+60000); card._onClockTick(); await settle();
  assert(clockText()==='3:33 PM', 'Header clock does not update on the existing minute tick.');
  card.hass={...hass,locale:{...hass.locale,time_format:'24'}}; await nextRender();
  assert(clockText()==='15:33', 'Header clock ignores the HA 24-hour preference.');
  card.nowProvider=originalNow; card.hass=hass; card._onClockTick(); await settle();
  assert(header.getBoundingClientRect().height<=49, 'Calendar header still uses more than one compact row.');
  assert(root.querySelector('.switch').getBoundingClientRect().height<=40, 'View tabs exceed the requested 40px cap.');
  assert(!root.querySelector('.dayhead'), 'Separate Today row still consumes calendar space.');
  const toggle=root.querySelector('.wall-status-toggle');
  const panel=root.querySelector('#wall-status-panel');
  assert(toggle && toggle.getAttribute('aria-expanded')==='false' && panel.hidden, 'Status tiles do not start collapsed.');
  assert(toggle.getAttribute('aria-controls')===panel.id, 'Status disclosure has no controlled panel.');
  const dates=root.querySelector('.wall-datebar .tabs');
  const first=dates.querySelector('button');
  assert(getComputedStyle(first).alignItems==='flex-start', 'Date cells are not left aligned.');
  const number=getComputedStyle(first.querySelector('.wall-day-number'));
  assert(number.fontVariantNumeric!=='tabular-nums' && ['normal','0px'].includes(number.letterSpacing), 'Date numbers keep artificial spacing.');
  const board=root.querySelector('.board');
  await Promise.all(board.getAnimations().map(a=>a.finished.catch(()=>{})));
  assert(board.getBoundingClientRect().top-header.getBoundingClientRect().top<=130, `Fixed calendar chrome still consumes too much height (${board.getBoundingClientRect().top}, ${header.getBoundingClientRect().top}): ${[...root.querySelector('.moran-wall-shell').children].map(e=>`${e.className}:${e.getBoundingClientRect().height}@${e.getBoundingClientRect().top}`).join(', ')}`);
  board.scrollTop=400; await nextRender();
  const beforeTop=board.scrollTop, beforeHeight=board.clientHeight;
  toggle.focus(); toggle.click(); await settle();
  assert(!panel.hidden && toggle.getAttribute('aria-expanded')==='true', 'Status disclosure did not open.');
  assert(root.activeElement===toggle, 'Opening Status tiles stole keyboard focus.');
  assert(panel.querySelector('.fchip').getBoundingClientRect().height>0, 'Expanded Status tiles are blank.');
  assert(board.clientHeight<beforeHeight && Math.abs(board.scrollTop-beforeTop)<2, 'Disclosure lost the calendar scroll position.');
  toggle.click(); await settle();
  assert(panel.hidden && board.clientHeight===beforeHeight, 'Collapsing Status tiles did not reclaim space.');
  const nav=async label=>{root.querySelector(`button[aria-label="${label}"]`).click();await settle();};
  await nav('Next day');
  assert(dates.querySelector('[aria-selected="true"]').getAttribute('aria-label')==='Thursday, Feb 19', 'Compact date controls lost day paging.');
  await nav('Show today');
  assert(dates.querySelector('[aria-selected="true"]').getAttribute('aria-current')==='date', 'Compact Today did not select today.');
  for (const name of ['Timeline','Week','Month','Agenda','Day']) {
    [...root.querySelectorAll('.switch button')].find(b=>b.textContent.trim()===name).click(); await settle();
    assert(root.querySelector('.wall-status-toggle').getAttribute('aria-expanded')==='false', 'Changing view reopened Status tiles.');
  }
  card.setConfig({...original,layout:'wall',view:'day',show_focus:false}); await settle();
  assert(!root.querySelector('.wall-status-toggle,#wall-status-panel'), 'Disabled Status tiles leave an empty disclosure.');
  card.setConfig({...original,layout:'legacy',view:'day',show_focus:true}); await settle();
  assert(root.querySelector('.dayhead,.focus') && !root.querySelector('.wall-status-toggle,.wall-datebar,.moran-wall-clock'), 'Compact chrome leaked into legacy.');
  card.setConfig(original); card.hass=hass; await settle();
  return [`calendar chrome: ${innerWidth}px single row, 40px tabs, status disclosure, left dates, preserved navigation`];
}
