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
} from "@/components/dashboard/charts/chart-skeletons";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Dashboard" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
        <SectionCards />
        <DateRangeSelect />
        <Suspense fallback={<VisitorsChartSkeleton />}>
          <VisitorsChart />
        </Suspense>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Suspense fallback={<CountriesChartSkeleton />}>
            <CountriesChart />
          </Suspense>
          <Suspense fallback={<DevicesChartSkeleton />}>
            <DevicesChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
