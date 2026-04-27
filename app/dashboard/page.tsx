import { Metadata } from "next";
import CountriesChart from "@/components/dashboard/charts/countries-chart";
import CalendarRange from "@/components/dashboard/calendar-range";
import DevicesChart from "@/components/dashboard/charts/devices-chart";
import Heading from "@/components/dashboard/heading";
import SectionCards from "@/components/dashboard/section-cards";
import VisitorsChart from "@/components/dashboard/charts/visitors-chart";
import {
  VisitorsChartSkeleton,
  CountriesChartSkeleton,
  DevicesChartSkeleton,
  SectionCardsSkeleton,
} from "@/components/dashboard/charts/chart-skeletons";
import { Suspense } from "react";
import {
  getClicksOverTime,
  getCountriesData,
  getDashboardMetrics,
  getDevicesData,
  getAvailableCountries,
  getAvailableDevices,
} from "@/data/links";
import CountrySelect from "@/components/dashboard/country-select";
import DeviceSelect from "@/components/dashboard/device-select";
import { getParam } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const from =
    getParam(params.from) || thirtyDaysAgo.toISOString().split("T")[0];
  const to = getParam(params.to) || today.toISOString().split("T")[0];
  const countryParam = getParam(params.country);
  const country = countryParam === "all" ? "" : countryParam;
  const deviceParam = getParam(params.device);
  const device = deviceParam === "all" ? "" : deviceParam;

  const clicksData = getClicksOverTime(undefined, from, to, country, device);
  const devicesData = getDevicesData(undefined, from, to, country, device);
  const countriesData = getCountriesData(undefined, from, to, country, device);
  const allCountries = getAvailableCountries(undefined, from, to);
  const allDevices = getAvailableDevices(undefined, from, to);
  const metrics = getDashboardMetrics(from, to, country, device);

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Dashboard" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
        <Suspense fallback={<SectionCardsSkeleton />}>
          <SectionCards data={metrics} from={from} to={to} />
        </Suspense>
        <div className="flex flex-wrap gap-4">
          <CalendarRange />
          <CountrySelect countries={allCountries} />
          <DeviceSelect devices={allDevices} />
        </div>
        <Suspense fallback={<VisitorsChartSkeleton />}>
          <VisitorsChart data={clicksData} />
        </Suspense>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Suspense fallback={<CountriesChartSkeleton />}>
            <CountriesChart countries={countriesData} />
          </Suspense>
          <Suspense fallback={<DevicesChartSkeleton />}>
            <DevicesChart data={devicesData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
