"use client";

import { useState, useEffect, useRef } from "react";

interface LiveValueBoxProps {
  label: string;
  dbField: string;
}

export function LiveValueBox({ label, dbField }: LiveValueBoxProps) {
  const [value, setValue] = useState<number | string>("--");
  const wsRef = useRef<WebSocket | null>(null);

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
  }, []);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (dbField in message) {
          setValue(message[dbField]);
        } else {
          console.log(`Field ${dbField} not found in message.`);
        }
      };
    }
  }, [dbField]);

  return (
    <div className="p-4 border dark:border-white rounded-lg shadow-md w-full h-24 flex flex-col justify-center items-center">
      <h2 className="text-sm font-bold">{label}</h2>
      <p className="text-xl font-mono">{value}</p>
    </div>
  );
}
