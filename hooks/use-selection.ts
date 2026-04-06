import { useSelectionStore } from "@/store/use-selection-store";
import { useRef, useEffect } from "react";

interface SelectionCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  linkId: string;
}

export const useSelection = ({ cardRef, linkId }: SelectionCardProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggeredRef = useRef(false);

  const { selectedIds, toggleSelect } = useSelectionStore();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseDown = () => {
      longPressTriggeredRef.current = false;
      timeoutRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        toggleSelect(linkId);
      }, 500);
    };

    const handleClearTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    card.addEventListener("mousedown", handleMouseDown);
    card.addEventListener("mouseup", handleClearTimeout);
    card.addEventListener("mouseleave", handleClearTimeout);

    return () => {
      card.removeEventListener("mousedown", handleMouseDown);
      card.removeEventListener("mouseup", handleClearTimeout);
      card.removeEventListener("mouseleave", handleClearTimeout);
      handleClearTimeout();
    };
  }, [cardRef, linkId, selectedIds, toggleSelect]);

  const isSelected = selectedIds.has(linkId);
  const hasSelection = selectedIds.size > 0;

  const consumeLongPressSelection = () => {
    if (!longPressTriggeredRef.current) {
      return false;
    }

    longPressTriggeredRef.current = false;
    return true;
  };

  return { toggleSelect, isSelected, hasSelection, consumeLongPressSelection };
};
