import { describe, expect, it } from "vitest";
import { formatHourLabel, formatShortDate, formatStatusDateTime } from "./localize";

const en12 = { locale: { language: "en-US", time_format: "12" } };
const en24 = { locale: { language: "en-US", time_format: "24" } };
const normalizeSpaces = (value: string) => value.replace(/\s+/gu, " ");

describe("wall calendar labels", () => {
  it("uses Home Assistant's 12-hour preference for hour ticks", () => {
    expect(normalizeSpaces(formatHourLabel(en12, 7))).toBe("7 AM");
    expect(normalizeSpaces(formatHourLabel(en12, 12))).toBe("12 PM");
    expect(normalizeSpaces(formatHourLabel(en12, 15))).toBe("3 PM");
  });

  it("keeps 24-hour ticks when Home Assistant requests them", () => {
    expect(formatHourLabel(en24, 7)).toBe("07:00");
    expect(formatHourLabel(en24, 15)).toBe("15:00");
  });

  it("formats the selected date in the Home Assistant locale", () => {
    expect(formatShortDate(en12, new Date(2026, 1, 18))).toBe("Feb 18");
  });
});

describe("Status tile date and time", () => {
  const now = new Date(2026, 8, 16, 15, 32);
  const label = (date: Date, clock = en12, at = now) =>
    normalizeSpaces(formatStatusDateTime(clock, date, at));

  it("labels later today and tomorrow separately from availability", () => {
    expect(label(new Date(2026, 8, 16, 18))).toBe("Today, 6 PM");
    expect(label(new Date(2026, 8, 17, 9))).toBe("Tomorrow, 9 AM");
    expect(label(new Date(2026, 8, 17, 9, 30))).toBe("Tomorrow, 9:30 AM");
  });

  it("uses an explicit weekday and date for appointments farther away", () => {
    expect(label(new Date(2026, 8, 19, 9))).toBe("Sat, Sep 19, 9 AM");
    expect(label(new Date(2027, 0, 4, 9))).toBe("Mon, Jan 4, 2027, 9 AM");
  });

  it("uses calendar boundaries, not rounded durations, for Tomorrow", () => {
    expect(label(new Date(2026, 8, 17, 0), en12, new Date(2026, 8, 16, 23, 59))).toBe(
      "Tomorrow, 12 AM",
    );
    expect(label(new Date(2026, 2, 9, 0, 15), en12, new Date(2026, 2, 8, 0, 30))).toBe(
      "Tomorrow, 12:15 AM",
    );
    expect(label(new Date(2026, 10, 2, 0, 15), en12, new Date(2026, 10, 1, 0, 30))).toBe(
      "Tomorrow, 12:15 AM",
    );
    expect(label(new Date(2027, 0, 1, 9), en12, new Date(2026, 11, 31, 23))).toBe("Tomorrow, 9 AM");
  });

  it("honors 24-hour preference including midnight", () => {
    expect(label(new Date(2026, 8, 17, 9), en24)).toBe("Tomorrow, 09:00");
    expect(label(new Date(2026, 8, 17, 0), en24)).toBe("Tomorrow, 00:00");
  });

  it("localizes relative day labels and clock times", () => {
    expect(
      label(new Date(2026, 8, 17, 9, 30), { locale: { language: "de-DE", time_format: "24" } }),
    ).toBe("Morgen, 09:30");
  });
});
