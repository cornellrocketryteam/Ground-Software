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
import { type TelemetryChannel } from "@/lib/definitions";

interface DashboardWidgetProps {
  id: string;
  channel: TelemetryChannel;
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
      id,
      channel,
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
    const WidgetComponent = channel.component;

    const [mode, setMode] = useState(channel.modes[0] ?? "");

    const handleModeChange = (newMode: string) => {
      setMode(newMode);
      onModeChange(id, newMode);
    };

    return (
      <div
        style={style}
        className={cn("border border-gray-200 rounded p-2", className)}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <WidgetComponent mode={mode} channel={channel} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsVerticalIcon className="drag-ignore absolute top-2 right-1 h-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-34 drag-ignore">
            <DropdownMenuRadioGroup
              value={mode}
              onValueChange={handleModeChange}
            >
              {channel.modes.map((m) => (
                <DropdownMenuRadioItem key={m} value={m}>
                  {m}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {channel.modes.length > 0 && <DropdownMenuSeparator />}
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
