/* ------------------------------------------------------------------ */
/*  Pure calendar-event logic (no DOM / no hass) — unit-testable.      */
/* ------------------------------------------------------------------ */

export const DAY_MS = 86400000;

/** Advance by calendar dates, not elapsed 24-hour blocks (which drift at DST). */
export function addLocalDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Difference between local calendar dates, independent of timezone offsets. */
export function localDayDifference(later: Date, earlier: Date): number {
  const ordinal = (date: Date) =>
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
  return ordinal(later) - ordinal(earlier);
}

/**
 * Optional routing rules for a board lane. These stay deliberately generic:
 * household-specific names and conventions belong in Lovelace configuration,
 * not in the public card bundle.
 */
export interface EventRouteConfig {
  calendar?: string | string[];
  match_title_prefixes?: string[];
  match_title_contains?: string[];
  match_title_regex?: string[];
  unmatched?: boolean;
  strip_title_prefix?: boolean;
}

const values = (input?: string[]): string[] =>
  Array.isArray(input) ? input.map((value) => String(value).trim()).filter(Boolean) : [];

const calendars = (input?: string | string[]): string[] => {
  if (Array.isArray(input)) return input.filter(Boolean);
  return input ? [input] : [];
};

/**
 * Event titles often begin with a semantic marker (for example a star or car
 * emoji). Prefix routing intentionally ignores those markers so a rule such as
 * `Avery:` also matches `⭐️ Avery: Concert`.
 */
function titleBodyStart(title: string): number {
  const match = title.match(/[\p{L}\p{N}]/u);
  return match?.index ?? 0;
}

function titleBody(title: string): string {
  return title.slice(titleBodyStart(title));
}

export function hasEventRouteRules(config: EventRouteConfig): boolean {
  return (
    values(config.match_title_prefixes).length > 0 ||
    values(config.match_title_contains).length > 0 ||
    values(config.match_title_regex).length > 0
  );
}

/** Match one event title against one lane's configured rules. */
export function eventMatchesRoute(title: string, config: EventRouteConfig): boolean {
  if (!hasEventRouteRules(config)) return true;

  const lowerTitle = title.toLocaleLowerCase();
  const lowerBody = titleBody(title).toLocaleLowerCase();

  if (
    values(config.match_title_prefixes).some((prefix) =>
      lowerBody.startsWith(prefix.toLocaleLowerCase()),
    )
  ) {
    return true;
  }
  if (
    values(config.match_title_contains).some((part) =>
      lowerTitle.includes(part.toLocaleLowerCase()),
    )
  ) {
    return true;
  }
  return values(config.match_title_regex).some((pattern) => {
    try {
      return new RegExp(pattern, "iu").test(title);
    } catch {
      // A malformed user pattern should never break the whole calendar.
      return false;
    }
  });
}

/**
 * Return every lane that should receive an event. Legacy lanes without match
 * rules continue to receive every event from their configured calendars.
 * `unmatched` lanes receive the event only when no normal lane claimed it.
 */
export function routeEventToPeople(
  title: string,
  calendar: string,
  people: EventRouteConfig[],
): number[] {
  const isEligible = (person: EventRouteConfig) => calendars(person.calendar).includes(calendar);
  const matched = people.flatMap((person, index) => {
    if (person.unmatched || !isEligible(person)) return [];
    return eventMatchesRoute(title, person) ? [index] : [];
  });
  if (matched.length > 0) return matched;

  // A title such as "Avery + Jordan: Appointment" can be assigned using the
  // already-configured "Avery:" and "Jordan:" lane prefixes. Require every
  // owner token to resolve, so a partly-known title is not misrouted.
  const head = titleBody(title).match(/^([^:]+):/u)?.[1];
  const owners = head?.split(/\s*\+\s*/u).map((owner) => owner.trim());
  if (owners && owners.length > 1 && owners.every(Boolean)) {
    const resolved = owners.map((owner) =>
      people.flatMap((person, index) => {
        if (person.unmatched || !isEligible(person)) return [];
        const prefixes = values(person.match_title_prefixes);
        return prefixes.some(
          (prefix) =>
            prefix.replace(/:\s*$/u, "").toLocaleLowerCase() === owner.toLocaleLowerCase(),
        )
          ? [index]
          : [];
      }),
    );
    if (resolved.every((indexes) => indexes.length > 0)) {
      return [...new Set(resolved.flat())];
    }
  }

  return people.flatMap((person, index) => (person.unmatched && isEligible(person) ? [index] : []));
}

