import { getLinkByShortCode } from "@/data/links";
import { aj } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { getUserStats } from "@/lib/server-utils";
import type { RequestContext } from "@/types/request";
import { NextResponse, after } from "next/server";
import crypto from "node:crypto";
import { tinybird } from "@/lib/tinybird";

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
        .catch((err) => console.error("Tinybird ingest failed:", err)),

      prisma.link
        .update({
          where: { id: linkId },
          data: { clicks: { increment: 1 } },
        })
        .catch((err) => console.error("Prisma update failed:", err)),
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

  after(() => {
    saveClickEvent(link.id, link.userId, stats);
  });

  return NextResponse.redirect(targetUrl);
};
