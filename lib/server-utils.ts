import { aj } from "@/lib/arcjet";
import type { RequestContext } from "@/types/request";
import ajIp from "@arcjet/ip";
import { userAgentFromString } from "next/server";

type ArcjetDecision = Awaited<ReturnType<typeof aj.protect>>;

export const getUserStats = async (
  req: Request,
  decision?: ArcjetDecision,
): Promise<RequestContext> => {
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
};

export const getRequestDiagnostics = (req: Request) => {
  const headers = req.headers;

  return {
    method: req.method,
    purpose: headers.get("purpose") || "",
    secPurpose: headers.get("sec-purpose") || "",
    secFetchMode: headers.get("sec-fetch-mode") || "",
    secFetchDest: headers.get("sec-fetch-dest") || "",
    secFetchSite: headers.get("sec-fetch-site") || "",
    secFetchUser: headers.get("sec-fetch-user") || "",
    referer: headers.get("referer") || "",
    userAgent: headers.get("user-agent") || "",
  };
};
