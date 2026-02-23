import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  IconLink,
  IconClick,
  IconUsers,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { formatNumberWithSuffix } from "@/lib/utils";

const SectionCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="from-background to-card/50 @container/card bg-linear-to-b">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconLink className="text-primary size-4" />
            Total Links
          </CardDescription>
          <CardTitle className="@[250px]:card:text-3xl text-2xl font-bold tracking-tight tabular-nums">
            {formatNumberWithSuffix(1000)}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <p className="text-muted-foreground line-clamp-1 text-sm">
            Total links created
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
            {formatNumberWithSuffix(100000)}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400"
            >
              <IconTrendingUp className="size-4!" />
              +10%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter>
          <p className="text-muted-foreground line-clamp-1 text-sm">
            Total clicks for 30 days
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
            {formatNumberWithSuffix(100000)}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-400"
            >
              <IconTrendingDown className="size-4!" />
              -10%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter>
          <p className="text-muted-foreground line-clamp-1 text-sm">
            Total unique users for 30 days
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectionCards;
