import { describe, expect, it } from "vitest";
import type { FamilyBoardConfig } from "./config";
import { preferencesKey, readPreferences, writePreferences } from "./preferences";

const config: FamilyBoardConfig = {
  type: "custom:moran-family-board-card",
  layout: "wall",
  title: "Fixture board",
  persons: [
    { name: "Avery", calendar: "calendar.fixture_a", match_title_prefixes: ["Avery:"] },
    { name: "Jordan", calendar: "calendar.fixture_b", hidden: true },
  ],
};
const key = (value = config, path = "/fixture/calendar", user = "fixture-user") =>
  preferencesKey(value, path, user);

describe("preference identity", () => {
  it("enables wall defaults, but requires a user and an opt-in for legacy", () => {
    expect(key()).toMatch(/^moran-family-board:preferences:v1:[a-f0-9]{16}$/);
    expect(preferencesKey(config, "/fixture", undefined)).toBeUndefined();
    expect(key({ ...config, remember_preferences: false })).toBeUndefined();
    expect(key({ ...config, layout: "default" })).toBeUndefined();
    expect(key({ ...config, layout: "default", remember_preferences: true })).toBeDefined();
  });

  it("separates users, dashboard paths, titles, and explicit card IDs", () => {
    expect(key(config, "/fixture/calendar", "another-user")).not.toBe(key());
    expect(key(config, "/fixture/another")).not.toBe(key());
    expect(key({ ...config, title: "Another board" })).not.toBe(key());
    expect(key({ ...config, preferences_key: "one" })).not.toBe(
      key({ ...config, preferences_key: "two" }),
    );
    expect(key({ ...config, preferences_key: "one" })).toBe(
      key({ ...config, preferences_key: "one", title: "Changed title" }),
    );
  });

  it("invalidates positional preferences when lane definitions/order change", () => {
    expect(key({ ...config, persons: [...config.persons].reverse() })).not.toBe(key());
    for (const change of [
      { name: "New name" },
      { person: "person.fixture" },
      { calendar: "calendar.fixture_changed" },
      { match_title_prefixes: ["Other:"] },
      { match_title_contains: ["Other"] },
      { match_title_regex: ["^Other"] },
      { unmatched: true },
      { hidden: true },
    ]) {
      expect(
        key({ ...config, persons: [{ ...config.persons[0], ...change }, config.persons[1]] }),
      ).not.toBe(key());
    }
  });

  it("invalidates changed views/defaults but ignores harmless appearance settings", () => {
    expect(key({ ...config, view: "week" })).not.toBe(key());
    expect(key({ ...config, views: ["day", "week"] })).not.toBe(key());
    expect(key({ ...config, views: ["day", "week"] })).toBe(
      key({ ...config, views: ["week", "day"] }),
    );
    expect(key({ ...config, show_focus: true, hour_height: 80 })).toBe(key());
    expect(
      key({ ...config, persons: config.persons.map((p) => ({ ...p, color: "#abcdef" })) }),
    ).toBe(key());
  });

  it("never embeds raw household identities in the storage key", () => {
    for (const raw of ["Avery", "calendar.fixture", "fixture-user", "Fixture board", "/fixture/"]) {
      expect(key()).not.toContain(raw);
    }
  });
});

describe("stored preferences", () => {
  const read = (raw: string | null) =>
    readPreferences({ getItem: () => raw }, "key", ["day", "week"], 2);
  it("reads and deduplicates a valid payload while dropping unknown fields", () => {
    expect(read('{"version":1,"view":"week","hidden":[1,1],"events":[]}')).toEqual({
      version: 2,
      view: "week",
      hidden: [1],
    });
  });

  it.each([
    null,
    "",
    "{",
    "null",
    "[]",
    "true",
    "{}",
    '{"version":3,"view":"week","hidden":[]}',
    '{"version":1,"view":"month","hidden":[]}',
    '{"version":1,"view":"week","hidden":[-1]}',
    '{"version":1,"view":"week","hidden":[2]}',
    '{"version":1,"view":"week","hidden":[0.5]}',
    '{"version":1,"view":"week","hidden":["1"]}',
    '{"version":1,"view":"week","hidden":[null]}',
    '{"version":1,"view":"week","hidden":[0,1,1]}',
    '{"version":1,"view":"week","hidden":{}}',
    " ".repeat(2049),
  ])("ignores malformed or incompatible storage: %s", (raw) => {
    expect(read(raw)).toBeUndefined();
  });

  it("tolerates blocked reads and writes", () => {
    expect(
      readPreferences(
        {
          getItem: () => {
            throw new Error("blocked");
          },
        },
        "key",
        ["day"],
        2,
      ),
    ).toBeUndefined();
    expect(() =>
      writePreferences(
        {
          setItem: () => {
            throw new Error("quota");
          },
        },
        "key",
        "day",
        [0],
      ),
    ).not.toThrow();
  });

  it("writes only version, view, and hidden indices", () => {
    const stored = new Map<string, string>();
    writePreferences(
      {
        setItem: (name, value) => {
          stored.set(name, value);
        },
      },
      "fixture-key",
      "week",
      [1],
    );
    expect([...stored]).toEqual([["fixture-key", '{"version":2,"view":"week","hidden":[1]}']]);
  });
});

