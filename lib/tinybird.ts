import {
  defineDatasource,
  defineEndpoint,
  Tinybird,
  node,
  t,
  p,
  engine,
  type InferRow,
  type InferParams,
  type InferOutputRow,
} from "@tinybirdco/sdk";

export const clicks = defineDatasource("click_events", {
  description: "Click tracking data for shortened links",
  schema: {
    event_id: t.string(),
    ts: t.dateTime(),
    link_id: t.string(),
    user_id: t.string(),
    ip_hash: t.string().nullable(),
    country: t.string(),
    city: t.string(),
    device: t.string(),
    browser: t.string(),
    os: t.string(),
  },
  engine: engine.mergeTree({
    sortingKey: ["event_id", "user_id", "link_id", "ts"],
    primaryKey: ["event_id"],
    ttl: "ts + INTERVAL 1 YEAR",
  }),
});

export type ClicksRow = InferRow<typeof clicks>;

export const clicksOverTime = defineEndpoint("clicks_over_time", {
  description: "Get clicks and unique visitors over time",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (YYYY-MM-DD)"),
    to_date: p.string().describe("End date (YYYY-MM-DD)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
    country: p.string().optional("").describe("Optional country filter"),
    device: p.string().optional("").describe("Optional device filter"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          toDate(ts) as date,
          count() as clicks,
          uniqExact(ip_hash) as unique_visitors
        FROM click_events
        WHERE user_id = {{String(user_id, '')}}
          AND ts >= toDateTimeOrNull({{String(from_date, '1970-01-01')}})
          AND ts < toDateTimeOrNull({{String(to_date, '2100-01-01')}}) + INTERVAL 1 DAY
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
          )
          AND (
            {{String(country, '')}} = ''
            OR country = {{String(country, '')}}
          )
          AND (
            {{String(device, '')}} = ''
            OR device = {{String(device, '')}}
          )
        GROUP BY date
        ORDER BY date ASC
      `,
    }),
  ],
  output: {
    date: t.string(),
    clicks: t.uint64(),
    unique_visitors: t.uint64(),
  },
});

export type ClicksOverTimeParams = InferParams<typeof clicksOverTime>;
export type ClicksOverTimeOutput = InferOutputRow<typeof clicksOverTime>;

export const countriesData = defineEndpoint("countries_data", {
  description: "Get click breakdown by country",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (YYYY-MM-DD)"),
    to_date: p.string().describe("End date (YYYY-MM-DD)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
    country: p.string().optional("").describe("Optional country filter"),
    device: p.string().optional("").describe("Optional device filter"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          country,
          count() as visitors
        FROM click_events
        WHERE user_id = {{String(user_id, '')}}
          AND ts >= toDateTimeOrNull({{String(from_date, '1970-01-01')}})
          AND ts < toDateTimeOrNull({{String(to_date, '2100-01-01')}}) + INTERVAL 1 DAY
          AND country != 'Unknown'
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
          )
          AND (
            {{String(country, '')}} = ''
            OR country = {{String(country, '')}}
          )
          AND (
            {{String(device, '')}} = ''
            OR device = {{String(device, '')}}
          )
        GROUP BY country
        ORDER BY visitors DESC
      `,
    }),
  ],
  output: {
    country: t.string(),
    visitors: t.uint64(),
  },
});

export type CountriesDataParams = InferParams<typeof countriesData>;
export type CountriesDataOutput = InferOutputRow<typeof countriesData>;

export const devicesData = defineEndpoint("devices_data", {
  description: "Get click breakdown by device type",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (YYYY-MM-DD)"),
    to_date: p.string().describe("End date (YYYY-MM-DD)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
    country: p.string().optional("").describe("Optional country filter"),
    device: p.string().optional("").describe("Optional device filter"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          device,
          count() as visitors
        FROM click_events
        WHERE user_id = {{String(user_id, '')}}
          AND ts >= toDateTimeOrNull({{String(from_date, '1970-01-01')}})
          AND ts < toDateTimeOrNull({{String(to_date, '2100-01-01')}}) + INTERVAL 1 DAY
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
          )
          AND (
            {{String(country, '')}} = ''
            OR country = {{String(country, '')}}
          )
          AND (
            {{String(device, '')}} = ''
            OR device = {{String(device, '')}}
          )
        GROUP BY device
        ORDER BY visitors DESC
      `,
    }),
  ],
  output: {
    device: t.string(),
    visitors: t.uint64(),
  },
});

export type DevicesDataParams = InferParams<typeof devicesData>;
export type DevicesDataOutput = InferOutputRow<typeof devicesData>;

export const browsersData = defineEndpoint("browsers_data", {
  description: "Get click breakdown by browser",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (YYYY-MM-DD)"),
    to_date: p.string().describe("End date (YYYY-MM-DD)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
    country: p.string().optional("").describe("Optional country filter"),
    device: p.string().optional("").describe("Optional device filter"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          browser,
          count() as visitors
        FROM click_events
        WHERE user_id = {{String(user_id, '')}}
          AND ts >= toDateTimeOrNull({{String(from_date, '1970-01-01')}})
          AND ts < toDateTimeOrNull({{String(to_date, '2100-01-01')}}) + INTERVAL 1 DAY
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
          )
          AND (
            {{String(country, '')}} = ''
            OR country = {{String(country, '')}}
          )
          AND (
            {{String(device, '')}} = ''
            OR device = {{String(device, '')}}
          )
        GROUP BY browser
        ORDER BY visitors DESC
      `,
    }),
  ],
  output: {
    browser: t.string(),
    visitors: t.uint64(),
  },
});

