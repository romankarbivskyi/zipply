import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconMail, IconCalendar } from "@tabler/icons-react";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const UserInfoCard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <Card className="from-background to-card/50 bg-linear-to-b">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-full border">
            <Image
              src={user.image || "/user-avatar.png"}
              alt={user.name || "Unknown User"}
              width={64}
              height={64}
              className="size-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
              {user.emailVerified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center gap-1.5 text-sm">
              <IconMail className="text-muted-foreground size-4 shrink-0" />
              {user.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2 text-sm">
            <IconCalendar className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground">Joined</span>
            <span className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
