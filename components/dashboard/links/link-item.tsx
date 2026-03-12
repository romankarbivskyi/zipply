"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumberWithSuffix } from "@/lib/utils";
import {
  IconExternalLink,
  IconClick,
  IconCalendar,
  IconWorld,
} from "@tabler/icons-react";
import type { Link as LinkType } from "@/lib/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";
import { CopyButton } from "@/components/copy-button";
import { useRouter } from "next/navigation";

interface LinkItemProps {
  link: LinkType;
}

const LinkItem = ({ link }: LinkItemProps) => {
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${link.shortCode}`;

  const router = useRouter();

  const goToDetails = () => router.push(`/dashboard/links/${link.id}`);

  return (
    <Card
      className="group transition-shadow hover:shadow-md"
      role="link"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(e) => {
        if (e.key == "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetails();
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
              {link.favicon ? (
                <Image
                  src={link.favicon}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
              ) : (
                <IconWorld className="text-muted-foreground size-5" />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="truncate text-sm font-semibold">
                {link.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-primary truncate font-mono text-xs">
                  {shortUrl}
                </span>
                <CopyButton text={shortUrl} />
              </div>
              <CardDescription>
                <Link
                  href={link.originalUrl}
                  className="flex max-w-xs items-center gap-1.5 truncate text-xs"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconExternalLink className="size-3 shrink-0" />
                  <span className="truncate hover:underline">
                    {link.originalUrl}
                  </span>
                </Link>
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0 gap-1">
            <IconClick className="size-3.5" />
            {formatNumberWithSuffix(link.clicks)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <IconCalendar className="size-3.5" />
          {formatDate(link.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkItem;
