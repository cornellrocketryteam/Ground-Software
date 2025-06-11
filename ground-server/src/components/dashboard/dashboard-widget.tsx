"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useMemo,
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
import { useData } from "@/contexts/data-context";
import { cn } from "@/lib/utils";
import type { Widget, TelemetryChannel } from "@/lib/definitions";

interface DashboardWidgetProps {
  channel: TelemetryChannel;
  deleteWidget: () => void;
  initialMode: string;
  initialMeasurement: string;
  onSettingsChange: (mode: string, measurement: string) => void;

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
      initialMode,
      initialMeasurement,
      onSettingsChange,

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

    const { data, registerLiveDbField, deregisterLiveDbField } = useData();

    useEffect(() => {
      channel.dbFields.forEach(field => {
        registerLiveDbField(field);
        console.log(`Registering field ${field}`);
      });
      return () => {
        channel.dbFields.forEach(field => {
          deregisterLiveDbField(field);
        });
      };
    }, [channel.dbFields, registerLiveDbField, deregisterLiveDbField]);

    // Build a lookup for widget modes
    const modeMap = useMemo(() => {
      return channel.widgets.reduce<Record<string, Widget>>((acc, widget) => {
        if (acc[widget.mode]) {
          throw new Error(`Duplicate mode found: ${widget.mode}`);
        }
        acc[widget.mode] = widget;
        return acc;
      }, {});
    }, [channel.widgets]);

    const allModes = useMemo(() => Object.keys(modeMap), [modeMap]);

    const [mode, setMode] = useState(initialMode);
    const [measurement, setMeasurement] = useState(initialMeasurement);

    // Call onSettingsChange when mode or measurement changes from their initial values
    useEffect(() => {
      if (mode !== initialMode || measurement !== initialMeasurement) {
        onSettingsChange(mode, measurement);
      }
    }, [mode, measurement, initialMode, initialMeasurement, onSettingsChange]);

    const activeWidget = modeMap[mode];
    if (!activeWidget) {
      throw new Error(`No widget found for mode: ${mode}`);
    }

    // Collect data from all dbFields
    const fieldData = useMemo(() => {
      const collected: Record<string, Record<string, unknown>> = {};
      channel.dbFields.forEach(field => {
        collected[field] = data[measurement]?.[field] ?? {};
      });
      return collected;
    }, [data, measurement, channel.dbFields]);

    // Check if we have data for any field
    const hasData = channel.dbFields.some(field => 
      Object.keys(fieldData[field]).length > 0
    );
    
    const ActiveComponent = hasData
      ? activeWidget.component
      : () => (
          <div className="w-full h-full flex flex-col justify-center items-center gap-2">
            <p className="font-semibold text-lg">{channel.label}</p>
            <p className="font-normal text-lg">No data</p>
          </div>
        );

    return (
      <div
        ref={ref}
        style={style}
        className={cn("border border-gray-200 rounded p-2", className)}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <ActiveComponent
          fieldData={fieldData}
          measurement={measurement}
          channel={channel}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsVerticalIcon className="drag-ignore absolute top-2 right-1 h-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-34 drag-ignore">
            <DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
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
