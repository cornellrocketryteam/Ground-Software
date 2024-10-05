"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import React, { useState, useEffect } from "react";
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";

import { WidgetHandle } from "@/components/dashboard/widget-handle";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";

import { type Widget } from "@/lib/definitions";
import { TelemetryAdder } from "@/components/telemetry-adder";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Home() {
  // ... other state variables
  const [widgets, setWidgets] = useState<Widget[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws'); // Replace with your WebSocket server URL

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      // ... handle connection open (e.g., send an initial message)
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      setWidgets((prevWidgets) => {
        const updatedWidgets = prevWidgets.map((widget) => {
          if (widget.telemetryType === 'Temperature' && message.temp !== undefined) {
            return {
              ...widget,
              value: message.temp, // Store the value in the widget's state
            };
          } 
          // ... other telemetry types
          return widget;
        });
        console.log("Updated widgets:", updatedWidgets);
        return updatedWidgets;
      });
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // ... handle connection close (e.g., attempt reconnection)
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // ... handle errors (e.g., display error message)
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
      <DashboardWidget key={widget.layout.i} deleteWidget={deleteWidget}>
        <p>{widget.telemetryType}: {widget.value} </p>
      </DashboardWidget>
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
