/** Synthetic Week list density: no providers, personal data or writes. */
export async function runWeekDensityChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const identity = `fixture-week-density-${innerWidth}-${document.querySelector("#app").clientWidth}-${matchMedia("(prefers-reduced-motion: reduce)").matches}`;
  const phaseKey = `${identity}-reload`;
  const config = {
    ...card._config,
    layout: "wall",
    view: "week",
    read_only: true,
    remember_preferences: true,
    preferences_key: identity,
    refresh_interval: 0,
    full_height: true,
    show_focus: true,
    scroll_to_now: false,
    show_weekends: true,
  };
  let delayed;
  const payload = [
    ...Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 5 }, (_, i) => ({
        uid: `week-density-${day}-${i}`,
        summary: `Avery + Jordan: ${i === 2 ? "Community planning workshop with a long title and SuperLongUnbrokenWordForWrappingChecks" : `Appointment ${i + 1}`}`,
        start: { dateTime: `2026-02-${16 + day}T${10 + i}:00:00-06:00` },
        end: { dateTime: `2026-02-${16 + day}T${11 + i}:00:00-06:00` },
      })),
    ).flat(),
    {
      uid: "week-density-all-day",
      summary: "Community Day",
      start: { date: "2026-02-18" },
      end: { date: "2026-02-20" },
    },
    {
      uid: "week-density-midnight",
      summary: "Avery: Late appointment",
      start: { dateTime: "2026-02-18T23:30:00-06:00" },
      end: { dateTime: "2026-02-19T00:30:00-06:00" },
    },
  ];
  const provider = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Week zoom attempted a calendar write.");
      if (delayed) await delayed;
      return path.includes("fixture_family") ? payload : [];
    },
    callWS: async () => {
      throw new Error("Week zoom attempted a mutation.");
    },
  };
  const wrap = () => root.querySelector(".weekwrap");
  const slider = () => root.querySelector("#wall-calendar-density");
  const panel = () => root.querySelector(".wall-density-panel");
  const toggle = () => root.querySelector(".wall-density-toggle");
  const settle = async () => {
    for (let i = 0; i < 160; i++) {
      await nextRender();
      if (!card._loading && !card._weekScrollAnchor) {
        await nextRender();
        return;
      }
    }
    throw new Error("Week zoom did not settle.");
  };
  const view = async (name) => {
    [...root.querySelectorAll(".switch button")].find((b) => b.textContent.trim() === name).click();
    await settle();
  };
  const open = async () => {
    if (panel().hidden) toggle().click();
    await nextRender();
  };
  const input = (value) => {
    slider().value = String(value);
    slider().dispatchEvent(new Event("input", { bubbles: true }));
  };
  const zoom = async (value) => {
    await open();
    input(value);
    await settle();
  };
  const reset = async () => {
    await open();
    panel().querySelector("button").click();
    await settle();
  };
  const record = () => JSON.parse(localStorage.getItem(card._preferencesKey));
  const reload = (phase) => {
    sessionStorage.setItem(phaseKey, phase);
    location.reload();
    return new Promise(() => {});
  };
  const position = () => {
    const edge = root.querySelector(".corner").getBoundingClientRect().bottom;
    const row = [...root.querySelectorAll(".wday")].find(
      (el) => el.getBoundingClientRect().bottom > edge,
    );
    const rect = row.getBoundingClientRect();
    return {
      day: row.dataset.day,
      fraction: Math.max(0, (edge - rect.top) / rect.height),
      left: wrap().scrollLeft,
    };
  };
  const anchor = (before) => {
    const after = position();
    assert(
      after.day === before.day &&
        Math.abs(after.fraction - before.fraction) < 0.012 &&
        Math.abs(after.left - before.left) < 1,
      `Week lost date-row anchor: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`,
    );
  };
  const browse = async () => {
    const row = root.querySelector('.wday[data-day="2"]');
    wrap().scrollTop +=
      row.getBoundingClientRect().top -
      root.querySelector(".corner").getBoundingClientRect().bottom +
      row.offsetHeight * 0.2;
    wrap().scrollLeft = 120;
    await nextRender();
  };
  card.hass = provider;
  card.setConfig(config);
  await settle();
  assert(
    slider() && slider().min === "75" && slider().max === "150",
    "Week has no independent native density slider.",
  );
  const key = card._preferencesKey;
  if (sessionStorage.getItem(phaseKey) === "saved") {
    assert(
      slider().value === "125" && card._dayHourHeight === 80 && card._timelineZoomWidth === 168,
      "Reload lost independent scales.",
    );
    assert(card._hiddenP.join() === "2", "Reload lost person filters.");
    await reset();
    assert(
      !record().zoom.week && record().zoom.day.value === 80 && record().zoom.timeline.value === 168,
      "Week Reset erased another scale.",
    );
    return reload("reset");
  }
  if (sessionStorage.getItem(phaseKey) === "reset") {
    assert(
      slider().value === "100" && card._weekDensity === undefined,
      "Week Reset did not survive reload.",
    );
    localStorage.removeItem(key);
    sessionStorage.removeItem(phaseKey);
    card.setConfig({ ...config, remember_preferences: false });
    await settle();
    return [
      `week density: ${innerWidth}px row anchors, sticky headings, readable targets, native range, independent reload/Reset and read-only details verified`,
    ];
  }
  assert(
    slider().value === "100" && panel().hidden,
    "Week did not start at default, collapsed zoom.",
  );
  const titles = () => [...root.querySelectorAll(".wchip")].map((el) => el.title).join("|");
  const allTitles = titles(),
    headerHeight = root.querySelector(".wphead").offsetHeight,
    total = wrap().scrollHeight;
  await browse();
  await open();
  const pr = panel().getBoundingClientRect(),
    sr = root.querySelector(".moran-wall-shell").getBoundingClientRect();
  assert(pr.left >= sr.left && pr.right <= sr.right && pr.bottom <= sr.bottom, "Week popup clips.");
  assert(
    root.querySelector("header").offsetHeight === 48 &&
      document.documentElement.scrollWidth <= innerWidth + 1,
    "Week zoom takes header space or overflows page.",
  );
  for (const value of [75, 150, 100, 125]) {
    const before = position();
    await zoom(value);
    anchor(before);
    assert(titles() === allTitles, "Week zoom lost or reordered events.");
    assert(
      root.querySelector(".wphead").offsetHeight === headerHeight,
      "Week zoom changed pinned heading height.",
    );
    assert(root.activeElement === slider(), "Week zoom lost focus.");
    for (const chip of root.querySelectorAll(".wchip")) {
      assert(chip.offsetHeight >= 48, "Compact Week target smaller than 48px.");
      const title = chip.querySelector("span");
      assert(
        parseFloat(getComputedStyle(title).fontSize) >= 12 &&
          title.scrollWidth <= title.clientWidth + 1,
        "Week title is too small or clipped.",
      );
      assert(chip.scrollHeight <= chip.clientHeight + 1, "Week event text is vertically clipped.");
    }
    if (value === 75)
      assert(wrap().scrollHeight < total, "Compact Week does not show more events.");
    if (value === 150)
      assert(wrap().scrollHeight > total, "Detailed Week does not enlarge the list.");
    assert(
      Math.abs(
        root.querySelector(".wphead").getBoundingClientRect().top -
          wrap().getBoundingClientRect().top,
      ) < 1,
      "Week person headings no longer pinned.",
    );
    assert(
      Math.abs(
        root.querySelector(".wday").getBoundingClientRect().left -
          wrap().getBoundingClientRect().left,
      ) < 1,
      "Week dates no longer pinned.",
    );
  }
  const rapid = position();
  for (const value of [150, 75, 140, 110]) input(value);
  await settle();
  anchor(rapid);
  const beforeRefresh = position();
  await card._refetch();
  await settle();
  anchor(beforeRefresh);
  card._onClockTick();
  await settle();
  anchor(beforeRefresh);
  // Open/close details and filters through visible controls; zoom remains independent.
  const chip = [...root.querySelectorAll(".wchip")].find((el) => el.title.includes("workshop"));
  chip.click();
  await settle();
  assert(
    root.querySelector(".dialog") &&
      [...root.querySelectorAll(".dialog input,.dialog textarea")].every((el) => el.disabled),
    "Week details became writable.",
  );
  root.querySelector(".dialog .icon").click();
  await settle();
  root.querySelectorAll(".wphead")[2].click();
  await settle();
  assert(card._weekDensity === 110, "Person filter reset Week density.");
  root.querySelector(".wall-status-toggle").click();
  await settle();
  root.querySelector(".wall-status-toggle").click();
  await settle();
  const style = card.getAttribute("style");
  card.style.width = "90%";
  await settle();
  if (style === null) card.removeAttribute("style");
  else card.setAttribute("style", style);
  await settle();
  assert(card._weekDensity === 110, "Resize/Status reset Week density.");
  await view("Day");
  await zoom(80);
  await view("Timeline");
  await zoom(168);
  await view("Week");
  assert(
    slider().value === "110" && panel().hidden,
    "View switch lost Week density or left popup open.",
  );
  await view("Month");
  assert(!toggle(), "Week zoom leaked into Month.");
  await view("Agenda");
  assert(!toggle(), "Week zoom leaked into Agenda.");
  await view("Week");
  // A later read may defer anchoring, but newer browsing/navigation must win.
  const hold = async () => {
    let release;
    delayed = new Promise((resolve) => {
      release = resolve;
    });
    const request = card._refetch();
    await nextRender();
    return async () => {
      delayed = undefined;
      release();
      await request;
      await settle();
    };
  };
  await browse();
  await open();
  const beforeSlow = position(),
    finish = await hold();
  input(150);
  await nextRender();
  assert(card._weekScrollAnchor, "Week discarded its anchor during a read.");
  await finish();
  anchor(beforeSlow);
  const finishPan = await hold();
  input(75);
  await nextRender();
  wrap().dispatchEvent(new WheelEvent("wheel", { bubbles: true }));
  wrap().scrollTop = 40;
  await finishPan();
  assert(Math.abs(wrap().scrollTop - 40) < 1, "Late zoom restoration overrode newer browsing.");
  const finishDate = await hold();
  input(140);
  await nextRender();
  root.querySelector('button[aria-label="Next week"]').click();
  await nextRender();
  await finishDate();
  assert(!card._weekScrollAnchor && card._weekOffset === 1, "Week kept an obsolete date anchor.");
  root.querySelector(".weeknav .nav-now").click();
  await settle();
  await browse();
  await open();
  input(125);
  card.style.display = "none";
  await nextRender();
  assert(card._weekScrollAnchor, "Hidden Week discarded its pending anchor.");
  card.style.display = "";
  await settle();
  assert(!card._weekScrollAnchor, "Hidden Week did not restore after reveal.");
  // Empty/filter/restricted/legacy states, remembering each view without new writes.
  card.setConfig({ ...config, show_weekends: false, first_day: "sunday" });
  await settle();
  assert(
    root.querySelectorAll(".wday").length === 5 && slider().value === "125",
    "Weekday config broke saved zoom.",
  );
  card.setConfig({ ...config, views: ["week"], remember_preferences: false });
  await settle();
  await zoom(75);
  root.querySelector(".wday").click();
  await settle();
  assert(card._view === "week", "Week-only date opened a disabled view.");
  card.hass = { ...provider, callApi: async () => [] };
  await card._refetch();
  await settle();
  await zoom(150);
  assert(
    !root.querySelector(".wchip") && root.querySelectorAll(".wday").length === 7,
    "Empty Week broke zoom.",
  );
  card.setConfig({ ...config, layout: "default" });
  await settle();
  assert(
    !toggle() && !root.querySelector(".weekgrid").style.getPropertyValue("--week-scale"),
    "Week zoom changed legacy.",
  );
  card.hass = provider;
  card.setConfig(config);
  await settle();
  assert(
    card._dayHourHeight === 80 && card._timelineZoomWidth === 168,
    "Week updates erased other saved scales.",
  );
  await zoom(125);
  return reload("saved");
}
