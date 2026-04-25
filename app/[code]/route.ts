import { getLinkByShortCode } from "@/data/links";
import { prisma } from "@/lib/db";
import { getRequestContext, getRequestDiagnostics } from "@/lib/server-utils";
import { NextResponse, after } from "next/server";
import crypto from "node:crypto";
import { tinybird } from "@/lib/tinybird";

const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

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

const saveClickEvent = async (
  linkId: string,
  userId: string,
  request: Request,
) => {
  try {
    const stats = await getRequestContext(request);

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

  const link = await getLinkByShortCode(code);

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const diagnostic = await getRequestDiagnostics(request);
  if (!shouldTrackClick(diagnostic)) {
    return NextResponse.redirect(link.originalUrl);
  }

  const targetUrl = link.originalUrl;

  after(() => {
    saveClickEvent(link.id, link.userId, request);
  });

  return NextResponse.redirect(targetUrl);
};
