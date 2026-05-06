import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchFilteredLinks,
  fetchLinksPages,
  getLinkByShortCode,
  getLinkById,
  getDashboardMetrics,
} from "@/data/links";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { tinybird } from "@/lib/tinybird";
import { unstable_cache } from "next/cache";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("next/cache", () => ({
  unstable_cache: vi.fn((cb) => cb),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    link: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/tinybird", () => ({
  tinybird: {
    dashboardMetrics: { query: vi.fn() },
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("data/links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("auth-dependent functions", () => {
    it("fetchFilteredLinks returns empty array when no session exists", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const result = await fetchFilteredLinks("", 1);
      expect(result).toEqual([]);
      expect(prisma.link.findMany).not.toHaveBeenCalled();
    });

    it("fetchFilteredLinks queries prisma with user id", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: "user123" },
      } as any);

      vi.mocked(prisma.link.findMany).mockResolvedValueOnce([]);

      await fetchFilteredLinks("searchterm", 2);

      expect(prisma.link.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: "user123",
            OR: [
              { originalUrl: { contains: "searchterm", mode: "insensitive" } },
              { shortCode: { contains: "searchterm", mode: "insensitive" } },
            ],
          }),
          skip: 5,
          take: 5,
        }),
      );
    });

    it("getLinkById ensures the link belongs to the session user", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: "user123" },
      } as any);

      await getLinkById("linkABC");

      expect(prisma.link.findUnique).toHaveBeenCalledWith({
        where: {
          id: "linkABC",
          userId: "user123",
        },
      });
    });

    it("getDashboardMetrics combines prisma count and tinybird metrics", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce({
        user: { id: "user123" },
      } as any);

      vi.mocked(prisma.link.count).mockResolvedValueOnce(42);
      vi.mocked(tinybird.dashboardMetrics.query).mockResolvedValueOnce({
        data: [{ total_clicks: 150, unique_visitors: 99 }],
      } as any);

      const result = await getDashboardMetrics("2024-01-01", "2024-01-31");

      expect(result).toEqual({
        totalLinks: 42,
        totalClicks: 150,
        uniqueVisitors: 99,
      });

      expect(tinybird.dashboardMetrics.query).toHaveBeenCalledWith({
        user_id: "user123",
        from_date: "2024-01-01",
        to_date: "2024-01-31",
        country: "",
        device: "",
      });
    });
  });

  describe("getLinkByShortCode", () => {
    it("uses unstable_cache and finds link by code", async () => {
      vi.mocked(prisma.link.findUnique).mockResolvedValueOnce({
        id: "link-id",
        shortCode: "xyz",
      } as any);

      const result = await getLinkByShortCode("xyz");

      expect(unstable_cache).toHaveBeenCalled();
      expect(prisma.link.findUnique).toHaveBeenCalledWith({
        where: { shortCode: "xyz" },
      });
      expect(result).toHaveProperty("id", "link-id");
    });
  });
});
