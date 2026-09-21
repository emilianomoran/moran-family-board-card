/* ------------------------------------------------------------------ */
/*  Lightweight i18n. Static UI strings ship as EN/DE; dates, times    */
/*  and weekday names are derived from the HA locale via Intl.         */
/* ------------------------------------------------------------------ */

import { localDayDifference } from "./events";

type Dict = Record<string, string>;

const EN: Dict = {
  board_title: "Family board",
  wall_board_title: "Family Board",
  wall_calendar_identity: "Calendar",
  day: "Day",
  week: "Week",
  month: "Month",
  agenda: "Agenda",
  timeline: "Timeline",
  all_day: "all-day",
  this_week: "This week",
  prev_week: "Previous week",
  next_week: "Next week",
  prev_day: "Previous day",
  next_day: "Next day",
  day_navigation_hint: "Swipe left or right, or use the arrow keys, to change the date.",
  prev_month: "Previous month",
  next_month: "Next month",
  today: "Today",
  show_today: "Show today",
  tomorrow: "Tomorrow",
  yesterday: "Yesterday",
  open_map: "Map",
  status_home: "home",
  status_away: "away",
  add_event: "Add event",
  new_event: "New event",
  event: "Event",
  edit_event: "Edit event",
  close: "Close",
  field_title: "Title",
  field_all_day: "All-day",
  field_start: "Start",
  field_end: "End",
  field_location: "Location",
  field_note: "Note",
  field_calendar: "Calendar",
  recurring: "Recurring event",
  recur_this: "This event only",
  recur_future: "This and following",
  read_only: "This calendar is read-only.",
  details_refreshing: "Checking for updates. Showing previously loaded details…",
  details_updated: "These details have been updated from the calendar.",
  details_unavailable:
    "Could not verify this event. These previously loaded details may be out of date.",
  details_missing:
    "This event was not found in the refreshed calendar range. It may have changed, moved, or been removed. These are previously loaded details.",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save",
  err_invalid: "Please enter valid times.",
  err_end_before: "End is before start.",
  err_end_equal: "End must be after start.",
  save_failed: "Saving failed.",
  delete_failed: "Deleting failed.",
  default_title: "Event",
  load_error: "Calendar could not be loaded.",
  loading_calendars: "Loading calendars…",
  refreshing_calendars: "Refreshing calendars…",
  retry: "Retry",
  partial_load: "Some calendars could not be loaded. Showing available events.",
  incomplete_events: "Some calendars or events could not be read. The schedule may be incomplete.",
  no_events: "No events.",
  more_events: "more events",
  events: "events",
  event_count_one: "event",
  visible_people: "Visible people",
  focus_next: "next",
  focus_until: "until",
  focus_free: "free",
  focus_unavailable: "schedule unavailable",
  status_free_now: "Free now",
  status_busy_now: "Busy now",
  status_now: "Now",
  status_next: "Next",
  status_tiles: "Status tiles",
  calendar_zoom: "Calendar zoom",
  reset_zoom: "Reset",
  zoom_more_hours: "More hours",
  zoom_more_detail: "More detail",
};

