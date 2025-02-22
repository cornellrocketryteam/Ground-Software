"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useState, useEffect, useMemo } from "react";
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
          const tc = TELEMETRY_CHANNELS.find(
            (tc) => tc.dbField === ch.channel.dbField
          );
          if (tc === undefined) return undefined;

          return {
            ...ch,
            channel: {
              ...ch.channel,
              widgets: ch.channel.widgets
                .map((widget: any) =>
                  tc.widgets.find((w) => w.mode === widget.mode)
                )
                .filter((w: any) => w !== undefined),
            },
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

      localStorage.setItem("channels", JSON.stringify(newChannels));

      return newChannels;
    });
  };

  const children = useMemo(() => {
    return channels.map((channel) => {
      const deleteWidget = () => {
        console.log("Deleting widget", channel.id);
        setChannels((prevChannels) =>
          prevChannels.filter((c) => c.id !== channel.id)
        );
      };

      return (
        <DashboardWidget
          key={channel.id}
          channel={channel.channel}
          deleteWidget={deleteWidget}
        />
      );
    });
  }, [channels]);

  return (
    <div>
      <ResponsiveReactGridLayout
        className="layout"
        draggableCancel=".drag-ignore"
        layouts={{
          lg: channels.map((channel) => channel.layout),
        }}
        cols={{ lg: 24, md: 20, sm: 14, xs: 10, xxs: 6 }}
        rowHeight={50}
        autoSize={false}
        onLayoutChange={onLayoutChange}
        resizeHandle={<WidgetHandle />}
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
