import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  queryClicksOverTime,
  queryCountriesData,
  queryDevicesData,
  queryBrowsersData,
  queryOSData,
} from "@/data/analytics";
import { tinybird } from "@/lib/tinybird";
import { fillMissingDates } from "@/lib/date-utils";

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

vi.mock("@/lib/tinybird", () => ({
  tinybird: {
    clicksOverTime: { query: vi.fn() },
    countriesData: { query: vi.fn() },
    devicesData: { query: vi.fn() },
    browsersData: { query: vi.fn() },
    osData: { query: vi.fn() },
    availableCountries: { query: vi.fn() },
    availableDevices: { query: vi.fn() },
  },
}));

vi.mock("@/lib/date-utils", () => ({
  fillMissingDates: vi.fn((data) => data),
}));

describe("data/analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseParams = {
    userId: "user123",
    fromDate: "2024-01-01",
    toDate: "2024-01-31",
  };

  it("queryClicksOverTime maps and fills dates correctly", async () => {
    const mockDbData = [{ date: "2024-01-01", clicks: 10, unique_visitors: 5 }];
    vi.mocked(tinybird.clicksOverTime.query).mockResolvedValueOnce({
      data: mockDbData,
    } as any);

    const result = await queryClicksOverTime(baseParams);

    expect(tinybird.clicksOverTime.query).toHaveBeenCalledWith({
      user_id: "user123",
      from_date: "2024-01-01",
      to_date: "2024-01-31",
      link_id: "",
      country: "",
      device: "",
    });

    const expectedMappedData = [
      { date: "2024-01-01", clicks: 10, uniqueVisitors: 5 },
    ];
    expect(fillMissingDates).toHaveBeenCalledWith(
      expectedMappedData,
      "2024-01-01",
      "2024-01-31",
    );
    expect(result).toEqual(expectedMappedData);
  });

  it("queryCountriesData maps correctly", async () => {
    vi.mocked(tinybird.countriesData.query).mockResolvedValueOnce({
      data: [{ country: "US", visitors: 100 }],
    } as any);

    const result = await queryCountriesData(baseParams);

    expect(result).toEqual([{ country: "US", visitors: 100 }]);
  });

  it("queryDevicesData lowercases device names and defaults to 'other'", async () => {
    vi.mocked(tinybird.devicesData.query).mockResolvedValueOnce({
      data: [
        { device: "Desktop", visitors: 50 },
        { device: null, visitors: 10 },
      ],
    } as any);

    const result = await queryDevicesData(baseParams);

    expect(result).toEqual([
      { device: "desktop", visitors: 50 },
      { device: "other", visitors: 10 },
    ]);
  });

  it("returns an empty array on error and logs the error", async () => {
    vi.mocked(tinybird.osData.query).mockRejectedValueOnce(
      new Error("Tinybird Error"),
    );

    const result = await queryOSData(baseParams);

    expect(result).toEqual([]);
  });
});
