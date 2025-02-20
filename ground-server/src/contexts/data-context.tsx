"use client";

import { DataPoint } from "@/lib/definitions";
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
  data: { [field: string]: DataPoint[] };
  sendHistoricalDataReq: (start: number, stop: number, field: string) => void
};

const DataContext = createContext<DataContextType>({
  connected: false,
  data: {},
  sendHistoricalDataReq() {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<{ [field: string]: DataPoint[] }>({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Create the WebSocket connection once on mount
  useEffect(() => {
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
          const field = message.field;
          const widgetData: DataPoint[] = message.data.map(
            (item: { timestamp: string; value: number }) => {
              return {
                timestamp: new Date(item.timestamp),
                value: item.value,
              };
            }
          );

          return {
            ...prevData,
            [field]: widgetData,
          }
        });
      } else {
        // Live data

        setData((prevData) => {
          const newData = {...prevData};
          for (const field in message) {
            newData[field] = [
              ...(newData[field] || []),
              {
                timestamp: new Date(),
                value: message[field],
              },
            ];
          }
          return newData;
        })
      }
    };

    // Clean up when component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const sendHistoricalDataReq = (start: number, stop: number, field: string) => {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          start,
          stop,
          field,
        })
      );
    } else {
      console.error(
        "WebSocket not connected. Cannot request historical data."
      );
    }
  }

  return (
    <DataContext.Provider value={{ connected,  data, sendHistoricalDataReq }}>
      {children}
    </DataContext.Provider>
  );
}

// Convenience hook to easily consume the WebSocket context anywhere
export function useData() {
  return useContext(DataContext);
}
