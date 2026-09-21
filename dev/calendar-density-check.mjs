/** Synthetic wall Day regression checks; no household data or calendar writes. */
export async function runCalendarDensityChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const original = card._config;
  const app = document.querySelector("#app");
  const originalStyle = app.getAttribute("style");
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading && !card._dayScrollAnchor && card._dayScrollFrame === undefined) {
        await Promise.all(
          (root.querySelector(".board")?.getAnimations() ?? []).map((a) =>
            a.finished.catch(() => {}),
          ),
        );
        await nextRender();
        if (!card._loading && !card._dayScrollAnchor) return;
      }
    }
    throw new Error("Calendar density did not settle.");
  };
  const config = {
    ...original,
    layout: "wall",
    view: "day",
    read_only: true,
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    full_height: true,
    hour_height: 64,
    fit_height: false,
    scroll_to_now: false,
    show_focus: true,
    remember_preferences: false,
  };
  card.hass = {
    ...hass,
    callApi: async (method, ...args) => {
      assert(method === "GET", "Zoom attempted a calendar write.");
      return hass.callApi(method, ...args);
    },
    callWS: async () => {
      throw new Error("Zoom attempted a mutation.");
    },
  };
  card.setConfig(config);
  await settle();
  const board = () => root.querySelector(".board");
  const grid = () => root.querySelector(".body");
  const toggle = () => root.querySelector(".wall-density-toggle");
  const panel = () => root.querySelector(".wall-density-panel");
  const slider = () => root.querySelector("#wall-day-density");
  const reset = () => panel().querySelector("button");
  const minute = () => {
    const sticky = [...board().querySelectorAll(".header-row, .allday-row")].reduce(
      (sum, row) => sum + row.offsetHeight,
      0,
    );
    return (
      card._dayWindow(card._shownDay()).startMin +
      (board().getBoundingClientRect().top + sticky - grid().getBoundingClientRect().top) /
        card._pxPerMin
    );
  };
  const zoom = async (value) => {
    slider().value = String(value);
    slider().dispatchEvent(new Event("input", { bubbles: true }));
    await settle();
  };
  const view = async (name) => {
    [...root.querySelectorAll(".switch button")].find((b) => b.textContent.trim() === name).click();
    await settle();
  };
  assert(toggle() && panel().hidden && reset().disabled, "Zoom must start closed, at its default.");
  assert(
    slider().type === "range" && slider().min === "40" && slider().max === "96",
    "Zoom lost its native accessible range or supported bounds.",
  );
  assert(toggle().getAttribute("aria-controls") === panel().id, "Zoom disclosure lacks its panel.");
  const headerHeight = root.querySelector(".moran-wall-header").offsetHeight;
  const gridHeight = board().clientHeight;
  toggle().click();
  await settle();
  assert(
    !panel().hidden && root.activeElement === slider(),
    "Opening zoom did not focus the slider.",
  );
  const pr = panel().getBoundingClientRect(),
    sr = root.querySelector(".moran-wall-shell").getBoundingClientRect();
  assert(
    pr.left >= sr.left && pr.right <= sr.right && pr.bottom <= sr.bottom,
    "Zoom panel clips outside the calendar container.",
  );
  assert(
    root.querySelector(".moran-wall-header").offsetHeight === headerHeight &&
      headerHeight <= 48 &&
      Math.abs(board().clientHeight - gridHeight) <= 1,
    `Zoom consumes permanent calendar space: header ${headerHeight}->${root.querySelector(".moran-wall-header").offsetHeight}, board ${gridHeight}->${board().clientHeight}.`,
  );
  assert(document.documentElement.scrollWidth <= innerWidth + 1, "Zoom makes the page overflow.");

  board().scrollTo({ top: 160, left: 180, behavior: "instant" });
  await nextRender();
  const anchor = minute(),
    left = board().scrollLeft;
  const day = card._dateForDay(card._shownDay()).getTime();
  const eventTitles = () =>
    [...root.querySelectorAll(".event")]
      .map((e) => e.title)
      .sort()
      .join("|");
  const titles = eventTitles();
  for (const value of [40, 96, 64, 43]) {
    await zoom(value);
    assert(
      Math.abs(grid().offsetHeight - value * 24) < 1,
      `Zoom ${value} did not resize the time grid.`,
    );
    assert(
      Math.abs(minute() - anchor) < 2 && Math.abs(board().scrollLeft - left) < 1,
      `Zoom ${value} lost the visible clock-time or people anchor.`,
    );
    assert(
      card._dateForDay(card._shownDay()).getTime() === day && eventTitles() === titles,
      "Zoom changed the date or dropped appointments.",
    );
    assert(root.activeElement === slider(), "Updating zoom lost slider keyboard focus.");
    const hour = root.querySelectorAll(".hour");
    assert(
      Math.abs(hour[2].getBoundingClientRect().top - hour[1].getBoundingClientRect().top - value) <
        1,
      "Axis labels and time scale diverged.",
    );
    const nowline = root.querySelector(".nowline");
    assert(
      Math.abs(parseFloat(nowline.style.top) - ((15 * 60 + 32) * value) / 60) < 1,
      "Now line did not follow the zoomed scale.",
    );
  }
  // Multiple input events between paints must reuse the original, not a half-rendered scale.
  for (const value of [45, 90, 40, 80]) {
    slider().value = String(value);
    slider().dispatchEvent(new Event("input", { bubbles: true }));
  }
  await settle();
  assert(
    Math.abs(minute() - anchor) < 2 && Math.abs(card._pxPerMin * 60 - 80) < 0.01,
    "Rapid slider input lost its original time anchor.",
  );
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await settle();
  assert(
    panel().hidden && root.activeElement === toggle(),
    "Escape did not close zoom and restore focus.",
  );
  toggle().click();
  await settle();
  root.querySelector(".wall-status-toggle").focus();
  await settle();
  assert(
    panel().hidden,
    `Tabbing away leaves an orphaned zoom panel: focused=${root.activeElement?.className}, documentFocus=${document.hasFocus()}, expanded=${card._densityExpanded}.`,
  );
  toggle().click();
  await settle();
  root
    .querySelector(".wall-datebar")
    .dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
  await settle();
  assert(panel().hidden, "Outside pointer did not dismiss zoom.");
  await card._refetch();
  card._onClockTick();
  await settle();
  assert(
    card._pxPerMin * 60 === 80 && Math.abs(minute() - anchor) < 2,
    "Refresh or clock tick overwrote zoom or scroll.",
  );
  const person = root.querySelector(".header-row .phead");
  person.click();
  await settle();
  person.click();
  await settle();
  assert(
    card._pxPerMin * 60 === 80 && Math.abs(minute() - anchor) < 2,
    "Person filtering reset zoom/time.",
  );
  root.querySelector('button[aria-label="Next day"]').click();
  await settle();
  assert(
    card._pxPerMin * 60 === 80 && Math.abs(minute() - anchor) < 2,
    "Date paging reset zoom/time.",
  );
  await view("Timeline");
  assert(!toggle() && card._pxPerMin * 60 === 64, "Day zoom leaked into Timeline.");
  await view("Day");
  assert(
    card._pxPerMin * 60 === 80 && panel().hidden,
    "Day view lost its session zoom or reopened popup.",
  );
  app.style.height = `${Math.max(260, app.clientHeight - 60)}px`;
  app.style.flex = "0 0 auto";
  await settle();
  assert(card._pxPerMin * 60 === 80, "Resize reset manual density.");
  if (originalStyle === null) app.removeAttribute("style");
  else app.setAttribute("style", originalStyle);
  await settle();
  // Auto-centering must still use the new density, but not run for ordinary zoom changes.
  root.querySelector('button[aria-label="Show today"]').click();
  await settle();
  await new Promise((resolve) => setTimeout(resolve, 650));
  const line = root.querySelector(".nowline").getBoundingClientRect();
  const br = board().getBoundingClientRect();
  assert(line.top >= br.top && line.top < br.bottom, "Today cannot reveal now after zooming.");
  toggle().click();
  await settle();
  reset().click();
  await settle();
  assert(
    card._dayHourHeight === undefined && card._pxPerMin * 60 === 64,
    "Reset did not restore configured height.",
  );

  // Fit mode resumes on Reset; manual zoom must not be overwritten by ResizeObserver.
  card.setConfig({ ...config, hour_height: 84, fit_height: true });
  await settle();
  const fitted = card._pxPerMin;
  toggle().click();
  await settle();
  await zoom(96);
  card._measureFit();
  await settle();
  assert(card._pxPerMin * 60 === 96, "Fit measurement overwrote manual zoom.");
  reset().click();
  await settle();
  assert(Math.abs(card._pxPerMin - fitted) < 0.01, "Reset failed to resume fit_height.");
  card.setConfig({ ...config, hour_height: 84 });
  await settle();
  assert(
    card._dayHourHeight === undefined && card._pxPerMin * 60 === 84 && panel().hidden,
    "New config retained stale session zoom.",
  );

  // Short/concurrent appointments retain a target; overflow remains reachable via Agenda.
  card.hass = {
    ...card.hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Dense zoom attempted a write.");
      if (!path.includes("fixture_family")) return [];
      const timed = (uid, start, end) => ({
        uid,
        summary: `Jordan: ${uid}`,
        start: { dateTime: `2026-02-18T${start}:00-06:00` },
        end: { dateTime: `2026-02-18T${end}:00-06:00` },
      });
      return [
        timed("Short check", "00:00", "00:05"),
        timed("Late check", "23:50", "23:55"),
        timed("Adjacent first", "17:00", "17:30"),
        timed("Adjacent second", "17:30", "18:00"),
        ...Array.from({ length: 8 }, (_, i) => timed(`Concurrent ${i}`, "12:00", "12:05")),
        {
          uid: "all-day",
          summary: "Jordan: Community day",
          start: { date: "2026-02-18" },
          end: { date: "2026-02-19" },
        },
      ];
    },
  };
  card.setConfig({ ...config, max_columns: 3 });
  await settle();
  toggle().click();
  await settle();
  await zoom(40);
  assert(root.querySelector(".allday-row .adchip"), "Zoom lost all-day appointments.");
  const short = [...root.querySelectorAll(".event:not(.overflow)")].filter((e) =>
    /Short check|Late check/.test(e.title),
  );
  assert(
    short.length === 2 && short.every((e) => e.offsetHeight >= 16 && e.tabIndex === 0),
    "Zoom hid midnight/late short appointments or their keyboard targets.",
  );
  for (const event of root.querySelectorAll(".event:not(.overflow)"))
    assert(
      Math.abs(event.getBoundingClientRect().height - parseFloat(event.style.height)) < 1,
      "A fixed touch minimum distorts compact event duration.",
    );
  const adjacent = [...root.querySelectorAll(".event")].filter((e) => /Adjacent/.test(e.title));
  assert(
    adjacent.length === 2 &&
      adjacent[0].getBoundingClientRect().bottom <= adjacent[1].getBoundingClientRect().top,
    "Compact adjacent appointments cover one another.",
  );
  const concurrent = [...root.querySelectorAll(".event:not(.overflow)")].filter((e) =>
    /Concurrent/.test(e.title),
  );
  assert(
    concurrent.length > 0 && root.querySelector(".event.overflow"),
    "Dense overlaps lost events/overflow disclosure.",
  );
  short[0].click();
  await settle();
  assert(
    root.querySelector(".dialog") &&
      [...root.querySelectorAll(".dialog input,.dialog textarea")].every((e) => e.disabled),
    "Short appointment details are not read-only after zoom.",
  );
  root.querySelector(".dialog .icon").click();
  await settle();
  root.querySelector(".event.overflow").click();
  await settle();
  assert(
    card._view === "agenda" && root.querySelectorAll(".agenda-row").length >= 8,
    "Overflow appointments cannot be reached from compact Day.",
  );

  // A content-sized host must retain visible Day content, not collapse at flex-basis 0.
  card.setConfig(config);
  await settle();
  const cardStyle = card.getAttribute("style");
  card.style.height = "auto";
  await settle();
  assert(board().clientHeight > 128, "Content-sized wall host collapsed its calendar.");
  if (cardStyle === null) card.removeAttribute("style");
  else card.setAttribute("style", cardStyle);
  await settle();
  card.hass = hass;
  card.setConfig({ ...config, layout: "default" });
  await settle();
  assert(!toggle() && !panel() && card._pxPerMin * 60 === 64, "Zoom changed legacy rendering.");
  // Leave a known synthetic wall Day for the runner's native keyboard/pointer/touch checks.
  card.setConfig(config);
  await settle();
  return [
    `calendar density: ${innerWidth}px bounds, anchors, fit/reset, short/overlap details, navigation and legacy verified`,
  ];
}
