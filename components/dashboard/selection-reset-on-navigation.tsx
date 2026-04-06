"use client";

import { useSelectionStore } from "@/store/use-selection-store";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SelectionResetOnNavigation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clearSelection = useSelectionStore((state) => state.clearSelection);

  useEffect(() => {
    clearSelection();
  }, [clearSelection, pathname, searchParams]);

  return null;
};

export default SelectionResetOnNavigation;
