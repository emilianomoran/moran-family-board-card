// Rendered geometry regression: every day-grid row must share the same lanes.
export async function runCalendarAlignmentChecks(card, hass, nextRender) {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const root = card.shadowRoot;
  const settle = async () => {
    for (let i = 0; i < 100; i++) {
      await nextRender();
      if (!card._loading && card._raw.length > 0) return;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error("Alignment fixture did not settle.");
  };
  let checks = 0;
  const verify = async (label) => {
    await nextRender();
    const board = root.querySelector(".board");
    const headers = [...root.querySelectorAll(".header-row .phead")];
    const timed = [...root.querySelectorAll(".body > .col")];
    const allDay = [...root.querySelectorAll(".allday-row .allday-cell")];
    assert(
      headers.length === timed.length && (!allDay.length || headers.length === allDay.length),
      `${label}: missing lane`,
    );
    for (const atEnd of [false, true]) {
      board.scrollLeft = atEnd ? board.scrollWidth : 0;
      board.scrollTop = atEnd ? board.scrollHeight : 0;
      await nextRender();
      for (let i = 0; i < headers.length; i++) {
        const h = headers[i].getBoundingClientRect();
        for (const [kind, cell] of [
          ["timed", timed[i]],
          ["all-day", allDay[i]],
        ]) {
          if (!cell) continue;
          const r = cell.getBoundingClientRect();
          assert(
            Math.abs(h.left - r.left) < 1 && Math.abs(h.width - r.width) < 1,
            `${label}: lane ${i + 1} ${kind} misaligned (header ${h.width}px, cell ${r.width}px)`,
          );
        }
        assert(
          headers[i].classList.contains("off") ? Math.abs(h.width - 48) < 1 : h.width >= 239,
          `${label}: lane ${i + 1} has an incorrect visible/hidden width`,
        );
      }
      const widths = [".header-row", ".allday-row", ".body"]
        .map((s) => root.querySelector(s))
        .filter(Boolean)
        .map((e) => e.getBoundingClientRect().width);
      assert(
        widths.every((w) => Math.abs(w - widths[0]) < 1),
        `${label}: row widths differ`,
      );
      const axis = root.querySelector(".axis").getBoundingClientRect();
      assert(
        Math.abs(axis.left - board.getBoundingClientRect().left) < 1,
        `${label}: time axis lost its pinned position`,
      );
    }
    checks++;
  };
  for (const count of [1, 4, 7]) {
    const persons = Array.from({ length: count }, (_, i) => ({
      name: `Person ${i + 1}`,
      calendar: "calendar.fixture_family",
      match_title_prefixes: [`Person ${i + 1}:`],
      hidden: i === 0,
    }));
    const events = persons.flatMap((p, i) => [
      {
        uid: `all-day-${i}`,
        summary: `${p.name}: All-day fixture`,
        start: { date: "2026-02-18" },
        end: { date: "2026-02-19" },
      },
      {
        uid: `timed-${i}`,
        summary: `${p.name}: Timed fixture`,
        start: { dateTime: "2026-02-18T16:00:00-06:00" },
        end: { dateTime: "2026-02-18T17:00:00-06:00" },
      },
    ]);
    card.hass = {
      ...hass,
      callApi: async (method) => {
        assert(method === "GET", "Unexpected write");
        return events;
      },
    };
    card.setConfig({ ...card._config, persons, read_only: true, view: "day", refresh_interval: 0 });
    await settle();
    await verify(`${count} lanes initially hidden`);
    // Use the actual header control, rather than assigning hidden state.
    const toggle = async (index) => {
      root.querySelectorAll(".header-row .phead")[index].click();
      await nextRender();
    };
    await toggle(0);
    await verify(`${count} lanes all visible`);
    const host = card.parentElement;
    for (const width of [
      Math.min(746, window.innerWidth),
      Math.min(390, window.innerWidth),
      window.innerWidth,
    ]) {
      host.style.width = `${width}px`;
      await verify(`${count} lanes resized to ${width}px`);
    }
    if (count > 1) {
      await toggle(1);
      await toggle(2);
      await verify(`${count} lanes two hidden`);
      for (const width of [Math.min(390, window.innerWidth), window.innerWidth]) {
        host.style.width = `${width}px`;
        await verify(`${count} lanes two hidden resized to ${width}px`);
      }
      await toggle(1);
      await verify(`${count} lanes middle restored`);
    }
    for (let i = 0; i < count; i++) {
      if (!root.querySelectorAll(".header-row .phead")[i].classList.contains("off"))
        await toggle(i);
    }
    await verify(`${count} lanes all hidden`);
    for (let i = 0; i < count; i++) await toggle(i);
    await verify(`${count} lanes all restored`);
  }
  return [
    `calendar alignment: ${checks} visibility states; 1/4/7 people; all-day/timed/header edges match before and after two-axis scrolling`,
  ];
}