const DE: Dict = {
  board_title: "Familienplan",
  wall_board_title: "Familienplan",
  wall_calendar_identity: "Kalender",
  day: "Tag",
  week: "Woche",
  month: "Monat",
  agenda: "Agenda",
  timeline: "Zeitstrahl",
  all_day: "ganztägig",
  this_week: "Diese Woche",
  prev_week: "Vorherige Woche",
  next_week: "Nächste Woche",
  prev_day: "Vorheriger Tag",
  next_day: "Nächster Tag",
  day_navigation_hint:
    "Nach links oder rechts wischen oder die Pfeiltasten verwenden, um das Datum zu ändern.",
  prev_month: "Vorheriger Monat",
  next_month: "Nächster Monat",
  today: "Heute",
  show_today: "Heute anzeigen",
  tomorrow: "Morgen",
  yesterday: "Gestern",
  open_map: "Karte",
  status_home: "zuhause",
  status_away: "unterwegs",
  add_event: "Termin hinzufügen",
  new_event: "Neuer Termin",
  event: "Termin",
  edit_event: "Termin bearbeiten",
  close: "Schließen",
  field_title: "Titel",
  field_all_day: "Ganztägig",
  field_start: "Start",
  field_end: "Ende",
  field_location: "Ort",
  field_note: "Notiz",
  field_calendar: "Kalender",
  recurring: "Wiederkehrender Termin",
  recur_this: "Nur dieser Termin",
  recur_future: "Dieser und folgende",
  read_only: "Dieser Kalender ist schreibgeschützt.",
  details_refreshing: "Aktualisierung wird geprüft. Zuletzt geladene Details werden angezeigt…",
  details_updated: "Diese Details wurden aus dem Kalender aktualisiert.",
  details_unavailable:
    "Dieser Termin konnte nicht geprüft werden. Die zuletzt geladenen Details sind möglicherweise veraltet.",
  details_missing:
    "Dieser Termin wurde im aktualisierten Kalenderzeitraum nicht gefunden. Er wurde möglicherweise geändert, verschoben oder entfernt. Angezeigt werden die zuletzt geladenen Details.",
  delete: "Löschen",
  cancel: "Abbrechen",
  save: "Speichern",
  err_invalid: "Bitte gültige Zeiten angeben.",
  err_end_before: "Ende liegt vor dem Start.",
  err_end_equal: "Ende muss nach dem Start liegen.",
  save_failed: "Speichern fehlgeschlagen.",
  delete_failed: "Löschen fehlgeschlagen.",
  default_title: "Termin",
  load_error: "Kalender konnte nicht geladen werden.",
  loading_calendars: "Kalender werden geladen…",
  refreshing_calendars: "Kalender werden aktualisiert…",
  retry: "Erneut versuchen",
  partial_load:
    "Einige Kalender konnten nicht geladen werden. Verfügbare Termine werden angezeigt.",
  incomplete_events:
    "Einige Kalender oder Termine konnten nicht gelesen werden. Der Plan ist möglicherweise unvollständig.",
  no_events: "Keine Termine.",
  more_events: "weitere Termine",
  events: "Termine",
  event_count_one: "Termin",
  visible_people: "Sichtbare Personen",
  focus_next: "als Nächstes",
  focus_until: "bis",
  focus_free: "frei",
  focus_unavailable: "Plan nicht verfügbar",
  status_free_now: "Jetzt frei",
  status_busy_now: "Jetzt beschäftigt",
  status_now: "Jetzt",
  status_next: "Als Nächstes",
  status_tiles: "Status-Kacheln",
  calendar_zoom: "Kalenderzoom",
  reset_zoom: "Zurücksetzen",
  zoom_more_hours: "Mehr Stunden",
  zoom_more_detail: "Mehr Details",
};

const TABLE: Record<string, Dict> = { en: EN, de: DE };

/** Two-letter language from a HA-style locale object. */
export function langOf(hass: any): string {
  const l = (hass?.locale?.language || navigator?.language || "en").toLowerCase();
  return l.split("-")[0];
}

export function localize(hass: any, key: string): string {
  const lang = langOf(hass);
  return TABLE[lang]?.[key] ?? EN[key] ?? key;
}

/** BCP-47 tag for Intl, preferring the full HA locale language. */
function intlLocale(hass: any): string {
  return hass?.locale?.language || navigator?.language || "en";
}

/** Whether to use 12-hour clock, based on the HA time_format preference. */
function use12h(hass: any): boolean {
  const tf = hass?.locale?.time_format;
  if (tf === "12") return true;
  if (tf === "24") return false;
  // "language"/"system"/undefined -> let Intl decide from the locale
  const probe = new Intl.DateTimeFormat(intlLocale(hass), { hour: "numeric" }).format(
    new Date(2020, 0, 1, 13),
  );
  return /\s?[AaPp]\.?[Mm]\.?/.test(probe) || /1\s?PM/i.test(probe);
}

