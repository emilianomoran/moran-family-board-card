/** Generic fixture: reclaimed space must not remove date or status navigation. */
export async function runCalendarChromeChecks(card, hass, nextRender) {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const root = card.shadowRoot;
  const original = card._config;
  const settle = async () => {
    for (let i=0;i<180;i++) { await nextRender(); if (!card._loading && !card._dayScrollAnchor) { await nextRender(); if (!card._loading && !card._dayScrollAnchor) return; } }
    throw new Error('Compact calendar did not settle.');
  };
  card.setConfig({...original,layout:'wall',view:'day',title:'Family Board · Preview',show_focus:true,
    start_hour:0,end_hour:24,trim_hours:false,scroll_to_now:false,remember_preferences:false});
  await settle();
  const header=root.querySelector('.moran-wall-header');
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
  assert(root.querySelector('.dayhead,.focus') && !root.querySelector('.wall-status-toggle,.wall-datebar'), 'Compact chrome leaked into legacy.');
  card.setConfig(original); card.hass=hass; await settle();
  return [`calendar chrome: ${innerWidth}px single row, 40px tabs, status disclosure, left dates, preserved navigation`];
}
