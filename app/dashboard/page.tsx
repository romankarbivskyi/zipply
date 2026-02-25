import CountriesChart from "@/components/dashboard/charts/countries-chart";
import DateRangeSelect from "@/components/dashboard/date-range-select";
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const timeRange = (params.timeRange as string) || "30d";

  const clicksData = getClicksOverTime(timeRange);
  const countriesData = getCountriesData(timeRange);
  const devicesData = getDevicesData(timeRange);

  const metrics = getDashboardMetrics(timeRange);

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Dashboard" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
        <Suspense fallback={<SectionCardsSkeleton />}>
          <SectionCards data={metrics} timeRange={timeRange} />
        </Suspense>
        <DateRangeSelect />
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
