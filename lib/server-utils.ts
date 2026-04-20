import type { RequestContext } from "@/types/request";
import { userAgentFromString } from "next/server";
import { ipAddress, geolocation } from "@vercel/functions";

export const getRequestContext = async (
  req: Request,
): Promise<RequestContext> => {
  const publicIp = ipAddress(req);
  const geo = geolocation(req);

  const uaString = req.headers.get("user-agent") || "";

  const { os, browser, device } = userAgentFromString(uaString);

  return {
    ip: publicIp || undefined,
    country: geo.country || "Unknown",
    city: geo.city || "Unknown",
    os: os.name || "Unknown",
    device: device.type || "Unknown",
    browser: browser.name || "Unknown",
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
