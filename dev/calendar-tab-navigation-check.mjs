// Synthetic keyboard navigation; no provider or household data.
export async function runTabNavigationChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const original = card._config;
  let reads = 0;
  card.hass = {
    ...hass,
    callApi: async (...args) => {
      reads++;
      return hass.callApi(...args);
    },
  };
  const config = {
    ...original,
    layout: "wall",
    view: "day",
    views: ["day", "timeline", "week", "month", "agenda"],
    remember_preferences: false,
    read_only: true,
    scroll_to_now: false,
    refresh_interval: 0,
  };
  const settle = async () => {
    for (let i = 0; i < 100; i++) {
      await nextRender();
      if (!card._loading) return;
    }
    throw new Error("Tab navigation load did not settle.");
  };
  const setup = async (extra = {}) => {
    card.setConfig({ ...config, ...extra });
    await settle();
  };
  const key = async (button, name, modifiers = {}) => {
    const event = new KeyboardEvent("keydown", {
      key: name,
      bubbles: true,
      cancelable: true,
      ...modifiers,
    });
    button.dispatchEvent(event);
    await nextRender();
    return event;
  };
  const tabs = (selector) => [...root.querySelectorAll(`${selector} [role=tab]`)];
  const check = async (selector) => {
    const group = root.querySelector(selector);
    const buttons = tabs(selector);
    assert(group.getAttribute("aria-label"), "Tab group has no accessible name.");
    assert(
      buttons.filter((b) => b.tabIndex === 0).length === 1,
      "Tab traverses every option instead of one group stop.",
    );
    const selected = group.querySelector('[aria-selected="true"]');
    assert(selected.tabIndex === 0, "Entering a tab group does not target its selection.");
    const panel = root.getElementById(selected.getAttribute("aria-controls"));
    assert(panel?.getAttribute("role") === "tabpanel", "Tabs have no associated calendar panel.");
    assert(
      panel.getAttribute("aria-labelledby").split(" ").includes(selected.id),
      "Panel is not named by its active tab.",
    );
    selected.focus();
    await nextRender();
    const before = { reads, view: card._view, day: card._day, week: card._weekOffset };
    const scroller = root.querySelector(".board, .tlwrap");
    if (scroller) scroller.scrollTop = 260;
    const scroll = scroller?.scrollTop;
    await key(selected, "End");
    assert(root.activeElement === buttons.at(-1), "End did not focus the last tab.");
    await key(root.activeElement, "ArrowRight");
    assert(root.activeElement === buttons[0], "Right arrow did not wrap to the first tab.");
    await key(root.activeElement, "ArrowLeft");
    assert(root.activeElement === buttons.at(-1), "Left arrow did not wrap to the last tab.");
    const rect = root.activeElement.getBoundingClientRect(),
      outer = group.getBoundingClientRect();
    assert(
      rect.left >= outer.left - 1 && rect.right <= outer.right + 1,
      "Focused tab remains clipped in its track.",
    );
    await key(root.activeElement, "Home");
    assert(root.activeElement === buttons[0], "Home did not focus the first tab.");
    assert(
      card._view === before.view &&
        card._day === before.day &&
        card._weekOffset === before.week &&
        reads === before.reads,
      "Focus alone changed calendars/date or started a read.",
    );
    assert(!scroller || scroller.scrollTop === scroll, "Tab focus displaced the calendar scroll.");
    for (const [name, modifiers] of [
      ["ArrowDown", {}],
      ["ArrowUp", {}],
      ["ArrowRight", { ctrlKey: true }],
      ["Home", { metaKey: true }],
    ]) {
      const event = await key(root.activeElement, name, modifiers);
      assert(
        !event.defaultPrevented && root.activeElement === buttons[0],
        "Tab handler consumed a browser/unrelated key.",
      );
    }
    const outside = root.querySelector(".wall-density-toggle, .nav");
    outside.focus();
    await nextRender();
    assert(
      buttons.filter((b) => b.tabIndex === 0).length === 1 && selected.tabIndex === 0,
      "Leaving a group did not restore the selected entry stop.",
    );
  };
  await setup();
  await check(".switch");
  await check(".tabs");
  for (const view of config.views) {
    root.querySelector(`#view-tab-${view}`).click();
    await settle();
    const panel = root.querySelector("#calendar-panel");
    assert(
      panel?.getAttribute("aria-labelledby").includes(`view-tab-${view}`),
      "Active panel lost its view label.",
    );
    assert(
      root.querySelectorAll("#calendar-panel").length === 1,
      "Multiple active panels share an ID.",
    );
    panel.focus();
    await nextRender();
    assert(
      parseFloat(getComputedStyle(panel).outlineWidth) >= 2 &&
        parseFloat(getComputedStyle(panel).outlineOffset) < 0,
      `Calendar panel keyboard focus is clipped in ${view}: ${getComputedStyle(panel).outlineWidth}/${getComputedStyle(panel).outlineOffset}; active=${root.activeElement?.className}; focus=${panel.matches(":focus")}; doc=${document.hasFocus()}.`,
    );
    const control = panel.querySelector('[tabindex="0"],button');
    if (control) {
      control.focus();
      await nextRender();
      assert(
        getComputedStyle(panel).outlineStyle === "none",
        "Child focus outlines the whole calendar.",
      );
    }
  }
  await setup();
  const viewGroup = root.querySelector(".switch");
  viewGroup.dir = "rtl";
  tabs(".switch")[0].focus();
  await key(root.activeElement, "ArrowLeft");
  assert(root.activeElement === tabs(".switch")[1], "RTL left arrow ignores visual order.");
  viewGroup.removeAttribute("dir");
  for (const selector of [".switch", ".tabs"]) {
    await setup();
    const group = root.querySelector(selector);
    group.querySelector('[aria-selected="true"]').focus();
    await key(root.activeElement, "End");
    const parent = card.parentElement;
    card.remove();
    parent.append(card);
    await settle();
    assert(
      group.querySelector('[aria-selected="true"]').tabIndex === 0 &&
        tabs(selector).filter((b) => b.tabIndex === 0).length === 1,
      "Reattaching the card retained an unactivated focus target.",
    );
  }
  // The same rendered controls work in subsets, both day views, localized and Sunday-first calendars.
  for (const view of ["day", "timeline"]) {
    await setup({ view, views: ["day", "timeline"], show_weekends: false, first_day: "sunday" });
    assert(tabs(".tabs").length === 5, "Weekday configuration changed.");
    await check(".switch");
    await check(".tabs");
  }
  card.hass = { ...card.hass, locale: { ...hass.locale, language: "de" } };
  await setup();
  await check(".switch");
  await check(".tabs");
  assert(
    root.querySelector(".switch").getAttribute("aria-label") === "Kalenderansichten",
    "View group label was not localized.",
  );
  await setup({ views: ["day"] });
  assert(!root.querySelector(".switch"), "Single view added a redundant switcher.");
  await check(".tabs");
  await setup({ layout: "legacy" });
  assert(
    tabs(".switch").every((b) => b.tabIndex === 0),
    "Wall roving tabs changed legacy.",
  );
  const legacy = tabs(".switch")[0];
  legacy.focus();
  assert(
    !(await key(legacy, "ArrowRight")).defaultPrevented && root.activeElement === legacy,
    "Wall arrow handling leaked into legacy.",
  );
  card.hass = hass;
  await setup();
  return [
    "calendar tab navigation: roving focus, manual activation, wrap/Home/End, scroller isolation, locale, subsets and legacy",
  ];
}

