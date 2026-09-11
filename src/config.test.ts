import { describe, expect, it } from "vitest";
import {
  normalizeLayout,
  withLayout,
  type FamilyBoardConfig,
  type FamilyBoardLayout,
} from "./config";

describe("normalizeLayout", () => {
  it.each([
    ["a missing value", undefined],
    ["an explicit default", "default"],
    ["an unknown string", "wide"],
    ["a case variant", "Wall"],
    ["a truthy non-string", { wall: true }],
  ])("keeps legacy behavior for %s", (_label, value) => {
    expect(normalizeLayout(value)).toBe("default");
  });

  it("opts in only for the exact wall value", () => {
    expect(normalizeLayout("wall")).toBe("wall");
  });
});

describe("withLayout", () => {
  const config = {
    type: "custom:moran-family-board-card",
    persons: [{ name: "Person A", calendar: "calendar.person_a" }],
    calendars: { "calendar.person_a": { label: "Primary" } },
    future_option: { enabled: true },
  } as FamilyBoardConfig & { future_option: { enabled: boolean } };

  it("writes the exact wall discriminator to a new config", () => {
    const result = withLayout(config, "wall");

    expect(result).not.toBe(config);
    expect(result.layout).toBe("wall");
  });

  it("deletes the layout key when Default is selected", () => {
    const input: FamilyBoardConfig = { ...config, layout: "wall" };
    const result = withLayout(input, "default");

    expect(result).not.toBe(input);
    expect("layout" in result).toBe(false);
    expect(input.layout).toBe("wall");
  });

  it.each<FamilyBoardLayout>(["default", "wall"])(
    "preserves unknown and nested metadata when serializing %s",
    (layout) => {
      const result = withLayout(config, layout) as typeof config;

      expect(result.future_option).toBe(config.future_option);
      expect(result.persons).toBe(config.persons);
      expect(result.calendars).toBe(config.calendars);
      expect(config).not.toHaveProperty("layout");
    },
  );
});
