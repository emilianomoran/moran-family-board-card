import { describe, expect, it } from "vitest";
import { formatHourLabel, formatShortDate } from "./localize";

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
