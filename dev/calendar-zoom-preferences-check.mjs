/** Real reloads plus isolated synthetic browser-storage checks; no calendar writes. */
export async function runZoomPreferencesChecks(card, hass, nextRender) {
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const root = card.shadowRoot;
  const identity = `fixture-zoom-${innerWidth}-${document.querySelector("#app").clientWidth}-${matchMedia("(prefers-reduced-motion: reduce)").matches}`;
  const phaseKey = `${identity}-reload`;
  const config = {
    ...card._config,
    preferences_key: identity,
    remember_preferences: true,
    layout: "wall",
    view: "day",
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    hour_height: 64,
    hour_width: 96,
    fit_height: false,
    read_only: true,
    scroll_to_now: true,
  };
  const provider = {
    ...hass,
    callApi: async (method, ...args) => {
      assert(method === "GET", "Zoom preferences attempted a calendar write.");
      return hass.callApi(method, ...args);
    },
    callWS: async () => {
      throw new Error("Zoom preferences attempted a mutation.");
    },
  };
  const settle = async (instance = card) => {
    for (let i = 0; i < 150; i++) {
      await instance.updateComplete;
      await nextRender();
      if (
        !instance._loading &&
        !instance._dayScrollAnchor &&
        !instance._timelineScrollAnchor &&
        instance._scrollToNowFrame === undefined
      ) {
        await nextRender();
        return;
      }
    }
    throw new Error("Zoom preferences did not settle.");
  };
  const view = async (name, instance = card) => {
    [...instance.shadowRoot.querySelectorAll(".switch button")]
      .find((b) => b.textContent.trim() === name)
      .click();
    await settle(instance);
  };
  const zoom = async (value, instance = card) => {
    const r = instance.shadowRoot;
    if (r.querySelector(".wall-density-panel").hidden)
      r.querySelector(".wall-density-toggle").click();
    await settle(instance);
    const slider = r.querySelector("#wall-calendar-density");
    slider.value = String(value);
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    await settle(instance);
  };
  const reset = async () => {
    if (root.querySelector(".wall-density-panel").hidden)
      root.querySelector(".wall-density-toggle").click();
    await settle();
    root.querySelector(".wall-density-panel button").click();
    await settle();
  };
  const values = (instance = card) => [
    instance._dayHourHeight ?? null,
    instance._timelineZoomWidth ?? null,
  ];
  const expectZoom = (day, timeline, instance = card) =>
    assert(
      JSON.stringify(values(instance)) === JSON.stringify([day, timeline]),
      `Saved zoom mismatch: ${values(instance)} vs ${[day, timeline]}.`,
    );
  card.hass = provider;
  card.setConfig(config);
  await settle();
  const key = card._preferencesKey;
  assert(key, "Zoom fixture has no user-scoped preference identity.");
  const payload = () => JSON.parse(localStorage.getItem(key));
  const reload = (phase) => {
    sessionStorage.setItem(phaseKey, phase);
    location.reload();
    return new Promise(() => {});
  };
  const nowVisible = async () => {
    for (let i = 0; i < 120; i++) {
      await nextRender();
      const wrap = root.querySelector(".tlwrap").getBoundingClientRect();
      const line = root.querySelector(".tlnow").getBoundingClientRect();
      const names = root.querySelector(".tlperson").getBoundingClientRect();
      if (line.left >= names.right && line.left < wrap.right) return;
    }
    throw new Error("Reload did not reveal now at the saved Timeline scale.");
  };

  if (sessionStorage.getItem(phaseKey) === "restored") {
    expectZoom(80, 168);
    assert(
      card._view === "timeline" && card._hiddenP.join() === "0",
      "Reload lost view/person preferences.",
    );
    assert(
      card._weekOffset === 0 && card._day === card._todayIndex(),
      "Zoom restored an old browsing date.",
    );
    assert(
      root.querySelector(".tlhours").offsetWidth === 168 * 24,
      "Restored Timeline scale was not rendered.",
    );
    await nowVisible();
    await view("Day");
    assert(
      root.querySelector(".body").offsetHeight === 80 * 24,
      "Restored Day scale was not rendered.",
    );
    await reset();
    expectZoom(null, 168);
    assert(
      !payload().zoom.day && payload().zoom.timeline.value === 168,
      "Day Reset erased the wrong saved zoom.",
    );
    return reload("reset");
  }
  if (sessionStorage.getItem(phaseKey) === "reset") {
    expectZoom(null, 168);
    assert(
      root.querySelector("#wall-calendar-density").value === "64",
      "Reset did not survive reload.",
    );
    await view("Timeline");
    await reset();
    expectZoom(null, null);
    assert(!payload().zoom, "Reset left a stale saved zoom override.");
    localStorage.removeItem(key);
    sessionStorage.removeItem(phaseKey);
    return [
      `calendar zoom preferences: ${innerWidth}px real reloads, Reset, migration, defaults, users, opt-out and blocked storage verified`,
    ];
  }

  // Migration preserves existing choices but ignores zoom invented in a v1 payload.
  localStorage.setItem(
    key,
    JSON.stringify({
      version: 1,
      view: "week",
      hidden: [0],
      zoom: { day: 96 },
      events: ["discard"],
    }),
  );
  card.setConfig(config);
  await settle();
  assert(
    card._view === "week" && card._hiddenP.join() === "0" && payload().version === 2,
    "v1 migration lost UI choices.",
  );
  expectZoom(null, null);
  assert(!payload().events && !payload().zoom, "Migration retained unknown fields.");
  await view("Day");
  await zoom(80);
  await view("Timeline");
  await zoom(168);
  assert(
    Object.keys(payload()).sort().join() === "hidden,version,view,zoom",
    "Storage contains non-UI data.",
  );
  assert(
    payload().zoom.day.value === 80 && payload().zoom.timeline.value === 168,
    "Independent zoom not stored.",
  );
  const saved = localStorage.getItem(key);
  card.hass = { ...provider, states: { ...provider.states } };
  await settle();
  expectZoom(80, 168);

  const remount = async (nextConfig = config, connection = provider, hassFirst = false) => {
    const instance = document.createElement(card.localName);
    instance.nowProvider = card.nowProvider;
    if (hassFirst) instance.hass = connection;
    instance.setConfig(nextConfig);
    if (!hassFirst) instance.hass = connection;
    card.parentElement.append(instance);
    await settle(instance);
    return instance;
  };
  for (const hassFirst of [false, true]) {
    const instance = await remount(config, provider, hassFirst);
    expectZoom(80, 168, instance);
    instance.remove();
  }
  for (const [cfg, connection] of [
    [{ ...config, preferences_key: `${identity}-other` }, provider],
    [{ ...config, persons: [...config.persons].reverse() }, provider],
    [{ ...config, views: ["day", "agenda"] }, provider],
    [{ ...config, layout: "default", remember_preferences: true }, provider],
    [config, { ...provider, user: { id: "fixture-other-zoom-user" } }],
    [config, { ...provider, user: undefined }],
  ]) {
    const instance = await remount(cfg, connection);
    expectZoom(null, null, instance);
    instance.remove();
  }
  card.hass = { ...provider, user: { id: "fixture-other-zoom-user" } };
  await settle();
  expectZoom(null, null);
  card.hass = provider;
  await settle();
  expectZoom(80, 168);
  card.setConfig({ ...config, show_focus: true });
  await settle();
  expectZoom(80, 168);
  card.setConfig({ ...config, hour_height: 72 });
  await settle();
  expectZoom(null, 168);
  assert(
    card._view === "timeline" && card._hiddenP.join() === "0",
    "Changed density defaults erased view/filters.",
  );
  card.setConfig(config);
  await settle();
  expectZoom(null, 168); // invalidation is durable
  await view("Day");
  await zoom(80);
  card.setConfig({ ...config, fit_height: true });
  await settle();
  expectZoom(null, 168);
  assert(!payload().zoom.day, "Changed fit default left an override in storage.");
  await zoom(96);
  assert(card._pxPerMin * 60 === 96, "Stored manual Day zoom does not override fit.");
  card.setConfig({ ...config, fit_height: true });
  await settle();
  expectZoom(96, 168);
  await reset();
  expectZoom(null, 168);
  assert(card._pxPerMin * 60 <= 64, "Reset failed to resume configured fit.");
  card.setConfig(config);
  await settle();
  await zoom(80);
  card.setConfig({ ...config, hour_width: 144 });
  await settle();
  expectZoom(80, null);
  assert(!payload().zoom.timeline, "Changed Timeline defaults left a saved override.");
  card.setConfig(config);
  await settle();
  await view("Timeline");
  await zoom(168);

  const beforeOptOut = localStorage.getItem(key);
  card.setConfig({ ...config, remember_preferences: false });
  await settle();
  await zoom(40);
  await view("Timeline");
  await zoom(240);
  assert(localStorage.getItem(key) === beforeOptOut, "Opt-out wrote preferences.");
  card.setConfig({ ...config, remember_preferences: false });
  await settle();
  expectZoom(null, null);
  card.setConfig(config);
  await settle();
  expectZoom(80, 168);

  const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
  try {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("Synthetic blocked storage");
      },
    });
    card.setConfig(config);
    await settle();
    await zoom(40);
    await view("Timeline");
    await zoom(240);
    expectZoom(40, 240);
  } finally {
    if (descriptor) Object.defineProperty(window, "localStorage", descriptor);
  }
  card.setConfig(config);
  await settle();
  expectZoom(80, 168);
  const setItem = Storage.prototype.setItem;
  try {
    Storage.prototype.setItem = function () {
      throw new Error("Synthetic quota failure");
    };
    await view("Day");
    await zoom(48);
    await view("Timeline");
    await zoom(200);
    expectZoom(48, 200);
  } finally {
    Storage.prototype.setItem = setItem;
  }
  card.setConfig(config);
  await settle();
  expectZoom(80, 168);
  assert(localStorage.getItem(key) === saved, "Failure fallback overwrote last valid preferences.");

  // A malformed zoom should not erase valid view/hidden choices.
  const invalid = payload();
  invalid.zoom.day.value = 10000;
  invalid.zoom.timeline.defaults = "wrong";
  localStorage.setItem(key, JSON.stringify(invalid));
  card.setConfig(config);
  await settle();
  expectZoom(null, null);
  assert(
    card._view === "timeline" && card._hiddenP.join() === "0",
    "Invalid zoom erased valid choices.",
  );
  await view("Day");
  await zoom(80);
  await view("Timeline");
  await zoom(168);
  root.querySelector('button[aria-label="Next week"]').click();
  await settle();
  return reload("restored");
}
