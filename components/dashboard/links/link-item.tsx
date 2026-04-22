"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  cn,
  formatDate,
  formatNumberWithSuffix,
  getShortLink,
} from "@/lib/utils";
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
import { useRef } from "react";
import { useSelection } from "@/hooks/use-selection";

interface LinkItemProps {
  link: LinkType;
}

const LinkItem = ({ link }: LinkItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { isSelected, hasSelection, toggleSelect, consumeLongPressSelection } =
    useSelection({ cardRef, linkId: link.id });
  const router = useRouter();

  const shortUrl = getShortLink(link.shortCode);

  const goToDetails = () => router.push(`/dashboard/links/${link.id}`);

  return (
    <Card
      className={cn("group cursor-pointer transition-shadow hover:shadow-md", {
        "border-primary border-2": isSelected,
      })}
      role="link"
      tabIndex={0}
      ref={cardRef}
      onClick={(e) => {
        if (consumeLongPressSelection()) {
          e.preventDefault();
          return;
        }

        if (hasSelection) {
          e.preventDefault();
          toggleSelect(link.id);
          return;
        }

        goToDetails();
      }}
      onKeyDown={(e) => {
        if (e.key == "Enter" || e.key === " ") {
          e.preventDefault();

          if (hasSelection) {
            toggleSelect(link.id);
            return;
          }

          goToDetails();
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="bg-muted xs:flex hidden size-10 shrink-0 items-center justify-center rounded-lg">
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
            <div className="min-w-0 space-y-1">
              <CardTitle className="max-w-4/5 min-w-0 truncate text-sm font-semibold">
                {link.title}
              </CardTitle>
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-primary truncate font-mono text-xs">
                  {shortUrl}
                </span>
                <CopyButton text={shortUrl} size="xs" variant="ghost" />
              </div>
              <CardDescription className="min-w-0">
                <Link
                  href={link.originalUrl}
                  className="flex min-w-0 items-center gap-1.5 text-xs"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconExternalLink className="size-3 shrink-0" />
                  <span className="min-w-0 flex-1 truncate hover:underline">
                    {link.originalUrl}
                  </span>
                </Link>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <IconCalendar className="size-3.5" />
          {formatDate(link.createdAt)}
        </div>
        <Badge variant="secondary" className="shrink-0 gap-1">
          <IconClick className="size-3.5" />
          {formatNumberWithSuffix(link.clicks)}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default LinkItem;
