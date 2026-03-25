import { aj } from "@/lib/arcjet";
import type { RequestContext } from "@/types/request";
import ajIp from "@arcjet/ip";
import { userAgentFromString } from "next/server";

type ArcjetDecision = Awaited<ReturnType<typeof aj.protect>>;

export async function getUserStats(
  req: Request,
  decision?: ArcjetDecision,
): Promise<RequestContext> {
  const arcjetDecision = decision ?? (await aj.protect(req));
  const publicIp = ajIp(req);

  const uaString = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referer") || "Direct / No Referrer";

  const { os, browser, device } = userAgentFromString(uaString);

  return {
    ip: publicIp || undefined,
    country: arcjetDecision.ip.hasCountry()
      ? arcjetDecision.ip.countryName
      : "Unknown",
    city: arcjetDecision.ip.city || "Unknown",
    os: os.name || "Unknown",
    device: device.type || "Unknown",
    browser: browser.name || "Unknown",
    referrer,
  };
}
