// Synthetic Day overflow: disabled Agenda must not strand overlapping appointments.
export async function runDayOverflowChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const original = card._config;
  let reads = 0;
  let failing = false;
  let payload = Array.from({ length: 7 }, (_, i) => ({
    uid: `day-overflow-${i}`,
    summary: `Avery: ${i === 6 ? "A full wrapping appointment title with SuperLongUnbrokenProjectNameForTesting" : `Overlapping appointment ${i + 1}`}`,
    location: "Community center",
    description: "Synthetic appointment details",
    start: { dateTime: "2026-02-18T15:00:00-06:00" },
    end: { dateTime: "2026-02-18T16:00:00-06:00" },
  }));
  const fixtureHass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Overflow attempted a provider write.");
      reads++;
      if (failing) throw new Error("Synthetic source failure");
      return path.includes("fixture_family") ? payload : [];
    },
    callWS: async () => {
      throw new Error("Overflow attempted a mutation.");
    },
  };
  card.hass = fixtureHass;
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading) return;
    }
    throw new Error("Day overflow did not settle.");
  };
  const config = {
    ...original,
    layout: "wall",
    view: "day",
    views: ["day"],
    read_only: true,
    remember_preferences: false,
    refresh_interval: 0,
    max_columns: 3,
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    scroll_to_now: true,
  };
  const setup = async (extra = {}) => {
    card.setConfig({ ...config, ...extra });
    await settle();
  };
  await setup();
  const overflow = () => root.querySelector(".event.overflow");
  const board = () => root.querySelector(".board");
  const list = () => root.querySelector(".day-overflow");
  const rows = () => [...list().querySelectorAll(".agenda-row")];
  const key = (target, value, extra = {}) =>
    target.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: value,
        bubbles: true,
        composed: true,
        cancelable: true,
        ...extra,
      }),
    );
  const open = async () => {
    overflow().scrollIntoView({ block: "center", inline: "nearest" });
    overflow().focus();
    overflow().click();
    await nextRender();
  };
  const closeList = async () => {
    list().querySelector(".icon").click();
    await nextRender();
  };
  assert(
    overflow()?.textContent.includes("+5"),
    "Crowded Day did not collapse the expected five appointments.",
  );
  overflow().scrollIntoView({ block: "center", inline: "nearest" });
  await nextRender();
  const before = {
    top: board().scrollTop,
    left: board().scrollLeft,
    reads,
    date: card._dateForDay(card._shownDay()).getTime(),
  };
  const trigger = overflow();
  await open();
  assert(root.querySelector(".day-overflow"), "Day overflow is inert when Agenda is disabled.");
  assert(
    rows().length === 7 && card._view === "day",
    "Fallback changed views or omitted appointments.",
  );
  assert(reads === before.reads, "Opening the day list added calendar reads.");
  assert(
    list().querySelector("h2").textContent.includes("Avery · Wednesday, Feb 18, 2026"),
    "List lost person/date context.",
  );
  assert(root.querySelector(".moran-wall-shell").inert, "Calendar is not inert behind the list.");
  assert(
    root.activeElement === list().querySelector(".icon"),
    "List did not focus its close button.",
  );
  assert(
    list().getAttribute("aria-labelledby") === "day-overflow-title",
    "List lacks a labeled modal.",
  );
  const rect = list().getBoundingClientRect();
  assert(
    rect.left >= 0 &&
      rect.right <= innerWidth + 1 &&
      rect.top >= 0 &&
      rect.bottom <= innerHeight + 1,
    "Overflow dialog escapes the viewport.",
  );
  assert(
    rows().every((row) => row.offsetHeight >= 48 && row.scrollWidth <= row.clientWidth + 1),
    "List targets or titles are clipped.",
  );
  assert(
    getComputedStyle(rows().at(-1).querySelector(".agenda-title")).whiteSpace === "normal",
    "Long title remains truncated.",
  );
  key(list().querySelector(".icon"), "Tab", { shiftKey: true });
  assert(root.activeElement === rows().at(-1), "Reverse Tab escaped the list.");
  key(rows().at(-1), "Tab");
  assert(root.activeElement === list().querySelector(".icon"), "Tab escaped the list.");
  const appointment = rows().at(-1);
  appointment.scrollIntoView({ block: "center" });
  appointment.focus();
  await nextRender();
  const listTop = list().scrollTop;
  key(appointment, "Enter");
  await nextRender();
  assert(
    root.querySelector(".overlay:not([inert]) .dialog:not(.day-overflow)"),
    "Hidden appointment details did not open.",
  );
  assert(
    list().closest(".overlay").inert && getComputedStyle(list()).visibility === "hidden",
    "Underlying list remains interactive in details.",
  );
  assert(
    [...root.querySelectorAll(".overlay:not([inert]) input,.overlay:not([inert]) textarea")].every(
      (el) => el.disabled,
    ),
    "Read-only details became writable.",
  );
  assert(
    root.activeElement === root.querySelector(".overlay:not([inert]) .icon"),
    "Details focused the hidden list.",
  );
  const initial = [...payload];
  payload = initial.map((e, i) => (i === 6 ? { ...e, summary: "Avery: Updated appointment" } : e));
  await card._refetch();
  await nextRender();
  assert(
    rows().at(-1) === appointment && appointment.textContent.includes("Updated appointment"),
    "Refresh recycled identity or retained stale list data.",
  );
  assert(
    root.querySelector(".overlay:not([inert]) input").value === "Updated appointment",
    "Open details did not refresh.",
  );
  key(root.activeElement, "Escape");
  await nextRender();
  assert(
    !card._dialog && root.activeElement === appointment,
    "Closing details did not restore appointment focus.",
  );
  assert(
    Math.abs(list().scrollTop - Math.min(listTop, list().scrollHeight - list().clientHeight)) < 2,
    "Closing details lost list scroll away from refreshed content bounds.",
  );
  key(appointment, "Enter");
  await nextRender();
  payload = initial.slice(0, 6);
  await card._refetch();
  await nextRender();
  assert(
    root.querySelector(".details-status")?.textContent.includes("was not found"),
    "Removed appointment lost its details warning.",
  );
  key(root.activeElement, "Escape");
  await nextRender();
  assert(
    root.activeElement === list().querySelector(".icon"),
    "Removed row leaves focus on a stale node.",
  );
  failing = true;
  await card._refetch();
  await nextRender();
  assert(list().querySelector(".calendar-status.banner"), "List conceals source failure.");
  assert(!list().textContent.includes("No events."), "Failed source falsely reports no events.");
  failing = false;
  payload = initial;
  list().querySelector(".retry").click();
  await settle();
  assert(
    rows().length === 7 && !list().querySelector(".banner"),
    "Retry did not recover the list.",
  );
  await closeList();
  assert(
    !list() &&
      root.activeElement ===
        (trigger.isConnected ? trigger : root.querySelector('.tabs [aria-selected="true"]')) &&
      !root.querySelector(".moran-wall-shell").inert,
    `List close lost trigger focus or left the calendar inert: ${JSON.stringify({ list: !!list(), connected: trigger.isConnected, focus: root.activeElement?.outerHTML, expected: trigger.isConnected ? "trigger" : "date", inert: root.querySelector(".moran-wall-shell").inert })}`,
  );
  assert(
    Math.abs(board().scrollTop - before.top) < 2 &&
      Math.abs(board().scrollLeft - before.left) < 2 &&
      card._dateForDay(card._shownDay()).getTime() === before.date,
    "Modal changed the underlying Day context.",
  );
  // Include all of this person's day, not an old cached overlap-cluster snapshot.
  payload = [
    ...initial,
    { ...initial[0], uid: "other-person", summary: "Jordan: Other person" },
    { ...initial[0], uid: "joint", summary: "Avery + Jordan: Shared appointment" },
    {
      ...initial[0],
      uid: "other-day",
      start: { dateTime: "2026-02-19T15:00:00-06:00" },
      end: { dateTime: "2026-02-19T16:00:00-06:00" },
    },
    {
      uid: "all-day",
      summary: "Avery: All-day appointment",
      start: { date: "2026-02-18" },
      end: { date: "2026-02-19" },
    },
    {
      uid: "midnight",
      summary: "Avery: Overnight appointment",
      start: { dateTime: "2026-02-17T23:30:00-06:00" },
      end: { dateTime: "2026-02-18T00:30:00-06:00" },
    },
  ];
  await setup({ max_columns: 1, first_day: "sunday" });
  await open();
  assert(
    rows().length === 10 && !list().textContent.includes("Other person"),
    "Day/person routing, shared copies or midnight/all-day events are wrong.",
  );
  assert(
    list().querySelector("h2").textContent.includes("Wednesday, Feb 18"),
    "Sunday-first changed the date context.",
  );
  card._togglePerson(0);
  await nextRender();
  assert(rows().length === 0, "List ignores person filters.");
  card._togglePerson(0);
  await nextRender();
  assert(rows().length === 10, "List retained stale filtering.");
  card.hass = { ...fixtureHass, locale: { language: "de-DE", time_format: "24" } };
  await nextRender();
  assert(
    list().querySelector("h2").textContent.includes("Mittwoch") &&
      list().querySelector(".icon").getAttribute("aria-label") === "Schließen",
    "List did not localize.",
  );
  card.hass = fixtureHass;
  payload = [...initial, initial[0]];
  await setup({ filter_duplicates: false });
  await open();
  assert(rows().length === 8, "Provider duplicates vanished despite configuration.");
  await card._refetch();
  await nextRender();
  assert(rows().length === 8, "Duplicate rendering keys destabilized the refreshed list.");
  await setup({ filter_duplicates: true });
  await open();
  assert(rows().length === 7, "Configured deduplication is ignored.");
  // Midnight and kiosk do not yank an inspected date away.
  payload = initial;
  await setup({ auto_return: 1 });
  await open();
  const nowProvider = card.nowProvider;
  const inspected = card._dayOverflow.date;
  card.nowProvider = () => new Date("2026-02-19T00:01:00-06:00");
  card._syncCalendarDate();
  await nextRender();
  assert(
    card._dateForDay(card._shownDay()).getTime() === inspected && rows().length === 7,
    "Midnight moved the inspected date.",
  );
  card._lastInteract = Date.now() - 120000;
  card._kioskReturn();
  await nextRender();
  assert(card._dayOverflow?.date === inspected, "Kiosk dismissed the list.");
  card.nowProvider = nowProvider;
  card._syncCalendarDate();
  await setup();
  assert(
    !list() && !root.querySelector(".moran-wall-shell").inert,
    "Config left an obsolete modal.",
  );
  await open();
  const parent = card.parentNode;
  card.remove();
  parent.append(card);
  await settle();
  assert(
    !list() && !root.querySelector(".moran-wall-shell").inert,
    "Reattachment retained stale modal state.",
  );
  await setup({ views: original.views });
  await open();
  assert(
    card._view === "agenda" && !list(),
    "Enabled Agenda no longer receives the overflow route.",
  );
  await setup({ layout: "legacy", views: original.views });
  await open();
  assert(card._view === "agenda" && !list(), "Fallback changed legacy routing.");
  payload = initial;
  await setup(); // Leave native input tests a deterministic crowded Day.
  return [
    "day overflow: restricted Agenda, details/focus, fresh data, routing, date/scroll, locale, legacy",
  ];
}

