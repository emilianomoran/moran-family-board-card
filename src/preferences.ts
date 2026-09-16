import { ALL_VIEWS, normalizeLayout, type FamilyBoardConfig, type ViewName } from "./config";

export interface BoardPreferences {
  version: 1;
  view: ViewName;
  hidden: number[];
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

export function readPreferences(
  storage: Pick<Storage, "getItem">,
  key: string,
  enabledViews: ViewName[],
  peopleCount: number,
): BoardPreferences | undefined {
  try {
    const raw = storage.getItem(key);
    if (!raw || raw.length > 2048) return undefined;
    const value = JSON.parse(raw);
    if (
      value?.version !== 1 ||
      !enabledViews.includes(value.view) ||
      !Array.isArray(value.hidden) ||
      value.hidden.length > peopleCount ||
      !value.hidden.every(
        (i: unknown) => Number.isInteger(i) && Number(i) >= 0 && Number(i) < peopleCount,
      )
    )
      return undefined;
    return { version: 1, view: value.view, hidden: [...new Set<number>(value.hidden)] };
  } catch {
    return undefined;
  }
}

export function writePreferences(
  storage: Pick<Storage, "setItem">,
  key: string,
  view: ViewName,
  hidden: number[],
): void {
  try {
    // Only UI choices, never events, names, entity IDs, or authentication data.
    storage.setItem(key, JSON.stringify({ version: 1, view, hidden }));
  } catch {
    // Blocked or full storage must not prevent calendar use.
  }
}
