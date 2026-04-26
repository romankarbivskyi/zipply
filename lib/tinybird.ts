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
  }),
});

export type ClicksRow = InferRow<typeof clicks>;

export const clicksOverTime = defineEndpoint("clicks_over_time", {
  description: "Get clicks and unique visitors over time",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (ISO 8601)"),
    to_date: p.string().describe("End date (ISO 8601)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
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
        WHERE user_id = {{String(user_id)}}
          AND ts >= fromISO8601({{String(from_date)}})
          AND ts <= fromISO8601({{String(to_date)}})
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
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
    from_date: p.string().describe("Start date (ISO 8601)"),
    to_date: p.string().describe("End date (ISO 8601)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          country,
          count() as visitors
        FROM click_events
        WHERE user_id = {{String(user_id)}}
          AND ts >= fromISO8601({{String(from_date)}})
          AND ts <= fromISO8601({{String(to_date)}})
          AND country != 'Unknown'
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
          )
        GROUP BY country
        ORDER BY visitors DESC
        LIMIT 6
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
    from_date: p.string().describe("Start date (ISO 8601)"),
    to_date: p.string().describe("End date (ISO 8601)"),
    link_id: p.string().optional("").describe("Optional specific link ID"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          device,
          count() as visitors
        FROM click_events
        WHERE user_id = {{String(user_id)}}
          AND ts >= fromISO8601({{String(from_date)}})
          AND ts <= fromISO8601({{String(to_date)}})
          AND (
            {{String(link_id, '')}} = ''
            OR link_id = {{String(link_id, '')}}
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

export const dashboardMetrics = defineEndpoint("dashboard_metrics", {
  description: "Get total clicks and unique visitors for dashboard",
  params: {
    user_id: p.string().describe("User ID"),
    from_date: p.string().describe("Start date (ISO 8601)"),
    to_date: p.string().describe("End date (ISO 8601)"),
  },
  nodes: [
    node({
      name: "aggregated",
      sql: `
        SELECT
          count() as total_clicks,
          uniqExact(ip_hash) as unique_visitors
        FROM click_events
        WHERE user_id = {{String(user_id)}}
          AND ts >= fromISO8601({{String(from_date)}})
          AND ts <= fromISO8601({{String(to_date)}})
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

export const tinybird = new Tinybird({
  datasources: { clicks },
  pipes: { clicksOverTime, countriesData, devicesData, dashboardMetrics },
});
