import type { HomeAssistant } from "custom-card-helpers";
import { describe, expect, it, vi } from "vitest";
import {
  readCalendarBatch,
  readCalendarEvents,
  type CalendarEventPayload,
} from "./calendar-source";

const range = {
  start: new Date("2026-02-18T06:00:00.000Z"),
  end: new Date("2026-02-19T06:00:00.000Z"),
};

const fixtureEvent = (summary = "Fixture appointment"): CalendarEventPayload => ({
  summary,
  start: { dateTime: "2026-02-18T15:00:00Z" },
  end: { dateTime: "2026-02-18T16:00:00Z" },
});

describe("readCalendarEvents", () => {
  it("uses one authenticated GET with an encoded ISO range and returns the payload unchanged", async () => {
    const payload: CalendarEventPayload[] = [
      {
        summary: "Fixture appointment",
        start: { dateTime: "2026-02-18T15:00:00.000Z" },
        end: { dateTime: "2026-02-18T16:00:00.000Z" },
      },
    ];
    const callApi = vi.fn().mockResolvedValue(payload);
    const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;

    const result = await readCalendarEvents(hass, "calendar.fixture_primary", range);

    expect(callApi).toHaveBeenCalledOnce();
    expect(callApi).toHaveBeenCalledWith(
      "GET",
      "calendars/calendar.fixture_primary?start=2026-02-18T06%3A00%3A00.000Z&end=2026-02-19T06%3A00%3A00.000Z",
    );
    expect(result).toBe(payload);
  });

  it("rejects with the original Home Assistant error", async () => {
    const error = new Error("Fixture request failed");
    const callApi = vi.fn().mockRejectedValue(error);
    const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;

    await expect(readCalendarEvents(hass, "calendar.fixture_primary", range)).rejects.toBe(error);
    expect(callApi).toHaveBeenCalledOnce();
  });
});

describe("readCalendarBatch", () => {
  it("finishes a stalled source without losing a successful source, and can retry", async () => {
    vi.useFakeTimers();
    try {
      const payload = [fixtureEvent()];
      const callApi = vi
        .fn()
        .mockImplementation((_method, path: string) =>
          path.includes("fixture_stalled") ? new Promise(() => {}) : Promise.resolve(payload),
        );
      const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;
      const ids = ["calendar.fixture_good", "calendar.fixture_stalled"];
      const pending = readCalendarBatch(hass, ids, new Set(ids), range);
      await vi.advanceTimersByTimeAsync(20000);
      expect(await pending).toEqual([
        { entityId: ids[0], status: "ok", events: payload },
        { entityId: ids[1], status: "error", events: [] },
      ]);
      expect(vi.getTimerCount()).toBe(0);

      callApi.mockResolvedValue(payload);
      const recovered = await readCalendarBatch(hass, ids, new Set(ids), range);
      expect(recovered.every((source) => source.status === "ok")).toBe(true);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("reads each available source once and distinguishes empty success from missing", async () => {
    const callApi = vi.fn().mockResolvedValue([]);
    const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;
    const result = await readCalendarBatch(
      hass,
      ["calendar.fixture_one", "calendar.fixture_one", "calendar.fixture_missing"],
      new Set(["calendar.fixture_one"]),
      range,
    );
    expect(callApi).toHaveBeenCalledOnce();
    expect(result).toEqual([
      { entityId: "calendar.fixture_one", status: "ok", events: [] },
      { entityId: "calendar.fixture_missing", status: "missing", events: [] },
    ]);
  });

  it("keeps successful events when another source fails", async () => {
    const payload = [fixtureEvent("Fixture event")];
    const callApi = vi
      .fn()
      .mockImplementation((_method, path: string) =>
        path.includes("fixture_good")
          ? Promise.resolve(payload)
          : Promise.reject(new Error("failed")),
      );
    const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;
    const result = await readCalendarBatch(
      hass,
      ["calendar.fixture_good", "calendar.fixture_bad"],
      new Set(["calendar.fixture_good", "calendar.fixture_bad"]),
      range,
    );
    expect(result).toEqual([
      { entityId: "calendar.fixture_good", status: "ok", events: payload },
      { entityId: "calendar.fixture_bad", status: "error", events: [] },
    ]);
    expect(callApi).toHaveBeenCalledTimes(2);
  });

  it("reports total API failure without inventing an empty successful calendar", async () => {
    const callApi = vi.fn().mockRejectedValue(new Error("failed"));
    const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;
    const result = await readCalendarBatch(
      hass,
      ["calendar.fixture_bad"],
      new Set(["calendar.fixture_bad"]),
      range,
    );
    expect(result).toEqual([{ entityId: "calendar.fixture_bad", status: "error", events: [] }]);
  });

  it("treats a non-list API response as one failed source", async () => {
    const callApi = vi.fn().mockResolvedValue({ error: "Fixture malformed response" });
    const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;
    const result = await readCalendarBatch(
      hass,
      ["calendar.fixture_bad"],
      new Set(["calendar.fixture_bad"]),
      range,
    );
    expect(result).toEqual([{ entityId: "calendar.fixture_bad", status: "error", events: [] }]);
  });

  it("retains valid records while reporting malformed records from the same source", async () => {
    const good = fixtureEvent();
    const callApi = vi
      .fn()
      .mockResolvedValue([
        good,
        null,
        { ...good, summary: { unexpected: "object" } },
        { summary: "Bad date", start: { date: "2026-02-30" } },
        { ...good, end: { dateTime: "2026-02-18T14:00:00Z" } },
      ]);
    const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;
    const result = await readCalendarBatch(
      hass,
      ["calendar.fixture"],
      new Set(["calendar.fixture"]),
      range,
    );
    expect(result).toEqual([
      { entityId: "calendar.fixture", status: "partial", events: [good], rejectedCount: 4 },
    ]);

    callApi.mockResolvedValue([good]);
    expect(
      await readCalendarBatch(hass, ["calendar.fixture"], new Set(["calendar.fixture"]), range),
    ).toEqual([{ entityId: "calendar.fixture", status: "ok", events: [good] }]);
  });

  it("does not report an entirely malformed response as an empty healthy calendar", async () => {
    const callApi = vi.fn().mockResolvedValue([null, "not an event", {}]);
    const hass = { callApi } as unknown as Pick<HomeAssistant, "callApi">;
    expect(
      await readCalendarBatch(hass, ["calendar.fixture"], new Set(["calendar.fixture"]), range),
    ).toEqual([{ entityId: "calendar.fixture", status: "partial", events: [], rejectedCount: 3 }]);
  });
});
