import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { adjacentVisibleDate, daySwipeStep } from "./calendar-navigation";
declare const process: { env: Record<string, string | undefined> };

describe("adjacent visible date", () => {
  const previousTimezone = process.env.TZ;
  beforeAll(() => {
    process.env.TZ = "America/Chicago";
  });
  afterAll(() => {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  });
  it.each([
    [2026, 1, 18, 1, true, 2026, 1, 19],
    [2026, 1, 18, -1, true, 2026, 1, 17],
    [2026, 1, 22, 1, true, 2026, 1, 23],
    [2026, 1, 20, 1, false, 2026, 1, 23],
    [2026, 1, 23, -1, false, 2026, 1, 20],
    [2026, 1, 21, 1, false, 2026, 1, 23],
    [2026, 1, 22, -1, false, 2026, 1, 20],
    [2026, 11, 31, 1, true, 2027, 0, 1],
    [2027, 0, 1, -1, true, 2026, 11, 31],
    [2028, 1, 28, 1, true, 2028, 1, 29],
    [2026, 2, 8, 1, true, 2026, 2, 9],
    [2026, 10, 1, 1, true, 2026, 10, 2],
  ])("steps %i/%i/%i by %i (weekends %s)", (y, m, d, step, weekends, ny, nm, nd) => {
    const date = new Date(y as number, m as number, d as number);
    const before = date.getTime();
    const result = adjacentVisibleDate(date, step as -1 | 1, weekends as boolean);
    expect([result.getFullYear(), result.getMonth(), result.getDate(), result.getHours()]).toEqual([
      ny,
      nm,
      nd,
      0,
    ]);
    expect(date.getTime()).toBe(before);
  });
});

describe("date heading swipe", () => {
  it.each([
    [-48, 0, 1],
    [48, 0, -1],
    [-300, 20, 1],
    [47, 0, 0],
    [0, 100, 0],
    [60, 50, 0],
    [75, 50, 0],
    [NaN, 0, 0],
    [Infinity, 0, 0],
  ])("maps displacement %i,%i to %i", (dx, dy, step) => {
    expect(daySwipeStep(dx, dy)).toBe(step);
  });
});
