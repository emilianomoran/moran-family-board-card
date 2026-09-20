import { addLocalDays } from "./events";

/** Move by calendar dates, never 24-hour durations (including DST/week/year boundaries). */
export function adjacentVisibleDate(date: Date, direction: -1 | 1, showWeekends = true): Date {
  let next = addLocalDays(date, direction);
  while (!showWeekends && (next.getDay() === 0 || next.getDay() === 6)) {
    next = addLocalDays(next, direction);
  }
  return next;
}

/** Commit one day only after a deliberate horizontal gesture; taps/vertical motion do nothing. */
export function daySwipeStep(dx: number, dy: number): -1 | 0 | 1 {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return 0;
  if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy) * 1.5) return 0;
  return dx < 0 ? 1 : -1;
}
