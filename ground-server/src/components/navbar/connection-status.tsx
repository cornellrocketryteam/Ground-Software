"use client";

import { useState, useEffect } from "react";
import { useData } from "@/contexts/data-context";
import { isConnected } from "@/lib/grpcClient";

export default function ConnectionStatus() {
  const { connected: websocketProxyConnected } = useData();
  const [fillStationConnected, setFillStationConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await isConnected();
        setFillStationConnected(response);
        console.log("isConnected() result:", response);
      } catch (error) {
        setFillStationConnected(false);
        console.error("Error calling isConnected():", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <div
          className={`w-2 h-2 rounded ${
            websocketProxyConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <p className="text-sm">Websocket Proxy</p>
      </div>

      <div className="flex gap-2 items-center">
        <div
          className={`w-2 h-2 rounded ${
            fillStationConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <p className="text-sm">Fill Station</p>
      </div>
    </div>
  );
}
