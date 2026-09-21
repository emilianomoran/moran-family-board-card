// Real compiled card; synthetic source revisions and connection changes only.
export async function runCalendarRecoveryChecks(card, hass, nextRender) {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const waitFor = async (condition, message) => {
    for (let attempt = 0; attempt < 150; attempt++) {
      await nextRender();
      if (condition()) return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error(message);
  };
  const idle = () => waitFor(() => !card._loading, "Recovery request did not settle.");
  await idle();
  let revision = 1;
  let calls = 0;
  let deferred = false;
  let failing = false;
  const pending = [];
  const event = (uid, name) => ({
    uid,
    summary: `${name}: Revision ${revision}`,
    start: { dateTime: "2026-02-18T16:00:00-06:00" },
    end: { dateTime: "2026-02-18T17:00:00-06:00" },
  });
  const response = (path) =>
    path.includes("fixture_family")
      ? revision === 3
        ? []
        : [event("same-occurrence", "Avery")]
      : [event("other-source", "Casey")];
  const connection = {
    ...hass,
    connected: true,
    callApi: async (method, path) => {
      assert(method === "GET", "Recovery attempted a write.");
      calls++;
      if (deferred)
        return new Promise((resolve, reject) => pending.push({ path, resolve, reject }));
      if (failing) throw new Error("Synthetic connection failure");
      return response(path);
    },
    callWS: async () => {
      throw new Error("Recovery attempted a mutation.");
    },
  };
  // Capture the configured poll callback without waiting a minute or altering its interval.
  let poll;
  const setInterval = window.setInterval;
  window.setInterval = (callback, milliseconds, ...args) => {
    if (milliseconds === 60000) poll = callback;
    return setInterval(callback, milliseconds, ...args);
  };
  try {
    card.hass = connection;
    card.setConfig({ ...card._config, view: "day", read_only: true, refresh_interval: 60 });
  } finally {
    window.setInterval = setInterval;
  }
  await waitFor(() => !card._loading && card._raw.length === 2, "Baseline did not load.");
  assert(typeof poll === "function", "Configured automatic refresh was not installed.");
  revision = 2;
  await poll();
  await idle();
  assert(
    card._raw.length === 2 && card._raw.every((r) => r.summary === "Revision 2"),
    "Automatic refresh duplicated or failed to update a changed occurrence.",
  );
  revision = 3;
  await poll();
  await idle();
  assert(
    card._raw.length === 1 && card._raw[0].uid === "other-source",
    "Automatic refresh retained a canceled appointment or removed another source.",
  );

  revision = 4;
  deferred = true;
  const refresh = card._refetch();
  await waitFor(() => pending.length === 2, "Refresh did not start each source once.");
  card._onVisible();
  card._onVisible();
  void poll();
  await nextRender();
  assert(pending.length === 2, "Wake/focus/poll started duplicate in-flight calendar reads.");
  assert(!card._focusComplete(0), "An in-flight refresh claimed a complete schedule.");
  pending.splice(0).forEach((request) => request.resolve(response(request.path)));
  await refresh;
  await idle();
  assert(
    card._raw.length === 2 && card._raw.every((r) => r.summary === "Revision 4"),
    "Wake refresh failed to restore newly added appointments.",
  );

  // A retained HA state object does not prove a connected or healthy source.
  deferred = false;
  const beforeOffline = calls;
  card.hass = { ...connection, connected: false };
  await nextRender();
  await idle();
  assert(
    card.shadowRoot.querySelector(".banner") && !card._focusComplete(0),
    "Disconnected HA continued to report a healthy schedule.",
  );
  assert(calls === beforeOffline, "Known-disconnected HA still started calendar reads.");
  revision = 5;
  card.hass = connection;
  await waitFor(
    () => !card._loading && card._raw[0]?.summary === "Revision 5",
    "HA reconnect did not refresh immediately.",
  );
  assert(!card.shadowRoot.querySelector(".banner"), "Recovery left an obsolete warning.");

  const beforeUnavailable = calls;
  card.hass = {
    ...connection,
    states: {
      ...connection.states,
      "calendar.fixture_family": {
        ...connection.states["calendar.fixture_family"],
        state: "unavailable",
      },
    },
  };
  await nextRender();
  await idle();
  assert(
    card._partialLoad && card._raw.length === 1 && calls === beforeUnavailable + 1,
    "An unavailable entity was treated as a healthy calendar.",
  );
  card.hass = connection;
  await waitFor(
    () => !card._loading && card._raw.length === 2,
    "Source recovery was not automatic.",
  );

  // Failed periodic reads recover on the following poll without tapping Retry.
  failing = true;
  await poll();
  await idle();
  assert(card._loadError && !card._focusComplete(0), "Failed poll claimed a complete schedule.");
  failing = false;
  revision = 6;
  await poll();
  await idle();
  assert(
    !card._loadError && card._raw[0]?.summary === "Revision 6",
    "Next poll failed to recover.",
  );

  const beforeNetworkLoss = calls;
  window.dispatchEvent(new Event("offline"));
  await nextRender();
  await idle();
  assert(
    card._loadError && !card._focusComplete(0) && calls === beforeNetworkLoss,
    "Browser offline event did not invalidate a healthy snapshot without another read.",
  );
  window.dispatchEvent(new Event("online"));
  await waitFor(
    () => !card._loading && card._raw.length === 2 && !card._loadError,
    "Browser online event did not recover automatically.",
  );

  // Late work from a detached card must not overwrite the newly attached instance.
  deferred = true;
  void card._refetch();
  await waitFor(() => pending.length === 2, "Detach test did not start its old requests.");
  const parent = card.parentElement;
  card.remove();
  assert(!card._timer && !card._tick, "Detached card retained polling timers.");
  const detachedCalls = calls;
  card._onVisible();
  await card._refetch();
  assert(calls === detachedCalls, "Detached card continued fetching.");
  deferred = false;
  revision = 7;
  parent.append(card);
  await waitFor(
    () => !card._loading && card._raw[0]?.summary === "Revision 7",
    "Remount did not refresh.",
  );
  pending.splice(0).forEach((request) => request.resolve([event("stale", "Avery")]));
  await nextRender();
  assert(
    card._raw.length === 2 && !card._raw.some((r) => r.uid === "stale"),
    "A detached response replaced fresh events.",
  );
  // The OS can suspend an in-flight read. Wake needs a new read, not that old promise.
  const visibility = Object.getOwnPropertyDescriptor(document, "visibilityState");
  try {
    deferred = true;
    void card._refetch();
    await waitFor(() => pending.length === 2, "Sleep test did not start its pending reads.");
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
    const beforeSleep = calls;
    await poll();
    assert(calls === beforeSleep, "Hidden tab continued periodic polling.");
    // Browsers can throttle rather than stop minute ticks in the background.
    // The clock and HA updates share the same read path as the paused poll.
    card._onClockTick();
    await nextRender();
    assert(calls === beforeSleep, "Hidden clock tick started a calendar read that wake could reuse.");
    card.hass = { ...connection };
    await nextRender();
    await card._refetch();
    assert(calls === beforeSleep, "Hidden HA update or forced refresh started a background read.");
    deferred = false;
    revision = 8;
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
    await waitFor(
      () => !card._loading && card._raw[0]?.summary === "Revision 8",
      "Wake reused a suspended request instead of reading fresh data.",
    );
    pending.splice(0).forEach((request) => request.resolve([event("pre-sleep", "Avery")]));
    await nextRender();
    assert(
      !card._raw.some((r) => r.uid === "pre-sleep"),
      "A pre-sleep response replaced wake data.",
    );
    revision = 9;
    window.dispatchEvent(new Event("pageshow"));
    await waitFor(
      () => !card._loading && card._raw[0]?.summary === "Revision 9",
      "Returning from the page cache did not refresh.",
    );
  } finally {
    if (visibility) Object.defineProperty(document, "visibilityState", visibility);
    else delete document.visibilityState;
  }
  // A post-write refresh must not reuse an older in-flight snapshot. No real or
  // mock mutation is needed here: exercise the same invalidation hook directly.
  deferred = true;
  void card._refetch();
  await waitFor(() => pending.length === 2, "Post-write test did not start old reads.");
  deferred = false;
  revision = 10;
  await card._refreshAfterMutation();
  await idle();
  assert(
    card._raw.every((r) => r.summary === "Revision 10"),
    "Post-write refresh reused an older in-flight snapshot.",
  );
  pending.splice(0).forEach((request) => request.resolve([event("pre-write", "Avery")]));
  await nextRender();
  assert(!card._raw.some((r) => r.uid === "pre-write"), "Pre-write read replaced fresh data.");
  return [
    "calendar recovery: automatic updates/cancellations, coalesced wake, HA/browser reconnect, unavailable source, failed poll, detach/remount, hidden-clock/HA-update suppression, suspended reads, page restore, post-write invalidation",
  ];
}