export type BrowsersDataParams = InferParams<typeof browsersData>;
export type BrowsersDataOutput = InferOutputRow<typeof browsersData>;

export const osData = defineEndpoint("os_data", {
  description: "Get click breakdown by OS",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (YYYY-MM-DD)"),
    to_date: p.string().describe("End date (YYYY-MM-DD)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
    country: p.string().optional("").describe("Optional country filter"),
    device: p.string().optional("").describe("Optional device filter"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          os,
          count() as visitors
        FROM click_events
        WHERE user_id = {{String(user_id, '')}}
          AND ts >= toDateTimeOrNull({{String(from_date, '1970-01-01')}})
          AND ts < toDateTimeOrNull({{String(to_date, '2100-01-01')}}) + INTERVAL 1 DAY
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
          )
          AND (
            {{String(country, '')}} = ''
            OR country = {{String(country, '')}}
          )
          AND (
            {{String(device, '')}} = ''
            OR device = {{String(device, '')}}
          )
        GROUP BY os
        ORDER BY visitors DESC
      `,
    }),
  ],
  output: {
    os: t.string(),
    visitors: t.uint64(),
  },
});

export type OSDataParams = InferParams<typeof osData>;
export type OSDataOutput = InferOutputRow<typeof osData>;

export const dashboardMetrics = defineEndpoint("dashboard_metrics", {
  description: "Get total clicks and unique visitors for dashboard",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (YYYY-MM-DD)"),
    to_date: p.string().describe("End date (YYYY-MM-DD)"),
    country: p.string().optional("").describe("Optional country filter"),
    device: p.string().optional("").describe("Optional device filter"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          count() as total_clicks,
          uniqExact(ip_hash) as unique_visitors
        FROM click_events
        WHERE user_id = {{String(user_id, '')}}
          AND ts >= toDateTimeOrNull({{String(from_date, '1970-01-01')}})
          AND ts < toDateTimeOrNull({{String(to_date, '2100-01-01')}}) + INTERVAL 1 DAY
          AND (
            {{String(country, '')}} = ''
            OR country = {{String(country, '')}}
          )
          AND (
            {{String(device, '')}} = ''
            OR device = {{String(device, '')}}
          )
      `,
    }),
  ],
  output: {
    total_clicks: t.uint64(),
    unique_visitors: t.uint64(),
  },
});

export type DashboardMetricsParams = InferParams<typeof dashboardMetrics>;
export type DashboardMetricsOutput = InferOutputRow<typeof dashboardMetrics>;

export const availableCountries = defineEndpoint("available_countries", {
  description: "Get all available countries for a user/link",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (YYYY-MM-DD)"),
    to_date: p.string().describe("End date (YYYY-MM-DD)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          country
        FROM click_events
        WHERE user_id = {{String(user_id, '')}}
          AND ts >= toDateTimeOrNull({{String(from_date, '1970-01-01')}})
          AND ts < toDateTimeOrNull({{String(to_date, '2100-01-01')}}) + INTERVAL 1 DAY
          AND country != 'Unknown'
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
          )
        GROUP BY country
        ORDER BY country ASC
      `,
    }),
  ],
  output: {
    country: t.string(),
  },
});

export type AvailableCountriesOutput = InferOutputRow<
  typeof availableCountries
>;

export const availableDevices = defineEndpoint("available_devices", {
  description: "Get all available device types for a user/link",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (YYYY-MM-DD)"),
    to_date: p.string().describe("End date (YYYY-MM-DD)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          device
        FROM click_events
        WHERE user_id = {{String(user_id, '')}}
          AND ts >= toDateTimeOrNull({{String(from_date, '1970-01-01')}})
          AND ts < toDateTimeOrNull({{String(to_date, '2100-01-01')}}) + INTERVAL 1 DAY
          AND device != 'Unknown'
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
          )
        GROUP BY device
        ORDER BY device ASC
      `,
    }),
  ],
  output: {
    device: t.string(),
  },
});

export type AvailableDevicesOutput = InferOutputRow<typeof availableDevices>;

export const tinybird = new Tinybird({
  datasources: { clicks },
  pipes: {
    clicksOverTime,
    countriesData,
    devicesData,
    browsersData,
    osData,
    dashboardMetrics,
    availableCountries,
    availableDevices,
  },
});
