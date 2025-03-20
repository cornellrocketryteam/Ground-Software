import { forwardRef, type MouseEvent, type TouchEvent } from "react";

interface WidgetHandleProps {
  handleAxis?: string;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
}

export const WidgetHandle = forwardRef<HTMLDivElement, WidgetHandleProps>(
  ({ onMouseDown, onMouseUp, onTouchEnd }, ref) => {
    return (
      <span
        className="drag-ignore absolute bottom-0 right-0 text-gray-400 dark:text-gray-200 cursor-se-resize"
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15L15 21M21 8L8 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  },
);

WidgetHandle.displayName = "WidgetHandle";
