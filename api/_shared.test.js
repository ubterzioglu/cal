import { describe, it, expect } from "vitest";
import {
  trimText,
  clampList,
  filterStringList,
  hashText,
} from "./_shared.js";

describe("trimText", () => {
  it("trims surrounding whitespace", () => {
    expect(trimText("  hello  ")).toBe("hello");
  });

  it("returns an empty string for non-string input", () => {
    expect(trimText(undefined)).toBe("");
    expect(trimText(null)).toBe("");
    expect(trimText(42)).toBe("");
    expect(trimText({})).toBe("");
  });
});

describe("clampList", () => {
  it("limits the list to the given size", () => {
    expect(clampList([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
  });

  it("returns the whole list when under the limit", () => {
    expect(clampList([1, 2], 5)).toEqual([1, 2]);
  });
});

describe("filterStringList", () => {
  it("keeps only non-empty strings", () => {
    expect(
      filterStringList(["a", "", "  ", "b", 1, null, undefined, "c"]),
    ).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array when nothing qualifies", () => {
    expect(filterStringList([" ", "", 0, false, null])).toEqual([]);
  });
});

describe("hashText", () => {
  it("is deterministic for the same input (dedup guarantee)", () => {
    expect(hashText("alice:2020:+90555")).toBe(hashText("alice:2020:+90555"));
  });

  it("produces different hashes for different input", () => {
    expect(hashText("alice")).not.toBe(hashText("bob"));
  });

  it("returns a 64-char hex sha256 digest", () => {
    const digest = hashText("x");
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
  });
});