/** Remove only the matched person prefix while preserving leading markers. */
export function displayTitleForRoute(title: string, config: EventRouteConfig): string {
  if (!config.strip_title_prefix) return title;
  const start = titleBodyStart(title);
  const leading = title.slice(0, start).trim();
  const body = title.slice(start);
  const lowerBody = body.toLocaleLowerCase();
  const prefix = values(config.match_title_prefixes).find((candidate) =>
    lowerBody.startsWith(candidate.toLocaleLowerCase()),
  );
  if (!prefix) return title;

  const remainder = body.slice(prefix.length).trimStart();
  return [leading, remainder].filter(Boolean).join(" ").trim() || title;
}

/**
 * Compute new start/end for a drag (move) or resize gesture.
 * `deltaMin` is the raw dragged offset in minutes; the result snaps to the
 * `gridMin` raster (absolute, from midnight of the event's day) and keeps a
 * minimum duration of one grid step.
 */
export function dragTimes(
  origStart: Date,
  origEnd: Date,
  deltaMin: number,
  mode: "move" | "resize",
  gridMin: number,
): { start: Date; end: Date } {
  const grid = Math.max(1, gridMin);
  const midnight = new Date(origStart);
  midnight.setHours(0, 0, 0, 0);
  const base = midnight.getTime();
  const startMin = (origStart.getTime() - base) / 60000;
  const durMin = (origEnd.getTime() - origStart.getTime()) / 60000;
  if (mode === "move") {
    const snapped = Math.round((startMin + deltaMin) / grid) * grid;
    const start = new Date(base + snapped * 60000);
    return { start, end: new Date(start.getTime() + durMin * 60000) };
  }
  // resize: keep start, move the end; floor the duration at one grid step
  let newDur = Math.round((durMin + deltaMin) / grid) * grid;
  if (newDur < grid) newDur = grid;
  return { start: origStart, end: new Date(origStart.getTime() + newDur * 60000) };
}

/** A raw event as returned by HA, kept so we can edit/delete it. */
export interface RawEvent {
  personIdx: number;
  calendar: string;
  uid?: string;
  recurrence_id?: string;
  rrule?: string;
  summary: string;
  sourceSummary?: string; // unchanged source title, shared by copies in several lanes
  description?: string;
  location?: string;
  allDay: boolean;
  start: Date; // absolute start
  end: Date; // absolute end (exclusive)
  color: string;
  tentative?: boolean; // provisional event (dashed styling)
}

/** Stable occurrence identity across copies routed into several person lanes. */
export function occurrenceKey(raw: RawEvent): string {
  return JSON.stringify([
    raw.calendar,
    raw.uid || raw.sourceSummary || raw.summary,
    raw.recurrence_id || raw.start.toISOString(),
    raw.uid ? "" : raw.end.toISOString(),
  ]);
}

/**
 * Collapse duplicate copies only within one owner lane. The same occurrence
 * routed to another owner is not a duplicate, and distinct recurring
 * occurrences from one calendar must not disappear merely because their
 * titles and times happen to match.
 */
export function dedupeRoutedEvents(raws: RawEvent[]): RawEvent[] {
  const seenOccurrences = new Set<string>();
  const seenFingerprints = new Map<string, Set<string>>();
  return raws.filter((raw) => {
    const occurrence = `${raw.personIdx}|${occurrenceKey(raw)}`;
    if (seenOccurrences.has(occurrence)) return false;
    const fingerprint = `${raw.personIdx}|${raw.summary}|${raw.start.getTime()}|${raw.end.getTime()}`;
    const calendars = seenFingerprints.get(fingerprint);
    if (calendars && [...calendars].some((calendar) => calendar !== raw.calendar)) return false;
    seenOccurrences.add(occurrence);
    if (calendars) calendars.add(raw.calendar);
    else seenFingerprints.set(fingerprint, new Set([raw.calendar]));
    return true;
  });
}

