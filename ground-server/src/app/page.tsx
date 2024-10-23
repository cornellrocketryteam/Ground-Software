"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import React, { useState, useEffect, useRef } from "react";
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";

import { WidgetHandle } from "@/components/dashboard/widget-handle";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import TelemetryAdder from "@/components/telemetry-adder";

import { type Widget, type DataPoint } from "@/lib/definitions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Home() {
  const widgetsRef = useRef<Widget[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const widgetData = useRef<Record<string, DataPoint[]>>({});
  const wsRef = useRef<WebSocket | null>(null); // Store the WebSocket instance

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws"); // Replace with your WebSocket server URL

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      wsRef.current = ws; // Store the WebSocket instance
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const currentWidgets = widgetsRef.current;

      if (message.historical) { // Historical data
        console.log("Historical Message Received")
        console.log(`There are ${currentWidgets.length} widgets.`)

        currentWidgets.forEach(widget => {
          if (widget.channel.dbField === message.data[0].field) {
            console.log("Widget has matching field")
            widget.channel.data = []
            message.data.forEach((item: { field: string; timestamp: string; value: number; }) => {
              widget.channel.data.push({
                timestamp: new Date(item.timestamp),
                value: item.value,
              });
            });
          } else {
            console.log(`Fields did not match ${widget.channel.dbField} and ${message.data[0].field}`)
          }
        });
        setWidgets([...currentWidgets])

      } else { // Live data
        currentWidgets.forEach(widget => {
          const field = widget.channel.jsonField;
          if (field in message) {
            console.log('%s in message.', field)
            widget.channel.data.push({
              timestamp: new Date(),
              value: message[field],
            });
          } else if (field in message.rockTelem) {
            console.log('%s in message.rockTelem.', field)
            widget.channel.data.push({
              timestamp: new Date(),
              value: message.rockTelem[field],
            });
          } else if (field in message.rockTelem.accelTelem) {
            console.log('%s in message.rockTelem.accelTelem.', field)
            widget.channel.data.push({
              timestamp: new Date(),
              value: message.rockTelem.accelTelem[field],
            });
          } else if (field in message.rockTelem.events) {
            widget.channel.data.push({
              timestamp: new Date(),
              value: message.rockTelem.events[field],
            });
          } else if (field in message.rockTelem.gpsTelem) {
            widget.channel.data.push({
              timestamp: new Date(),
              value: message.rockTelem.gpsTelem[field],
            });
          } else if (field in message.rockTelem.imuTelem) {
            widget.channel.data.push({
              timestamp: new Date(),
              value: message.rockTelem.imuTelem[field],
            });
          } else if (field in message.rockTelem.metadata) {
            widget.channel.data.push({
              timestamp: new Date(),
              value: message.rockTelem.metadata[field],
            });
          } else {
            console.log('%s not in message.', field)
          }
        });
        setWidgets([...currentWidgets])
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
    const currentWidgets = widgetsRef.current;
    currentWidgets.forEach((widget) => {
      const updatedLayout = layout.find((l) => l.i === widget.layout.i);
      if (updatedLayout) {
        widget.layout = updatedLayout
      }
    })
    setWidgets(widgetsRef.current);
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
            console.error("WebSocket not connected. Cannot request historical data.");
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
    const deleteWidget = () => {
      widgetsRef.current = widgetsRef.current.filter((w) => w.layout.i !== widget.layout.i)
      setWidgets(widgetsRef.current)
    }

    return (
      <DashboardWidget
        key={widget.layout.i}
        widget={widget}
        data={widgetData.current[widget.id]}
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
        <TelemetryAdder setWidgets={setWidgets} widgetsRef={widgetsRef}></TelemetryAdder>
      </div>
    </div>
  );
}
