"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import React, { useState, useEffect, useRef } from "react";
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";

import { WidgetHandle } from "@/components/dashboard/widget-handle";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { TelemetryAdder } from "@/components/dashboard/telemetry-adder";
import { PresetSelector } from "@/components/dashboard/preset-selector";

import { type Widget, type DataPoint } from "@/lib/definitions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Home() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const wsRef = useRef<WebSocket | null>(null); // Store the WebSocket instance

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws"); // Replace with your WebSocket server URL

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      wsRef.current = ws; // Store the WebSocket instance
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.historical) {
        // Historical data
        console.log("Historical Message Received");

        setWidgets((prevWidgets) =>
          prevWidgets.map((widget) => {
            if (widget.channel.dbField === message.field) {
              console.log("Widget has matching field");
              const widgetData: DataPoint[] = message.data.map(
                (item: { timestamp: string; value: number }) => {
                  return {
                    timestamp: new Date(item.timestamp),
                    value: item.value,
                  };
                }
              );
              return { ...widget, data: widgetData };
            } else {
              console.log(
                `Fields did not match ${widget.channel.dbField} and ${message.field}`
              );
              return widget;
            }
          })
        );
      } else {
        // Live data

        setWidgets((prevWidgets) =>
          prevWidgets.map((widget) => {
            const field = widget.channel.jsonField;
            let newValue = null;
            if (field in message) {
              console.log("%s in message.", field);
              newValue = message[field];
            } else if (field in message.rockTelem) {
              console.log("%s in message.rockTelem.", field);
              newValue = message.rockTelem[field];
            } else if (field in message.rockTelem.accelTelem) {
              console.log("%s in message.rockTelem.accelTelem.", field);
              newValue = message.rockTelem.accelTelem[field];
            } else if (field in message.rockTelem.events) {
              newValue = message.rockTelem.events[field];
            } else if (field in message.rockTelem.gpsTelem) {
              newValue = message.rockTelem.gpsTelem[field];
            } else if (field in message.rockTelem.imuTelem) {
              newValue = message.rockTelem.imuTelem[field];
            } else if (field in message.rockTelem.metadata) {
              newValue = message.rockTelem.metadata[field];
            } else {
              console.log("%s not in message.", field);
            }

            if (newValue) {
              console.log(widget);
              return {
                ...widget,
                data: [
                  ...widget.data,
                  { timestamp: new Date(), value: newValue },
                ],
              };
            }

            return widget;
          })
        );
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      wsRef.current = null; // Clear the WebSocket instance
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      wsRef.current = null; // Clear the WebSocket instance
    };

    // Clean up on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const onLayoutChange = (layout: Layout[]) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) => {
        const updatedLayout = layout.find((l) => l.i === widget.layout.i);
        if (updatedLayout) {
          return { ...widget, layout: updatedLayout };
        }
        return widget;
      })
    );
  };

  const onWidgetModeChange = (widgetId: string, newMode: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) => {
        if (widget.layout.i === widgetId && newMode === "15m Chart") {
          if (wsRef.current) {
            wsRef.current.send(
              JSON.stringify({
                start: -15,
                stop: 0,
                field: widget.channel.dbField,
              })
            );
          } else {
            console.error(
              "WebSocket not connected. Cannot request historical data."
            );
          }
          return { ...widget, mode: newMode };
        } else if (widget.layout.i === widgetId && newMode === "60m Chart") {
          if (wsRef.current) {
            wsRef.current.send(
              JSON.stringify({
                start: -60,
                stop: 0,
                field: widget.channel.dbField,
              })
            );
          } else {
            console.error(
              "WebSocket not connected. Cannot request historical data."
            );
          }
          return { ...widget, mode: newMode };
        } else if (widget.layout.i === widgetId) {
          return { ...widget, mode: newMode };
        }

        return widget;
      })
    );
  };

  // TODO for performance improvement, find a way that widgets does not rely on layout (then we can memoize the children and avoid re-rendering)
  const children = widgets.map((widget) => {
    const deleteWidget = () =>
      setWidgets((prevWidgets) =>
        prevWidgets.filter((w) => w.layout.i !== widget.layout.i)
      );

    return (
      <DashboardWidget
        key={widget.layout.i}
        widget={widget}
        deleteWidget={deleteWidget}
        onModeChange={onWidgetModeChange}
      />
    );
  });

  return (
    <div>
      <ResponsiveReactGridLayout
        className="layout"
        draggableCancel=".drag-ignore"
        layouts={{
          lg: widgets.map((widget) => widget.layout),
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
        <PresetSelector setWidgets={setWidgets} />
        <TelemetryAdder setWidgets={setWidgets}></TelemetryAdder>
      </div>
    </div>
  );
}
