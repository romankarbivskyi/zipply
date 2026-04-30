import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/[code]/route";
import { getLinkByShortCode } from "@/data/links";
import { getRequestContext } from "@/lib/server-utils";
import { NextResponse, after } from "next/server";
import { tinybird } from "@/lib/tinybird";
import { prisma } from "@/lib/db";
import type { Link } from "@/lib/generated/prisma/client";
import type { RequestContext } from "@/types/request";

vi.mock("@/data/links", () => ({
  getLinkByShortCode: vi.fn(),
}));

vi.mock("@/lib/server-utils", () => ({
  getRequestContext: vi.fn(),
}));

vi.mock("next/server", () => {
  return {
    NextResponse: {
      redirect: vi.fn((url) => ({ status: 307, url })),
    },
    after: vi.fn((cb) => cb()),
  };
});

vi.mock("@/lib/tinybird", () => ({
  tinybird: {
    clicks: {
      ingest: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    link: {
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe("GET /[code]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRequest = new Request("http://localhost:3000/xyz", {
    headers: new Headers({
      "user-agent": "test-agent",
    }),
  });

  it("redirects to home if link not found", async () => {
    vi.mocked(getLinkByShortCode).mockResolvedValueOnce(null);

    const response = await GET(mockRequest, {
      params: Promise.resolve({ code: "notfound" }),
    });

    expect(response.status).toBe(307);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/", mockRequest.url),
    );
  });

  it("redirects and tracks for normal requests", async () => {
    vi.mocked(getLinkByShortCode).mockResolvedValueOnce({
      id: "link1",
      originalUrl: "https://example.com",
      userId: "user1",
    } as Link);

    vi.mocked(getRequestContext).mockResolvedValue({
      ip: "127.0.0.1",
      country: "US",
      city: "NY",
      device: "Desktop",
      os: "Windows",
      browser: "Chrome",
    } satisfies RequestContext);

    const response = await GET(mockRequest, {
      params: Promise.resolve({ code: "found" }),
    });

    expect(response.status).toBe(307);
    expect(NextResponse.redirect).toHaveBeenCalledWith("https://example.com");

    expect(after).toHaveBeenCalled();

    expect(tinybird.clicks.ingest).toHaveBeenCalledWith(
      expect.objectContaining({
        link_id: "link1",
        user_id: "user1",
      }),
    );
    expect(prisma.link.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "link1" },
        data: { clicks: { increment: 1 } },
      }),
    );
  });

  it("handles missing getRequestContext params gracefully during tracking", async () => {
    vi.mocked(getLinkByShortCode).mockResolvedValueOnce({
      id: "link1",
      originalUrl: "https://example.com",
      userId: "user1",
    } as Link);

    vi.mocked(getRequestContext).mockResolvedValue({
      country: "Unknown",
      city: "Unknown",
      device: "Unknown",
      os: "Unknown",
      browser: "Unknown",
    } satisfies RequestContext);

    await GET(mockRequest, { params: Promise.resolve({ code: "found" }) });

    expect(after).toHaveBeenCalled();
    expect(tinybird.clicks.ingest).toHaveBeenCalledWith(
      expect.objectContaining({
        country: "Unknown",
        ip_hash: null,
      }),
    );
  });
});
