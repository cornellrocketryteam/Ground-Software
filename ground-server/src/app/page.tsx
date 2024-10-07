"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import React, { useState, useEffect } from "react";
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";

import { WidgetHandle } from "@/components/dashboard/widget-handle";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import TelemetryAdder from "@/components/telemetry-adder";

import { type Widget, type Data } from "@/lib/definitions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Home() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [data, setData] = useState<Data>({ temp: 0 });

  const websocketUrl = process.env.WEBSOCKET_URL || "ws://localhost:8080/ws";

  useEffect(() => {
    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up on unmount
    return () => {
      if (ws) {
        ws.close();
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