export async function runNativeDayOverflowChecks(cdp, delay) {
  const evaluate = async (expression) => {
    const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const state = () =>
    evaluate(`(()=>{const r=document.querySelector('moran-family-board-card').shadowRoot;
    const active=r.querySelector('.overlay:not([inert]) .dialog');
    const trigger=r.querySelector('.event.overflow'); const b=trigger.getBoundingClientRect();
    return {list:active?.classList.contains('day-overflow')??false,details:!!active&&!active.classList.contains('day-overflow'),
      focus:r.activeElement?.className,x:b.x+b.width/2,y:b.y+b.height/2};})()`);
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
    await delay(100);
  };
  await evaluate(
    `(()=>{const b=document.querySelector('moran-family-board-card').shadowRoot.querySelector('.event.overflow');b.scrollIntoView({block:'center'});b.focus();})()`,
  );
  await press("Enter", 13);
  assert((await state()).list, "Native Enter did not open the fallback.");
  await press("Tab", 9, 8); // shift: wrap to the final appointment
  await press(" ", 32);
  assert((await state()).details, "Native Space could not open a hidden appointment.");
  await press("Escape", 27);
  assert(
    (await state()).list && (await state()).focus.includes("agenda-row"),
    "Details Escape lost list focus.",
  );
  await press("Escape", 27);
  assert(
    !(await state()).list && (await state()).focus.includes("overflow"),
    "List Escape lost trigger focus.",
  );
  const b = await state();
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: b.x,
    y: b.y,
    button: "left",
    clickCount: 1,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: b.x,
    y: b.y,
    button: "left",
    clickCount: 1,
  });
  await delay(100);
  assert((await state()).list, "Mouse did not open the fallback.");
  await press("Escape", 27);
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: b.x, y: b.y, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await delay(100);
  assert((await state()).list, "Touch did not open the fallback.");
  await press("Escape", 27);
}
