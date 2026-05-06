import { Metadata } from "next";
import CountriesChart from "@/components/dashboard/charts/countries-chart";
import CalendarRange from "@/components/dashboard/calendar-range";
import DevicesChart from "@/components/dashboard/charts/devices-chart";
import BrowsersChart from "@/components/dashboard/charts/browsers-chart";
import OSChart from "@/components/dashboard/charts/os-chart";
import Heading from "@/components/dashboard/heading";
import SectionCards from "@/components/dashboard/section-cards";
import VisitorsChart from "@/components/dashboard/charts/visitors-chart";
import {
  VisitorsChartSkeleton,
  CountriesChartSkeleton,
  DevicesChartSkeleton,
  BrowsersChartSkeleton,
  OSChartSkeleton,
  SectionCardsSkeleton,
} from "@/components/dashboard/charts/chart-skeletons";
import { Suspense } from "react";
import { getDashboardMetrics } from "@/data/links";
import {
  queryClicksOverTime,
  queryCountriesData,
  queryDevicesData,
  queryBrowsersData,
  queryOSData,
  queryAvailableCountries,
  queryAvailableDevices,
} from "@/data/analytics";
import CountrySelect from "@/components/dashboard/country-select";
import DeviceSelect from "@/components/dashboard/device-select";
import { getParam } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

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

  const userId = session.user.id;
  const queryParams = { userId, fromDate: from, toDate: to, country, device };

  const clicksData = queryClicksOverTime(queryParams);
  const devicesData = queryDevicesData(queryParams);
  const browsersData = queryBrowsersData(queryParams);
  const osData = queryOSData(queryParams);
  const countriesData = queryCountriesData(queryParams);
  const allCountries = queryAvailableCountries({
    userId,
    fromDate: from,
    toDate: to,
  });
  const allDevices = queryAvailableDevices({
    userId,
    fromDate: from,
    toDate: to,
  });
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
          <Suspense fallback={<BrowsersChartSkeleton />}>
            <BrowsersChart data={browsersData} />
          </Suspense>
          <Suspense fallback={<OSChartSkeleton />}>
            <OSChart data={osData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
