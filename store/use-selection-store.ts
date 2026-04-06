import { create } from "zustand";

interface SelectionState {
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: new Set(),
  toggleSelect: (id: string) =>
    set((state) => {
      const selectedIds = new Set(state.selectedIds);

      if (selectedIds.has(id)) {
        selectedIds.delete(id);
      } else {
        selectedIds.add(id);
      }

      return { selectedIds };
    }),
  selectAll: (ids: string[]) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
}));