/** Current and next timed appointments for one lane within the loaded range. */
export function selectTimedActivity(
  raws: RawEvent[],
  personIdx: number,
  now: Date,
): { current?: RawEvent; next?: RawEvent } {
  const time = now.getTime();
  const mine = raws.filter((raw) => raw.personIdx === personIdx && !raw.allDay);
  const current = mine
    .filter((raw) => raw.start.getTime() <= time && time < raw.end.getTime())
    .sort((a, b) => b.start.getTime() - a.start.getTime() || a.end.getTime() - b.end.getTime())[0];
  const next = mine
    .filter((raw) => raw.start.getTime() > time)
    .sort((a, b) => a.start.getTime() - b.start.getTime() || a.end.getTime() - b.end.getTime())[0];
  return { current, next };
}

/** A per-day display segment derived from a RawEvent. */
export interface BoardEvent {
  ref: RawEvent;
  personIdx: number;
  day: number; // 0 = Monday, within the current week
  startMin: number; // minutes from midnight of `day`
  endMin: number; // minutes from midnight of `day` (1440 = end of day)
  title: string;
  location?: string;
  allDay: boolean;
  color: string;
  continuesBefore: boolean;
  continuesAfter: boolean;
  part?: number; // 1-based day index for multi-day events ("day 2 of 5")
  parts?: number; // total days of a multi-day event; unset when single-day
}

/** A timed segment with its side-by-side overlap placement. */
export interface LaidOutEvent extends BoardEvent {
  col: number; // 0-based column within an overlap cluster
  cols: number; // total columns in that cluster
  span: number; // how many columns this event may stretch across (>= 1)
  cluster: number; // id of the overlap cluster this event belongs to
}

const record = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

const optionalText = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const optionalIdentity = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value : undefined;

/** Reject impossible dates rather than letting Date normalize them into another day. */
function validCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseCalendarDateTime(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const parts = value.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/,
  );
  if (
    !parts ||
    !validCalendarDate(parts[1]) ||
    Number(parts[2]) > 23 ||
    Number(parts[3]) > 59 ||
    Number(parts[4] ?? 0) > 59
  )
    return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

/** Normalize an untrusted HA calendar item; malformed records must not throw. */
export function parseRawEvent(
  input: unknown,
  personIdx: number,
  calendar: string,
  color: string,
): RawEvent | null {
  const ev = record(input);
  const starts = record(ev?.start);
  if (!ev || !starts) return null;
  if (ev.summary != null && typeof ev.summary !== "string") return null;
  if (
    [ev.uid, ev.recurrence_id, ev.rrule].some((value) => value != null && typeof value !== "string")
  )
    return null;
  const ends = record(ev.end);
  if (ev.end != null && !ends) return null;
  const allDay = starts.dateTime == null;
  if (starts.date != null && starts.dateTime != null) return null;
  let start: Date;
  let end: Date;
  if (allDay) {
    // All-day: dates are timezone-naive; end is EXCLUSIVE.
    if (!validCalendarDate(starts.date) || ends?.dateTime != null) return null;
    if (ends?.date != null && !validCalendarDate(ends.date)) return null;
    start = new Date(`${starts.date}T00:00:00`);
    end = ends?.date != null ? new Date(`${ends.date}T00:00:00`) : addLocalDays(start, 1);
  } else {
    if (ends?.date != null) return null;
    const parsedStart = parseCalendarDateTime(starts.dateTime);
    const parsedEnd = parseCalendarDateTime(ends?.dateTime ?? starts.dateTime);
    if (!parsedStart || !parsedEnd) return null;
    start = parsedStart;
    end = parsedEnd;
  }
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (end.getTime() < start.getTime() || (allDay && end.getTime() === start.getTime())) return null;
  // Point appointments still need a visible segment; an explicit reversed range is invalid.
  if (end.getTime() === start.getTime()) end = new Date(start.getTime() + 60000);
  const summary = optionalText(ev.summary) || "Termin";
  return {
    personIdx,
    calendar,
    uid: optionalIdentity(ev.uid),
    recurrence_id: optionalIdentity(ev.recurrence_id),
    rrule: optionalIdentity(ev.rrule),
    summary,
    sourceSummary: summary,
    description: optionalText(ev.description),
    location: optionalText(ev.location),
    allDay,
    start,
    end,
    color,
    // Tentative is opt-in via `tentative_patterns` only. We deliberately do NOT
    // derive it from the calendar status: some feeds (e.g. school timetables)
    // mark every event TENTATIVE, which would make whole columns look faded.
    tentative: false,
  };
}

