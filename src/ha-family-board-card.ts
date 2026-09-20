import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCard, LovelaceCardEditor } from "custom-card-helpers";
import {
  RawEvent,
  BoardEvent,
  LaidOutEvent,
  addLocalDays,
  localDayDifference,
  parseRawEvent,
  splitIntoSegments,
  splitAcrossDays,
  layoutDayColumns,
  dragTimes,
  routeEventToPeople,
  displayTitleForRoute,
  dedupeRoutedEvents,
  occurrenceKey,
  findRefreshedEvent,
  selectTimedActivity,
} from "./events";
import {
  ALL_VIEWS,
  normalizeLayout,
  type FamilyBoardConfig,
  type FamilyBoardLayout,
  type PersonConfig,
  type ViewName,
} from "./config";
import { readCalendarBatch, type CalendarRange, type CalendarReadResult } from "./calendar-source";
import { renderWallShell, wallShellStyles } from "./wall-shell";
import { preferencesKey, readPreferences, writePreferences } from "./preferences";
import { adjacentVisibleDate, daySwipeStep } from "./calendar-navigation";
import {
  localize,
  formatTime,
  formatMinutes,
  formatHourLabel,
  formatShortDate,
  formatStatusDateTime,
  formatCountdown,
  weekdayNames,
  formatWeekRange,
} from "./localize";

/** A collapsed "+N more" marker for dense overlap clusters in the day view. */
interface Overflow {
  col: number;
  cols: number;
  startMin: number;
  endMin: number;
  count: number;
}

/** State of the create/edit dialog. */
interface DialogState {
  mode: "create" | "edit";
  personIdx: number;
  calendar: string;
  uid?: string;
  recurrence_id?: string;
  canUpdate: boolean;
  canDelete: boolean;
  summary: string;
  location: string;
  description: string;
  allDay: boolean;
  start: string; // datetime-local ("YYYY-MM-DDTHH:mm") or date ("YYYY-MM-DD")
  end: string;
  recurring?: boolean; // event is part of a recurring series
  recurrenceRange: "" | "THISANDFUTURE"; // scope for edit/delete of a series
  calendarOptions?: string[]; // when a person has several writable calendars
  busy?: boolean;
  error?: string;
  source?: RawEvent; // read-only details snapshot; editable drafts are never replaced by a poll
  detailsStatus?: "updated" | "unavailable" | "missing";
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const FALLBACK_COLORS = [
  "#8B7CF6",
  "#34D399",
  "#FBBF24",
  "#FB7185",
  "#22D3EE",
  "#C084FC",
  "#A3E635",
  "#FB923C",
  "#F472B6",
  "#60A5FA",
];
const DEFAULT_HOUR_HEIGHT = 64; // px per hour in the day view
const HOUR_HEIGHT_MIN = 40;
const HOUR_HEIGHT_MAX = 96;

// HA weather condition -> mdi icon
const WEATHER_ICON: Record<string, string> = {
  "clear-night": "weather-night",
  cloudy: "weather-cloudy",
  fog: "weather-fog",
  hail: "weather-hail",
  lightning: "weather-lightning",
  "lightning-rainy": "weather-lightning-rainy",
  partlycloudy: "weather-partly-cloudy",
  pouring: "weather-pouring",
  rainy: "weather-rainy",
  snowy: "weather-snowy",
  "snowy-rainy": "weather-snowy-rainy",
  sunny: "weather-sunny",
  windy: "weather-windy",
  "windy-variant": "weather-windy-variant",
  exceptional: "weather-cloudy-alert",
};

// CalendarEntityFeature bitmask (home-assistant/core)
const FEAT_CREATE = 1;
const FEAT_DELETE = 2;
const FEAT_UPDATE = 4;

/** Built-in keyword -> emoji map for auto_icons (DE + EN). First match wins. */
const ICON_MAP: Array<[RegExp, string]> = [
  [/zahnarzt|dentist|kieferortho/i, "🦷"],
  [/arzt|doctor|doktor|klinik|hospital|therapie|physio|impf/i, "🩺"],
  [/geburtstag|geb\.|birthday|jubiläum|jubilaeum|anniversary/i, "🎂"],
  [/schwimm|swim|hallenbad|baden/i, "🏊"],
  [/fußball|fussball|soccer|football|training/i, "⚽"],
  [/sport|gym|fitness|turnen|joggen|laufen|workout/i, "🏃"],
  [/reit|pferd|pony|horse/i, "🐴"],
  [/tanz|ballett|dance/i, "🩰"],
  [/klavier|gitarre|musik|music|chor|singen|band|orchester|instrument/i, "🎵"],
  [
    /schule|unterricht|klasse|klassenverbund|school|nachhilfe|lernen|prüfung|pruefung|klausur/i,
    "🎒",
  ],
  [/kita|kindergarten|krippe|hort/i, "🧸"],
  [/frühstück|fruehstueck|breakfast/i, "🥐"],
  [/mittag|lunch|abendessen|dinner|essen|kochen|restaurant|brunch/i, "🍽️"],
  [/kaffee|coffee|café|cafe/i, "☕"],
  [/urlaub|ferien|vacation|holiday|reise|trip|strand|beach/i, "🏖️"],
  [/flug|flight|airport|flughafen/i, "✈️"],
  [/zug|bahn|train|abfahrt|ankunft/i, "🚆"],
  [/kino|film|movie|cinema/i, "🎬"],
  [/party|feier|fest|celebration/i, "🎉"],
  [/einkauf|shopping|supermarkt|einkaufen|besorgung/i, "🛒"],
  [/putz|reinig|cleaning|wäsche|waesche|müll|muell|garbage|trash/i, "🧹"],
  [/schlaf|nap|ruhezeit|mittagsschlaf/i, "😴"],
  [/spiel|freispiel|play|angebotszeit/i, "🧸"],
  [/meeting|besprechung|termin|call|konferenz|conference|office|büro|buero|arbeit|work/i, "💼"],
  [/friseur|haircut|hairdresser|frisör|frisoer/i, "💇"],
  [/kirche|church|gottesdienst|messe|religion/i, "⛪"],
  [/pause|hofpause|break/i, "⏸️"],
];

// Test for an emoji already present in a title (avoid adding a second one).
const HAS_EMOJI = /\p{Extended_Pictographic}/u;

const pad = (n: number) => String(n).padStart(2, "0");

/** local Date -> "YYYY-MM-DDTHH:mm" for <input type=datetime-local> */
const toLocalInput = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
/** local Date -> "YYYY-MM-DD" for <input type=date> */
const toLocalDate = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
/** midnight (local) of the given date */
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const personColor = (p: PersonConfig, idx: number) =>
  p.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

/** Deterministic palette color from a string (for location/calendar coloring). */
const hashColor = (s: string): string => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
};

/**
 * Auto-detect family members: every person.* entity becomes a row, and
 * calendar.* entities are matched by entity slug or friendly name.
 * Exported so the editor can offer a one-click "detect" button.
 */
