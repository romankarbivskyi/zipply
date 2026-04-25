"use client";

import { Card } from "@/components/ui/card";
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
    <Card className="overflow-hidden p-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
              {link.favicon ? (
                <Image
                  src={link.favicon}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-sm"
                />
              ) : (
                <IconWorld className="text-muted-foreground size-5" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold wrap-break-word">
                {link.title}
              </h2>
              <Link
                href={link.originalUrl}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm break-all transition-colors hover:underline"
                target="_blank"
              >
                <IconExternalLink className="size-3.5 shrink-0" />
                {link.originalUrl}
              </Link>
            </div>
          </div>

          <div className="text-muted-foreground hidden shrink-0 items-end gap-3 text-xs sm:flex">
            <Badge className="flex items-center gap-1">
              <IconClick className="size-3.5" />
              {formatNumberWithSuffix(link.clicks)} clicks
            </Badge>
            <Badge variant="ghost" className="flex items-center gap-1">
              <IconCalendar className="size-3.5" />
              {formatDate(link.createdAt)}
            </Badge>
          </div>
        </div>

        <div className="bg-muted/50 flex items-center justify-between gap-2 rounded-lg border px-4 py-3">
          <span className="text-primary min-w-0 font-mono text-sm font-medium break-all">
            {shortUrl}
          </span>
          <CopyButton text={shortUrl} size="sm" variant="outline" />
        </div>

        <div className="text-muted-foreground flex items-center gap-3 text-xs sm:hidden">
          <Badge className="flex items-center gap-1">
            <IconClick className="size-3.5" />
            {formatNumberWithSuffix(link.clicks)} clicks
          </Badge>
          <Badge variant="ghost" className="flex items-center gap-1">
            <IconCalendar className="size-3.5" />
            {formatDate(link.createdAt)}
          </Badge>
        </div>

        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {link.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <hr className="border-border" />

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" disabled={isPending} asChild>
            <Link href={`/dashboard/links/edit/${link.id}`}>
              <IconEdit className="size-3.5" />
              Edit
            </Link>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <QrCode className="size-3.5" />
                QR
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

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LinkCard;
