import { agendaContextEvents } from "./calendar-agenda-context-check.mjs";

// Crowded synthetic weeks expose date handoffs hidden by short, empty previews.
export async function runWeekContextChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  let reads = 0;
  let payload = agendaContextEvents;
  let failing = false;
  let deferred;
  card.hass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Week navigation attempted a provider write.");
      reads++;
      if (deferred) await deferred.promise;
      if (failing) throw new Error("Synthetic source failure");
      return path.includes("fixture_family") ? payload : [];
    },
    callWS: async () => {
      throw new Error("Week navigation attempted a mutation.");
    },
  };
  const config = {
    ...card._config,
    layout: "wall",
    view: "day",
    read_only: true,
    views: ["day", "timeline", "week", "month", "agenda"],
    remember_preferences: false,
    refresh_interval: 0,
    scroll_to_now: false,
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
  };
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading) return;
    }
    throw new Error("Week date context did not settle.");
  };
  const setup = async (extra = {}) => {
    card.setConfig({ ...config, ...extra });
    await settle();
  };
  const view = async (label) => {
    [...root.querySelectorAll(".switch button")]
      .find((b) => b.textContent.trim() === label)
      .click();
    await settle();
  };
  const wrap = () => root.querySelector(".weekwrap");
  const aligned = (day) => {
    const row = root.querySelector(`.wday[data-day="${day}"]`);
    const wanted =
      wrap().scrollTop +
      row.getBoundingClientRect().top -
      root.querySelector(".corner").getBoundingClientRect().bottom;
    const expected = Math.max(0, Math.min(wanted, wrap().scrollHeight - wrap().clientHeight));
    assert(
      Math.abs(wrap().scrollTop - expected) < 2,
      `Week did not reveal day ${day}: scroll ${wrap().scrollTop}, expected ${expected}.`,
    );
    const label = row.querySelector(".wall-week-date").getBoundingClientRect();
    assert(
      label.top >= root.querySelector(".corner").getBoundingClientRect().bottom - 1 &&
        label.bottom <= wrap().getBoundingClientRect().bottom + 1,
      "Revealed date label is hidden above or below the Week viewport.",
    );
  };
  await setup();
  root.querySelector('[aria-label="Friday, Feb 20"]').click();
  await settle();
  const before = reads;
  const weekTab = root.querySelector("#view-tab-week");
  weekTab.focus();
  await view("Week");
  aligned(4);
  assert(reads === before, "Same-week navigation added calendar reads.");
  assert(root.activeElement === weekTab, "Date reveal moved keyboard focus.");
  assert(window.scrollY === 0, "Week reveal scrolled the host page.");

  // Today is an explicit reset even if the displayed week is already current.
  wrap().scrollLeft = 160;
  const left = wrap().scrollLeft;
  root.querySelector(".nav-now").click();
  await settle();
  aligned(2);
  assert(wrap().scrollLeft === left, "Today discarded the browsed person columns.");
  wrap().scrollTop = 200;
  await card._refetch();
  await settle();
  card._onClockTick();
  card.style.width = "95%";
  await nextRender();
  assert(Math.abs(wrap().scrollTop - 200) < 2, "Refresh, tick or resize recentered Week.");
  card.style.width = "100%";
  await nextRender();
  const chip = root.querySelectorAll(".wchip")[3];
  chip.focus({ preventScroll: true });
  chip.click();
  await nextRender();
  root.querySelector(".dialog .icon").click();
  await nextRender();
  assert(
    root.activeElement === chip && Math.abs(wrap().scrollTop - 200) < 2,
    "Details lost Week focus or scroll.",
  );
  const clock = card.nowProvider;
  card._day = 4;
  card.nowProvider = () => new Date("2026-02-23T09:00:00-06:00");
  card._onClockTick();
  await settle();
  assert(Math.abs(wrap().scrollTop - 200) < 2, "Week rollover re-centered a browsed date.");
  card.nowProvider = clock;
  card._onClockTick();
  await settle();

  const shifted = agendaContextEvents.map((e) => ({
    ...e,
    uid: `${e.uid}-next`,
    start: { dateTime: new Date(Date.parse(e.start.dateTime) + 7 * 86400000).toISOString() },
    end: { dateTime: new Date(Date.parse(e.end.dateTime) + 7 * 86400000).toISOString() },
  }));
  payload = [...agendaContextEvents, ...shifted];
  root.querySelector('[aria-label="Next week"]').click();
  await settle();
  aligned(4);
  assert(
    root.querySelector('.wday[data-day="4"]').getAttribute("aria-label").includes("Feb 27"),
    "Paging lost the selected weekday.",
  );
  root.querySelector('[aria-label="Previous week"]').click();
  await settle();
  aligned(4);
  root.querySelector(".nav-now").click();
  await settle();
  aligned(2);
  assert(wrap().scrollLeft === left, "Paging lost horizontal context.");

  // Density retains its existing fractional-row anchor, not the selected Day's top.
  wrap().scrollTop += 150;
  const row = root.querySelector('.wday[data-day="2"]');
  const fraction =
    (root.querySelector(".corner").getBoundingClientRect().bottom -
      row.getBoundingClientRect().top) /
    row.offsetHeight;
  root.querySelector(".wall-density-toggle").click();
  await nextRender();
  const slider = root.querySelector("#wall-calendar-density");
  slider.value = "150";
  slider.dispatchEvent(new Event("input", { bubbles: true }));
  await settle();
  const afterFraction =
    (root.querySelector(".corner").getBoundingClientRect().bottom -
      row.getBoundingClientRect().top) /
    row.offsetHeight;
  assert(Math.abs(afterFraction - fraction) < 0.012, "Navigation broke the Week zoom anchor.");
  root.querySelector(".wall-density-panel button").click();
  await settle();

  // Date entry waits for measurable/current data, and yields to subsequent user input.
  const hold = () => {
    let release;
    const promise = new Promise((resolve) => {
      release = resolve;
    });
    deferred = { promise, release };
  };
  const release = async () => {
    const pending = deferred;
    deferred = undefined;
    pending.release();
    await settle();
  };
  payload = agendaContextEvents;
  card.style.display = "none";
  await setup({ view: "week" });
  assert(card._weekScrollAnchor?.date !== undefined, "Hidden Week consumed date navigation.");
  card.style.display = "block";
  await nextRender();
  await nextRender();
  aligned(2);
  hold();
  card.setConfig({ ...config, view: "week" });
  await nextRender();
  assert(card._loading && card._weekScrollAnchor?.date !== undefined, "Slow read lost navigation.");
  await release();
  aligned(2);
  for (const input of [
    new WheelEvent("wheel"),
    new PointerEvent("pointerdown"),
    new KeyboardEvent("keydown", { key: "PageDown" }),
  ]) {
    hold();
    card.setConfig({ ...config, view: "week" });
    await nextRender();
    wrap().dispatchEvent(input);
    assert(!card._weekScrollAnchor, `${input.type} did not cancel Week navigation.`);
    const top = wrap().scrollTop;
    await release();
    assert(Math.abs(wrap().scrollTop - top) < 2, "Late Week load overrode newer input.");
  }
  failing = true;
  await setup({ view: "week" });
  assert(
    card._loadError && card._weekScrollAnchor?.date !== undefined,
    "Failed read established date geometry.",
  );
  failing = false;
  await card._refetch();
  await settle();
  aligned(2);
  hold();
  card.setConfig({ ...config, view: "week" });
  await nextRender();
  [...root.querySelectorAll(".switch button")].find((b) => b.textContent.trim() === "Day").click();
  await nextRender();
  assert(!card._weekScrollAnchor, "Leaving Week retained stale navigation.");
  await release();
  assert(card._view === "day" && !wrap(), "Late read restored an obsolete view.");

  await setup({ view: "week", views: ["week"], first_day: "sunday", show_weekends: false });
  aligned(card._shownDay());
  payload = [];
  await setup({ view: "week" });
  aligned(2);
  assert(!card._weekScrollAnchor, "Healthy empty week left navigation pending.");
  payload = agendaContextEvents;
  await setup({ view: "week", layout: "legacy" });
  assert(wrap().scrollTop === 0 && !card._weekScrollAnchor, "Wall navigation changed legacy.");
  card.style.display = "none";
  await setup({ view: "week" });
  const parent = card.parentNode;
  card.remove();
  assert(!card._weekScrollAnchor, "Disconnect retained a stale Week anchor.");
  parent.append(card);
  card.style.display = "block";
  await setup();
  root.querySelector('[aria-label="Friday, Feb 20"]').click();
  await settle();
  return [
    "week date context: entry/Today/paging, manual browsing/details, density, delayed/hidden/failed reads, input cancellation, weekdays and legacy verified",
  ];
}

