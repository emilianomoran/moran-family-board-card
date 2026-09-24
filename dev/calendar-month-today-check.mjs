import { agendaContextEvents } from "./calendar-agenda-context-check.mjs";

// Synthetic busy Month: Today must reveal a date, not merely update internal state.
export async function runMonthTodayChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  let reads = 0;
  let failing = false;
  let deferred;
  let payload = agendaContextEvents;
  card.hass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Month Today attempted a provider write.");
      reads++;
      if (deferred) await deferred.promise;
      if (failing) throw new Error("Synthetic source failure");
      return path.includes("fixture_family") ? payload : [];
    },
    callWS: async () => {
      throw new Error("Month Today attempted a mutation.");
    },
  };
  const config = {
    ...card._config,
    layout: "wall",
    view: "month",
    views: ["month"],
    read_only: true,
    remember_preferences: false,
    refresh_interval: 0,
  };
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading) return;
    }
    throw new Error("Month Today did not settle.");
  };
  const setup = async (extra = {}) => {
    card.setConfig({ ...config, ...extra });
    await settle();
  };
  const wrap = () => root.querySelector(".monthwrap");
  const today = () => root.querySelector(".mcell.today");
  const button = () => root.querySelector(".weeknav .nav-now");
  const visible = () => {
    const box = wrap().getBoundingClientRect();
    const date = today().querySelector(".mdate").getBoundingClientRect();
    const head = root.querySelector(".monthhead").getBoundingClientRect();
    assert(
      date.top >= Math.max(box.top, head.bottom) - 1 &&
        date.bottom <= box.bottom + 1 &&
        date.left >= box.left - 1 &&
        date.right <= box.right + 1,
      `Today date remains outside Month viewport: date ${date.x},${date.y}; panel ${box.x},${box.y},${box.width},${box.height}.`,
    );
  };
  const go = async () => {
    button().click();
    await settle();
    visible();
  };
  await setup();
  wrap().scrollTop = wrap().scrollHeight;
  wrap().scrollLeft = wrap().scrollWidth;
  button().focus({ preventScroll: true });
  const before = reads;
  await go();
  assert(reads === before, "Same-month Today added calendar reads.");
  assert(root.activeElement === button() && scrollY === 0, "Today moved focus or the host page.");
  assert(button().getAttribute("aria-label").includes("Today"), "Month's Today action is unnamed.");
  assert(!card._monthScrollDate, "Successful Today request was not consumed.");
  const position = () => [wrap().scrollTop, wrap().scrollLeft];
  const equalPosition = (p) => position().every((v, i) => Math.abs(v - p[i]) < 2);
  const atToday = position();
  await go();
  assert(equalPosition(atToday), "Already visible Today unnecessarily repositioned the grid.");

  wrap().scrollTop = 100;
  wrap().scrollLeft = 100;
  const manual = position();
  await card._refetch();
  await settle();
  card._onClockTick();
  await nextRender();
  assert(equalPosition(manual), "Refresh or clock tick overrode manual Month browsing.");
  card.style.width = "95%";
  await nextRender();
  // Width changes may clamp horizontal limits; vertical browsing must remain intact.
  assert(Math.abs(wrap().scrollTop - manual[0]) < 2, "Resize recentered Month.");
  card.style.width = "100%";
  await nextRender();
  const chip = today().querySelector(".mchip");
  chip.focus({ preventScroll: true });
  chip.click();
  await nextRender();
  root.querySelector(".dialog .icon").click();
  await nextRender();
  assert(
    root.activeElement === chip && Math.abs(wrap().scrollTop - manual[0]) < 2,
    "Details lost Month focus or vertical scroll.",
  );
  today().querySelector(".mmore").click();
  await nextRender();
  assert(card._expandedMonthDate !== undefined, "Overflow fixture did not expand.");
  await go();
  assert(card._expandedMonthDate === undefined, "Today retained expanded overflow.");
  root.querySelector('[aria-label="Next month"]').click();
  await settle();
  wrap().scrollTop = wrap().scrollHeight;
  await go();
  assert(button().textContent.trim() === "February 2026", "Today did not return to this month.");

  const hold = () => {
    let release;
    const promise = new Promise((r) => {
      release = r;
    });
    deferred = { promise, release };
  };
  const release = async () => {
    const pending = deferred;
    deferred = undefined;
    pending.release();
    await settle();
  };
  card.style.display = "none";
  await setup();
  button().click();
  await nextRender();
  assert(card._monthScrollDate !== undefined, "Hidden layout consumed Month Today.");
  card.style.display = "block";
  await nextRender();
  await nextRender();
  visible();
  hold();
  card.setConfig(config);
  await nextRender();
  button().click();
  await nextRender();
  assert(card._monthScrollDate !== undefined && card._loading, "Slow read lost Today intent.");
  await release();
  visible();
  for (const event of [
    new WheelEvent("wheel"),
    new PointerEvent("pointerdown"),
    new KeyboardEvent("keydown", { key: "PageDown" }),
  ]) {
    hold();
    card.setConfig(config);
    await nextRender();
    button().click();
    await nextRender();
    wrap().dispatchEvent(event);
    const p = position();
    assert(card._monthScrollDate === undefined, `${event.type} did not cancel pending Today.`);
    await release();
    assert(equalPosition(p), "Delayed Today overrode newer input.");
  }
  failing = true;
  await setup();
  button().click();
  await nextRender();
  assert(card._monthScrollDate !== undefined, "Failed data consumed Month Today.");
  failing = false;
  await card._refetch();
  await settle();
  visible();
  payload = [];
  await setup();
  await go();
  assert(
    !card._loadError && card._monthScrollDate === undefined,
    "Healthy empty Month left pending work.",
  );
  payload = agendaContextEvents;
  await setup({ views: ["day", "month"] });
  await go();
  // Normal compact Month and restricted grids must both work; entry remains unchanged.
  await setup({ first_day: "sunday", show_weekends: false });
  await go();
  card.hass = { ...card.hass, locale: { ...hass.locale, language: "de" } };
  await nextRender();
  assert(button().getAttribute("aria-label").includes("Heute"), "Today action ignored locale.");
  card.hass = { ...card.hass, locale: hass.locale };
  await nextRender();
  const clock = card.nowProvider;
  for (const leave of ["paging", "view", "config", "disconnect", "midnight", "kiosk"]) {
    await setup({ views: ["day", "month"], auto_return: 1 });
    card.style.display = "none";
    await nextRender();
    button().click();
    await nextRender();
    if (leave === "paging") root.querySelector('[aria-label="Next month"]').click();
    if (leave === "view") root.querySelector("#view-tab-day").click();
    if (leave === "config") card.setConfig(config);
    if (leave === "midnight") {
      card.nowProvider = () => new Date("2026-02-19T00:01:00-06:00");
      card._onClockTick();
    }
    if (leave === "kiosk") {
      card._lastInteract = Date.now() - 120000;
      card._kioskReturn();
    }
    if (leave === "disconnect") {
      const parent = card.parentNode;
      card.remove();
      parent.append(card);
    }
    await nextRender();
    assert(card._monthScrollDate === undefined, `${leave} retained obsolete Today intent.`);
    card.nowProvider = clock;
    card._onClockTick();
    card.style.display = "block";
    await settle();
  }
  await setup({ layout: "legacy" });
  wrap().scrollTop = 50;
  const legacy = position();
  button().click();
  await settle();
  assert(
    equalPosition(legacy) && card._monthScrollDate === undefined,
    "Wall Today changed legacy Month.",
  );
  await setup();
  wrap().scrollTop = wrap().scrollHeight;
  wrap().scrollLeft = wrap().scrollWidth;
  return [
    "month today: visible date, two-axis scroll, current data, cancellation, manual context, overflow, locale and legacy verified",
  ];
}

