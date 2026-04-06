"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumberWithSuffix, getShortLink } from "@/lib/utils";
import {
  IconExternalLink,
  IconClick,
  IconCalendar,
  IconWorld,
  IconEdit,
} from "@tabler/icons-react";
import type { Link as LinkType } from "@/lib/generated/prisma/client";
import Image from "next/image";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteLinks } from "@/actions/link";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface LinkCardProps {
  link: LinkType;
}

const LinkCard = ({ link }: LinkCardProps) => {
  const [isPending, startTransition] = useTransition();

  const shortUrl = getShortLink(link.shortCode);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteLinks([link.id]);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Link deleted successfully");
    });
  };

  const handleEdit = () => {
    startTransition(async () => {});
  };

  return (
    <Card className="from-background to-card/50 bg-linear-to-b">
      <CardHeader className="grid-cols-1 sm:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
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

        <CardAction className="col-start-1 row-start-auto space-x-2 justify-self-start sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:justify-self-end">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleEdit}
            asChild
          >
            <Link href={`/dashboard/links/edit/${link.id}`}>
              <IconEdit className="size-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash className="size-3.5" />
            Delete
          </Button>
        </CardAction>
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
