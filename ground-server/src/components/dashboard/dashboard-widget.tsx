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
import { type Widget } from "@/lib/definitions";

interface DashboardWidgetProps {
  widget: Widget;
  deleteWidget: () => void;
  style?: CSSProperties;
  className?: string;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  children?: ReactNode;
  onModeChange: (widgetId: string, newMode: string) => void;
}

export const DashboardWidget = forwardRef<HTMLDivElement, DashboardWidgetProps>(
  (
    {
      widget,
      deleteWidget,
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      onModeChange,
    },
    ref
  ) => {
    const WidgetComponent = widget.channel.component;

    const [mode, setMode] = useState(widget.channel.modes[0] ?? "");

    const handleModeChange = (newMode: string) => {
      setMode(newMode);
      onModeChange(widget.layout.i, newMode);
    }

    return (
      <div
        style={style}
        className={cn("border border-gray-200 rounded p-2", className)}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <WidgetComponent mode={mode} channel={widget.channel} data={widget.data} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsVerticalIcon className="drag-ignore absolute top-2 right-1 h-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-34 drag-ignore">
            <DropdownMenuRadioGroup value={mode} onValueChange={handleModeChange}>
              {widget.channel.modes.map((m) => (
                <DropdownMenuRadioItem key={m} value={m}>
                  {m}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {widget.channel.modes.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              inset
              className="text-red-600"
              onClick={deleteWidget}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {children}
      </div>
    );
  }
);

DashboardWidget.displayName = "DashboardWidget";
