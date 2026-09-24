// Synthetic regression: the current-time label belongs to Timeline's pinned axis.
export async function runCalendarTimelineMarkerChecks(card, hass, nextRender) {
  const root = card.shadowRoot;
  const original = card._config;
  const config = {
    ...original,
    layout: "wall",
    view: "timeline",
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    read_only: true,
    full_height: true,
    show_now_line: true,
    scroll_to_now: false,
    remember_preferences: false,
  };
  const app = document.querySelector("#app");
  const appStyle = app.getAttribute("style");
  const clock = card.nowProvider;
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading) {
        await nextRender();
        await Promise.all(
          (root.querySelector(".tlwrap")?.getAnimations() ?? []).map((a) =>
            a.finished.catch(() => {}),
          ),
        );
        return;
      }
    }
    throw new Error("Timeline marker fixture did not settle.");
  };
  card.hass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Timeline marker attempted a calendar write.");
      return path.includes("fixture_family")
        ? Array.from({ length: 8 }, (_, i) => ({
            uid: `timeline-marker-${i}`,
            summary: `Jordan: Appointment ${i + 1}`,
            start: { dateTime: "2026-02-18T15:00:00-06:00" },
            end: { dateTime: "2026-02-18T16:30:00-06:00" },
          }))
        : [];
    },
    callWS: async () => {
      throw new Error("Timeline marker attempted a mutation.");
    },
  };
  const wrap = () => root.querySelector(".tlwrap");
  const label = () => root.querySelector(".tlnow-label, .tlnow span");
  const centered = () => {
    const line = root.querySelector(".tlnow").getBoundingClientRect();
    const text = label().getBoundingClientRect();
    const axis = root.querySelector(".tlhead").getBoundingClientRect();
    assert(
      text.top >= axis.top && text.bottom <= axis.bottom,
      `Timeline now label left its pinned hour axis: label ${text.top}–${text.bottom}, axis ${axis.top}–${axis.bottom}.`,
    );
    assert(
      Math.abs((text.left + text.right) / 2 - line.left - 1) < 2,
      "Timeline now label is detached from its clock position.",
    );
  };
  const height = Math.min(350, app.clientHeight - 10);
  app.style.height = `${height}px`;
  app.style.flex = `0 0 ${height}px`;
  card.setConfig({ ...config, scroll_to_now: false, show_now_line: true });
  await settle();
  const moveNearNow = () => {
    const line = root.querySelector(".tlnow").getBoundingClientRect();
    wrap().scrollLeft +=
      line.left -
      wrap().getBoundingClientRect().left -
      (wrap().clientWidth + root.querySelector(".tlcorner").clientWidth) / 2;
  };
  moveNearNow();
  wrap().scrollTop = 0;
  await nextRender();
  centered();
  assert(
    wrap().scrollHeight > wrap().clientHeight + 180,
    "Now-marker regression needs a vertically scrollable Timeline.",
  );
  wrap().scrollTop = 180;
  await nextRender();
  centered();

  const previousX = label().getBoundingClientRect().left;
  const previousScroll = wrap().scrollLeft;
  wrap().scrollLeft += 32;
  await nextRender();
  centered();
  assert(
    Math.abs(
      label().getBoundingClientRect().left - previousX + wrap().scrollLeft - previousScroll,
    ) < 2,
    "Now label incorrectly pins horizontally.",
  );
  const position = { top: wrap().scrollTop, left: wrap().scrollLeft };
  card.nowProvider = () => new Date(clock().getTime() + 15 * 60 * 1000);
  card._onClockTick();
  await settle();
  centered();
  assert(
    label().textContent.trim() === "3:47 PM",
    "Now label did not follow the existing clock tick.",
  );
  assert(
    wrap().scrollTop === position.top && wrap().scrollLeft === position.left,
    "Updating the now label moved manual browsing.",
  );

  // The chip shares the axis stacking context, so panning past now cannot paint
  // it over the pinned names. It must remain non-interactive like the line.
  assert(
    label().parentElement === root.querySelector(".tlhours"),
    "Now label is not owned by the pinned hour axis.",
  );
  assert(
    Number(getComputedStyle(root.querySelector(".tlcorner")).zIndex) >
      Number(getComputedStyle(label()).zIndex) &&
      Number(getComputedStyle(root.querySelector(".tlperson")).zIndex) >
        Number(getComputedStyle(root.querySelector(".tlnow")).zIndex),
    "Now marker paints over pinned person identity.",
  );
  assert(
    getComputedStyle(label()).pointerEvents === "none" &&
      getComputedStyle(root.querySelector(".tlnow")).pointerEvents === "none",
    "Decorative now marker intercepts calendar input.",
  );

  // Both visible-range edges and the narrowest/widest zoom keep the full label
  // inside the time area. End-of-range text may shift without moving the line.
  const locale = card.hass.locale;
  for (const timeFormat of ["12", "24"]) {
    card.hass = { ...card.hass, locale: { ...locale, time_format: timeFormat } };
    for (const hourWidth of [48, 240]) {
      for (const [start, end, hour, minute] of [
        [0, 24, 0, 0],
        [0, 24, 23, 59],
        [7, 21, 7, 0],
        [7, 21, 21, 0],
      ]) {
        card.nowProvider = () => {
          const now = clock();
          now.setHours(hour, minute, 0, 0);
          return now;
        };
        card.setConfig({
          ...config,
          scroll_to_now: false,
          hour_width: hourWidth,
          start_hour: start,
          end_hour: end,
        });
        await settle();
        moveNearNow();
        wrap().scrollTop = 180;
        await nextRender();
        const text = label().getBoundingClientRect();
        const hours = root.querySelector(".tlhours").getBoundingClientRect();
        const axis = root.querySelector(".tlhead").getBoundingClientRect();
        const corner = root.querySelector(".tlcorner").getBoundingClientRect();
        assert(
          text.left >= Math.max(hours.left, corner.right) - 1 &&
            text.right <= Math.min(hours.right, wrap().getBoundingClientRect().right) + 1 &&
            text.top >= axis.top &&
            text.bottom <= axis.bottom,
          `Now label clips at range edge (${timeFormat}h, ${hourWidth}px/hour, ${hour}:${minute}).`,
        );
      }
    }
  }
  card.hass = { ...card.hass, locale };

  card.nowProvider = clock;
  card.setConfig({ ...config, scroll_to_now: false, show_now_line: false });
  await settle();
  assert(!root.querySelector(".tlnow") && !label(), "Disabled now line left an orphan time label.");
  card.setConfig(config);
  await settle();
  root.querySelector('.tabs button[aria-label="Thursday, Feb 19"]').click();
  await settle();
  assert(!root.querySelector(".tlnow") && !label(), "Another date displays today's now label.");
  card.setConfig({ ...config, layout: "legacy" });
  await settle();
  assert(
    !root.querySelector(".tlnow-label") &&
      root.querySelector(".tlnow span") &&
      getComputedStyle(root.querySelector(".tlnow span")).position === "absolute",
    "Pinned current-time styling leaked into legacy.",
  );
  if (appStyle === null) app.removeAttribute("style");
  else app.setAttribute("style", appStyle);
  card.setConfig(original);
  card.hass = hass;
  await settle();
  return [
    "timeline marker: pinned time label, horizontal clock position, edge containment, zoom, locale, toggles and legacy verified",
  ];
}