/** Split a RawEvent into per-day display segments within the visible week. */
export function splitIntoSegments(raw: RawEvent, monday: Date): BoardEvent[] {
  return splitAcrossDays(raw, monday, 7);
}

/**
 * Split a RawEvent into per-day segments across `numDays` days starting at
 * `gridStart`. `day` is the 0-based offset from `gridStart`. Used by the week
 * views (numDays = 7) and the month grid (numDays = weeks * 7).
 */
export function splitAcrossDays(raw: RawEvent, gridStart: Date, numDays: number): BoardEvent[] {
  const segs: BoardEvent[] = [];
  // "day X of Y" for events that span multiple calendar days
  const firstDay = new Date(raw.start);
  firstDay.setHours(0, 0, 0, 0);
  const lastTouchedDay = new Date(raw.end.getTime() - 1);
  const totalParts = Math.max(1, localDayDifference(lastTouchedDay, firstDay) + 1);
  for (let d = 0; d < numDays; d++) {
    const dayStart = addLocalDays(gridStart, d);
    const dayEnd = addLocalDays(gridStart, d + 1);
    const segStartMs = Math.max(raw.start.getTime(), dayStart.getTime());
    const segEndMs = Math.min(raw.end.getTime(), dayEnd.getTime());
    if (segEndMs <= segStartMs) continue;
    const start = new Date(segStartMs);
    const end = new Date(segEndMs);
    const startMin = raw.allDay ? 0 : start.getHours() * 60 + start.getMinutes();
    const endMin = raw.allDay
      ? 1440
      : segEndMs === dayEnd.getTime()
        ? 1440
        : end.getHours() * 60 + end.getMinutes();
    const part = totalParts > 1 ? localDayDifference(dayStart, firstDay) + 1 : undefined;
    segs.push({
      part,
      parts: totalParts > 1 ? totalParts : undefined,
      ref: raw,
      personIdx: raw.personIdx,
      day: d,
      startMin,
      endMin: Math.min(endMin, 1440),
      title: raw.summary,
      location: raw.location,
      allDay: raw.allDay,
      color: raw.color,
      continuesBefore: raw.start.getTime() < dayStart.getTime(),
      continuesAfter: raw.end.getTime() > dayEnd.getTime(),
    });
  }
  return segs;
}

/**
 * Assign side-by-side columns to overlapping timed events so they don't
 * stack on top of each other. Events in the same "overlap cluster" share
 * the same `cols` count; each gets its own `col` index.
 */
export function layoutDayColumns(events: BoardEvent[]): LaidOutEvent[] {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const result: LaidOutEvent[] = [];
  let cluster: LaidOutEvent[] = [];
  let clusterEnd = -1;
  let clusterId = 0;
  const colEnds: number[] = [];

  const flush = () => {
    if (cluster.length) {
      const cols = Math.max(...cluster.map((e) => e.col)) + 1;
      cluster.forEach((e) => {
        e.cols = cols;
        e.cluster = clusterId;
        // Stretch into free columns to the right until we hit a column used by
        // an event that overlaps in time (Google-Calendar-style expansion).
        let limit = cols;
        for (const o of cluster) {
          if (o !== e && o.col > e.col && o.startMin < e.endMin && o.endMin > e.startMin) {
            limit = Math.min(limit, o.col);
          }
        }
        e.span = Math.max(1, limit - e.col);
      });
      clusterId++;
    }
    cluster = [];
  };

  for (const ev of sorted) {
    if (cluster.length && ev.startMin >= clusterEnd) {
      flush();
      colEnds.length = 0;
    }
    let col = colEnds.findIndex((end) => end <= ev.startMin);
    if (col === -1) {
      col = colEnds.length;
      colEnds.push(ev.endMin);
    } else {
      colEnds[col] = ev.endMin;
    }
    const laid: LaidOutEvent = { ...ev, col, cols: 1, span: 1, cluster: clusterId };
    cluster.push(laid);
    result.push(laid);
    clusterEnd = cluster.length === 1 ? ev.endMin : Math.max(clusterEnd, ev.endMin);
  }
  flush();
  return result;
}
