"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import React, { useState, useEffect, useRef } from "react";
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";

import { WidgetHandle } from "@/components/dashboard/widget-handle";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import TelemetryAdder from "@/components/telemetry-adder";

import { type Widget, type Data } from "@/lib/definitions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Home() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [data, setData] = useState<Data[]>([]);
  const wsRef = useRef<WebSocket | null>(null); // Store the WebSocket instance

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws"); // Replace with your WebSocket server URL

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      wsRef.current = ws; // Store the WebSocket instance
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Check if the message is historical data or a live data point
       if (message.historical) { 
        // Historical data – overwrite existing data
        setData(message.data.map((item: { timestamp: Date; value: number; }) => ({
          timestamp: new Date(item.timestamp),
          temp: Number(item.value) // Map "value" to "temp"
        })));
      } else {
        setData(prevData => [...prevData, { timestamp: new Date(Date.now()), temp: message.rockTelem.temp }]); // Add timestamp to live data
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
                field: "temp",
              })
            );
          } else {
            console.error("WebSocket not connected. Cannot request historical data.");
          }
          return { ...widget, mode: newMode };
        } else if (widget.layout.i === widgetId && newMode === "60m Chart") {
          if (wsRef.current) {
            wsRef.current.send(
              JSON.stringify({
                start: -60,
                stop: 0,
                measurement: "temperature",
                field: "temp",
              })
            );
          } else {
            console.error("WebSocket not connected. Cannot request historical data.");
          }
          return { ...widget, mode: newMode };
        } else if (widget.layout.i === widgetId){
          return {...widget, mode: newMode};
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
        data={data}
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
      <div className="fixed bottom-10 right-10 z-50">
        <TelemetryAdder setWidgets={setWidgets}></TelemetryAdder>
      </div>
    </div>
  );
}
