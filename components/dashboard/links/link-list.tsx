import { fetchFilteredLinks } from "@/lib/data/links";
import LinkItem from "./link-item";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LinkListProps {
  search: string;
  currentPage: number;
}

const LinkList = async ({ search, currentPage }: LinkListProps) => {
  const links = await fetchFilteredLinks(search, currentPage);

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16">
        <p className="text-muted-foreground text-sm">
          No links yet. Create your first short link!
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/links/create">
            <IconPlus className="size-4" />
            Create New
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {links.map((link) => (
        <LinkItem key={link.id} link={link} />
      ))}
    </div>
  );
};

export default LinkList;
