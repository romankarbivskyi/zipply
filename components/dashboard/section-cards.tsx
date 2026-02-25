import { use } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { IconLink, IconClick, IconUsers } from "@tabler/icons-react";
import { formatNumberWithSuffix } from "@/lib/utils";
import { DashboardMetrics } from "@/data/links";

interface SectionCardsProps {
  data: Promise<DashboardMetrics>;
  timeRange: string;
}

const timeRangeMap: Record<string, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
};

const SectionCards = ({ data, timeRange }: SectionCardsProps) => {
  const periodLabel = timeRangeMap[timeRange] || "the selected period";
  const metrics = use(data);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="from-background to-card/50 @container/card bg-linear-to-b">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconLink className="text-primary size-4" />
            Total Links
          </CardDescription>
          <CardTitle className="@[250px]:card:text-3xl text-2xl font-bold tracking-tight tabular-nums">
            {formatNumberWithSuffix(metrics.totalLinks)}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <p className="text-muted-foreground line-clamp-1 text-sm">
            Total links created in {periodLabel}
          </p>
        </CardFooter>
      </Card>

      <Card className="from-background to-card/50 @container/card bg-linear-to-b">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconClick className="text-primary size-4" />
            Total Clicks
          </CardDescription>
          <CardTitle className="@[250px]:card:text-3xl text-2xl font-bold tracking-tight tabular-nums">
            {formatNumberWithSuffix(metrics.totalClicks)}
          </CardTitle>
        </CardHeader>

        <CardFooter>
          <p className="text-muted-foreground line-clamp-1 text-sm">
            Total clicks for {periodLabel}
          </p>
        </CardFooter>
      </Card>

      <Card className="from-background to-card/50 @container/card bg-linear-to-b">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconUsers className="text-primary size-4" />
            Unique Users
          </CardDescription>
          <CardTitle className="@[250px]:card:text-3xl text-2xl font-bold tracking-tight tabular-nums">
            {formatNumberWithSuffix(metrics.uniqueVisitors)}
          </CardTitle>
        </CardHeader>

        <CardFooter>
          <p className="text-muted-foreground line-clamp-1 text-sm">
            Total unique users for {periodLabel}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectionCards;
