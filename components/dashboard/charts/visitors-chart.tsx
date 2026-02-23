"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "../../ui/chart";

const chartData = [
  { date: "2024-04-01", clicks: 222, uniqueVisitors: 150 },
  { date: "2024-04-02", clicks: 97, uniqueVisitors: 180 },
  { date: "2024-04-03", clicks: 167, uniqueVisitors: 120 },
  { date: "2024-04-04", clicks: 242, uniqueVisitors: 260 },
  { date: "2024-04-05", clicks: 373, uniqueVisitors: 290 },
  { date: "2024-04-06", clicks: 301, uniqueVisitors: 340 },
  { date: "2024-04-07", clicks: 245, uniqueVisitors: 180 },
  { date: "2024-04-08", clicks: 409, uniqueVisitors: 320 },
  { date: "2024-04-09", clicks: 59, uniqueVisitors: 110 },
  { date: "2024-04-10", clicks: 261, uniqueVisitors: 190 },
  { date: "2024-04-11", clicks: 327, uniqueVisitors: 350 },
  { date: "2024-04-12", clicks: 292, uniqueVisitors: 210 },
  { date: "2024-04-13", clicks: 342, uniqueVisitors: 380 },
  { date: "2024-04-14", clicks: 137, uniqueVisitors: 220 },
  { date: "2024-04-15", clicks: 120, uniqueVisitors: 170 },
  { date: "2024-04-16", clicks: 138, uniqueVisitors: 190 },
  { date: "2024-04-17", clicks: 446, uniqueVisitors: 360 },
  { date: "2024-04-18", clicks: 364, uniqueVisitors: 410 },
  { date: "2024-04-19", clicks: 243, uniqueVisitors: 180 },
  { date: "2024-04-20", clicks: 89, uniqueVisitors: 150 },
  { date: "2024-04-21", clicks: 137, uniqueVisitors: 200 },
  { date: "2024-04-22", clicks: 224, uniqueVisitors: 170 },
  { date: "2024-04-23", clicks: 138, uniqueVisitors: 230 },
  { date: "2024-04-24", clicks: 387, uniqueVisitors: 290 },
  { date: "2024-04-25", clicks: 215, uniqueVisitors: 250 },
  { date: "2024-04-26", clicks: 75, uniqueVisitors: 130 },
  { date: "2024-04-27", clicks: 383, uniqueVisitors: 420 },
  { date: "2024-04-28", clicks: 122, uniqueVisitors: 180 },
  { date: "2024-04-29", clicks: 315, uniqueVisitors: 240 },
  { date: "2024-04-30", clicks: 454, uniqueVisitors: 380 },
  { date: "2024-05-01", clicks: 165, uniqueVisitors: 220 },
  { date: "2024-05-02", clicks: 293, uniqueVisitors: 310 },
  { date: "2024-05-03", clicks: 247, uniqueVisitors: 190 },
  { date: "2024-05-04", clicks: 385, uniqueVisitors: 420 },
  { date: "2024-05-05", clicks: 481, uniqueVisitors: 390 },
  { date: "2024-05-06", clicks: 498, uniqueVisitors: 520 },
  { date: "2024-05-07", clicks: 388, uniqueVisitors: 300 },
  { date: "2024-05-08", clicks: 149, uniqueVisitors: 210 },
  { date: "2024-05-09", clicks: 227, uniqueVisitors: 180 },
  { date: "2024-05-10", clicks: 293, uniqueVisitors: 330 },
  { date: "2024-05-11", clicks: 335, uniqueVisitors: 270 },
  { date: "2024-05-12", clicks: 197, uniqueVisitors: 240 },
  { date: "2024-05-13", clicks: 197, uniqueVisitors: 160 },
  { date: "2024-05-14", clicks: 448, uniqueVisitors: 490 },
  { date: "2024-05-15", clicks: 473, uniqueVisitors: 380 },
  { date: "2024-05-16", clicks: 338, uniqueVisitors: 400 },
  { date: "2024-05-17", clicks: 499, uniqueVisitors: 420 },
  { date: "2024-05-18", clicks: 315, uniqueVisitors: 350 },
  { date: "2024-05-19", clicks: 235, uniqueVisitors: 180 },
  { date: "2024-05-20", clicks: 177, uniqueVisitors: 230 },
  { date: "2024-05-21", clicks: 82, uniqueVisitors: 140 },
  { date: "2024-05-22", clicks: 81, uniqueVisitors: 120 },
  { date: "2024-05-23", clicks: 252, uniqueVisitors: 290 },
  { date: "2024-05-24", clicks: 294, uniqueVisitors: 220 },
  { date: "2024-05-25", clicks: 201, uniqueVisitors: 250 },
  { date: "2024-05-26", clicks: 213, uniqueVisitors: 170 },
  { date: "2024-05-27", clicks: 420, uniqueVisitors: 460 },
  { date: "2024-05-28", clicks: 233, uniqueVisitors: 190 },
  { date: "2024-05-29", clicks: 78, uniqueVisitors: 130 },
  { date: "2024-05-30", clicks: 340, uniqueVisitors: 280 },
  { date: "2024-05-31", clicks: 178, uniqueVisitors: 230 },
  { date: "2024-06-01", clicks: 178, uniqueVisitors: 200 },
  { date: "2024-06-02", clicks: 470, uniqueVisitors: 410 },
  { date: "2024-06-03", clicks: 103, uniqueVisitors: 160 },
  { date: "2024-06-04", clicks: 439, uniqueVisitors: 380 },
  { date: "2024-06-05", clicks: 88, uniqueVisitors: 140 },
  { date: "2024-06-06", clicks: 294, uniqueVisitors: 250 },
  { date: "2024-06-07", clicks: 323, uniqueVisitors: 370 },
  { date: "2024-06-08", clicks: 385, uniqueVisitors: 320 },
  { date: "2024-06-09", clicks: 438, uniqueVisitors: 480 },
  { date: "2024-06-10", clicks: 155, uniqueVisitors: 200 },
  { date: "2024-06-11", clicks: 92, uniqueVisitors: 150 },
  { date: "2024-06-12", clicks: 492, uniqueVisitors: 420 },
  { date: "2024-06-13", clicks: 81, uniqueVisitors: 130 },
  { date: "2024-06-14", clicks: 426, uniqueVisitors: 380 },
  { date: "2024-06-15", clicks: 307, uniqueVisitors: 350 },
  { date: "2024-06-16", clicks: 371, uniqueVisitors: 310 },
  { date: "2024-06-17", clicks: 475, uniqueVisitors: 520 },
  { date: "2024-06-18", clicks: 107, uniqueVisitors: 170 },
  { date: "2024-06-19", clicks: 341, uniqueVisitors: 290 },
  { date: "2024-06-20", clicks: 408, uniqueVisitors: 450 },
  { date: "2024-06-21", clicks: 169, uniqueVisitors: 210 },
  { date: "2024-06-22", clicks: 317, uniqueVisitors: 270 },
  { date: "2024-06-23", clicks: 480, uniqueVisitors: 530 },
  { date: "2024-06-24", clicks: 132, uniqueVisitors: 180 },
  { date: "2024-06-25", clicks: 141, uniqueVisitors: 190 },
  { date: "2024-06-26", clicks: 434, uniqueVisitors: 380 },
  { date: "2024-06-27", clicks: 448, uniqueVisitors: 490 },
  { date: "2024-06-28", clicks: 149, uniqueVisitors: 200 },
  { date: "2024-06-29", clicks: 103, uniqueVisitors: 160 },
  { date: "2024-06-30", clicks: 446, uniqueVisitors: 400 },
];
const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--chart-1)",
  },
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const VisitorsChart = () => {
  const searchParams = useSearchParams();
  const timeRange = searchParams.get("timeRange") || "30d";

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clicks and Visitors Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clicks)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clicks)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillUniqueVisitors"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-uniqueVisitors)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-uniqueVisitors)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="url(#fillClicks)"
              stroke="var(--color-clicks)"
            />
            <Area
              dataKey="uniqueVisitors"
              type="natural"
              fill="url(#fillUniqueVisitors)"
              stroke="var(--color-uniqueVisitors)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VisitorsChart;
