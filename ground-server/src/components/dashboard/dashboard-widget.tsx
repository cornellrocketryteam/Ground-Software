"use client";

import {
  forwardRef,
  useState,
  type ReactNode,
  type MouseEvent,
  type TouchEvent,
  type CSSProperties,
  useMemo,
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
import type { Widget, TelemetryChannel } from "@/lib/definitions";

interface DashboardWidgetProps {
  channel: TelemetryChannel;
  deleteWidget: () => void;
  style?: CSSProperties;
  className?: string;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  children?: ReactNode;
}

export const DashboardWidget = forwardRef<HTMLDivElement, DashboardWidgetProps>(
  (
    {
      channel,
      deleteWidget,
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
    },
    ref
  ) => {
    if (channel.widgets.length === 0) {
      throw new Error("No widgets found for telemetry channel");
    }

    // Build a lookup for modes to make re-rendering faster
    const modeMap = useMemo(() => {
      const modeMap: Record<string, Widget> = {};
      for (const widget of channel.widgets) {
        const mode = widget.mode;
        if (modeMap[mode]) {
          throw new Error(`Duplicate mode found in 'widgets' list for telemetry channel: ${mode}`);
        }
        modeMap[mode] = widget;
      }
      return modeMap;
    }, [channel.widgets]);

    const allModes = useMemo(() => Object.keys(modeMap), [modeMap]);

    const [mode, setMode] = useState(allModes[0]);
    const [measurement, setMeasurement] = useState(channel.dbMeasurements[0]);

    const activeWidget = modeMap[mode];
    if (!activeWidget) {
      throw new Error(`No widget found for mode: ${mode}. Should be unreachable.`);
    }
    const ActiveComponent = activeWidget.component;

    return (
      <div
        style={style}
        className={cn("border border-gray-200 rounded p-2", className)}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <ActiveComponent measurement={measurement} channel={channel} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsVerticalIcon className="drag-ignore absolute top-2 right-1 h-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-34 drag-ignore">
            <DropdownMenuRadioGroup
              value={mode}
              onValueChange={setMode}
            >
              {allModes.map((m) => (
                <DropdownMenuRadioItem key={m} value={m}>
                  {m}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {allModes.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuRadioGroup
              value={measurement}
              onValueChange={setMeasurement}
            >
              {channel.dbMeasurements.map((m) => (
                <DropdownMenuRadioItem key={m} value={m}>
                  {m}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {channel.dbMeasurements.length > 0 && <DropdownMenuSeparator />}
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
