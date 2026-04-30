import { getLinkByShortCode } from "@/data/links";
import { prisma } from "@/lib/db";
import { getRequestContext } from "@/lib/server-utils";
import { NextResponse, after } from "next/server";
import crypto from "node:crypto";
import { tinybird } from "@/lib/tinybird";
import { logger } from "@/lib/logger";
import type { RequestContext } from "@/types/request";

const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

const saveClickEvent = async (
  linkId: string,
  userId: string,
  stats: RequestContext,
) => {
  try {
    const ts = new Date();

    const base = [
      linkId,
      stats.ip ?? "",
      stats.browser,
      stats.os,
      stats.device,
      Math.floor(ts.getTime() / 1000),
    ].join("|");

    const eventId = sha256(base);

    await Promise.all([
      tinybird.clicks
        .ingest({
          event_id: eventId,
          ts: ts.toISOString(),
          link_id: linkId,
          user_id: userId,
          ip_hash: stats.ip ? sha256(stats.ip) : null,
          country: stats.country ?? "Unknown",
          city: stats.city ?? "Unknown",
          device: stats.device ?? "Unknown",
          browser: stats.browser ?? "Unknown",
          os: stats.os ?? "Unknown",
        })
        .catch((err) => logger.error({ err }, "Tinybird ingest failed")),

      prisma.link
        .update({
          where: { id: linkId },
          data: { clicks: { increment: 1 } },
        })
        .catch((err) => logger.error({ err }, "Prisma update failed")),
    ]);
  } catch (error) {
    logger.error({ error, linkId }, "Failed to store click event");
  }
};

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) => {
  const { code } = await params;
  const stats = await getRequestContext(request);

  logger.info(
    {
      code,
      url: request.url,
      ip: stats.ip,
      country: stats.country,
      device: stats.device,
      os: stats.os,
      browser: stats.browser,
    },
    "Short link requested",
  );

  const link = await getLinkByShortCode(code);

  if (!link) {
    logger.warn({ code }, "Short link not found");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const targetUrl = link.originalUrl;

  after(() => saveClickEvent(link.id, link.userId, stats));

  return NextResponse.redirect(targetUrl);
};
