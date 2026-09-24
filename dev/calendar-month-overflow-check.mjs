// Synthetic Month overflow coverage: no provider writes or household appointments.
export async function runMonthOverflowChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const original = card._config;
  const longTitle =
    "Community appointment with a full wrapping title and SuperLongUnbrokenProjectNameForOverflowTesting";
  let failing = false;
  let reads = 0;
  let payload = Array.from({ length: 7 }, (_, i) => ({
    uid: `month-overflow-${i}`,
    summary: `Avery: ${i === 6 ? longTitle : `Community appointment ${i + 1}`}`,
    start: { dateTime: `2026-02-21T${String(8 + i).padStart(2, "0")}:00:00-06:00` },
    end: { dateTime: `2026-02-21T${String(9 + i).padStart(2, "0")}:00:00-06:00` },
  }));
  const initial = [...payload];
  const fixtureHass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Month overflow attempted a provider write.");
      reads++;
      if (failing) throw new Error("Synthetic source unavailable");
      return path.includes("fixture_family") ? payload : [];
    },
    callWS: async () => {
      throw new Error("Month overflow attempted a mutation.");
    },
  };
  card.hass = fixtureHass;
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading) return;
    }
    throw new Error("Month overflow did not settle.");
  };
  const config = {
    ...original,
    layout: "wall",
    view: "month",
    views: ["month"],
    read_only: true,
    remember_preferences: false,
    refresh_interval: 0,
  };
  const setup = async (extra = {}) => {
    card.setConfig({ ...config, ...extra });
    await settle();
  };
  await setup();
  const day = (number = "21") =>
    [...root.querySelectorAll(".mcell:not(.out)")].find(
      (c) => c.querySelector(".mdate").textContent.trim() === number,
    );
  const cell = day();
  const wrap = () => root.querySelector(".monthwrap");
  const more = () => day().querySelector("button.mmore");
  const chips = () => [...day().querySelectorAll(".mchip")];
  const openAll = async () => {
    more().click();
    await nextRender();
  };
  assert(chips().length === 3, "Month preview changed unexpectedly.");
  assert(more(), "Month overflow is inert text; hidden appointments cannot be opened without Day.");
  assert(
    cell.getAttribute("role") === "group" && !cell.hasAttribute("tabindex"),
    "Disabled Day remains a dead navigation target.",
  );
  assert(more().getAttribute("aria-expanded") === "false", "Disclosure lacks collapsed state.");
  assert(
    more().getAttribute("aria-label").includes("February 21, 2026"),
    "Disclosure lacks a full date.",
  );
  more().scrollIntoView({ block: "center" });
  await nextRender();
  const beforeTop = more().getBoundingClientRect().top;
  const readCount = reads;
  await openAll();
  assert(reads === readCount, "Expanding loaded events unnecessarily fetches calendars.");
  assert(chips().length === 7, "Month overflow did not expose all appointments.");
  assert(more().getAttribute("aria-expanded") === "true", "Disclosure lacks expanded state.");
  const shift = more().getBoundingClientRect().top - beforeTop;
  assert(
    Math.abs(shift) < 2 ||
      (wrap().scrollTop < 1 && shift < 0) ||
      (wrap().scrollTop >= wrap().scrollHeight - wrap().clientHeight - 1 && shift > 0),
    "Expansion lost its disclosure anchor away from scroll bounds.",
  );
  const otherRow = day("7").getBoundingClientRect().height;
  assert(
    day().getBoundingClientRect().height > otherRow * 1.5,
    "Expanding one date inflates every month row.",
  );
  const last = chips().at(-1);
  assert(last.textContent.includes(longTitle), "Expanded list changed event identity/order.");
  assert(getComputedStyle(last).whiteSpace !== "nowrap", "Expanded title still truncates.");
  assert(last.scrollWidth <= last.clientWidth + 1, "Expanded title clips its text.");
  assert(
    // Translated entrance frames can report 47.999969px for a 48px layout box.
    chips().every((c) => c.offsetHeight >= 48 && c.getBoundingClientRect().height >= 48 - 0.001),
    `Expanded appointments lost usable target heights: ${chips().map(c => c.getBoundingClientRect().height).join(", ")}.`,
  );
  assert(more().getBoundingClientRect().height >= 48, "Overflow disclosure is too short.");
  assert(
    day().getBoundingClientRect().width >= 110,
    "Restricted Month still squeezes events into tiny columns.",
  );
  assert(
    document.documentElement.scrollWidth <= innerWidth + 1,
    "Restricted Month overflows the page instead of its own scroller.",
  );
  last.scrollIntoView({ block: "center" });
  last.focus();
  await nextRender();
  const scrollBeforeDetails = wrap().scrollTop;
  last.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
  );
  await nextRender();
  assert(root.querySelector(".dialog"), "A hidden appointment did not open details.");
  assert(
    [...root.querySelectorAll(".dialog input,.dialog textarea")].every((e) => e.disabled),
    "Overflow details became writable.",
  );
  root.querySelector(".dialog .icon").click();
  await nextRender();
  assert(root.activeElement === last, "Details did not restore focus to the expanded appointment.");
  assert(
    Math.abs(wrap().scrollTop - scrollBeforeDetails) < 2,
    "Closing details lost Month scroll.",
  );
  assert(chips().length === 7 && card._view === "month", "Details changed the Month context.");
  // A refresh must replace the list, not retain an old cached copy of hidden items.
  payload = initial.map((e, i) => (i === 6 ? { ...e, summary: "Avery: Updated appointment" } : e));
  await card._refetch();
  await nextRender();
  assert(
    chips().at(-1).textContent.includes("Updated appointment"),
    "Expanded list retained a stale title.",
  );
  failing = true;
  await card._refetch();
  await nextRender();
  assert(root.querySelector(".calendar-status.banner"), "Expanded Month concealed source failure.");
  failing = false;
  payload = initial;
  await card._refetch();
  await nextRender();
  assert(chips().length === 7, "Recovery lost the expansion.");
  const filter = root.querySelector(".wall-person-filters button");
  filter.click();
  await nextRender();
  assert(chips().length === 0, "Hidden person's events remain expanded.");
  filter.click();
  await nextRender();
  assert(chips().length === 7, "Restoring the person lost the current date expansion.");
  more().scrollIntoView({ block: "center" });
  more().focus();
  await nextRender();
  await openAll();
  assert(
    chips().length === 3 && more().getAttribute("aria-expanded") === "false",
    "Collapse did not restore the preview.",
  );
  assert(root.activeElement === more(), "Collapse lost disclosure focus.");
  payload = [
    ...initial,
    ...initial.map((e) => ({
      ...e,
      uid: `second-${e.uid}`,
      start: { dateTime: e.start.dateTime.replace("02-21", "02-20") },
      end: { dateTime: e.end.dateTime.replace("02-21", "02-20") },
    })),
  ];
  await card._refetch();
  await nextRender();
  await openAll();
  day("20").querySelector("button.mmore").click();
  await nextRender();
  assert(
    chips().length === 3 && day("20").querySelectorAll(".mchip").length === 7,
    "Opening a second date left two dates expanded.",
  );
  root.querySelector(".nav-now").click();
  await nextRender();
  assert(!root.querySelector(".mcell.expanded"), "Month Today did not clear expansion.");
  payload = initial;
  await card._refetch();
  await nextRender();
  await openAll();
  root.querySelector('[aria-label="Next month"]').click();
  await settle();
  root.querySelector('[aria-label="Previous month"]').click();
  await settle();
  assert(chips().length === 3, "Month navigation retained obsolete expansion.");
  wrap().scrollLeft = wrap().scrollWidth;
  await nextRender();
  const headings = [...root.querySelectorAll(".monthhead .mhcell")];
  const firstWeek = [...root.querySelectorAll(".monthgrid > .mcell")].slice(0, 7);
  assert(
    headings.every(
      (h, i) =>
        Math.abs(h.getBoundingClientRect().left - firstWeek[i].getBoundingClientRect().left) < 1,
    ),
    "Horizontal Month browsing misaligns dates and weekday headings.",
  );

  // Weekend dates must not navigate to a different weekday just because Day hides weekends.
  await setup({ views: original.views, show_weekends: false });
  assert(
    day().getAttribute("role") === "group",
    "A hidden weekend still advertises Day navigation.",
  );
  const selectedBefore = card._day;
  day().click();
  await nextRender();
  assert(
    card._view === "month" && card._day === selectedBefore,
    "Hidden weekend click changed browsing context.",
  );
  await openAll();
  assert(chips().length === 7, "Weekend-only overflow is inaccessible.");
  root.querySelector(".switch button").click();
  await settle();
  [...root.querySelectorAll(".switch button")]
    .find((b) => b.textContent.trim() === "Month")
    .click();
  await settle();
  assert(chips().length === 3, "Leaving Month retained stale expansion.");

  // Compact mode still uses date-to-Day drilldown and unique occurrence counts.
  payload = [
    ...initial,
    { ...initial[0], uid: "joint-overflow", summary: "Avery + Jordan: Joint appointment" },
    {
      uid: "all-day-overflow",
      summary: "Community day",
      start: { date: "2026-02-20" },
      end: { date: "2026-02-22" },
    },
    {
      uid: "midnight-overflow",
      summary: "Avery: Late appointment",
      start: { dateTime: "2026-02-20T23:30:00-06:00" },
      end: { dateTime: "2026-02-21T00:30:00-06:00" },
    },
  ];
  await setup({ views: original.views });
  assert(
    day().getAttribute("aria-label").includes("10 events"),
    "Unique Month counts lost owner-copy or midnight/all-day semantics.",
  );
  if (root.querySelector(".moran-wall-shell").clientWidth <= 600) {
    assert(
      getComputedStyle(day().querySelector(".mchips")).display === "none",
      "Compact Month exposes tiny chips.",
    );
    day().click();
    await settle();
    assert(
      card._view === "day" &&
        root
          .querySelector('.tabs [aria-selected="true"]')
          .getAttribute("aria-label")
          .includes("Feb 21"),
      "Compact drilldown lost the date.",
    );
  }
  await setup();
  await openAll();
  assert(
    chips().length === 11,
    "Expanded Month lost intentionally shared person copies or segments.",
  );
  card.hass = { ...fixtureHass, locale: { language: "de-DE", time_format: "24" } };
  await nextRender();
  assert(more().textContent.includes("Weniger anzeigen"), "German collapse label is missing.");
  await openAll();
  assert(
    more().getAttribute("aria-label").includes("Alle Termine anzeigen"),
    "German expansion label is missing.",
  );
  card.hass = fixtureHass;
  payload = initial;
  await setup({ auto_return: 1 });
  await openAll();
  card._lastInteract = Date.now() - 120000;
  card._kioskReturn();
  await nextRender();
  assert(!root.querySelector(".mcell.expanded"), "Kiosk return retained an obsolete expansion.");
  await setup({ layout: "legacy" });
  assert(
    !root.querySelector("button.mmore") && root.querySelector("div.mmore"),
    "Wall overflow leaked into legacy.",
  );
  await setup(); // Leave a synthetic Month card for real browser keyboard/touch checks.
  return [
    "month overflow: disclosure, date context, details/focus, refresh, filters, restricted weekends, locale, legacy",
  ];
}

