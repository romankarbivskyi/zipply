"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { generatePagination } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
} from "@tabler/icons-react";

interface PaginationProps {
  totalPages: number;
}

const Pagination = ({ totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const pages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNumber));
    return `/dashboard/links?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={currentPage <= 1}
        onClick={() => router.push(createPageURL(currentPage - 1))}
      >
        <IconChevronLeft className="size-4" />
      </Button>

      {pages.map((page, i) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${i}`}
              className="text-muted-foreground flex size-8 items-center justify-center"
            >
              <IconDots className="size-4" />
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            variant={isActive ? "default" : "outline"}
            size="icon"
            className="size-8"
            onClick={() => router.push(createPageURL(pageNum))}
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={currentPage >= totalPages}
        onClick={() => router.push(createPageURL(currentPage + 1))}
      >
        <IconChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default Pagination;
