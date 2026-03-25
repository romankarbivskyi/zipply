import { getLinkByShortCode } from "@/data/links";
import { aj } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { getUserStats } from "@/lib/server-utils";
import type { RequestContext } from "@/types/request";
import { NextResponse, after } from "next/server";

const saveClickToDatabase = async (linkId: string, stats: RequestContext) => {
  try {
    await prisma.click.create({
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
    });
  } catch (error) {
    console.error("Failed to store click event", { linkId, error });
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
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
    saveClickToDatabase(link.id, stats);
  });

  return NextResponse.redirect(targetUrl);
}
