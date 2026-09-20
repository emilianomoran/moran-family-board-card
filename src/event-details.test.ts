import { describe, expect, it } from "vitest";
import { findRefreshedEvent, type RawEvent } from "./events";

const fixture = (changes: Partial<RawEvent> = {}): RawEvent => ({
  personIdx: 0,
  calendar: "calendar.fixture",
  uid: "appointment",
  summary: "Original",
  sourceSummary: "Avery: Original",
  allDay: false,
  color: "#123456",
  start: new Date("2026-02-18T16:00:00-06:00"),
  end: new Date("2026-02-18T17:00:00-06:00"),
  ...changes,
});

describe("refreshing read-only event details", () => {
  it("matches a moved and renamed non-recurring event by calendar and UID", () => {
    const changed = fixture({ start: new Date("2026-02-19T16:00:00-06:00"), summary: "Changed" });
    expect(findRefreshedEvent(fixture(), [changed])).toBe(changed);
  });
  it("does not match the same UID in another calendar", () => {
    expect(
      findRefreshedEvent(fixture(), [fixture({ calendar: "calendar.other" })]),
    ).toBeUndefined();
  });
  it("matches a rescheduled recurring occurrence by recurrence ID, not another occurrence", () => {
    const original = fixture({ recurrence_id: "20260218T160000" });
    const moved = fixture({
      recurrence_id: original.recurrence_id,
      start: new Date("2026-02-19T16:00:00-06:00"),
    });
    expect(
      findRefreshedEvent(original, [fixture({ recurrence_id: "20260225T160000" }), moved]),
    ).toBe(moved);
  });
  it("does not replace a missing recurring occurrence with its neighbor", () => {
    expect(
      findRefreshedEvent(fixture({ recurrence_id: "one" }), [fixture({ recurrence_id: "two" })]),
    ).toBeUndefined();
  });
  it("requires the original start for a series without recurrence IDs", () => {
    const original = fixture({ rrule: "FREQ=WEEKLY" });
    expect(
      findRefreshedEvent(original, [
        fixture({ rrule: original.rrule, start: new Date("2026-02-25T16:00:00-06:00") }),
      ]),
    ).toBeUndefined();
  });
  it("keeps the inspected owner copy when an occurrence is shared", () => {
    const original = fixture({ personIdx: 1 });
    expect(findRefreshedEvent(original, [fixture(), original])).toBe(original);
  });
  it("can follow an exact occurrence whose owner routing changed", () => {
    const changed = fixture({ personIdx: 2 });
    expect(findRefreshedEvent(fixture(), [changed])).toBe(changed);
  });
  it("refuses conflicting duplicate identities", () => {
    expect(
      findRefreshedEvent(fixture(), [fixture(), fixture({ location: "Conflicting room" })]),
    ).toBeUndefined();
  });
  it("retains an unchanged ID-less event but does not guess at renamed or moved events", () => {
    const original = fixture({ uid: undefined });
    expect(findRefreshedEvent(original, [original])).toBe(original);
    expect(
      findRefreshedEvent(original, [fixture({ uid: undefined, sourceSummary: "Different" })]),
    ).toBeUndefined();
    expect(
      findRefreshedEvent(original, [
        fixture({ uid: undefined, start: new Date("2026-02-19T16:00:00-06:00") }),
      ]),
    ).toBeUndefined();
  });
  it("returns no replacement when an event disappears", () => {
    expect(findRefreshedEvent(fixture(), [])).toBeUndefined();
  });
});
