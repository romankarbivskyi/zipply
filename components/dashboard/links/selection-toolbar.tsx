"use client";

import { useSelectionStore } from "@/store/use-selection-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVerticalIcon,
  Square,
  SquareCheck,
  SquareMinus,
} from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SelectionToolbarProps {
  currentLinkIds: string[];
}

const SelectionToolbar = ({ currentLinkIds }: SelectionToolbarProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { selectedIds, selectAll, clearSelection } = useSelectionStore();

  const selectedCount = currentLinkIds.reduce(
    (count, id) => count + (selectedIds.has(id) ? 1 : 0),
    0,
  );

  const anySelected = selectedCount > 0;
  const allSelected =
    currentLinkIds.length > 0 && selectedCount === currentLinkIds.length;

  const handleDeleteSelected = () => {
    startTransition(async () => {
      const res = await fetch("/api/v1/links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to delete links");
        return;
      }
      clearSelection();
      toast.success("Links deleted");
      router.refresh();
    });
  };

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        onClick={() =>
          anySelected ? clearSelection() : selectAll(currentLinkIds)
        }
      >
        {allSelected ? (
          <SquareCheck />
        ) : anySelected ? (
          <SquareMinus />
        ) : (
          <Square />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => selectAll(currentLinkIds)}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={clearSelection}>None</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={!anySelected || isPending}
          >
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};

export default SelectionToolbar;
