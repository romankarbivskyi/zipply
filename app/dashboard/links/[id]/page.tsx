import { Metadata } from "next";
import {
  VisitorsChartSkeleton,
  CountriesChartSkeleton,
  DevicesChartSkeleton,
} from "@/components/dashboard/charts/chart-skeletons";
import CountriesChart from "@/components/dashboard/charts/countries-chart";
import DevicesChart from "@/components/dashboard/charts/devices-chart";
import VisitorsChart from "@/components/dashboard/charts/visitors-chart";
import CalendarRange from "@/components/dashboard/calendar-range";
import Heading from "@/components/dashboard/heading";
import LinkCard from "@/components/dashboard/links/link-card";
import {
  getClicksOverTime,
  getCountriesData,
  getDevicesData,
  getLinkById,
} from "@/data/links";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
  const linkId = (await params).id;
  const paramsData = await searchParams;
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const from =
    (paramsData.from as string) || thirtyDaysAgo.toISOString().split("T")[0];
  const to = (paramsData.to as string) || today.toISOString().split("T")[0];

  const link = await getLinkById(linkId);

  if (!link) {
    notFound();
  }

  const clicksData = getClicksOverTime(linkId, from, to);
  const countriesData = getCountriesData(linkId, from, to);
  const devicesData = getDevicesData(linkId, from, to);

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Link Details" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
        <LinkCard link={link} />
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