export async function runNativeTabNavigationChecks(cdp, delay) {
  const evaluate = async (expression) => {
    const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const state = () =>
    evaluate(
      `(() => { const c=document.querySelector('moran-family-board-card'), r=c.shadowRoot, a=r.activeElement; return {view:c._view, day:c._day, focus:a?.textContent.trim(), group:a?.parentElement?.className, tabIndex:a?.tabIndex}; })()`,
    );
  const press = async (key, code, modifiers = 0) => {
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key,
      windowsVirtualKeyCode: code,
      modifiers,
      ...(key === "Enter" ? { text: "\r" } : {}),
    });
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key,
      windowsVirtualKeyCode: code,
      modifiers,
    });
    await delay(80);
  };
  await evaluate(
    `document.querySelector('moran-family-board-card').shadowRoot.querySelector('.switch [aria-selected="true"]').focus()`,
  );
  await press("End", 35);
  assert(
    (await state()).view === "day" && (await state()).focus === "Agenda",
    "Native End changed the view or missed Agenda.",
  );
  await press("Enter", 13);
  assert((await state()).view === "agenda", "Native Enter did not activate Agenda.");
  await press("ArrowLeft", 37);
  await press("Tab", 9);
  assert((await state()).group !== "switch", "Tab stayed trapped in the view options.");
  await press("Tab", 9, 8);
  assert((await state()).focus === "Agenda", "Shift-Tab did not return to the selected view.");
  await press("Home", 36);
  await press(" ", 32);
  assert((await state()).view === "day", "Native Space did not activate Day.");
  await evaluate(
    `document.querySelector('moran-family-board-card').shadowRoot.querySelector('.tabs [aria-selected="true"]').focus()`,
  );
  const originalDay = (await state()).day;
  await press("End", 35);
  assert((await state()).day === originalDay, "Date focus activated before Enter.");
  await press("Enter", 13);
  assert((await state()).day === 6, "Native date activation missed Sunday.");
  await press("Home", 36);
  await press("Tab", 9);
  assert((await state()).group !== "tabs", "Tab stayed trapped in dates.");
  await press("Tab", 9, 8);
  assert((await state()).focus?.includes("22"), "Date re-entry did not return to selected Sunday.");
  await press("Home", 36);
  await press(" ", 32);
  assert((await state()).day === 0, "Native Space did not select Monday.");
  const point = await evaluate(
    `(() => { const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector('#view-tab-timeline'); const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`,
  );
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    ...point,
    button: "left",
    clickCount: 1,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    ...point,
    button: "left",
    clickCount: 1,
  });
  await delay(100);
  assert((await state()).view === "timeline", "Mouse view selection regressed.");
  const touch = await evaluate(
    `(() => { const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector('#view-tab-day'); const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`,
  );
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ ...touch, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await delay(100);
  assert((await state()).view === "day", "Touch view selection regressed.");
}
