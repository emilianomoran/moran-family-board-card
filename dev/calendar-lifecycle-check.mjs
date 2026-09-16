// Real card, synthetic API: control response order without touching a live calendar.
export async function runCalendarLifecycleChecks(card, hass, nextRender) {
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
  const idle = () => waitFor(() => !card._loading, "Calendar request never settled.");
  const view = async (name) => {
    const button = [...card.shadowRoot.querySelectorAll(".switch button")].find(
      (item) => item.textContent.trim().toLowerCase() === name,
    );
    assert(button, `Missing ${name} view control.`);
    button.click();
    await nextRender();
  };
  const appointment = (path, summary) => {
    const range = new URL(path, "http://fixture.invalid/");
    const start = new Date(range.searchParams.get("start"));
    start.setDate(start.getDate() + 2);
    start.setHours(9);
    const end = new Date(start);
    end.setHours(10);
    return {
      summary,
      uid: summary,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    };
  };
  await waitFor(() => !card._loading && card._raw.length > 0, "Initial fixture failed to load.");

  const pending = [];
  card.hass = {
    ...hass,
    callApi: (_method, path) =>
      new Promise((resolve, reject) => pending.push({ path, resolve, reject })),
  };
  await view("week");
  card.shadowRoot.querySelector('button[aria-label="Next week"]').click();
  await waitFor(() => pending.length === 2, "Next week did not start both source reads.");
  assert(
    card._raw.length === 0 && card._events.length === 0,
    "Old events appeared under a new date range.",
  );
  for (const name of ["agenda", "timeline", "day", "week"]) {
    await view(name);
    assert(
      card.shadowRoot.querySelector(".calendar-status")?.textContent.includes("Loading calendars"),
      `${name} hid its loading state.`,
    );
    assert(
      card._raw.length === 0 && pending.length === 2,
      "Same-range view switch refetched or exposed stale events.",
    );
  }

  card.shadowRoot.querySelector('button[aria-label="Next week"]').click();
  await waitFor(() => pending.length === 4, "A second navigation did not start a new request.");
  for (const request of pending.slice(2)) {
    request.resolve(
      request.path.includes("fixture_family")
        ? [appointment(request.path, "Avery: Latest week")]
        : [],
    );
  }
  await idle();
  assert(
    card._raw.length === 1 && card._raw[0].summary === "Latest week",
    "Latest range did not render.",
  );
  assert(
    !card._focusFor(0).next && !card._focusComplete(0),
    "A future range claimed to know the person's current schedule.",
  );
  for (const request of pending.slice(0, 2)) {
    request.resolve([appointment(request.path, "Avery: Stale week")]);
  }
  await nextRender();
  assert(
    card._raw.length === 1 && card._raw[0].summary === "Latest week",
    "An older response overwrote the newer range.",
  );

  await view("month");
  await waitFor(() => pending.length === 6, "Month did not request its full range.");
  const monthRange = new URL(pending[4].path, "http://fixture.invalid/");
  assert(
    new Date(monthRange.searchParams.get("end")) - new Date(monthRange.searchParams.get("start")) >=
      28 * 86400000,
    "Month requested less than its grid.",
  );
  const monthEvent = appointment(pending[4].path, "Avery: Month boundary appointment");
  for (const request of pending.slice(4))
    request.resolve(request.path.includes("fixture_family") ? [monthEvent] : []);
  await idle();
  const chip = card.shadowRoot.querySelector(".mchip");
  assert(
    chip?.textContent.includes("Month boundary appointment"),
    "Month response did not render.",
  );
  chip.closest(".mcell").click();
  await waitFor(() => pending.length === 8, "Opening a month date did not load its week.");
  for (const request of pending.slice(6))
    request.resolve(request.path.includes("fixture_family") ? [monthEvent] : []);
  await idle();
  assert(
    card._view === "day" &&
      card.shadowRoot
        .querySelector(".event .etitle")
        ?.textContent.includes("Month boundary appointment"),
    "Month-to-Day drilldown lost the appointment.",
  );

  card.hass = {
    ...hass,
    callApi: async () => {
      throw new Error("Fixture offline");
    },
  };
  await card._refetch();
  for (const name of ["day", "timeline", "week", "month", "agenda"]) {
    await view(name);
    await idle();
    assert(
      card.shadowRoot.querySelector(".banner .status-message")?.textContent.trim() ===
        "Calendar could not be loaded.",
      `${name} hid the source failure.`,
    );
    assert(card.shadowRoot.querySelector(".banner .retry"), `${name} omitted recovery.`);
    assert(!card._focusComplete(0), `${name} falsely reported a complete schedule.`);
  }
  let recoveredReads = 0;
  card.hass = {
    ...hass,
    callApi: async (_method, path) => {
      recoveredReads++;
      return path.includes("fixture_family")
        ? [appointment(path, "Avery: Recovered appointment")]
        : [];
    },
  };
  card.shadowRoot.querySelector(".retry").click();
  await waitFor(() => recoveredReads === 2 && !card._loading, "Retry did not read both sources.");
  assert(
    !card.shadowRoot.querySelector(".banner") && card._raw[0]?.summary === "Recovered appointment",
    "Retry did not recover the rendered schedule.",
  );

  // Source titles must survive display-only mapping and prefix stripping when edited.
  const writes = [];
  const sourceTitle = "Provider appointment title";
  const editableHass = {
    ...hass,
    states: {
      ...hass.states,
      "calendar.fixture_family": {
        ...hass.states["calendar.fixture_family"],
        attributes: { supported_features: 7 },
      },
    },
    callApi: async (_method, path) =>
      path.includes("fixture_family")
        ? [{ ...appointment(path, sourceTitle), description: "Avery: Alternate display title" }]
        : [],
    callWS: async (message) => {
      writes.push(message);
      return {};
    },
  };
  card.hass = editableHass;
  card.setConfig({
    ...card._config,
    view: "day",
    drag_drop: true,
    calendars: { "calendar.fixture_family": { title_field: "description" } },
  });
  await waitFor(
    () => !card._loading && card._raw[0]?.summary === "Alternate display title",
    "Alternate title mapping failed.",
  );
  const event = card._events[0];
  card._openEvent(event);
  await nextRender();
  assert(
    card._dialog.summary === sourceTitle,
    "Edit dialog replaced the source title with its presentation title.",
  );
  await card._saveDialog();
  assert(
    writes[0]?.event?.summary === sourceTitle,
    "Saving changed a display-only title mapping in the calendar.",
  );
  await card._commitDrag({ raw: event.ref, mode: "move", deltaMin: 30, moved: true, busy: false });
  assert(writes[1]?.event?.summary === sourceTitle, "Moving an event stripped its source title.");
  assert(
    !card._draggable({
      ...event,
      ref: { ...event.ref, recurrence_id: event.ref.start.toISOString() },
    }),
    "A recurring instance allowed a drag without recurrence scope.",
  );

  // Writable source, read-only card: neither UI nor stale handlers may issue mutations.
  card._openEvent(event);
  const staleDialog = { ...card._dialog };
  card._drag = { raw: event.ref, mode: "move", deltaMin: 30, moved: true, busy: false };
  card.setConfig({ ...card._config, read_only: true });
  assert(!card._dialog && !card._drag, "Read-only mode retained an active editor or gesture.");
  await idle();
  assert(
    !card._canCreate(event.ref.calendar) &&
      !card._canUpdate(event.ref.calendar) &&
      !card._canDelete(event.ref.calendar) &&
      !card._draggable(event),
    "Read-only card exposed calendar write capabilities.",
  );
  card._openCreate(0, 0);
  assert(!card._dialog, "Read-only card opened a creation dialog.");
  card._openEvent(event);
  await nextRender();
  assert(
    card._dialog &&
      !card._dialog.canUpdate &&
      !card._dialog.canDelete &&
      !card.shadowRoot.querySelector(".dialog button.primary, .dialog button.danger"),
    "Read-only event details exposed Save or Delete.",
  );
  const writeCount = writes.length;
  card._dialog = { ...staleDialog, mode: "create" };
  await card._saveDialog();
  card._dialog = staleDialog;
  await card._saveDialog();
  await card._deleteDialog();
  await card._commitDrag({ raw: event.ref, mode: "move", deltaMin: 30, moved: true, busy: false });
  assert(writes.length === writeCount, "Read-only mode sent a calendar mutation.");
  card._closeDialog();
  card.setConfig({ ...card._config, read_only: false });
  await idle();
  assert(
    card._canCreate(event.ref.calendar) && card._canUpdate(event.ref.calendar),
    "Disabling read-only mode did not restore source capabilities.",
  );
  // Advance the injected clock across a Sunday/month boundary, then a normal night.
  let now = new Date("2026-05-31T23:59:00-05:00");
  let clockReads = 0;
  card.nowProvider = () => new Date(now);
  card._lastCalendarDate = undefined;
  card._weekOffset = 0;
  card.hass = {
    ...hass,
    callApi: async (_method, path) => {
      clockReads++;
      return path.includes("fixture_family")
        ? [appointment(path, "Avery: New week appointment")]
        : [];
    },
  };
  card.setConfig({ ...card._config, calendars: {}, view: "day" });
  card._onClockTick();
  await waitFor(() => clockReads === 2 && !card._loading, "Clock baseline did not load.");
  now = new Date("2026-06-01T00:01:00-05:00");
  card._onClockTick();
  await waitFor(
    () => clockReads === 4 && !card._loading,
    "Overnight rollover did not load the new week.",
  );
  assert(
    card._day === 0 && card._weekOffset === 0 && card._loadedRange.start.getDate() === 1,
    "Today did not follow Monday's new week.",
  );
  now = new Date("2026-06-02T00:01:00-05:00");
  card._onClockTick();
  await nextRender();
  assert(
    card._day === 1 && clockReads === 4,
    "Same-week midnight did not follow Today without an extra read.",
  );
  card._weekOffset = 1;
  card._day = 4;
  await nextRender();
  await idle();
  const browsedDate = card._dateForDay(4).getTime();
  now = new Date("2026-06-08T00:01:00-05:00");
  card._onClockTick();
  await nextRender();
  assert(
    card._dateForDay(4).getTime() === browsedDate,
    "A week rollover moved an intentionally browsed date.",
  );
  return [
    "calendar lifecycle: stale reads, date drilldown, five-view errors, retry, source-title preservation, read-only guards, midnight rollover",
  ];
}
