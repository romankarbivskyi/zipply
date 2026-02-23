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
import type { Link } from "@/lib/generated/prisma/client";
import Image from "next/image";
import { CopyButton } from "@/components/copy-button";

interface LinkCardProps {
  link: Link;
}

const LinkCard = ({ link }: LinkCardProps) => {
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${link.shortCode}`;

  return (
    <Card className="from-background to-card/50 bg-linear-to-b">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-xl">
            {link.favicon ? (
              <Image
                src={link.favicon}
                alt=""
                width={28}
                height={28}
                className="rounded-sm"
              />
            ) : (
              <IconWorld className="text-muted-foreground size-6" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="text-lg font-semibold">
              {link.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <IconExternalLink className="size-3.5 shrink-0" />
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground truncate transition-colors hover:underline"
              >
                {link.originalUrl}
              </a>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-primary font-mono text-sm">{shortUrl}</span>
            <CopyButton text={shortUrl} />
          </div>
          <Badge variant="secondary" className="gap-1">
            <IconClick className="size-3.5" />
            {formatNumberWithSuffix(link.clicks)} clicks
          </Badge>
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <IconCalendar className="size-3.5" />
            {formatDate(link.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
