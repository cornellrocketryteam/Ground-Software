"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useState, useEffect, useMemo, useCallback } from "react";
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";

import { TELEMETRY_CHANNELS } from "@/lib/telemetry-channels";

import { WidgetHandle } from "@/components/dashboard/widget-handle";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { TelemetryAdder } from "@/components/dashboard/telemetry-adder";
import { PresetSelector } from "@/components/dashboard/preset-selector";

import type { TelemetryChannel } from "@/lib/definitions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

type Channel = {
  id: string;
  channel: TelemetryChannel;
  layout: Layout;
  mode: string;
  measurement: string;
};

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);

  // Load layouts and channels from localStorage on mount
  useEffect(() => {
    const storedChannels = localStorage.getItem("channels");

    if (storedChannels) {
      const parsedChannels = JSON.parse(storedChannels);
      const rehydratedChannels: Channel[] = parsedChannels
        .map((ch: any) => {
          // Find channel by label (most reliable unique identifier)
          const tc = TELEMETRY_CHANNELS.find(
            (tc) => tc.label === ch.channel.label,
          );
          if (tc === undefined) {
            console.warn(`Could not find telemetry channel with label: ${ch.channel.label}`);
            return undefined;
          }

          // Validate that the stored mode and measurement still exist
          const validMode = tc.widgets.some(w => w.mode === ch.mode);
          const validMeasurement = tc.dbMeasurements.includes(ch.measurement);

          return {
            ...ch,
            channel: tc, // Use the current telemetry channel definition
            mode: validMode ? ch.mode : tc.widgets[0].mode, // Fallback to first mode if invalid
            measurement: validMeasurement ? ch.measurement : tc.dbMeasurements[0], // Fallback to first measurement if invalid
          };
        })
        .filter((ch: any) => ch !== undefined);
      setChannels(rehydratedChannels);
    }
  }, []);

  const onLayoutChange = (layout: Layout[]) => {
    setChannels((prevChannels) => {
      const newChannels = prevChannels.map((prevChannel) => {
        const updatedLayout = layout.find((l) => l.i === prevChannel.id);
        if (updatedLayout) {
          return {
            ...prevChannel,
            layout: updatedLayout,
          };
        }
        return prevChannel;
      });

      // Save minimal data to localStorage - only what we need to restore
      const channelsToSave = newChannels.map(ch => ({
        id: ch.id,
        channel: {
          label: ch.channel.label, // Use label as unique identifier
        },
        layout: ch.layout,
        mode: ch.mode,
        measurement: ch.measurement,
      }));
      localStorage.setItem("channels", JSON.stringify(channelsToSave));

      return newChannels;
    });
  };

  // Stable callback for deleting widgets
  const deleteWidget = useCallback((channelId: string) => {
    console.log("Deleting widget", channelId);
    setChannels((prevChannels) => {
      const newChannels = prevChannels.filter((c) => c.id !== channelId);
      
      // Save minimal data to localStorage
      const channelsToSave = newChannels.map(ch => ({
        id: ch.id,
        channel: {
          label: ch.channel.label,
        },
        layout: ch.layout,
        mode: ch.mode,
        measurement: ch.measurement,
      }));
      localStorage.setItem("channels", JSON.stringify(channelsToSave));
      
      return newChannels;
    });
  }, []);

  // Stable callback for updating widget settings
  const updateWidgetSettings = useCallback((channelId: string, mode: string, measurement: string) => {
    setChannels((prevChannels) => {
      const newChannels = prevChannels.map((c) =>
        c.id === channelId ? { ...c, mode, measurement } : c
      );
      
      // Save minimal data to localStorage
      const channelsToSave = newChannels.map(ch => ({
        id: ch.id,
        channel: {
          label: ch.channel.label,
        },
        layout: ch.layout,
        mode: ch.mode,
        measurement: ch.measurement,
      }));
      localStorage.setItem("channels", JSON.stringify(channelsToSave));
      
      return newChannels;
    });
  }, []);

  const children = useMemo(() => {
    return channels.map((channel) => {
      return (
        <DashboardWidget
          key={channel.id}
          channel={channel.channel}
          deleteWidget={() => deleteWidget(channel.id)}
          initialMode={channel.mode}
          initialMeasurement={channel.measurement}
          onSettingsChange={(mode, measurement) => updateWidgetSettings(channel.id, mode, measurement)}
        />
      );
    });
  }, [channels, deleteWidget, updateWidgetSettings]);

  return (
    <div>
      <ResponsiveReactGridLayout
        className="layout"
        draggableCancel=".drag-ignore"
        layouts={{
          lg: channels.map((channel) => channel.layout),
        }}
        cols={{ lg: 36, md: 30, sm: 21, xs: 15, xxs: 9 }}
        rowHeight={50}
        autoSize={false}
        onLayoutChange={onLayoutChange}
        resizeHandle={<WidgetHandle />}
        margin={[5, 5]}
      >
        {children}
      </ResponsiveReactGridLayout>
      <div className="fixed bottom-10 right-10 z-50 flex gap-2">
        <PresetSelector setChannels={setChannels} />
        <TelemetryAdder setChannels={setChannels} />
      </div>
    </div>
  );
}
