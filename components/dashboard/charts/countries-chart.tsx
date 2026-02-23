"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "../../ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartData {
  country: string;
  visitors: number;
}

interface CountriesChartProps {
  data: ChartData[];
}

const CountriesChart = ({ data }: CountriesChartProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Top Countries</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {!data.length ? (
          <div className="flex h-[250px] flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 16 }}
            >
              <YAxis
                dataKey="country"
                type="category"
                tickLine={false}
                axisLine={false}
                width={100}
                tickMargin={4}
                tickFormatter={(value) => {
                  if (value.length > 12) return value.slice(0, 12) + "…";
                  return value;
                }}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="visitors"
                fill="var(--color-visitors)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CountriesChart;
