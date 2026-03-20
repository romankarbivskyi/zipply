import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Link } from "@/lib/generated/prisma/client";

const LINKS_PER_PAGE = 10;

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

export async function fetchLinksPages(search: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return 0;
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

  return Math.ceil(count / LINKS_PER_PAGE);
}

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

const getPeriodStartDate = (period: string) => {
  const now = new Date();
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getUserLinkIds = async (userId: string, linkId?: string) => {
  if (linkId) {
    const link = await prisma.link.findFirst({
      where: { id: linkId, userId },
      select: { id: true },
    });
    return link ? [link.id] : [];
  }

  const links = await prisma.link.findMany({
    where: { userId },
    select: { id: true },
  });
  return links.map((l) => l.id);
};

export const getClicksOverTime = async (period: string, linkId?: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  const linkIds = await getUserLinkIds(session.user.id, linkId);
  if (linkIds.length === 0) return [];

  const startDate = getPeriodStartDate(period);

  const clicks = await prisma.click.findMany({
    where: {
      linkId: { in: linkIds },
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
      ipAddress: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const dailyMap = new Map<
    string,
    { clicks: number; uniqueVisitors: Set<string> }
  >();

  for (const click of clicks) {
    const dateKey = click.createdAt.toISOString().split("T")[0];
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { clicks: 0, uniqueVisitors: new Set() });
    }
    const entry = dailyMap.get(dateKey)!;
    entry.clicks += 1;
    if (click.ipAddress) {
      entry.uniqueVisitors.add(click.ipAddress);
    }
  }

  const now = new Date();
  const current = new Date(startDate);
  while (current <= now) {
    const dateKey = current.toISOString().split("T")[0];
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { clicks: 0, uniqueVisitors: new Set() });
    }
    current.setDate(current.getDate() + 1);
  }

  return Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      clicks: data.clicks,
      uniqueVisitors: data.uniqueVisitors.size || data.clicks,
    }));
};

export const getCountriesData = async (period: string, linkId?: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  const linkIds = await getUserLinkIds(session.user.id, linkId);
  if (linkIds.length === 0) return [];

  const startDate = getPeriodStartDate(period);

  const data = await prisma.click.groupBy({
    by: ["country"],
    where: {
      linkId: { in: linkIds },
      createdAt: { gte: startDate },
      country: { not: null },
    },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 6,
  });

  return data.map((item) => ({
    country: item.country || "Unknown",
    visitors: item._count.id,
  }));
};

export const getDevicesData = async (period: string, linkId?: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  const linkIds = await getUserLinkIds(session.user.id, linkId);
  if (linkIds.length === 0) return [];

  const startDate = getPeriodStartDate(period);

  const data = await prisma.click.groupBy({
    by: ["device"],
    where: {
      linkId: { in: linkIds },
      createdAt: { gte: startDate },
    },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const colorMap: Record<string, string> = {
    desktop: "var(--color-desktop)",
    mobile: "var(--color-mobile)",
    tablet: "var(--color-tablet)",
  };

  return data.map((item) => {
    const device = (item.device || "other").toLowerCase();
    return {
      device,
      visitors: item._count.id,
      fill: colorMap[device] || "var(--color-other)",
    };
  });
};

export const getDashboardMetrics = async (
  period: string,
): Promise<DashboardMetrics> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { totalLinks: 0, totalClicks: 0, uniqueVisitors: 0 };

  const startDate = getPeriodStartDate(period);

  const [totalLinks, totalClicks, uniqueVisitors] = await Promise.all([
    prisma.link.count({
      where: {
        userId: session.user.id,
      },
    }),
    prisma.click.count({
      where: {
        link: { userId: session.user.id },
        createdAt: { gte: startDate },
      },
    }),
    prisma.click.groupBy({
      by: ["ipAddress"],
      where: {
        link: { userId: session.user.id },
        ipAddress: { not: null },
        createdAt: { gte: startDate },
      },
    }),
  ]);

  return {
    totalLinks,
    totalClicks,
    uniqueVisitors: uniqueVisitors.length,
  };
};