describe("saved zoom", () => {
  const memory = () => {
    let raw: string | null = null;
    return {
      getItem: () => raw,
      setItem: (_key: string, value: string) => {
        raw = value;
      },
    };
  };
  const read = (storage: ReturnType<typeof memory>, cfg = config) =>
    readPreferences(storage, "key", ["day", "timeline", "week"], 2, cfg);

  it("round-trips both densities without serializing config, events or unknown fields", () => {
    const storage = memory();
    writePreferences(storage, "key", "week", [1], config, { day: 80, timeline: 160 });
    expect(read(storage)).toEqual({
      version: 2,
      view: "week",
      hidden: [1],
      zoom: { day: 80, timeline: 160 },
    });
    const payload = JSON.parse(storage.getItem()!);
    expect(Object.keys(payload).sort()).toEqual(["hidden", "version", "view", "zoom"]);
    for (const name of ["day", "timeline"]) {
      expect(Object.keys(payload.zoom[name]).sort()).toEqual(["defaults", "value"]);
      expect(payload.zoom[name].defaults).toMatch(/^[a-f0-9]{16}$/);
    }
    expect(storage.getItem()).not.toContain("Avery");
    expect(storage.getItem()).not.toContain("calendar.fixture");
  });

  it("migrates v1 view/filters without accepting invented zoom fields", () => {
    const storage = memory();
    writePreferences(storage, "key", "week", [1], config, { day: 80 });
    const payload = JSON.parse(storage.getItem()!);
    payload.version = 1;
    storage.setItem("key", JSON.stringify(payload));
    expect(read(storage)).toEqual({ version: 2, view: "week", hidden: [1] });
    const saved = read(storage)!;
    writePreferences(storage, "key", saved.view, saved.hidden, config, { timeline: 200 });
    expect(JSON.parse(storage.getItem()!).version).toBe(2);
    expect(read(storage)?.zoom).toEqual({ timeline: 200 });
  });

  it("resets only the zoom whose configured defaults changed, not view/filters", () => {
    const storage = memory();
    writePreferences(storage, "key", "week", [1], config, { day: 80, timeline: 160 });
    for (const cfg of [
      { ...config, hour_height: 72 },
      { ...config, fit_height: true },
    ]) {
      expect(read(storage, cfg)).toEqual({
        version: 2,
        view: "week",
        hidden: [1],
        zoom: { timeline: 160 },
      });
    }
    expect(read(storage, { ...config, hour_width: 120 })?.zoom).toEqual({ day: 80 });
    expect(
      read(storage, { ...config, hour_width: 96, hour_height: 64, fit_height: false })?.zoom,
    ).toEqual({ day: 80, timeline: 160 });
    expect(read(storage, { ...config, show_focus: true })?.zoom).toEqual({
      day: 80,
      timeline: 160,
    });
  });

  it("removes only the reset override and omits zoom after both resets", () => {
    const storage = memory();
    writePreferences(storage, "key", "day", [1], config, { day: undefined, timeline: 160 });
    expect(read(storage)?.zoom).toEqual({ timeline: 160 });
    writePreferences(storage, "key", "day", [1], config, {});
    expect(read(storage)).toEqual({ version: 2, view: "day", hidden: [1] });
    expect(JSON.parse(storage.getItem()!)).not.toHaveProperty("zoom");
  });

  it.each([39, 97, 0, -1, 80.5, "80", null, {}, [], true, Infinity, NaN])(
    "ignores invalid Day zoom %s without discarding valid UI choices",
    (value) => {
      const storage = memory();
      writePreferences(storage, "key", "week", [1], config, { day: 80, timeline: 160 });
      const payload = JSON.parse(storage.getItem()!);
      payload.zoom.day.value = value;
      storage.setItem("key", JSON.stringify(payload));
      expect(read(storage)).toEqual({
        version: 2,
        view: "week",
        hidden: [1],
        zoom: { timeline: 160 },
      });
    },
  );

  it.each([47, 241, 120.1, "160", null])("ignores invalid Timeline zoom %s", (value) => {
    const storage = memory();
    writePreferences(storage, "key", "day", [], config, { day: 40, timeline: 240 });
    const payload = JSON.parse(storage.getItem()!);
    payload.zoom.timeline.value = value;
    storage.setItem("key", JSON.stringify(payload));
    expect(read(storage)?.zoom).toEqual({ day: 40 });
  });

  it.each([
    null,
    [],
    "80",
    {},
    { day: 80 },
    { day: { value: 80 } },
    { day: { value: 80, defaults: "bad" } },
  ])("discards unsupported zoom shape %s", (zoom) => {
    const storage = memory();
    storage.setItem("key", JSON.stringify({ version: 2, view: "day", hidden: [], zoom }));
    expect(read(storage)).toEqual({ version: 2, view: "day", hidden: [] });
  });

  it("never restores or writes zoom for legacy or missing config", () => {
    const storage = memory();
    writePreferences(storage, "key", "day", [], config, { day: 40, timeline: 48 });
    expect(readPreferences(storage, "key", ["day"], 2)?.zoom).toBeUndefined();
    expect(read(storage, { ...config, layout: "default" })?.zoom).toBeUndefined();
    writePreferences(storage, "key", "day", [], { ...config, layout: "default" }, { day: 80 });
    expect(JSON.parse(storage.getItem()!)).not.toHaveProperty("zoom");
  });
});
