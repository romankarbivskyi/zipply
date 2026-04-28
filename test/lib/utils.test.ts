import { describe, it, expect } from "vitest";
import {
  cn,
  formatNumberWithSuffix,
  formatDate,
  generatePagination,
  getShortLink,
  getParam,
} from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("w-full", "px-4 py-2", { "bg-red-500": true })).toBe(
        "w-full px-4 py-2 bg-red-500",
      );
      expect(cn("p-4", "p-8")).toBe("p-8");
    });
  });

  describe("formatNumberWithSuffix", () => {
    it("formats millions", () => {
      expect(formatNumberWithSuffix(1500000)).toBe("1.5M");
    });
    it("formats thousands", () => {
      expect(formatNumberWithSuffix(1500)).toBe("1.5K");
    });
    it("formats numbers less than 1000", () => {
      expect(formatNumberWithSuffix(999)).toBe("999");
    });
  });

  describe("formatDate", () => {
    it("formats date into US locale", () => {
      const d = new Date("2023-12-15T00:00:00Z");
      expect(formatDate(d)).toContain("15");
      expect(formatDate(d)).toContain("2023");
    });
  });

  describe("generatePagination", () => {
    it("returns array up to total when total <= 7", () => {
      expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });
    it("returns correct ellipsis pattern when current page <= 3", () => {
      expect(generatePagination(2, 10)).toEqual([1, 2, 3, "...", 9, 10]);
    });
    it("returns correct ellipsis pattern when current page >= total - 2", () => {
      expect(generatePagination(9, 10)).toEqual([1, 2, "...", 8, 9, 10]);
    });
    it("returns correct ellipsis pattern when current page is in the middle", () => {
      expect(generatePagination(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
    });
  });

  describe("getShortLink", () => {
    it("prepends base url", () => {
      const originalEnv = process.env.NEXT_PUBLIC_BASE_URL;
      process.env.NEXT_PUBLIC_BASE_URL = "http://test.com";
      expect(getShortLink("xyz")).toBe("http://test.com/xyz");
      process.env.NEXT_PUBLIC_BASE_URL = originalEnv;
    });
  });

  describe("getParam", () => {
    it("returns first element of array", () => {
      expect(getParam(["a", "b"])).toBe("a");
    });
    it("returns empty string for empty array", () => {
      expect(getParam([])).toBe("");
    });
    it("returns string exactly if passed a string", () => {
      expect(getParam("x")).toBe("x");
    });
    it("returns empty string if undefined", () => {
      expect(getParam(undefined)).toBe("");
    });
  });
});
