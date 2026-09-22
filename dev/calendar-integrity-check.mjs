export async function runCalendarIntegrityChecks(card, hass, nextRender) {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const settle = async (condition = () => !card._loading) => {
    for (let attempt = 0; attempt < 150; attempt++) {
      await nextRender();
      if (condition()) return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error("Integrity fixture did not settle.");
  };
  const selectView = async (view) => {
    [...card.shadowRoot.querySelectorAll(".switch button")]
      .find((button) => button.textContent.trim().toLowerCase() === view)
      .click();
    await settle();
  };
  const calendars = ["calendar.fixture_family", "calendar.fixture_activities"];
  const timed = (uid, summary, start, end) => ({
    uid,
    summary,
    start: { dateTime: start },
    end: { dateTime: end },
  });
  const good = {
    [calendars[0]]: [
      timed(
        "fixture-solo",
        "Avery: Appointment",
        "2026-02-18T10:00:00-06:00",
        "2026-02-18T11:00:00-06:00",
      ),
      timed(
        "fixture-joint",
        "Avery + Jordan: Joint appointment",
        "2026-02-18T14:00:00-06:00",
        "2026-02-18T15:00:00-06:00",
      ),
      {
        uid: "fixture-multiday",
        summary: "Community retreat",
        start: { date: "2026-02-18" },
        end: { date: "2026-02-20" },
      },
    ],
    [calendars[1]]: [
      timed(
        "fixture-overnight",
        "Casey: Overnight activity",
        "2026-02-18T23:00:00-06:00",
        "2026-02-19T07:00:00-06:00",
      ),
    ],
  };
  const malformed = {
    [calendars[0]]: [null, { ...good[calendars[0]][0], summary: { unexpected: "object" } }],
    [calendars[1]]: [{ summary: "Impossible date", start: { date: "2026-02-30" } }],
  };
  let mode = "mixed";
  await settle(() => !card._loading && card._calendarResults.length === 2);
  card.hass = {
    ...hass,
    callApi: async (_method, path) => {
      const id = calendars.find((calendar) => path.includes(calendar));
      if (mode === "empty") return [];
      if (mode === "invalid") return malformed[id];
      return [...good[id], ...(mode === "mixed" ? malformed[id] : [])];
    },
  };
  card.setConfig({
    ...card._config,
    start_hour: 0,
    end_hour: 24,
    background_hours: 0,
    filter_duplicates: true,
    show_focus: true,
    persons: [
      ...["Avery", "Jordan", "Casey"].map((name) => ({
        name,
        calendar: calendars,
        match_title_prefixes: [`${name}:`],
        strip_title_prefix: true,
      })),
      { name: "Household", calendar: calendars, unmatched: true },
    ],
  });
  await settle(
    () => !card._loading && card._calendarResults.every((result) => result.status === "partial"),
  );
  const countSourceRecords = () =>
    card._calendarResults.reduce((sum, result) => sum + result.events.length, 0);
  assert(
    countSourceRecords() === 4 && card._raw.length === 5,
    "Malformed records hid valid source events or joint owners.",
  );
  assert(
    card._calendarResults.reduce((sum, result) => sum + (result.rejectedCount ?? 0), 0) === 3,
    "Rejected records were not accounted for.",
  );
  assert(card._events.length === 7, "Multi-day or overnight segments were lost.");

  for (const view of ["day", "timeline", "week", "agenda", "month"]) {
    await selectView(view);
    assert(
      card._raw.length === 5 && countSourceRecords() === 4,
      `${view} changed the source/owner count.`,
    );
    const jointOwners = card._raw
      .filter((event) => event.uid === "fixture-joint")
      .map((event) => event.personIdx)
      .sort()
      .join(",");
    assert(jointOwners === "0,1", `${view} lost one joint owner.`);
    assert(
      card.shadowRoot
        .querySelector(".status-message")
        ?.textContent.includes("schedule may be incomplete"),
      `${view} hid malformed data.`,
    );
    assert(
      card._config.persons.every((_, index) => !card._focusComplete(index)),
      `${view} treated partial data as a complete schedule.`,
    );
    const root = card.shadowRoot;
    const count = (selector) => root.querySelectorAll(selector).length;
    if (view === "day")
      assert(
        count(".event:not(.overflow)") + count(".adchip") === 5,
        "Day dropped an appointment.",
      );
    if (view === "timeline") assert(count(".tlbar") === 5, "Timeline dropped an appointment.");
    if (view === "week") assert(count(".wchip") === 7, "Week dropped an appointment segment.");
    if (view === "agenda")
      assert(count(".agenda-row") === 7, "Agenda dropped an appointment segment.");
    if (view === "month") {
      const overflow = [...root.querySelectorAll(".mmore")].reduce(
        (sum, item) => sum + Number(item.textContent.trim().match(/^\+(\d+)/)?.[1]),
        0,
      );
      assert(
        count(".mchip") + overflow === 7,
        "Month's visible and overflow counts do not account for every segment.",
      );
      root.querySelector(".mmore").closest(".mcell").click();
      await settle();
      assert(
        card._view === "day" && count(".event:not(.overflow)") + count(".adchip") === 5,
        "Month overflow drilldown lost appointments.",
      );
    }
  }

  mode = "invalid";
  await selectView("agenda");
  card.shadowRoot.querySelector(".retry").click();
  await settle(() => !card._loading && card._raw.length === 0);
  assert(card._partialLoad && !card._focusComplete(0), "All-invalid data looked healthy.");
  assert(
    !card.shadowRoot.querySelector(".agenda-empty")?.textContent.includes("No events"),
    "All-invalid data was presented as an empty calendar.",
  );
  mode = "healthy";
  card.shadowRoot.querySelector(".retry").click();
  await settle(() => !card._loading && card._raw.length === 5);
  assert(
    !card.shadowRoot.querySelector(".banner") && card._focusComplete(0),
    "Corrected records did not recover after Retry.",
  );

  mode = "empty";
  await card._refetch();
  await nextRender();
  assert(
    !card._partialLoad && !card._loadError && card._raw.length === 0 && card._focusComplete(0),
    "A genuinely empty calendar did not stay distinct from invalid data.",
  );
  assert(
    card.shadowRoot.querySelector(".agenda-empty")?.textContent.includes("No events"),
    "A genuinely empty calendar omitted its empty state.",
  );
  return [
    "calendar integrity: malformed records isolated; four source events → five owner copies → seven day segments; five views and recovery",
  ];
}