export async function runNativeMonthTodayChecks(cdp, delay) {
  const evaluate = async (expression) => {
    const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };
  const point = () =>
    evaluate(
      `(()=>{const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector('.weeknav .nav-now').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`,
    );
  const visible = async () => {
    await delay(150);
    const ok = await evaluate(
      `(()=>{const r=document.querySelector('moran-family-board-card').shadowRoot,w=r.querySelector('.monthwrap').getBoundingClientRect(),h=r.querySelector('.monthhead').getBoundingClientRect(),d=r.querySelector('.mcell.today .mdate').getBoundingClientRect();return d.top>=Math.max(w.top,h.bottom)-1&&d.bottom<=w.bottom+1&&d.left>=w.left-1&&d.right<=w.right+1;})()`,
    );
    if (!ok) throw new Error("Native Today did not reveal the current date.");
  };
  await evaluate(
    "document.querySelector('moran-family-board-card').shadowRoot.querySelector('.weeknav .nav-now').focus()",
  );
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    windowsVirtualKeyCode: 13,
    text: "\r",
  });
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    windowsVirtualKeyCode: 13,
  });
  await visible();
  const moveAway = () =>
    evaluate(
      "(()=>{const w=document.querySelector('moran-family-board-card').shadowRoot.querySelector('.monthwrap');w.scrollTop=w.scrollHeight;w.scrollLeft=w.scrollWidth;})()",
    );
  await moveAway();
  const p = await point();
  for (const type of ["mousePressed", "mouseReleased"])
    await cdp.send("Input.dispatchMouseEvent", { type, ...p, button: "left", clickCount: 1 });
  await visible();
  await moveAway();
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ ...p, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await visible();
}
