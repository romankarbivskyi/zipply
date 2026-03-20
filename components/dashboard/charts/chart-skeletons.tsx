import { Card, CardContent, CardHeader } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

export const VisitorsChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-56" />
      </CardHeader>
      <CardContent>
        <div className="flex h-[250px] w-full flex-col justify-end gap-2">
          <div className="flex items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export const CountriesChartSkeleton = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex h-[250px] flex-col justify-center gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-24 shrink-0" />
              <Skeleton
                className="h-6 rounded-sm"
                style={{
                  width: `${90 - i * 12}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const DevicesChartSkeleton = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center">
        <Skeleton className="size-[180px] rounded-full" />
        <div className="mt-4 flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="size-3 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const SectionCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="from-background to-card/50 @container/card bg-linear-to-b"
        >
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
