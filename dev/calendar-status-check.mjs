export async function runCalendarStatusChecks(card, hass, nextRender) {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const settle = async () => {
    for (let attempt = 0; attempt < 150; attempt++) {
      await nextRender();
      if (!card._loading && card._calendarResults.length === 2) return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error("Status fixture did not settle.");
  };
  const calendars = ["calendar.fixture_family", "calendar.fixture_activities"];
  const timed = (summary, start, end) => ({
    summary,
    start: { dateTime: start },
    end: { dateTime: end },
  });
  let fail = false;
  let deferred = false;
  const pending = [];
  const records = [
    timed("Avery: Project review", "2026-02-19T09:00:00-06:00", "2026-02-19T10:00:00-06:00"),
    timed("Jordan: Current appointment", "2026-02-18T15:00:00-06:00", "2026-02-18T16:30:00-06:00"),
    timed("Jordan: Later appointment", "2026-02-18T17:00:00-06:00", "2026-02-18T18:00:00-06:00"),
    timed("Casey: Weekend workshop", "2026-02-21T10:30:00-06:00", "2026-02-21T12:00:00-06:00"),
    { summary: "Community Day", start: { date: "2026-02-18" }, end: { date: "2026-02-19" } },
  ];
  await settle();
  const connection = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Status tiles attempted a calendar write.");
      const result = path.includes(calendars[0]) ? structuredClone(records) : [];
      if (deferred) return new Promise((resolve) => pending.push(() => resolve(result)));
      if (fail && path.includes(calendars[1])) throw new Error("Synthetic unavailable source");
      return result;
    },
  };
  card.hass = connection;
  card.setConfig({ ...card._config, show_focus: true, read_only: true });
  await settle();
  const tiles = () => [...card.shadowRoot.querySelectorAll(".focus .fchip")];
  const content = (node) => node?.textContent.replace(/\s+/g, " ").trim() ?? "";
  const wall = card._layout === "wall";
  if (!wall) {
    assert(!tiles()[0].querySelector(".fheading"), "Wall status semantics leaked into legacy.");
    assert(content(tiles()[0]).includes("next:"), "Legacy next label changed.");
    assert(!tiles()[1].querySelector(".fnext"), "Legacy no longer prioritizes current event.");
    assert(content(tiles()[3].querySelector(".ffree")) === "free", "Legacy free label changed.");
    return ["calendar status tiles: legacy current-or-next compatibility"];
  }
  assert(content(tiles()[0].querySelector(".ffree")) === "Free now", "Tomorrow blocked Free now.");
  assert(
    content(tiles()[0].querySelector(".fnext .fsummary")) === "Next: Project review",
    "Missing next title.",
  );
  assert(
    content(tiles()[0].querySelector(".fnext small")) === "Tomorrow, 9 AM",
    "Missing tomorrow time.",
  );
  assert(content(tiles()[1].querySelector(".ffree")) === "Busy now", "Current event is not busy.");
  assert(
    content(tiles()[1].querySelector(".fnow")).includes("until Today, 4:30 PM"),
    "Current end time missing.",
  );
  assert(
    content(tiles()[1].querySelector(".fnext small")) === "Today, 5 PM",
    "Busy hid next appointment.",
  );
  assert(
    content(tiles()[2].querySelector(".fnext small")) === "Sat, Feb 21, 10:30 AM",
    "Distant event needs explicit date.",
  );
  assert(
    content(tiles()[3].querySelector(".ffree")) === "Free now",
    "All-day event changed timed availability.",
  );
  assert(!tiles()[3].querySelector(".fnext"), "Empty schedule invented a next appointment.");

  const checkGeometry = () => {
    for (const tile of tiles()) {
      const bounds = tile.getBoundingClientRect();
      for (const selector of [".ffree", ".fnow small", ".fnext small"]) {
        const node = tile.querySelector(selector);
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        assert(rect.width > 0 && rect.height > 0, "Status date or availability disappeared.");
        assert(
          rect.left >= bounds.left &&
            rect.right <= bounds.right + 1 &&
            rect.bottom <= bounds.bottom + 1,
          "Status label escaped its tile.",
        );
        assert(
          node.scrollWidth <= node.clientWidth + 1 && node.scrollHeight <= node.clientHeight + 1,
          "Status label is clipped.",
        );
      }
    }
    const viewport = card.getBoundingClientRect();
    assert(
      viewport.right <= window.innerWidth + 1,
      "Status tiles expanded the page beyond the viewport.",
    );
    assert(
      card.shadowRoot.querySelector(".board").clientHeight > 150,
      "Status tiles consumed the calendar viewport.",
    );
  };
  checkGeometry();
  records[0].summary = `Avery: ${"A very long project appointment title ".repeat(8)}`;
  await card._refetch();
  await settle();
  checkGeometry();
  assert(
    content(tiles()[0].querySelector(".fnext small")) === "Tomorrow, 9 AM",
    "Long title hid timing.",
  );

  // Hidden people disappear from the tiles and return without changing their status.
  card.shadowRoot.querySelectorAll(".header-row .phead")[0].click();
  await nextRender();
  assert(
    tiles().length === 3 &&
      !tiles().some((tile) => content(tile.querySelector(".fname")) === "Avery"),
    "Hidden person retained a status tile.",
  );
  card.shadowRoot.querySelectorAll(".header-row .phead")[0].click();
  await nextRender();
  assert(tiles().length === 4, "Showing person did not restore status tile.");

  // A known future event is still useful, but incomplete sources cannot establish free.
  fail = true;
  await card._refetch();
  await settle();
  assert(
    !tiles().some((tile) => content(tile.querySelector(".ffree")) === "Free now"),
    "Partial sources falsely claimed Free now.",
  );
  assert(
    content(tiles()[0].querySelector(".ffree")) === "schedule unavailable" &&
      tiles()[0].querySelector(".fnext"),
    "Known next event lost on partial failure.",
  );
  assert(
    content(tiles()[1].querySelector(".ffree")) === "Busy now",
    "Known current event lost on partial failure.",
  );

  fail = false;
  deferred = true;
  const refresh = card._refetch();
  await nextRender();
  assert(
    card._loading && !tiles().some((tile) => content(tile).includes("Free now")),
    "Loading falsely claimed Free now.",
  );
  deferred = false;
  pending.splice(0).forEach((resolve) => resolve());
  await refresh;
  await settle();
  assert(
    content(tiles()[0].querySelector(".ffree")) === "Free now",
    "Recovery did not restore availability.",
  );

  const originalNow = card.nowProvider;
  card.nowProvider = () => new Date("2026-02-19T09:00:00-06:00");
  card.requestUpdate();
  await nextRender();
  assert(
    content(tiles()[0].querySelector(".ffree")) === "Busy now" &&
      !tiles()[0].querySelector(".fnext"),
    "Start boundary did not move next into current.",
  );
  card.nowProvider = () => new Date("2026-02-19T10:00:00-06:00");
  card.requestUpdate();
  await nextRender();
  assert(
    content(tiles()[0].querySelector(".ffree")) === "Free now" &&
      !tiles()[0].querySelector(".fnow"),
    "End boundary left an expired busy status.",
  );
  card.nowProvider = originalNow;
  card.requestUpdate();
  await nextRender();

  card.shadowRoot.querySelectorAll('.tabs button')[6].click();
  await settle();
  card.shadowRoot.querySelector('button[aria-label="Next day"]').click();
  await settle();
  assert(
    tiles().every((tile) => content(tile.querySelector(".ffree")) === "schedule unavailable"),
    "Range outside now claimed availability.",
  );
  card.shadowRoot.querySelector('button[aria-label="Show today"]').click();
  await settle();
  assert(
    content(tiles()[0].querySelector(".ffree")) === "Free now",
    "Today did not restore status.",
  );
  card.hass = { ...connection, locale: { ...hass.locale, time_format: "24" } };
  await nextRender();
  assert(
    content(tiles()[0].querySelector(".fnext small")) === "Tomorrow, 09:00",
    "HA clock preference ignored.",
  );
  checkGeometry();
  return [
    `calendar status tiles: ${window.innerWidth}px availability, dated next, clipping, navigation, recovery`,
  ];
}
