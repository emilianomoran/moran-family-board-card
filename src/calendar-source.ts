import type { HomeAssistant } from "custom-card-helpers";
import { parseRawEvent } from "./events";

export interface CalendarEventPayload {
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
  summary?: string;
  description?: string;
  location?: string;
  uid?: string;
  recurrence_id?: string;
  rrule?: string;
  [key: string]: unknown;
}

export interface CalendarRange {
  start: Date;
  end: Date;
}

export type CalendarReadResult =
  | { entityId: string; status: "ok"; events: CalendarEventPayload[] }
  | { entityId: string; status: "partial"; events: CalendarEventPayload[]; rejectedCount: number }
  | { entityId: string; status: "missing" | "error"; events: [] };

export async function readCalendarEvents(
  hass: Pick<HomeAssistant, "callApi">,
  entityId: string,
  range: CalendarRange,
): Promise<CalendarEventPayload[]> {
  const start = encodeURIComponent(range.start.toISOString());
  const end = encodeURIComponent(range.end.toISOString());

  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    // HA's callApi does not expose an AbortSignal. Bound the wait so one stalled
    // source cannot leave every other calendar behind an endless loading state.
    const events = await Promise.race([
      hass.callApi<CalendarEventPayload[]>(
        "GET",
        `calendars/${entityId}?start=${start}&end=${end}`,
      ),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Calendar read timed out")), 20000);
      }),
    ]);
    if (!Array.isArray(events)) throw new TypeError("Calendar response is not an event list.");
    return events;
  } finally {
    clearTimeout(timeout);
  }
}

/** Read every configured source once, retaining empty success and failures separately. */
export async function readCalendarBatch(
  hass: Pick<HomeAssistant, "callApi">,
  entityIds: string[],
  availableEntityIds: ReadonlySet<string>,
  range: CalendarRange,
): Promise<CalendarReadResult[]> {
  return Promise.all(
    [...new Set(entityIds.filter(Boolean))].map(async (entityId): Promise<CalendarReadResult> => {
      if (!availableEntityIds.has(entityId)) {
        return { entityId, status: "missing", events: [] };
      }
      try {
        const received = await readCalendarEvents(hass, entityId, range);
        const events = received.filter((event) => parseRawEvent(event, 0, entityId, "") !== null);
        const rejectedCount = received.length - events.length;
        return rejectedCount > 0
          ? { entityId, status: "partial", events, rejectedCount }
          : { entityId, status: "ok", events };
      } catch {
        // Do not expose potentially sensitive API error details in the card.
        return { entityId, status: "error", events: [] };
      }
    }),
  );
}
