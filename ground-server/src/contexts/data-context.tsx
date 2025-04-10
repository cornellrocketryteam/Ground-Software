"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";

type DataContextType = {
  connected: boolean;
  data: Record<string, Record<string, Record<string, unknown>>>; // measurement -> field -> timestamp -> value: unknown
  sendHistoricalDataReq: (start: number, stop: number, field: string) => void;
  registerLiveDbField: (dbField: string) => void;
  deregisterLiveDbField: (dbField: string) => void;
};

const DataContext = createContext<DataContextType>({
  connected: false,
  data: {},
  sendHistoricalDataReq: () => {},
  registerLiveDbField: () => {},
  deregisterLiveDbField: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const liveDbFields = useRef<Set<string>>(new Set());
  const [data, setData] = useState<
    Record<string, Record<string, Record<string, unknown>>>
  >({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Connection function wrapped in useCallback to maintain a stable reference
  const connect = useCallback(() => {
    const url = "ws://192.168.1.200:8080/ws";
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
      // Attempt to reconnect after 1 second
      setTimeout(connect, 1000);
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received", message);

      if (message.historical) {
        if (message.data === null) {
          console.log("No data received from historical message");
          return;
        }

        // Update state with historical data
        setData((prevData) => {
          const { measurement, field } = message;
          const widgetData = message.data.reduce(
            (
              acc: Record<string, unknown>,
              item: { timestamp: string; value: number }
            ) => {
              acc[item.timestamp] = item.value;
              return acc;
            },
            {}
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
        // Update state with live data using the registered fields
        setData((prevData) => {
          const newData = { ...prevData };

          for (const measurement in message) {
            if (!newData[measurement]) {
              newData[measurement] = {};
            }

            // Iterate over the registered live fields
            for (const field of liveDbFields.current) {
              // Only update if the field exists in the current measurement data from the message
              if (field in message[measurement]) {
                if (!newData[measurement][field]) {
                  newData[measurement][field] = {};
                }

                const { timestamp, value } = message[measurement][field];
                newData[measurement][field][timestamp] = value;
              }
            }
          }
          return newData;
        });
      }
    };

    // Return cleanup function that closes the WebSocket connection on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  // Initialize the WebSocket connection on component mount
  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  // Memoize the historical data request function to avoid unnecessary re-renders
  const sendHistoricalDataReq = useCallback(
    (start: number, stop: number, field: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ start, stop, field }));
      } else {
        console.error(
          "WebSocket not connected. Cannot request historical data."
        );
      }
    },
    []
  );

  // Register a new database field for live updates
  const registerLiveDbField = useCallback((dbField: string) => {
    liveDbFields.current.add(dbField);
  }, []);

  // Deregister a database field from live updates
  const deregisterLiveDbField = useCallback((dbField: string) => {
    liveDbFields.current.delete(dbField);
  }, []);

  // Memoized context value to ensure stable consumers
  const contextValue = {
    connected,
    data,
    sendHistoricalDataReq,
    registerLiveDbField,
    deregisterLiveDbField,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}

// Hook to easily access the context
export function useData() {
  return useContext(DataContext);
}
