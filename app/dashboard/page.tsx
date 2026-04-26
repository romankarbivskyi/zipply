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
} from "@/data/links";

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
    (params.from as string) || thirtyDaysAgo.toISOString().split("T")[0];
  const to = (params.to as string) || today.toISOString().split("T")[0];

  const clicksData = getClicksOverTime(undefined, from, to);
  const countriesData = getCountriesData(undefined, from, to);
  const devicesData = getDevicesData(undefined, from, to);

  const metrics = getDashboardMetrics(from, to);

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Dashboard" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
        <Suspense fallback={<SectionCardsSkeleton />}>
          <SectionCards data={metrics} from={from} to={to} />
        </Suspense>
        <div className="self-left">
          <CalendarRange />
        </div>
        <Suspense fallback={<VisitorsChartSkeleton />}>
          <VisitorsChart data={clicksData} />
        </Suspense>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Suspense fallback={<CountriesChartSkeleton />}>
            <CountriesChart data={countriesData} />
          </Suspense>
          <Suspense fallback={<DevicesChartSkeleton />}>
            <DevicesChart data={devicesData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
