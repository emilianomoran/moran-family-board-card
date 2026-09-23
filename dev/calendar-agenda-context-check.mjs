// Synthetic date-navigation fixtures, also available in the opt-in review preview.
export const agendaContextEvents = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 12 }, (_, i) => ({
    uid: `agenda-context-${day}-${i}`,
    summary: `Avery: Appointment ${i + 1}`,
    start: { dateTime: `2026-02-${16 + day}T15:00:00-06:00` },
    end: { dateTime: `2026-02-${16 + day}T16:00:00-06:00` },
  })),
).flat();

export async function runAgendaContextChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const original = card._config;
  let reads = 0;
  let payload = agendaContextEvents;
  let failing = false;
  let deferred;
  card.hass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Agenda attempted a provider write.");
      reads++;
      if (deferred) await deferred.promise;
      if (failing) throw new Error("Synthetic source failure");
      return path.includes("fixture_family") ? payload : [];
    },
    callWS: async () => {
      throw new Error("Agenda attempted a mutation.");
    },
  };
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading) return;
    }
    throw new Error("Agenda date context did not settle.");
  };
  const config = {
    ...original,
    layout: "wall",
    view: "day",
    read_only: true,
    views: ["day", "timeline", "week", "month", "agenda"],
    remember_preferences: false,
    refresh_interval: 0,
    max_columns: 1,
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    scroll_to_now: true,
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
  const agenda = () => root.querySelector(".agenda");
  const group = (date) =>
    [...root.querySelectorAll(".agenda-day")].find((node) =>
      node.querySelector(".agenda-date").textContent.includes(date),
    );
  const aligned = (date) => {
    const scroller = agenda();
    const node = group(date);
    assert(node, `No Agenda group for ${date}.`);
    const wanted =
      scroller.scrollTop + node.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    const expected = Math.max(0, Math.min(wanted, scroller.scrollHeight - scroller.clientHeight));
    assert(
      Math.abs(scroller.scrollTop - expected) < 2,
      `Agenda did not reveal ${date}: scroll ${scroller.scrollTop}, expected ${expected}.`,
    );
  };
  await setup();
  const before = reads;
  await view("Agenda");
  aligned("Feb 18");
  assert(reads === before, "Same-week Agenda navigation added calendar reads.");

  // Browse elsewhere: neither a refresh, resize, tick nor details may reapply the anchor.
  agenda().scrollTop = 250;
  await nextRender();
  await card._refetch();
  await settle();
  card._onClockTick();
  card.style.width = "95%";
  await nextRender();
  assert(Math.abs(agenda().scrollTop - 250) < 2, "Refresh or resize reset manual Agenda browsing.");
  card.style.width = "100%";
  await nextRender();
  const clock = card.nowProvider;
  const selectedDay = card._day;
  card._day = 4; // a browsed Friday must stay absolute when the current week changes
  card.nowProvider = () => new Date("2026-02-23T09:00:00-06:00");
  card._onClockTick();
  await settle();
  assert(Math.abs(agenda().scrollTop - 250) < 2, "Automatic week rollover reset manual browsing.");
  card.nowProvider = clock;
  card._onClockTick();
  await settle();
  card._day = selectedDay;
  await nextRender();
  const row = group("Feb 16").querySelectorAll(".agenda-row")[4];
  row.focus({ preventScroll: true });
  row.click();
  await nextRender();
  root.querySelector(".dialog .icon").click();
  await nextRender();
  assert(
    root.activeElement === row && Math.abs(agenda().scrollTop - 250) < 2,
    "Agenda details lost focus or manual scroll context.",
  );
  root.querySelector(".nav-now").click();
  await settle();
  aligned("Feb 18");
  assert(window.scrollY === 0, "Agenda date reveal scrolled the host page.");

  // Later-date Day +N must use the same handoff, without changing the selected date.
  await view("Day");
  root.querySelector('[aria-label="Friday, Feb 20"]').click();
  await settle();
  root.querySelector(".event.overflow").click();
  await settle();
  aligned("Feb 20");
  assert(card._view === "agenda" && card._day === 4, "Day overflow lost Friday context.");

  const shift = (days) =>
    agendaContextEvents.map((e) => ({
      ...e,
      uid: `${e.uid}-${days}`,
      start: { dateTime: new Date(Date.parse(e.start.dateTime) + days * 86400000).toISOString() },
      end: { dateTime: new Date(Date.parse(e.end.dateTime) + days * 86400000).toISOString() },
    }));
  payload = [...shift(-7), ...agendaContextEvents, ...shift(7)];
  root.querySelector('[aria-label="Next week"]').click();
  await settle();
  aligned("Feb 27");
  root.querySelector('[aria-label="Previous week"]').click();
  await settle();
  aligned("Feb 20");
  root.querySelector(".nav-now").click();
  await settle();
  aligned("Feb 18");

  // No events on the selected date: reveal a real later group; never mislabel it.
  payload = agendaContextEvents.filter((e) => !e.start.dateTime.includes("2026-02-18"));
  await setup({ view: "agenda", views: ["agenda"] });
  aligned("Feb 19");
  payload = agendaContextEvents.filter((e) => e.start.dateTime < "2026-02-18");
  await setup({ view: "agenda" });
  aligned("Feb 17");
  payload = [];
  await setup({ view: "agenda" });
  assert(
    agenda().textContent.includes("No events") && card._agendaScrollDate === undefined,
    "Healthy empty Agenda did not finish navigation.",
  );

  // Initial load waits for data; hidden cards wait for measurable layout.
  payload = agendaContextEvents;
  card.style.display = "none";
  await setup({ view: "agenda" });
  assert(card._agendaScrollDate !== undefined, "Hidden Agenda consumed its pending date.");
  card.style.display = "block";
  await nextRender();
  await nextRender();
  aligned("Feb 18");
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
  hold();
  card.setConfig({ ...config, view: "agenda" });
  await nextRender();
  assert(card._loading && card._agendaScrollDate !== undefined, "Delayed load lost pending date.");
  await release();
  aligned("Feb 18");
  for (const event of [
    new WheelEvent("wheel"),
    new PointerEvent("pointerdown"),
    new KeyboardEvent("keydown", { key: "PageDown" }),
  ]) {
    hold();
    card.setConfig({ ...config, view: "agenda" });
    await nextRender();
    agenda().dispatchEvent(event);
    assert(
      card._agendaScrollDate === undefined,
      `${event.type} did not cancel delayed navigation.`,
    );
    await release();
    assert(agenda().scrollTop === 0, "Late load overrode newer Agenda input.");
  }

  // Failed sources remain honest; retry completes only navigation that is still pending.
  failing = true;
  await setup({ view: "agenda" });
  assert(
    card._loadError && card._agendaScrollDate !== undefined,
    "Failed read was treated as a healthy empty Agenda.",
  );
  failing = false;
  await card._refetch();
  await settle();
  aligned("Feb 18");
  hold();
  card.setConfig({ ...config, view: "agenda" });
  await nextRender();
  [...root.querySelectorAll(".switch button")].find((b) => b.textContent.trim() === "Day").click();
  await nextRender();
  assert(card._agendaScrollDate === undefined, "Leaving Agenda retained a stale navigation.");
  await release();
  assert(card._view === "day" && !agenda(), "Late read restored an old view.");

  await setup({ view: "agenda", first_day: "sunday", show_weekends: false });
  aligned("Feb 18");
  await setup({ view: "agenda", scroll_to_now: false });
  aligned("Feb 18");
  agenda().scrollTop = 250;
  root.querySelectorAll(".wall-person-filters button")[1].click();
  await nextRender();
  assert(Math.abs(agenda().scrollTop - 250) < 2, "Person filter recentered manual browsing.");
  await setup({ layout: "legacy", view: "agenda" });
  assert(
    agenda().scrollTop === 0 && !root.querySelector(".agenda-day[data-date]"),
    "Wall Agenda navigation changed legacy behavior.",
  );
  await setup({ view: "agenda" });
  aligned("Feb 18");
  const parent = card.parentElement;
  card.remove();
  assert(card._agendaScrollDate === undefined, "Disconnect retained a pending Agenda navigation.");
  parent.append(card);
  await settle();
  assert(!card._loadError, "Reattached Agenda did not recover.");
  await setup();
  return [
    "agenda date context: entry/overflow/Today/week paging, manual browsing/details, sparse/empty/failed reads, hidden/delayed/cancelled navigation and legacy verified",
  ];
}

