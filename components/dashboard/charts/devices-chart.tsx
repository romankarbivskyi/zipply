"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "../../ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--chart-3)",
  },
  other: {
    label: "Other",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

import { use } from "react";

interface ChartData {
  device: string;
  visitors: number;
  fill: string;
}

interface DevicesChartProps {
  data: Promise<ChartData[]>;
}

const DevicesChart = ({ data }: DevicesChartProps) => {
  const chartData = use(data);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Devices</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {!chartData.length ? (
          <div className="flex h-[250px] flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[250px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="device"
                innerRadius={60}
                strokeWidth={2}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="device" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DevicesChart;
