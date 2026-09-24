/** Synthetic Timeline zoom: time anchors, independent view scale, native control contract. */
export async function runTimelineDensityChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const config = {
    ...card._config,
    layout: "wall",
    view: "timeline",
    read_only: true,
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    full_height: true,
    hour_width: 96,
    hour_height: 64,
    fit_height: false,
    scroll_to_now: true,
    show_focus: true,
    remember_preferences: false,
  };
  const wrap = () => root.querySelector(".tlwrap");
  const hours = () => root.querySelector(".tlhours");
  const slider = () => root.querySelector("#wall-calendar-density");
  const toggle = () => root.querySelector(".wall-density-toggle");
  const panel = () => root.querySelector(".wall-density-panel");
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (
        !card._loading &&
        !card._timelineScrollAnchor &&
        card._timelineScrollFrame === undefined &&
        card._scrollToNowFrame === undefined
      ) {
        await nextRender();
        return;
      }
    }
    throw new Error("Timeline zoom did not settle.");
  };
  const waitFor = async (predicate, message) => {
    for (let i = 0; i < 120; i++) {
      await nextRender();
      if (predicate()) return;
    }
    throw new Error(message);
  };
  const view = async (name) => {
    [...root.querySelectorAll(".switch button")].find((b) => b.textContent.trim() === name).click();
    await settle();
  };
  const minute = () =>
    card._dayWindow(card._shownDay()).startMin +
    (wrap().getBoundingClientRect().left +
      root.querySelector(".tlcorner").offsetWidth -
      hours().getBoundingClientRect().left) /
      (card._timelineHourWidth / 60);
  const expected = (time, width) =>
    Math.max(
      0,
      Math.min(
        wrap().scrollWidth - wrap().clientWidth,
        ((time - card._dayWindow(card._shownDay()).startMin) * width) / 60,
      ),
    );
  const input = (value) => {
    slider().value = String(value);
    slider().dispatchEvent(new Event("input", { bubbles: true }));
  };
  const zoom = async (value) => {
    input(value);
    await settle();
  };
  const assertAnchor = (time, width, top) =>
    assert(
      Math.abs(wrap().scrollLeft - expected(time, width)) < 2 &&
        Math.abs(wrap().scrollTop - top) < 1,
      `Timeline ${width}px zoom lost its time/lane anchor: ${wrap().scrollLeft} vs ${expected(time, width)}.`,
    );
  const nowVisible = () => {
    const line = root.querySelector(".tlnow").getBoundingClientRect();
    return (
      line.left >= root.querySelector(".tlperson").getBoundingClientRect().right &&
      line.left < wrap().getBoundingClientRect().right
    );
  };
  card.hass = {
    ...hass,
    callApi: async (method, ...args) => {
      assert(method === "GET", "Timeline zoom attempted a calendar write.");
      return hass.callApi(method, ...args);
    },
    callWS: async () => {
      throw new Error("Timeline zoom attempted a mutation.");
    },
  };
  card.setConfig(config);
  await settle();
  await waitFor(nowVisible, "Initial Timeline did not reveal now.");
  assert(
    slider().min === "48" && slider().max === "240" && slider().value === "96",
    "Timeline lost its configured native range.",
  );
  assert(
    panel().hidden && panel().querySelector("button").disabled,
    "Zoom starts expanded/overridden.",
  );
  const height = wrap().clientHeight;
  toggle().click();
  await settle();
  assert(root.activeElement === slider(), "Timeline slider does not receive focus.");
  const pr = panel().getBoundingClientRect(),
    sr = root.querySelector(".moran-wall-shell").getBoundingClientRect();
  assert(
    pr.left >= sr.left && pr.right <= sr.right && pr.bottom <= sr.bottom,
    "Timeline popup clips.",
  );
  assert(
    root.querySelector(".moran-wall-header").offsetHeight <= 48 && wrap().clientHeight === height,
    "Timeline zoom consumes calendar height.",
  );
  assert(
    document.documentElement.scrollWidth <= innerWidth + 1,
    "Timeline zoom overflows the page.",
  );
  const titles = () =>
    [...root.querySelectorAll(".tlbar")]
      .map((e) => e.title)
      .sort()
      .join("|");
  const beforeTitles = titles(),
    date = card._dateForDay(card._shownDay()).getTime();
  wrap().scrollTo({ left: 120, top: 30, behavior: "instant" });
  await nextRender();
  for (const value of [240, 240, 96, 48, 120]) {
    const time = minute(),
      top = wrap().scrollTop;
    await zoom(value);
    assertAnchor(time, value, top);
    assert(hours().offsetWidth === 24 * value, "Timeline hours do not follow density.");
    const labels = root.querySelectorAll(".tlhour");
    assert(
      Math.abs(
        labels[2].getBoundingClientRect().left -
          labels[1].getBoundingClientRect().left -
          value * (value < 64 ? 2 : 1),
      ) < 1,
      "Timeline hour labels drift from the grid.",
    );
    const first = labels[0].getBoundingClientRect(),
      last = labels[labels.length - 1].getBoundingClientRect();
    const timeBounds = hours().getBoundingClientRect();
    assert(
      first.left >= timeBounds.left &&
        last.right <= timeBounds.right + 1 &&
        getComputedStyle(labels[labels.length - 1]).whiteSpace === "nowrap",
      "Midnight labels clip behind names or wrap beyond the time area.",
    );
    assert(
      [...labels].every(
        (label, i) =>
          i === 0 ||
          label.getBoundingClientRect().left >= labels[i - 1].getBoundingClientRect().right + 2,
      ),
      "Compact Timeline labels collide.",
    );
    for (const bar of root.querySelectorAll(".tlbar")) {
      assert(
        bar.getBoundingClientRect().height >= 48,
        "Timeline zoom shrank an event's lane target.",
      );
    }
    assert(
      Math.abs(
        root.querySelector(".tlnow").getBoundingClientRect().left -
          hours().getBoundingClientRect().left -
          ((15 * 60 + 32) * value) / 60,
      ) < 1,
      "Timeline now-line does not follow density.",
    );
    assert(
      titles() === beforeTitles && card._dateForDay(card._shownDay()).getTime() === date,
      "Timeline zoom changed events/date.",
    );
    assert(root.activeElement === slider(), "Zoom lost keyboard focus.");
  }
  // Coalesced input uses the pre-render scale; clamp only once at the final size.
  wrap().scrollTo({ left: 160, behavior: "instant" });
  await nextRender();
  const time = minute(),
    top = wrap().scrollTop;
  for (const value of [48, 240, 70, 160]) input(value);
  await settle();
  assertAnchor(time, 160, top);
  await card._refetch();
  card._onClockTick();
  await settle();
  assertAnchor(time, 160, top);
  const left = wrap().scrollLeft;
  root.querySelector(".tlperson").click();
  await settle();
  root.querySelector(".tlperson").click();
  await settle();
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
  assert(
    card._timelineHourWidth === 160 && Math.abs(wrap().scrollLeft - left) < 2,
    "Filter, Status or resize replaced manual Timeline zoom/scroll.",
  );
  root.querySelector('.tabs button[aria-label="Thursday, Feb 19"]').click();
  await settle();
  assert(
    card._timelineHourWidth === 160 && Math.abs(wrap().scrollLeft - left) < 2,
    "Date selection reset Timeline density/scroll.",
  );
  await view("Day");
  assert(Number(slider().value) === 64, "Timeline zoom leaked into Day.");
  toggle().click();
  await settle();
  await zoom(80);
  await view("Timeline");
  assert(Number(slider().value) === 160 && panel().hidden, "Timeline lost session zoom.");
  await view("Week");
  assert(toggle() && slider().value === "100", "Timeline zoom leaked into Week's independent scale.");
  await view("Day");
  assert(Number(slider().value) === 80, "Day lost independent zoom.");
  await view("Timeline");
  root.querySelector('button[aria-label="Show today"]').click();
  await settle();
  await waitFor(nowVisible, "Today cannot find now at manual Timeline density.");
  toggle().click();
  await settle();
  const resetTime = minute();
  panel().querySelector("button").click();
  await settle();
  assert(
    card._timelineZoomWidth === undefined &&
      slider().value === "96" &&
      root.activeElement === slider(),
    "Reset failed to restore configured width/focus.",
  );
  assertAnchor(resetTime, 96, wrap().scrollTop);

  // Queued zoom must not move a new date/view/config, and hidden panels retry the anchor.
  wrap().scrollTo({ left: 120, behavior: "instant" });
  await nextRender();
  const hiddenTime = minute();
  input(180);
  card.style.display = "none";
  await nextRender();
  assert(card._timelineScrollAnchor, "Hidden zoom discarded its pending anchor.");
  if (style === null) card.removeAttribute("style");
  else card.setAttribute("style", style);
  await settle();
  assertAnchor(hiddenTime, 180, wrap().scrollTop);
  input(200);
  root.querySelector('.tabs button[aria-label="Thursday, Feb 19"]').click();
  await settle();
  assert(!card._timelineScrollAnchor, "Old zoom anchor survives date selection.");
  input(220);
  await view("Day");
  assert(
    !card._timelineScrollAnchor && card._timelineScrollFrame === undefined,
    "Old Timeline frame survives view change.",
  );
  card.setConfig({ ...config, hour_width: 144, scroll_to_now: false });
  await settle();
  assert(
    slider().value === "144" && card._timelineZoomWidth === undefined && panel().hidden,
    "New config retained stale Timeline zoom.",
  );
  toggle().click();
  await settle();
  await zoom(240);
  panel().querySelector("button").click();
  await settle();
  assert(slider().value === "144", "Reset ignores a non-default configured width.");
  // Force vertical overflow: zoom must preserve the person row position, not just zero.
  const app = document.querySelector("#app"),
    appStyle = app.getAttribute("style");
  app.style.height = "300px";
  app.style.flex = "0 0 auto";
  await settle();
  wrap().scrollTo({ top: 70, left: 100, behavior: "instant" });
  await nextRender();
  const laneTop = wrap().scrollTop,
    laneTime = minute();
  assert(laneTop > 0, "Vertical Timeline anchor fixture has no overflow.");
  await zoom(200);
  assertAnchor(laneTime, 200, laneTop);
  if (appStyle === null) app.removeAttribute("style");
  else app.setAttribute("style", appStyle);
  await settle();
  // Existing details remain read-only at compact width.
  await zoom(48);
  root.querySelector(".tlbar").click();
  await settle();
  assert(
    root.querySelector(".dialog") &&
      [...root.querySelectorAll(".dialog input,.dialog textarea")].every((e) => e.disabled),
    "Zoomed Timeline details are not read-only.",
  );
  root.querySelector(".dialog .icon").click();
  await settle();
  // A late read must not substitute Today centering for a queued manual zoom.
  const provider = card.hass,
    pending = [];
  card.hass = {
    ...provider,
    callApi: (...args) =>
      new Promise((resolve) => pending.push(() => provider.callApi(...args).then(resolve))),
  };
  const refresh = card._maybeFetch(true);
  await nextRender();
  assert(card._loading, "Slow zoom fixture did not start its read.");
  const loadingTime = minute();
  input(200);
  await nextRender();
  assert(card._timelineScrollAnchor, "Loading lost the pending zoom anchor.");
  pending.splice(0).forEach((finish) => finish());
  await refresh;
  await settle();
  assertAnchor(loadingTime, 200, wrap().scrollTop);
  const interrupted = card._maybeFetch(true);
  await nextRender();
  input(220);
  await nextRender();
  wrap().dispatchEvent(new WheelEvent("wheel", { deltaX: 60, bubbles: true }));
  wrap().scrollTo({ left: 120, behavior: "instant" });
  pending.splice(0).forEach((finish) => finish());
  await interrupted;
  await settle();
  assert(
    Math.abs(wrap().scrollLeft - 120) < 2 && !card._timelineScrollAnchor,
    "Finishing a delayed zoom stole newer manual scrolling.",
  );
  card.hass = provider;
  // Dense overlaps, an all-day bar and both midnight edges remain reachable at either extreme.
  card.hass = {
    ...provider,
    callApi: async (method, path) => {
      assert(method === "GET", "Dense Timeline attempted a write.");
      if (!path.includes("fixture_family")) return [];
      const timed = (uid, start, end) => ({
        uid,
        summary: `Jordan: ${uid}`,
        start: { dateTime: `2026-02-18T${start}:00-06:00` },
        end: { dateTime: `2026-02-18T${end}:00-06:00` },
      });
      return [
        timed("Short midnight", "00:00", "00:05"),
        timed("Late check", "23:50", "23:55"),
        ...Array.from({ length: 6 }, (_, i) => timed(`Overlap ${i}`, "12:00", "13:00")),
        {
          uid: "all-day",
          summary: "Jordan: Community day",
          start: { date: "2026-02-18" },
          end: { date: "2026-02-19" },
        },
      ];
    },
  };
  card.setConfig({ ...config, scroll_to_now: false });
  await settle();
  toggle().click();
  await settle();
  for (const width of [48, 240]) {
    await zoom(width);
    const bars = [...root.querySelectorAll(".tlbar")];
    assert(
      bars.length === 9 &&
        bars.every((bar) => bar.tabIndex === 0 && bar.getBoundingClientRect().height >= 48),
      "Zoom lost dense, all-day or midnight targets.",
    );
    const overlaps = bars
      .filter((bar) => bar.title.startsWith("Overlap"))
      .map((bar) => bar.getBoundingClientRect())
      .sort((a, b) => a.top - b.top);
    assert(
      overlaps.length === 6 &&
        overlaps.every((bar, i) => i === 0 || bar.top >= overlaps[i - 1].bottom),
      "Zoom stacked overlapping appointments over each other.",
    );
  }
  card.hass = provider;
  card.setConfig({ ...config, layout: "default", hour_width: 144 });
  await settle();
  assert(!toggle() && card._timelineHourWidth === 144, "Zoom changed legacy Timeline.");
  // Leave a visible, closed popup for real keyboard/pointer/touch checks in the runner.
  card.setConfig({ ...config, scroll_to_now: false });
  await settle();
  return [
    `timeline density: ${innerWidth}px anchors, reset, view isolation, hidden/obsolete frames and read-only details verified`,
  ];
}
