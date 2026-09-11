import type { LovelaceCardConfig } from "custom-card-helpers";

export type ViewName = "day" | "week" | "month" | "agenda" | "timeline";

export const ALL_VIEWS: ViewName[] = ["day", "timeline", "week", "month", "agenda"];

export type FamilyBoardLayout = "default" | "wall";

export const DEFAULT_LAYOUT: FamilyBoardLayout = "default";

export interface PersonConfig {
  name?: string;
  person?: string;
  calendar?: string | string[];
  color?: string;
  badges?: string[];
  hidden?: boolean;
  match_title_prefixes?: string[];
  match_title_contains?: string[];
  match_title_regex?: string[];
  unmatched?: boolean;
  strip_title_prefix?: boolean;
}

export interface FamilyBoardConfig extends LovelaceCardConfig {
  persons: PersonConfig[];
  layout?: FamilyBoardLayout;
  title?: string;
  view?: ViewName;
  views?: ViewName[];
  time_grid?: 15 | 30 | 60;
  start_hour?: number;
  end_hour?: number;
  show_weekends?: boolean;
  show_now_line?: boolean;
  color_by?: "person" | "location" | "calendar";
  dim_past?: boolean;
  hide_patterns?: string[];
  show_patterns?: string[];
  replace_patterns?: string[];
  filter_duplicates?: boolean;
  calendars?: Record<
    string,
    { color?: string; label?: string; icon?: string; title_field?: string }
  >;
  tentative_patterns?: string[];
  auto_icons?: boolean;
  icon_patterns?: string[];
  show_focus?: boolean;
  drag_drop?: boolean;
  compact?: boolean;
  map_url?: string;
  show_progress?: boolean;
  weather_entity?: string;
  show_weather?: boolean;
  refresh_interval?: number;
  hour_height?: number;
  hour_width?: number;
  fit_height?: boolean;
  full_height?: boolean;
  col_min_width?: number;
  event_size?: number;
  radius?: number;
  past_opacity?: number;
  hide_empty_persons?: boolean;
  auto_return?: number;
  trim_hours?: boolean;
  background_hours?: number;
  max_columns?: number;
  first_day?: "monday" | "sunday";
  scroll_to_now?: boolean;
}

/** Only the exact public opt-in selects wall mode. */
export function normalizeLayout(value: unknown): FamilyBoardLayout {
  return value === "wall" ? "wall" : DEFAULT_LAYOUT;
}

/** Serialize a layout choice without mutating or narrowing the dashboard config. */
export function withLayout<T extends FamilyBoardConfig>(config: T, layout: FamilyBoardLayout): T {
  const next = { ...config };
  if (layout === "wall") next.layout = "wall";
  else delete next.layout;
  return next;
}
