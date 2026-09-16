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
      version: 1,
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
    '{"version":2,"view":"week","hidden":[]}',
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
    expect([...stored]).toEqual([["fixture-key", '{"version":1,"view":"week","hidden":[1]}']]);
  });
});