export function autoDetectPersons(hass: HomeAssistant): PersonConfig[] {
  const states = hass?.states ?? {};
  const calendars = Object.keys(states).filter((id) => id.startsWith("calendar."));
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  const persons: PersonConfig[] = [];
  for (const id of Object.keys(states)) {
    if (!id.startsWith("person.")) continue;
    const slug = id.slice("person.".length);
    const friendly = (states[id].attributes?.friendly_name as string | undefined) ?? slug;
    const key = norm(slug);
    const keyF = norm(friendly);
    const matched = calendars.filter((c) => {
      const cSlug = norm(c.slice("calendar.".length));
      const cName = norm((states[c].attributes?.friendly_name as string | undefined) ?? "");
      return (
        cSlug === key ||
        cSlug.includes(key) ||
        (keyF.length > 2 && (cSlug.includes(keyF) || cName.includes(keyF)))
      );
    });
    persons.push({
      name: friendly,
      person: id,
      calendar: matched.length === 1 ? matched[0] : matched.length ? matched : "",
    });
    if (persons.length >= 10) break;
  }
  return persons;
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
export class FamilyBoardCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  public nowProvider: () => Date = () => new Date();
  @state() private _config!: FamilyBoardConfig;
  private _layout: FamilyBoardLayout = "default";
  @state() private _events: BoardEvent[] = [];
  @state() private _view: ViewName = "day";
  @state() private _day: number = (new Date().getDay() + 6) % 7;
  @state() private _weekOffset = 0;
  @state() private _monthOffset = 0;
  @state() private _dialog?: DialogState;
  @state() private _loadError = false;
  @state() private _partialLoad = false;
  @state() private _loading = false;
  @state() private _fitPx = 0; // measured px/min with fit_height (0 = not measured)
  @state() private _hiddenP: number[] = []; // collapsed person indices; optionally browser-persisted
  @state() private _drag?: {
    raw: RawEvent;
    mode: "move" | "resize";
    deltaMin: number;
    moved: boolean;
    busy: boolean;
  };

  private _dragStartY = 0;
  private _dragPx = 1;
  private _dragGrid = 30;
  private _suppressClick = false;
  private _wallPan?: {
    board: HTMLElement;
    pointerId: number;
    startX: number;
    startY: number;
    startScrollLeft: number;
    moved: boolean;
  };
  private _daySwipe?: { pointerId: number; x: number; y: number; date: number };
  private _dayScrollAnchor?: { minute: number; left: number; date: number };
  private _dayScrollFrame?: number;
  private _raw: RawEvent[] = [];
  private _calendarResults: CalendarReadResult[] = [];
  private _fetchedKey = "";
  private _dataKey = "";
  private _loadedRange?: CalendarRange;
  private _fetchGeneration = 0;
  private _pendingFetch?: { key: string; promise: Promise<void> };
  @state() private _browserOnline = navigator.onLine !== false;
  private _timer?: number;
  private _tick?: number;
  @state() private _forecast: Record<string, { temp: number; condition: string }> = {};
  private _weatherKey = "";
  private _scrolledKey = "";
  private _scrollToNowRequested = false;
  private _scrollToNowFrame?: number;
  private _preferencesKey?: string;
  private _restoreFocus?: HTMLElement;
  private _ro?: ResizeObserver;
  private _lastInteract = Date.now();
  private _lastCalendarDate?: Date;

  /** Clone the injected display time so render calculations cannot mutate provider state. */
  private _now(): Date {
    return new Date(this.nowProvider().getTime());
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement("moran-family-board-card-editor") as LovelaceCardEditor;
  }

  /** Zero-config start: detect person.* entities and match their calendars. */
  public static getStubConfig(hass?: HomeAssistant): FamilyBoardConfig {
    const persons = hass ? autoDetectPersons(hass) : [];
    return {
      type: "custom:moran-family-board-card",
      view: "day",
      time_grid: 30,
      start_hour: 6,
      end_hour: 22,
      show_weekends: true,
      show_now_line: true,
      color_by: "person",
      persons: persons.length
        ? persons
        : [
            { name: "Person 1", person: "", calendar: "" },
            { name: "Person 2", person: "", calendar: "" },
          ],
    };
  }

  public setConfig(config: FamilyBoardConfig): void {
    if (!config.persons || !Array.isArray(config.persons)) {
      throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");
    }
    this._config = config;
    this._daySwipe = undefined;
    this._cancelDayScroll();
    if (config.read_only) {
      this._dialog = undefined;
      this._drag = undefined;
      window.removeEventListener("pointermove", this._onDragMove);
      window.removeEventListener("pointerup", this._onDragUp);
    }
    this._fetchedKey = "";
    this._fetchGeneration += 1;
    this._pendingFetch = undefined;
    this._dataKey = "";
    this._loadedRange = undefined;
    this._raw = [];
    this._events = [];
    this._calendarResults = [];
    this._loadError = false;
    this._partialLoad = false;
    this._layout = normalizeLayout(config.layout);
    const enabled = this._enabledViews;
    const wanted = config.view ?? "day";
    this._view = enabled.includes(wanted) ? wanted : enabled[0];
    this._day = this._todayIndex();
    // persons flagged `hidden` start collapsed (the header toggle brings them back)
    this._hiddenP = config.persons.map((p, i) => (p.hidden ? i : -1)).filter((i) => i >= 0);
    this._preferencesKey = undefined;
    this._scrolledKey = "";
    this._scrollToNowRequested = false;
    if (this._scrollToNowFrame !== undefined) cancelAnimationFrame(this._scrollToNowFrame);
    this._scrollToNowFrame = undefined;
    this._restorePreferences();
    // simple size knobs -> CSS tokens (also overridable via theme/card-mod)
    const colMin = Number(config.col_min_width);
    if (Number.isFinite(colMin) && colMin >= 60) {
      this.style.setProperty("--fb-col-min", `${Math.min(colMin, 400)}px`);
    } else {
      this.style.removeProperty("--fb-col-min");
    }
    this.toggleAttribute("compact", config.compact === true);
    const evSize = Number(config.event_size);
    if (Number.isFinite(evSize) && evSize >= 8 && evSize <= 20) {
      this.style.setProperty("--fb-event-size", `${evSize}px`);
      this.style.setProperty("--fb-chip-size", `${Math.max(evSize - 1, 8)}px`);
    } else {
      this.style.removeProperty("--fb-event-size");
      this.style.removeProperty("--fb-chip-size");
    }
    const radius = Number(config.radius);
    if (Number.isFinite(radius) && radius >= 0 && radius <= 20) {
      this.style.setProperty("--fb-radius", `${radius}px`);
      this.style.setProperty("--fb-radius-sm", `${Math.max(radius - 2, 2)}px`);
    } else {
      this.style.removeProperty("--fb-radius");
      this.style.removeProperty("--fb-radius-sm");
    }
    const pastOp = Number(config.past_opacity);
    if (Number.isFinite(pastOp) && pastOp >= 10 && pastOp <= 100) {
      this.style.setProperty("--fb-past-opacity", `${pastOp / 100}`);
    } else {
      this.style.removeProperty("--fb-past-opacity");
    }
    if (this.isConnected) this._startTimer();
  }

  /** Views shown in the toggle (config order-independent, default all). */
  private get _enabledViews(): ViewName[] {
    const v = this._config?.views;
    const chosen = Array.isArray(v) ? ALL_VIEWS.filter((x) => v.includes(x)) : [];
    return chosen.length ? chosen : [...ALL_VIEWS];
  }

  private _restorePreferences(): void {
    if (!this._config) return;
    const key = preferencesKey(this._config, window.location.pathname, this.hass?.user?.id);
    if (key === this._preferencesKey) return;
    this._preferencesKey = key;
    const wanted = this._config.view ?? "day";
    this._view = this._enabledViews.includes(wanted) ? wanted : this._enabledViews[0];
    this._hiddenP = this._persons.flatMap((p, i) => (p.hidden ? [i] : []));
    this._scrolledKey = "";
    if (!key) return;
    try {
      const saved = readPreferences(
        window.localStorage,
        key,
        this._enabledViews,
        this._persons.length,
      );
      if (saved) {
        this._view = saved.view;
        this._hiddenP = saved.hidden;
      }
    } catch {
      // Accessing localStorage itself can throw in a restricted browser.
    }
  }

  private _savePreferences(): void {
    if (!this._preferencesKey) return;
    try {
      writePreferences(window.localStorage, this._preferencesKey, this._view, this._hiddenP);
    } catch {
      // Preferences are optional; a storage failure must not break interactions.
    }
  }

  private _selectView(view: ViewName): void {
    if (!this._enabledViews.includes(view)) return;
    if (this._view !== view) {
      this._cancelDayScroll();
      this._daySwipe = undefined;
    }
    if (this._view !== view) this._scrolledKey = "";
    this._view = view;
    this._savePreferences();
  }

  /** JS weekday (0=Sun..6=Sat) of the configured week start. */
  private get _firstDayJs(): number {
    return this._config?.first_day === "sunday" ? 0 : 1;
  }
  /** Column index (0..6 from week start) of the real today. */
  private _todayIndex(): number {
    return (this._now().getDay() - this._firstDayJs + 7) % 7;
  }

  public getCardSize(): number {
    return 12;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._browserOnline = navigator.onLine !== false;
    this._syncCalendarDate();
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("visibilitychange", this._onVisible);
    window.addEventListener("focus", this._onVisible);
    window.addEventListener("pageshow", this._onVisible);
    window.addEventListener("online", this._onOnline);
    window.addEventListener("offline", this._onOffline);
    this._startTimer();
    this.addEventListener("pointerdown", this._onInteract);
    // minute tick so countdowns and progress bars stay live when idle
    this._tick = window.setInterval(() => this._onClockTick(), 60000);
    if (this.hass && this._config) void this._maybeFetch();
    // recompute the fit-to-height scaling whenever the card is resized
    if (typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => requestAnimationFrame(() => this._measureFit()));
      this._ro.observe(this);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cancelDayScroll();
    this._daySwipe = undefined;
    if (this._scrollToNowFrame !== undefined) cancelAnimationFrame(this._scrollToNowFrame);
    this._scrollToNowFrame = undefined;
    this._fetchGeneration += 1;
    this._fetchedKey = "";
    this._pendingFetch = undefined;
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("visibilitychange", this._onVisible);
    window.removeEventListener("focus", this._onVisible);
    window.removeEventListener("pageshow", this._onVisible);
    window.removeEventListener("online", this._onOnline);
    window.removeEventListener("offline", this._onOffline);
    this.removeEventListener("pointerdown", this._onInteract);
    this._stopTimer();
    if (this._tick) {
      clearInterval(this._tick);
      this._tick = undefined;
    }
    this._ro?.disconnect();
    this._ro = undefined;
    window.removeEventListener("pointermove", this._onDragMove);
    window.removeEventListener("pointerup", this._onDragUp);
  }

  private get _progressOn(): boolean {
    return this._config?.show_progress !== false;
  }
  /** Whether an event is happening right now. */
  private _isCurrent(e: BoardEvent): boolean {
    const n = this._now().getTime();
    return e.ref.start.getTime() <= n && n < e.ref.end.getTime();
  }
  /** Elapsed percentage (0–100) of a currently running event. */
  private _progressPct(e: BoardEvent): number {
    const s = e.ref.start.getTime();
    const en = e.ref.end.getTime();
    if (en <= s) return 0;
    return Math.min(100, Math.max(0, ((this._now().getTime() - s) / (en - s)) * 100));
  }

  private _onInteract = (): void => {
    this._lastInteract = Date.now();
  };

  /** Follow Today overnight; keep an intentionally browsed date anchored. */
  private _syncCalendarDate(): void {
    const today = startOfDay(this._now());
    const previous = this._lastCalendarDate;
    this._lastCalendarDate = today;
    if (!previous || previous.getTime() === today.getTime()) return;
    const previousIndex = (previous.getDay() - this._firstDayJs + 7) % 7;
    const followsToday = this._weekOffset === 0 && this._day === previousIndex;
    const newIndex = this._todayIndex();
    const weekShift =
      localDayDifference(addLocalDays(today, -newIndex), addLocalDays(previous, -previousIndex)) /
      7;
    if (followsToday) this._day = newIndex;
    else this._weekOffset -= weekShift;
    if (this._monthOffset !== 0) {
      this._monthOffset -=
        (today.getFullYear() - previous.getFullYear()) * 12 +
        today.getMonth() -
        previous.getMonth();
    }
  }

  private _onClockTick(): void {
    this._syncCalendarDate();
    this._kioskReturn();
    if (this.hass && this._config) void this._maybeFetch();
    this.requestUpdate();
  }

  /** Kiosk mode: after `auto_return` minutes without touch, go back to the default view. */
  private _kioskReturn(): void {
    const min = Number(this._config?.auto_return ?? 0);
    if (!Number.isFinite(min) || min <= 0) return;
    if (Date.now() - this._lastInteract < min * 60000) return;
    if (this._dialog) return; // never yank an open dialog away
    const wanted = this._config.view ?? "day";
    const view = this._enabledViews.includes(wanted) ? wanted : this._enabledViews[0];
    if (this._view !== view) this._view = view;
    if (this._weekOffset !== 0) this._weekOffset = 0;
    if (this._monthOffset !== 0) this._monthOffset = 0;
    if (this._hiddenP.length) this._hiddenP = [];
    this._day = this._todayIndex();
  }

  /** Refresh when the tab/tablet becomes visible again. */
  private _onVisible = (): void => {
    if (!this.isConnected) return;
    if (document.visibilityState === "hidden") {
      // A suspended response must not become the authoritative wake-up snapshot.
      this._fetchGeneration += 1;
      this._pendingFetch = undefined;
      this._fetchedKey = "";
      return;
    }
    if (this.hass && this._config) {
      this._syncCalendarDate();
      void this._refetch();
    }
  };

  private _onOnline = (): void => {
    this._browserOnline = true;
    void this._refetch();
  };

  private _onOffline = (): void => {
    this._browserOnline = false;
    void this._maybeFetch();
  };

  private _pollCalendars = (): Promise<void> => {
    return document.visibilityState === "hidden" ? Promise.resolve() : this._refetch();
  };

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this._dialog) {
      e.stopPropagation();
      this._closeDialog();
    }
    if (e.key === "Tab" && this._dialog) {
      const dialog = this.renderRoot.querySelector<HTMLElement>(".dialog");
      if (!dialog) return;
      const controls = [
        ...dialog.querySelectorAll<HTMLElement>(
          "button, input, textarea, select, a[href], [tabindex]",
        ),
      ].filter(
        (node) => node.tabIndex >= 0 && !node.matches(":disabled") && node.getClientRects().length,
      );
      const active = (this.renderRoot as ShadowRoot).activeElement;
      const first = controls[0] ?? dialog;
      const last = controls[controls.length - 1] ?? dialog;
      if (
        !dialog.contains(active) ||
        active === dialog ||
        (e.shiftKey ? active === first : active === last)
      ) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus({ preventScroll: true });
      }
    }
  };

  private _startTimer(): void {
    this._stopTimer();
    const s = this._config?.refresh_interval ?? 300;
    if (s > 0) this._timer = window.setInterval(this._pollCalendars, s * 1000);
  }
  private _stopTimer(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") || changed.has("_config")) this._restorePreferences();
    if (
      (changed.has("hass") ||
        changed.has("_browserOnline") ||
        changed.has("_config") ||
        changed.has("_view") ||
        changed.has("_weekOffset") ||
        changed.has("_monthOffset")) &&
      this.hass &&
      this._config
    ) {
      this._maybeFetch();
      if (changed.has("hass") || changed.has("_config")) this._maybeFetchWeather();
    }
    if (changed.has("_dialog")) this._manageDialogFocus(changed.get("_dialog") as DialogState);
    this._measureFit();
    this._restoreDayScroll();
    this._maybeScrollToNow();
    if (
      this._layout === "wall" &&
      (this._view === "day" || this._view === "timeline") &&
      (changed.has("_day") ||
        changed.has("_weekOffset") ||
        changed.has("_view") ||
        changed.has("_config"))
    ) {
      this._keepSelectedDayTabVisible();
    }
  }

  /** Keep a newly selected date in view without resetting an intentional strip scroll. */
  private _keepSelectedDayTabVisible(): void {
    const strip = this.renderRoot?.querySelector(".moran-wall-shell > .tabs") as HTMLElement | null;
    const selected = strip?.querySelector(
      "[role='tab'][aria-selected='true']",
    ) as HTMLElement | null;
    if (!strip || !selected) return;
    const stripRect = strip.getBoundingClientRect();
    const selectedRect = selected.getBoundingClientRect();
    const inset = 8;
    if (selectedRect.left < stripRect.left + inset) {
      strip.scrollLeft -= stripRect.left + inset - selectedRect.left;
    } else if (selectedRect.right > stripRect.right - inset) {
      strip.scrollLeft += selectedRect.right - (stripRect.right - inset);
    }
  }

  /**
   * When `fit_height` is on, shrink the day grid so the whole start..end range
   * fits inside the board without scrolling. Only ever scales DOWN from the
   * configured hour height (never blows small days up into giant blocks).
   */
  private _measureFit(): void {
    this._applyFullHeight();
    if (!this._config?.fit_height || this._view !== "day") {
      if (this._fitPx !== 0) this._fitPx = 0;
      return;
    }
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    if (!board) return;
    const header = board.querySelector(".header-row") as HTMLElement | null;
    const allday = board.querySelector(".allday-row") as HTMLElement | null;
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const win = this._dayWindow(day);
    const span = win.endMin - win.startMin;
    if (span <= 0) return;
    const chrome = (header?.offsetHeight ?? 0) + (allday?.offsetHeight ?? 0);
    const avail = board.clientHeight - chrome - 2;
    if (avail <= 0) return;
    const configuredPx =
      Math.min(
        HOUR_HEIGHT_MAX,
        Math.max(HOUR_HEIGHT_MIN, this._config.hour_height ?? DEFAULT_HOUR_HEIGHT),
      ) / 60;
    // shrink to fit, floored at the minimum readable height, capped at configured
    const px = Math.max(HOUR_HEIGHT_MIN / 60, Math.min(configuredPx, avail / span));
    if (Math.abs(px - this._fitPx) > 0.02) this._fitPx = px;
  }

  /**
   * `full_height`: stretch the board down to the bottom of the viewport
   * (wall-tablet / panel view). Applied as inline styles so the default
   * 58vh cap stays for normal dashboards.
   */
  private _applyFullHeight(): void {
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    if (!board) return;
    if (!this._config?.full_height) {
      if (board.style.height) {
        board.style.height = "";
        board.style.maxHeight = "";
      }
      return;
    }
    const top = board.getBoundingClientRect().top + window.scrollY;
    const h = Math.max(200, Math.round(window.innerHeight - top - 16));
    const want = `${h}px`;
    if (board.style.height !== want) {
      board.style.height = want;
      board.style.maxHeight = want;
    }
  }

  /** Scroll the day board so the current time is in view (once per view). */
  private _maybeScrollToNow(): void {
    if (this._dayScrollAnchor) return;
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    if (this._view !== "day" || !this._isRealToday(day)) {
      this._scrollToNowRequested = false;
      return;
    }
    if (this._loading) return;
    if (!this._scrollToNowRequested && this._config?.scroll_to_now === false) return;
    const key = `${this._now().toDateString()}|${day}|${this._pxPerMin}`;
    if (!this._scrollToNowRequested && key === this._scrolledKey) return;
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    const body = board?.querySelector(".body") as HTMLElement | null;
    if (!board || !body || !board.clientHeight) return;
    this._scrollToNowRequested = false;
    const config = this._config;
    if (this._scrollToNowFrame !== undefined) cancelAnimationFrame(this._scrollToNowFrame);
    this._scrollToNowFrame = requestAnimationFrame(() => {
      this._scrollToNowFrame = undefined;
      if (
        !this.isConnected ||
        this._view !== "day" ||
        this._config !== config ||
        (this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0]) !== day ||
        !this._isRealToday(day) ||
        board !== this.renderRoot.querySelector(".board")
      )
        return;
      this._scrolledKey = key;
      const { startMin, endMin } = this._dayWindow(day);
      const now = this._now();
      const minutes = Math.max(startMin, Math.min(endMin, now.getHours() * 60 + now.getMinutes()));
      const sticky = [...board.querySelectorAll<HTMLElement>(".header-row, .allday-row")].reduce(
        (height, row) => height + row.offsetHeight,
        0,
      );
      const bodyTop =
        body.getBoundingClientRect().top - board.getBoundingClientRect().top + board.scrollTop;
      const target =
        bodyTop +
        (minutes - startMin) * this._pxPerMin -
        sticky -
        (board.clientHeight - sticky) / 3;
      board.scrollTo({
        top: Math.max(0, Math.min(board.scrollHeight - board.clientHeight, target)),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  }

  /** Focus the first dialog field on open; restore focus on close. */
  private _manageDialogFocus(prev?: DialogState): void {
    const previouslyFocused = (this.renderRoot as ShadowRoot).activeElement as HTMLElement | null;
    const surface = this.renderRoot.querySelector<HTMLElement>(".moran-wall-shell, ha-card");
    surface?.toggleAttribute("inert", !!this._dialog);
    if (this._dialog && !prev) {
      this._restoreFocus = previouslyFocused ?? undefined;
      requestAnimationFrame(() => {
        if (!this._dialog || !this.isConnected) return;
        const target =
          this.renderRoot.querySelector<HTMLElement>(".dialog input:not(:disabled)") ??
          this.renderRoot.querySelector<HTMLElement>(".dialog .icon");
        target?.focus({ preventScroll: true });
      });
    } else if (!this._dialog && prev) {
      const target = this._restoreFocus?.isConnected
        ? this._restoreFocus
        : (this.renderRoot.querySelector<HTMLElement>(".dayname[tabindex]") ??
          this.renderRoot.querySelector<HTMLElement>('.switch [aria-selected="true"], .nav-now'));
      target?.focus({ preventScroll: true });
      this._restoreFocus = undefined;
    }
  }

  /* ---- data ---------------------------------------------------- */
  private _weekBounds(): { monday: Date; nextMonday: Date } {
    const now = this._now();
    const monday = new Date(now); // "monday" = configured week start
    monday.setHours(0, 0, 0, 0);
    monday.setDate(
      now.getDate() - ((now.getDay() - this._firstDayJs + 7) % 7) + this._weekOffset * 7,
    );
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    return { monday, nextMonday };
  }

  /** Grid geometry for the currently shown month (week-start aware). */
  private _monthGrid(): { gridStart: Date; weeks: number; month: number; year: number } {
    const base = this._now();
    const target = new Date(base.getFullYear(), base.getMonth() + this._monthOffset, 1);
    const offset = (target.getDay() - this._firstDayJs + 7) % 7;
    const gridStart = startOfDay(new Date(target.getFullYear(), target.getMonth(), 1 - offset));
    const daysInMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    const weeks = Math.ceil((offset + daysInMonth) / 7);
    return { gridStart, weeks, month: target.getMonth(), year: target.getFullYear() };
  }

  /** Fetch window for the current view. */
  private _fetchRange(): { start: Date; end: Date } {
    if (this._view === "month") {
      const { gridStart, weeks } = this._monthGrid();
      return { start: gridStart, end: addLocalDays(gridStart, weeks * 7) };
    }
    const { monday, nextMonday } = this._weekBounds();
    return { start: monday, end: nextMonday };
  }

  private _availableCalendars(entityIds: string[]): Set<string> {
    if (!this._browserOnline || this.hass.connected === false) return new Set();
    return new Set(
      entityIds.filter((entityId) => {
        const state = this.hass.states[entityId];
        return state && state.state !== "unavailable" && state.state !== "unknown";
      }),
    );
  }

  private async _maybeFetch(force = false): Promise<void> {
    if (!this.isConnected || !this.hass || !this._config) return;
    const configuredCalendars = [
      ...new Set(this._config.persons.flatMap((p) => this._calsOf(p))),
    ].sort();
    const cals = configuredCalendars.join(",");
    const available = this._availableCalendars(configuredCalendars);
    const availability = configuredCalendars
      .map((calendar) => (available.has(calendar) ? "1" : "0"))
      .join("");
    const routes = this._config.persons
      .map((p) =>
        [
          this._calsOf(p).sort().join("~"),
          p.color ?? "",
          p.match_title_prefixes?.join("~") ?? "",
          p.match_title_contains?.join("~") ?? "",
          p.match_title_regex?.join("~") ?? "",
          p.unmatched ? "u" : "",
          p.strip_title_prefix ? "s" : "",
        ].join(":"),
      )
      .join(",");
    const { start, end } = this._fetchRange();
    const key = `${start.toISOString()}|${end.toISOString()}|${cals}|${availability}|${routes}`;
    if (this._pendingFetch?.key === key) return this._pendingFetch.promise;
    if (!force && key === this._fetchedKey) return;
    this._fetchedKey = key;
    const pending = { key, promise: this._fetchEvents() };
    this._pendingFetch = pending;
    try {
      await pending.promise;
    } finally {
      if (this._pendingFetch === pending) this._pendingFetch = undefined;
    }
  }

  /** Force a refresh on next update (e.g. after a mutation or timer). */
  private async _refetch(): Promise<void> {
    await this._maybeFetch(true);
  }

  /** A write needs a post-write snapshot, not a read already started before it. */
  private async _refreshAfterMutation(): Promise<void> {
    this._pendingFetch = undefined;
    await this._refetch();
  }

  /** Fetch the daily forecast for the configured weather entity (once/day). */
  private async _maybeFetchWeather(): Promise<void> {
    const ent = this._config.weather_entity;
    if (!ent || this._config.show_weather === false || !this.hass.states[ent]) {
      if (Object.keys(this._forecast).length) this._forecast = {};
      this._weatherKey = "";
      return;
    }
    const key = `${ent}|${new Date().toISOString().slice(0, 10)}`;
    if (key === this._weatherKey) return;
    this._weatherKey = key;
    try {
      const res: any = await this.hass.callWS({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "daily" },
        target: { entity_id: ent },
        return_response: true,
      });
      const list: any[] = res?.response?.[ent]?.forecast ?? [];
      const map: Record<string, { temp: number; condition: string }> = {};
      for (const f of list) {
        if (!f?.datetime) continue;
        map[toLocalDate(new Date(f.datetime))] = {
          temp: Math.round(f.temperature),
          condition: f.condition,
        };
      }
      this._forecast = map;
    } catch (e) {
      this._forecast = {};
    }
  }

  /** Small weather chip (icon + temperature) for a given date, or nothing. */
  private _weatherChip(date: Date) {
    const f = this._forecast[toLocalDate(date)];
    if (!f) return nothing;
    const icon = WEATHER_ICON[f.condition] || "weather-cloudy";
    const unit = (this.hass.config as any)?.unit_system?.temperature ?? "°";
    return html`<span class="wx" title=${f.condition}>
      <ha-icon icon="mdi:${icon}"></ha-icon>${f.temp}${unit}
    </span>`;
  }

  /** Whether an event title matches a configured hide pattern (case-insensitive). */
  private _hidden(summary: string): boolean {
    const pats = this._config.hide_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return false;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  /** Allow-list: when set, only events whose title matches a pattern are shown. */
  private _allowed(summary: string): boolean {
    const pats = this._config.show_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return true;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  /** Clean up titles via replace_patterns entries: "search => replacement". */
  private _cleanTitle(summary: string): string {
    const pats = this._config.replace_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return summary;
    let out = summary;
    for (const p of pats) {
      const raw = String(p);
      const idx = raw.indexOf("=>");
      const from = (idx >= 0 ? raw.slice(0, idx) : raw).trim();
      const to = idx >= 0 ? raw.slice(idx + 2).trim() : "";
      if (from.length === 0) continue;
      out = out.split(from).join(to);
    }
    return out.replace(/\s{2,}/g, " ").trim() || summary;
  }

  /** Whether an event title marks it as tentative/provisional (case-insensitive). */
  private _matchesTentative(summary: string): boolean {
    const pats = this._config.tentative_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return false;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  private async _fetchEvents(): Promise<void> {
    const { start, end } = this._fetchRange();
    const key = this._fetchedKey;
    const generation = ++this._fetchGeneration;
    const raws: RawEvent[] = [];
    this._loading = true;
    if (this._dataKey !== key) {
      // A snapshot belongs to its requested range and routing configuration.
      // Never label last week's appointments with the newly selected dates.
      this._raw = [];
      this._events = [];
      this._calendarResults = [];
      this._loadedRange = undefined;
      this._loadError = false;
      this._partialLoad = false;
    }

    const configuredCalendars = [
      ...new Set(this._config.persons.flatMap((person) => this._calsOf(person))),
    ];
    const results = await readCalendarBatch(
      this.hass,
      configuredCalendars,
      this._availableCalendars(configuredCalendars),
      { start, end },
    );
    if (generation !== this._fetchGeneration) return;
    this._calendarResults = results;
    this._dataKey = key;
    this._loadedRange = { start, end };

    for (const result of results) {
      if (result.status !== "ok" && result.status !== "partial") continue;
      const calendar = result.entityId;
      const events = result.events;
      for (const event of events) {
        if (!event || typeof event !== "object") continue;
        // Apply the calendar's alternate-title mapping before lane routing.
        // Institutional feeds often keep the useful subject in description.
        let sourceTitle = event.summary || "Termin";
        const titleField = this._calMeta(calendar).title_field;
        if (titleField) {
          const alternate = (event as Record<string, unknown>)[titleField];
          if (typeof alternate === "string" && alternate.trim()) {
            sourceTitle = alternate.trim();
          }
        }
        if (this._hidden(sourceTitle) || !this._allowed(sourceTitle)) continue;

        const personIndexes = routeEventToPeople(sourceTitle, calendar, this._config.persons);
        for (const personIndex of personIndexes) {
          const person = this._config.persons[personIndex];
          const raw = parseRawEvent(event, personIndex, calendar, personColor(person, personIndex));
          if (!raw) continue;
          if (this._matchesTentative(sourceTitle)) raw.tentative = true;
          raw.summary = this._cleanTitle(displayTitleForRoute(sourceTitle, person));
          raws.push(raw);
        }
      }
    }
    const cleaned = this._config.filter_duplicates ? dedupeRoutedEvents(raws) : raws;
    this._raw = cleaned;
    // Week views index events by weekday; month builds its own grid from _raw.
    const { monday } = this._weekBounds();
    this._events =
      this._view === "month" ? [] : cleaned.flatMap((r) => splitIntoSegments(r, monday));
    const failed = results.some((result) => result.status !== "ok");
    const succeeded = results.some(
      (result) => result.status === "ok" || result.status === "partial",
    );
    this._loadError = failed && !succeeded;
    this._partialLoad = failed && succeeded;
    this._loading = false;
    this._refreshReadOnlyDialog();
  }

  /* ---- capabilities -------------------------------------------- */
  /** A person's calendars, normalized to a (possibly empty) array. */
  private _calsOf(p: PersonConfig): string[] {
    if (Array.isArray(p.calendar)) return p.calendar.filter(Boolean);
    return p.calendar ? [p.calendar] : [];
  }
  /** Calendars of a person that allow creating events. */
  private _writableCals(p: PersonConfig): string[] {
    return this._calsOf(p).filter((c) => this._canCreate(c));
  }
  /** Whether the person's add (+) affordance should be shown. */
  private _personCanCreate(p: PersonConfig): boolean {
    return this._writableCals(p).length > 0;
  }
  private _calFeatures(entity?: string): number {
    if (!entity) return 0;
    const st = this.hass.states[entity];
    return Number(st?.attributes?.supported_features ?? 0);
  }
  private _canCreate(entity?: string) {
    return !this._config.read_only && (this._calFeatures(entity) & FEAT_CREATE) !== 0;
  }
  private _canUpdate(entity?: string) {
    return !this._config.read_only && (this._calFeatures(entity) & FEAT_UPDATE) !== 0;
  }
  private _canDelete(entity?: string) {
    return !this._config.read_only && (this._calFeatures(entity) & FEAT_DELETE) !== 0;
  }

  /* ---- helpers ------------------------------------------------- */
  private get _persons(): PersonConfig[] {
    return this._config.persons;
  }
  private get _grid(): number {
    return this._config.time_grid ?? 30;
  }
  /** Pixels per minute, derived from the configurable hour height (or fit mode). */
  private get _pxPerMin(): number {
    if (this._config.fit_height && this._fitPx > 0) return this._fitPx;
    const h = Math.min(
      HOUR_HEIGHT_MAX,
      Math.max(HOUR_HEIGHT_MIN, this._config.hour_height ?? DEFAULT_HOUR_HEIGHT),
    );
    return h / 60;
  }
  private get _startMin(): number {
    return (this._config.start_hour ?? 6) * 60;
  }
  private get _endMin(): number {
    return (this._config.end_hour ?? 22) * 60;
  }
  /**
   * Visible minute window of the day view. With `trim_hours` (default on) the
   * configured start/end window is shrunk to the hours that actually contain
   * events, so the occupied part of the day gets the full height instead of
   * being squeezed by empty morning/evening hours.
   */
  private _dayWindow(day: number): { startMin: number; endMin: number } {
    const cfgStart = this._startMin;
    const cfgEnd = this._endMin;
    if (this._config.trim_hours === false) return { startMin: cfgStart, endMin: cfgEnd };
    const evs = this._events.filter((e) => e.day === day && !e.allDay);
    if (evs.length === 0) return { startMin: cfgStart, endMin: cfgEnd };
    let first = Math.min(...evs.map((e) => e.startMin));
    let last = Math.max(...evs.map((e) => e.endMin));
    // keep the now-line visible on today
    if (this._isRealToday(day)) {
      const now = this._now();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      if (nowMin >= cfgStart && nowMin <= cfgEnd) {
        first = Math.min(first, nowMin);
        last = Math.max(last, nowMin);
      }
    }
    let s = Math.max(cfgStart, Math.floor(first / 60) * 60);
    let e = Math.min(cfgEnd, Math.ceil(last / 60) * 60);
    // never shrink below a sane 6-hour window
    const MIN_WINDOW = 6 * 60;
    if (e - s < MIN_WINDOW) {
      e = Math.min(cfgEnd, s + MIN_WINDOW);
      s = Math.max(cfgStart, e - MIN_WINDOW);
    }
    return { startMin: s, endMin: e };
  }
  /** Column index (0..6 from week start) -> JS weekday (0=Sun..6=Sat). */
  private _jsDay(index: number): number {
    return (this._firstDayJs + index) % 7;
  }
  private get _visibleDays(): number[] {
    const all = [0, 1, 2, 3, 4, 5, 6];
    if (this._config.show_weekends === false) {
      return all.filter((i) => {
        const js = this._jsDay(i);
        return js !== 0 && js !== 6; // hide Sat/Sun wherever they fall
      });
    }
    return all;
  }
  private _t(key: string): string {
    return localize(this.hass, key);
  }
  /** Optional per-calendar color/label from the `calendars:` mapping. */
  private _calMeta(entity?: string): {
    color?: string;
    label?: string;
    icon?: string;
    title_field?: string;
  } {
    return (entity && this._config.calendars?.[entity]) || {};
  }
  /** Link for a location, honouring the configurable `map_url` template. */
  private _mapUrl(location: string): string {
    const tpl = this._config.map_url;
    const q = encodeURIComponent(location);
    if (typeof tpl === "string" && tpl.includes("{location}")) return tpl.replace("{location}", q);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }
  /** Optional mdi icon configured for a calendar. */
  private _calIcon(entity?: string): string | undefined {
    return this._calMeta(entity).icon;
  }
  /** Small inline icon element for an event's calendar (or nothing). */
  private _calIconEl(e: BoardEvent) {
    const icon = this._calIcon(e.ref.calendar);
    return icon ? html`<ha-icon class="cicon" .icon=${icon}></ha-icon>` : nothing;
  }
  /** Display name of a calendar entity: mapping label > friendly name > id. */
  private _calLabel(entity: string): string {
    return (
      this._calMeta(entity).label ??
      ((this.hass.states[entity]?.attributes?.friendly_name as string | undefined) || entity)
    );
  }
  /** Color for an event respecting the color_by option. */
  private _eventColor(e: BoardEvent): string {
    const by = this._config.color_by;
    if (by === "location" && e.location) return hashColor(e.location);
    if (by === "calendar" && e.ref.calendar)
      return this._calMeta(e.ref.calendar).color ?? hashColor(e.ref.calendar);
    return e.color;
  }
  /** Whether an event has already ended (for dimming). */
  private _isPast(e: BoardEvent): boolean {
    return this._config.dim_past !== false && e.ref.end.getTime() <= this._now().getTime();
  }
  /** Localized "Today"/"Tomorrow"/"Yesterday" for a date, else null. */
  private _relativeDay(date: Date): string | null {
    const diff = localDayDifference(date, this._now());
    if (diff === 0) return this._t("today");
    if (diff === 1) return this._t("tomorrow");
    if (diff === -1) return this._t("yesterday");
    return null;
  }
  /** Person temporarily hidden via header click (legend-style toggle). */
  private _isOff(idx: number): boolean {
    return this._hiddenP.includes(idx);
  }
  private _togglePerson(idx: number): void {
    // Collapsing a focused sticky header can make WebKit scroll it back to its
    // original flow position. Preserve clock time across the resulting layout.
    this._rememberDayScroll(this._dateForDay(this._shownDay()));
    this._hiddenP = this._isOff(idx)
      ? this._hiddenP.filter((i) => i !== idx)
      : [...this._hiddenP, idx];
    this._savePreferences();
  }
  private _timedFor(day: number, idx: number): LaidOutEvent[] {
    if (this._isOff(idx)) return [];
    const evs = this._events.filter(
      (e) => e.day === day && e.personIdx === idx && !e.allDay && !this._isBackground(e),
    );
    return layoutDayColumns(evs);
  }
  /** Threshold (minutes) at/above which a timed event becomes a background band. */
  private _bgMinMin(): number {
    const h = Number(this._config.background_hours ?? 3);
    if (!Number.isFinite(h) || h <= 0) return 0; // 0 disables background bands
    return h * 60;
  }
  /** Long, day-spanning events (e.g. OGS/Freispiel) shown as a faint full-width band. */
  private _isBackground(e: BoardEvent): boolean {
    const min = this._bgMinMin();
    return min > 0 && !e.allDay && e.endMin - e.startMin >= min;
  }
  /** Background-band segments for a person/day, longest first (so they stack cleanly). */
  private _bgFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx && !e.allDay && this._isBackground(e))
      .sort((a, b) => b.endMin - b.startMin - (a.endMin - a.startMin));
  }
  /** Max side-by-side columns before dense overlaps collapse into a "+N" chip. */
  private _maxCols(): number {
    const n = Number(this._config.max_columns);
    if (!Number.isFinite(n) || n < 1) return 3;
    return Math.min(Math.round(n), 8);
  }
  /**
   * Cap the per-day overlap columns so events stay readable. Clusters with more
   * columns than `max_columns` keep the first columns and collapse the rest into
   * one "+N" overflow chip in the last column.
   */
  private _dayLayout(day: number, idx: number): { events: LaidOutEvent[]; overflows: Overflow[] } {
    const laid = this._timedFor(day, idx);
    const maxCols = this._maxCols();
    const byCluster = new Map<number, LaidOutEvent[]>();
    for (const e of laid) {
      const g = byCluster.get(e.cluster);
      if (g) g.push(e);
      else byCluster.set(e.cluster, [e]);
    }
    const events: LaidOutEvent[] = [];
    const overflows: Overflow[] = [];
    for (const group of byCluster.values()) {
      const trueCols = group[0].cols;
      if (trueCols <= maxCols) {
        events.push(...group);
        continue;
      }
      // Keep columns 0..maxCols-2, reserve the last column for the overflow chip.
      let count = 0;
      let startMin = Infinity;
      let endMin = -Infinity;
      for (const e of group) {
        if (e.col <= maxCols - 2) {
          events.push({
            ...e,
            cols: maxCols,
            span: Math.max(1, Math.min(e.span, maxCols - e.col)),
          });
        } else {
          count++;
          startMin = Math.min(startMin, e.startMin);
          endMin = Math.max(endMin, e.endMin);
        }
      }
      if (count > 0) {
        overflows.push({ col: maxCols - 1, cols: maxCols, startMin, endMin, count });
      }
    }
    return { events, overflows };
  }
  /** Display title, with "(day X/Y)" suffix for multi-day events. */
  private _evTitle(e: BoardEvent): string {
    const base = e.parts && e.parts > 1 ? `${e.title} (${e.part}/${e.parts})` : e.title;
    const icon = this._autoIcon(e.title);
    return icon ? `${icon} ${base}` : base;
  }

  /** Emoji for a title via custom rules then the built-in keyword map. */
  private _autoIcon(title: string): string {
    if (this._config.auto_icons !== true) return "";
    if (!title || HAS_EMOJI.test(title)) return "";
    const custom = this._config.icon_patterns;
    if (Array.isArray(custom)) {
      const low = title.toLowerCase();
      for (const p of custom) {
        const raw = String(p);
        const i = raw.indexOf("=>");
        if (i < 0) continue;
        const key = raw.slice(0, i).trim().toLowerCase();
        const emoji = raw.slice(i + 2).trim();
        if (key && emoji && low.includes(key)) return emoji;
      }
    }
    for (const [re, emoji] of ICON_MAP) if (re.test(title)) return emoji;
    return "";
  }

  /** Whether an event is flagged tentative/provisional. */
  private _isTentative(e: BoardEvent): boolean {
    return e.ref.tentative === true;
  }
  /** Jump to the agenda list for a given weekday so collapsed events stay reachable. */
  private _showDayAgenda(day: number): void {
    this._day = day;
    this._selectView("agenda");
  }
  /** Jump from the week view into the day view of a given weekday. */
  private _openDayView(day: number): void {
    this._day = day;
    this._selectView("day");
  }
  private _allDayFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events.filter((e) => e.day === day && e.personIdx === idx && e.allDay);
  }
  private _eventsFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx)
      .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin);
  }
  /** Week-start-based column index -> absolute Date in the shown week. */
  private _dateForDay(day: number): Date {
    const { monday } = this._weekBounds();
    return addLocalDays(monday, day);
  }
  private _isRealToday(day: number): boolean {
    return this._weekOffset === 0 && day === this._todayIndex();
  }
  /** Open an item on Enter/Space for keyboard users. */
  private _onItemKey(e: KeyboardEvent, ev: BoardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      this._openEvent(ev);
    }
  }
  private _dayHasEvents(day: number): boolean {
    return this._persons.some((_, i) => this._eventsFor(day, i).length > 0);
  }
  private _personName(p: PersonConfig, idx: number): string {
    return (
      p.name || this.hass.states[p.person ?? ""]?.attributes?.friendly_name || `Person ${idx + 1}`
    );
  }
  private _avatar(p: PersonConfig, idx: number) {
    const color = personColor(p, idx);
    const st = p.person ? this.hass.states[p.person] : undefined;
    const pic = st?.attributes?.entity_picture as string | undefined;
    const name = this._personName(p, idx);
    const initials = name.slice(0, 2).toUpperCase();
    return pic
      ? html`<div
          class="avatar"
          style="background-image:url('${pic}');box-shadow:0 0 0 2px ${color}55"
        ></div>`
      : html`<div class="avatar initials" style="background:${color}">${initials}</div>`;
  }

  /** Small entity chips (battery, sensors …) under a person header. */
  private _badges(p: PersonConfig) {
    const ids = Array.isArray(p.badges) ? p.badges.filter(Boolean) : [];
    if (ids.length === 0) return nothing;
    return html`<div class="pbadges">
      ${ids.map((id) => {
        const st = this.hass.states[id];
        if (!st) return nothing;
        const icon = st.attributes?.icon as string | undefined;
        const unit = (st.attributes?.unit_of_measurement as string | undefined) ?? "";
        return html`<span
          class="pbadge"
          title=${(st.attributes?.friendly_name as string | undefined) ?? id}
          role="button"
          tabindex="0"
          @click=${(ev: MouseEvent) => {
            ev.stopPropagation();
            this._moreInfo(id);
          }}
          @keydown=${(k: KeyboardEvent) => {
            if (k.key === "Enter" || k.key === " ") {
              k.preventDefault();
              k.stopPropagation();
              this._moreInfo(id);
            }
          }}
        >
          ${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : nothing}
          <span>${st.state}${unit}</span>
        </span>`;
      })}
    </div>`;
  }

  /** Open the standard HA more-info dialog for an entity. */
  private _moreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
    );
  }

  private _prevWeek = () => {
    this._weekOffset -= 1;
  };
  private _nextWeek = () => {
    this._weekOffset += 1;
  };
  private _thisWeek = () => {
    this._cancelDayScroll();
    this._weekOffset = 0;
    this._day = this._todayIndex();
    if (this._layout === "wall" && this._view === "day") {
      this._scrollToNowRequested = true;
      this.requestUpdate();
    }
  };
  private _prevMonth = () => {
    this._monthOffset -= 1;
  };
  private _nextMonth = () => {
    this._monthOffset += 1;
  };
  private _thisMonth = () => {
    this._monthOffset = 0;
  };

  private _shownDay(): number {
    return this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
  }

  private _cancelDayScroll = (): void => {
    this._dayScrollAnchor = undefined;
    if (this._dayScrollFrame !== undefined) cancelAnimationFrame(this._dayScrollFrame);
    this._dayScrollFrame = undefined;
  };

  /** Keep a clock-time anchor, not a raw pixel offset: all-day rows and trimmed hours vary. */
  private _rememberDayScroll(date: Date): void {
    if (this._dayScrollFrame !== undefined) cancelAnimationFrame(this._dayScrollFrame);
    this._dayScrollFrame = undefined;
    const board = this.renderRoot.querySelector<HTMLElement>(".board");
    const body = board?.querySelector<HTMLElement>(".body");
    if (board && body && this._layout === "wall" && this._view === "day") {
      const sticky = [...board.querySelectorAll<HTMLElement>(".header-row, .allday-row")].reduce(
        (sum, row) => sum + row.offsetHeight,
        0,
      );
      // Stop an in-flight Today animation before remembering the actual visible time.
      board.scrollTo({ top: board.scrollTop, behavior: "instant" });
      const minute =
        this._dayWindow(this._shownDay()).startMin +
        (board.getBoundingClientRect().top + sticky - body.getBoundingClientRect().top) /
          this._pxPerMin;
      this._dayScrollAnchor = {
        minute: this._dayScrollAnchor?.minute ?? minute,
        left: this._dayScrollAnchor?.left ?? board.scrollLeft,
        date: startOfDay(date).getTime(),
      };
      this._scrollToNowRequested = false;
      if (this._scrollToNowFrame !== undefined) cancelAnimationFrame(this._scrollToNowFrame);
      this._scrollToNowFrame = undefined;
    }
  }

  private _navigateDay(date: Date): void {
    if (date.getTime() === this._dateForDay(this._day).getTime()) return;
    this._rememberDayScroll(date);
    this._goToDate(date);
  }

  private _stepDay(direction: -1 | 1): void {
    this._navigateDay(
      adjacentVisibleDate(
        this._dateForDay(this._shownDay()),
        direction,
        this._config.show_weekends !== false,
      ),
    );
  }

  private _restoreDayScroll(): void {
    const anchor = this._dayScrollAnchor;
    if (!anchor) return;
    if (this._view !== "day" || this._dateForDay(this._shownDay()).getTime() !== anchor.date) {
      this._cancelDayScroll();
      return;
    }
    if (this._loading || this._dayScrollFrame !== undefined) return;
    this._dayScrollFrame = requestAnimationFrame(() => {
      this._dayScrollFrame = undefined;
      if (
        this._dayScrollAnchor !== anchor ||
        this._loading ||
        !this.isConnected ||
        this._view !== "day" ||
        this._dateForDay(this._shownDay()).getTime() !== anchor.date
      )
        return;
      const board = this.renderRoot.querySelector<HTMLElement>(".board");
      const body = board?.querySelector<HTMLElement>(".body");
      if (!board || !body) return;
      const sticky = [...board.querySelectorAll<HTMLElement>(".header-row, .allday-row")].reduce(
        (sum, row) => sum + row.offsetHeight,
        0,
      );
      const bodyTop =
        body.getBoundingClientRect().top - board.getBoundingClientRect().top + board.scrollTop;
      const { startMin } = this._dayWindow(this._shownDay());
      board.scrollTo({
        top: Math.max(0, bodyTop + (anchor.minute - startMin) * this._pxPerMin - sticky),
        left: anchor.left,
        behavior: "instant",
      });
      this._scrolledKey = `${this._now().toDateString()}|${this._shownDay()}|${this._pxPerMin}`;
      this._dayScrollAnchor = undefined;
    });
  }

  private _onDaySwipeStart = (ev: PointerEvent): void => {
    if (!ev.isPrimary) {
      this._daySwipe = undefined;
      return;
    }
    if (this._layout !== "wall" || ev.button !== 0) return;
    if ((ev.target as Element).closest("button")) return;
    this._daySwipe = {
      pointerId: ev.pointerId,
      x: ev.clientX,
      y: ev.clientY,
      date: this._dateForDay(this._shownDay()).getTime(),
    };
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  };

  private _onDaySwipeEnd = (ev: PointerEvent): void => {
    const swipe = this._daySwipe;
    this._daySwipe = undefined;
    if (!swipe || ev.pointerId !== swipe.pointerId) return;
    if (swipe.date !== this._dateForDay(this._shownDay()).getTime()) return;
    const step = daySwipeStep(ev.clientX - swipe.x, ev.clientY - swipe.y);
    if (step) this._stepDay(step);
  };

  private _onDaySwipeCancel = (): void => {
    this._daySwipe = undefined;
  };

  private _onDayHeadingKey = (ev: KeyboardEvent): void => {
    if (this._layout !== "wall" || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    ev.preventDefault();
    ev.stopPropagation();
    this._stepDay(ev.key === "ArrowLeft" ? -1 : 1);
  };
  /** Jump to the day view for a specific date (from the month grid). */
  private _goToDate(date: Date): void {
    const today = startOfDay(this._now());
    const toWeekStart = (d: Date) => {
      const s = startOfDay(d);
      s.setDate(s.getDate() - ((s.getDay() - this._firstDayJs + 7) % 7));
      return s;
    };
    const weeks = localDayDifference(toWeekStart(date), toWeekStart(today)) / 7;
    this._weekOffset = weeks;
    this._day = (date.getDay() - this._firstDayJs + 7) % 7;
    this._selectView("day");
  }

  /* ---- render -------------------------------------------------- */
  protected render() {
    if (!this._config || !this.hass) return nothing;
    const viewNavigation = this._renderViewSwitcher();
    const focus = this._config.show_focus ? this._renderFocus() : nothing;
    const content = html`${this._renderCalendarStatus()}${this._renderActiveView()}`;
    const surface =
      this._layout === "wall"
        ? renderWallShell({
            title: this._config.title ?? this._t("wall_board_title"),
            calendarIdentity: this._t("wall_calendar_identity"),
            viewNavigation,
            focus,
            content,
          })
        : html`
            <ha-card>
              <div class="top">
                <div class="title">${this._config.title ?? this._t("board_title")}</div>
                ${viewNavigation}
              </div>
              ${focus} ${content}
            </ha-card>
          `;
    return html`${surface} ${this._dialog ? this._renderDialog() : nothing}`;
  }

  private _renderViewSwitcher() {
    return this._enabledViews.length > 1
      ? html`<div class="switch" role="tablist">
          ${this._enabledViews.map(
            (view) =>
              html`<button
                role="tab"
                aria-selected=${this._view === view}
                class=${this._view === view ? "on" : ""}
                @click=${() => this._selectView(view)}
              >
                ${this._t(view)}
              </button>`,
          )}
        </div>`
      : nothing;
  }

  private _renderActiveView() {
    return this._view === "day"
      ? this._renderDay()
      : this._view === "timeline"
        ? this._renderTimeline()
        : this._view === "week"
          ? this._renderWeek()
          : this._view === "month"
            ? this._renderMonth()
            : this._renderAgenda();
  }

  private _renderCalendarStatus() {
    if (this._loading) {
      return html`<div class="calendar-status" role="status">
        <span class="spinner"></span>
        <span>${this._t(this._loadedRange ? "refreshing_calendars" : "loading_calendars")}</span>
      </div>`;
    }
    if (!this._loadError && !this._partialLoad) return nothing;
    const message = this._calendarResults.some((result) => result.status === "partial")
      ? "incomplete_events"
      : this._partialLoad
        ? "partial_load"
        : "load_error";
    return html`<div class="calendar-status banner" role="status">
      <span class="status-message">${this._t(message)}</span>
      <button class="retry" @click=${this._refetch}>${this._t("retry")}</button>
    </div>`;
  }

  private _loadedRangeCoversNow(): boolean {
    const now = this._now().getTime();
    return (
      !!this._loadedRange &&
      this._loadedRange.start.getTime() <= now &&
      now < this._loadedRange.end.getTime()
    );
  }

  /** Current + next timed event at clock time, within the active view's loaded range. */
  private _focusFor(idx: number): { current?: RawEvent; next?: RawEvent } {
    if (this._loading || !this._loadedRangeCoversNow()) return {};
    return selectTimedActivity(this._raw, idx, this._now());
  }

  /** A "free" claim is only trustworthy when all lane sources cover now. */
  private _focusComplete(idx: number): boolean {
    const calendars = this._calsOf(this._persons[idx]);
    return (
      !this._loading &&
      calendars.length > 0 &&
      this._loadedRangeCoversNow() &&
      calendars.every(
        (calendar) =>
          this._calendarResults.find((result) => result.entityId === calendar)?.status === "ok",
      )
    );
  }

  /** Status tiles — one tile per visible person. Legacy keeps current-or-next behavior. */
  private _renderFocus() {
    return html`
      <div class="focus">
        ${this._persons.map((p, i) => {
          if (this._isOff(i)) return nothing;
          const { current, next } = this._focusFor(i);
          const complete = this._focusComplete(i);
          const c = personColor(p, i);
          const icon = (r: RawEvent) => (this._config.auto_icons ? this._autoIcon(r.summary) : "");
          return html`
            <div class="fchip" title=${this._personName(p, i)}>
              ${this._avatar(p, i)}
              <div class="fbody">
                ${this._layout === "wall"
                  ? html`
                      <div class="fheading">
                        <span class="fname">${this._personName(p, i)}</span>
                        <span class="fseparator" aria-hidden="true">·</span>
                        <span class="ffree"
                          >${this._t(
                            current
                              ? "status_busy_now"
                              : complete
                                ? "status_free_now"
                                : "focus_unavailable",
                          )}</span
                        >
                      </div>
                      ${current
                        ? html`<span class="fnow" title=${current.summary}>
                            <span class="fsummary"
                              >${this._t("status_now")}: ${icon(current)} ${current.summary}</span
                            >
                            <small
                              >${this._t("focus_until")}
                              ${formatStatusDateTime(this.hass, current.end, this._now())}</small
                            >
                          </span>`
                        : nothing}
                      ${next
                        ? html`<span class="fnext" title=${next.summary}>
                            <span class="fsummary"
                              >${this._t("status_next")}: ${icon(next)} ${next.summary}</span
                            >
                            <small
                              >${formatStatusDateTime(this.hass, next.start, this._now())}</small
                            >
                          </span>`
                        : nothing}
                    `
                  : html` <span class="fname">${this._personName(p, i)}</span>
                      ${current
                        ? html`<span class="fnow">
                            <span class="fdot" style="background:${c}"></span>${icon(current)}
                            ${current.summary}
                            <small
                              >${this._t("focus_until")}
                              ${formatTime(this.hass, current.end)}</small
                            >
                          </span>`
                        : next
                          ? html`<span class="fnext">
                              ${this._t("focus_next")}: ${icon(next)} ${next.summary}
                              <small>${formatCountdown(this.hass, next.start, this._now())}</small>
                            </span>`
                          : html`<span class="ffree">
                              ${this._t(complete ? "focus_free" : "focus_unavailable")}
                            </span>`}`}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _weekNav(showTodayAction = false) {
    const { monday } = this._weekBounds();
    const dayPaging = showTodayAction && this._view === "day";
    return html`
      <div class="weeknav">
        <button
          class="nav"
          aria-label=${this._t(dayPaging ? "prev_day" : "prev_week")}
          @click=${dayPaging ? () => this._stepDay(-1) : this._prevWeek}
        >
          ‹
        </button>
        <button
          class="nav-now"
          aria-label=${showTodayAction ? this._t("show_today") : nothing}
          @click=${this._thisWeek}
        >
          ${showTodayAction ? this._t("today") : formatWeekRange(this.hass, monday)}
        </button>
        <button
          class="nav"
          aria-label=${this._t(dayPaging ? "next_day" : "next_week")}
          @click=${dayPaging ? () => this._stepDay(1) : this._nextWeek}
        >
          ›
        </button>
      </div>
    `;
  }

  private _renderDayTabs() {
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const wall = this._layout === "wall";
    return html`
      <div class="tabs" role="tablist">
        ${this._visibleDays.map((d) => {
          const date = this._dateForDay(d);
          return html`
            <button
              role="tab"
              aria-selected=${d === this._day}
              aria-label=${wall ? `${full[d]}, ${formatShortDate(this.hass, date)}` : nothing}
              aria-current=${wall && this._isRealToday(d) ? "date" : nothing}
              class="${d === this._day ? "on" : ""} ${this._isRealToday(d) ? "today" : ""}"
              @click=${() => {
                if (wall && this._view === "day") this._navigateDay(date);
                else this._day = d;
              }}
            >
              ${wall
                ? html`<span class="wall-day-weekday">${short[d]}</span>
                    <span class="wall-day-number">${date.getDate()}</span>`
                : short[d]}
            </button>
          `;
        })}
      </div>
    `;
  }

  private _renderDay() {
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const px = this._pxPerMin;
    const hourPx = 60 * px;
    const { startMin, endMin } = this._dayWindow(day);
    const height = (endMin - startMin) * px;
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const selectedDate = this._dateForDay(day);
    const dayLabel = this._relativeDay(selectedDate) ?? full[day];

    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);

    const now = this._now();
    const nowMin = Math.max(startMin, Math.min(endMin, now.getHours() * 60 + now.getMinutes()));
    const showNow = this._config.show_now_line !== false && this._isRealToday(day);
    const hasAllDay = this._persons.some((_, i) => this._allDayFor(day, i).length > 0);
    const hiddenLanes = this._persons.filter((_, i) => this._isOff(i)).length;

    return html`
      <div
        class="dayhead"
        @pointerdown=${this._onDaySwipeStart}
        @pointerup=${this._onDaySwipeEnd}
        @pointercancel=${this._onDaySwipeCancel}
        @lostpointercapture=${this._onDaySwipeCancel}
      >
        <span
          class="dayname"
          tabindex=${this._layout === "wall" ? "0" : nothing}
          role=${this._layout === "wall" ? "group" : nothing}
          aria-live=${this._layout === "wall" ? "polite" : nothing}
          aria-atomic=${this._layout === "wall" ? "true" : nothing}
          title=${this._layout === "wall" ? this._t("day_navigation_hint") : nothing}
          aria-description=${this._layout === "wall" ? this._t("day_navigation_hint") : nothing}
          @keydown=${this._onDayHeadingKey}
        >
          ${this._layout === "wall"
            ? `${dayLabel}: ${formatShortDate(this.hass, selectedDate)}`
            : dayLabel}
          ${this._weatherChip(selectedDate)}${this._loading && this._raw.length === 0
            ? html`<span class="spinner"></span>`
            : nothing}
        </span>
        ${this._weekNav(this._layout === "wall")}
      </div>
      ${this._renderDayTabs()}
      <div
        class="board ${this._layout === "wall" ? "wall-pan-board" : ""}"
        style="--fb-wall-visible-lanes:${this._persons.length -
        hiddenLanes};--fb-wall-hidden-lanes:${hiddenLanes}"
        @pointerdown=${this._onWallBoardPointerDown}
        @pointermove=${this._onWallBoardPointerMove}
        @pointerup=${this._onWallBoardPointerUp}
        @pointercancel=${this._onWallBoardPointerCancel}
        @wheel=${this._cancelDayScroll}
        @touchstart=${this._cancelDayScroll}
      >
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((p, i) => {
            const stateObj = p.person ? this.hass.states[p.person] : undefined;
            const off = this._isOff(i);
            return html`
              <div
                class="phead ${off ? "off" : ""}"
                role="button"
                tabindex="0"
                title=${this._personName(p, i)}
                @click=${() => this._togglePerson(i)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._togglePerson(i);
                  }
                }}
              >
                ${this._avatar(p, i)}
                ${off
                  ? nothing
                  : html`<div class="pname">${this._personName(p, i)}</div>
                      <div class="pstatus">
                        ${stateObj ? this._statusLabel(stateObj.state) : ""}
                      </div>
                      ${this._badges(p)}`}
              </div>
            `;
          })}
        </div>
        ${hasAllDay
          ? html`
              <div class="allday-row">
                <div class="axis-spacer allday-label">${this._t("all_day")}</div>
                ${this._persons.map(
                  (p, i) => html`
                    <div class="allday-cell ${this._isOff(i) ? "off" : ""}">
                      ${this._allDayFor(day, i).map((e) => {
                        const c = this._eventColor(e);
                        const tent = this._isTentative(e);
                        return html`
                          <div
                            class="adchip ${tent ? "tentative" : ""}"
                            style="border-left:3px ${tent
                              ? "dashed"
                              : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                            title="${this._evTitle(e)}"
                            tabindex="0"
                            role="button"
                            @click=${() => this._openEvent(e)}
                            @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                          >
                            ${e.continuesBefore ? "« " : ""}${this._evTitle(e)}${e.continuesAfter
                              ? " »"
                              : ""}
                          </div>
                        `;
                      })}
                    </div>
                  `,
                )}
              </div>
            `
          : nothing}
        <div class="body" style="height:${height}px">
          <div class="axis">
            ${hours.map(
              (h) =>
                html`<div class="hour" style="top:${(h * 60 - startMin) * px}px">
                  ${this._layout === "wall" ? formatHourLabel(this.hass, h) : `${pad(h)}:00`}
                </div>`,
            )}
          </div>
          ${this._persons.map((p, i) => {
            const canCreate = this._personCanCreate(p);
            const layout = this._dayLayout(day, i);
            return html`
              <div
                class="col ${canCreate ? "creatable" : ""} ${this._isOff(i) ? "off" : ""}"
                @click=${(ev: MouseEvent) => this._onColClick(ev, i, day, px, startMin)}
                style="background-image:
                  repeating-linear-gradient(var(--fb-row-shade) 0 ${hourPx}px, transparent ${hourPx}px ${2 *
                hourPx}px),
                  repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
                2}px),
                  repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px)"
              >
                ${this._bgFor(day, i)
                  .filter((e) => e.endMin > startMin && e.startMin < endMin)
                  .map((e, bi) => {
                    const top = (e.startMin - startMin) * px;
                    const h = Math.max((e.endMin - e.startMin) * px - 3, 16);
                    const c = this._eventColor(e);
                    const tent = this._isTentative(e);
                    return html`
                      <div
                        class="band ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                        tabindex="0"
                        role="button"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          this._openEvent(e);
                        }}
                        @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                        style="top:${top + 1.5}px;height:${h}px;
                               border:1.5px dashed ${c}55;
                               background:${c}0d;
                               background:repeating-linear-gradient(45deg,
                                 color-mix(in srgb, ${c} 8%, transparent) 0 8px,
                                 transparent 8px 16px)"
                        title="${this._evTitle(e)} · ${formatMinutes(
                          this.hass,
                          e.startMin,
                        )}–${formatMinutes(this.hass, e.endMin)}"
                      >
                        <span
                          class="etitle"
                          style="margin-top:${bi * 19}px;
                                 background:${c}26;
                                 background:color-mix(in srgb, ${c} 16%, var(--card-background-color, #fff))"
                          >${e.continuesBefore ? "« " : ""}${this._evTitle(e)}${e.continuesAfter
                            ? " »"
                            : ""}</span
                        >
                      </div>
                    `;
                  })}
                ${(() => {
                  // consecutive full-width mini events sit at min block height;
                  // nudge each one below the previous strip so labels never stack
                  let lastSlimBottom = -Infinity;
                  return layout.events
                    .filter((e) => e.endMin > startMin && e.startMin < endMin)
                    .map((e) => {
                      // live preview while dragging this event (in minute space)
                      const dragging = this._drag?.raw === e.ref;
                      let sMin = e.startMin;
                      let eMin = e.endMin;
                      if (dragging && this._drag) {
                        const g = this._dragGrid;
                        if (this._drag.mode === "move") {
                          const ns = Math.round((e.startMin + this._drag.deltaMin) / g) * g;
                          eMin = e.endMin + (ns - e.startMin);
                          sMin = ns;
                        } else {
                          let dur =
                            Math.round((e.endMin - e.startMin + this._drag.deltaMin) / g) * g;
                          if (dur < g) dur = g;
                          eMin = e.startMin + dur;
                        }
                      }
                      let top = (sMin - startMin) * px;
                      const h = Math.max((eMin - sMin) * px - 3, 16);
                      const c = this._eventColor(e);
                      const leftPct = (e.col / e.cols) * 100;
                      const widthPct = ((e.span ?? 1) / e.cols) * 100;
                      const tent = this._isTentative(e);
                      const slim = h < 24; // very short events: single-line strip on top
                      const wallShort = this._layout === "wall" && h < 56 && !slim;
                      const canDrag = this._draggable(e);
                      if (slim && e.cols === 1 && !dragging) {
                        top = Math.max(top, lastSlimBottom + 1);
                        lastSlimBottom = top + h;
                      }
                      return html`
                        <div
                          class="event ${this._isPast(e) ? "past" : ""} ${tent
                            ? "tentative"
                            : ""} ${slim ? "slim" : ""} ${wallShort ? "wall-short" : ""} ${canDrag
                            ? "draggable"
                            : ""} ${dragging ? "dragging" : ""}"
                          tabindex="0"
                          role="button"
                          @pointerdown=${(ev: PointerEvent) =>
                            this._onEventPointerDown(ev, e, "move")}
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            if (this._suppressClick) {
                              this._suppressClick = false;
                              return;
                            }
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                          style="top:${top + 1.5}px;height:${h}px;
                               left:calc(${leftPct}% + 2px);width:calc(${widthPct}% - 4px);
                               border-left:3px ${tent ? "dashed" : "solid"} ${c};
                               background:${c}40;
                               background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)} · ${formatMinutes(
                            this.hass,
                            e.startMin,
                          )}–${formatMinutes(this.hass, e.endMin)}"
                        >
                          <span class="etitle"
                            >${this._calIconEl(e)}${e.continuesBefore ? "« " : ""}${this._evTitle(
                              e,
                            )}</span
                          >
                          ${h > 32 || dragging
                            ? html`<span class="etime"
                                >${formatMinutes(this.hass, sMin)}–${formatMinutes(
                                  this.hass,
                                  eMin,
                                )}</span
                              >`
                            : nothing}
                          ${this._progressOn && this._isCurrent(e) && !dragging
                            ? html`<div class="eprog">
                                <div style="width:${this._progressPct(e)}%"></div>
                              </div>`
                            : nothing}
                          ${canDrag && !slim
                            ? html`<div
                                class="rz"
                                @pointerdown=${(ev: PointerEvent) =>
                                  this._onEventPointerDown(ev, e, "resize")}
                              ></div>`
                            : nothing}
                        </div>
                      `;
                    });
                })()}
                ${layout.overflows
                  .filter((o) => o.endMin > startMin && o.startMin < endMin)
                  .map((o) => {
                    const top = (o.startMin - startMin) * px;
                    const h = Math.max((o.endMin - o.startMin) * px - 3, 16);
                    const leftPct = (o.col / o.cols) * 100;
                    const widthPct = 100 / o.cols;
                    return html`
                      <div
                        class="event overflow"
                        tabindex="0"
                        role="button"
                        title="${o.count} ${this._t("more_events")}"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          this._showDayAgenda(day);
                        }}
                        @keydown=${(k: KeyboardEvent) => {
                          if (k.key === "Enter" || k.key === " ") {
                            k.preventDefault();
                            this._showDayAgenda(day);
                          }
                        }}
                        style="top:${top + 1.5}px;height:${h}px;
                               left:calc(${leftPct}% + 2px);width:calc(${widthPct}% - 4px)"
                      >
                        <span class="etitle">+${o.count}</span>
                      </div>
                    `;
                  })}
              </div>
            `;
          })}
          ${showNow
            ? html`<div class="nowline" style="top:${(nowMin - startMin) * px}px">
                <span>${formatMinutes(this.hass, nowMin)}</span>
              </div>`
            : nothing}
          ${!this._loading && !this._loadError && !this._partialLoad && !this._dayHasEvents(day)
            ? html`<div class="empty">${this._t("no_events")}</div>`
            : nothing}
        </div>
      </div>
    `;
  }

  /** Horizontal timeline: persons as rows on the left, time flowing left → right. */
  private _renderTimeline() {
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const { startMin, endMin } = this._dayWindow(day);
    const hourPx = Math.min(240, Math.max(48, Number(this._config.hour_width) || 96));
    const px = hourPx / 60;
    const width = (endMin - startMin) * px;
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);
    const now = this._now();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const showNow =
      this._config.show_now_line !== false &&
      this._isRealToday(day) &&
      nowMin >= startMin &&
      nowMin <= endMin;
    const LANE = 30;

    return html`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(day)) ?? full[day]}
          ${this._weatherChip(this._dateForDay(day))}${this._loading && this._raw.length === 0
            ? html`<span class="spinner"></span>`
            : nothing}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      <div class="tlwrap">
        <div class="tlgrid" style="min-width:calc(var(--fb-tl-label, 150px) + ${width}px)">
          <div class="tlhead">
            <div class="tlcorner"></div>
            <div class="tlhours" style="width:${width}px">
              ${hours.map(
                (h) =>
                  html`<span class="tlhour" style="left:${(h * 60 - startMin) * px}px"
                    >${this._layout === "wall"
                      ? formatHourLabel(this.hass, h)
                      : `${pad(h)}:00`}</span
                  >`,
              )}
            </div>
          </div>
          ${this._persons.map((p, i) => {
            const off = this._isOff(i);
            const evs = off ? [] : this._events.filter((e) => e.day === day && e.personIdx === i);
            const laid = layoutDayColumns(evs);
            const lanes = laid.length ? Math.max(...laid.map((e) => e.cols)) : 1;
            const canCreate = this._personCanCreate(p);
            const stateObj = p.person ? this.hass.states[p.person] : undefined;
            return html`
              <div class="tlrow ${off ? "off" : ""}">
                <div
                  class="tlperson"
                  role="button"
                  tabindex="0"
                  @click=${() => this._togglePerson(i)}
                  @keydown=${(k: KeyboardEvent) => {
                    if (k.key === "Enter" || k.key === " ") {
                      k.preventDefault();
                      this._togglePerson(i);
                    }
                  }}
                >
                  ${this._avatar(p, i)}
                  <div>
                    <div class="pname">${this._personName(p, i)}</div>
                    <div class="pstatus">${stateObj ? this._statusLabel(stateObj.state) : ""}</div>
                  </div>
                </div>
                <div
                  class="tlcanvas ${canCreate ? "creatable" : ""}"
                  style="width:${width}px;height:${lanes * LANE + 8}px;
                         background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px),
                         repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
                  2}px)"
                  @click=${(ev: MouseEvent) => this._onTimelineClick(ev, i, day, px, startMin)}
                >
                  ${laid
                    .filter((e) => e.endMin > startMin && e.startMin < endMin)
                    .map((e) => {
                      const s = Math.max(e.startMin, startMin);
                      const en = Math.min(e.endMin, endMin);
                      const w = Math.max((en - s) * px - 3, 20);
                      const c = this._eventColor(e);
                      const tent = this._isTentative(e);
                      const before = e.continuesBefore || e.startMin < startMin;
                      const after = e.continuesAfter || e.endMin > endMin;
                      return html`
                        <div
                          class="tlbar ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                          style="left:${(s - startMin) * px + 1.5}px;width:${w}px;
                                 top:${e.col * LANE + 4}px;height:${LANE - 6}px;
                                 border-left:3px ${tent ? "dashed" : "solid"} ${c};
                                 background:${c}40;
                                 background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}${e.allDay
                            ? ` · ${this._t("all_day")}`
                            : ` · ${formatMinutes(this.hass, e.startMin)}–${formatMinutes(this.hass, e.endMin)}`}"
                        >
                          <span class="etitle"
                            >${before ? "« " : ""}${this._evTitle(e)}${after ? " »" : ""}</span
                          >
                          ${!e.allDay && w > 120
                            ? html`<span class="etime"
                                >${formatMinutes(this.hass, e.startMin)}–${formatMinutes(
                                  this.hass,
                                  e.endMin,
                                )}</span
                              >`
                            : nothing}
                        </div>
                      `;
                    })}
                </div>
              </div>
            `;
          })}
          ${showNow
            ? html`<div
                class="tlnow"
                style="left:calc(var(--fb-tl-label, 150px) + ${(nowMin - startMin) * px}px)"
              >
                <span>${formatMinutes(this.hass, nowMin)}</span>
              </div>`
            : nothing}
        </div>
        ${!this._loading && !this._loadError && !this._partialLoad && !this._dayHasEvents(day)
          ? html`<div class="empty">${this._t("no_events")}</div>`
          : nothing}
      </div>
    `;
  }

  private _onTimelineClick(
    ev: MouseEvent,
    idx: number,
    day: number,
    px: number,
    startMin: number,
  ): void {
    const p = this._persons[idx];
    if (!this._personCanCreate(p)) return;
    const target = ev.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetX = ev.clientX - rect.left;
    let min = startMin + offsetX / px;
    const grid = this._grid;
    min = Math.round(min / grid) * grid;
    min = Math.max(0, Math.min(min, 24 * 60 - grid));
    this._openCreate(idx, day, min);
  }

  private _renderWeek() {
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
    // optionally hide persons without any events in the shown week
    const people = this._persons
      .map((p, i) => ({ p, i }))
      .filter(
        ({ i }) =>
          this._config.hide_empty_persons !== true || this._events.some((e) => e.personIdx === i),
      );
    const shown = people.length > 0 ? people : this._persons.map((p, i) => ({ p, i }));
    const cols = `70px repeat(${shown.length}, minmax(110px, 1fr))`;
    return html`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${cols}">
          <div class="corner"></div>
          ${shown.map(
            ({ p, i }) =>
              html`<div
                class="wphead ${this._isOff(i) ? "off" : ""}"
                role="button"
                tabindex="0"
                @click=${() => this._togglePerson(i)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._togglePerson(i);
                  }
                }}
              >
                ${this._avatar(p, i)}<span>${this._personName(p, i)}</span>
              </div>`,
          )}
          ${this._visibleDays.map(
            (d) => html`
              <div
                class="wday ${this._isRealToday(d) ? "today" : ""}"
                role="button"
                tabindex="0"
                title=${this._t("day")}
                @click=${() => this._openDayView(d)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._openDayView(d);
                  }
                }}
              >
                <b>${short[d]}</b>
              </div>
              ${shown.map(({ p, i }) => {
                const canCreate = this._personCanCreate(p);
                return html`
                  <div
                    class="wcell ${this._isRealToday(d) ? "today" : ""} ${canCreate
                      ? "creatable"
                      : ""}"
                    @click=${() => canCreate && this._openCreate(i, d)}
                  >
                    ${this._eventsFor(d, i).map((e) => {
                      const c = this._eventColor(e);
                      const tent = this._isTentative(e);
                      return html`
                        <div
                          class="wchip ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                          style="border-left:2.5px ${tent
                            ? "dashed"
                            : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                        >
                          <span
                            >${this._calIconEl(e)}${e.continuesBefore ? "« " : ""}${this._evTitle(
                              e,
                            )}</span
                          >
                          ${!e.allDay
                            ? html`<small>${formatMinutes(this.hass, e.startMin)}</small>`
                            : nothing}
                        </div>
                      `;
                    })}
                  </div>
                `;
              })}
            `,
          )}
        </div>
      </div>
    `;
  }

  private _renderAgenda() {
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const dateFmt = new Intl.DateTimeFormat(this.hass.locale?.language || "en", {
      day: "numeric",
      month: "short",
    });
    const dedupe = (items: BoardEvent[]): BoardEvent[] => {
      if (!this._config.filter_duplicates) return items;
      const seen = new Set<string>();
      return items.filter((e) => {
        const k = `${e.personIdx}|${occurrenceKey(e.ref)}|${e.day}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    };
    const groups = this._visibleDays
      .map((d) => ({
        d,
        items: dedupe(
          this._events
            .filter((e) => e.day === d && !this._isOff(e.personIdx))
            .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin),
        ),
      }))
      .filter((g) => g.items.length > 0);

    return html`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="agenda">
        ${groups.length === 0
          ? html`<div class="agenda-empty">
              ${this._loading
                ? html`<span class="spinner"></span>`
                : this._loadError || this._partialLoad
                  ? nothing
                  : this._t("no_events")}
            </div>`
          : groups.map(
              (g) => html`
                <div class="agenda-day">
                  <div class="agenda-date ${this._isRealToday(g.d) ? "today" : ""}">
                    ${this._relativeDay(this._dateForDay(g.d)) ?? full[g.d]} ·
                    ${dateFmt.format(this._dateForDay(g.d))}
                    ${this._weatherChip(this._dateForDay(g.d))}
                  </div>
                  ${g.items.map((e) => this._agendaRow(e))}
                </div>
              `,
            )}
      </div>
    `;
  }

  private _agendaRow(e: BoardEvent) {
    const c = this._eventColor(e);
    const name = this._personName(this._persons[e.personIdx], e.personIdx);
    const time = e.allDay
      ? this._t("all_day")
      : `${formatMinutes(this.hass, e.startMin)}–${formatMinutes(this.hass, e.endMin)}`;
    const current = this._isCurrent(e);
    const tent = this._isTentative(e);
    const countdown =
      !e.allDay && !current && !e.continuesBefore
        ? formatCountdown(this.hass, e.ref.start, this._now())
        : "";
    return html`
      <div
        class="agenda-row ${this._isPast(e) ? "past" : ""} ${current ? "current" : ""} ${tent
          ? "tentative"
          : ""}"
        tabindex="0"
        role="button"
        @click=${() => this._openEvent(e)}
        @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
      >
        <span class="agenda-time">${time}</span>
        <span class="agenda-bar" style="background:${c}"></span>
        <span class="agenda-main">
          <span class="agenda-title"
            >${this._calIconEl(e)}${e.continuesBefore ? "« " : ""}${this._evTitle(
              e,
            )}${e.continuesAfter ? " »" : ""}</span
          >
          <span class="agenda-meta">${name}${e.location ? ` · ${e.location}` : ""}</span>
          ${current && this._progressOn
            ? html`<span class="agenda-prog"
                ><span style="width:${this._progressPct(e)}%;background:${c}"></span
              ></span>`
            : nothing}
        </span>
        ${countdown ? html`<span class="agenda-cd">${countdown}</span>` : nothing}
      </div>
    `;
  }

  private _renderMonth() {
    const { gridStart, weeks, month, year } = this._monthGrid();
    const numDays = weeks * 7;
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
    const locale = this.hass.locale?.language || "en";
    const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
      new Date(year, month, 1),
    );
    const byDay = new Map<number, BoardEvent[]>();
    for (const r of this._raw) {
      if (this._isOff(r.personIdx)) continue;
      for (const s of splitAcrossDays(r, gridStart, numDays)) {
        const arr = byDay.get(s.day);
        if (arr) arr.push(s);
        else byDay.set(s.day, [s]);
      }
    }
    const today = startOfDay(this._now()).getTime();
    const maxChips = 3;
    return html`
      <div class="weekhead">
        <div class="weeknav">
          <button class="nav" aria-label=${this._t("prev_month")} @click=${this._prevMonth}>
            ‹
          </button>
          <button class="nav-now" @click=${this._thisMonth}>${monthName}</button>
          <button class="nav" aria-label=${this._t("next_month")} @click=${this._nextMonth}>
            ›
          </button>
        </div>
      </div>
      <div class="monthwrap">
        <div class="monthhead">${short.map((s) => html`<div class="mhcell">${s}</div>`)}</div>
        <div class="monthgrid">
          ${Array.from({ length: numDays }, (_, d) => {
            const date = addLocalDays(gridStart, d);
            const inMonth = date.getMonth() === month;
            const isToday = date.getTime() === today;
            const items = (byDay.get(d) || []).sort(
              (a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin,
            );
            return html`
              <div
                class="mcell ${inMonth ? "" : "out"} ${isToday ? "today" : ""} ${date.getDay() ===
                  0 || date.getDay() === 6
                  ? "wkend"
                  : ""}"
                role="button"
                tabindex="0"
                @click=${() => this._goToDate(date)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._goToDate(date);
                  }
                }}
              >
                <div class="mdate ${isToday ? "today" : ""}">${date.getDate()}</div>
                <div class="mchips">
                  ${items.slice(0, maxChips).map((e) => {
                    const col = this._eventColor(e);
                    const tent = this._isTentative(e);
                    return html`<div
                      class="mchip ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                      style="background:${col}30;background:color-mix(in srgb, ${col} 22%, var(--card-background-color, #fff));border-left:2px ${tent
                        ? "dashed"
                        : "solid"} ${col}"
                      title="${this._evTitle(e)}"
                      tabindex="0"
                      role="button"
                      @click=${(ev: MouseEvent) => {
                        ev.stopPropagation();
                        this._openEvent(e);
                      }}
                      @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                    >
                      ${e.continuesBefore ? "« " : ""}${this._evTitle(e)}
                    </div>`;
                  })}
                  ${items.length > maxChips
                    ? html`<div class="mmore">+${items.length - maxChips}</div>`
                    : nothing}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _statusLabel(state: string): string {
    if (state === "home") return this._t("status_home");
    if (state === "not_home") return this._t("status_away");
    if (state === "unknown" || state === "unavailable") return "–";
    return state;
  }

  /** Mouse drag-to-pan for the wide wall Day grid; touch and wheel keep native scrolling. */
  private _onWallBoardPointerDown = (ev: PointerEvent): void => {
    this._cancelDayScroll();
    if (this._layout !== "wall" || ev.pointerType !== "mouse" || ev.button !== 0) return;
    const board = ev.currentTarget as HTMLElement;
    if (board.scrollWidth <= board.clientWidth + 1) return;
    this._wallPan = {
      board,
      pointerId: ev.pointerId,
      startX: ev.clientX,
      startY: ev.clientY,
      startScrollLeft: board.scrollLeft,
      moved: false,
    };
  };

  private _onWallBoardPointerMove = (ev: PointerEvent): void => {
    const pan = this._wallPan;
    if (!pan || ev.pointerId !== pan.pointerId) return;
    const dx = ev.clientX - pan.startX;
    if (!pan.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(ev.clientY - pan.startY)) return;
      pan.moved = true;
      pan.board.setPointerCapture(ev.pointerId);
      pan.board.classList.add("panning");
    }
    ev.preventDefault();
    pan.board.scrollLeft = pan.startScrollLeft - dx;
  };

  private _onWallBoardPointerUp = (ev: PointerEvent): void => {
    const pan = this._wallPan;
    if (!pan || ev.pointerId !== pan.pointerId) return;
    this._wallPan = undefined;
    pan.board.classList.remove("panning");
    if (!pan.moved) return;
    ev.preventDefault();
    const suppressClick = (click: MouseEvent) => {
      click.preventDefault();
      click.stopImmediatePropagation();
    };
    pan.board.addEventListener("click", suppressClick, { capture: true, once: true });
    window.setTimeout(() => pan.board.removeEventListener("click", suppressClick, true), 0);
  };

  private _onWallBoardPointerCancel = (ev: PointerEvent): void => {
    const pan = this._wallPan;
    if (!pan || ev.pointerId !== pan.pointerId) return;
    this._wallPan = undefined;
    pan.board.classList.remove("panning");
  };

  /* ---- create / edit / delete ---------------------------------- */
  private _onColClick(
    ev: MouseEvent,
    idx: number,
    day: number,
    px: number,
    startMin: number,
  ): void {
    const p = this._persons[idx];
    if (!this._personCanCreate(p)) return;
    const target = ev.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetY = ev.clientY - rect.top;
    let min = startMin + offsetY / px;
    const grid = this._grid;
    min = Math.round(min / grid) * grid;
    min = Math.max(0, Math.min(min, 24 * 60 - grid));
    this._openCreate(idx, day, min);
  }

  private _openCreate(idx: number, day: number, startMin?: number): void {
    const p = this._persons[idx];
    const writable = this._writableCals(p);
    if (writable.length === 0) return;
    const base = startOfDay(this._dateForDay(day));
    const sMin = startMin ?? Math.max(this._startMin, 9 * 60);
    const start = new Date(base.getTime() + sMin * 60000);
    const end = new Date(start.getTime() + 60 * 60000);
    this._dialog = {
      mode: "create",
      personIdx: idx,
      calendar: writable[0],
      calendarOptions: writable.length > 1 ? writable : undefined,
      canUpdate: true,
      canDelete: false,
      summary: "",
      location: "",
      description: "",
      allDay: false,
      start: toLocalInput(start),
      end: toLocalInput(end),
      recurrenceRange: "",
    };
  }

  private _openEvent(e: BoardEvent): void {
    this._dialog = this._eventDialog(e.ref);
  }

  private _eventDialog(raw: RawEvent): DialogState {
    const cal = raw.calendar;
    const canUpdate = this._canUpdate(cal) && !!raw.uid;
    const canDelete = this._canDelete(cal) && !!raw.uid;
    return {
      mode: "edit",
      personIdx: raw.personIdx,
      calendar: cal,
      uid: raw.uid,
      recurrence_id: raw.recurrence_id,
      recurring: !!(raw.recurrence_id || raw.rrule),
      recurrenceRange: "",
      canUpdate,
      canDelete,
      summary: canUpdate ? (raw.sourceSummary ?? raw.summary) : raw.summary,
      location: raw.location ?? "",
      description: raw.description ?? "",
      allDay: raw.allDay,
      start: raw.allDay ? toLocalDate(raw.start) : toLocalInput(raw.start),
      // all-day end is exclusive in HA; show the inclusive last day to the user
      end: raw.allDay ? toLocalDate(addLocalDays(raw.end, -1)) : toLocalInput(raw.end),
      source: this._config.read_only ? raw : undefined,
    };
  }

  /** Keep inspected facts fresh, but never overwrite an editable draft. */
  private _refreshReadOnlyDialog(): void {
    const dialog = this._dialog;
    if (!this._config.read_only || !dialog?.source || dialog.mode !== "edit") return;
    if (
      this._calendarResults.find((result) => result.entityId === dialog.calendar)?.status !== "ok"
    ) {
      this._dialog = { ...dialog, detailsStatus: "unavailable" };
      return;
    }
    const event = findRefreshedEvent(dialog.source, this._raw);
    if (!event) {
      // Not found does not prove cancellation: it may have moved out of range or routing.
      this._dialog = { ...dialog, detailsStatus: "missing" };
      return;
    }
    const fresh = this._eventDialog(event);
    const changed = (
      ["summary", "start", "end", "allDay", "location", "description"] as const
    ).some((field) => fresh[field] !== dialog[field]);
    this._dialog = { ...fresh, detailsStatus: changed ? "updated" : undefined };
  }

  private _dlgField<K extends keyof DialogState>(key: K, value: DialogState[K]): void {
    if (!this._dialog) return;
    this._dialog = { ...this._dialog, [key]: value, error: undefined };
  }

  private _toggleAllDay(allDay: boolean): void {
    if (!this._dialog) return;
    const d = this._dialog;
    if (allDay && !d.allDay) {
      this._dialog = {
        ...d,
        allDay,
        start: d.start.slice(0, 10),
        end: d.end.slice(0, 10),
        error: undefined,
      };
    } else if (!allDay && d.allDay) {
      this._dialog = {
        ...d,
        allDay,
        start: `${d.start}T09:00`,
        end: `${d.end}T10:00`,
        error: undefined,
      };
    }
  }

  /** Build the event payload expected by calendar/event/* WS commands. */
  private _buildPayload(d: DialogState): Record<string, string> {
    const ev: Record<string, string> = { summary: d.summary.trim() || this._t("default_title") };
    if (d.location.trim()) ev.location = d.location.trim();
    if (d.description.trim()) ev.description = d.description.trim();
    if (d.allDay) {
      const endExcl = new Date(`${d.end}T00:00:00`);
      endExcl.setDate(endExcl.getDate() + 1); // end date is exclusive
      ev.dtstart = d.start;
      ev.dtend = toLocalDate(endExcl);
    } else {
      ev.dtstart = new Date(d.start).toISOString();
      ev.dtend = new Date(d.end).toISOString();
    }
    return ev;
  }

  private _validate(d: DialogState): string | null {
    const s = d.allDay ? new Date(`${d.start}T00:00:00`) : new Date(d.start);
    const e = d.allDay ? new Date(`${d.end}T00:00:00`) : new Date(d.end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return this._t("err_invalid");
    if (e.getTime() < s.getTime()) return this._t("err_end_before");
    if (!d.allDay && e.getTime() === s.getTime()) return this._t("err_end_equal");
    return null;
  }

  /* ---- drag & drop -------------------------------------------- */
  /** Whether an event may be dragged: feature on, timed, writable, non-recurring. */
  private _draggable(e: BoardEvent): boolean {
    return (
      this._config.drag_drop !== false &&
      !e.allDay &&
      !e.ref.rrule &&
      !e.ref.recurrence_id &&
      !!e.ref.uid &&
      this._canUpdate(e.ref.calendar) &&
      !e.continuesBefore &&
      !e.continuesAfter
    );
  }

  private _onEventPointerDown(ev: PointerEvent, e: BoardEvent, mode: "move" | "resize"): void {
    if (ev.button !== 0 || !this._draggable(e)) return;
    ev.stopPropagation();
    this._dragStartY = ev.clientY;
    this._dragPx = this._pxPerMin;
    this._dragGrid = this._grid;
    this._drag = { raw: e.ref, mode, deltaMin: 0, moved: false, busy: false };
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
    window.addEventListener("pointermove", this._onDragMove);
    window.addEventListener("pointerup", this._onDragUp);
  }

  private _onDragMove = (ev: PointerEvent): void => {
    if (!this._drag) return;
    ev.preventDefault();
    const dy = ev.clientY - this._dragStartY;
    const moved = this._drag.moved || Math.abs(dy) > 4;
    this._drag = { ...this._drag, deltaMin: dy / this._dragPx, moved };
  };

  private _onDragUp = (): void => {
    window.removeEventListener("pointermove", this._onDragMove);
    window.removeEventListener("pointerup", this._onDragUp);
    const drag = this._drag;
    if (!drag) return;
    if (!drag.moved) {
      this._drag = undefined; // a plain click -> let @click open the dialog
      return;
    }
    this._suppressClick = true;
    void this._commitDrag(drag);
  };

  private async _commitDrag(drag: NonNullable<FamilyBoardCard["_drag"]>): Promise<void> {
    const raw = drag.raw;
    // Recheck current configuration/capabilities; they can change during a gesture.
    if (
      !this._canUpdate(raw.calendar) ||
      this._config.drag_drop === false ||
      !raw.uid ||
      raw.allDay ||
      raw.rrule ||
      raw.recurrence_id
    ) {
      this._drag = undefined;
      return;
    }
    const { start, end } = dragTimes(raw.start, raw.end, drag.deltaMin, drag.mode, this._dragGrid);
    if (start.getTime() === raw.start.getTime() && end.getTime() === raw.end.getTime()) {
      this._drag = undefined;
      return;
    }
    this._drag = { ...drag, busy: true };
    try {
      const event: Record<string, string> = {
        summary: raw.sourceSummary ?? raw.summary,
        dtstart: start.toISOString(),
        dtend: end.toISOString(),
      };
      if (raw.location) event.location = raw.location;
      if (raw.description) event.description = raw.description;
      await this.hass.callWS({
        type: "calendar/event/update",
        entity_id: raw.calendar,
        uid: raw.uid,
        recurrence_id: raw.recurrence_id,
        recurrence_range: "",
        event,
      });
      this._drag = undefined;
      await this._refreshAfterMutation();
    } catch (_e) {
      this._drag = undefined;
      this._loadError = false;
      await this._refreshAfterMutation(); // reset to server state on failure
    }
  }

  private async _saveDialog(): Promise<void> {
    if (!this._dialog) return;
    const d = this._dialog;
    if (
      d.busy ||
      (d.mode === "create" ? !this._canCreate(d.calendar) : !d.uid || !this._canUpdate(d.calendar))
    )
      return;
    const err = this._validate(d);
    if (err) {
      this._dialog = { ...d, error: err };
      return;
    }
    this._dialog = { ...d, busy: true, error: undefined };
    try {
      const event = this._buildPayload(d);
      if (d.mode === "create") {
        await this.hass.callWS({ type: "calendar/event/create", entity_id: d.calendar, event });
      } else {
        await this.hass.callWS({
          type: "calendar/event/update",
          entity_id: d.calendar,
          uid: d.uid,
          recurrence_id: d.recurrence_id,
          recurrence_range: d.recurring ? d.recurrenceRange : "",
          event,
        });
      }
      this._dialog = undefined;
      await this._refreshAfterMutation();
    } catch (e: any) {
      this._dialog = { ...d, busy: false, error: e?.message || this._t("save_failed") };
    }
  }

  private async _deleteDialog(): Promise<void> {
    if (!this._dialog || !this._dialog.uid) return;
    const d = this._dialog;
    if (d.busy || !this._canDelete(d.calendar)) return;
    this._dialog = { ...d, busy: true, error: undefined };
    try {
      await this.hass.callWS({
        type: "calendar/event/delete",
        entity_id: d.calendar,
        uid: d.uid,
        recurrence_id: d.recurrence_id,
        recurrence_range: d.recurring ? d.recurrenceRange : "",
      });
      this._dialog = undefined;
      await this._refreshAfterMutation();
    } catch (e: any) {
      this._dialog = { ...d, busy: false, error: e?.message || this._t("delete_failed") };
    }
  }

  private _closeDialog(): void {
    this._dialog = undefined;
  }

  private _renderDialog() {
    const d = this._dialog!;
    const readOnly = d.mode === "edit" && !d.canUpdate;
    const calName = this._calLabel(d.calendar);
    const heading =
      d.mode === "create"
        ? this._t("new_event")
        : readOnly
          ? this._t("event")
          : this._t("edit_event");
    return html`
      <div
        class="overlay"
        @click=${(e: MouseEvent) => {
          if (e.target === e.currentTarget) this._closeDialog();
        }}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${heading} tabindex="-1">
          <div class="dlg-head">
            <span>${heading}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeDialog}>
              ✕
            </button>
          </div>
          ${d.source && (this._loading || d.detailsStatus)
            ? html`<div class="details-status" role="status">
                ${this._t(this._loading ? "details_refreshing" : `details_${d.detailsStatus}`)}
                ${!this._loading &&
                (d.detailsStatus === "unavailable" || d.detailsStatus === "missing")
                  ? html`<button class="retry" @click=${this._refetch}>${this._t("retry")}</button>`
                  : nothing}
              </div>`
            : nothing}
          ${d.calendarOptions && d.calendarOptions.length > 1
            ? html`<label class="fld">
                <span>${this._t("field_calendar")}</span>
                <select
                  .value=${d.calendar}
                  @change=${(e: Event) =>
                    this._dlgField("calendar", (e.target as HTMLSelectElement).value)}
                >
                  ${d.calendarOptions.map(
                    (c) =>
                      html`<option value=${c} ?selected=${c === d.calendar}>
                        ${this._calLabel(c)}
                      </option>`,
                  )}
                </select>
              </label>`
            : html`<div class="dlg-cal">${calName}</div>`}

          <label class="fld">
            <span>${this._t("field_title")}</span>
            <input
              type="text"
              .value=${d.summary}
              ?disabled=${readOnly}
              autofocus
              @input=${(e: Event) =>
                this._dlgField("summary", (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="chk">
            <input
              type="checkbox"
              .checked=${d.allDay}
              ?disabled=${readOnly}
              @change=${(e: Event) => this._toggleAllDay((e.target as HTMLInputElement).checked)}
            />
            <span>${this._t("field_all_day")}</span>
          </label>

          <div class="row">
            <label class="fld">
              <span>${this._t("field_start")}</span>
              <input
                type=${d.allDay ? "date" : "datetime-local"}
                .value=${d.start}
                ?disabled=${readOnly}
                @input=${(e: Event) =>
                  this._dlgField("start", (e.target as HTMLInputElement).value)}
              />
            </label>
            <label class="fld">
              <span>${this._t("field_end")}</span>
              <input
                type=${d.allDay ? "date" : "datetime-local"}
                .value=${d.end}
                ?disabled=${readOnly}
                @input=${(e: Event) => this._dlgField("end", (e.target as HTMLInputElement).value)}
              />
            </label>
          </div>

          <label class="fld">
            <span>
              ${this._t("field_location")}
              ${d.location.trim() &&
              !(
                d.source &&
                (this._loading ||
                  d.detailsStatus === "missing" ||
                  d.detailsStatus === "unavailable")
              )
                ? html`<a
                    class="maplink"
                    href=${this._mapUrl(d.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    @click=${(e: Event) => e.stopPropagation()}
                    >${this._t("open_map")}</a
                  >`
                : nothing}
            </span>
            <input
              type="text"
              .value=${d.location}
              ?disabled=${readOnly}
              @input=${(e: Event) =>
                this._dlgField("location", (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="fld">
            <span>${this._t("field_note")}</span>
            <textarea
              rows="2"
              .value=${d.description}
              ?disabled=${readOnly}
              @input=${(e: Event) =>
                this._dlgField("description", (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </label>

          ${d.mode === "edit" && d.recurring && !readOnly
            ? html`<div class="recur">
                <span class="recur-label">${this._t("recurring")}</span>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${d.recurrenceRange === ""}
                    @change=${() => this._dlgField("recurrenceRange", "")}
                  />
                  <span>${this._t("recur_this")}</span>
                </label>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${d.recurrenceRange === "THISANDFUTURE"}
                    @change=${() => this._dlgField("recurrenceRange", "THISANDFUTURE")}
                  />
                  <span>${this._t("recur_future")}</span>
                </label>
              </div>`
            : nothing}
          ${readOnly ? html`<div class="ro-note">${this._t("read_only")}</div>` : nothing}
          ${d.error ? html`<div class="dlg-error">${d.error}</div>` : nothing}

          <div class="dlg-actions">
            ${d.mode === "edit" && d.canDelete
              ? html`<button class="danger" ?disabled=${d.busy} @click=${this._deleteDialog}>
                  ${this._t("delete")}
                </button>`
              : nothing}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${d.busy} @click=${this._closeDialog}>
              ${this._t("cancel")}
            </button>
            ${!readOnly
              ? html`<button class="primary" ?disabled=${d.busy} @click=${this._saveDialog}>
                  ${d.busy ? "…" : this._t("save")}
                </button>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  /* ---- styles (theme-aware) ------------------------------------ */
  static styles = css`
    :host {
      font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
      /* grid tokens — theme-aware, calm by default */
      --fb-hourline: var(--divider-color, #8884);
      --fb-halfhour: color-mix(in srgb, var(--divider-color, #8884) 45%, transparent);
      --fb-row-shade: color-mix(in srgb, var(--secondary-text-color, #888) 5%, transparent);
      /* customization tokens — override via theme or card-mod */
      --fb-accent: var(--primary-color);
      --fb-now-color: var(--error-color, #ff5252);
      --fb-radius: 7px;
      --fb-radius-sm: 5px;
      --fb-avatar-size: 34px;
      --fb-past-opacity: 0.5;
      --fb-title-size: 16px;
      --fb-name-size: 13px;
      --fb-event-size: 11.5px;
      --fb-time-size: 9.5px;
      --fb-chip-size: 10.5px;
    }
    ha-card {
      overflow: hidden;
      color: var(--primary-text-color);
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    /* one-switch compact density */
    :host([compact]) {
      --fb-title-size: 14px;
      --fb-name-size: 11.5px;
      --fb-event-size: 10.5px;
      --fb-time-size: 9px;
      --fb-chip-size: 9.5px;
      --fb-avatar-size: 26px;
      --fb-event-pad: 2px 5px;
      --fb-head-pad: 5px 4px;
      --fb-axis-width: 44px;
    }
    :host([compact]) .top,
    :host([compact]) .dayhead,
    :host([compact]) .weekhead {
      padding: 6px 10px;
    }
    :host([compact]) .tabs {
      margin: 4px 10px 0;
    }
    :host([compact]) .focus {
      padding: 5px 10px;
    }
    :host([compact]) .fchip {
      padding: 4px 8px;
    }
    /* "now / next" glance bar */
    .focus {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color);
      scrollbar-width: thin;
    }
    .fchip {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1 1 0;
      min-width: 160px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 6px 10px;
    }
    .fchip .avatar {
      flex: 0 0 auto;
    }
    .fbody {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.25;
    }
    .fname {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-weight: 600;
    }
    .fnow,
    .fnext,
    .ffree {
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .ffree {
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .fnow small,
    .fnext small {
      color: var(--secondary-text-color);
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .fdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: 0 0 8px;
      animation: fb-pulse 2s ease-out infinite;
    }
    .title {
      font-weight: 600;
      font-size: var(--fb-title-size);
    }
    .switch,
    .tabs {
      display: inline-flex;
      gap: 2px;
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 2px;
    }
    .switch button,
    .tabs button {
      border: none;
      cursor: pointer;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 5px 12px;
      border-radius: 999px;
      font: inherit;
      font-size: 13px;
      transition:
        background 0.12s ease,
        color 0.12s ease;
    }
    .switch button:hover:not(.on),
    .tabs button:hover:not(.on) {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .switch button.on,
    .tabs button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
      box-shadow: 0 1px 4px color-mix(in srgb, var(--primary-color) 45%, transparent);
    }
    .tabs button.today:not(.on) {
      box-shadow: inset 0 -2px 0 var(--fb-accent);
    }
    .tabs {
      margin: 8px 16px 0;
      flex-wrap: wrap;
    }
    .dayhead,
    .weekhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--divider-color);
      flex-wrap: wrap;
    }
    .dayname {
      font-weight: 700;
      font-size: 15.5px;
      display: inline-flex;
      align-items: center;
    }
    .weeknav {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .nav,
    .nav-now {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 7px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      padding: 5px 10px;
    }
    .nav {
      font-size: 16px;
      line-height: 1;
      padding: 4px 9px;
    }
    .nav-now {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .calendar-status {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      gap: 12px;
      margin: 8px 16px;
      font-size: 14px;
    }
    .calendar-status .status-message {
      flex: 1;
    }
    .calendar-status .retry {
      flex: 0 0 auto;
      min-height: 44px;
      padding: 8px 16px;
      border: 1px solid currentColor;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .banner {
      margin: 8px 16px 0;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12.5px;
      color: var(--text-primary-color, #fff);
      background: var(--error-color, #ff5252);
    }
    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-left: 8px;
      vertical-align: middle;
      border: 2px solid var(--divider-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: fb-spin 0.7s linear infinite;
    }
    @keyframes fb-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2s;
      }
    }
    .empty {
      position: absolute;
      top: 0;
      left: var(--fb-axis-width, 56px);
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 13px;
      pointer-events: none;
    }
    .board {
      max-height: var(--fb-board-max-height, 58vh);
      overflow: auto;
      margin-top: 8px;
    }
    /* keep header, all-day and body columns pixel-aligned: borders must not
       change box width, or the vertical dividers break between the rows. */
    .axis-spacer,
    .phead,
    .axis,
    .col,
    .allday-cell,
    .allday-label {
      box-sizing: border-box;
    }
    .header-row {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .axis-spacer {
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
      position: sticky;
      left: 0;
      background: inherit;
    }
    .phead {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      padding: var(--fb-head-pad, 10px 6px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-left: 1px solid var(--divider-color);
      position: relative;
    }
    .allday-row {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--ha-card-background));
    }
    .allday-label {
      font-size: 10px;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
    }
    .allday-cell {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      border-left: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .adchip {
      border-radius: var(--fb-radius-sm);
      padding: 2px 6px;
      font-size: var(--fb-chip-size);
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .avatar {
      width: var(--fb-avatar-size);
      height: var(--fb-avatar-size);
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }
    .avatar.initials {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #11181f;
      font-weight: 700;
      font-size: 13px;
    }
    .pname {
      font-weight: 600;
      font-size: var(--fb-name-size);
    }
    .pstatus {
      font-size: 10.5px;
      color: var(--secondary-text-color);
    }
    .body {
      display: flex;
      position: relative;
    }
    .axis {
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
      position: sticky;
      left: 0;
      background: var(--card-background-color, var(--ha-card-background));
      z-index: 4;
      border-right: 1px solid var(--divider-color);
    }
    .hour {
      position: absolute;
      right: 8px;
      transform: translateY(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    /* first hour label would be clipped by the header above */
    .hour:first-child {
      transform: none;
      margin-top: 1px;
    }
    .col {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.creatable {
      cursor: copy;
    }
    .event {
      position: absolute;
      border-radius: var(--fb-radius);
      padding: var(--fb-event-pad, 4px 7px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 2;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .event:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 4;
    }
    /* long "background" events (OGS, Freispiel …): faint full-width band behind
       the normal event blocks so short lessons keep the full column width. */
    .band {
      position: absolute;
      left: 2px;
      right: 2px;
      border-radius: var(--fb-radius);
      padding: 3px 7px;
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 1;
      display: flex;
      justify-content: flex-end; /* keep label clear of left-aligned event blocks */
      align-items: flex-start;
    }
    .band .etitle {
      max-width: 90%;
      font-weight: 600;
      font-size: 10px;
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 1px 8px;
    }
    .cicon {
      --mdc-icon-size: 13px;
      width: 13px;
      height: 13px;
      vertical-align: -2px;
      margin-right: 3px;
      opacity: 0.85;
    }
    .event.draggable {
      touch-action: none;
      cursor: grab;
    }
    .event.dragging {
      cursor: grabbing;
      z-index: 20;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
      opacity: 0.94;
      transition: none;
    }
    /* resize grabber at the bottom edge */
    .rz {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 9px;
      cursor: ns-resize;
      touch-action: none;
    }
    .rz::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 2px;
      width: 20px;
      height: 3px;
      transform: translateX(-50%);
      border-radius: 2px;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.12s ease;
    }
    .event.draggable:hover .rz::after {
      opacity: 0.4;
    }
    .event.tentative {
      opacity: 0.72;
      border-style: dashed;
      background-image: repeating-linear-gradient(
        135deg,
        transparent 0 6px,
        rgba(255, 255, 255, 0.06) 6px 12px
      );
    }
    .event.overflow {
      background: var(--secondary-background-color);
      border: 1px dashed var(--divider-color);
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      z-index: 6;
    }
    .event.overflow .etitle {
      font-weight: 700;
    }
    /* very short events (breaks etc.): thin single-line strip drawn on top so
       neighbours' min-height can't cover them */
    .event.slim {
      z-index: 3;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      padding: 0 5px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .event.slim .etitle {
      font-size: calc(var(--fb-event-size) - 1.5px);
      font-weight: 600;
    }
    .event.slim .etime,
    .event.slim .eprog {
      display: none;
    }
    .phead {
      cursor: pointer;
    }
    .phead.off,
    .col.off,
    .allday-cell.off {
      flex: 0 0 48px;
      min-width: 48px;
    }
    .phead.off .avatar,
    .wphead.off .avatar,
    .tlrow.off .avatar {
      opacity: 0.35;
      filter: grayscale(0.8);
    }
    .wphead {
      cursor: pointer;
    }
    .wphead.off span {
      opacity: 0.4;
    }
    .tlperson {
      cursor: pointer;
    }
    .tlrow.off .pname,
    .tlrow.off .pstatus {
      opacity: 0.4;
    }
    .pbadges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 3px;
      margin-top: 2px;
    }
    .pbadge {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 10px;
      font-weight: 600;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 1px 7px;
      cursor: pointer;
      white-space: nowrap;
    }
    .pbadge ha-icon {
      --mdc-icon-size: 12px;
      width: 12px;
      height: 12px;
      display: inline-flex;
      align-items: center;
    }
    @media (pointer: coarse) {
      .switch button,
      .tabs button {
        padding: 8px 14px;
      }
    }
    /* phones: tighter columns, smaller chrome, everything still scrollable */
    @media (max-width: 600px) {
      :host {
        --fb-col-min: 96px;
        --fb-avatar-size: 28px;
        --fb-axis-width: 42px;
        --fb-title-size: 14px;
        --fb-name-size: 11.5px;
        --fb-event-size: 10.5px;
        --fb-chip-size: 10px;
      }
      .top {
        flex-wrap: wrap;
        gap: 6px;
      }
      .phead {
        padding: 6px 4px;
        gap: 2px;
      }
      .hour {
        font-size: 9.5px;
        right: 4px;
      }
      .weeknav {
        gap: 4px;
      }
      .band .etitle {
        font-size: 9px;
        padding: 1px 6px;
      }
      .pbadge {
        font-size: 9px;
        padding: 1px 5px;
      }
    }
    .wchip,
    .adchip,
    .mchip {
      transition: box-shadow 0.12s ease;
    }
    .wchip:hover,
    .adchip:hover,
    .mchip:hover {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }
    .agenda-row {
      transition: background 0.12s ease;
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .wchip.tentative,
    .mchip.tentative,
    .adchip.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .agenda-row.tentative .agenda-bar {
      opacity: 0.55;
    }
    .agenda-row.tentative .agenda-title {
      font-style: italic;
    }
    .etitle {
      font-size: var(--fb-event-size);
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .etime {
      font-size: var(--fb-time-size);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .nowline {
      position: absolute;
      left: var(--fb-axis-width, 56px);
      right: 0;
      border-top: 2px solid var(--fb-now-color);
      z-index: 7;
      pointer-events: none;
    }
    .nowline::after {
      content: "";
      position: absolute;
      left: -3px;
      top: -5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--fb-now-color);
      animation: fb-pulse 2s ease-out infinite;
    }
    @keyframes fb-pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--fb-now-color) 40%, transparent);
      }
      50% {
        box-shadow: 0 0 0 7px transparent;
      }
    }
    @keyframes fb-fade {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .board,
    .weekwrap,
    .agenda,
    .monthgrid {
      animation: fb-fade 0.18s ease;
    }
    .board::-webkit-scrollbar,
    .weekwrap::-webkit-scrollbar,
    .agenda::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .board::-webkit-scrollbar-thumb,
    .weekwrap::-webkit-scrollbar-thumb,
    .agenda::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 8px;
    }
    @media (prefers-reduced-motion: reduce) {
      .board,
      .weekwrap,
      .agenda,
      .monthgrid,
      .nowline::after,
      .event {
        animation: none !important;
        transition: none !important;
      }
    }
    .nowline span {
      position: absolute;
      left: -50px;
      top: -8px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* timeline (horizontal) */
    .tlwrap {
      overflow: auto;
      max-height: var(--fb-board-max-height, 58vh);
      margin-top: 8px;
      animation: fb-fade 0.18s ease;
    }
    .tlgrid {
      position: relative;
    }
    .tlhead {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      height: 26px;
    }
    .tlcorner {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      background: inherit;
      z-index: 2;
    }
    .tlhours {
      position: relative;
    }
    .tlhour {
      position: absolute;
      top: 5px;
      transform: translateX(-50%);
      font-size: 10.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .tlrow {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
    }
    .tlperson {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      box-sizing: border-box;
      border-right: 1px solid var(--divider-color);
    }
    .tlperson .pname {
      font-size: 12.5px;
    }
    .tlcanvas {
      position: relative;
      flex: 0 0 auto;
    }
    .tlcanvas.creatable {
      cursor: copy;
    }
    .tlbar {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 7px;
      border-radius: var(--fb-radius);
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .tlbar:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 3;
    }
    .tlbar.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .tlbar .etime {
      flex: 0 0 auto;
    }
    .tlnow {
      position: absolute;
      top: 0;
      bottom: 0;
      border-left: 2px solid var(--fb-now-color);
      z-index: 6;
      pointer-events: none;
    }
    .tlnow span {
      position: absolute;
      top: 2px;
      left: -1px;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* agenda */
    .agenda {
      max-height: 60vh;
      overflow: auto;
      padding: 4px 0 8px;
    }
    .agenda-empty {
      padding: 28px 16px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .agenda-day {
      padding: 0 12px;
    }
    .agenda-date {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
      font-weight: 600;
      font-size: 13px;
      padding: 8px 4px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-date.today {
      color: var(--primary-color);
    }
    .agenda-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      cursor: pointer;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .agenda-time {
      flex: 0 0 92px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .agenda-bar {
      flex: 0 0 4px;
      align-self: stretch;
      border-radius: 2px;
    }
    .agenda-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .agenda-title {
      font-size: 13.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .agenda-meta {
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* month */
    .monthwrap {
      overflow: auto;
      max-height: 62vh;
      padding: 0 8px 8px;
    }
    .monthhead {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
    }
    .mhcell {
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .monthgrid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(64px, 1fr);
    }
    .mcell {
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 3px;
      cursor: pointer;
      overflow: hidden;
      box-sizing: border-box;
    }
    .mcell:nth-child(7n) {
      border-right: none;
    }
    .mcell.out {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 4%, transparent);
    }
    .mcell.out .mdate {
      opacity: 0.45;
    }
    .mcell:hover {
      background: var(--secondary-background-color);
    }
    .mcell.today {
      background: color-mix(in srgb, var(--fb-accent) 7%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--fb-accent);
    }
    .mcell.wkend:not(.today) {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 3.5%, transparent);
    }
    .mdate {
      font-size: 12px;
      font-weight: 600;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
    .mdate.today {
      background: var(--fb-accent);
      color: var(--text-primary-color, #fff);
      border-radius: 50%;
    }
    .mchips {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 2px;
    }
    .mchip {
      font-size: 10px;
      font-weight: 600;
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mmore {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      padding-left: 4px;
    }
    /* weather chip */
    .wx {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      vertical-align: middle;
      font-variant-numeric: tabular-nums;
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 2px 9px 2px 5px;
      margin-left: 6px;
    }
    .wx ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-text-color);
    }
    .agenda-date .wx {
      margin-left: 4px;
    }
    /* faded past events + map link */
    .past {
      opacity: var(--fb-past-opacity);
    }
    /* progress bar inside a running day event */
    .eprog {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: var(--divider-color);
    }
    .eprog > div {
      height: 100%;
      background: var(--fb-now-color);
    }
    /* agenda: countdown + running progress */
    .agenda-cd {
      flex: 0 0 auto;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .agenda-row.current {
      background: color-mix(in srgb, var(--fb-accent) 6%, transparent);
    }
    .agenda-prog {
      display: block;
      height: 3px;
      margin-top: 4px;
      border-radius: 2px;
      background: var(--divider-color);
      overflow: hidden;
    }
    .agenda-prog > span {
      display: block;
      height: 100%;
    }
    .maplink {
      margin-left: 8px;
      font-size: 11px;
      color: var(--primary-color);
      text-decoration: none;
    }
    .maplink:hover {
      text-decoration: underline;
    }
    /* week */
    .weekwrap {
      overflow: auto;
      max-height: 60vh;
    }
    .weekgrid {
      display: grid;
    }
    .corner {
      position: sticky;
      left: 0;
      top: 0;
      z-index: 6;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .wphead {
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      border-left: 1px solid var(--divider-color);
      padding: 8px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .wphead .avatar {
      width: 28px;
      height: 28px;
    }
    .wday {
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 12.5px;
    }
    .wcell {
      min-height: 70px;
      border-left: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .wcell.creatable {
      cursor: copy;
    }
    .wday.today,
    .wcell.today {
      background: color-mix(in srgb, var(--fb-accent) 8%, transparent);
    }
    .wchip {
      border-radius: var(--fb-radius-sm);
      padding: 3px 5px;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
    }
    .wchip span {
      font-size: var(--fb-chip-size);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wchip small {
      margin-left: auto;
      font-size: 8.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    /* focus visibility for a11y */
    button:focus-visible,
    .event:focus-visible,
    .wchip:focus-visible,
    .adchip:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    /* dialog */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99;
      padding: 16px;
    }
    .dialog {
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
      border-radius: 14px;
      padding: 16px;
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
    }
    .dialog button {
      min-width: 48px;
      min-height: 48px;
    }
    .dlg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 16px;
    }
    .dlg-cal {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 2px 0 10px;
    }
    .details-status {
      margin: 8px 0 12px;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font-size: 13px;
    }
    .details-status .retry {
      margin-top: 8px;
    }
    .icon {
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 16px;
    }
    .fld {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-bottom: 10px;
    }
    .fld > span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .row .fld {
      flex: 1 1 200px;
      min-width: 0;
    }
    input,
    textarea,
    select {
      font: inherit;
      font-size: 14px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
      width: 100%;
    }
    input:disabled,
    textarea:disabled {
      opacity: 0.7;
    }
    .recur {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 12px;
      margin-bottom: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--secondary-background-color);
    }
    .recur-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      width: 100%;
    }
    .recur-opt {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .recur-opt input {
      width: auto;
    }
    .chk {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .chk input {
      width: auto;
    }
    .ro-note {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 8px 10px;
      margin-bottom: 10px;
    }
    .dlg-error {
      font-size: 12.5px;
      color: var(--error-color, #ff5252);
      margin-bottom: 10px;
    }
    .dlg-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }
    .dlg-actions .spacer {
      flex: 1;
    }
    .dlg-actions button {
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .ghost {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .danger {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    button:disabled {
      opacity: 0.6;
      cursor: default;
    }
    ${wallShellStyles}
  `;
}

if (!customElements.get("moran-family-board-card")) {
  customElements.define("moran-family-board-card", FamilyBoardCard);
}

// register in the card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "moran-family-board-card",
  name: "Moran Family Board Card",
  description:
    "Family calendar / who-is-where board for multiple people \u2013 day, timeline, week, month and agenda views.",
  preview: true,
  documentationURL: "https://github.com/emilianomoran/moran-family-board-card",
});

console.info(
  "%c MORAN-FAMILY-BOARD-CARD %c v0.25.1-moran.7 ",
  "background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px",
  "background:#222;color:#fff;border-radius:0 3px 3px 0",
);