export async function runNativeMonthOverflowChecks(cdp, delay) {
  const evaluate = async (expression) => {
    const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const state = () =>
    evaluate(`(() => {
    const card=document.querySelector('moran-family-board-card'); const root=card.shadowRoot;
    const button=root.querySelector('button.mmore'); const cell=button.closest('.mcell');
    const r=button.getBoundingClientRect();
    return {x:r.x+r.width/2,y:r.y+r.height/2,expanded:button.getAttribute('aria-expanded'),
      count:cell.querySelectorAll('.mchip').length,view:card._view,dialog:!!root.querySelector('.dialog'),
      focus:root.activeElement===button?'more':root.activeElement?.className};
  })()`);
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
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  await evaluate(
    `(() => {const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector('button.mmore'); b.scrollIntoView({block:'center'}); b.focus();})()`,
  );
  await press("Enter", 13);
  const opened = await state();
  assert(
    opened.count === 7 && opened.view === "month",
    `Native Enter did not expand in Month: ${JSON.stringify(opened)}`,
  );
  await press("Tab", 9);
  await press("Enter", 13);
  assert((await state()).dialog, "Native Tab/Enter cannot open the fourth appointment.");
  await press("Escape", 27);
  assert(
    !(await state()).dialog && (await state()).focus.includes("mchip"),
    "Native Escape failed to restore appointment focus.",
  );
  await evaluate(
    `(() => {const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector('button.mmore'); b.scrollIntoView({block:'center'}); b.focus();})()`,
  );
  await press(" ", 32);
  assert(
    (await state()).count === 3 && (await state()).focus === "more",
    "Native Space did not collapse cleanly.",
  );
  const before = await state();
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: before.x, y: before.y, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await delay(100);
  assert((await state()).count === 7, "Native touch did not expand appointments.");
  const after = await state();
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: after.x,
    y: after.y,
    button: "left",
    clickCount: 1,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: after.x,
    y: after.y,
    button: "left",
    clickCount: 1,
  });
  await delay(100);
  assert((await state()).count === 3, "Native mouse did not collapse appointments.");
}
