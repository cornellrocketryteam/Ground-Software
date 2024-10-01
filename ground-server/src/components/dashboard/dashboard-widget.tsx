"use client";

import {
  forwardRef,
  useState,
  type ReactNode,
  type MouseEvent,
  type TouchEvent,
  type CSSProperties,
} from "react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

interface DashboardWidgetProps {
  deleteWidget: () => void;
  style?: CSSProperties;
  className?: string;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  children: ReactNode;
}

export const DashboardWidget = forwardRef<HTMLDivElement, DashboardWidgetProps>(
  ({ deleteWidget, style, className, onMouseDown, onMouseUp, onTouchEnd, children }, ref) => {
    const [displayStyle, setDisplayStyle] = useState("value");

    return (
      <div
        style={style}
        className={cn("border border-gray-200 rounded p-2", className)}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        {children}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsVerticalIcon className="drag-ignore absolute top-2 right-1 h-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-34 drag-ignore">
            <DropdownMenuRadioGroup
              value={displayStyle}
              onValueChange={setDisplayStyle}
            >
              <DropdownMenuRadioItem value="value">Value</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="chart">Chart</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem inset className="text-red-600" onClick={deleteWidget}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

DashboardWidget.displayName = "DashboardWidget";
