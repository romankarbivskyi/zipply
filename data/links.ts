import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Link } from "@/lib/generated/prisma/client";
import { LINKS_PER_PAGE } from "@/constants";
import { fillMissingDates, dateToISO8601 } from "@/lib/date-utils";
import {
  tinybird,
  type ClicksOverTimeOutput,
  type CountriesDataOutput,
  type DevicesDataOutput,
  type DashboardMetricsOutput,
} from "@/lib/tinybird";

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
  try {
    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    return link;
  } catch {
    return null;
  }
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

export const getClicksOverTime = async (
  linkId?: string,
  fromDate?: string,
  toDate?: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  if (!fromDate || !toDate) return [];

  if (linkId) {
    const link = await prisma.link.findFirst({
      where: { id: linkId, userId: session.user.id },
      select: { id: true },
    });
    if (!link) return [];
  }

  try {
    const data = await tinybird.clicksOverTime.query({
      user_id: session.user.id,
      from_date: dateToISO8601(fromDate),
      to_date: dateToISO8601(toDate),
      link_id: linkId || "",
    });

    const mapped: Array<{
      date: string;
      clicks: number;
      uniqueVisitors: number;
    }> = data.data.map((row: ClicksOverTimeOutput) => ({
      date: row.date,
      clicks: Number(row.clicks),
      uniqueVisitors: Number(row.unique_visitors),
    }));

    return fillMissingDates(mapped, fromDate, toDate) as Array<{
      date: string;
      clicks: number;
      uniqueVisitors: number;
    }>;
  } catch (error) {
    console.error("Failed to fetch clicks over time", { error, linkId });
    return [];
  }
};

export const getCountriesData = async (
  linkId?: string,
  fromDate?: string,
  toDate?: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  if (!fromDate || !toDate) return [];

  if (linkId) {
    const link = await prisma.link.findFirst({
      where: { id: linkId, userId: session.user.id },
      select: { id: true },
    });
    if (!link) return [];
  }

  try {
    const data = await tinybird.countriesData.query({
      user_id: session.user.id,
      from_date: dateToISO8601(fromDate),
      to_date: dateToISO8601(toDate),
      link_id: linkId || "",
    });

    return data.data.map((row: CountriesDataOutput) => ({
      country: row.country,
      visitors: Number(row.visitors),
    }));
  } catch (error) {
    console.error("Failed to fetch countries data", { error, linkId });
    return [];
  }
};

export const getDevicesData = async (
  linkId?: string,
  fromDate?: string,
  toDate?: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  if (!fromDate || !toDate) return [];

  if (linkId) {
    const link = await prisma.link.findFirst({
      where: { id: linkId, userId: session.user.id },
      select: { id: true },
    });
    if (!link) return [];
  }

  try {
    const data = await tinybird.devicesData.query({
      user_id: session.user.id,
      from_date: dateToISO8601(fromDate),
      to_date: dateToISO8601(toDate),
      link_id: linkId || "",
    });

    const colorMap: Record<string, string> = {
      desktop: "var(--color-desktop)",
      mobile: "var(--color-mobile)",
      tablet: "var(--color-tablet)",
    };

    return data.data.map((row: DevicesDataOutput) => {
      const device = (row.device || "other").toLowerCase();
      return {
        device,
        visitors: Number(row.visitors),
        fill: colorMap[device] || "var(--color-other)",
      };
    });
  } catch (error) {
    console.error("Failed to fetch devices data", { error, linkId });
    return [];
  }
};

export const getDashboardMetrics = async (
  fromDate?: string,
  toDate?: string,
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
        from_date: dateToISO8601(fromDate),
        to_date: dateToISO8601(toDate),
      }),
    ]);

    const metrics = metricsData.data[0] as DashboardMetricsOutput;

    return {
      totalLinks: linksCount,
      totalClicks: Number(metrics.total_clicks),
      uniqueVisitors: Number(metrics.unique_visitors),
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics", { error });
    return { totalLinks: 0, totalClicks: 0, uniqueVisitors: 0 };
  }
};
