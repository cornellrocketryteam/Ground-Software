"use client";

import type { DataPoint } from "@/lib/definitions";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";

type DataContextType = {
  connected: boolean;
  data: Record<string, Record<string, DataPoint[]>>; // has type measurement -> field -> DataPoint[]
  sendHistoricalDataReq: (start: number, stop: number, field: string) => void;
};

const DataContext = createContext<DataContextType>({
  connected: false,
  data: {},
  sendHistoricalDataReq() {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Record<string, Record<string, DataPoint[]>>>(
    {},
  );
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Create the WebSocket connection once on mount
  const connect = () => {
    // Adjust your WebSocket URL as needed
    const url = "ws://192.168.1.200:8080/ws";

    // Create and store the WebSocket instance
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened:", url);
      setConnected(true);
    };

    wsRef.current.onclose = (event) => {
      console.log("WebSocket connection closed:", event.reason, event.code);
      setConnected(false);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
      wsRef.current?.close();
      setTimeout(connect, 1000);
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      if (message.historical) {
        // Historical data
        console.log("Historical Message Received");

        if (message.data === null) {
          console.log("No data received from historical message");
          return;
        }

        setData((prevData) => {
          const measurement = message.measurement;
          const field = message.field;
          const widgetData: DataPoint[] = message.data.map(
            (item: { timestamp: string; value: number }) => {
              return {
                timestamp: new Date(item.timestamp),
                value: item.value,
              };
            },
          );

          return {
            ...prevData,
            [measurement]: {
              ...prevData[measurement],
              [field]: widgetData,
            },
          };
        });
      } else {
        // Live data

        setData((prevData) => {
          const newData = { ...prevData };
          for (const measurement in message) {
            if (!(measurement in newData)) {
              newData[measurement] = {};
            }

            for (const field in message[measurement]) {
              newData[measurement][field] = [
                ...(newData[measurement][field] || []),
                message[measurement][field],
              ];
            }
          }
          return newData;
        });
      }
    };

    // Clean up when component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  };

  useEffect(connect, []);

  const sendHistoricalDataReq = (
    start: number,
    stop: number,
    field: string,
  ) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          start,
          stop,
          field,
        }),
      );
    } else {
      console.error("WebSocket not connected. Cannot request historical data.");
    }
  };

  return (
    <DataContext.Provider value={{ connected, data, sendHistoricalDataReq }}>
      {children}
    </DataContext.Provider>
  );
}

// Convenience hook to easily consume the WebSocket context anywhere
export function useData() {
  return useContext(DataContext);
}