/** Format an absolute Date as a locale-aware time (HH:mm or h:mm AM/PM). */
export function formatTime(hass: any, date: Date): string {
  return new Intl.DateTimeFormat(intlLocale(hass), {
    hour: use12h(hass) ? "numeric" : "2-digit",
    minute: "2-digit",
    hour12: use12h(hass),
  }).format(date);
}

/** Format minutes-from-midnight (of an arbitrary day) as a locale time. */
export function formatMinutes(hass: any, min: number): string {
  const d = new Date(2020, 0, 1, 0, 0, 0, 0);
  d.setMinutes(min);
  return formatTime(hass, d);
}

/** Compact hour tick for the wall axis, honoring Home Assistant's clock preference. */
export function formatHourLabel(hass: any, hour: number): string {
  const date = new Date(2020, 0, 1, hour, 0, 0, 0);
  return new Intl.DateTimeFormat(
    intlLocale(hass),
    use12h(hass)
      ? { hour: "numeric", hourCycle: "h12" }
      : { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
  ).format(date);
}

/** Short, localized calendar date for a compact wall heading. */
export function formatShortDate(hass: any, date: Date): string {
  return new Intl.DateTimeFormat(intlLocale(hass), { month: "short", day: "numeric" }).format(date);
}

/** Explicit calendar day and compact clock time for Status tiles, not a countdown. */
export function formatStatusDateTime(hass: any, date: Date, now: Date = new Date()): string {
  const days = localDayDifference(date, now);
  const day =
    days === 0 || days === 1
      ? localize(hass, days === 0 ? "today" : "tomorrow")
      : new Intl.DateTimeFormat(intlLocale(hass), {
          weekday: "short",
          month: "short",
          day: "numeric",
          ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" as const } : {}),
        }).format(date);
  const twelveHour = use12h(hass);
  const time = new Intl.DateTimeFormat(intlLocale(hass), {
    hour: twelveHour ? "numeric" : "2-digit",
    ...(!twelveHour || date.getMinutes() !== 0 ? { minute: "2-digit" as const } : {}),
    hourCycle: twelveHour ? "h12" : "h23",
  }).format(date);
  return `${day}, ${time}`;
}

/**
 * Localized weekday names ordered by the given week start.
 * `style`: "short" | "long". `firstDayJs`: 0=Sunday, 1=Monday (default).
 */
export function weekdayNames(hass: any, style: "short" | "long", firstDayJs: number = 1): string[] {
  const fmt = new Intl.DateTimeFormat(intlLocale(hass), { weekday: style });
  // 2024-01-07 is a Sunday -> index by JS weekday (0=Sun..6=Sat).
  const byJs = Array.from({ length: 7 }, (_, js) => {
    const s = fmt.format(new Date(2024, 0, 7 + js));
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
  return Array.from({ length: 7 }, (_, i) => byJs[(firstDayJs + i) % 7]);
}

/** Localized short countdown to a future date, e.g. "in 20 Min." / "in 2 hr.". */
export function formatCountdown(hass: any, date: Date, now: Date = new Date()): string {
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return "";
  const rtf = new Intl.RelativeTimeFormat(intlLocale(hass), { numeric: "always", style: "short" });
  const min = Math.round(diffMs / 60000);
  if (min < 60) return rtf.format(Math.max(1, min), "minute");
  const hours = Math.round(min / 60);
  if (hours < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
}

/** Localized "1 Jan – 7 Jan" style range for a week. */
export function formatWeekRange(hass: any, monday: Date): string {
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  const fmt = new Intl.DateTimeFormat(intlLocale(hass), { day: "numeric", month: "short" });
  return `${fmt.format(monday)} – ${fmt.format(sunday)}`;
}
