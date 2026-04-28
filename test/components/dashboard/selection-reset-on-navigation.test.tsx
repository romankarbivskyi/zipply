import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import SelectionResetOnNavigation from "@/components/dashboard/selection-reset-on-navigation";
import { useSelectionStore } from "@/store/use-selection-store";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

describe("SelectionResetOnNavigation", () => {
  it("clears selection when mounted and pathname changes", () => {
    useSelectionStore.setState({ selectedIds: new Set(["123"]) });
    expect(useSelectionStore.getState().selectedIds.size).toBe(1);

    render(<SelectionResetOnNavigation />);

    expect(useSelectionStore.getState().selectedIds.size).toBe(0);
  });
});
