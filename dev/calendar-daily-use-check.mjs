export async function runCalendarDailyUseChecks(card, hass, nextRender) {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const frame = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const settle = async (instance = card) => {
    for (let i = 0; i < 150; i++) {
      await instance.updateComplete;
      await frame();
      if (!instance._loading && instance._calendarResults.length === 2) return;
    }
    throw new Error("Daily-use fixture did not settle.");
  };
  const waitFor = async (predicate, message) => {
    for (let i = 0; i < 150; i++) {
      await frame();
      if (predicate()) return;
    }
    throw new Error(message);
  };
  const selectView = async (view, instance = card) => {
    [...instance.shadowRoot.querySelectorAll(".switch button")]
      .find((button) => button.textContent.trim().toLowerCase() === view)
      .click();
    await settle(instance);
  };
  const hidden = (instance = card) =>
    [...instance.shadowRoot.querySelectorAll(".header-row .phead")].flatMap((head, i) =>
      head.classList.contains("off") ? [i] : [],
    );
  const toggle = async (index, instance = card) => {
    instance.shadowRoot.querySelectorAll(".header-row .phead")[index].click();
    await settle(instance);
  };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const board = () => card.shadowRoot.querySelector(".board");
  const today = async () => {
    card.shadowRoot.querySelector('button[aria-label="Show today"]').click();
    await settle();
  };
  const nowVisible = () => {
    const grid = board();
    const body = grid?.querySelector(".body");
    if (!grid || !body) return false;
    const rect = grid.getBoundingClientRect();
    const sticky = [...grid.querySelectorAll(".header-row, .allday-row")].reduce(
      (sum, row) => sum + row.offsetHeight,
      0,
    );
    const now = card.nowProvider();
    const { startMin } = card._dayWindow(card._day);
    const y =
      body.getBoundingClientRect().top +
      (now.getHours() * 60 + now.getMinutes() - startMin) * card._pxPerMin;
    return y >= rect.top + sticky && y <= rect.bottom - 8;
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reloadKey = `moran-harness-daily-reload-${window.innerWidth}-${reduced}`;
  const config = structuredClone(card._config);
  await settle();
  const key = card._preferencesKey;
  assert(key, "Wall card did not enable user-scoped browser preferences.");

  // A real page reload (not just a remount) must restore user choices.
  if (sessionStorage.getItem(reloadKey) === "verify") {
    assert(
      card._view === "week" && same(card._hiddenP, [0]),
      "Page reload lost the chosen view or hidden person.",
    );
    assert(
      card._weekOffset === 0 && card._day === card._todayIndex(),
      "Reload restored an old date instead of today.",
    );
    await selectView("day");
    assert(same(hidden(), [0]), "Restored hidden person does not match the rendered header.");
    const payload = JSON.parse(localStorage.getItem(key));
    assert(
      same(Object.keys(payload).sort(), ["hidden", "version", "view"]),
      "Storage contains more than UI preferences.",
    );
    await toggle(0);
    sessionStorage.removeItem(reloadKey);
    localStorage.removeItem(key);
    return [
      `calendar daily use: ${window.innerWidth}px ${reduced ? "reduced" : "normal"} motion; Today, reload, isolation, config changes, safe storage`,
    ];
  }

  await waitFor(nowVisible, "Initial automatic scroll did not reveal now below the sticky rows.");
  // Record the explicit behavior to ensure reduced-motion users do not get animated scrolls.
  const scrollCalls = [];
  const originalScrollTo = board().scrollTo;
  const observedBoard = board();
  observedBoard.scrollTo = function (options) {
    scrollCalls.push(options);
    return originalScrollTo.call(this, options);
  };
  observedBoard.scrollTo({ top: 0, behavior: "instant" });
  await today();
  await waitFor(nowVisible, "Today did not recenter an already selected current date.");
  assert(
    scrollCalls.at(-1).behavior === (reduced ? "auto" : "smooth"),
    "Today ignored reduced motion.",
  );
  observedBoard.scrollTo = originalScrollTo;

  // Once initial centering settles, refreshes/ticks must not override intentional scrolling.
  await new Promise((resolve) => setTimeout(resolve, 600));
  board().scrollTo({ top: 120, behavior: "instant" });
  await frame();
  const manualTop = board().scrollTop;
  card._onClockTick();
  await settle();
  await card._refetch();
  await settle();
  assert(
    Math.abs(board().scrollTop - manualTop) < 2,
    "Clock tick or refresh stole the user's scroll position.",
  );

  card.shadowRoot.querySelectorAll('.tabs button')[6].click();
  await settle();
  card.shadowRoot.querySelector('button[aria-label="Next day"]').click();
  await settle();
  await today();
  await waitFor(nowVisible, "Today from another week did not reveal the current time.");
  assert(
    card._weekOffset === 0 && card._day === card._todayIndex(),
    "Today did not restore the actual date.",
  );

  // Explicit Today still works when optional decorations/automatic scrolling are off.
  card.setConfig({ ...config, scroll_to_now: false, show_now_line: false });
  await settle();
  board().scrollTo({ top: 0, behavior: "instant" });
  await today();
  await waitFor(nowVisible, "Today required the now-line or automatic scrolling option.");
  assert(!card.shadowRoot.querySelector(".nowline"), "Now-line-disabled fixture is invalid.");
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Queued centering must not apply to a different date selected before the next frame.
  const raceBoard = board();
  const raceScroll = raceBoard.scrollTo;
  let obsoleteScrolls = 0;
  raceBoard.scrollTo = function (options) {
    obsoleteScrolls++;
    return raceScroll.call(this, options);
  };
  card._scrollToNowRequested = true;
  card._maybeScrollToNow();
  card._day = (card._todayIndex() + 1) % 7;
  await nextRender();
  assert(obsoleteScrolls === 0, "A queued Today scroll moved a different date.");
  raceBoard.scrollTo = raceScroll;

  // A slow source must finish before geometry-dependent auto-centering. Navigating
  // away while an explicit Today request is waiting must cancel that request.
  const pendingReads = [];
  card.hass = {
    ...hass,
    callApi: (...args) =>
      new Promise((resolve, reject) =>
        pendingReads.push(() => hass.callApi(...args).then(resolve, reject)),
      ),
  };
  card.setConfig({ ...config, trim_hours: true });
  await nextRender();
  assert(
    card._loading && card._scrolledKey === "",
    "Auto-centering ran before source data established the day window.",
  );
  card.shadowRoot.querySelector('button[aria-label="Show today"]').click();
  await nextRender();
  assert(card._scrollToNowRequested, "Loading lost the pending explicit Today request.");
  pendingReads.splice(0).forEach((resolve) => resolve());
  await settle();
  await waitFor(nowVisible, "Deferred load did not recenter the populated, trimmed day grid.");
  const refresh = card._refetch();
  await nextRender();
  card.shadowRoot.querySelector('button[aria-label="Show today"]').click();
  await nextRender();
  card._day = (card._todayIndex() + 1) % 7;
  await nextRender();
  assert(
    !card._scrollToNowRequested,
    "Leaving today during loading retained an obsolete scroll request.",
  );
  pendingReads.splice(0).forEach((resolve) => resolve());
  await refresh;
  card.hass = hass;

  card.setConfig({ ...config, scroll_to_now: false });
  await settle();
  const ownedKeys = new Set([key]);
  const mount = async (nextConfig = config, connection = hass, hassFirst = false) => {
    const instance = document.createElement(card.localName);
    instance.nowProvider = card.nowProvider;
    if (hassFirst) instance.hass = connection;
    instance.setConfig({ ...nextConfig, scroll_to_now: false });
    if (!hassFirst) instance.hass = connection;
    card.parentElement.append(instance);
    await settle(instance);
    if (instance._preferencesKey) ownedKeys.add(instance._preferencesKey);
    return instance;
  };
  const checkRemount = async (
    nextConfig,
    connection,
    expectedView,
    expectedHidden,
    hassFirst = false,
  ) => {
    const instance = await mount(nextConfig, connection, hassFirst);
    try {
      assert(
        instance._view === expectedView && same(instance._hiddenP, expectedHidden),
        "Preference identity/remount mismatch.",
      );
    } finally {
      instance.remove();
    }
  };
  await toggle(0);
  await selectView("week");
  await checkRemount(config, hass, "week", [0]);
  await checkRemount(config, hass, "week", [0], true);
  await checkRemount(config, { ...hass, user: { id: "fixture-other-user" } }, "day", []);
  await checkRemount({ ...config, preferences_key: "fixture-other-card" }, hass, "day", []);
  await checkRemount({ ...config, persons: [...config.persons].reverse() }, hass, "day", []);
  await checkRemount({ ...config, views: ["day", "agenda"] }, hass, "day", []);
  await checkRemount({ ...config, view: "agenda" }, hass, "agenda", []);
  await checkRemount({ ...config, remember_preferences: false }, hass, "day", []);
  await checkRemount({ ...config, layout: "default" }, hass, "day", []);
  await checkRemount(config, { ...hass, user: undefined }, "day", []);

  // Routine HA updates do not restore defaults; switching identities does restore the right choices.
  card.hass = { ...hass, states: { ...hass.states } };
  await settle();
  assert(
    card._view === "week" && same(card._hiddenP, [0]),
    "Routine HA state update reset UI choices.",
  );
  card.hass = { ...hass, user: { id: "fixture-other-user" } };
  await settle();
  assert(card._view === "day" && !card._hiddenP.length, "Another HA user inherited saved choices.");
  card.hass = hass;
  await settle();
  assert(
    card._view === "week" && same(card._hiddenP, [0]),
    "Returning HA user did not recover choices.",
  );

  // Kiosk reset is deliberately transient; it must not rewrite the saved preference.
  const kiosk = await mount({ ...config, auto_return: 1 });
  const beforeKiosk = localStorage.getItem(key);
  kiosk._lastInteract = 0;
  kiosk._kioskReturn();
  await settle(kiosk);
  assert(
    kiosk._view === "day" && !kiosk._hiddenP.length && localStorage.getItem(key) === beforeKiosk,
    "Kiosk return overwrote saved choices.",
  );
  kiosk.remove();

  const storageDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
  try {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("Synthetic restricted storage");
      },
    });
    const restricted = await mount(config);
    await toggle(0, restricted);
    await selectView("week", restricted);
    assert(
      restricted._view === "week" && same(restricted._hiddenP, [0]),
      "Blocked storage broke ordinary interactions.",
    );
    restricted.remove();
  } finally {
    if (storageDescriptor) Object.defineProperty(window, "localStorage", storageDescriptor);
  }
  const saved = localStorage.getItem(key);
  localStorage.setItem(key, "{invalid");
  await checkRemount(config, hass, "day", []);
  localStorage.setItem(key, saved);

  // Leave the chosen view/hidden people, but a different date, before a genuine page reload.
  for (const ownedKey of ownedKeys) if (ownedKey !== key) localStorage.removeItem(ownedKey);
  assert(
    card._view === "week" && same(card._hiddenP, [0]),
    "Reload fixture lost its saved choices.",
  );
  card.shadowRoot.querySelector('button[aria-label="Next week"]').click();
  await settle();
  sessionStorage.setItem(reloadKey, "verify");
  window.location.reload();
  return new Promise(() => {});
}
