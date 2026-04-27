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
  getAvailableCountries,
  getAvailableDevices,
} from "@/data/links";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CountrySelect from "@/components/dashboard/country-select";
import DeviceSelect from "@/components/dashboard/device-select";
import { getParam } from "@/lib/utils";

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
    getParam(paramsData.from) || thirtyDaysAgo.toISOString().split("T")[0];
  const to = getParam(paramsData.to) || today.toISOString().split("T")[0];
  const countryParam = getParam(paramsData.country);
  const country = countryParam === "all" ? "" : countryParam;
  const deviceParam = getParam(paramsData.device);
  const device = deviceParam === "all" ? "" : deviceParam;

  const link = await getLinkById(linkId);

  if (!link) {
    notFound();
  }

  const clicksData = getClicksOverTime(linkId, from, to, country, device);
  const devicesData = getDevicesData(linkId, from, to, country, device);
  const countriesData = getCountriesData(linkId, from, to, country, device);
  const allCountries = getAvailableCountries(linkId, from, to);
  const allDevices = getAvailableDevices(linkId, from, to);

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Link Details" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
        <LinkCard link={link} />
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
