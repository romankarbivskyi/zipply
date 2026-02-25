import {
  VisitorsChartSkeleton,
  CountriesChartSkeleton,
  DevicesChartSkeleton,
} from "@/components/dashboard/charts/chart-skeletons";
import CountriesChart from "@/components/dashboard/charts/countries-chart";
import DevicesChart from "@/components/dashboard/charts/devices-chart";
import VisitorsChart from "@/components/dashboard/charts/visitors-chart";
import DateRangeSelect from "@/components/dashboard/date-range-select";
import Heading from "@/components/dashboard/heading";
import LinkCard from "@/components/dashboard/links/link-card";
import {
  getClicksOverTime,
  getCountriesData,
  getDashboardMetrics,
  getDevicesData,
  getLinkById,
} from "@/data/links";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const linkId = (await params).id;
  const timeRange = ((await searchParams).timeRange as string) || "30d";

  const link = await getLinkById(linkId);

  if (!link) {
    notFound();
  }

  const clicksData = getClicksOverTime(timeRange);
  const countriesData = getCountriesData(timeRange);
  const devicesData = getDevicesData(timeRange);

  const metrics = getDashboardMetrics(timeRange);

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Link Details" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
        <LinkCard link={link} />
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
