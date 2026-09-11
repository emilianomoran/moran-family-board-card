import type { HomeAssistant } from "custom-card-helpers";

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

export function readCalendarEvents(
  hass: Pick<HomeAssistant, "callApi">,
  entityId: string,
  range: CalendarRange,
): Promise<CalendarEventPayload[]> {
  const start = encodeURIComponent(range.start.toISOString());
  const end = encodeURIComponent(range.end.toISOString());

  return hass.callApi<CalendarEventPayload[]>(
    "GET",
    `calendars/${entityId}?start=${start}&end=${end}`,
  );
}
