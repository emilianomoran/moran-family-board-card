// Synthetic compiled-browser regression: today's Timeline opens near now, once.
export async function runTimelineScrollChecks(card, config, settle, nextRender) {
  const root = card.shadowRoot;
  const wrap = () => root.querySelector(".tlwrap");
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const waitFor = async (predicate, message) => {
    for (let i = 0; i < 120; i++) {
      await nextRender();
      if (predicate()) return;
    }
    throw new Error(message);
  };
  const expectedLeft = () => {
    const { startMin, endMin } = card._dayWindow(card._shownDay());
    const clock = card.nowProvider();
    const minute = Math.max(startMin, Math.min(endMin, clock.getHours() * 60 + clock.getMinutes()));
    const grid = wrap();
    const label = root.querySelector(".tlcorner").offsetWidth;
    const px = root.querySelector(".tlhours").offsetWidth / (endMin - startMin);
    return Math.max(
      0,
      Math.min(
        grid.scrollWidth - grid.clientWidth,
        (minute - startMin) * px - (grid.clientWidth - label) / 3,
      ),
    );
  };
  const centered = async (message) => {
    await waitFor(() => Math.abs(wrap().scrollLeft - expectedLeft()) < 2, message);
  };
  const manual = () => wrap().scrollTo({ left: 120, behavior: "instant" });
  const today = () => root.querySelector('button[aria-label="Show today"]').click();
  const view = async (name) => {
    [...root.querySelectorAll(".switch button")]
      .find((b) => b.textContent.trim().toLowerCase() === name)
      .click();
    await settle();
  };
  const date = () => root.querySelector('.tabs button[aria-label="Thursday, Feb 19"]').click();
  const clock = card.nowProvider;
  const provider = card.hass;
  const initialStyle = card.getAttribute("style");

  wrap().scrollTo({ left: 0, behavior: "instant" });
  card.setConfig({ ...config, scroll_to_now: true });
  await settle();
  await centered("Timeline did not scroll near now on initial entry.");
  const now = root.querySelector(".tlnow").getBoundingClientRect();
  assert(
    now.left > root.querySelector(".tlperson").getBoundingClientRect().right &&
      now.left < wrap().getBoundingClientRect().right,
    "Now is hidden behind names or outside Timeline.",
  );

  manual();
  await nextRender();
  card._onClockTick();
  await card._maybeFetch(true);
  await settle();
  root.querySelector(".wall-status-toggle").click();
  await settle();
  root.querySelector(".wall-status-toggle").click();
  root.querySelector(".tlperson").click();
  await settle();
  root.querySelector(".tlperson").click();
  card.style.width = "90%";
  await settle();
  if (initialStyle === null) card.removeAttribute("style");
  else card.setAttribute("style", initialStyle);
  await settle();
  assert(
    Math.abs(wrap().scrollLeft - 120) < 2,
    "Tick, refresh, Status, filter or resize stole manual time browsing.",
  );

  // Record native calls while checking reduced-motion semantics, not just final position.
  const grid = wrap();
  const nativeScroll = grid.scrollTo;
  const calls = [];
  grid.scrollTo = function (options) {
    calls.push(options);
    return nativeScroll.call(this, options);
  };
  today();
  await settle();
  await centered("Today did not recenter the already-selected current date.");
  assert(
    calls.at(-1)?.behavior ===
      (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"),
    "Timeline Today ignored reduced motion.",
  );
  grid.scrollTo = nativeScroll;

  await view("day");
  await view("timeline");
  await centered("Switching back into Timeline did not reveal now.");
  root.querySelector('button[aria-label="Next week"]').click();
  await settle();
  manual();
  today();
  await settle();
  await centered("Today from another week did not recenter Timeline.");
  assert(card._weekOffset === 0 && card._day === card._todayIndex(), "Today lost its date reset.");

  card.setConfig({ ...config, scroll_to_now: false, show_now_line: false });
  manual();
  await settle();
  assert(Math.abs(wrap().scrollLeft - 120) < 2, "Disabled auto-scroll moved Timeline.");
  today();
  await settle();
  await centered("Explicit Today requires auto-scroll or the decorative now line.");
  assert(!root.querySelector(".tlnow"), "Hidden now-line fixture is invalid.");

  // A queued frame must not move a different day or a replacement view.
  manual();
  card._scrollToNowRequested = true;
  card._maybeScrollToNow();
  date();
  await settle();
  assert(
    Math.abs(wrap().scrollLeft - 120) < 2 && !card._scrollToNowRequested,
    "An obsolete Today frame moved another date.",
  );
  today();
  await settle();
  await centered("Today failed after an obsolete frame.");
  const old = wrap();
  let staleCalls = 0;
  old.scrollTo = () => {
    staleCalls++;
  };
  card._scrollToNowRequested = true;
  card._maybeScrollToNow();
  await view("week");
  assert(staleCalls === 0, "A queued Timeline frame ran after leaving the view.");

  // Slow data must establish the trimmed range before centering; cancellation is sticky.
  const pending = [];
  card.hass = {
    ...provider,
    callApi: (...args) =>
      new Promise((resolve) => pending.push(() => provider.callApi(...args).then(resolve))),
  };
  card.setConfig({ ...config, scroll_to_now: true, trim_hours: true });
  await nextRender();
  assert(card._loading && !card._scrolledKey, "Timeline centered before its data loaded.");
  today();
  await nextRender();
  assert(card._scrollToNowRequested, "Loading dropped Timeline's Today request.");
  pending.splice(0).forEach((finish) => finish());
  await settle();
  await centered("Delayed trimmed Timeline did not reveal now.");
  const refresh = card._maybeFetch(true);
  await nextRender();
  today();
  await nextRender();
  date();
  await nextRender();
  const before = wrap().scrollLeft;
  pending.splice(0).forEach((finish) => finish());
  await refresh;
  await settle();
  assert(
    !card._scrollToNowRequested && Math.abs(wrap().scrollLeft - before) < 2,
    "Finishing a slow read recentered the wrong date.",
  );
  card.hass = provider;

  // Width preference and a custom pinned-label width must share the renderer's geometry.
  card.style.setProperty("--fb-tl-label", "180px");
  card.setConfig({ ...config, scroll_to_now: true, hour_width: 240 });
  await settle();
  await centered("Timeline centering ignored hour width or pinned-label width.");
  if (initialStyle === null) card.removeAttribute("style");
  else card.setAttribute("style", initialStyle);

  // Before/after the configured visible range clamp to scrollable bounds.
  for (const hour of [1, 23]) {
    card.nowProvider = () => {
      const d = clock();
      d.setHours(hour, 0, 0, 0);
      return d;
    };
    card.setConfig({
      ...config,
      scroll_to_now: true,
      start_hour: 6,
      end_hour: 22,
      hour_width: 240,
    });
    await settle();
    await centered("Timeline did not clamp now to its configured time range.");
  }
  card.nowProvider = clock;

  // First render can be hidden in an HA tab; showing it must retry initial centering.
  card.style.display = "none";
  card.setConfig({ ...config, scroll_to_now: true });
  await settle();
  assert(!card._scrolledKey, "A hidden Timeline consumed its initial auto-scroll.");
  if (initialStyle === null) card.removeAttribute("style");
  else card.setAttribute("style", initialStyle);
  await settle();
  await centered("Revealing a hidden Timeline did not retry initial centering.");
}
