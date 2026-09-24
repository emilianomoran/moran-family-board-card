// Generic long-event fixture shared by the interactive preview and regression suite.
export const timelineLabelEvents = [
  {
    uid: "label-all-day",
    summary: "Avery: Community Day",
    start: { date: "2026-02-18" },
    end: { date: "2026-02-19" },
  },
  {
    uid: "label-long",
    summary: "Jordan: Extended workshop with a deliberately long descriptive title",
    start: { dateTime: "2026-02-18T09:00:00-06:00" },
    end: { dateTime: "2026-02-18T22:00:00-06:00" },
  },
  {
    uid: "label-midnight",
    summary: "Casey: Overnight coverage",
    start: { dateTime: "2026-02-17T18:00:00-06:00" },
    end: { dateTime: "2026-02-18T20:00:00-06:00" },
  },
  {
    uid: "label-short",
    summary: "Avery: Quick check",
    start: { dateTime: "2026-02-18T15:00:00-06:00" },
    end: { dateTime: "2026-02-18T15:15:00-06:00" },
  },
];

export async function runTimelineLabelChecks(card, hass, nextRender) {
  const root = card.shadowRoot;
  const original = card._config;
  const config = {
    ...original,
    layout: "wall",
    view: "timeline",
    read_only: true,
    start_hour: 0,
    end_hour: 24,
    trim_hours: false,
    full_height: true,
    scroll_to_now: false,
    remember_preferences: false,
  };
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  let reads = 0;
  let events = timelineLabelEvents;
  card.hass = {
    ...hass,
    callApi: async (method, path) => {
      assert(method === "GET", "Timeline labels attempted a calendar write.");
      reads++;
      return path.includes("fixture_family") ? events : [];
    },
    callWS: async () => {
      throw new Error("Timeline labels attempted a mutation.");
    },
  };
  const settle = async () => {
    for (let i = 0; i < 180; i++) {
      await nextRender();
      if (
        !card._loading &&
        !card._timelineScrollAnchor &&
        card._timelineScrollFrame === undefined
      ) {
        await nextRender();
        return;
      }
    }
    throw new Error("Timeline labels did not settle.");
  };
  const wrap = () => root.querySelector(".tlwrap");
  const event = (title) =>
    [...root.querySelectorAll(".tlbar")].find((e) => e.title.includes(title));
  const assertVisibleTitle = (title) => {
    const bar = event(title);
    const text = bar.querySelector(".etitle").getBoundingClientRect();
    const bounds = bar.getBoundingClientRect();
    const viewport = wrap().getBoundingClientRect();
    const names = root.querySelector(".tlperson").getBoundingClientRect();
    assert(
      text.left >= names.right + 4 && text.right <= viewport.right - 4 && text.width > 40,
      `${title} title leaves the visible time area: ${text.left}–${text.right}, names end ${names.right}, panel end ${viewport.right}.`,
    );
    assert(
      text.left >= bounds.left && text.right <= bounds.right,
      `${title} title escapes its event bar.`,
    );
  };
  for (const hourWidth of [96, 48, 240]) {
    card.setConfig({ ...config, hour_width: hourWidth });
    await settle();
    const readCount = reads;
    const widths = [...root.querySelectorAll(".tlbar")].map((e) => e.offsetWidth).join();
    // These positions leave enough visible duration for the full label even at
    // compact zoom. The separate tail check covers partially departing events.
    for (const hour of [12, 13, 14]) {
      wrap().scrollTo({ left: hour * hourWidth, behavior: "instant" });
      await nextRender();
      for (const title of ["Community Day", "Extended workshop", "Overnight coverage"]) {
        assertVisibleTitle(title);
      }
      assert(
        [...root.querySelectorAll(".tlbar")].map((e) => e.offsetWidth).join() === widths,
        "Label panning changed event duration geometry.",
      );
    }
    assert(reads === readCount, "Label panning caused another source read.");
    assert(event("Quick check").offsetHeight >= 48, "Sticky title shrank short-event targets.");
    const bar = event("Extended workshop");
    const titleStyle = getComputedStyle(bar.querySelector(".etitle"));
    assert(
      titleStyle.textOverflow === "ellipsis" && titleStyle.overflow === "hidden",
      "Long title lost its truncation behavior.",
    );
    const time = bar.querySelector(".etime").getBoundingClientRect();
    const title = bar.querySelector(".etitle").getBoundingClientRect();
    assert(
      time.top >= title.bottom &&
        time.bottom <= bar.getBoundingClientRect().bottom &&
        time.left >= root.querySelector(".tlperson").getBoundingClientRect().right + 4,
      "Time range collides with its title or leaves the visible event area.",
    );
  }

  // Near its end, the label travels out with its bar; it cannot float over empty time.
  const edgeStyle = card.getAttribute("style");
  card.style.width = `${Math.min(400, card.clientWidth)}px`;
  await settle();
  const long = event("Extended workshop");
  wrap().scrollTo({ left: 22 * 240 - 20, behavior: "instant" });
  await nextRender();
  const text = long.querySelector(".etitle").getBoundingClientRect();
  const edge = long.getBoundingClientRect().right;
  assert(
    text.right <= edge && edge < root.querySelector(".tlperson").getBoundingClientRect().right + 25,
    "Ending event leaves a detached title over empty time.",
  );
  if (edgeStyle === null) card.removeAttribute("style");
  else card.setAttribute("style", edgeStyle);

  card.setConfig({ ...config, start_hour: 7, end_hour: 21, hour_width: 96 });
  await settle();
  wrap().scrollTo({ left: 5 * 96, behavior: "instant" });
  await nextRender();
  assertVisibleTitle("Community Day");
  assertVisibleTitle("Extended workshop");
  assert(
    event("Overnight coverage").querySelector(".etitle").textContent.includes("«"),
    "Continuation markers were lost.",
  );

  // The bar retains its existing details/focus contract; no separate label control.
  const allDay = event("Community Day");
  const position = { left: wrap().scrollLeft, top: wrap().scrollTop };
  allDay.focus({ preventScroll: true });
  allDay.querySelector(".etitle").click();
  await settle();
  assert(root.querySelector(".dialog input")?.disabled, "Label click lost read-only details.");
  assert(
    root.querySelector(".dialog input")?.value === "Community Day",
    "Wrong occurrence opened.",
  );
  root
    .querySelector(".dialog")
    .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
  await settle();
  assert(
    !root.querySelector(".dialog") && root.activeElement === allDay,
    "Closing label details did not restore the event focus.",
  );
  assert(
    wrap().scrollLeft === position.left && wrap().scrollTop === position.top,
    "Label details changed manual browsing.",
  );
  const person = allDay.closest(".tlrow").querySelector(".tlperson");
  person.click();
  await settle();
  assert(!event("Community Day"), "Hidden person's title remained visible.");
  person.click();
  await settle();
  assertVisibleTitle("Community Day");
  events = timelineLabelEvents.map((e) =>
    e.uid === "label-all-day" ? { ...e, summary: "Avery: Updated community day" } : e,
  );
  await card._refetch();
  await settle();
  assertVisibleTitle("Updated community day");
  assert(!event("Community Day"), "Refresh retained a stale label.");

  const priorStyle = card.getAttribute("style");
  card.style.width = "90%";
  await settle();
  assertVisibleTitle("Updated community day");
  if (priorStyle === null) card.removeAttribute("style");
  else card.setAttribute("style", priorStyle);
  await settle();
  card.setConfig({ ...config, layout: "legacy" });
  await settle();
  assert(
    getComputedStyle(event("Updated community day")).overflow === "hidden" &&
      getComputedStyle(event("Updated community day").querySelector(".etitle")).position ===
        "static",
    "Wall label behavior leaked into legacy.",
  );
  card.setConfig(original);
  card.hass = hass;
  await settle();
  return [
    "timeline labels: visible all-day/long/overnight titles and times, zoom/resize bounds, event edges, details/focus, refresh, filters and legacy verified",
  ];
}
