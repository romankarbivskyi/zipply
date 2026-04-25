"use client";

import { Card } from "@/components/ui/card";
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
  const router = useRouter();
  const { isSelected, hasSelection, toggleSelect, consumeLongPressSelection } =
    useSelection({ cardRef, linkId: link.id });

  const shortUrl = getShortLink(link.shortCode);
  const goToDetails = () => router.push(`/dashboard/links/${link.id}`);

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden p-4 transition-all hover:shadow-md",
        isSelected
          ? "border-primary ring-primary ring-2 ring-offset-2"
          : "hover:border-border",
      )}
      ref={cardRef}
      onClick={(e) => {
        if (consumeLongPressSelection()) return;
        if (hasSelection) {
          e.preventDefault();
          toggleSelect(link.id);
          return;
        }
        goToDetails();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        toggleSelect(link.id);
      }}
      onKeyDown={(e) => {
        if (e.key == "Enter" || e.key === " ") {
          if (hasSelection) {
            toggleSelect(link.id);
            return;
          }
          goToDetails();
        }
      }}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-start gap-3">
          <div className="bg-muted xs:flex border-border/40 group-hover:bg-muted/70 hidden size-9 shrink-0 items-center justify-center rounded-lg border transition-colors">
            {link.favicon ? (
              <Image
                src={link.favicon}
                alt=""
                width={20}
                height={20}
                className="rounded-sm"
              />
            ) : (
              <IconWorld className="text-muted-foreground size-4.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="line-clamp-2 min-h-[1.25rem] text-sm font-bold tracking-tight"
              title={link.title}
            >
              {link.title}
            </h3>
            <Link
              href={link.originalUrl}
              className="text-muted-foreground hover:text-foreground inline-flex max-w-full items-center gap-1 text-[11px] transition-colors hover:underline"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <IconExternalLink className="size-3 shrink-0" />
              {link.originalUrl}
            </Link>
          </div>
        </div>

        <div className="bg-muted/40 border-border/50 group-hover:border-border group-hover:bg-muted/60 flex items-center justify-between gap-2.5 rounded-lg border px-3 py-1.5 transition-all">
          <span className="text-primary min-w-0 font-mono text-sm font-medium break-all">
            {shortUrl}
          </span>
          <CopyButton
            text={shortUrl}
            size="xs"
            variant="ghost"
            className="size-7 shrink-0 opacity-80 hover:opacity-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-0.5">
          <Badge
            variant="secondary"
            className="bg-secondary/80 flex items-center gap-1 py-0 text-[10px] font-bold"
          >
            <IconClick className="size-3" />
            {formatNumberWithSuffix(link.clicks)}
          </Badge>
          <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-medium">
            <IconCalendar className="size-3" />
            {formatDate(link.createdAt)}
          </span>

          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {link.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-background/50 max-w-[100px] truncate px-1.5 py-0 text-[10px] font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LinkItem;
