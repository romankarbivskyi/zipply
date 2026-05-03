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

import { use, useMemo } from "react";

interface ChartData {
  os: string;
  visitors: number;
  fill: string;
}

interface OSChartProps {
  data: Promise<ChartData[]>;
}

const OSChart = ({ data }: OSChartProps) => {
  const chartData = use(data);

  const dynamicConfig = useMemo(() => {
    return chartData.reduce(
      (config, item) => {
        config[item.os] = {
          label: item.os,
          color: item.fill,
        };
        return config;
      },
      {
        visitors: { label: "Visitors" },
      } as ChartConfig,
    );
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Operating Systems</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {!chartData.length ? (
          <div className="flex h-[250px] flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={dynamicConfig}
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
                nameKey="os"
                strokeWidth={2}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="os" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OSChart;
