import type { HomeAssistant } from "custom-card-helpers";
import { describe, expect, it, vi } from "vitest";
import { readCalendarEvents, type CalendarEventPayload } from "./calendar-source";

const range = {
  start: new Date("2026-02-18T06:00:00.000Z"),
  end: new Date("2026-02-19T06:00:00.000Z"),
};

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
