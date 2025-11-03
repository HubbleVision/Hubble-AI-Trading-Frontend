import type { FC } from "react";
import type { DisplayMode } from "../types";
import { cn } from "~/lib/utils";

/**
 * Toggle component for switching between balance and percentage display modes
 * Compact design with $ and % symbols
 * Aligns with chart's left padding for visual consistency
 */
export const DisplayModeToggle: FC<{
  displayMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  paddingLeft: number;
}> = ({ displayMode, onModeChange, paddingLeft }) => {
  return (
    <div
      className="mt-1 inline-flex bg-black border-2 border-black transition-all duration-150"
      style={{ marginLeft: `${paddingLeft}px` }}
    >
      <button
        onClick={() => onModeChange("balance")}
        className={cn(
          `w-6 h-6 flex items-center justify-center text-base font-medium transition-all duration-150 cursor-pointer`,
          displayMode !== "balance"
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-black text-white"
        )}
        title="Account Balance"
      >
        $
      </button>
      <button
        onClick={() => onModeChange("percentage")}
        className={cn(
          `w-6 h-6 flex items-center justify-center text-base font-medium transition-all duration-150 cursor-pointer`,
          displayMode !== "percentage"
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-black text-white"
        )}
        title="Percentage Change"
      >
        %
      </button>
    </div>
  );
};