export async function runNativeAgendaContextChecks(cdp, delay) {
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
    const r=document.querySelector('moran-family-board-card').shadowRoot,a=r.querySelector('.agenda');
    if(!a)return null;const b=a.getBoundingClientRect();
    const day=[...a.querySelectorAll('.agenda-day')].find(n=>n.getBoundingClientRect().bottom>b.top+2);
    return {top:a.scrollTop,date:day?.querySelector('.agenda-date').textContent,
      focus:r.activeElement?.textContent.trim(),x:b.x+b.width/2,y:b.y+Math.min(80,b.height/2)};
  })()`);
  const mouse = async (selector) => {
    const point = await evaluate(
      `(()=>{const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`,
    );
    for (const type of ["mousePressed", "mouseReleased"]) {
      await cdp.send("Input.dispatchMouseEvent", { type, ...point, button: "left", clickCount: 1 });
    }
    await delay(100);
  };
  await evaluate(
    `(()=>{const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector('.event.overflow');b.scrollIntoView({block:'center'});b.focus();})()`,
  );
  await press("Enter", 13);
  assert((await state())?.date.includes("Feb 18"), "Native Day +N did not reveal Wednesday.");
  const before = await state();
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseWheel",
    x: before.x,
    y: before.y,
    deltaY: 200,
    deltaX: 0,
  });
  await delay(200);
  assert((await state()).top > before.top + 100, "Agenda does not scroll with a mouse wheel.");
  await mouse(".nav-now");
  assert(
    (await state()).date.includes("Feb 18") && Math.abs((await state()).top - before.top) < 2,
    "Native Today did not return to the selected date.",
  );
  await evaluate(
    "document.querySelector('moran-family-board-card').shadowRoot.querySelector('.agenda').focus({preventScroll:true})",
  );
  await press("PageDown", 34);
  await delay(200);
  assert((await state()).top > before.top, "Agenda keyboard scrolling is trapped.");
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
  assert((await state()).top > touch.top, "Agenda native touch scrolling is trapped.");
}
