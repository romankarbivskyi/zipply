import { getLinkByShortCode } from "@/data/links";
import { aj } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { getRequestDiagnostics, getUserStats } from "@/lib/server-utils";
import type { RequestContext } from "@/types/request";
import { NextResponse, after } from "next/server";

const hasToken = (value: string, token: string) => {
  return value
    .toLowerCase()
    .split(/[\s,;]+/)
    .filter(Boolean)
    .includes(token);
};

const shouldTrackClick = (
  diagnostics: ReturnType<typeof getRequestDiagnostics>,
) => {
  const isPrefetchLike =
    hasToken(diagnostics.purpose, "prefetch") ||
    hasToken(diagnostics.secPurpose, "prefetch") ||
    hasToken(diagnostics.secPurpose, "prerender") ||
    hasToken(diagnostics.purpose, "prerender");

  if (isPrefetchLike) {
    return false;
  }

  if (diagnostics.secFetchMode && diagnostics.secFetchMode !== "navigate") {
    return false;
  }

  if (diagnostics.secFetchDest && diagnostics.secFetchDest !== "document") {
    return false;
  }

  return true;
};

const saveClickToDatabase = async (linkId: string, stats: RequestContext) => {
  try {
    const duplicateWhere = stats.ip
      ? {
          linkId,
          ipAddress: stats.ip,
          createdAt: {
            gte: new Date(Date.now() - 1000),
          },
        }
      : {
          linkId,
          browser: stats.browser,
          os: stats.os,
          device: stats.device,
          referrer: stats.referrer,
          createdAt: {
            gte: new Date(Date.now() - 1000),
          },
        };

    const recentClick = await prisma.click.findFirst({
      where: duplicateWhere,
      select: { id: true },
    });

    if (recentClick) {
      return;
    }

    await prisma.$transaction([
      prisma.click.create({
        data: {
          linkId,
          ipAddress: stats.ip,
          country: stats.country,
          city: stats.city,
          device: stats.device,
          browser: stats.browser,
          os: stats.os,
          referrer: stats.referrer,
        },
      }),
      prisma.link.update({
        where: { id: linkId },
        data: {
          clicks: { increment: 1 },
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to store click event", { linkId, error });
  }
};

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) => {
  const { code } = await params;
  const diagnostics = getRequestDiagnostics(request);
  const trackClick = shouldTrackClick(diagnostics);

  const decision = await aj.protect(request);

  if (decision.isDenied()) {
    return new Response("Request blocked", { status: 403 });
  }

  const link = await getLinkByShortCode(code);

  if (!link) {
    return new Response("Not Found", { status: 404 });
  }

  const stats = await getUserStats(request, decision);

  const targetUrl = link.originalUrl;

  if (trackClick) {
    after(() => {
      saveClickToDatabase(link.id, stats);
    });
  }

  return NextResponse.redirect(targetUrl);
};
