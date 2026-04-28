"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "../../ui/chart";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";

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
  countries: Promise<ChartData[]>;
}

const CountriesChart = ({ countries }: CountriesChartProps) => {
  const chartData = use(countries);
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? chartData : chartData.slice(0, 6);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Countries</CardTitle>
          {chartData.length > 6 && (
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              size="sm"
            >
              {showAll ? "Show Less" : "View All"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {!displayData.length ? (
          <div className="flex h-[250px] flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className={`aspect-auto w-full ${showAll ? "h-auto" : "h-[250px]"}`}
            style={{
              height: showAll
                ? `${Math.max(300, displayData.length * 40)}px`
                : "250px",
            }}
          >
            <BarChart
              data={displayData}
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
