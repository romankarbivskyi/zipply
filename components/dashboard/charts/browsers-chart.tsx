"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "../../ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;

import { use } from "react";

interface ChartData {
  browser: string;
  visitors: number;
  fill: string;
}

interface BrowsersChartProps {
  data: Promise<ChartData[]>;
}

const BrowsersChart = ({ data }: BrowsersChartProps) => {
  const chartData = use(data);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Browsers</CardTitle>
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
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="browser"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={4}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="visitors"
                fill="var(--color-visitors)"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BrowsersChart;