export async function runNativeWeekContextChecks(cdp, delay) {
  const evaluate = async (expression) => {
    const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const press = async (key, code) => {
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key,
      windowsVirtualKeyCode: code,
      ...(key === "Enter" ? { text: "\r" } : {}),
    });
    await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, windowsVirtualKeyCode: code });
    await delay(100);
  };
  const state = () =>
    evaluate(`(()=>{
    const r=document.querySelector('moran-family-board-card').shadowRoot,w=r.querySelector('.weekwrap');
    if(!w)return null; const b=w.getBoundingClientRect(),h=r.querySelector('.corner').getBoundingClientRect();
    const day=[...w.querySelectorAll('.wday')].find(n=>n.getBoundingClientRect().bottom>h.bottom+2);
    return {top:w.scrollTop,date:day?.getAttribute('aria-label'),x:b.x+Math.min(b.width-15,130),y:h.bottom+50};
  })()`);
  const mouse = async (selector) => {
    const p = await evaluate(
      `(()=>{const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`,
    );
    for (const type of ["mousePressed", "mouseReleased"]) {
      await cdp.send("Input.dispatchMouseEvent", { type, ...p, button: "left", clickCount: 1 });
    }
    await delay(100);
  };
  await evaluate(
    "document.querySelector('moran-family-board-card').shadowRoot.querySelector('#view-tab-week').focus()",
  );
  await press("Enter", 13);
  assert((await state())?.date.includes("Friday, Feb 20"), "Native Week activation lost Friday.");
  const before = await state();
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseWheel",
    x: before.x,
    y: before.y,
    deltaY: 200,
    deltaX: 0,
  });
  await delay(200);
  assert((await state()).top > before.top + 100, "Week wheel scrolling is trapped.");
  await mouse(".nav-now");
  const today = await state();
  assert(today.date.includes("Wednesday, Feb 18"), "Native Today did not reveal Wednesday.");
  await evaluate(
    "document.querySelector('moran-family-board-card').shadowRoot.querySelector('.weekwrap').focus({preventScroll:true})",
  );
  await press("PageDown", 34);
  await delay(200);
  assert((await state()).top > today.top, "Week keyboard scrolling is trapped.");
  await mouse(".nav-now");
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  const touch = await state();
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: touch.x, y: touch.y + 30, id: 1 }],
  });
  for (let step = 1; step <= 5; step++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: touch.x, y: touch.y + 30 - step * 15, id: 1 }],
    });
    await delay(25);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await delay(300);
  assert((await state()).top > touch.top, "Week touch scrolling is trapped.");
}
