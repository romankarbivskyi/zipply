import { describe, it, expect, beforeEach } from "vitest";
import { useSelectionStore } from "@/store/use-selection-store";

describe("useSelectionStore", () => {
  beforeEach(() => {
    useSelectionStore.getState().clearSelection();
  });

  it("adds and removes ids", () => {
    const store = useSelectionStore.getState();
    expect(store.selectedIds.size).toBe(0);

    store.toggleSelect("1");
    expect(useSelectionStore.getState().selectedIds.has("1")).toBe(true);

    store.toggleSelect("1");
    expect(useSelectionStore.getState().selectedIds.has("1")).toBe(false);
  });

  it("selects all and clears", () => {
    const store = useSelectionStore.getState();
    store.selectAll(["1", "2", "3"]);
    expect(useSelectionStore.getState().selectedIds.size).toBe(3);

    useSelectionStore.getState().clearSelection();
    expect(useSelectionStore.getState().selectedIds.size).toBe(0);
  });
});
