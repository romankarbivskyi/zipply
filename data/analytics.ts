import { fillMissingDates } from "@/lib/date-utils";
import { logger } from "@/lib/logger";
import {
  tinybird,
  type ClicksOverTimeOutput,
  type CountriesDataOutput,
  type DevicesDataOutput,
  type BrowsersDataOutput,
  type OSDataOutput,
  type AvailableCountriesOutput,
  type AvailableDevicesOutput,
} from "@/lib/tinybird";

export interface AnalyticsQueryParams {
  userId: string;
  fromDate: string;
  toDate: string;
  linkId?: string;
  country?: string;
  device?: string;
}

export interface ClicksOverTimeItem {
  date: string;
  clicks: number;
  uniqueVisitors: number;
}

export interface CountryItem {
  country: string;
  visitors: number;
}

export interface DeviceItem {
  device: string;
  visitors: number;
}

export interface BrowserItem {
  browser: string;
  visitors: number;
}

export interface OSItem {
  os: string;
  visitors: number;
}

function buildParams(params: AnalyticsQueryParams) {
  return {
    user_id: params.userId,
    from_date: params.fromDate,
    to_date: params.toDate,
    link_id: params.linkId || "",
    country: params.country || "",
    device: params.device || "",
  };
}

export async function queryClicksOverTime(
  params: AnalyticsQueryParams,
): Promise<ClicksOverTimeItem[]> {
  try {
    const data = await tinybird.clicksOverTime.query(buildParams(params));
    const mapped = data.data.map((row: ClicksOverTimeOutput) => ({
      date: row.date,
      clicks: Number(row.clicks),
      uniqueVisitors: Number(row.unique_visitors),
    }));
    return fillMissingDates(mapped, params.fromDate, params.toDate);
  } catch (error) {
    logger.error(
      { error, linkId: params.linkId },
      "Failed to fetch clicks over time",
    );
    return [];
  }
}

export async function queryCountriesData(
  params: AnalyticsQueryParams,
): Promise<CountryItem[]> {
  try {
    const data = await tinybird.countriesData.query(buildParams(params));
    return data.data.map((row: CountriesDataOutput) => ({
      country: row.country,
      visitors: Number(row.visitors),
    }));
  } catch (error) {
    logger.error(
      { error, linkId: params.linkId },
      "Failed to fetch countries data",
    );
    return [];
  }
}

export async function queryDevicesData(
  params: AnalyticsQueryParams,
): Promise<DeviceItem[]> {
  try {
    const data = await tinybird.devicesData.query(buildParams(params));
    return data.data.map((row: DevicesDataOutput) => ({
      device: (row.device || "other").toLowerCase(),
      visitors: Number(row.visitors),
    }));
  } catch (error) {
    logger.error(
      { error, linkId: params.linkId },
      "Failed to fetch devices data",
    );
    return [];
  }
}

export async function queryBrowsersData(
  params: AnalyticsQueryParams,
): Promise<BrowserItem[]> {
  try {
    const data = await tinybird.browsersData.query(buildParams(params));
    return data.data.map((row: BrowsersDataOutput) => ({
      browser: row.browser || "Unknown",
      visitors: Number(row.visitors),
    }));
  } catch (error) {
    logger.error(
      { error, linkId: params.linkId },
      "Failed to fetch browsers data",
    );
    return [];
  }
}

export async function queryOSData(
  params: AnalyticsQueryParams,
): Promise<OSItem[]> {
  try {
    const data = await tinybird.osData.query(buildParams(params));
    return data.data.map((row: OSDataOutput) => ({
      os: row.os || "Unknown",
      visitors: Number(row.visitors),
    }));
  } catch (error) {
    logger.error({ error, linkId: params.linkId }, "Failed to fetch OS data");
    return [];
  }
}

export async function queryAvailableCountries(
  params: Pick<
    AnalyticsQueryParams,
    "userId" | "fromDate" | "toDate" | "linkId"
  >,
): Promise<AvailableCountriesOutput[]> {
  try {
    const data = await tinybird.availableCountries.query({
      user_id: params.userId,
      from_date: params.fromDate,
      to_date: params.toDate,
      link_id: params.linkId || "",
    });
    return data.data;
  } catch (error) {
    logger.error(
      { error, linkId: params.linkId },
      "Failed to fetch available countries",
    );
    return [];
  }
}

export async function queryAvailableDevices(
  params: Pick<
    AnalyticsQueryParams,
    "userId" | "fromDate" | "toDate" | "linkId"
  >,
): Promise<AvailableDevicesOutput[]> {
  try {
    const data = await tinybird.availableDevices.query({
      user_id: params.userId,
      from_date: params.fromDate,
      to_date: params.toDate,
      link_id: params.linkId || "",
    });
    return data.data;
  } catch (error) {
    logger.error(
      { error, linkId: params.linkId },
      "Failed to fetch available devices",
    );
    return [];
  }
}
