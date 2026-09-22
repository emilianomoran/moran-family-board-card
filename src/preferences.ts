import { ALL_VIEWS, normalizeLayout, type FamilyBoardConfig, type ViewName } from "./config";
import {
  DEFAULT_HOUR_HEIGHT,
  HOUR_HEIGHT_MIN,
  HOUR_HEIGHT_MAX,
  DEFAULT_HOUR_WIDTH,
  HOUR_WIDTH_MIN,
  HOUR_WIDTH_MAX,
} from "./calendar-density";

export interface BoardZoom {
  day?: number;
  timeline?: number;
}

export interface BoardPreferences {
  version: 2;
  view: ViewName;
  hidden: number[];
  zoom?: BoardZoom;
}

/** A cache identity, not encryption or an authorization boundary. */
function fingerprint(value: string): string {
  let hash = 0xcbf29ce484222325n;
  for (const char of value) {
    hash ^= BigInt(char.codePointAt(0)!);
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, "0");
}

/** Never reuse positional filters after the lane definitions or their order change. */
export function preferencesKey(
  config: FamilyBoardConfig,
  path: string,
  userId?: string,
): string | undefined {
  const enabled = config.remember_preferences ?? normalizeLayout(config.layout) === "wall";
  if (!enabled || !userId) return undefined;
  const identity = JSON.stringify({
    path,
    userId,
    card: config.preferences_key ?? config.title ?? "",
    layout: normalizeLayout(config.layout),
    view: config.view ?? "day",
    views: ALL_VIEWS.filter((view) => !config.views?.length || config.views.includes(view)),
    persons: config.persons.map((p) => ({
      name: p.name,
      person: p.person,
      calendar: p.calendar,
      prefixes: p.match_title_prefixes,
      contains: p.match_title_contains,
      regex: p.match_title_regex,
      unmatched: p.unmatched,
      hidden: p.hidden === true,
    })),
  });
  return `moran-family-board:preferences:v1:${fingerprint(identity)}`;
}

// Keep the v1 identity namespace so existing view/filter records remain discoverable.
// Payload v2 adds optional zoom; the controller rewrites accepted records on restore.
function zoomDefaults(config: FamilyBoardConfig, view: keyof BoardZoom): string {
  return fingerprint(
    JSON.stringify(
      view === "day"
        ? [config.hour_height ?? DEFAULT_HOUR_HEIGHT, config.fit_height === true]
        : [config.hour_width ?? DEFAULT_HOUR_WIDTH],
    ),
  );
}

function validDensity(value: unknown, view: keyof BoardZoom): value is number {
  const [min, max] =
    view === "day" ? [HOUR_HEIGHT_MIN, HOUR_HEIGHT_MAX] : [HOUR_WIDTH_MIN, HOUR_WIDTH_MAX];
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

function readZoom(value: unknown, config?: FamilyBoardConfig): BoardZoom | undefined {
  if (!config || normalizeLayout(config.layout) !== "wall" || !value || typeof value !== "object")
    return undefined;
  const zoom: BoardZoom = {};
  for (const view of ["day", "timeline"] as const) {
    const entry = (value as Record<string, unknown>)[view];
    if (!entry || typeof entry !== "object") continue;
    const saved = entry as Record<string, unknown>;
    if (saved.defaults === zoomDefaults(config, view) && validDensity(saved.value, view))
      zoom[view] = saved.value;
  }
  return Object.keys(zoom).length ? zoom : undefined;
}

export function readPreferences(
  storage: Pick<Storage, "getItem">,
  key: string,
  enabledViews: ViewName[],
  peopleCount: number,
  config?: FamilyBoardConfig,
): BoardPreferences | undefined {
  try {
    const raw = storage.getItem(key);
    if (!raw || raw.length > 2048) return undefined;
    const value = JSON.parse(raw);
    if (
      (value?.version !== 1 && value?.version !== 2) ||
      !enabledViews.includes(value.view) ||
      !Array.isArray(value.hidden) ||
      value.hidden.length > peopleCount ||
      !value.hidden.every(
        (i: unknown) => Number.isInteger(i) && Number(i) >= 0 && Number(i) < peopleCount,
      )
    )
      return undefined;
    const zoom = value.version === 2 ? readZoom(value.zoom, config) : undefined;
    return {
      version: 2,
      view: value.view,
      hidden: [...new Set<number>(value.hidden)],
      ...(zoom ? { zoom } : {}),
    };
  } catch {
    return undefined;
  }
}

export function writePreferences(
  storage: Pick<Storage, "setItem">,
  key: string,
  view: ViewName,
  hidden: number[],
  config?: FamilyBoardConfig,
  zoom?: BoardZoom,
): void {
  try {
    // Only UI choices, never events, names, entity IDs, or authentication data.
    const savedZoom: Partial<Record<keyof BoardZoom, { value: number; defaults: string }>> = {};
    if (config && normalizeLayout(config.layout) === "wall") {
      for (const name of ["day", "timeline"] as const) {
        const value = zoom?.[name];
        if (validDensity(value, name))
          savedZoom[name] = { value, defaults: zoomDefaults(config, name) };
      }
    }
    storage.setItem(
      key,
      JSON.stringify({
        version: 2,
        view,
        hidden,
        ...(Object.keys(savedZoom).length ? { zoom: savedZoom } : {}),
      }),
    );
  } catch {
    // Blocked or full storage must not prevent calendar use.
  }
}
