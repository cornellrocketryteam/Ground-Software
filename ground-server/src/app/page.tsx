"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useState, useEffect, useRef, useMemo } from "react";
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";

import { TELEMETRY_CHANNELS } from "@/lib/telemetry-channels";

import { WidgetHandle } from "@/components/dashboard/widget-handle";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { TelemetryAdder } from "@/components/dashboard/telemetry-adder";
import { PresetSelector } from "@/components/dashboard/preset-selector";

import { type DataPoint, type TelemetryChannel } from "@/lib/definitions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Home() {
  const [channels, setChannels] = useState<
    {
      id: string;
      channel: TelemetryChannel;
    }[]
  >([]);
  const [layouts, setLayouts] = useState<
    {
      id: string;
      layout: Layout;
    }[]
  >([]);
  const [data, setData] = useState<
    {
      id: string;
      data: DataPoint[];
    }[]
  >([]);
  const wsRef = useRef<WebSocket | null>(null); // Store the WebSocket instance

  // Load layouts and channels from localStorage on mount
  useEffect(() => {
    const storedLayouts = localStorage.getItem("layouts");
    const storedChannels = localStorage.getItem("channels");

    if (storedLayouts && storedChannels) {
      const parsedLayouts = JSON.parse(storedLayouts);
      setLayouts(parsedLayouts);

      const parsedChannels = JSON.parse(storedChannels);
      const channels = parsedChannels.map((channel: { id: string, channel_id: string }) => ({
        id: channel.id,
        channel: TELEMETRY_CHANNELS.find((c) => c.id === channel.channel_id)!,
      }));
      setChannels(channels);

      // Initialize data for each channel
      const initialData = parsedChannels.map((channel: { id: string; }) => ({
        id: channel.id,
        data: [],
      }));
      setData(initialData);
    }
  }, []);

  useEffect(() => {
    const primaryUrl = "ws://localhost:8080/ws";
    const fallbackUrl = "ws://10.48.59.182:8080/ws";

    const connect = (url: string) => {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection opened:", url);
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket connection closed:", event.reason, event.code);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (url === primaryUrl) {
          console.log(`Attempting fallback to ${fallbackUrl}`);
          connect(fallbackUrl);

        } else {
          console.error("WebSocket connection failed permanently.")
        }
      };
    };

    connect(primaryUrl);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.historical) {
          // Historical data
          console.log("Historical Message Received");

          setData((prevData) =>
            prevData.map((data) => {
              const channel = channels.find(
                (channel) => channel.id === data.id
              )!.channel;

              if (channel.dbField === message.field) {
                console.log("Widget has matching field");

                const widgetData: DataPoint[] = message.data.map(
                  (item: { timestamp: string; value: number }) => {
                    return {
                      timestamp: new Date(item.timestamp),
                      value: item.value,
                    };
                  }
                );

                return {
                  id: data.id,
                  data: widgetData,
                };
              } else {
                console.log(
                  `Fields did not match ${channel.dbField} and ${message.field}`
                );
                return data;
              }
            })
          );
        } else {
          // Live data

          setData((prevData) =>
            prevData.map((data) => {
              const channel = channels.find(
                (channel) => channel.id === data.id
              )!.channel;

              const field = channel.dbField;
              let newValue = null;
              if (field in message) {
                console.log("%s in message.", field);
                newValue = message[field];
              } else {
                console.log("%s not in message.", field);
              }

              if (newValue) {
                return {
                  id: data.id,
                  data: [
                    ...data.data,
                    { timestamp: new Date(), value: newValue },
                  ],
                };
              }

              return data;
            })
          );
        }
      };
    }
  }, [channels]);

  const onLayoutChange = (layout: Layout[]) => {
    setLayouts((prevLayouts) => {
        const newLayout = prevLayouts.map((prevLayout) => {
          const updatedLayout = layout.find((l) => l.i === prevLayout.id);
          if (updatedLayout) {
            return {
              id: prevLayout.id,
              layout: updatedLayout,
            };
          }
          return prevLayout;
        });

        // 1. Better error handling
        // 2. Ties into telemetry right away
        // 3. Store mode

        localStorage.setItem("layouts", JSON.stringify(newLayout));
        localStorage.setItem("channels", JSON.stringify(channels.map((c) => {
          return {
            id: c.id,
            channel_id: c.channel.id
          }
        }))); 

        return newLayout;
      }
    );

  };

  const children = useMemo(() => {
    const onWidgetModeChange = (widgetId: string, newMode: string) => {
      const channel = channels.find((channel) => channel.id === widgetId)!;
      if (channel.id === widgetId && newMode === "15m Chart") {
        if (wsRef.current) {
          wsRef.current.send(
            JSON.stringify({
              start: -15,
              stop: 0,
              field: channel.channel.dbField,
            })
          );
        } else {
          console.error(
            "WebSocket not connected. Cannot request historical data."
          );
        }
      } else if (channel.id === widgetId && newMode === "60m Chart") {
        if (wsRef.current) {
          wsRef.current.send(
            JSON.stringify({
              start: -60,
              stop: 0,
              field: channel.channel.dbField,
            })
          );
        } else {
          console.error(
            "WebSocket not connected. Cannot request historical data."
          );
        }
      }
    };

    return channels.map((channel) => {
      const deleteWidget = () => {
        console.log("Deleting widget", channel.id);
        setChannels((prevChannels) =>
          prevChannels.filter((c) => c.id !== channel.id)
        );
        setLayouts((prevLayouts) =>
          prevLayouts.filter((w) => w.layout.i !== channel.id)
        );
        setData((prevData) => prevData.filter((d) => d.id !== channel.id));
      };

      return (
        <DashboardWidget
          key={channel.id}
          id={channel.id}
          channel={channel.channel}
          data={data.find((d) => d.id === channel.id)!.data}
          deleteWidget={deleteWidget}
          onModeChange={onWidgetModeChange}
        />
      );
    });
  }, [channels, data]);

  return (
    <div>
      <ResponsiveReactGridLayout
        className="layout"
        draggableCancel=".drag-ignore"
        layouts={{
          lg: layouts.map((layout) => layout.layout),
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
        <PresetSelector
          setChannels={setChannels}
          setLayouts={setLayouts}
          setData={setData}
        />
        <TelemetryAdder
          setChannels={setChannels}
          setLayouts={setLayouts}
          setData={setData}
        />
      </div>
    </div>
  );
}
