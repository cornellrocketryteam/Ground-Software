"use client";

import { useState, useEffect, useRef } from "react";

interface LiveValueWithHistoricalGraphProps {
  label: string;
  dbField: string;
  chartMode: "15m" | "60m";
}

export function LiveValueWithHistoricalGraph({
  label,
  dbField,
  chartMode,
}: LiveValueWithHistoricalGraphProps) {
  const [liveValue, setLiveValue] = useState<number | string>("--");
  const [chartData, setChartData] = useState<{ timestamp: Date; value: number }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const primaryUrl = "ws://localhost:8080/ws";
    const fallbackUrl = "ws://10.48.59.182:8080/ws";

    const connect = (url: string) => {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection opened:", url);

        // Request historical data based on the chartMode
        const timeRange = chartMode === "15m" ? -15 : -60;
        wsRef.current?.send(
          JSON.stringify({
            start: timeRange,
            stop: 0,
            field: dbField,
          })
        );
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
          console.error("WebSocket connection failed permanently.");
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
  }, [chartMode, dbField]);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.historical && message.field === dbField) {
          const historicalData = message.data.map((item: { timestamp: string; value: number }) => ({
            timestamp: new Date(item.timestamp),
            value: item.value,
          }));
          setChartData(historicalData);
        } else if (dbField in message) {
          setLiveValue(message[dbField]);
          setChartData((prev) => [
            ...prev,
            { timestamp: new Date(), value: message[dbField] },
          ]);
        } else {
          console.log(`Field ${dbField} not found in message.`);
        }
      };
    }
  }, [dbField]);

  const maxChartHeight = 100; // Height of the chart SVG

  // Generate SVG points
  const points = chartData.map((point, index) => ({
    x: index * 20, // Adjust spacing between points
    y: maxChartHeight - (point.value / 100) * maxChartHeight, // Scale value to fit SVG
  }));

  return (
    <div className="p-4 border dark:border-white rounded-lg shadow-md flex w-full max-w-2xl">
      {/* Chart */}
      <div className="flex-1">
        <svg
          viewBox={`0 0 ${points.length * 20 || 200} ${maxChartHeight}`}
          className="w-full h-32 border"
        >
          <polyline
            fill="none"
            stroke="rgba(75,192,192,1)"
            strokeWidth="2"
            points={points.map((point) => `${point.x},${point.y}`).join(" ")}
          />
        </svg>
      </div>
      {/* Live Value */}
      <div className="flex flex-col items-center justify-center ml-4 p-4 border-l dark:border-white">
        <h2 className="text-sm font-bold">{label}</h2>
        <p className="text-xl font-mono">{liveValue}</p>
      </div>
    </div>
  );
}
