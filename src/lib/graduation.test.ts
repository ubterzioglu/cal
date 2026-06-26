import { describe, it, expect } from "vitest";
import {
  GRADUATION_START_YEAR,
  GRADUATION_END_YEAR,
  GRADUATION_SKIP_YEAR,
  GRADUATION_START_TERM,
  isValidGraduationYear,
  getTermByYear,
  getYearByTerm,
  getGraduationYears,
  getGraduationTerms,
} from "./graduation";

describe("isValidGraduationYear", () => {
  it("accepts the first and last valid years", () => {
    expect(isValidGraduationYear(GRADUATION_START_YEAR)).toBe(true);
    expect(isValidGraduationYear(GRADUATION_END_YEAR)).toBe(true);
  });

  it("rejects years outside the range", () => {
    expect(isValidGraduationYear(GRADUATION_START_YEAR - 1)).toBe(false);
    expect(isValidGraduationYear(GRADUATION_END_YEAR + 1)).toBe(false);
  });

  it("rejects the skipped year", () => {
    expect(isValidGraduationYear(GRADUATION_SKIP_YEAR)).toBe(false);
  });
});

describe("getTermByYear", () => {
  it("returns the start term for the start year", () => {
    expect(getTermByYear(GRADUATION_START_YEAR)).toBe(GRADUATION_START_TERM);
  });

  it("returns null for an invalid year", () => {
    expect(getTermByYear(GRADUATION_SKIP_YEAR)).toBeNull();
    expect(getTermByYear(1980)).toBeNull();
  });

  it("offsets by one for years after the skipped year", () => {
    // 2009 is before the skip → no offset; 2011 is after → offset by 1.
    const term2009 = getTermByYear(2009);
    const term2011 = getTermByYear(2011);
    expect(term2009).not.toBeNull();
    expect(term2011).not.toBeNull();
    // 2009→base, 2011→base-1: 2011 is 2 years after 2009 but only 1 term apart.
    expect((term2011 as number) - (term2009 as number)).toBe(1);
  });
});

describe("getYearByTerm", () => {
  it("is the inverse of getTermByYear for valid years", () => {
    for (const year of getGraduationYears()) {
      const term = getTermByYear(year);
      expect(term).not.toBeNull();
      expect(getYearByTerm(term as number)).toBe(year);
    }
  });

  it("returns null for terms below the start term", () => {
    expect(getYearByTerm(GRADUATION_START_TERM - 1)).toBeNull();
  });
});

describe("getGraduationYears", () => {
  it("excludes the skipped year and stays within bounds", () => {
    const years = getGraduationYears();
    expect(years).not.toContain(GRADUATION_SKIP_YEAR);
    expect(years[0]).toBe(GRADUATION_START_YEAR);
    expect(years[years.length - 1]).toBe(GRADUATION_END_YEAR);
  });

  it("has one fewer entry than the full inclusive range (skip year removed)", () => {
    const fullRange = GRADUATION_END_YEAR - GRADUATION_START_YEAR + 1;
    expect(getGraduationYears()).toHaveLength(fullRange - 1);
  });
});

describe("getGraduationTerms", () => {
  it("produces a term for every valid year", () => {
    expect(getGraduationTerms()).toHaveLength(getGraduationYears().length);
  });

  it("produces strictly increasing, unique terms", () => {
    const terms = getGraduationTerms();
    const sorted = [...terms].sort((a, b) => a - b);
    expect(terms).toEqual(sorted);
    expect(new Set(terms).size).toBe(terms.length);
  });
});
