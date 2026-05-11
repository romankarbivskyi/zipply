import { Metadata } from "next";
import {
  VisitorsChartSkeleton,
  CountriesChartSkeleton,
  DevicesChartSkeleton,
  BrowsersChartSkeleton,
  OSChartSkeleton,
} from "@/components/dashboard/charts/chart-skeletons";
import CountriesChart from "@/components/dashboard/charts/countries-chart";
import DevicesChart from "@/components/dashboard/charts/devices-chart";
import BrowsersChart from "@/components/dashboard/charts/browsers-chart";
import OSChart from "@/components/dashboard/charts/os-chart";
import VisitorsChart from "@/components/dashboard/charts/visitors-chart";
import CalendarRange from "@/components/dashboard/calendar-range";
import Heading from "@/components/dashboard/heading";
import LinkCard from "@/components/dashboard/links/link-card";
import { getLinkById } from "@/data/links";
import {
  queryClicksOverTime,
  queryCountriesData,
  queryDevicesData,
  queryBrowsersData,
  queryOSData,
  queryAvailableCountries,
  queryAvailableDevices,
} from "@/data/analytics";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import CountrySelect from "@/components/dashboard/country-select";
import DeviceSelect from "@/components/dashboard/device-select";
import { getParam } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const linkId = (await params).id;
  const paramsData = await searchParams;

  const link = await getLinkById(linkId);
  if (!link) notFound();

  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const from =
    getParam(paramsData.from) || thirtyDaysAgo.toISOString().split("T")[0];
  const to = getParam(paramsData.to) || today.toISOString().split("T")[0];
  const countryParam = getParam(paramsData.country);
  const country = countryParam === "all" ? "" : countryParam;
  const deviceParam = getParam(paramsData.device);
  const device = deviceParam === "all" ? "" : deviceParam;

  const userId = session.user.id;
  const queryParams = {
    userId,
    fromDate: from,
    toDate: to,
    linkId,
    country,
    device,
  };

  const clicksData = queryClicksOverTime(queryParams);
  const devicesData = queryDevicesData(queryParams);
  const browsersData = queryBrowsersData(queryParams);
  const osData = queryOSData(queryParams);
  const countriesData = queryCountriesData(queryParams);
  const allCountries = queryAvailableCountries({
    userId,
    fromDate: from,
    toDate: to,
    linkId,
  });
  const allDevices = queryAvailableDevices({
    userId,
    fromDate: from,
    toDate: to,
    linkId,
  });

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Link Details" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
        <LinkCard link={link} />
        <div className="flex flex-wrap gap-4">
          <CalendarRange />
          <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
            <CountrySelect countries={allCountries} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
            <DeviceSelect devices={allDevices} />
          </Suspense>
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
