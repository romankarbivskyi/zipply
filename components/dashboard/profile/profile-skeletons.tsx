import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const UserInfoSkeleton = () => {
  return (
    <Card className="from-background to-card/50 bg-linear-to-b">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:gap-6">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
};
