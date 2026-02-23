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
  IconCopy,
  IconClick,
  IconCalendar,
  IconCheck,
} from "@tabler/icons-react";
import type { Link as LinkType } from "@/lib/generated/prisma/client";
import Link from "next/link";
import { useState } from "react";

interface LinkItemProps {
  link: LinkType;
}

const LinkItem = ({ link }: LinkItemProps) => {
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${link.shortCode}`;

  return (
    <Link href={`/dashboard/links/${link.id}`}>
      <Card className="group transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <span className="text-primary truncate font-mono text-sm">
                  {shortUrl}
                </span>
                <CopyButton text={shortUrl} />
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 truncate">
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
    </Link>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
      title="Copy short URL"
    >
      {copied ? (
        <IconCheck className="size-3.5" />
      ) : (
        <IconCopy className="size-3.5" />
      )}
    </button>
  );
};

export default LinkItem;
