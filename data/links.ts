import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { Link } from "@/lib/generated/prisma/client";
import { LINKS_PER_PAGE } from "@/constants";
import { logger } from "@/lib/logger";
import { tinybird, type DashboardMetricsOutput } from "@/lib/tinybird";

export interface DashboardMetrics {
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
}

export const fetchFilteredLinks = async (
  search: string,
  currentPage: number,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const offset = (currentPage - 1) * LINKS_PER_PAGE;

  const links = await prisma.link.findMany({
    where: {
      userId: session.user.id,
      ...(search
        ? {
            OR: [
              { originalUrl: { contains: search, mode: "insensitive" } },
              { shortCode: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: LINKS_PER_PAGE,
  });

  return links;
};

export const fetchLinksPages = async (search: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { totalPages: 0, totalLinks: 0 };
  }

  const count = await prisma.link.count({
    where: {
      userId: session.user.id,
      ...(search
        ? {
            OR: [
              { originalUrl: { contains: search, mode: "insensitive" } },
              { shortCode: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });

  return {
    totalPages: Math.ceil(count / LINKS_PER_PAGE),
    totalLinks: count,
  };
};

export const getLinkByShortCode = async (
  shortCode: string,
): Promise<Link | null> => {
  const getCachedLink = unstable_cache(
    async () => {
      try {
        return await prisma.link.findUnique({
          where: { shortCode },
        });
      } catch {
        return null;
      }
    },
    [`link-code-${shortCode}`],
    {
      tags: [`link-code-${shortCode}`, "links"],
      revalidate: 3600,
    },
  );

  return getCachedLink();
};

export const getLinkById = async (id: string): Promise<Link | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const link = await prisma.link.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  return link;
};

export const getDashboardMetrics = async (
  fromDate?: string,
  toDate?: string,
  country?: string,
  device?: string,
): Promise<DashboardMetrics> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { totalLinks: 0, totalClicks: 0, uniqueVisitors: 0 };

  if (!fromDate || !toDate)
    return { totalLinks: 0, totalClicks: 0, uniqueVisitors: 0 };

  try {
    const [linksCount, metricsData] = await Promise.all([
      prisma.link.count({
        where: {
          userId: session.user.id,
        },
      }),
      tinybird.dashboardMetrics.query({
        user_id: session.user.id,
        from_date: fromDate,
        to_date: toDate,
        country: country || "",
        device: device || "",
      }),
    ]);

    const metrics = metricsData.data[0] as DashboardMetricsOutput;

    return {
      totalLinks: linksCount,
      totalClicks: Number(metrics.total_clicks),
      uniqueVisitors: Number(metrics.unique_visitors),
    };
  } catch (error) {
    logger.error({ error }, "Failed to fetch dashboard metrics");
    return { totalLinks: 0, totalClicks: 0, uniqueVisitors: 0 };
  }
};
