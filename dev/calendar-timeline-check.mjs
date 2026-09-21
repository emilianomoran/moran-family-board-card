// Synthetic geometry and interaction checks for the full-height wall Timeline.
export async function runCalendarTimelineChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const original = card._config;
  const app = document.querySelector("#app");
  const appStyle = app.getAttribute("style");
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
    throw new Error("Timeline did not settle.");
  };
  let dense = false;
  card.hass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Timeline attempted a calendar write.");
      return path.includes("fixture_family")
        ? Array.from({ length: dense ? 8 : 1 }, (_, i) => ({
            uid: `timeline-${i}`,
            summary: `Jordan: Planning session ${i + 1}`,
            start: { dateTime: "2026-02-18T15:00:00-06:00" },
            end: { dateTime: "2026-02-18T16:30:00-06:00" },
          }))
        : [];
    },
    callWS: async () => {
      throw new Error("Timeline attempted a mutation.");
    },
  };
  const config = {
    ...original,
    layout: "wall",
    view: "timeline",
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    read_only: true,
    full_height: true,
    show_focus: true,
    scroll_to_now: false,
    remember_preferences: false,
  };
  card.setConfig(config);
  await settle();
  const wrap = () => root.querySelector(".tlwrap");
  const check = () => {
    const shell = root.querySelector(".moran-wall-shell").getBoundingClientRect();
    const rect = wrap().getBoundingClientRect();
    assert(
      Math.abs(rect.bottom - shell.bottom) < 2,
      `Timeline leaves unused panel space: ${shell.bottom - rect.bottom}px.`,
    );
    assert(
      rect.top >= root.querySelector(".wall-datebar").getBoundingClientRect().bottom - 1,
      "Timeline overlaps date navigation.",
    );
    assert(wrap().scrollWidth > wrap().clientWidth, "Timeline lost horizontal time scrolling.");
    assert(
      root.querySelector(".tlgrid").getBoundingClientRect().height >= wrap().clientHeight - 1,
      "Person rows do not fill Timeline.",
    );
    for (const canvas of root.querySelectorAll(".tlcanvas")) {
      const lane = canvas.getBoundingClientRect();
      const row = canvas.parentElement.getBoundingClientRect();
      assert(
        Math.abs(lane.height - row.height + 1) < 2,
        "Timeline grid background does not fill its person row.",
      );
      const bars = [...canvas.querySelectorAll(".tlbar")].map((b) => b.getBoundingClientRect());
      for (const bar of bars) {
        assert(
          bar.top >= lane.top && bar.bottom <= lane.bottom + 1 && bar.height >= 48,
          "Timeline appointment clips outside its lane or loses its touch target.",
        );
      }
      bars.sort((a, b) => a.top - b.top);
      for (let i = 1; i < bars.length; i++)
        assert(bars[i].top >= bars[i - 1].bottom, "Overlapping Timeline events cover one another.");
    }
    assert(
      document.documentElement.scrollHeight <= innerHeight + 1,
      "Timeline makes the whole document overflow.",
    );
  };
  check();
  wrap().scrollLeft = 1200;
  await nextRender();
  const person = root.querySelector(".tlperson");
  assert(
    Math.abs(person.getBoundingClientRect().left - wrap().getBoundingClientRect().left) < 2,
    "Names no longer remain pinned while scrolling time.",
  );
  const left = wrap().scrollLeft;
  const height = wrap().clientHeight;
  const toggle = root.querySelector(".wall-status-toggle");
  toggle.click();
  await settle();
  check();
  assert(
    wrap().clientHeight < height && Math.abs(wrap().scrollLeft - left) < 2,
    "Status expansion loses Timeline size/scroll context.",
  );
  toggle.click();
  await settle();
  check();
  assert(wrap().clientHeight === height, "Status collapse does not return Timeline space.");
  const jordan = root.querySelectorAll(".tlperson")[1];
  jordan.click();
  await settle();
  check();
  assert(
    !root.querySelectorAll(".tlrow")[1].querySelector(".tlbar"),
    "Hiding a person leaves their events visible.",
  );
  jordan.click();
  await settle();
  check();
  assert(
    root.querySelectorAll(".tlrow")[1].querySelector(".tlbar"),
    "Restoring a person loses their events.",
  );
  root.querySelector(".tlbar").click();
  await nextRender();
  assert(
    root.querySelector(".dialog") &&
      [...root.querySelectorAll(".dialog input,.dialog textarea")].every((e) => e.disabled),
    "Timeline details are not read-only.",
  );
  root.querySelector(".dialog .icon").click();
  await nextRender();
  const shortHeight = Math.min(350, app.clientHeight - 10);
  app.style.height = `${shortHeight}px`;
  app.style.flex = `0 0 ${shortHeight}px`;
  await settle();
  check();
  assert(
    wrap().scrollHeight > wrap().clientHeight,
    "Short panel compresses rows instead of allowing vertical scroll.",
  );
  if (appStyle === null) app.removeAttribute("style");
  else app.setAttribute("style", appStyle);
  await settle();
  check();
  root.querySelector('.tabs button[aria-label="Thursday, Feb 19"]').click();
  await settle();
  check();
  assert(
    root.querySelector(".empty") && !root.querySelector(".tlbar"),
    "An empty day lost its full-height empty state.",
  );
  root.querySelector('.tabs button[aria-label="Wednesday, Feb 18"]').click();
  await settle();
  dense = true;
  await card._maybeFetch(true);
  await settle();
  check();
  assert(root.querySelectorAll(".tlbar").length === 8, "Dense overlaps lose appointments.");
  wrap().scrollTop = wrap().scrollHeight;
  await nextRender();
  assert(
    Math.abs(
      root.querySelector(".tlhead").getBoundingClientRect().top -
        wrap().getBoundingClientRect().top,
    ) < 2,
    "Time header does not stick during vertical scroll.",
  );
  dense = false;
  card.setConfig({ ...config, layout: "legacy" });
  await settle();
  assert(
    getComputedStyle(root.querySelector(".tlgrid")).display === "block",
    "Full-height Timeline styles leaked into legacy.",
  );
  assert(
    root.querySelector(".tlcanvas").style.height === "38px",
    "Legacy Timeline lane density changed.",
  );
  card.setConfig(original);
  card.hass = hass;
  await settle();
  return [
    `calendar timeline: ${innerWidth}px remaining height, responsive rows, scroll, status, filters, dense overlaps, read-only details, legacy`,
  ];
}
