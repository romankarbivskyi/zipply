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
import { QrCode, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";

interface LinkCardProps {
  link: LinkType;
}

const LinkCard = ({ link }: LinkCardProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const shortUrl = getShortLink(link.shortCode);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch("/api/v1/links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [link.id] }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to delete link");
        return;
      }
      toast.success("Link deleted successfully");
      router.refresh();
    });
  };

  return (
    <Card className="from-background to-card/50 bg-linear-to-b">
      <CardHeader className="grid-cols-1 sm:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <div className="flex items-start gap-4">
          <div className="bg-muted xs:flex hidden size-12 shrink-0 items-center justify-center rounded-xl">
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
          <div className="min-w-0flex-1 max-w-4/5 space-y-1">
            <CardTitle className="truncate text-lg font-semibold">
              {link.title}
            </CardTitle>
            <CardDescription className="flex min-w-0 items-center gap-1.5">
              <IconExternalLink className="size-3.5 shrink-0" />
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground min-w-0 truncate transition-colors hover:underline"
              >
                {link.originalUrl}
              </a>
            </CardDescription>
          </div>
        </div>

        <CardAction className="col-start-1 row-start-auto space-x-2 justify-self-start lg:col-start-2">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" size="sm">
                <QrCode /> QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Code</DialogTitle>
                <DialogDescription>
                  Scan the QR code below to visit the link.
                </DialogDescription>
                <QRCode
                  value={shortUrl}
                  className="mx-auto mt-2 max-h-50 max-w-50 border-2 border-white"
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" disabled={isPending} asChild>
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
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="text-primary min-w-0 truncate font-mono text-sm">
              {shortUrl}
            </span>
            <CopyButton text={shortUrl} size="xs" variant="ghost" />
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
