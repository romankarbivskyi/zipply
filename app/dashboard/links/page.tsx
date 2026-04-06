import { Suspense } from "react";
import Heading from "@/components/dashboard/heading";
import LinkList from "@/components/dashboard/links/link-list";
import Search from "@/components/dashboard/links/search";
import Pagination from "@/components/dashboard/links/pagination";
import { LinkListSkeleton } from "@/components/dashboard/links/link-list-skeleton";
import { fetchFilteredLinks, fetchLinksPages } from "@/data/links";
import SelectionToolbar from "@/components/dashboard/links/selection-toolbar";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { search = "", page = "1" } = await searchParams;
  const currentPage = Number(page) || 1;
  const { totalPages } = await fetchLinksPages(search);
  const currentLinks = await fetchFilteredLinks(search, currentPage);

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Links" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <SelectionToolbar
            currentLinkIds={currentLinks.map((link) => link.id)}
          />
          <Search />
        </div>
        <Suspense key={search + currentPage} fallback={<LinkListSkeleton />}>
          <LinkList links={currentLinks} />
        </Suspense>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
