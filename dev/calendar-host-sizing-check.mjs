import { agendaContextEvents } from "./calendar-agenda-context-check.mjs";

// HA panel views have content-sized parents and inline custom-element wrappers.
// The normal harness's 100%-height block host concealed this integration failure.
export async function runHostSizingChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const original = card._config;
  const parent = card.parentElement;
  const style = document.createElement("style");
  style.textContent =
    "body{display:block;overflow:auto} main{height:auto} moran-family-board-card{display:inline;height:auto}";
  document.head.append(style);
  let reads = 0;
  let payload = agendaContextEvents;
  card.hass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Host sizing attempted a provider write.");
      reads++;
      return path.includes("fixture_family") ? payload : [];
    },
    callWS: async () => {
      throw new Error("Host sizing attempted a mutation.");
    },
  };
  const config = {
    ...original,
    layout: "wall",
    read_only: true,
    full_height: true,
    remember_preferences: false,
    refresh_interval: 0,
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    show_focus: true,
    scroll_to_now: true,
  };
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (!card._loading) return;
    }
    throw new Error("Host sizing did not settle.");
  };
  const bounds = () => {
    const shell = root.querySelector(".moran-wall-shell");
    const panel = root.querySelector("#calendar-panel");
    const r = shell.getBoundingClientRect(),
      p = panel.getBoundingClientRect();
    return { shell, panel, r, p };
  };
  const fitted = (view, bottom = innerHeight) => {
    const { r, p, panel } = bounds();
    assert(
      Math.abs(r.bottom - bottom) < 3,
      `${view} wall bottom ${r.bottom} does not fit host ${bottom}.`,
    );
    assert(
      Math.abs(p.bottom - r.bottom) < 3 && panel.clientHeight > 20,
      `${view} does not own the remaining height: ${p.height}.`,
    );
    assert(
      document.documentElement.scrollHeight <= innerHeight + 3,
      `${view} expanded the document instead of its scroll region.`,
    );
    return panel;
  };
  const select = async (view) => {
    root.querySelector(`#view-tab-${view}`).click();
    await settle();
    for (let i = 0; i < 5; i++) await nextRender();
  };
  card.setConfig({ ...config, view: "agenda" });
  await settle();
  for (let i = 0; i < 5; i++) await nextRender();
  let panel = fitted("agenda");
  assert(
    panel.scrollHeight > panel.clientHeight + 100 && panel.scrollTop > 0,
    "Content-sized Agenda did not scroll to the selected date.",
  );
  const current = root.querySelector(".agenda-date.today").getBoundingClientRect();
  assert(
    current.top >= bounds().p.top - 2 && current.bottom <= bounds().p.bottom,
    "Agenda's selected date is not visible inside the scroll region.",
  );
  const before = reads;
  for (const view of ["week", "month", "day", "timeline", "agenda"]) {
    await select(view);
    panel = fitted(view);
    // A view-local scroll must remain possible even in an unconstrained HA parent.
    if (panel.scrollHeight > panel.clientHeight + 100) {
      panel.scrollTop = 100;
      await nextRender();
      assert(Math.abs(panel.scrollTop - 100) < 2, `${view} cannot scroll inside the host.`);
    }
  }
  assert(reads - before <= 4, "Sizing/view changes introduced extra source reads.");
  // The explicit Today action, refresh and details must use the same inner scroller.
  root.querySelector(".nav-now").click();
  await settle();
  assert(panel.scrollTop > 100, "Agenda Today did not restore its current group.");
  panel.scrollTop = 250;
  await card._refetch();
  await settle();
  assert(Math.abs(panel.scrollTop - 250) < 2, "Refresh reset manual Agenda browsing.");
  const row = [...panel.querySelectorAll(".agenda-row")].find((n) => {
    const r = n.getBoundingClientRect();
    return r.top >= bounds().p.top && r.bottom <= bounds().p.bottom;
  });
  row.focus({ preventScroll: true });
  row.click();
  await nextRender();
  assert(
    root.querySelector(".dialog") && !root.querySelector(".dialog button.primary"),
    "Read-only details did not open in the HA-like host.",
  );
  root.querySelector(".dialog .icon").click();
  await nextRender();
  assert(
    root.activeElement === row && Math.abs(panel.scrollTop - 250) < 2,
    "Details lost focus or scrolling in the HA-like host.",
  );
  root.querySelector(".wall-status-toggle").click();
  await nextRender();
  fitted("expanded Status");
  assert(panel.scrollTop === 250, "Status disclosure reset manual browsing.");
  root.querySelector(".wall-status-toggle").click();
  await nextRender();

  // External height changes and hidden -> shown must work for an inline HA host.
  const shortHeight = Math.max(260, innerHeight - 180);
  parent.style.height = `${shortHeight}px`;
  for (let i = 0; i < 8; i++) await nextRender();
  fitted("bounded parent", parent.getBoundingClientRect().bottom);
  parent.style.display = "none";
  card.setConfig({ ...config, view: "agenda" });
  await settle();
  assert(card._agendaScrollDate !== undefined, "Hidden Agenda consumed its pending navigation.");
  parent.style.display = "";
  for (let i = 0; i < 12; i++) await nextRender();
  panel = fitted("revealed parent", parent.getBoundingClientRect().bottom);
  assert(
    panel.scrollTop > 100 && card._agendaScrollDate === undefined,
    "Revealing an inline HA host did not restore Agenda's selected date.",
  );
  parent.style.height = "";
  for (let i = 0; i < 8; i++) await nextRender();
  fitted("resized parent");

  // Empty content fills rather than collapsing. Turning full-height off removes ownership.
  payload = [];
  await card._refetch();
  await settle();
  fitted("empty Agenda");
  assert(root.querySelector(".agenda-empty"), "Empty Agenda did not render its message.");
  const emptyReads = reads;
  const descriptor = Object.getOwnPropertyDescriptor(window, "innerHeight");
  const oldHeight = innerHeight;
  Object.defineProperty(window, "innerHeight", { configurable: true, value: oldHeight - 40 });
  window.dispatchEvent(new Event("resize"));
  await nextRender();
  // Document still has the real viewport height; inspect shell geometry directly here.
  assert(
    Math.abs(bounds().r.bottom - (oldHeight - 40)) < 3,
    "Viewport height-only resize left a stale shell.",
  );
  Object.defineProperty(window, "innerHeight", descriptor);
  window.dispatchEvent(new Event("resize"));
  await nextRender();
  assert(reads === emptyReads, "Viewport sizing fetched calendar data.");
  card.setConfig({ ...config, view: "agenda", full_height: false });
  await settle();
  assert(
    !bounds().shell.style.height,
    "Disabling full_height retained a viewport height override.",
  );
  card.setConfig({ ...config, view: "agenda", layout: "legacy" });
  await settle();
  assert(
    !root.querySelector(".moran-wall-shell") && root.querySelector("ha-card"),
    "Wall sizing leaked into legacy.",
  );
  style.remove();
  card.setConfig(original);
  await settle();
  return [
    "host sizing: five views, Today/details/manual scroll, bounded/hidden/empty/resize, opt-out/legacy",
  ];
}
